import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CameraManager } from './CameraManager.js';

export class World {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.zones = [];
    this.updatables = [];

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xdbeafe); // Soft sky blue
    this.scene.fog = new THREE.FogExp2(0xdbeafe, 0.015);

    // 2. Camera (Isometric Perspective)
    const aspect = (canvasElement.clientWidth || window.innerWidth) / (canvasElement.clientHeight || window.innerHeight);
    this.camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 1000);
    this.camera.position.set(22, 18, 22);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(canvasElement.clientWidth || window.innerWidth, canvasElement.clientHeight || window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 4. Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2.15; // Don't flip under ground
    this.controls.minDistance = 5;
    this.controls.maxDistance = 60;

    // 5. Camera Manager
    this.cameraManager = new CameraManager(this.camera, this.controls);

    // 6. Lighting & Environment
    this.setupLighting();
    this.setupIslandBase();

    // 7. Event listeners
    this.clock = new THREE.Clock();
    this.onWindowResize = this.onWindowResize.bind(this);
    window.addEventListener('resize', this.onWindowResize);
  }

  setupLighting() {
    // Ambient Light (Soft pastel illumination)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    // Main Directional Sun Light
    const sunLight = new THREE.DirectionalLight(0xfff7ed, 1.2);
    sunLight.position.set(25, 35, 15);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 100;
    const d = 25;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    sunLight.shadow.bias = -0.0005;
    this.scene.add(sunLight);

    // Soft Hemisphere Light (Sky & Ground bounce)
    const hemiLight = new THREE.HemisphereLight(0xbae6fd, 0xdcfce7, 0.5);
    this.scene.add(hemiLight);
  }

  setupIslandBase() {
    // 1. Water Plane (Animated low-poly)
    const waterGeo = new THREE.PlaneGeometry(120, 120, 32, 32);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.2,
      metalness: 0.1,
      flatShading: true,
      transparent: true,
      opacity: 0.85
    });
    this.waterMesh = new THREE.Mesh(waterGeo, waterMat);
    this.waterMesh.rotation.x = -Math.PI / 2;
    this.waterMesh.position.y = -1.2;
    this.scene.add(this.waterMesh);

    // 2. Floating Island Rock / Grass Base
    const islandGroup = new THREE.Group();

    // Main Grass Top (Hexagonal / Organic Rounded Slab)
    const topGeo = new THREE.CylinderGeometry(16, 17, 2, 8);
    const topMat = new THREE.MeshStandardMaterial({
      color: 0x86efac, // Vibrant mint grass
      roughness: 0.8,
      flatShading: true
    });
    const topMesh = new THREE.Mesh(topGeo, topMat);
    topMesh.position.y = 0;
    topMesh.receiveShadow = true;
    islandGroup.add(topMesh);

    // Earth / Dirt Core
    const dirtGeo = new THREE.CylinderGeometry(17, 14, 3, 8);
    const dirtMat = new THREE.MeshStandardMaterial({
      color: 0xb45309, // Earthy clay brown
      roughness: 0.9,
      flatShading: true
    });
    const dirtMesh = new THREE.Mesh(dirtGeo, dirtMat);
    dirtMesh.position.y = -2;
    dirtMesh.receiveShadow = true;
    islandGroup.add(dirtMesh);

    // Floating Rock Bottom Cone
    const rockGeo = new THREE.ConeGeometry(14, 8, 8);
    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x64748b, // Slate rock
      roughness: 0.95,
      flatShading: true
    });
    const rockMesh = new THREE.Mesh(rockGeo, rockMat);
    rockMesh.rotation.x = Math.PI;
    rockMesh.position.y = -7.5;
    islandGroup.add(rockMesh);

    // Add path cobbles across island
    const pathGeo = new THREE.BoxGeometry(1.6, 0.15, 1.2);
    const pathMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.9, flatShading: true });
    for (let i = -7; i <= 7; i += 2) {
      const stone = new THREE.Mesh(pathGeo, pathMat);
      stone.position.set(i * 0.8, 1.05, Math.sin(i * 0.5) * 2);
      stone.rotation.y = (Math.random() - 0.5) * 0.2;
      stone.receiveShadow = true;
      islandGroup.add(stone);
    }

    this.scene.add(islandGroup);
  }

  addUpdatable(obj) {
    this.updatables.push(obj);
  }

  onWindowResize() {
    const width = this.canvas.clientWidth || window.innerWidth;
    const height = this.canvas.clientHeight || window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate(callback) {
    const renderLoop = () => {
      requestAnimationFrame(renderLoop);
      const delta = this.clock.getDelta();
      const elapsed = this.clock.getElapsedTime();

      // Gentle water ripple
      if (this.waterMesh) {
        this.waterMesh.position.y = -1.2 + Math.sin(elapsed * 1.5) * 0.08;
      }

      this.cameraManager.update(delta);

      for (const updatable of this.updatables) {
        if (typeof updatable.update === 'function') {
          updatable.update(delta, elapsed);
        }
      }

      if (callback) {
        callback(delta, elapsed);
      }

      this.renderer.render(this.scene, this.camera);
    };

    renderLoop();
  }
}
