import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { Car } from "../entities/Car.js";

export class SceneManager {

addGroundGrid() {
  const size = 200;
  const divisions = 40;

  const grid = new THREE.GridHelper(
    size,
    divisions,
    0x00ffff,
    0x00ffff
  );

  grid.position.y = -1;
  this.scene.add(grid);
}


constructor() {
  this.scene = new THREE.Scene();
  this.scene.background = new THREE.Color(0x000000);

  this.setupFog();
  this.addGroundGrid();

  this.car = new Car(this.scene);
}


  setupFog() {
    this.scene.fog = new THREE.FogExp2(0x000000, 0.08);
  }

  update(delta) {
    this.car.update(delta);
  }
}


