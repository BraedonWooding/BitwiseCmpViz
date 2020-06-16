import Operand from './operand';
import ListOfNumbersExpression from './list_expr';
import MultipleOperandsExpression from './multiple_ops';
import ExpressionOperand from './expr_operand';

export var ExpressionParser: any = {
  factories: [],
  canParse: function(string: string) {
    var i = this.factories.length-1;
    for(;i>=0;i--) {
      if(this.factories[i].canCreate(string) === true){
        return true;
      }
    }
    return false;
  },
  parse: function(string: string) {
    var i = 0, l = this.factories.length, factory;

    for(;i<l;i++) {
      factory = this.factories[i];

      if(factory.canCreate(string) == true){
        return factory.create(string);
      }
    }

    return null;
  },
  parseOperand: function(input: string) {
    return Operand.parse(input);
  },
  addFactory: function(factory: any) {
    this.factories.push(factory);
  }
};

// List of numbers
ExpressionParser.addFactory({
  regex: /^(-?(?:[f,F,0][b,x,B,X,o,O])?[a-f,0-9,\.,A-F]+\s*)+$/,
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
  fullRegex: /[\(,\),b,B,x,X,o,O,A-F,a-f,0-9,\.,\^,\&,\|,>>>,>>,<<,\+,-,~,\*,\%]+/,
  regex: /(<<|>>|>>>|\||\&|\^|\+|-(?!\s*)|\*|\%)?(~?-?(?:[b,x,o,a-f,0-9,\.,A-F]+))/g,
  canCreate: function(string: string) {
    return this.fullRegex.test(string);
  },
  create: function (string: string) {
    var m, operands = [];
    var normalizedString = this.normalizeString(string);

    while ((m = this.regex.exec(normalizedString)) != null) {
      operands.push(this.parseMatch(m, operands.length === 0));
    }

    return new MultipleOperandsExpression(normalizedString, operands)
  },
  parseMatch: function (m: string[], first: boolean) {
    var input = m[0],
        sign = m[1],
        num = m[2];
    if (input.includes('-') && !first) {
      input = input.replace('-', '');
      num = num.replace('-', '');
      sign = '-';
    }

    var op = null;
    if (num.indexOf('~') == 0) {
      op = new ExpressionOperand(input, Operand.parse(num.substring(1)), '~');
    } else {
      op = Operand.parse(num);
    }

    if (sign == null || first) {
      return op;
    } else {
      return new ExpressionOperand(input, op as Operand, sign);
    }
  },
  normalizeString: function (string: string) {
      return string.replace(/\s+/g,'');
  }
});

