export class CommandResult {
  input: string;
  inputHash: string;

  constructor(input: string) {
    this.input = input;
    this.inputHash = this.encodeHash(input);
  }

  encodeHash (str: string) {
    return encodeURIComponent(str.trim().replace(/\s/g,','));
  }
}

export class ErrorResult extends CommandResult {
  error: string;

  constructor(input: string, error: string) {
    super(input);
    this.error = error;
  }
}

export class ExprResult extends CommandResult {
  expr: any;

  constructor(input: string, expr: any) {
    super(input);
    this.expr = expr;
  }
}

export class HelpResult extends CommandResult {
  constructor(input: string) {
    super(input);
  }
}

export class StringResult extends CommandResult {
  value: string;

  constructor(input: string, value: string) {
    super(input);
    this.value = value;
  }
}

export default class UnknownCommandResult extends CommandResult {
  message: string;

  constructor(input: string) {
    super(input);
    this.message = `Sorry, I don't know what ${input} is!`;
  }
}
