
// Sidebar that renders every FunctionGraph in GraphState.
// Re-renders on every 'change'. Debounces recompilation per input.


import { GraphState } from '../graph/GraphState.js';

export class ExpressionList {

  /**
   * @param {HTMLElement} root   container (e.g. #expression-list)
   * @param {GraphState} state
   */

  constructor(root, state) {

    this.root = root;
    this.state = state;

    this.debounceTimers = new Map(); // id -> timeout

    this._bindState();
    this._render();
  }

  _bindState() {
    this.state.on('change', () => this._render());
  }

  _render() {
    // Preserve focus & selection if an input is currently focused
    const active = document.activeElement;
    const focusId = active?.dataset?.graphId;
    const selStart = active?.selectionStart;
    const selEnd = active?.selectionEnd;

    this.root.innerHTML = '';

    for (const g of this.state.graphs) {
      this.root.appendChild(this._buildRow(g));
    }

    this.root.appendChild(this._buildAddButton());

    // Restore focus
    if (focusId) {

      const input = this.root.querySelector(`[data-graph-id="${focusId}"]`);

      if (input) {
        input.focus();
        if (selStart != null) input.setSelectionRange(selStart, selEnd);
      }

    }

  }

  _buildRow(g) {

    const row = document.createElement('div');

    row.className = 'expr-row' + (g.visible ? '' : ' expr-row--hidden');
    row.dataset.id = g.id;

    // Visibility toggle (color dot)
    const dot = document.createElement('button');

    dot.className = 'expr-dot';
    dot.style.background = g.visible ? g.color : 'transparent';
    dot.style.borderColor = g.color;
    dot.title = g.visible ? 'Hide' : 'Show';

    dot.addEventListener('click', () => this.state.toggleVisible(g.id));
    row.appendChild(dot);

    // Label (f₁, f₂, …)
    const label = document.createElement('span');

    label.className = 'expr-label';
    label.textContent = `f${this._subscript(g.id)}`;
    row.appendChild(label);

    // Input
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'expr-input';

    input.value = g.expression;


    input.placeholder = 'e.g. x^2 - 4x + 3';


    input.dataset.graphId = g.id;
    input.spellcheck = false;


    input.addEventListener('input', (e) => {

      const val = e.target.value;
      // Update state immediately so dependent UIs see it
      this.state.update(g.id, val);
    });


    row.appendChild(input);

    // Delete button
    const del = document.createElement('button');

    del.className = 'expr-delete';
    del.textContent = '×';
    del.title = 'Remove';

    del.addEventListener('click', () => this.state.remove(g.id));
    row.appendChild(del);

    // Error message (only if any)

    if (g.error) {

      const err = document.createElement('div');

      err.className = 'expr-error';
      err.textContent = g.error;
      row.appendChild(err);
    }

    return row;
  }

  _buildAddButton() {

    const btn = document.createElement('button');

    btn.className = 'expr-add';
    btn.textContent = '+ Add expression';

    btn.addEventListener('click', () => {

      const g = this.state.add('');

      // Focus the new input on next frame

      requestAnimationFrame(() => {
        const input = this.root.querySelector(`[data-graph-id="${g.id}"]`);
        input?.focus();
      });

    });

    return btn;

  }

  // 1 -> '₁', 2 -> '₂', ...

  _subscript(n) {

    const map = '₀₁₂₃₄₅₆₇₈₉';

    return String(n).split('').map(d => map[+d]).join('');
  }

}