
// One instance per expression. Owns its own AST and Evaluator so
// re-parsing one expression never invalidates another.

import { tokenize } from '../math/Lexer.js';
import { parse } from '../math/Parser.js';
import { Evaluator } from '../math/Evaluator.js';

let nextId = 1;

export class FunctionGraph {

  /**
   * @param {string} expression   user-typed source, e.g. "x^2 - 4x + 3"
   * @param {object} [opts]
   * @param {string} [opts.color] CSS color for the curve
   */

  constructor(expression, opts = {}) {

    this.id = nextId++;
    this.expression = expression;
    this.color = opts.color || FunctionGraph.pickColor(this.id);
    this.visible = opts.visible !== false;
    this.error = null;

    this.ast = null;
    this.evaluator = null;

    this.recompile();

  }

  // Re-run lexer --> parser  --> evaluator. Safe to call on every keystroke;
  // on error, sets this.error and leaves ast/evaluator null.

  recompile() {

    try {


      const tokens = tokenize(this.expression);
      const ast = parse(tokens);
      this.ast = ast;

      this.evaluator = new Evaluator(ast);
      this.error = null;

      return true;

    } catch (e) {

      this.ast = null;
      this.evaluator = null;
      this.error = e.message;

      return false;

    }

  }

  setExpression(src) {

    if (src === this.expression) return;

    this.expression = src;
    this.recompile();
  }

  // Stable palette - same id always gets same color
  static pickColor(id) {

    const palette = [
      '#7dd3fc', // sky
      '#f472b6', // pink
      '#a78bfa', // violet
      '#4ade80', // green
      '#facc15', // yellow
      '#fb923c', // orange
      '#f87171', // red
      '#22d3ee', // cyan
    ];

    return palette[(id - 1) % palette.length];

  }

}