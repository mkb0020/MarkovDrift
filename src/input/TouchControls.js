export class TouchControls {
  constructor() {
    this.steer = 0;

    window.addEventListener("touchstart", (e) => this.onTouch(e));
    window.addEventListener("touchmove", (e) => this.onTouch(e));
    window.addEventListener("touchend", () => this.onEnd());
  }

  onTouch(e) {
    const touch = e.touches[0];
    const mid = window.innerWidth / 2;

    if (touch.clientX < mid) {
      this.steer = -1;
    } else {
      this.steer = 1;
    }
  }

  onEnd() {
    this.steer = 0;
  }

  getSteer() {
    return this.steer;
  }
}
