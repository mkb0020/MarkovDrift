import { Renderer } from "./core/Renderer.js";
import { SceneManager } from "./core/SceneManager.js";
import { Time } from "./core/Time.js";

import { InputManager } from "./input/InputManager.js";
import { TouchControls } from "./input/TouchControls.js";
import { KeyboardControls } from "./input/KeyboardControls.js";

const renderer = new Renderer();
const sceneManager = new SceneManager();
const time = new Time();

const input = new InputManager();
input.addSource(new TouchControls());
input.addSource(new KeyboardControls());

function animate() {
  requestAnimationFrame(animate);

  const delta = time.update();

  input.update();
  sceneManager.car.steerInput = input.steer;

  sceneManager.update(delta);
  renderer.followCar(sceneManager.car, delta);
  renderer.render(sceneManager.scene);
}

animate();
