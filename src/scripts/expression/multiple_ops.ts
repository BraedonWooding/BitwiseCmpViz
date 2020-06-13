import Operand from './operand';
import ExpressionOperand from './expr_operand';

export default class MultipleOperandsExpression {
  exprStr: string;
  expressions: (Operand | ExpressionOperand)[];

  constructor(exprStr: string, expressions: (Operand | ExpressionOperand)[]) {
      this.exprStr = exprStr;
      this.expressions = expressions;
  }
}