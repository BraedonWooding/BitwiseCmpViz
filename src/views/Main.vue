<template>
  <div :class="getClasses">
    <div className="expressionInput-container">
      <input style="width: 100%;" class="expressionInput mono" v-model="input" @keydown.enter="submitInput" placeholder="type expression like '1 >> 2 | 3' or 'help' or '1 200 3 10" type="text" />
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
import UnknownCommandResult, { CommandResult, ExprResult } from '../models/result';
import {ExpressionParser} from '../scripts/expression/parser';

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

  submitInput(ev: any) {
    if (ExpressionParser.canParse(this.input)) {
      var expr = ExpressionParser.parse(this.input);
      this.history.unshift(new ExprResult(this.input, expr));
    } else {
      this.history.unshift(new UnknownCommandResult(this.input));
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

    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)')
          .addEventListener('change', event => {
          if (event.matches) {
            //dark mode
            store.commit('updateTheme', 'dark');
          } else {
            //light mode
            store.commit('updateTheme', 'light');
          }
      })
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        store.commit('updateTheme', 'dark');
      } else {
        store.commit('updateTheme', 'light');
      }
    } else {
      store.commit('updateTheme', 'dark');
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