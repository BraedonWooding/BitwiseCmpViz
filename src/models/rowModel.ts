import store from '@/store';
import Operand from '@/scripts/expression/operand';
import ExpressionOperand from '@/scripts/expression/expr_operand';
import ListOfNumbersExpression from '@/scripts/expression/list_expr';
import MultipleOperandsExpression from '@/scripts/expression/multiple_ops';

export interface RowItem {
  sign: string;
  type: string;
  op: Operand;
  canFlipBits: boolean;
} 

export class RowModel {
  maxBits: number = 0;
  items: RowItem[] = [];

  public addOperand(op: Operand) {
    this.maxBits = Math.max(this.maxBits, op.getLengthInBits());
    this.items.push({
      sign: '',
      type: '',
      op: op,
      canFlipBits: true,
    });
  }

  public static getLabel(op: Operand) {
    return op.kind === 'bin' ? op.toDecimalString() : op.toString();
  }

  public addExpr(expr: ExpressionOperand) {
    this.maxBits = Math.max(this.maxBits, expr.operand.apply().getLengthInBits());
    this.items.push({
      sign: expr.sign,
      type: RowModel.getLabel(expr.operand),
      op: expr.operand,
      canFlipBits: true,
    });
  }

  public addShiftExprResult(expr: ExpressionOperand, resultOp: Operand) {
    this.maxBits = Math.max(this.maxBits, resultOp.apply().getLengthInBits());
    this.items.push({
      sign: "(" + expr.sign + " " + expr.operand.toString() + ")",
      type: 'expression-result',
      op: resultOp,
      canFlipBits: false
    });
  }

  public addExprResult(op: Operand) {
    this.maxBits = Math.max(this.maxBits, op.getLengthInBits());
    this.items.push({
      sign: '=',
      type: 'expression-result',
      op: op,
      canFlipBits: false
    });
  }

  public static buildListOfNumbers(expr: ListOfNumbersExpression): RowModel {
    var model = new RowModel();
    expr.numbers.forEach(x => model.addOperand(x));
    model.maxBits = RowModel.getNumberOfBits(model.maxBits);
    return model;
  }

  public static buildMultiple(expr: MultipleOperandsExpression): RowModel {
    var model = new RowModel();
    var op = expr.expressions[0];
    var i = 0, len = expr.expressions.length;
    var prev = null;
    for (; i < len; i++) {
      var cur = expr.expressions[i];
      if (cur instanceof Operand) {
        model.addOperand(cur);
        prev = cur;
      } else if (cur instanceof ExpressionOperand && cur.isUnaryExpr) {
        model.addExpr(cur);
        var not = cur.apply();
        model.addExprResult(not);
        prev = not;
      } else if (cur instanceof ExpressionOperand && cur.isShiftExpr) {
        prev = cur.apply(prev!);
        model.addShiftExprResult(cur, prev);
      } else {
        model.addExpr(cur);
        prev = cur.apply(prev!);
        model.addExprResult(prev);
      }
    }

    model.maxBits = this.getNumberOfBits(model.maxBits);
    return model;
  }

  public static getNumberOfBits(bits: number) {
    if (store.state.emphasiseBytes && bits % 8 != 0) {
      return bits < 8 ? 8 : bits - (bits % 8) + 8;
    } else {
      return bits;
    }
  }
}