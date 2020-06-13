<template>
 <div class="help helpResultTpl">
    <div style="overflow: hidden">
      <div style="float: left, marginRight: 20px">
      <div class="section">
        <strong>Supported Commands</strong>
        <ul>
          <li><code><CommandLink text="23 | 34" /></code> — type bitwise expression to see result in binary</li>
          <li><code><CommandLink text="23 34" /></code> — type one or more numbers to see their binary representations</li>
          <li><code><CommandLink text="clear" /></code> — clear output</li>
          <li><code><CommandLink text="help" /></code> — display this help</li>
          <li><code><CommandLink text="about" /></code> — about the app</li>
        </ul>
      </div>
  </div>
  <div style="float: left">
      <div class="section">
          <strong>Supported Bitwise Operations</strong><br/>
          <small>
              <a href="https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators">
                  as implemented in JavaScript engine
              </a>
          </small>
          <ul>
              <li><code>&amp;</code> — bitwise AND</li>
              <li><code>|</code> — bitwise inclusive OR</li>
              <li><code>^</code> — bitwise exclusive XOR</li>
              <li><code>~</code> — bitwise NOT</li>
              <li><code>&lt;&lt;</code> — left shift</li>
              <li><code>&gt;&gt;</code> — sign propagating right shift (arithmetic for signed)</li>
              <li><code>&gt;&gt;&gt;</code> — zero-fill right shift</li>
          </ul>
      </div>
    </div>
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
}
</script>
