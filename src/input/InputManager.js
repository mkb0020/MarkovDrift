export class InputManager {
  constructor() {
    this.steer = 0;

    this.sources = [];
  }

  addSource(source) {
    this.sources.push(source);
  }

  update() {
    let steering = 0;

    for (const source of this.sources) {
      steering += source.getSteer();
    }

    this.steer = Math.max(-1, Math.min(1, steering));
  }
}
