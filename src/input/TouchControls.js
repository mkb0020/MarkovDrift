// TouchControls.js
export class TouchControls {
  constructor() {
    this.steer = 0;
    this.targetSteer = 0;
    this.smoothing = 0.15; 

    // PREVENT UNWANTED TOUCH ACTIONS ON MOBILE
    const touchOptions = { passive: false };
    
    window.addEventListener("touchstart", (e) => this.onTouch(e), touchOptions);
    window.addEventListener("touchmove", (e) => this.onTouch(e), touchOptions);
    window.addEventListener("touchend", () => this.onEnd(), touchOptions);
    window.addEventListener("touchcancel", () => this.onEnd(), touchOptions);
  }

  onTouch(e) {
    // NO ZOOM OR SCROLL
    e.preventDefault();
    
    const touch = e.touches[0];
    const mid = window.innerWidth / 2;

    if (touch.clientX < mid) {
      this.targetSteer = -1;
    } else {
      this.targetSteer = 1;
    }
  }

  onEnd() {
    this.targetSteer = 0;
  }

  getSteer() {
    // PREVENT JERKY COLLISION BEHAVIOR
    this.steer += (this.targetSteer - this.steer) * this.smoothing;
    
    if (Math.abs(this.steer) < 0.01 && this.targetSteer === 0) {
      this.steer = 0;
    }
    
    return this.steer;
  }
}