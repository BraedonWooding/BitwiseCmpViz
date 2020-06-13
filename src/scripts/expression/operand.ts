import { NumericParser, ParseResult } from './numeric_parser';
import ExpressionError from './error';
import store from '@/store';

var __id = 1;

export function getBase(kind: string): number | null {
  switch (kind){
    case 'bin': return 2;
    case 'hex': return 16;
    case 'dec': return 10;
    case 'oct': return 8;
    default: return null;
  }
};

export function toHexString (hex: string) {
  return hex.indexOf('-') == 0 ? '-0x' + hex.substr(1) : '0x' + hex;
}

export function numToHex(num: number): string {
  var hexVal = Math.abs(num).toString(16);
  return num >= 0 ? '0x' + hexVal : '-0x' + hexVal;
}

export function numToOct(num: number): string {
  var hexVal = Math.abs(num).toString(8);
  return num >= 0 ? '0o' + hexVal : '-0o' + hexVal;
}

export function numToBin(num: number): string {
  return (num < 0 ? num + (2 ** store.state.intSize) : num).toString(2);
}

export function numToDec(num: number): string {
  return num.toString(10);
}

export function toKindString(value: number, kind: string) {
  switch(kind) {
    case 'hex':
      return numToHex(value);
    case 'bin':
      return numToBin(value);
    case 'dec':
      return numToDec(value);
    case 'oct':
      return numToOct(value);
    default:
    throw new Error("Unexpected kind: " + kind)
  }
}

// Represents numeric value
export default class Operand {
  id: number;
  value: number;
  kind: string | null;
  lenInBits: number;
  isExpr: boolean;

  constructor(res: ParseResult) {
    this.id = __id++;
    this.value = res.value;
    this.kind = res.kind;
    this.lenInBits = this.getLengthInBits();
    this.isExpr = false;
  }

  getLengthInBits(): number {
    if (store.state.forceSize || this.value < 0) {
      return store.state.intSize;
    }

    return Math.floor(Math.log(this.value) / Math.log(2)) + 1;
  }

  getOtherKind(kind?: string) {
    switch(kind || this.kind) {
      case 'dec': 
      case 'bin':
        return 'hex';
      case 'oct':
      case 'hex':
        return 'dec';
      default:
        throw new Error(kind + " kind doesn't have opposite kind")
    }
  }

  toString(kind?: string | null) {
    var value = this.value;
    if (store.state.forceUnsigned && value < 0) {
      value += (2 ** store.state.intSize);
    }

    return toKindString(value, kind || this.kind || '');
  }

  toOtherKindString() {
    return this.toString(this.getOtherKind());
  }

  toDecimalString() {
    return this.toString('dec');
  }

  toHexString() {
    return this.toString('hex');
  }

  toBinaryString() {
    return this.toString('bin');
  }

  toOctalString() {
    return this.toString('oct');
  }

  setValue(value: number) {
    this.value = value;
  }

  apply() {
    return this;
  }

  static create(value: number, kind: string) {
    return new Operand({
      value: value,
      kind: kind,
      input: toKindString(value, kind),
    });
  }

  static parse(input: string) {
    var parsed = new NumericParser().parse(input);
    if(!parsed) {
      throw new ExpressionError(input + " is not a valid number");
    }

    return new Operand(parsed);
  }
}
