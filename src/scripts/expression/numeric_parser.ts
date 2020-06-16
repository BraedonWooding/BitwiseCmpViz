export const decRegex = /^-?[\d,\.]+$/;
export const hexRegex = /^-?0[x,X][0-9,a-f,A-F]+$/i;
export const octRegex = /^-?0[o,O][0-7]+$/i;
export const binRegex = /^-?0[b,B][0-1]+$/i;
export const opRegex = /^<<|>>|<<<|\&|\|\^|~$/;
export const floatHexParser = /^-?[f,F][x,X][0-9,a-f,A-F]+$/i;
export const floatOctParser = /^-?[f,F][o,O][0-7]+$/i;
export const floatBinParser = /^-?[f,F][b,B][0-1]+$/i;

export interface ParseOption {
  regex: RegExp;
  radix: number;
  kind: string;
  prefix: string | RegExp;
  isFloat?: boolean;
}

export var parsers: ParseOption[] = [
  { regex: decRegex, radix: 10, kind: 'dec', prefix: '^$' },
  { regex: hexRegex, radix: 16, kind: 'hex', prefix:/0[x,X]/i },
  { regex: binRegex, radix: 2, kind: 'bin', prefix:/0[b,B]/i },
  { regex: octRegex, radix: 8, kind: 'oct', prefix:/0[o,O]/i },
  { regex: floatHexParser, radix: 16, kind: 'hex', prefix:/[f,F][x,X]/i, isFloat: true },
  { regex: floatOctParser, radix: 8, kind: 'oct', prefix:/[f,F][o,O]/i, isFloat: true },
  { regex: floatBinParser, radix: 2, kind: 'bin', prefix:/[f,F][b,B]/i, isFloat: true },
];

export interface ParseResult {
  value: number;
  kind: string;
  input: string;
  isFloat: boolean;
}

export class NumericParser {
  private applyParser(option: ParseOption, rawInput: string): ParseResult | null {
    if(!option.regex.test(rawInput)) {
      return null;
    }

    var value;
    if (option.radix === 10) {
      value = parseFloat(rawInput.replace(option.prefix, '').toLowerCase());
    } else {
      value = parseInt(rawInput.replace(option.prefix, '').toLowerCase(), option.radix);
    }

    if (option.isFloat === true) {
      var view = new DataView(new ArrayBuffer(4));
      view.setInt32(0, value);
      value = view.getFloat32(0);
    }

    return {
      value: value,
      kind: option.kind,
      input: rawInput,
      isFloat: rawInput.includes('.') || option.isFloat === true
    }
  }

  public parse(input: string): ParseResult |  null {
    return parsers.map(p => this.applyParser(p, input)).reduce((c, n) => c || n);
  }

  public parseOperator(input: string) {
    // NOTE: Originally this was input.match(input) which makes 0 fucking sense
    var m = input.match(opRegex);
    if(!m || m.length == 0) {
      return null;
    }

    return m[0];
  }
}
