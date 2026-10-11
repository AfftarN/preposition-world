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

    // Translucent glowing container wireframe & volume (IN)
    const boxGeo = new THREE.BoxGeometry(size.x, size.y, size.z);
    const boxMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.85
    });
    const box = new THREE.Mesh(boxGeo, boxMat);
    box.position.set(center.x, center.y + size.y / 2, center.z);
    this.group.add(box);

    const tintMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.2
    });
    const tint = new THREE.Mesh(boxGeo, tintMat);
    tint.position.copy(box.position);
    this.group.add(tint);
  }

  showSurface(center, size = { x: 2.6, z: 2.0 }) {
    this.clear();

    // Glowing surface grid plane (ON - 2D Surface Contact)
    const planeGeo = new THREE.PlaneGeometry(size.x, size.z, 6, 6);
    planeGeo.rotateX(-Math.PI / 2);
    const planeMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      wireframe: true,
      transparent: true,
      opacity: 0.9
    });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.position.set(center.x, center.y + 0.02, center.z);
    this.group.add(plane);

    // Glowing border frame around the surface
    const edges = new THREE.EdgesGeometry(new THREE.BoxGeometry(size.x, 0.04, size.z));
    const lineMat = new THREE.LineBasicMaterial({ color: 0xfbbf24, linewidth: 2 });
    const wireframe = new THREE.LineSegments(edges, lineMat);
    wireframe.position.set(center.x, center.y + 0.02, center.z);
    this.group.add(wireframe);

    // Footprint contact rings under feet
    const footRingGeo = new THREE.RingGeometry(0.12, 0.22, 16);
    footRingGeo.rotateX(-Math.PI / 2);
    const footRingMat = new THREE.MeshBasicMaterial({ color: 0x22c55e, side: THREE.DoubleSide });

    const leftContact = new THREE.Mesh(footRingGeo, footRingMat);
    leftContact.position.set(center.x - 0.25, center.y + 0.03, center.z);
    this.group.add(leftContact);

    const rightContact = new THREE.Mesh(footRingGeo, footRingMat);
    rightContact.position.set(center.x + 0.25, center.y + 0.03, center.z);
    this.group.add(rightContact);
  }

  showCoordinatePoint(center, showPin = true) {
    this.clear();

    // Concentric target rings flat on ground
    const ring1 = new THREE.Mesh(
      new THREE.RingGeometry(0.35, 0.45, 24).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: 0xec4899, side: THREE.DoubleSide })
    );
    ring1.position.set(center.x, center.y + 0.02, center.z);
    this.group.add(ring1);

    const ring2 = new THREE.Mesh(
      new THREE.RingGeometry(0.65, 0.75, 24).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: 0xf472b6, transparent: true, opacity: 0.5, side: THREE.DoubleSide })
    );
    ring2.position.set(center.x, center.y + 0.02, center.z);
    this.group.add(ring2);

    if (showPin) {
      // Slender vertical light beacon
      const beamGeo = new THREE.CylinderGeometry(0.02, 0.02, 2.5, 8);
      const beamMat = new THREE.MeshBasicMaterial({ color: 0xec4899, transparent: true, opacity: 0.5 });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.set(center.x, center.y + 1.25, center.z);
      this.group.add(beam);

      // Floating 3D Map Pin
      const pinGroup = new THREE.Group();
      pinGroup.position.set(center.x, center.y + 2.5, center.z);

      const pinHead = new THREE.Mesh(
        new THREE.SphereGeometry(0.28, 12, 12),
        new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.2 })
      );
      pinGroup.add(pinHead);

      const pinCone = new THREE.Mesh(
        new THREE.ConeGeometry(0.28, 0.4, 12),
        new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.2 })
      );
      pinCone.rotation.x = Math.PI;
      pinCone.position.y = -0.25;
      pinGroup.add(pinCone);

      this.group.add(pinGroup);
    }
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
