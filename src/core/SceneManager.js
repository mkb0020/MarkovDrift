// SceneManager.js
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { Car } from "../entities/Car.js";
import { RoadSystem } from "../world/RoadSystem.js";
import { CollisionManager } from "../entities/CollisionManager.js";

export class SceneManager {
  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    this.setupFog();

    this.car = new Car(this.scene);
    this.road = new RoadSystem(this.scene, this.car);
    this.collision = new CollisionManager(this.road, this.car);
  }

  setupFog() {
    this.scene.fog = new THREE.FogExp2(0x000000, 0.08);
  }

  update(delta) {
    this.car.update(delta);
    this.road.update();
    this.collision.update(delta);  
  }
}