


export class Renderer {


  constructor(canvas, camera) {


    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.camera = camera;
    this.dpr = window.devicePixelRatio || 1;


    this.width = 0;
    this.height = 0;

    this._resize();
    window.addEventListener('resize', () => this._resize());
    
  }

  _resize() {

    const rect = this.canvas.getBoundingClientRect();

    this.width = rect.width;
    this.height = rect.height;

    this.canvas.width = rect.width * this.dpr;
    this.canvas.height = rect.height * this.dpr;

    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

  }

  // Choose a "nice" grid step: 1, 2, 5, 10, 20, 50, 100 ...
  _niceStep(targetPx = 80) {

    const raw = targetPx / this.camera.scale; // world units per ~80px
    const mag = Math.pow(10, Math.floor( Math.log10(raw) ));
    const norm = raw / mag;

    let nice;

    if (norm < 1.5) nice = 1;
    else if (norm < 3) nice = 2;
    else if (norm < 7) nice = 5;
    else nice = 10;

    return nice * mag;

  }

  draw() {


    const { ctx, width, height, camera } = this;



    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = '#0f1115';
    ctx.fillRect(0, 0, width, height);

    const step = this._niceStep();
    const topLeft = camera.screenToWorld(0, 0, width, height);
    const botRight = camera.screenToWorld(width, height,   width, height);

    this._drawGrid(step, topLeft, botRight);
    this._drawAxes();

  }

    // Draw a sampled function. Breaks the path at null entries.
  // Call this AFTER _drawGrid() and _drawAxes().
  drawFunction(samples, color) {

    const { ctx, width, height, camera } = this;

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    ctx.beginPath();
    let drawing = false;

    for (const s of samples) {

      if (!s) { drawing = false; continue; }

      const p = camera.worldToScreen(s.x, s.y, width, height);

      if (!drawing) {

        ctx.moveTo(p.x, p.y);
        drawing = true;

      } else {
        ctx.lineTo(p.x, p.y);
      }
    }
    ctx.stroke();
  }

  _drawGrid(step, tl, br) {

    const { ctx, width, height, camera } = this;

    ctx.lineWidth = 1;
    ctx.strokeStyle = '#1e2430';

    ctx.beginPath();

    const startX = Math.floor(tl.x / step) * step;

    for (let x = startX; x <= br.x; x += step) {

      const p = camera.worldToScreen( x , 0, width, height);

      ctx.moveTo(p.x, 0);
      ctx.lineTo(p.x, height);

    }

    const startY = Math.floor(br.y / step) * step;

    for (let y = startY; y <= tl.y; y += step) {

      const p = camera.worldToScreen(0, y, width, height);

      ctx.moveTo(0, p.y);
      ctx.lineTo(width, p.y);

    }

    ctx.stroke();

    // Subdivisions (fainter, half-step) when zoomed in enough

    if (camera.scale * step > 200) {

      ctx.strokeStyle = '#161a22';

      ctx.beginPath();

      const sub = step / 2;

      for (let x = startX; x <= br.x; x += sub) {

        const p = camera.worldToScreen(x, 0, width, height);
        
        ctx.moveTo(p.x, 0);
        ctx.lineTo(p.x, height);
      }

      for (let y = startY; y <= tl.y ; y += sub) {

        const p = camera.worldToScreen(0, y, width, height);
          ctx.moveTo(0, p.y );
        ctx.lineTo(width, p.y);
      }

      ctx.stroke();
    }
  }

  _drawAxes() {

    const { ctx, width, height, camera } = this;
    const origin = camera.worldToScreen(0, 0, width, height);

    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 1.5;
    ctx.beginPath();

    if (origin.y >= 0 && origin.y <= height) {
      ctx.moveTo(0, origin.y);
      ctx.lineTo(width, origin.y);
    }

    if (origin.x >= 0 && origin.x <= width) {
      ctx.moveTo(origin.x, 0);
      ctx.lineTo(origin.x, height);
    }

    ctx.stroke();
  }

  draw(curves = []) {

    const { ctx, width, height } = this;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#0f1115';
    ctx.fillRect(0, 0, width, height);

    const step = this._niceStep();
    const tl = this.camera.screenToWorld(0, 0, width, height);
    const br = this.camera.screenToWorld(width, height, width, height);

    this._drawGrid(step, tl, br);
    this._drawAxes();

    for (const { samples, color } of curves) {
      this.drawFunction(samples, color);
    }


  }

}


