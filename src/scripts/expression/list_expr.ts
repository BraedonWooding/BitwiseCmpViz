import Operand from './operand';

export default class ListOfNumbersExpression {
  exprStr: string;
  numbers: Operand[];
  maxBitsLength: number;

  constructor(exprStr: string, numbers: Operand[]) {
      this.exprStr = exprStr;
      this.numbers = numbers;
      this.maxBitsLength = numbers.map(n => n.lenInBits).reduce((n , c) => n >= c ? n : c, 0);
  }

  toString() {
      return this.numbers.map(n => n.value.toString()).join(' ');
  }
}