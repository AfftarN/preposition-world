import * as THREE from 'three';

export class CollocationZone {
  constructor() {
    this.group = new THREE.Group();

    this.targets = {
      stage_guitar: { x: 6, y: 1.3, z: 5 },
      observatory_telescope: { x: 9, y: 1.3, z: 2 },
      balance_scales: { x: 4, y: 1.3, z: 8 }
    };

    this.buildMeshes();
  }

  buildMeshes() {
    // 1. Performance Stage & Guitar (Good at / Famous for / Congratulate on)
    const stageGroup = new THREE.Group();
    stageGroup.position.set(this.targets.stage_guitar.x, 0.9, this.targets.stage_guitar.z);

    // Round wooden stage
    const stageMat = new THREE.MeshStandardMaterial({ color: 0x9333ea, roughness: 0.6, flatShading: true });
    const stage = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.4, 0.4, 16), stageMat);
    stage.position.y = 0.2;
    stage.receiveShadow = true;
    stageGroup.add(stage);

    // Red Electric Guitar model
    const guitarGroup = new THREE.Group();
    guitarGroup.position.set(0.6, 0.9, 0);
    guitarGroup.rotation.z = -Math.PI / 6;

    const gBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.7, 0.12),
      new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 })
    );
    guitarGroup.add(gBody);

    const gNeck = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.8, 0.08),
      new THREE.MeshStandardMaterial({ color: 0xfef08a })
    );
    gNeck.position.y = 0.6;
    guitarGroup.add(gNeck);

    stageGroup.add(guitarGroup);
    this.group.add(stageGroup);

    // 2. Observatory Dome & Telescope (Interested in)
    const obsGroup = new THREE.Group();
    obsGroup.position.set(this.targets.observatory_telescope.x, 0.9, this.targets.observatory_telescope.z);

    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(1.6, 1.8, 1.2, 12),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7, flatShading: true })
    );
    base.position.y = 0.6;
    base.receiveShadow = true;
    obsGroup.add(base);

    // Brass Telescope
    const teleMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.7, roughness: 0.3 });
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.12, 1.8, 8), teleMat);
    tube.position.set(0, 1.6, 0);
    tube.rotation.x = Math.PI / 4;
    tube.rotation.z = -Math.PI / 6;
    tube.castShadow = true;
    obsGroup.add(tube);

    this.group.add(obsGroup);

    // 3. Balance Scales / Lever (Depend on)
    const scaleGroup = new THREE.Group();
    scaleGroup.position.set(this.targets.balance_scales.x, 0.9, this.targets.balance_scales.z);

    const metalMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.6, roughness: 0.4 });
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 1.8, 8), metalMat);
    stem.position.y = 0.9;
    stem.castShadow = true;
    scaleGroup.add(stem);

    // Tilting beam
    this.scaleBeam = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.08, 0.08), metalMat);
    this.scaleBeam.position.y = 1.8;
    scaleGroup.add(this.scaleBeam);

    // Hanging plates
    const plateGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.04, 12);
    const p1 = new THREE.Mesh(plateGeo, metalMat);
    p1.position.set(-0.8, 1.3, 0);
    scaleGroup.add(p1);

    const p2 = new THREE.Mesh(plateGeo, metalMat);
    p2.position.set(0.8, 1.3, 0);
    scaleGroup.add(p2);

    this.group.add(scaleGroup);
  }

  update(delta = 0.016, elapsed = 0) {
    if (this.scaleBeam) {
      this.scaleBeam.rotation.z = Math.sin(elapsed * 2) * 0.12;
    }
  }
}
