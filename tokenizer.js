/**
 * Tokenizer spec.
 * It defines the regular expressions that will be parsed using this parser
 */

const Spec = [
  //--------------------------null
  [/^\s+/, null],
  //--------------------------numbers
  [/^\d+/, "NUMBER"],
  //--------------------------strings
  [/^"[^"]*"/, "STRING"],
  [/^'[^']*'/, "STRING"],
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
    //Generic tokenizer impementation
    for (const [regex, tokenType] of Spec) {
      console.log(`Trying regex: ${regex} on string: ${string}`);
      const tokenValue = this._match(regex, string);
      if (tokenValue == null) {
        continue;
      }
      this._cursor += tokenValue.length;
      // Skip tokens that should be ignored (e.g., whitespace)
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
    const match = new RegExp(regex).exec(string);
    if (match == null) {
      return null;
    }
    return match[0];
  }
}

export { Tokenizer };
