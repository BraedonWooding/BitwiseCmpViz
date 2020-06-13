<template>
  <div class="result">
    <div class="input mono">
      <span class="cur">&gt;</span>
      {{text}}
      <a className="hashLink" title="Link for this expression" :href="getHref">#</a>
    </div>
    <div class="content">
      <component :is="getResultComponent" :command="command" canFlipBits=true> </component>
    </div>
  </div>
</template>

<script lang="ts">
import store from '../store';
import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';
import {AnyOperand} from '../scripts/expression/any_operand';
import {CommandResult, ErrorResult, ExprResult, HelpResult, StringResult} from '../models/result';
import UnknownView from './UnknownView.vue';
import ErrorResultView from './ErrorResultView.vue';
import ExprResultView from './ExprResultView.vue';
import StringResultView from './StringResultView.vue';
import HelpResultView from './HelpResultView.vue';

@Component({
  components: {
    ErrorResultView,
    ExprResultView,
    HelpResultView,
    StringResultView,
    UnknownView
  }
})
export default class ResultView extends Vue {
  @Prop()
  command!: CommandResult;

  get getHref() {
    return window.location.pathname + '#?cmd=' + this.command.inputHash;
  }

  get text() {
    return this.command.input;
  }

  get getResultComponent() {
    if (this.command instanceof HelpResult) {
      return "HelpResultView";
    } else if (this.command instanceof ExprResult) {
      return "ExprResultView";
    } else if (this.command instanceof ErrorResult) {
      return "ErrorResultView";
    } else if (this.command instanceof StringResult) {
      return "StringResultView";
    } else {
      return "UnknownView";
    }
  }
}
</script>
