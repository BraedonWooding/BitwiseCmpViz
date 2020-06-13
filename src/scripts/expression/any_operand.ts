import MultipleOperandsExpression from './multiple_ops';
import Operand from './operand';
import ExpressionOperand from './expr_operand';
import ListOfNumbersExpression from './list_expr';

export type AnyOperand = MultipleOperandsExpression | Operand | ExpressionOperand | ListOfNumbersExpression;