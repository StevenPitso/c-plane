
export class Camera {


  constructor({ x = 0, y = 0, scale = 60 } = {}) {

    this.x = x;          // world coord at viewport center
    this.y = y;

    this.scale = scale;  // pixels per world unit

    this.minScale = 2;
    this.maxScale = 5000;
    
  }

  worldToScreen(wx, wy, width, height) {

    return {
      x: (wx - this.x) * this.scale + width /   2,
      y: height / 2 - (wy - this.y) * this.scale
    };


  }

  screenToWorld(sx, sy, width, height) {

    return {

      x: (sx - width / 2) / this.scale + this.x,
      y: (height / 2 - sy) / this.scale + this.y

    };

  }

  panByPixels(dxPx, dyPx) {
    this.x -= dxPx / this.scale;
    this.y += dyPx / this.scale;
  }

  zoomAt(screenX, screenY, factor, width, height) {

    const before = this.screenToWorld(screenX, screenY, width, height);

    this.scale = Math.min(this.maxScale, Math.max(this.minScale, this.scale * factor));

    const after = this.screenToWorld(screenX, screenY, width, height);

    // keep the world point under the cursor fixed
    this.x += before.x - after.x;
    this.y += before.y - after.y;
  }

  reset() {

    this.x = 0;
    this.y = 0;
    this.scale = 60;
    
  }
}