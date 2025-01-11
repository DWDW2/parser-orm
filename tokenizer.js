/**
 * Tokenizer spec.
 * Here it will be matching regex
 * and will execute it based on matching
 *
 */

const Spec = [
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
      return {
        type: tokenType,
        value: tokenValue,
      };
    }

    throw new SyntaxError(`Unexpected token at: "${string[0]}"`);
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
