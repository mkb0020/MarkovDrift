// RoadSegment.js
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { WorldConfig } from "./WorldConfig.js";

export class RoadSegment {
  constructor(position, direction) {
    this.group = new THREE.Group();

    this.buildGeometry();

    this.group.position.copy(position);
    this.group.rotation.y = direction;
  }

  buildGeometry() {
    const {
      roadWidth,
      segmentLength,
      edgeThickness,
      dashLength,
      dashGap,
      roadColor,
    } = WorldConfig;

    const edgeOffset = roadWidth / 2;

    const edgeMaterial = new THREE.LineBasicMaterial({
      color: roadColor,
      fog: true,
    });

    const dashMaterial = new THREE.LineBasicMaterial({
      color: roadColor,
      fog: true,
    });

    [-edgeThickness, edgeThickness].forEach(offset => {
      const leftGeom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-edgeOffset, 0, 0),
        new THREE.Vector3(-edgeOffset, 0, segmentLength),
      ]);

      const leftLine = new THREE.Line(leftGeom, edgeMaterial);
      leftLine.position.x = offset;
      this.group.add(leftLine);
    });

    [-edgeThickness, edgeThickness].forEach(offset => {
      const rightGeom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(edgeOffset, 0, 0),
        new THREE.Vector3(edgeOffset, 0, segmentLength),
      ]);

      const rightLine = new THREE.Line(rightGeom, edgeMaterial);
      rightLine.position.x = offset;
      this.group.add(rightLine);
    });

    let z = 0;
    while (z < segmentLength) {
      const dashGeom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, z),
        new THREE.Vector3(0, 0, z + dashLength),
      ]);

      [-edgeThickness, edgeThickness].forEach(offset => {
        const dash = new THREE.Line(dashGeom, dashMaterial);
        dash.position.x = offset;
        this.group.add(dash);
      });

      z += dashLength + dashGap;
    }
  }

  addTo(scene) {
    scene.add(this.group);
  }

  removeFrom(scene) {
    scene.remove(this.group);
  }

  get mesh() {
    return this.group;
  }
}
