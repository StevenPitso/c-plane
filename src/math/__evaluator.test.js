import { tokenize } from './Lexer.js';
import { parse } from './Parser.js';
import { evaluate } from './Evaluator.js';

function expr(src, x) {
  return evaluate(parse(tokenize(src)), x);
}

const tests = [
  // polynomial
  ['2x + 1',            0,   1],
  ['2x + 1',            3,   7],
  ['x^2',               4,   16],
  ['x^3 - 3x',          2,   2],

  // trig
  ['sin(x)',            0,   0],
  ['sin(x)',            Math.PI / 2, 1],
  ['cos(x)',            0,   1],

  // constants
  ['pi',                0,   Math.PI],
  ['e',                 0,   Math.E],
  ['2pi',               0,   2 * Math.PI],

  // domain: sqrt
  ['sqrt(x)',           4,   2],
  ['sqrt(x)',           -1,  NaN],
  ['sqrt(x)',           0,   0],

  // domain: ln / log
  ['ln(x)',             1,   0],
  ['ln(x)',             Math.E, 1],
  ['ln(x)',             0,   -Infinity],
  ['ln(x)',            -1,   NaN],
  ['log(x)',            100, 2],
  ['log(x)',            1,   0],

  // division by zero
  ['1/x',               0,   Infinity],
  ['1/x',              -0,   -Infinity],
  ['1/x',               2,   0.5],

  // power edge cases
  ['x^2',              -3,   9],
  ['x^(1/3)',          -8,   NaN],   // strict Math.pow semantics
  ['x^0',               5,   1],
  ['0^0',               0,   1],     // JS convention

  // trig domain
  ['asin(x)',           2,   NaN],
  ['asin(x)',           0.5, Math.asin(0.5)],

  // exp / abs
  ['exp(x)',            0,   1],
  ['exp(0)',            0,   1],
  ['abs(x)',           -5,   5],

  // nested
  ['sin(cos(x))',       0,   Math.sin(1)],

  // unary minus
  ['-x',                3,   -3],
  ['-x^2',              3,   -9],   // -(x^2)
  ['(-x)^2',            3,    9],   // (-x)^2
];

let pass = 0, fail = 0;

for (const [src, x, expected] of tests) {

  const got = expr(src, x);
  const ok = (Number.isNaN(expected) && Number.isNaN(got)) || (Object.is(expected, got));    // handles -0 vs 0, Infinity

  if (ok) pass++;
  else { fail++; console.log(`FAIL  ${src}  at x=${x}: expected ${expected}, got ${got}`); }

}

console.log(`\n${pass} passed, ${fail} failed`);