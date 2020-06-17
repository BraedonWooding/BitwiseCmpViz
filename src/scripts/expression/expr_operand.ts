import Operand from './operand';
import store from '@/store';

export default class ExpressionOperand {
  exprStr: string;
  operand: Operand;
  sign: string;
  isExpr: boolean;
  isShiftExpr: boolean;
  isUnaryExpr: boolean;

  constructor(exprStr: string, operand: Operand, sign: string) {
    this.exprStr = exprStr;
    this.operand = operand;
    this.sign = sign;
    this.isExpr = true;
    this.isShiftExpr = this.sign.indexOf('<') >= 0 || this.sign.indexOf('>')>= 0;
    this.isUnaryExpr = this.sign == '-' || this.sign == '~';
  }

  apply(operand?: Operand) {
    if (operand instanceof ExpressionOperand) {
      throw new Error('value shouldnt be expression'); 
    }

    var str = '';
    var isFloat = false;
    var inner_value = (this.operand.apply().value << store.state.intSize) >>> store.state.intSize;
    if(this.sign == '~' || this.sign == '-'){
      str = this.sign + ' ' + inner_value;
      isFloat = this.operand.isFloat;
    } else if (operand) {
      var sign = this.sign;
      // if they are forcing unsigned I don't want any weird arithmetic shifts.
      if (this.sign === ">>" && store.state.forceUnsigned) {
        sign = ">>>";
      }
    
      str = ((operand.value << store.state.intSize) >>> store.state.intSize) + sign + ' ' + inner_value;
      isFloat = operand.isFloat || this.operand.isFloat;
    } else {
      str = this.sign + ' ' + inner_value;
      isFloat = this.operand.isFloat;
    }

    var resultOp = Operand.create((eval(str) << store.state.intSize) >>> store.state.intSize, "dec", this.exprStr.includes('.') || isFloat);
    return resultOp;
  };

  toString() {
    return this.sign + this.operand.toString();
  }
}