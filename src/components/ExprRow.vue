<template>
  <tr :class="type">
    <td class="sign">{{sign}}</td>
    <td class="label">{{label}}</td>
    <td class="bin">
      <StringResultView
        :command="getBinStr"
        :canFlipBits="canFlipBits"
        :flipBit="flipBit"
      >
      </StringResultView>
    </td>
    <td class="hex other">{{getHex}}</td>
    <td class="oct other">{{getOct}}</td>
  </tr>
</template>

<script lang="ts">
import store from '../store';
import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';
import {AnyOperand} from '../scripts/expression/any_operand';
import {CommandResult, ErrorResult, ExprResult, HelpResult, StringResult} from '../models/result';
import Operand from '../scripts/expression/operand';
import StringResultView from './StringResultView.vue';

@Component({
  components: {
    StringResultView
  }
})
export default class ExprRow extends Vue {
  @Prop()
  sign!: string;

  @Prop()
  type!: string;

  @Prop()
  op!: Operand;

  @Prop()
  maxBits!: number;

  @Prop()
  canFlipBits!: boolean;

  flipBit(str: string, i: number) {
    console.log(str, i);
    var arr = str.split('');
    arr[i] = arr[i] == '0' ? '1' : '0';
    var bin = arr.join('');
    console.log(bin, i);
    var newValue = parseInt(bin, 2);
    this.op.setValue(newValue);
  }

  padLeft(str: string, length: number, symbol?: string) {
    var sb = Array.prototype.slice.call(str);
    symbol = symbol || "0";

    if(length == null) {
        return str;
    }

    while(length > sb.length) {
        sb.unshift(symbol);
    }

    return sb.join('');
  }

  get getBinStr() {
    return new StringResult("", this.padLeft(this.op.apply().toBinaryString(), this.maxBits, '0'));
  }

  get label() {
    return this.op.isExpr
      ? this.op.toString()
      : this.op.toString(this.op.kind === 'bin' ? 'dec' : this.op.kind);
  }

  get getHex() {
    return this.op.isExpr ? this.op.toString() : this.op.toString("hex");
  }

  get getOct() {
    return this.op.isExpr ? this.op.toString() : this.op.toString("oct");
  }
}
</script>
