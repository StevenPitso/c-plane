

import { GraphEngine } from './engine/GraphEngine.js';

const canvas = document.getElementById('plane');
const engine = new GraphEngine(canvas);

// expose for debugging during v2 development
window.__engine = engine;

