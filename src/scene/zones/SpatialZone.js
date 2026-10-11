import * as THREE from 'three';

export class SpatialZone {
  constructor() {
    this.group = new THREE.Group();

    this.targets = {
      box: { x: -6, y: 1.0, z: -4 },
      table: { x: -7, y: 1.0, z: 3 },
      bus_stop: { x: -2, y: 1.0, z: 8 },
      tunnel: { x: -8, y: 1.0, z: -9 },
      bridge: { x: 0, y: 1.3, z: -4 },
      house: { x: -11, y: 1.0, z: 0 },
      tree: { x: -4, y: 1.0, z: -1 },
      bench: { x: -3, y: 1.0, z: 4 },
      two_pillars: { x: -1, y: 1.0, z: -7 },
      lake: { x: 2, y: -0.4, z: -4 },
      river_path: { x: 0, y: 1.0, z: 0 }
    };

    this.buildMeshes();
  }

  buildMeshes() {
    // 1. Box (Container)
    const boxGroup = new THREE.Group();
    boxGroup.position.set(this.targets.box.x, 0.9, this.targets.box.z);

    const boxMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.65,
      roughness: 0.2,
      metalness: 0.1
    });
    const rimMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4 });

    // Open box walls
    const floor = new THREE.Mesh(new THREE.BoxGeometry(2, 0.1, 2), rimMat);
    floor.receiveShadow = true;
    boxGroup.add(floor);

    const wallN = new THREE.Mesh(new THREE.BoxGeometry(2, 1.2, 0.1), boxMat);
    wallN.position.set(0, 0.6, -0.95);
    boxGroup.add(wallN);

    const wallS = new THREE.Mesh(new THREE.BoxGeometry(2, 1.2, 0.1), boxMat);
    wallS.position.set(0, 0.6, 0.95);
    boxGroup.add(wallS);

    const wallW = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.2, 1.8), boxMat);
    wallW.position.set(-0.95, 0.6, 0);
    boxGroup.add(wallW);

    const wallE = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.2, 1.8), boxMat);
    wallE.position.set(0.95, 0.6, 0);
    boxGroup.add(wallE);

    this.group.add(boxGroup);

    // 2. Table (2D Surface)
    const tableGroup = new THREE.Group();
    tableGroup.position.set(this.targets.table.x, 0.9, this.targets.table.z);

    const woodMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.6, flatShading: true });
    const top = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.18, 1.8), woodMat);
    top.position.y = 1.0;
    top.castShadow = true;
    top.receiveShadow = true;
    tableGroup.add(top);

    const legGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.0, 6);
    const legPositions = [
      [-1.0, 0.5, -0.7],
      [1.0, 0.5, -0.7],
      [-1.0, 0.5, 0.7],
      [1.0, 0.5, 0.7]
    ];
    legPositions.forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(legGeo, woodMat);
      leg.position.set(x, y, z);
      leg.castShadow = true;
      tableGroup.add(leg);
    });
    this.group.add(tableGroup);

    // 3. Bus Stop & Low-Poly Bus
    const busStopGroup = new THREE.Group();
    busStopGroup.position.set(this.targets.bus_stop.x, 0.9, this.targets.bus_stop.z);

    // Shelter post & sign
    const poleGeo = new THREE.CylinderGeometry(0.06, 0.06, 2.4, 6);
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.3, metalness: 0.7 });
    const pole = new THREE.Mesh(poleGeo, metalMat);
    pole.position.y = 1.2;
    pole.castShadow = true;
    busStopGroup.add(pole);

    const signGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.08, 12);
    signGeo.rotateX(Math.PI / 2);
    const signMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.4 });
    const sign = new THREE.Mesh(signGeo, signMat);
    sign.position.set(0, 2.2, 0);
    busStopGroup.add(sign);

    // Cute yellow city bus parked nearby
    const busMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4, flatShading: true });
    const busBody = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.8, 1.9), busMat);
    busBody.position.set(2.5, 1.0, 1.2);
    busBody.castShadow = true;
    busStopGroup.add(busBody);

    // Open roof/deck on bus (you stand ON the bus!)
    const deckMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 });
    const busDeck = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.1, 1.7), deckMat);
    busDeck.position.set(2.5, 1.95, 1.2);
    busStopGroup.add(busDeck);

    this.group.add(busStopGroup);

    // 4. Tunnel through Grassy Hill
    const tunnelGroup = new THREE.Group();
    tunnelGroup.position.set(this.targets.tunnel.x, 0.9, this.targets.tunnel.z);

    // Hill arch
    const hillGeo = new THREE.SphereGeometry(3.2, 8, 8, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const hillMat = new THREE.MeshStandardMaterial({ color: 0x4ade80, roughness: 0.8, flatShading: true });
    const hill = new THREE.Mesh(hillGeo, hillMat);
    hill.castShadow = true;
    tunnelGroup.add(hill);

    // Tunnel cylinder hole
    const archMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.8, flatShading: true, side: THREE.BackSide });
    const tubeGeo = new THREE.CylinderGeometry(1.2, 1.2, 6.0, 8, 1, true);
    tubeGeo.rotateZ(Math.PI / 2);
    const tube = new THREE.Mesh(tubeGeo, archMat);
    tube.position.y = 1.0;
    tunnelGroup.add(tube);

    this.group.add(tunnelGroup);

    // 5. Arched Bridge over River
    const bridgeGroup = new THREE.Group();
    bridgeGroup.position.set(this.targets.bridge.x, 1.1, this.targets.bridge.z);

    const bridgeDeck = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.25, 1.8), woodMat);
    bridgeDeck.castShadow = true;
    bridgeDeck.receiveShadow = true;
    bridgeGroup.add(bridgeDeck);

    // Handrails
    const railGeo = new THREE.BoxGeometry(4.5, 0.4, 0.1);
    const railL = new THREE.Mesh(railGeo, woodMat);
    railL.position.set(0, 0.4, -0.85);
    bridgeGroup.add(railL);

    const railR = new THREE.Mesh(railGeo, woodMat);
    railR.position.set(0, 0.4, 0.85);
    bridgeGroup.add(railR);

    this.group.add(bridgeGroup);

    // 6. House
    const houseGroup = new THREE.Group();
    houseGroup.position.set(this.targets.house.x, 0.9, this.targets.house.z);

    const walls = new THREE.Mesh(new THREE.BoxGeometry(3.0, 2.2, 2.8), new THREE.MeshStandardMaterial({ color: 0xfef08a, flatShading: true }));
    walls.position.y = 1.1;
    walls.castShadow = true;
    houseGroup.add(walls);

    const roof = new THREE.Mesh(new THREE.ConeGeometry(2.6, 1.5, 4), new THREE.MeshStandardMaterial({ color: 0xe11d48, flatShading: true }));
    roof.position.y = 2.95;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    houseGroup.add(roof);

    this.group.add(houseGroup);

    // 7. Trees & Bench
    const treeGroup = new THREE.Group();
    treeGroup.position.set(this.targets.tree.x, 0.9, this.targets.tree.z);

    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 1.5, 6), woodMat);
    trunk.position.y = 0.75;
    trunk.castShadow = true;
    treeGroup.add(trunk);

    const foliage = new THREE.Mesh(new THREE.ConeGeometry(1.4, 2.2, 6), new THREE.MeshStandardMaterial({ color: 0x15803d, flatShading: true }));
    foliage.position.y = 2.4;
    foliage.castShadow = true;
    treeGroup.add(foliage);

    this.group.add(treeGroup);

    // Park bench
    const benchGroup = new THREE.Group();
    benchGroup.position.set(this.targets.bench.x, 0.9, this.targets.bench.z);
    const seat = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.12, 0.7), woodMat);
    seat.position.y = 0.45;
    seat.castShadow = true;
    benchGroup.add(seat);
    this.group.add(benchGroup);

    // Two stone pillars (for "between")
    const pillarGeo = new THREE.CylinderGeometry(0.35, 0.4, 2.0, 6);
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, flatShading: true });
    const p1 = new THREE.Mesh(pillarGeo, pillarMat);
    p1.position.set(this.targets.two_pillars.x - 1.2, 1.9, this.targets.two_pillars.z);
    p1.castShadow = true;
    this.group.add(p1);

    const p2 = new THREE.Mesh(pillarGeo, pillarMat);
    p2.position.set(this.targets.two_pillars.x + 1.2, 1.9, this.targets.two_pillars.z);
    p2.castShadow = true;
    this.group.add(p2);
  }
}
