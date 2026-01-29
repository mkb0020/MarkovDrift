// PLAYER BOUNDARIES 

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { WorldConfig } from "./WorldConfig.js";

export class RoadBoundaries {
  constructor(segmentLength) {
    this.group = new THREE.Group();
    this.build(segmentLength);
  }

  build(segmentLength) {
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

    const leftGeom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-xOffset, 0, 0),
      new THREE.Vector3(-xOffset, 0, -segmentLength)  
    ]);
    this.group.add(new THREE.Line(leftGeom, material));

    const rightGeom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(xOffset, 0, 0),
      new THREE.Vector3(xOffset, 0, -segmentLength)  
    ]);
    this.group.add(new THREE.Line(rightGeom, material));
  }
}