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

    const halfWidth = roadWidth / 2;

    const lineMaterial = new THREE.LineBasicMaterial({
      color: roadColor,
      fog: true,
      linewidth: 3, 
    });

   
    [-edgeThickness, 0, edgeThickness].forEach(offset => {
      const leftGeom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-halfWidth + offset, 0, 0),
        new THREE.Vector3(-halfWidth + offset, 0, -segmentLength),
      ]);
      this.group.add(new THREE.Line(leftGeom, lineMaterial));

      const rightGeom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(halfWidth + offset, 0, 0),
        new THREE.Vector3(halfWidth + offset, 0, -segmentLength),
      ]);
      this.group.add(new THREE.Line(rightGeom, lineMaterial));
    });

    let z = 0;
    while (z > -segmentLength) {
      const dashEnd = Math.max(z - dashLength, -segmentLength);
      
      const dashGeom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, z),
        new THREE.Vector3(0, 0, dashEnd),
      ]);

      [-edgeThickness, 0, edgeThickness].forEach(offset => {
        const dash = new THREE.Line(dashGeom, lineMaterial);
        dash.position.x = offset;
        this.group.add(dash);
      });

      z -= (dashLength + dashGap);
    }
  }

  addTo(scene) {
    scene.add(this.group);
  }
}