import * as THREE from 'three';

function createRiserTexture(tierName, examples, accentColor, bgColor = '#0f172a') {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 8;
  ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);

  // Left tag
  ctx.fillStyle = accentColor;
  ctx.font = 'bold 72px sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(tierName, 30, 80);

  // Right examples
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 44px sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.fillText(examples, 990, 80);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export class TimeZone {
  constructor() {
    this.group = new THREE.Group();

    // Calibrated target coordinates so Pip stands on the front platform of each step
    this.targets = {
      time_pyramid_base: { x: 8, y: 1.95, z: -2.3 }, // Tier 1: IN (Years, Months, Seasons)
      time_pyramid_mid: { x: 8, y: 3.15, z: -2.5 },  // Tier 2: ON (Days, Dates)
      time_pyramid_top: { x: 8, y: 4.35, z: -2.8 }   // Tier 3: AT (Exact Clock Moments)
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
    const baseMesh = new THREE.Mesh(new THREE.BoxGeometry(7.2, 1.0, 7.2), baseMat);
    baseMesh.position.set(center.x, center.y + 0.5, center.z);
    baseMesh.receiveShadow = true;
    baseMesh.castShadow = true;
    this.group.add(baseMesh);

    // Glowing Neon Edge for Tier 1
    const edge1 = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(7.22, 1.02, 7.22)),
      new THREE.LineBasicMaterial({ color: 0x818cf8, linewidth: 2 })
    );
    edge1.position.set(center.x, center.y + 0.5, center.z);
    this.group.add(edge1);

    // Front Step Riser Sign for Tier 1 (IN)
    const inTex = createRiserTexture('IN (Years • Months)', 'in 2026 • in July • in summer', '#818cf8', '#1e1b4b');
    if (inTex) {
      const riser1 = new THREE.Mesh(
        new THREE.PlaneGeometry(6.8, 0.8),
        new THREE.MeshBasicMaterial({ map: inTex })
      );
      riser1.position.set(center.x, center.y + 0.5, center.z + 3.61);
      this.group.add(riser1);
    }

    // --- 2. TIER 2: MIDDLE (ON - Days & Dates: Friday, July 4th, Birthday) ---
    const midMat = new THREE.MeshStandardMaterial({
      color: 0x7e22ce, // Purple
      roughness: 0.5,
      flatShading: true
    });
    const midMesh = new THREE.Mesh(new THREE.BoxGeometry(5.0, 1.2, 5.0), midMat);
    midMesh.position.set(center.x, center.y + 1.6, center.z);
    midMesh.receiveShadow = true;
    midMesh.castShadow = true;
    this.group.add(midMesh);

    // Glowing Neon Edge for Tier 2
    const edge2 = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(5.02, 1.22, 5.02)),
      new THREE.LineBasicMaterial({ color: 0xc084fc, linewidth: 2 })
    );
    edge2.position.set(center.x, center.y + 1.6, center.z);
    this.group.add(edge2);

    // Front Step Riser Sign for Tier 2 (ON)
    const onTex = createRiserTexture('ON (Days & Dates)', 'on Friday • on July 4th', '#c084fc', '#3b0764');
    if (onTex) {
      const riser2 = new THREE.Mesh(
        new THREE.PlaneGeometry(4.6, 0.8),
        new THREE.MeshBasicMaterial({ map: onTex })
      );
      riser2.position.set(center.x, center.y + 1.6, center.z + 2.51);
      this.group.add(riser2);
    }

    // 3D Calendar Desk Page sitting on Tier 2
    const calStand = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.5, 0.15),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 })
    );
    calStand.position.set(center.x + 1.8, center.y + 2.45, center.z - 1.0);
    calStand.rotation.y = -Math.PI / 4;
    calStand.castShadow = true;
    this.group.add(calStand);

    // --- 3. TIER 3: APEX (AT - Exact Needle Clock Points: 5:00 PM, noon) ---
    const topMat = new THREE.MeshStandardMaterial({
      color: 0xbe185d, // Magenta / Pink
      roughness: 0.4,
      flatShading: true
    });
    const topMesh = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.2, 2.6), topMat);
    topMesh.position.set(center.x, center.y + 2.8, center.z);
    topMesh.receiveShadow = true;
    topMesh.castShadow = true;
    this.group.add(topMesh);

    // Glowing Neon Edge for Tier 3
    const edge3 = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(2.62, 1.22, 2.62)),
      new THREE.LineBasicMaterial({ color: 0xf472b6, linewidth: 2 })
    );
    edge3.position.set(center.x, center.y + 2.8, center.z);
    this.group.add(edge3);

    // Front Step Riser Sign for Tier 3 (AT)
    const atTex = createRiserTexture('AT (Clock Moments)', 'at 5:00 PM • at noon', '#f472b6', '#500724');
    if (atTex) {
      const riser3 = new THREE.Mesh(
        new THREE.PlaneGeometry(2.4, 0.8),
        new THREE.MeshBasicMaterial({ map: atTex })
      );
      riser3.position.set(center.x, center.y + 2.8, center.z + 1.31);
      this.group.add(riser3);
    }

    // Big 3D Clock Dial on Apex
    const clockGroup = new THREE.Group();
    clockGroup.position.set(center.x, center.y + 4.1, center.z - 0.4);

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
    const spireGeo = new THREE.ConeGeometry(0.1, 0.8, 8);
    const spireMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, emissive: 0xbe185d, roughness: 0.2 });
    const spire = new THREE.Mesh(spireGeo, spireMat);
    spire.position.y = 0.95;
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
