import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { RoadSegment } from "./RoadSegment.js";
import { CurvedRoadSegment } from "./CurvedRoadSegment.js";
import { WorldConfig } from "./WorldConfig.js";

export class RoadSystem {
  constructor(scene, car) {
    this.scene = scene;
    this.car = car;

    this.segments = [];

    this.roadDirection = 0;
    this.roadEndPosition = new THREE.Vector3(0, 0, 0);

    for (let i = 0; i < 15; i++) {
      this.addSegment();
    }
  }

  update() {
    const { visibleSegmentsAhead, removeDistanceBehind } = WorldConfig;
    
    let closestIndex = 0;
    let closestDistance = Infinity;
    
    for (let i = 0; i < this.segments.length; i++) {
      const dx = this.segments[i].group.position.x - this.car.position.x;
      const dz = this.segments[i].group.position.z - this.car.position.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      
      if (dist < closestDistance) {
        closestDistance = dist;
        closestIndex = i;
      }
    }
    
    let safetyCounter = 0;
    while (safetyCounter < 20) {
      const segmentsAhead = this.segments.length - closestIndex - 1;
      
      console.log(`Closest: ${closestIndex}, Total: ${this.segments.length}, Ahead: ${segmentsAhead}, Need: ${visibleSegmentsAhead}`);
      
      if (segmentsAhead >= visibleSegmentsAhead || this.segments.length >= 50) {
        break;
      }
      
      this.addSegment();
      safetyCounter++;
    }

    this.segments = this.segments.filter((segment, index) => {
      if (index >= closestIndex) {
        return true;
      }
      
      const segmentsBehind = closestIndex - index;
      const shouldKeep = segmentsBehind < 3 || this.segments.length < visibleSegmentsAhead + 10;
      
      if (!shouldKeep) {
        this.scene.remove(segment.group);
        return false;
      }
      
      return true;
    });
  }

  addSegment() {
    const { segmentLength, turnChance, maxTurnAngle } = WorldConfig;

    const rand = Math.random();
    let turnAmount = 0;

    if (rand > turnChance.straight + turnChance.left) {
      turnAmount = maxTurnAngle;
    } else if (rand > turnChance.straight) {
      turnAmount = -maxTurnAngle;
    }

    this.roadDirection += turnAmount;

    const segment = new RoadSegment(
      this.roadEndPosition.clone(),
      this.roadDirection
    );

    segment.addTo(this.scene);
    this.segments.push(segment);

    const forward = new THREE.Vector3(0, 0, -1)
      .applyAxisAngle(new THREE.Vector3(0, 1, 0), this.roadDirection)
      .normalize();

    this.roadEndPosition.add(forward.multiplyScalar(segmentLength));
  }
}