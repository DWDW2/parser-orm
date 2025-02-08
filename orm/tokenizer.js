/**
 * Spec of the parser including all regex to parse 
 * 
 */

const Spec = [
  //--------------------------whitespace

  [/^\s+/, null], // Skip whitespace

  фва
  //--------------------------keywords

  [/^table/, "TABLE"], // "table" keyword
  [/^primary_key/, "PRIMARY_KEY"], // "primary_key" keyword
  [/^not_null/, "NOT_NULL"], // "not_null" keyword
  [/^unique/, "UNIQUE"], // "unique" keywodrd
  [/^default/, "DEFAULT"], // "default" keyword
  [/^current_timestamp/, "CURRENT_TIMESTAMP"], // "current_timestamp" keyword


  //--------------------------data types

  [/^serial/, "SERIAL"], // "serial" data type
  [/^varchar/, "VARCHAR"], // "varchar" data type
  [/^timestamp/, "TIMESTAMP"], // "timestamp" data type


  //--------------------------symbols

  [/^\{/, "LBRACE"], // Opening curly brace
  [/^\}/, "RBRACE"], // Closing curly brace
  [/^\(/, "LPAREN"], // Opening parenthesis
  [/^\)/, "RPAREN"], // Closing parenthesis
  [/^\[/, "LBRACKET"], // Opening square bracket
  [/^\]/, "RBRACKET"], // Closing square bracket
  [/^,/, "COMMA"], // Comma


  //--------------------------identifiers and numbers

  [/^[a-zA-Z_]\w*/, "IDENTIFIER"], // Identifiers (table/column names)
  [/^\d+/, "NUMBER"], // Numbers
  [/^"[^"]*"/, "STRING"], // String literals
];

class Tokenizer {
  init(string) {
    this._string = string;
    this._cursor = 0;
  }

  isEOF() {
    return this._cursor === this._string.length;
  }

  hasMoreTokens() {
    return this._cursor < this._string.length;
  }

  getNextToken() {
    if (!this.hasMoreTokens()) {
      return null;
    }

    const string = this._string.slice(this._cursor);
    for (const [regex, tokenType] of Spec) {
      const tokenValue = this._match(regex, string);
      console.log(`parsing ${regex} and ${tokenType} :`, tokenValue);
      if (tokenValue == null) {
        continue;
      }
      this._cursor += tokenValue.length;
      if (tokenType == null) {
        return this.getNextToken();
      }
      return {
        type: tokenType,
        value: tokenValue,
      };
    }

    throw new SyntaxError(`Unexpected token: '${string[0]}'`);
  }

  _match(regex, string) {
    const match = regex.exec(string);
    if (match == null) {
      return null;
    }
    return match[0];
  }
}

export { Tokenizer };
