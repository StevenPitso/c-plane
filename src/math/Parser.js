
// src/math/Parser.js - precedence-climbing (Pratt-style) parser.
// Produces an AST consumable by Evaluator.js.

import { Node } from './AST.js';

export class ParserError extends Error {

  constructor(message, pos) {

    super(`${message} (at position ${pos})`);
    this.name = 'ParserError';
    this.pos = pos;

  }

}

// Binding powers. Higher = binds tighter.
// ^  is right-associative -> we give it (LB, RB) with LB < RB.
// * / are left-associative -> LB > RB.
// + - are left-associative -> LB > RB.
const BP = {
  '+': [10, 11],
  '-': [10, 11],
  '*': [20, 21],
  '/': [20, 21],
  '^': [30, 29],   // right-assoc: right side binds less tightly
};

export class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.pos = 0;
  }

  //  token helpers 
  peek()    { return this.tokens[this.pos] ;   }
  advance() { return this.tokens[this.pos++]; }

  expect(type, value = null) {

    const tok = this.peek();

    if (tok.type !== type || (value !== null && tok.value !== value)) {

      throw new ParserError(
        `Expected ${type}${value !== null ? ` '${value}'` : ''} but got ${this._describe(tok)}`,

        tok.pos

      );

    }

    return this.advance();

  }

  _describe(tok) {
    if (tok.type === 'EOF') return 'end of input';
    return `${tok.type} '${tok.value}'`;
  }

  //  entry point 
  parse() {

    if (this.peek().type === 'EOF') {
      throw new ParserError('Unexpected end of input', this.peek().pos);
    }

    const expr = this.parseExpression(0);

    if (this.peek().type !== 'EOF') {
      throw new ParserError(`Unexpected ${this._describe(this.peek())}`, this.peek().pos);
    }

    return expr;

  }


  //  core precedence climber 
  // Pratt parsing: parse a prefix (number, variable, function call,
  // unary minus, or parenthesized subexpression), then loop while the
  // next token is an operator with binding power >= minBp.
  parseExpression(minBp) {

    let left = this.parsePrefix();

    while (true) {
      const tok = this.peek();

      // Implicit multiplication: `2x`, `2(x+1)`, `2sin(x)`, `(x+1)(x-1)`, `x x`
      // Treat as a virtual '*' operator at the same binding power as '*'.
      if (this._startsImplicitMul(tok)) {

        const [lbp, rbp] = BP['*'];
        if (lbp < minBp) break;

        // do NOT advance - the next token belongs to the right operand
        const right = this.parseExpression(rbp);
        left = Node.Binary('*', left, right);


        continue;
      }

      // Explicit operator
      if (tok.type === 'OPERATOR' && BP[tok.value]) {

        const [lbp, rbp] = BP[tok.value];
        if (lbp < minBp) break;

        this.advance();
        const right = this.parseExpression(rbp);
        left = Node.Binary(tok.value, left, right);
        continue;

      }

      break;
    }

    return left;
  }

  // Can this token begin an operand? If yes, it's implicit multiplication.
  _startsImplicitMul(tok) {
    return (

      tok.type === 'NUMBER' ||
      tok.type === 'VARIABLE' ||
      tok.type === 'CONSTANT' ||
      tok.type === 'FUNCTION' ||
      tok.type === 'LPAREN'

    );
  }

  //  prefix parsers 
  parsePrefix() {

    const tok = this.peek();

    // Unary minus / plus
    if (tok.type === 'OPERATOR' && (tok.value === '-' || tok.value === '+')) {

      this.advance();
      // Bind tighter than +/- but looser than ^ -- so `-x^2` = -(x^2).
      // Implemented by giving the operand a minBp just below '^' LBP.

      const operand = this.parseExpression(BP['^'][0]);
      return Node.Unary(tok.value, operand);

    }

    // Number
    if (tok.type === 'NUMBER') {
      this.advance();
      return Node.Number(tok.value);
    }

    // Variable
    if (tok.type === 'VARIABLE') {
      this.advance();
      return Node.Variable(tok.value);
    }

    // Constant
    if (tok.type === 'CONSTANT') {
      this.advance();
      return Node.Constant(tok.value);
    }

    // Function call - parens REQUIRED
    if (tok.type === 'FUNCTION') {

      this.advance();
      this.expect('LPAREN');

      const args = [];

      if (this.peek().type !== 'RPAREN') {

        args.push(this.parseExpression(0));

        while (this.peek().type === 'COMMA') {
          this.advance();
          args.push(this.parseExpression(0));
        }

      }

      this.expect('RPAREN');
      return Node.Call(tok.value, args);

    }

    // Parenthesized expression
    if (tok.type === 'LPAREN') {

      this.advance();
      const inner = this.parseExpression(0);
      this.expect('RPAREN');
      
      return inner;
    }

    throw new ParserError(`Unexpected ${this._describe(tok)}`, tok.pos);

  }

}


// Convenience wrapper
export function parse(tokens) {
  return new Parser(tokens).parse();
}

