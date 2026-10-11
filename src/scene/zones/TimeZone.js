import * as THREE from 'three';
import { createBillboardSprite } from '../Billboard.js';

export class TimeZone {
  constructor() {
    this.group = new THREE.Group();

    this.targets = {
      time_pyramid_base: { x: 8, y: 1.95, z: -4 }, // IN: Years, Months (Platform 1)
      time_pyramid_mid: { x: 8, y: 3.15, z: -4 },  // ON: Days, Dates (Platform 2)
      time_pyramid_top: { x: 8, y: 4.35, z: -4 }   // AT: Exact Clock Points (Summit)
    };

    this.buildMeshes();
  }

  buildMeshes() {
    const center = { x: 8, y: 0.9, z: -4 };

    // --- 1. TIER 1: BASE (IN - Broad time: Years, Centuries, Months, Seasons) ---
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x4338ca, // Deep Indigo
      roughness: 0.5,
      flatShading: true
    });
    const baseMesh = new THREE.Mesh(new THREE.BoxGeometry(6.6, 1.0, 6.6), baseMat);
    baseMesh.position.set(center.x, center.y + 0.5, center.z);
    baseMesh.receiveShadow = true;
    baseMesh.castShadow = true;
    this.group.add(baseMesh);

    // Glowing Neon Edge for Tier 1
    const edge1 = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(6.64, 1.02, 6.64)),
      new THREE.LineBasicMaterial({ color: 0x818cf8, linewidth: 2 })
    );
    edge1.position.set(center.x, center.y + 0.5, center.z);
    this.group.add(edge1);

    // Billboard Sprite always facing camera for Tier 1 (IN)
    const inSprite = createBillboardSprite('IN (Broad Time)', 'in 2026 • in July • in summer', '#818cf8', 'rgba(30, 27, 75, 0.94)');
    inSprite.position.set(center.x, center.y + 0.6, center.z + 3.8);
    this.group.add(inSprite);

    // --- 2. TIER 2: MIDDLE (ON - Days & Dates: Friday, July 4th, Birthday) ---
    const midMat = new THREE.MeshStandardMaterial({
      color: 0x7e22ce, // Purple
      roughness: 0.5,
      flatShading: true
    });
    const midMesh = new THREE.Mesh(new THREE.BoxGeometry(4.6, 1.2, 4.6), midMat);
    midMesh.position.set(center.x, center.y + 1.6, center.z);
    midMesh.receiveShadow = true;
    midMesh.castShadow = true;
    this.group.add(midMesh);

    // Glowing Neon Edge for Tier 2
    const edge2 = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(4.64, 1.22, 4.64)),
      new THREE.LineBasicMaterial({ color: 0xc084fc, linewidth: 2 })
    );
    edge2.position.set(center.x, center.y + 1.6, center.z);
    this.group.add(edge2);

    // Billboard Sprite always facing camera for Tier 2 (ON)
    const onSprite = createBillboardSprite('ON (Days & Dates)', 'on Friday • on July 4th', '#c084fc', 'rgba(59, 7, 100, 0.94)');
    onSprite.position.set(center.x, center.y + 1.8, center.z + 2.8);
    this.group.add(onSprite);

    // 3D Calendar Desk Page sitting on Tier 2
    const calStand = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.6, 0.2),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 })
    );
    calStand.position.set(center.x + 1.6, center.y + 2.5, center.z - 1.2);
    calStand.rotation.y = -Math.PI / 4;
    calStand.castShadow = true;
    this.group.add(calStand);

    // --- 3. TIER 3: APEX (AT - Exact Needle Clock Points: 5:00 PM, noon) ---
    const topMat = new THREE.MeshStandardMaterial({
      color: 0xbe185d, // Magenta / Pink
      roughness: 0.4,
      flatShading: true
    });
    const topMesh = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.2, 2.4), topMat);
    topMesh.position.set(center.x, center.y + 2.8, center.z);
    topMesh.receiveShadow = true;
    topMesh.castShadow = true;
    this.group.add(topMesh);

    // Glowing Neon Edge for Tier 3
    const edge3 = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(2.44, 1.22, 2.44)),
      new THREE.LineBasicMaterial({ color: 0xf472b6, linewidth: 2 })
    );
    edge3.position.set(center.x, center.y + 2.8, center.z);
    this.group.add(edge3);

    // Billboard Sprite always facing camera for Tier 3 (AT)
    const atSprite = createBillboardSprite('AT (Clock Point)', 'at 5:00 PM • at noon', '#f472b6', 'rgba(80, 7, 36, 0.94)');
    atSprite.position.set(center.x, center.y + 5.4, center.z);
    this.group.add(atSprite);

    // Big 3D Clock Dial on Apex
    const clockGroup = new THREE.Group();
    clockGroup.position.set(center.x, center.y + 4.2, center.z);

    const clockFace = new THREE.Mesh(
      new THREE.CylinderGeometry(0.7, 0.7, 0.1, 24),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 })
    );
    clockFace.rotation.x = Math.PI / 2;
    clockGroup.add(clockFace);

    const clockRim = new THREE.Mesh(
      new THREE.TorusGeometry(0.72, 0.08, 8, 24),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.2 })
    );
    clockGroup.add(clockRim);

    // Hour hand & Minute hand
    const handMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
    this.hourHand = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.32, 0.02), handMat);
    this.hourHand.position.set(0, 0.12, 0.08);
    clockGroup.add(this.hourHand);

    this.minuteHand = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.48, 0.02), handMat);
    this.minuteHand.position.set(0, 0.18, 0.09);
    clockGroup.add(this.minuteHand);

    // Apex Spire Needle Point
    const spireGeo = new THREE.ConeGeometry(0.1, 0.7, 8);
    const spireMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, emissive: 0xbe185d, roughness: 0.2 });
    const spire = new THREE.Mesh(spireGeo, spireMat);
    spire.position.y = 0.9;
    clockGroup.add(spire);

    this.group.add(clockGroup);
  }

  update(delta = 0.016, elapsed = 0) {
    if (this.minuteHand) {
      this.minuteHand.rotation.z -= delta * 1.5;
    }
    if (this.hourHand) {
      this.hourHand.rotation.z -= delta * 0.15;
    }
  }
}
