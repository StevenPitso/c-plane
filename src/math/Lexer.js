/*


*/
export class LexerError extends Error {

  constructor(message, pos) {
    super(`${message} (at position ${pos})`);
    this.name = 'LexerError';
    this.pos = pos;
  }

}

const FUNCTIONS = new Set([
  'sin', 'cos', 'tan',
  'asin', 'acos', 'atan',
  'ln', 'log', 'sqrt', 'abs', 'exp'
]);

const CONSTANTS = new Set(['pi', 'e']);
const VARIABLES = new Set(['x']);

const OPERATORS = new Set(['+', '-', '*', '/', '^']);

export class Lexer {

  constructor(input) {
    this.input = String(input ?? '');
    this.pos = 0;
  }

  tokenize() {

    const tokens = [];

    while (this.pos < this.input.length) {

      const ch = this.input[this.pos];

      // Whitespace
      if (/\s/.test(ch)) {
        this.pos++;
        continue;
      }

      // ** back-compat with v1 — MUST come before generic '*' operator

      if (ch === '*' && this.input[this.pos + 1] === '*') {

        tokens.push({ type: 'OPERATOR', value: '^', pos: this.pos });
         this.pos += 2;

        continue;
      }

      // Numbers: 3, 3.14, .5, 2.5e-3
      if ((ch >= '0' && ch <= '9') || (ch === '.' && this._isDigit(this.input[this.pos + 1]))) {
        tokens.push(this._readNumber());
        continue;
      }

      // Identifiers: letters, then letters/digits/_
      if (/[a-zA-Z]/.test(ch)) {
        tokens.push(this._readIdentifier());
        continue;
      }

      // Operators (single-char)
      if (OPERATORS.has(ch)) {

         tokens.push({ type: 'OPERATOR', value: ch, pos: this.pos });

          this.pos++;
        continue;
      }

      // Parens
      if (ch === '(') {
        tokens.push({ type: 'LPAREN', value: '(', pos: this.pos++ });
        continue;
      }

      if (ch === ')') {
        tokens.push({ type: 'RPAREN', value: ')', pos: this.pos++ });
        continue;
      }

      // Comma
      if (ch === ',') {
        tokens.push({ type: 'COMMA', value: ',', pos: this.pos++ });
        continue;
      }

      throw new LexerError(`Unexpected character '${ch}'`, this.pos);

    }

    tokens.push({ type: 'EOF', value: null, pos: this.pos });
    return tokens;

  }

  _isDigit(ch) {
    return ch >= '0' && ch <= '9';
  }

  _readNumber() {

    const start = this.pos;
    let seenDot = false;
    let seenExp = false;

    while (this.pos < this.input.length) {

      const ch = this.input[this.pos];

      if (this._isDigit(ch)) { this.pos++; continue; }

      if (ch === '.' && !seenDot && !seenExp) {

        seenDot = true;
        this.pos++;

        continue;
      }

      // Scientific notation: 2.5e-3

      if ((ch === 'e' || ch === 'E') && !seenExp) {

        const next = this.input[this.pos + 1];
        const afterNext = this.input[this.pos + 2];

        // e must be followed by a digit or a +/- digit
        if (this._isDigit(next) || (   ( next === '+' || next ===  '-' ) && this._isDigit( afterNext ))) {

          seenExp = true;
          this.pos++;

          if (this.input[this.pos] === '+' || this.input[this.pos] === '-') this.pos++;
          continue;

        }

      }

      break;

    }

    const text = this.input.slice(start, this.pos);
    const value = Number(text);

    if (!Number.isFinite(value)) {
      throw new LexerError(`Invalid number '${text}'`, start);
    }

    return { type: 'NUMBER', value, pos: start };

  }

  _readIdentifier() {

    const start = this.pos;

    while (this.pos < this.input.length && /[a-zA-Z0-9_]/.test(this.input[this.pos])) {
      this.pos++;
    }

    const name = this.input.slice(start, this.pos);

    if (FUNCTIONS.has(name))  return { type: 'FUNCTION',  value: name, pos: start };
    if (CONSTANTS.has(name))  return { type: 'CONSTANT',  value: name, pos: start };
    if (VARIABLES.has(name))  return { type: 'VARIABLE',  value: name, pos: start };

    throw new LexerError(`Unknown identifier '${name}'`, start);

  }


}


export function tokenize(input) {
  return new Lexer(input).tokenize();
}


