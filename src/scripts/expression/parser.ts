import Operand from './operand';
import ListOfNumbersExpression from './list_expr';
import MultipleOperandsExpression from './multiple_ops';
import ExpressionOperand from './expr_operand';

export var ExpressionParser: any = {
  factories: [],
  canParse: function(string: string) {
    var trimmed = string.replace(/^\s+|\s+$/, '');
    var i = this.factories.length-1;
    for(;i>=0;i--) {
      if(this.factories[i].canCreate(trimmed) === true){
        return true;
      }
    }
    return false;
  },
  parse: function(string: string) {
    var trimmed = string.replace(/^\s+|\s+$/, '');
    var i = 0, l = this.factories.length, factory;

    for(;i<l;i++) {
      factory = this.factories[i];

      if(factory.canCreate(trimmed) == true){
        return factory.create(trimmed);
      }
    }

    return null;
  },
  parseOperand: function(input: string) {
    return Operand.parse(input);
  },
  createOperand: function(number: number, kind: string) {
    return Operand.create(number, kind);
  },
  addFactory: function(factory: any) {
    this.factories.push(factory);
  }
};

// List of numbers
ExpressionParser.addFactory({
  regex: /^(-?(?:\d+|0x[\d,a-f]+|0b[0-1]|0o[0-7]+)\s?)+$/,
  canCreate: function(string: string) {
    return this.regex.test(string);
  },
  create: function (string: string) {
    var matches = this.regex.exec(string);
    var numbers: any[] = [];
    var input = matches.input;

    input.split(' ').forEach(function(n: string) {
      if(n.trim().length > 0) {
        numbers.push(Operand.parse(n.trim()));
      }
    });

    return new ListOfNumbersExpression(input, numbers);
  }
});

// Multiple operands expression
ExpressionParser.addFactory({
  fullRegex: /^((<<|>>|>>>|\||\&|\^)?(~?-?([b,x,o,a-f,0-9]+)))+$/,
  regex: /(<<|>>|>>>|\||\&|\^)?(~?-?(?:[b,x,o,a-f,0-9]+))/g,
  canCreate: function(string: string) {
    return true;
  },
  create: function (string: string) {
    var m, operands = [];
    var normalizedString = this.normalizeString(string);

    while ((m = this.regex.exec(normalizedString)) != null) {
     operands.push(this.parseMatch(m));
    }

    return new MultipleOperandsExpression(normalizedString, operands)
  },
  parseMatch: function (m: string[]) {
    var input = m[0],
        sign = m[1],
        num = m[2];

    var op = null;
    if (num.indexOf('~') == 0) {
      op = new ExpressionOperand(input, Operand.parse(num.substring(1)), '~');
    } else {
      op = Operand.parse(num);
    }

    if (sign == null) {
      return op;
    } else {
      return new ExpressionOperand(input, op as Operand, sign);
    }
  },
  normalizeString: function (string: string) {
      return string.replace(/\s+/g,'');
  }
});

