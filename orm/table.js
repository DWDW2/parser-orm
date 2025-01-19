import { Parser } from "../parser";
import { Tokenizer } from "../tokenizer";

class ParserTable extends Parser {
  constructor() {
    this._string = "";
    this._tokenizer = new Tokenizer();
  }

  parse(string) {
    this._string = string;
    this._tokenizer.init(string);
    this._lookahead = this._tokenizer.getNextToken();
    return this.Program();
  }

  Program() {
    return {
      type: "Program",
      body: this.TableLiteral(), // Entry point for parsing
    };
  }

  TableLiteral() {
    this._eat("TABLE"); // Expect "table"
    const tableName = this._eat("IDENTIFIER").value; // Expect table name
    this._eat("LBRACE"); // Expect "{"

    const columns = [];
    while (this._lookahead.type !== "RBRACE") {
      columns.push(this.ColumnDefinition()); // Parse each column definition
      if (this._lookahead.type === "COMMA") {
        this._eat("COMMA"); // Consume the comma between columns
      } else {
        break;
      }
    }

    this._eat("RBRACE"); // Expect "}"

    return {
      type: "TableLiteral",
      name: tableName,
      columns,
    };
  }

  ColumnDefinition() {
    const columnName = this._eat("IDENTIFIER").value; // Column name
    const dataType = this.DataType(); // Data type

    const constraints = [];
    while (
      this._lookahead.type === "PRIMARY_KEY" ||
      this._lookahead.type === "NOT_NULL" ||
      this._lookahead.type === "UNIQUE" ||
      this._lookahead.type === "DEFAULT"
    ) {
      constraints.push(this.Constraint()); // Parse constraints
    }

    return {
      type: "ColumnDefinition",
      name: columnName,
      dataType,
      constraints,
    };
  }

  DataType() {
    switch (this._lookahead.type) {
      case "SERIAL":
        return this._eat("SERIAL").value;
      case "VARCHAR":
        return this.VarcharType();
      case "TIMESTAMP":
        return this._eat("TIMESTAMP").value;
      default:
        throw new SyntaxError(
          `Unexpected token: ${this._lookahead.type}, expected a data type`
        );
    }
  }

  VarcharType() {
    const baseType = this._eat("VARCHAR").value;
    this._eat("LPAREN"); // Expect "("
    const size = this._eat("NUMBER").value; // Size of varchar
    this._eat("RPAREN"); // Expect ")"
    return `${baseType}(${size})`;
  }

  Constraint() {
    switch (this._lookahead.type) {
      case "PRIMARY_KEY":
        return { type: "PrimaryKey", value: this._eat("PRIMARY_KEY").value };
      case "NOT_NULL":
        return { type: "NotNull", value: this._eat("NOT_NULL").value };
      case "UNIQUE":
        return { type: "Unique", value: this._eat("UNIQUE").value };
      case "DEFAULT":
        return this.DefaultConstraint();
      default:
        throw new SyntaxError(`Unexpected token: ${this._lookahead.type}`);
    }
  }

  DefaultConstraint() {
    this._eat("DEFAULT"); // Expect "default"
    const defaultValue = this.Literal(); // Expect a literal value
    return {
      type: "Default",
      value: defaultValue,
    };
  }

  Literal() {
    switch (this._lookahead.type) {
      case "NUMBER":
        return this.NumericLiteral();
      case "STRING":
        return this.StringLiteral();
      default:
        throw new SyntaxError(`Unexpected token: ${this._lookahead.type}`);
    }
  }

  StringLiteral() {
    const token = this._eat("STRING");
    return {
      type: "StringLiteral",
      value: token.value.slice(1, -1), // Remove surrounding quotes
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
        `Unexpected token: ${token.type}, expected ${tokenType}`
      );
    }
    this._lookahead = this._tokenizer.getNextToken();
    return token;
  }
}

export { ParserTable };
