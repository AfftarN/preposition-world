import * as THREE from 'three';

export class CameraManager {
  constructor(camera, controls = null) {
    this.camera = camera;
    this.controls = controls;

    // Default isometric overview
    this.defaultTarget = new THREE.Vector3(0, 0, 0);
    this.defaultOffset = new THREE.Vector3(18, 16, 18);

    this.target = this.defaultTarget.clone();
    this.targetGoal = this.defaultTarget.clone();
    this.offsetGoal = this.defaultOffset.clone();

    this.lerpSpeed = 4.0;
  }

  focusOn(coord, zoomFactor = 1.0) {
    this.targetGoal.set(coord.x, coord.y || 0, coord.z);
    // Adjusted isometric offset based on zoom factor
    const dist = 14 * zoomFactor;
    this.offsetGoal.set(dist, dist * 0.9, dist);
  }

  resetView() {
    this.targetGoal.copy(this.defaultTarget);
    this.offsetGoal.copy(this.defaultOffset);
  }

  update(delta = 0.016) {
    const factor = Math.min(1.0, delta * this.lerpSpeed);
    this.target.lerp(this.targetGoal, factor);

    const desiredCamPos = this.target.clone().add(this.offsetGoal);
    this.camera.position.lerp(desiredCamPos, factor);

    if (this.controls) {
      this.controls.target.copy(this.target);
      this.controls.update();
    } else {
      this.camera.lookAt(this.target);
    }
  }
}
