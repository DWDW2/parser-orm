/**
 * Tokenizer spec.
 * Here it will be matching regex
 * and will execute it based on matching
 *
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
  /**
   * here i need to impement getNextToken fumction
   */

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
      const tokenValue = this._match(regex, string);
      if (tokenValue == null) {
        continue;
      }
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
