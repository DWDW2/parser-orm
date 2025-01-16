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
  //--------------------------array brackets
  [/^\[/, "LBRACKET"], // Left bracket
  [/^\]/, "RBRACKET"], // Right bracket
  //--------------------------comma separator
  [/^,/, "COMMA"],
];

class Tokenizer {
  init(string) {
    this._string = string;
    this._cursor = 0;
    this._line = 1;
    this._column = 1;
  }

  _match(regex, string) {
    const match = regex.exec(string);
    if (match) {
      const matchedString = match[0];
      const newLines = matchedString.split("\n").length - 1;
      this._line += newLines;
      if (newLines) {
        this._column = matchedString.length - matchedString.lastIndexOf("\n");
      } else {
        this._column += matchedString.length;
      }
    }
    return match ? match[0] : null;
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
}

export { Tokenizer };
