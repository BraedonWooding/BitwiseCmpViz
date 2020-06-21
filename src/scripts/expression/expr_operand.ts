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
    var convertedToBin = false;
  
    var inner_value = this.operand.apply().value;
    isFloat = this.operand.isFloat;

    if (this.operand.isFloat && ['&', '|', '^', '~'].includes(this.sign)) {
      var view = new DataView(new ArrayBuffer(4));
      view.setFloat32(0, inner_value);
      inner_value = view.getUint32(0)
      isFloat = false;
      convertedToBin = true;
    }
    if (!isFloat) {
      inner_value = (inner_value << store.state.intSize) >>> store.state.intSize;
    }

    if(this.sign == '~' || this.sign == '-'){
      str = this.sign + ' ' + inner_value;
    } else if (operand) {
      var sign = this.sign;
      // if they are forcing unsigned I don't want any weird arithmetic shifts.
      if (this.sign === ">>" && store.state.forceUnsigned) {
        sign = ">>>";
      }

      var value = operand.value;
      var operandIsFloat = operand.isFloat;
      if (operand.isFloat && ['&', '|', '^', '~'].includes(sign)) {
        var view = new DataView(new ArrayBuffer(4));
        view.setFloat32(0, value);
        value = view.getUint32(0)
        operandIsFloat = false;
        convertedToBin = true;
      }
      if (!operandIsFloat) {
        value = (value << store.state.intSize) >>> store.state.intSize;
      } else {
        isFloat = true;
      }
    
      str = value + sign + ' ' + inner_value;
    } else {
      str = this.sign + ' ' + inner_value;
    }

    var result = eval(str);
    if (convertedToBin) {
      var view = new DataView(new ArrayBuffer(4));
      view.setUint32(0, result);
      value = view.getFloat32(0);
      isFloat = true;
    }
    if (!isFloat) {
      result = (result << store.state.intSize) >>> store.state.intSize;
    }

    var resultOp = Operand.create(result, "dec", this.exprStr.includes('.') || isFloat);
    return resultOp;
  };

  toString() {
    return this.sign + this.operand.toString();
  }
}