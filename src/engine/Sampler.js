
// Sample an Evaluator across the visible x-range at 1 sample / pixel.
// Returns [{ x, y } | null, ...] in world coordinates.
// `null` marks a discontinuity - the renderer must break the path there.

export class Sampler {

  constructor(evaluator, camera) {
    this.evaluator = evaluator;
    this.camera = camera;
  }

  /**
   * @param {number} widthPx    canvas width in CSS pixels
   * @param {number} heightPx   canvas height in CSS pixels
   * @returns {Array<{x:number,y:number}|null>}
   */

  sample(widthPx, heightPx) {

    const { camera } = this;

    // World x-range covered by the viewport
    const left  = camera.screenToWorld(0, 0, widthPx, heightPx).x;
    const right = camera.screenToWorld(widthPx, 0, widthPx, heightPx).x;

    // Full viewport height in world units - used as the "big jump" threshold
    const worldHeight = Math.abs(camera.screenToWorld(0, 0, widthPx, heightPx).y - camera.screenToWorld(0, heightPx, widthPx, heightPx).y);

    const jumpThreshold = worldHeight; // jump > one screen height = discontinuity

    const samples = new Array(widthPx + 1);
    let prevY = null;

    for (let i = 0; i <= widthPx; i++) {

      const t = i / widthPx;
      const x = left + (right - left) * t;

      const y = this.evaluator.evaluate(x);

      // Reject non-finite values - they break the path
      if (!Number.isFinite(y)) {

        samples[i] = null;
        prevY = null;

        continue;

      }

      // Discontinuity check: huge vertical jump between adjacent samples

      if (prevY !== null && Math.abs(y - prevY) > jumpThreshold) {

        samples[i] = null;
        prevY = null;

        continue;
      }

      samples[i] = { x, y };
      prevY = y;
    }

    return samples;
  }
}