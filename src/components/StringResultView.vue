<template>
  <span>
    <span class="byte" :key="i" v-for="(byte, i) in bytes">
      <span @click="flipBit(command.value, j + 8 * i)" :class="bit.cls" :key="(j + 8 * i)" v-for="(bit, j) in byte">{{bit.val.trim()}}</span>
    </span>
  </span>
</template>

<script lang="ts">
import store from '../store';
import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';
import {AnyOperand} from '../scripts/expression/any_operand';
import {CommandResult, ErrorResult, ExprResult, HelpResult, StringResult} from '../models/result';

@Component
export default class StringResultView extends Vue {
  @Prop()
  command!: StringResult;

  @Prop()
  canFlipBits!: boolean;

  @Prop()
  flipBit!: (str: string, bit: number) => void;

  @Prop()
  isFloat!: boolean;

  get bytes() {
    const bytes = [];
    const bits = this.bits();
    if (this.isFloat) {
      bytes.push(bits.splice(0, 1));
      bytes.push(bits.splice(0, 8));
      bytes.push(bits.splice(0, 23));
      return bytes;
    }

    if (!store.state.emphasiseBytes) return [bits];

    var key = 0;
    while (bits.length > 0) {
      bytes.push(bits.splice(0, 8))
    }

    return bytes;
  }

  bits() {
    const type = this.canFlipBits ? ' flipable ' : '';
    const cls: any = { '0': `zero ${type}`, '1': `one ${type}`};
    return this.command.value.split('').map((c, i) => { return {cls: cls[c], val: c}; });
  }
}
</script>
