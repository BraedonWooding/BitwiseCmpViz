<template>
  <div class="result">
    <div class="error">
      (X_X) Ooops.. Something ain't right: <strong>{{err}}</strong>
    </div>
  </div>
</template>

<script lang="ts">
import store from '../store';
import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';
import {AnyOperand} from '../scripts/expression/any_operand';
import {CommandResult, ErrorResult, ExprResult, HelpResult, StringResult} from '../models/result';

@Component
export default class ErrorResultView extends Vue {
  @Prop()
  command!: ErrorResult;

  get err() {
    return this.command.error;
  }
}
</script>
