// CollisionManager.js
// Handles collision detection between car and road boundaries

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { WorldConfig } from "../world/WorldConfig.js";

export class CollisionManager {
  constructor(roadSystem, car) {
    this.roadSystem = roadSystem;
    this.car = car;
    
    // Car dimensions for collision detection
    this.carWidth = 1.2;  // From Car.js geometry
    this.carHalfWidth = this.carWidth / 2;
    
    // Feedback settings
    this.enableSpeedPenalty = true;
    this.speedPenaltyAmount = 0.7;  // Multiply speed by this when hitting boundary
    this.speedPenaltyDuration = 0.3;  // Seconds
    this.penaltyTimeRemaining = 0;
    
    // Store original speed
    this.originalSpeed = car.speed;
    
    // Detect if we're on mobile for adjusted collision behavior
    this.isMobile = this.detectMobile();
    
    // Mobile gets slightly more forgiving collision
    this.collisionBuffer = this.isMobile ? 0.2 : 0;  // Extra buffer space on mobile
  }
  
  detectMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
           || ('ontouchstart' in window);
  }

  update(delta) {
    // Handle speed penalty decay
    if (this.penaltyTimeRemaining > 0) {
      this.penaltyTimeRemaining -= delta;
      if (this.penaltyTimeRemaining <= 0) {
        this.car.speed = this.originalSpeed;
      }
    }

    // Find the segment the car is currently on
    const currentSegment = this.findCurrentSegment();
    
    if (!currentSegment) {
      return; // No segment found, skip collision
    }

    // Check if car is outside boundaries
    this.checkBoundaryCollision(currentSegment);
  }

  findCurrentSegment() {
    let closestSegment = null;
    let closestDistance = Infinity;

    // Find which segment the car is closest to
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

    // Get the segment's position and rotation
    const segmentPos = segment.group.position;
    const segmentRotation = segment.group.rotation.y;

    // Transform car position to segment's local space
    const carRelativePos = this.car.position.clone().sub(segmentPos);
    
    // Rotate the car's position back to align with segment's coordinate system
    const cosRot = Math.cos(-segmentRotation);
    const sinRot = Math.sin(-segmentRotation);
    
    const localX = carRelativePos.x * cosRot - carRelativePos.z * sinRot;
    const localZ = carRelativePos.x * sinRot + carRelativePos.z * cosRot;

    // Check if car is outside the boundaries on either side
    // Add collision buffer for mobile devices
    const distanceFromCenter = Math.abs(localX);
    const effectiveMaxDistance = maxDistance + this.collisionBuffer;

    if (distanceFromCenter > effectiveMaxDistance - this.carHalfWidth) {
      // Car is outside boundary!
      const pushDirection = localX > 0 ? 1 : -1;
      const correctedLocalX = pushDirection * (effectiveMaxDistance - this.carHalfWidth);
      
      // Calculate how far we need to push the car back
      const penetrationDepth = distanceFromCenter - (effectiveMaxDistance - this.carHalfWidth);
      
      // Calculate the car's velocity direction in local space
      const carForward = new THREE.Vector3(0, 0, -1)
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), this.car.rotationY);
      
      // Transform car's forward vector to segment local space
      const localVelX = carForward.x * cosRot - carForward.z * sinRot;
      const localVelZ = carForward.x * sinRot + carForward.z * cosRot;
      
      // Calculate the angle of approach (how much the car is moving toward/away from boundary)
      // If moving parallel to boundary (localVelX ≈ 0), we want minimal correction
      // If moving perpendicular (localVelX ≈ ±1), we want full correction
      const approachAngle = Math.abs(localVelX);
      
      // Blend between sliding along (0) and full correction (1) based on approach angle
      // Mobile gets a gentler curve for smoother feel
      const curvePower = this.isMobile ? 0.3 : 0.5;
      const correctionStrength = Math.pow(approachAngle, curvePower);
      
      // Calculate the correction needed
      const correctionAmount = penetrationDepth * correctionStrength;
      const clampedLocalX = localX > 0 ? 
        Math.max(localX - correctionAmount, correctedLocalX) :
        Math.min(localX + correctionAmount, correctedLocalX);
      
      // Transform the correction back to world space
      const correctionX = (clampedLocalX - localX) * Math.cos(segmentRotation);
      const correctionZ = (clampedLocalX - localX) * Math.sin(segmentRotation);

      // Apply the lateral correction
      this.car.position.x += correctionX;
      this.car.position.z += correctionZ;

      // Update mesh position
      this.car.mesh.position.copy(this.car.position);

      // Only trigger feedback if we're significantly pushing against the boundary
      if (correctionStrength > 0.3) {
        this.onBoundaryHit();
      }
    }
  }

  onBoundaryHit() {
    // Apply speed penalty
    if (this.enableSpeedPenalty) {
      this.car.speed = this.originalSpeed * this.speedPenaltyAmount;
      this.penaltyTimeRemaining = this.speedPenaltyDuration;
    }

    // Placeholder for additional feedback when hitting boundary
    // You can add:
    // - Sound effects: this.playCollisionSound();
    // - Screen shake: this.triggerScreenShake();
    // - Visual feedback: this.flashBoundaries();
    // - Particle effects: this.spawnSparks();
    
    // For debugging
    // console.log("Boundary hit!");
  }
}