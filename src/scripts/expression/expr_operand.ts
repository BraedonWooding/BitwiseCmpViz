import Operand from './operand';

export default class ExpressionOperand {
  exprStr: string;
  operand: Operand;
  sign: string;
  isExpr: boolean;
  isShiftExpr: boolean;
  isNotExpr: boolean;

  constructor(exprStr: string, operand: Operand, sign: string) {
    this.exprStr = exprStr;
    this.operand = operand;
    this.sign = sign;
    this.isExpr = true;
    this.isShiftExpr = this.sign.indexOf('<') >= 0 || this.sign.indexOf('>')>= 0;
    this.isNotExpr = this.sign == '~';
  }

  apply(operand?: Operand) {
    if (operand instanceof ExpressionOperand) {
      throw new Error('value shouldnt be expression'); 
    }

    var str = '';
    if(this.sign == '~'){
      str = '~' + this.operand.apply().value;
    } else if (operand) {
      str = operand.value + this.sign + this.operand.apply().value;
    }

    var resultOp = Operand.create(eval(str), this.operand.kind || "dec");
    return resultOp;
  };

  toString() {
    return this.sign + this.operand.toString();
  }
}