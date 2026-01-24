import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { RoadSegment } from "./RoadSegment.js";
import { WorldConfig } from "./WorldConfig.js";

export class RoadSystem {
  constructor(scene, car) {
    this.scene = scene;
    this.car = car;

    this.segments = [];

    this.currentDirection = 0;
    this.lastSegmentEnd = new THREE.Vector3(0, 0, 0);

    for (let i = 0; i < WorldConfig.visibleSegmentsAhead; i++) {
      this.addSegment();
    }
  }

  addSegment() {
    const length = WorldConfig.segmentLength;

    const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      this.currentDirection
    );

    const position = this.lastSegmentEnd.clone().add(
      forward.multiplyScalar(length / 2)
    );

    const segment = new RoadSegment(position, this.currentDirection);
    segment.addTo(this.scene);
    this.segments.push(segment);

    this.lastSegmentEnd.add(
      forward.normalize().multiplyScalar(length)
    );

    this.chooseNextDirection();
  }

  chooseNextDirection() {
    const r = Math.random();
    const { straight, left } = WorldConfig.turnChance;

    if (r < straight) return;

    if (r < straight + left) {
      this.currentDirection += WorldConfig.maxTurnAngle;
    } else {
      this.currentDirection -= WorldConfig.maxTurnAngle;
    }
  }

  update() {
    while (
      this.segments.length < WorldConfig.visibleSegmentsAhead
    ) {
      this.addSegment();
    }

    this.segments = this.segments.filter((segment) => {
      const dz = segment.mesh.position
        .clone()
        .sub(this.car.position)
        .length();

      if (dz > WorldConfig.removeDistanceBehind &&
          segment.mesh.position.z > this.car.position.z) {
        segment.removeFrom(this.scene);
        return false;
      }

      return true;
    });
  }
}
