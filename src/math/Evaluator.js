// src/math/Evaluator.js — walk an AST for a given x, return a number.
// Domain errors → NaN (never throw in the hot path).
// 1/0 → ±Infinity (mathematically correct, sampler breaks the path).

import { ParserError } from './Parser.js';

const CONSTANT_VALUES = {
  pi: Math.PI,
  e: Math.E,
};

// Map our function names to JS Math.*.
// Any function here is guaranteed to exist on Math.
const FN_MAP = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  ln: Math.log,       // natural log
  log: Math.log10,    // base-10 (v2 convention; documented in README)
  sqrt: Math.sqrt,
  abs: Math.abs,
  exp: Math.exp,
};

export class Evaluator {
  constructor(ast) {
    this.ast = ast;
  }

  // Evaluate for a single x. Returns a number (possibly NaN or ±Infinity).
  evaluate(x) {
    return this._eval(this.ast, x);
  }

  _eval(node, x) {
    switch (node.type) {
      case 'Number':
        return node.value;

      case 'Variable':
        // Only 'x' exists right now
        return x;

      case 'Constant':
        return CONSTANT_VALUES[node.name];

      case 'Unary': {
        const v = this._eval(node.operand, x);
        return node.op === '-' ? -v : v;
      }

      case 'Binary': {
        const l = this._eval(node.left, x);
        const r = this._eval(node.right, x);
        switch (node.op) {
          case '+': return l + r;
          case '-': return l - r;
          case '*': return l * r;
          case '/': return l / r;      // x/0 → Infinity (correct)
          case '^': return safePow(l, r);
          default:
            // Should be unreachable given the parser
            return NaN;
        }
      }

      case 'Call': {
        const fn = FN_MAP[node.name];
        if (!fn) return NaN;
        // All current functions are unary. If we add binary functions
        // (log base, atan2, …), extend this switch here.
        if (node.args.length !== 1) return NaN;
        return fn(this._eval(node.args[0], x));
      }

      default:
        return NaN;
    }
  }
}

// Math.pow has some surprising edge cases with negative bases and
// non-integer exponents. Return NaN (real-valued domain error) rather
// than a complex number.
function safePow(base, exp) {
  if (base < 0 && !Number.isInteger(exp)) {
    // e.g. (-8)^(1/3) — real cube root exists mathematically but
    // Math.pow(-8, 1/3) returns NaN. We return NaN too; a future
    // "enable complex" flag could handle this differently.
    return NaN;
  }
  return Math.pow(base, exp);
}

// Convenience
export function evaluate(ast, x) {
  return new Evaluator(ast).evaluate(x);
}