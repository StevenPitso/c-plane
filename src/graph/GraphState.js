

// Observable store of FunctionGraph instances.
// Anything that mutates state emits 'change' and the UI re-renders.

import { FunctionGraph } from './FunctionGraph.js';

export class GraphState {

  constructor() {

    this.graphs = [];
    this.listeners = new Set();
    this._nextId = 1;

  }

  //  subscription 
  on(event, fn) {

    if (event !== 'change') throw new Error(`Unknown event '${event}'`);

    this.listeners.add(fn);
    return () => this.listeners.delete(fn); // unsubscribe

  }

  _emit() {
    for (const fn of this.listeners) fn(this);
  }

  //  mutations 
  add(expression = '') {

    const g = new FunctionGraph(expression);
    // Override the per-class id so state owns id assignment
    g.id = this._nextId++;
    // Reassign color in case id changed
    g.color = FunctionGraph.pickColor(g.id);

    this.graphs.push(g);
    this._emit();

    return g;

  }

  remove(id) {

    const before = this.graphs.length;
    this.graphs = this.graphs.filter(g => g.id !== id);

    if (this.graphs.length !== before) this._emit();

  }

  update(id, expression) {

    const g = this.graphs.find(g => g.id === id);

    if (!g) return;
    if (g.expression === expression) return;

    g.setExpression(expression);
    this._emit();

  }

  toggleVisible(id) {

    const g = this.graphs.find(g => g.id === id);

    if (!g) return;

    g.visible = !g.visible;
    this._emit();

  }



  get(id) {
    return this.graphs.find(g => g.id === id);
  }


}


