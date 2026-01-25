import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { WorldConfig } from "./WorldConfig.js";

export class CurvedRoadSegment {
  constructor(position, startDirection, turnAngle) {
    this.group = new THREE.Group();
    this.turnAngle = turnAngle;

    this.buildGeometry(turnAngle);

    this.group.position.copy(position);
    this.group.rotation.y = startDirection;
  }

  buildGeometry(turnAngle) {
    const {
      roadWidth,
      segmentLength,
      edgeThickness,
      roadColor,
    } = WorldConfig;

    const halfWidth = roadWidth / 2;
    const lineMaterial = new THREE.LineBasicMaterial({
      color: roadColor,
      fog: true,
      linewidth: 3,
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

    [-edgeThickness, 0, edgeThickness].forEach(thicknessOffset => {
      const leftPoints = [];
      for (let i = 0; i <= curveSegments; i++) {
        const t = i / curveSegments;
        leftPoints.push(getCurvePoint(t, -halfWidth + thicknessOffset));
      }
      const leftGeom = new THREE.BufferGeometry().setFromPoints(leftPoints);
      this.group.add(new THREE.Line(leftGeom, lineMaterial));

      const rightPoints = [];
      for (let i = 0; i <= curveSegments; i++) {
        const t = i / curveSegments;
        rightPoints.push(getCurvePoint(t, halfWidth + thicknessOffset));
      }
      const rightGeom = new THREE.BufferGeometry().setFromPoints(rightPoints);
      this.group.add(new THREE.Line(rightGeom, lineMaterial));
    });

    const dashCount = 8;
    [-edgeThickness, 0, edgeThickness].forEach(thicknessOffset => {
      for (let i = 0; i < dashCount; i++) {
        const t1 = (i / dashCount) + 0.05;
        const t2 = (i / dashCount) + 0.35;
        
        const dashPoints = [];
        const steps = 5;
        for (let s = 0; s <= steps; s++) {
          const t = t1 + (t2 - t1) * (s / steps);
          dashPoints.push(getCurvePoint(t, thicknessOffset));
        }
        
        if (dashPoints.length > 1) {
          const dashGeom = new THREE.BufferGeometry().setFromPoints(dashPoints);
          this.group.add(new THREE.Line(dashGeom, lineMaterial));
        }
      }
    });
  }

  addTo(scene) {
    scene.add(this.group);
  }
}