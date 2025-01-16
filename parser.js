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
      case "LBRACKET":
        return this.ArrayLiteral();
      default:
        throw new SyntaxError(`Unexpected token: ${this._lookahead.type}`);
    }
  }

  ArrayLiteral() {
    this._eat("LBRACKET"); // Expect the opening bracket
    const elements = [];

    while (this._lookahead.type !== "RBRACKET") {
      elements.push(this.Literal()); // Parse each element in the array
      if (this._lookahead.type === "COMMA") {
        this._eat("COMMA"); // Consume the comma between elements
      } else {
        break; // Break if no comma, assuming the array is ending
      }
    }

    this._eat("RBRACKET"); // Expect the closing bracket
    return {
      type: "ArrayLiteral",
      elements,
    };
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
    if (!token) {
      throw new SyntaxError(`Unexpected end of input, expected: ${tokenType}`);
    }
    if (token.type !== tokenType) {
      throw new SyntaxError(
        `Unexpected token: ${token.type} at line ${token.line}, column ${token.column}. Expected ${tokenType}`
      );
    }
    this._lookahead = this._tokenizer.getNextToken();
    return token;
  }
}

export { Parser };
