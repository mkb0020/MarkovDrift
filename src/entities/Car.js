// Car.js
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { WorldConfig } from "../world/WorldConfig.js";

export class Car {
  constructor(scene) {
    this.speed = 10; 
    this.position = new THREE.Vector3(0, 0, 0);
    this.rotationY = 0;
    this.turnSpeed = 1.5; 
    this.steerInput = 0;

    const maxDegrees = WorldConfig.carMaxTurnAngle;
    this.maxRotation = Math.PI * (maxDegrees / 180);
    this.minRotation = -this.maxRotation;

    const geometry = new THREE.BoxGeometry(1.2, 0.6, 2.4);
    const material = new THREE.MeshBasicMaterial({
      color: 0xc71585, 
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(this.position);

    scene.add(this.mesh);
  }

  update(delta) {
    this.rotationY += this.steerInput * this.turnSpeed * delta;


    this.rotationY = Math.max(this.minRotation, Math.min(this.maxRotation, this.rotationY));

    const forward = new THREE.Vector3(0, 0, -1)
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), this.rotationY);

    this.position.addScaledVector(forward, this.speed * delta);

    this.mesh.position.copy(this.position);
    this.mesh.rotation.y = this.rotationY;
  }
}