<template>
  <div :class="getClasses">
    <div className="expressionInput-container">
      <span style="padding-top: 7px; padding-right; 20px; width: 25%;" class="indicator on">Made by Braedon Wooding, with heavy influence by http://bitwisecmd.com/</span>
      <input style="width: 100%;" class="expressionInput mono" v-model="input" @keydown.enter="submitInput" placeholder="type expression like '0o2 | 34 ^ 0xF &gt;&gt; 0b10' or 'help' or '1 200 3 10" type="text" />
      <div className="configPnl">
        <span @click="em" v-bind:class="{ 'indicator': true, 'on': emOn }" title="Toggle Emphasize Bytes">[Bytes]</span>
        <span @click="forceIntSizeToggle" v-bind:class="{ 'indicator': true, 'on': forceIntSize }" title="Force Int Size">[Force Int Size]</span>
        <span @click="forceUnsignedToggle" v-bind:class="{ 'indicator': true, 'on': forceUnsigned }" title="Force Int Size">[Force Unsigned]</span>
        <span @click="clear" class="indicator" title="Clear">[Clear]</span>
        <div style="display: flex; align-items: stretch;">
          <span style="padding-top: 7px; padding-right; 20px; width: 25%;" class="indicator on">Theme</span>
          <v-select style="width: 75%;" :value="theme" @input="updateTheme" :class="theme" :options="['Dark', 'Light', 'Midnight']"></v-select>
        </div>
        <div style="display: flex; align-items: stretch;">
          <span style="padding-top: 7px; padding-right; 20px; width: 25%;" class="indicator on">Int Size</span>
          <v-select style="width: 75%;" :value="intSize" @input="updateIntSize" :class="theme" :options="['8', '16', '32']"></v-select>
        </div>
      </div>
    </div>

    <div id="output">
      <ResultView :key="i" v-for="(result, i) in history" :command="result" ></ResultView>
    </div>
  </div>
</template>

<script lang="ts">
import 'vue-select/dist/vue-select.css';

import Vue from 'vue';
import store from '../store';
import {Component} from 'vue-property-decorator';
import ResultView from '../components/ResultView.vue';
import UnknownCommandResult, { CommandResult, ExprResult, ErrorResult, HelpResult } from '../models/result';
import {ExpressionParser} from '../scripts/expression/parser';
import ListOfNumbersExpression from '../scripts/expression/list_expr';

@Component({
  components: {
    ResultView
  }
})
export default class Main extends Vue {
  history: CommandResult[] = [];
  input: string = "";

  get getClasses() {
    return `app-root ${this.themeSimple}`;
  }

  addInput(input: string, forceText?: string, forceValue?: string) {
    // Replace all the '(' ')' with actual values by shifting those points
    var extra: {val: string, prev: string | undefined, next: string | undefined}[] = [];
    var newInput: string = input;
    try {
      var res = input;
      var prev: string | undefined = undefined;
      do {
        newInput = res;
        var nextBatch: {val: string, prev: string | undefined, next: string | undefined}[] = [];
        res = newInput.replace(/\([^()]*\)/, (match, capture) => {
          match = match.trim();
          if (match[0] == '(' && match[match.length - 1] == ')') {
            match = match.substr(1, match.length - 2);
          }
          if (/[^\d,~,-]/.test(match)) {
            nextBatch.unshift({val: match, prev: newInput, next: undefined});
          } else {
            return match;
          }
          var tryInput = input.trim();
          if (tryInput[0] == '(' && tryInput[tryInput.length - 1] == ')') {
            tryInput = tryInput.substr(1, tryInput.length - 2);
          }
          prev = newInput;
          return match != tryInput ? eval(match) : "";
        });
        if (nextBatch.length > 0) nextBatch[0].next = res;
        extra = nextBatch.concat(extra);
      } while (res != newInput);
    } catch (e) {
      this.history.unshift(new ErrorResult(input, e.toString()));
      console.error(e);
    }

    var expr = ExpressionParser.parse(newInput);
    if (!(expr instanceof ListOfNumbersExpression) && newInput.trim() != "") {
      this.history.unshift(new ExprResult((forceText || input), (forceValue || eval(input)), expr)); 
    } else {
      this.history.unshift(new ExprResult(input, null, expr));
    }

    extra.forEach((elem, i) => {
      console.log(newInput);
      this.addInput(elem.val, elem.prev, elem.next);
    });
  }

  submitInput(ev: any) {
    if (this.input.toLowerCase().trim() == "help") {
      this.history.unshift(new HelpResult(this.input));
    } else {
      try {
        if (ExpressionParser.canParse(this.input)) {
          this.addInput(this.input);
        } else {
          this.history.unshift(new UnknownCommandResult(this.input));
        }
      } catch (e) {
        this.history.unshift(new ErrorResult(this.input, e.toString()));
        console.error(e);
      }
    }
    this.$forceUpdate();
    this.input = "";
  }

  decodeHash(hashValue: string) {
      return decodeURI(hashValue).replace(/^\#/, '').replace(/,/g,' ');
  }

  em(ev: any) {
    store.commit('setEm', !this.emOn);
  }

  forceIntSizeToggle(ev: any) {
    store.commit('forceSize', !this.forceIntSize);
  }

  forceUnsignedToggle(ev: any) {
    store.commit('forceUnsigned', !this.forceUnsigned);
  }

  clear() {
    Vue.set(this, 'history', []);
    this.$forceUpdate();
  }

  mounted() {
    var opts = this.$route.query["cmd"];
    if (Array.isArray(opts)) {
      opts.forEach(opt => {
        if (opt) {
          this.input = this.decodeHash(opt);
          this.submitInput(null)
        }
      });
    } else if (opts) {
      this.input = this.decodeHash(opts);
      this.submitInput(null)
    }

    if (this.history.length == 0) {
      this.input = "help";
      this.submitInput(null);
    }

    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)')
          .addEventListener('change', event => {
          if (event.matches) {
            //dark mode
            store.commit('updateTheme', 'midnight');
          } else {
            //light mode
            store.commit('updateTheme', 'light');
          }
      })
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        store.commit('updateTheme', 'midnight');
      } else {
        store.commit('updateTheme', 'light');
      }
    } else {
      store.commit('updateTheme', 'midnight');
    }
  }

  updateTheme(theme: string) {
    store.commit('updateTheme', theme.toLowerCase());
  }

  get intSize() {
    return store.state.intSize + "";
  }

  updateIntSize(newVal: string) {
    store.commit('intSize', Number(newVal));
  }

  set intSize(newVal: string) {
    this.updateIntSize(newVal);
  }

  get forceIntSize() {
    return store.state.forceSize;
  }

  get forceUnsigned() {
    return store.state.forceUnsigned;
  }

  get emOn() {
    return store.state.emphasiseBytes;
  }

  get themeSimple() {
    return store.state.theme;
  }

  get theme() {
    return store.state.theme[0].toUpperCase() + store.state.theme.substr(1).toLowerCase();
  }

  set theme(newTheme: string) {
    this.updateTheme(newTheme);
  }
}
</script>