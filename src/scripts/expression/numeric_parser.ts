export const decRegex = /^-?\d+$/;
export const hexRegex = /^-?0x[0-9,a-f,A-F]+$/i;
export const octRegex = /^-?0o[0-7]+$/i;
export const binRegex = /^-?0b[0-1]+$/i;
export const opRegex = /^<<|>>|<<<|\&|\|\^|~$/;

export interface ParseOption {
  regex: RegExp;
  radix: number;
  kind: string;
  prefix: string | RegExp;
}

export var parsers: ParseOption[] = [
  { regex: decRegex, radix: 10, kind: 'dec', prefix: '^$' },
  { regex: hexRegex, radix: 16, kind: 'hex', prefix:/0x/i },
  { regex: binRegex, radix: 2, kind: 'bin', prefix:/0b/i },
  { regex: octRegex, radix: 8, kind: 'oct', prefix:/0o/i }];

export interface ParseResult {
  value: number;
  kind: string;
  input: string;
}

export class NumericParser {
  private applyParser(option: ParseOption, rawInput: string): ParseResult | null {
    if(!option.regex.test(rawInput)) {
      return null;
    }
  
    var value = parseInt(rawInput.replace(option.prefix, ''), option.radix);
  
    return {
      value: value,
      kind: option.kind,
      input: rawInput
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
