<template>
  <table class="expression">
    <tbody>
      <ExprRow
        :canFlipBits="row.data.canFlipBits" :op="row.data.op"
        :sign="row.data.sign" :type="row.data.type" :maxBits="row.maxBits"
        :key="i" v-for="(row, i) in rows"></ExprRow>
    </tbody>
  </table>
</template>

<script lang="ts">
import store from '../store';
import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';
import {AnyOperand} from '../scripts/expression/any_operand';
import {CommandResult, ErrorResult, ExprResult, HelpResult, StringResult} from '../models/result';
import ListOfNumbersExpression from '../scripts/expression/list_expr';
import {RowModel} from '../models/rowModel';
import MultipleOperandsExpression from '../scripts/expression/multiple_ops';
import ExprRow from './ExprRow.vue';

@Component({
  components: {
    ExprRow
  }
})
export default class ExprResultView extends Vue {
  @Prop()
  command!: ExprResult;

  get rows() {
    var expr = this.command.expr;
    var model: RowModel;
    if (expr instanceof ListOfNumbersExpression) {
      model = RowModel.buildListOfNumbers(expr);
    } else if (expr instanceof MultipleOperandsExpression) {
      model = RowModel.buildMultiple(expr);
    } else {
      return [];
    }

    return model.items.map((item, i) => {
      return {
        data: item,
        maxBits: model.maxBits
      };
    })
  }
}
</script>
