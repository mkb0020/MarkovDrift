import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

export class SceneManager {
  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    this.setupFog();
    this.addDebugObject();
  }

  setupFog() {
    this.scene.fog = new THREE.FogExp2(0x000000, 0.08);
  }



}
