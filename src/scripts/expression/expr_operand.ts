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
    var isFloat = false;
    if(this.sign == '~'){
      str = '~' + this.operand.apply().value;
      isFloat = this.operand.isFloat;
    } else if (operand) {
      str = operand.value + this.sign + this.operand.apply().value;
      isFloat = operand.isFloat || this.operand.isFloat;
    } else {
      str = "" + this.operand.apply().value;
      isFloat = this.operand.isFloat;
    }

    var resultOp = Operand.create(eval(str), this.operand.kind || "dec", this.exprStr.includes('.') || isFloat);
    return resultOp;
  };

  toString() {
    return this.sign + this.operand.toString();
  }
}