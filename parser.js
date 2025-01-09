import { Tokenizer } from "./tokenizer.js";

class Parser {
  constructor() {
    this._stirng = "";
    this._tokenizer = new Tokenizer();
  }

  parse(string) {
    this._stirng = string;
    this._tokenizer.init(string);
    this._lookahead = this._tokenizer.getNextToken();
    return this.Program();
  }

  Program() {
    return {
      type: "Program",
      body: this.Literal(),
    };
  }

  Literal() {
    switch (this._lookahead.type) {
      case "NUMBER":
        return this.NumericLiteral();
      case "STRING":
        return this.StringLiteral();
    }
  }

  StringLiteral() {
    const token = this._eat("STRING");
    return {
      type: "StringLiteral",
      value: token.value.slice(1, -1),
    };
  }

  NumericLiteral() {
    const token = this._eat("NUMBER");
    return {
      type: "NumericLiteral",
      value: Number(token.value),
    };
  }

  _eat(tokenType) {
    const token = this._lookahead;
    if (token == null) {
      throw new SyntaxError(`Unexpected end of input, expected:${tokenType}`);
    }
    if (token.type !== tokenType) {
      throw new SyntaxError(
        `Unexpected token: ${token.type}, expected ${tokenType}`
      );
    }

    // go to the next token in the  suntax
    this._lookahead = this._tokenizer.getNextToken();

    return token;
  }
}

export { Parser };
