// src/main.js
import { GraphEngine } from './engine/GraphEngine.js';
import { GraphState } from './graph/GraphState.js';
import { ExpressionList } from './ui/ExpressionList.js';
import { Toolbar } from './ui/Toolbar.js';

const canvas   = document.getElementById('plane');
const listEl   = document.getElementById('expression-list');
const toolEl   = document.getElementById('toolbar');
const statusEl = document.getElementById('status-bar');

const engine = new GraphEngine(canvas);
const state  = new GraphState();

state.add('2x + 1');
state.add('x^2');
state.add('sin(x)');
state.add('1/x');

// state → engine
state.on('change', () => engine.markDirty());
Object.defineProperty(engine, 'graphs', { get() { return state.graphs; } });

// mount UI
new ExpressionList(listEl, state);
new Toolbar(toolEl, statusEl, engine, state);

window.__engine = engine;
window.__state  = state;