import * as THREE from 'three';

export class VisualVectors {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);
  }

  clear() {
    while (this.group.children.length > 0) {
      const obj = this.group.children[0];
      this.group.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) obj.material.dispose();
    }
  }

  showContainer(center, size = { x: 2, y: 1.5, z: 2 }) {
    this.clear();

    // Translucent glowing container wireframe & volume
    const boxGeo = new THREE.BoxGeometry(size.x, size.y, size.z);
    const boxMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.8
    });
    const box = new THREE.Mesh(boxGeo, boxMat);
    box.position.set(center.x, center.y + size.y / 2, center.z);
    this.group.add(box);

    // Subtle volume tint
    const tintMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.15
    });
    const tint = new THREE.Mesh(boxGeo, tintMat);
    tint.position.copy(box.position);
    this.group.add(tint);
  }

  showSurface(center, size = { x: 2.6, z: 2.0 }) {
    this.clear();

    // Glowing surface grid plane
    const planeGeo = new THREE.PlaneGeometry(size.x, size.z, 6, 6);
    planeGeo.rotateX(-Math.PI / 2);
    const planeMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      wireframe: true,
      transparent: true,
      opacity: 0.85
    });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.position.set(center.x, center.y + 0.05, center.z);
    this.group.add(plane);
  }

  showCoordinatePoint(center) {
    this.clear();

    // Glowing target ring on ground
    const ringGeo = new THREE.RingGeometry(0.5, 0.65, 24);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xec4899,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.set(center.x, center.y + 0.05, center.z);
    this.group.add(ring);
  }

  showArrow(from, to, color = 0x22c55e) {
    this.clear();

    const fromVec = new THREE.Vector3(from.x, from.y, from.z);
    const toVec = new THREE.Vector3(to.x, to.y, to.z);
    const dir = new THREE.Vector3().subVectors(toVec, fromVec);
    const length = dir.length();
    dir.normalize();

    const arrow = new THREE.ArrowHelper(dir, fromVec, length, color, 0.6, 0.4);
    this.group.add(arrow);
  }
}
