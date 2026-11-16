
// Top-right toolbar: reset view, add function, fullscreen.
// Also owns the bottom status bar with live cursor coords.

export class Toolbar {


  /**
   * @param {HTMLElement} root       container for buttons (e.g. #toolbar)
   * @param {HTMLElement} statusRoot container for status bar (e.g. #status-bar)
   * @param {GraphEngine} engine
   * @param {GraphState} state
   */

  constructor(root, statusRoot, engine, state) {

    this.root = root;
    this.statusRoot = statusRoot;
    this.engine = engine;
    this.state = state;

    this._buildToolbar();
    this._buildStatusBar();
    this._bindCursor();
    this._bindKeys();

  }

  //  toolbar 
  _buildToolbar() {

    this.root.innerHTML = '';

    this._btn('⟲ Reset view', 'Reset view (Ctrl+0)', () => {
      this.engine.camera.reset();
      this.engine.markDirty();
    });

    this._btn('+ Function', 'Add function (Ctrl+Enter)', () => {

      this.state.add('');

      // focus new input on next frame (ExpressionList does this too,
      // but that path requires clicking the button in the sidebar —
      // this handles the keyboard/button path)


      requestAnimationFrame(() => {

        const inputs = document.querySelectorAll('.expr-input');
        inputs[inputs.length - 1]?.focus();

      });

    });

    this._btn('⛶ Fullscreen', 'Toggle fullscreen (F11)', () => {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen();
      else document.exitFullscreen();
    });


  }

  _btn(text, title, onClick) {

    const b = document.createElement('button');

    b.className = 'toolbar-btn';
    b.textContent = text;
    b.title = title;
    b.addEventListener('click', onClick);

    this.root.appendChild(b);

    return b;

  }

  //  status bar 
  _buildStatusBar() {

    this.statusRoot.innerHTML = '';

    this.cursorEl = this._stat('x: —    y: —');
    this.zoomEl   = this._stat('Zoom: 1.00×');

    const live    = this._stat('it works!');

    live.classList.add('status-live');

    // Update zoom on camera changes (we can't subscribe to camera,
    // so patch camera.reset/zoomAt via a lightweight ticker)

    this._startZoomTicker();

  }

  _stat(text) {

    const span = document.createElement('span');

    span.className = 'status-item';
    span.textContent = text;

    this.statusRoot.appendChild(span);
    return span;

  }

  _startZoomTicker() {

    // Cheap polling - only updates DOM when the zoom value changes.
    // Alternative would be a full observer pattern on camera; not worth it
    // for one value at ~4 Hz.

    let lastZoom = null;

    setInterval(() => {

      const z = this.engine.camera.scale / 60;

      if (z !== lastZoom) {
        lastZoom = z;
        this.zoomEl.textContent = `Zoom: ${z.toFixed(2)}×`;
      }

    } , 250);
  }

  _bindCursor() {

    const canvas = this.engine.canvas;
    const { camera } = this.engine;
    const { renderer } = this.engine;

    canvas.addEventListener('mousemove', (e) => {

      const rect = canvas.getBoundingClientRect();

      const world = camera.screenToWorld(
        e.clientX - rect.left,
        e.clientY - rect.top,
        renderer.width,
        renderer.height
      );

      const x = world.x.toFixed(2);
      const y = world.y.toFixed(2);
      this.cursorEl.textContent = `x: ${x}    y: ${y}`;

    });

    canvas.addEventListener('mouseleave', () => {
      this.cursorEl.textContent = 'x: —    y: —';
    });

  }



  _bindKeys() {

    window.addEventListener('keydown', (e) => {

      const ctrl = e.ctrlKey || e.metaKey;

      if (ctrl && e.key === '0') {

        e.preventDefault();
        this.engine.camera.reset();
        this.engine.markDirty();

        return;

      }

      if (ctrl && e.key === 'Enter') {

        e.preventDefault();
        this.state.add('');

        requestAnimationFrame(() => {
          const inputs = document.querySelectorAll('.expr-input');
          inputs[inputs.length - 1]?.focus();
        });

        return;

      }

      // Don't hijack keys while the user is typing in an input

      const tag = document.activeElement?.tagName;

      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (e.key === 'f' || e.key === 'F') {

        if (!document.fullscreenElement) document.documentElement.requestFullscreen();
        
        else document.exitFullscreen();
      }

    });
  }
}

