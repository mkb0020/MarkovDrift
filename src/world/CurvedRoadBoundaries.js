// CURVED PLAYER BOUNDARIES

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { WorldConfig } from "./WorldConfig.js";

export class CurvedRoadBoundaries {
  constructor(segmentLength, turnAngle) {
    this.group = new THREE.Group();
    this.build(segmentLength, turnAngle);
  }

  build(segmentLength, turnAngle) {
    const {
      roadWidth,
      shoulderWidth,
      boundaryColor
    } = WorldConfig;

    const halfRoad = roadWidth / 2;
    const xOffset = halfRoad + shoulderWidth;

    const material = new THREE.LineBasicMaterial({
      color: boundaryColor,
      fog: true,
      linewidth: 2
    });

    const curveSegments = 20;
    
    const getCurvePoint = (t, lateralOffset) => {
      const currentAngle = turnAngle * t;
      const distance = t * segmentLength;
      
      const x = lateralOffset;
      const z = -distance;
      
      const rotatedX = x * Math.cos(currentAngle) - z * Math.sin(currentAngle);
      const rotatedZ = x * Math.sin(currentAngle) + z * Math.cos(currentAngle);
      
      return new THREE.Vector3(rotatedX, 0, rotatedZ);
    };

    const leftPoints = [];
    for (let i = 0; i <= curveSegments; i++) {
      const t = i / curveSegments;
      leftPoints.push(getCurvePoint(t, -xOffset));
    }
    const leftGeom = new THREE.BufferGeometry().setFromPoints(leftPoints);
    this.group.add(new THREE.Line(leftGeom, material));

    const rightPoints = [];
    for (let i = 0; i <= curveSegments; i++) {
      const t = i / curveSegments;
      rightPoints.push(getCurvePoint(t, xOffset));
    }
    const rightGeom = new THREE.BufferGeometry().setFromPoints(rightPoints);
    this.group.add(new THREE.Line(rightGeom, material));
  }
}