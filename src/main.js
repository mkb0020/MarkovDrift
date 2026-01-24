import { Renderer } from "./core/Renderer.js";
import { SceneManager } from "./core/SceneManager.js";
import { Time } from "./core/Time.js";

const renderer = new Renderer();
const sceneManager = new SceneManager();
const time = new Time();

function animate() {
  requestAnimationFrame(animate);

  const delta = time.update();

  renderer.render(sceneManager.scene, delta);
}

animate();
