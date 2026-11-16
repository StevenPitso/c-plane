
import { Camera } from './Camera.js';
import { Renderer } from './Renderer.js';

export class GraphEngine {

  constructor(canvas) {

    this.camera = new Camera();
    this.renderer = new Renderer(canvas, this.camera);

    this.canvas = canvas;

    this.dirty = true;
    this._raf = null;

    this._bindInput();
    this._loop();
  }

  markDirty() { this.dirty = true; }

  _loop = () => {

    if (this.dirty) {
      this.renderer.draw();
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

      const factor = e.deltaY < 0 ?  1.1: 1 / 1.1;

      this.camera.zoomAt(

        e.clientX - rect.left,
        e.clientY - rect.top,

        factor,

        this.renderer.width,
        this.renderer.height
      );

      this.markDirty();

    }, { passive: false });

  }

}


