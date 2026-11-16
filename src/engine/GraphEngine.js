




import { Camera } from './Camera.js';
import { Renderer } from './Renderer.js';
import { Sampler } from './Sampler.js';
import { FunctionGraph } from '../graph/FunctionGraph.js';

export class GraphEngine {

  constructor(canvas) {

    this.canvas = canvas;
    this.camera = new Camera();

    this.renderer = new Renderer(canvas, this.camera);

    this.graphs = [];
    this.dirty = true;
    this._raf = null;

    this._bindInput();
    this._loop();

  }

  addGraph(expression) {

    const g = new FunctionGraph(expression);

    this.graphs.push(g);
    this.markDirty();
    return g;

  }

  removeGraph(id) {
    this.graphs = this.graphs.filter(g => g.id !== id);
    this.markDirty();
  }

  markDirty() { this.dirty = true; }

  _loop = () => {

    if (this.dirty) {

      const { width, height } = this.renderer;
      const curves = [];

      for (const g of this.graphs) {

        if (!g.visible || !g.evaluator) continue;

        const sampler = new Sampler(g.evaluator, this.camera);
        const samples = sampler.sample(width, height);

        curves.push({ samples, color: g.color });
      }

      this.renderer.draw(curves);
      this.dirty = false;

    }

    this._raf = requestAnimationFrame(this._loop);

  };

  _bindInput() {

    const canvas = this.canvas;
    let dragging = false;
    let lastX = 0, lastY = 0;

    canvas.addEventListener('mousedown', (e) => {

      dragging = true;

      lastX = e.clientX;
      lastY = e.clientY;

      canvas.classList.add('dragging');
    });


    window.addEventListener('mouseup', () => {
      dragging = false;
      canvas.classList.remove('dragging');
    });


    window.addEventListener('mousemove', (e) => {

      if (!dragging) return;

      this.camera.panByPixels(e.clientX - lastX, e.clientY - lastY);

      lastX = e.clientX;
      lastY = e.clientY;

      this.markDirty();

    });


    canvas.addEventListener('wheel', (e) => {

      e.preventDefault();
      const rect = canvas.getBoundingClientRect();

      const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1;

      this.camera.zoomAt(

        e.clientX - rect.left,
        e.clientY - rect.top,

        factor,

        this.renderer.width,
        this.renderer.height

      );

      this.markDirty();

    }, { passive: false });

    // Resize the canvas → re-render at new size
    window.addEventListener('resize', () => {
      // Renderer's own resize listener already resized the backing store;
      // we just need to redraw at the new dimensions.
      this.markDirty();
    });


  }


}



