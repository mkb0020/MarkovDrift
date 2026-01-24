import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

export class Renderer {
  constructor() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    this.camera.position.set(0, 3, 8);

    window.addEventListener("resize", () => this.onResize());
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  followCar(car, delta) {
    const cameraOffset = new THREE.Vector3(0, 3, 8);
    cameraOffset.applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      car.rotationY
    );

    const targetPosition = car.position.clone().add(cameraOffset);

    this.camera.position.lerp(targetPosition, 5 * delta);

    const lookAtTarget = car.position.clone().add(
      new THREE.Vector3(0, 1, -5).applyAxisAngle(
        new THREE.Vector3(0, 1, 0),
        car.rotationY
      )
    );

    this.camera.lookAt(lookAtTarget);
  }

  render(scene) {
    this.renderer.render(scene, this.camera);
  }
}
