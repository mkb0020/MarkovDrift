export class KeyboardControls {
  constructor() {
    this.steer = 0;

    window.addEventListener("keydown", (e) => this.onKey(e, true));
    window.addEventListener("keyup", (e) => this.onKey(e, false));
  }

  onKey(e, isDown) {
    if (e.key === "ArrowLeft" || e.key === "a") {
      this.steer = isDown ? -1 : 0;
    }
    if (e.key === "ArrowRight" || e.key === "d") {
      this.steer = isDown ? 1 : 0;
    }
  }

  getSteer() {
    return this.steer;
  }
}
