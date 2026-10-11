import * as THREE from 'three';

export class TimeZone {
  constructor() {
    this.group = new THREE.Group();

    this.targets = {
      time_pyramid_base: { x: 8, y: 1.4, z: -4 },
      time_pyramid_mid: { x: 8, y: 2.6, z: -4 },
      time_pyramid_top: { x: 8, y: 3.8, z: -4 }
    };

    this.buildMeshes();
  }

  buildMeshes() {
    const pyramidCenter = { x: 8, y: 0.9, z: -4 };

    // 1. Tier 1 Base: IN (Large square platform)
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x6366f1, // Indigo
      roughness: 0.5,
      flatShading: true
    });
    const baseMesh = new THREE.Mesh(new THREE.BoxGeometry(6.0, 1.0, 6.0), baseMat);
    baseMesh.position.set(pyramidCenter.x, pyramidCenter.y + 0.5, pyramidCenter.z);
    baseMesh.receiveShadow = true;
    baseMesh.castShadow = true;
    this.group.add(baseMesh);

    // 2. Tier 2 Mid: ON (Medium square step)
    const midMat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6, // Purple
      roughness: 0.5,
      flatShading: true
    });
    const midMesh = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.2, 4.2), midMat);
    midMesh.position.set(pyramidCenter.x, pyramidCenter.y + 1.6, pyramidCenter.z);
    midMesh.receiveShadow = true;
    midMesh.castShadow = true;
    this.group.add(midMesh);

    // 3. Tier 3 Top: AT (Sharp needle summit)
    const topMat = new THREE.MeshStandardMaterial({
      color: 0xec4899, // Pink
      roughness: 0.4,
      flatShading: true
    });
    const topMesh = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.2, 2.4), topMat);
    topMesh.position.set(pyramidCenter.x, pyramidCenter.y + 2.8, pyramidCenter.z);
    topMesh.receiveShadow = true;
    topMesh.castShadow = true;
    this.group.add(topMesh);

    // Floating Golden Clock Dial above peak
    const dialMat = new THREE.MeshBasicMaterial({ color: 0xfacc15, wireframe: true });
    this.dial = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.08, 8, 24), dialMat);
    this.dial.position.set(pyramidCenter.x, pyramidCenter.y + 4.8, pyramidCenter.z);
    this.dial.rotation.x = Math.PI / 4;
    this.group.add(this.dial);

    // Glowing Summit Gem
    const gemGeo = new THREE.OctahedronGeometry(0.5, 0);
    const gemMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      roughness: 0.1
    });
    this.gem = new THREE.Mesh(gemGeo, gemMat);
    this.gem.position.set(pyramidCenter.x, pyramidCenter.y + 4.8, pyramidCenter.z);
    this.group.add(this.gem);
  }

  update(delta = 0.016, elapsed = 0) {
    if (this.dial) {
      this.dial.rotation.z += delta * 0.5;
    }
    if (this.gem) {
      this.gem.rotation.y += delta * 1.2;
      this.gem.position.y = 5.7 + Math.sin(elapsed * 2) * 0.15;
    }
  }
}
