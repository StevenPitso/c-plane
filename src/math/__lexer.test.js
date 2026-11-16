
import { tokenize, LexerError } from './Lexer.js';

const cases = [

  '2x^2 + 3sin(x) - 4',
  'x**2',
  '2(x+1)',
  '1e10',
  '2.5e-3',

  '.5x',
  'sin(cos(tan(x)))',
  'pi',
  '3.14',
];

for (const src of cases) {

  console.log(`\n${src}`);

  try {
    console.log(tokenize(src).map(t => `${t.type}:${t.value}`).join('  '));
  } catch (e) {
    console.log('  ERROR:', e.message);
  }

}

// error cases
for (const bad of ['2x^', 'sin x', 'foo(x)', '2 @ 3', '']) {

  console.log(`\n[should error] ${JSON.stringify(bad)}`);

  try { console.log(tokenize(bad)); }

  catch (e) { console.log(' ->', e.message); }

}