<template>
  <div class="result">
    <div class="error">
      ¯\_(ツ)_/¯ Sorry, I don't know what <strong>{{text}}</strong> is
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
export default class UnknownView extends Vue {
  @Prop()
  command!: CommandResult;

  get text() {
    return this.command.input;
  }
}
</script>
