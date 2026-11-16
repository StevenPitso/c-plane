
import { tokenize } from './Lexer.js';
import { parse, ParserError } from './Parser.js';
import { astToString } from './AST.js';

const cases = [
  // v1 README parity (note: v2 syntax, not Math.*)
  '2x + 1',
  'x^2',
  'x^3 - 3x',
  'sin(x)',
  'exp(x)',
  // precedence
  '2 + 3 * 4',         // -> 2 + (3*4)
  '2 ^ 3 ^ 2',         // -> 2 ^ (3^2) = 512
  '-x^2',              // -> -(x^2)
  '(-x)^2',            // -> (-x)^2
  // implicit multiplication
  '2x',
  '2(x+1)',
  '3sin(x)',
  '(x+1)(x-1)',
  'x x',
  '2pi',
  // nested
  'sin(cos(tan(x)))',
  // scientific
  '1e10x',
];

for (const src of cases) {

  console.log(`\n=== ${src} ===`);

  try {
    const ast = parse(tokenize(src));
    console.log(astToString(ast));
  } catch (e) {
    console.log('  ERROR:', e.message);
  }
  
}

console.log('\n=== expected errors ===');
for (const bad of ['', '2x^', 'sin x', '2 +', '(2+3', '2 3 +']) {
  console.log(`\n--- ${JSON.stringify(bad)} ---`);
  try {
    parse(tokenize(bad));
    console.log('  ⚠ did not throw (should have)');
  } catch (e) {
    console.log('  ->', e.message);
  }
}