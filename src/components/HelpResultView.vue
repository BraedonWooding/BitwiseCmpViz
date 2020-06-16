<template>
 <div class="help helpResultTpl">
  <div style="overflow: hidden;">
      <div style="float: left, margin-right: 20px; margin-bottom: 40px;">
      <div class="section">
        <strong>Supported Commands</strong>
        <ul>
          <li><code><a @click="reload('0o2 | 34 ^ 0xF >> 0b10')" :href="getCommandLink('0o2 | 34 ^ 0xF >> 0b10')">0o2 | 34 ^ 0xF &gt;&gt; 0b10</a></code> — type bitwise expression to see result in binary</li>
          <li><code><a @click="reload('23 34')" :href="getCommandLink('23 24')" > 23 34</a></code> — type one or more numbers to see their binary representations</li>
          <li><code><a @click="reload('40 & (1 << 3)')" :href="getCommandLink('40 & (1 << 3)')" >40 &amp; (1 &lt;&lt; 3)</a></code> — Complex example!</li>
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
              <li><code style="font-size: ">|</code> — bitwise inclusive OR</li>
              <li><code>^</code> — bitwise exclusive XOR</li>
              <li><code>~</code> — bitwise NOT</li>
              <li><code>&lt;&lt;</code> — left shift</li>
              <li><code>&gt;&gt;</code> — sign propagating right shift (arithmetic for signed)</li>
              <li><code>&gt;&gt;&gt;</code> — zero-fill right shift</li>
              <li><code>+ - * / %</code> - math operators</li>
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
import router from '../router';

@Component
export default class UnknownView extends Vue {
  @Prop()
  command!: CommandResult;

  reload(text: string) {
    router.push('/?cmd=' + encodeURIComponent(text.trim().replace(/\s/g,',')));
  }

  getCommandLink(text: string) {
    return window.location.pathname + "#?cmd=" + encodeURIComponent(text.trim().replace(/\s/g,','));;
  }
}
</script>
