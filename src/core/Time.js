export class Time {
  constructor() {
    this.lastTime = performance.now();
  }

  update() {
    const currentTime = performance.now();
    const delta = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;
    return delta;
  }
}
