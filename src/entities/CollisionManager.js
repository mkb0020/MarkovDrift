// CollisionManager.js
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { WorldConfig } from "../world/WorldConfig.js";

export class CollisionManager {
  constructor(roadSystem, car) {
    this.roadSystem = roadSystem;
    this.car = car;
    
    this.carWidth = 1.2;  
    this.carHalfWidth = this.carWidth / 2;
    
    this.enableSpeedPenalty = true;
    this.speedPenaltyAmount = 0.7;  
    this.speedPenaltyDuration = 0.3;  
    this.penaltyTimeRemaining = 0;
    
    this.originalSpeed = car.speed;
  }

  update(delta) {
    if (this.penaltyTimeRemaining > 0) {
      this.penaltyTimeRemaining -= delta;
      if (this.penaltyTimeRemaining <= 0) {
        this.car.speed = this.originalSpeed;
      }
    }

    const currentSegment = this.findCurrentSegment();
    
    if (!currentSegment) {
      return; 
    }

    this.checkBoundaryCollision(currentSegment);
  }

  findCurrentSegment() {
    let closestSegment = null;
    let closestDistance = Infinity;

    for (const segment of this.roadSystem.segments) {
      const segmentPos = segment.group.position;
      const dx = segmentPos.x - this.car.position.x;
      const dz = segmentPos.z - this.car.position.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist < closestDistance) {
        closestDistance = dist;
        closestSegment = segment;
      }
    }

    return closestSegment;
  }

  checkBoundaryCollision(segment) {
    const { roadWidth, shoulderWidth } = WorldConfig;
    const maxDistance = (roadWidth / 2) + shoulderWidth;

    const segmentPos = segment.group.position;
    const segmentRotation = segment.group.rotation.y;

    const carRelativePos = this.car.position.clone().sub(segmentPos);
    
    const cosRot = Math.cos(-segmentRotation);
    const sinRot = Math.sin(-segmentRotation);
    
    const localX = carRelativePos.x * cosRot - carRelativePos.z * sinRot;
    const localZ = carRelativePos.x * sinRot + carRelativePos.z * cosRot;

    const distanceFromCenter = Math.abs(localX);

    if (distanceFromCenter > maxDistance - this.carHalfWidth) {
      const pushDirection = localX > 0 ? 1 : -1;
      const correctedLocalX = pushDirection * (maxDistance - this.carHalfWidth);
      
      const penetrationDepth = distanceFromCenter - (maxDistance - this.carHalfWidth);
      
      const carForward = new THREE.Vector3(0, 0, -1)
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), this.car.rotationY);
      
      const localVelX = carForward.x * cosRot - carForward.z * sinRot;
      const localVelZ = carForward.x * sinRot + carForward.z * cosRot;
      

      const approachAngle = Math.abs(localVelX);
      
      const correctionStrength = Math.pow(approachAngle, 0.5);
      
      const correctionAmount = penetrationDepth * correctionStrength;
      const clampedLocalX = localX > 0 ? 
        Math.max(localX - correctionAmount, correctedLocalX) :
        Math.min(localX + correctionAmount, correctedLocalX);
      
      const correctionX = (clampedLocalX - localX) * Math.cos(segmentRotation);
      const correctionZ = (clampedLocalX - localX) * Math.sin(segmentRotation);

      this.car.position.x += correctionX;
      this.car.position.z += correctionZ;

      this.car.mesh.position.copy(this.car.position);

      if (correctionStrength > 0.3) {
        this.onBoundaryHit();
      }
    }
  }

  onBoundaryHit() {
    if (this.enableSpeedPenalty) {
      this.car.speed = this.originalSpeed * this.speedPenaltyAmount;
      this.penaltyTimeRemaining = this.speedPenaltyDuration;
    }

    // PLACEHOLDERS
   
    // - Sound effects: this.playCollisionSound();
    // - Screen shake: this.triggerScreenShake();
    // - Visual feedback: this.flashBoundaries();
    // - Particle effects: this.spawnSparks();
    
    // DEBUGGING
    // console.log("Boundary hit!");
  }
}