import * as THREE from 'three';

export class Character {
  constructor() {
    this.mesh = new THREE.Group();
    this.buildPip();

    this.currentAnimation = null;
    this.animationTime = 0;
    this.animationDuration = 1.0;
    this.onAnimationComplete = null;

    this.defaultPosition = new THREE.Vector3(0, 1.3, 0);
    this.mesh.position.copy(this.defaultPosition);

    this.idleBobSpeed = 3.0;
  }

  buildPip() {
    // 1. Body (Cute rounded capsule/bean)
    const bodyGeo = new THREE.CylinderGeometry(0.5, 0.45, 0.9, 12);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // Warm golden amber
      roughness: 0.4,
      metalness: 0.1,
      flatShading: true
    });
    this.body = new THREE.Mesh(bodyGeo, bodyMat);
    this.body.castShadow = true;
    this.body.position.y = 0.55;
    this.mesh.add(this.body);

    // 2. Visor / Face Screen (Curved glowing dark visor)
    const visorGeo = new THREE.SphereGeometry(0.38, 12, 10, 0, Math.PI, 0, Math.PI * 0.5);
    const visorMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a, // Deep slate screen
      roughness: 0.1,
      metalness: 0.8
    });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.rotation.x = Math.PI / 2;
    visor.rotation.z = -Math.PI / 2;
    visor.position.set(0, 0.72, 0.28);
    this.mesh.add(visor);

    // 3. Cute Glowing Eyes
    const eyeGeo = new THREE.BoxGeometry(0.1, 0.08, 0.05);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 }); // Cyan glow

    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.15, 0.72, 0.48);
    this.mesh.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.15, 0.72, 0.48);
    this.mesh.add(rightEye);

    // 4. Little Hands
    const handGeo = new THREE.SphereGeometry(0.14, 8, 8);
    const handMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.5, flatShading: true });

    this.leftHand = new THREE.Mesh(handGeo, handMat);
    this.leftHand.position.set(-0.62, 0.5, 0);
    this.mesh.add(this.leftHand);

    this.rightHand = new THREE.Mesh(handGeo, handMat);
    this.rightHand.position.set(0.62, 0.5, 0);
    this.mesh.add(this.rightHand);

    // 5. Little Feet
    const footGeo = new THREE.BoxGeometry(0.25, 0.18, 0.38);
    const footMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6, flatShading: true });

    this.leftFoot = new THREE.Mesh(footGeo, footMat);
    this.leftFoot.position.set(-0.25, 0.1, 0.05);
    this.leftFoot.castShadow = true;
    this.mesh.add(this.leftFoot);

    this.rightFoot = new THREE.Mesh(footGeo, footMat);
    this.rightFoot.position.set(0.25, 0.1, 0.05);
    this.rightFoot.castShadow = true;
    this.mesh.add(this.rightFoot);

    // 6. Cute Head Antenna
    const antStemGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.3, 6);
    const antStem = new THREE.Mesh(antStemGeo, footMat);
    antStem.position.set(0, 1.15, 0);
    this.mesh.add(antStem);

    const antTipGeo = new THREE.SphereGeometry(0.12, 8, 8);
    const antTipMat = new THREE.MeshBasicMaterial({ color: 0x22c55e }); // Emerald glowing orb
    this.antTip = new THREE.Mesh(antTipGeo, antTipMat);
    this.antTip.position.set(0, 1.32, 0);
    this.mesh.add(this.antTip);
  }

  setPosition(x, y, z) {
    this.mesh.position.set(x, y, z);
  }

  playAnimation(type, onComplete = null) {
    this.currentAnimation = type;
    this.animationTime = 0;
    this.onAnimationComplete = onComplete;

    // Reset scales/rotations
    this.mesh.rotation.set(0, 0, 0);
    this.body.scale.set(1, 1, 1);
  }

  update(delta = 0.016, elapsed = 0) {
    // Antenna gentle pulse
    if (this.antTip) {
      const pulse = 1.0 + Math.sin(elapsed * 5) * 0.15;
      this.antTip.scale.set(pulse, pulse, pulse);
    }

    if (!this.currentAnimation) {
      // Idle animation
      this.body.position.y = 0.55 + Math.sin(elapsed * this.idleBobSpeed) * 0.04;
      this.leftHand.position.y = 0.5 + Math.sin(elapsed * this.idleBobSpeed + 0.5) * 0.05;
      this.rightHand.position.y = 0.5 - Math.sin(elapsed * this.idleBobSpeed + 0.5) * 0.05;
      return;
    }

    this.animationTime += delta;
    const progress = Math.min(1.0, this.animationTime / this.animationDuration);

    switch (this.currentAnimation) {
      case 'jump':
      case 'hop_on_table':
      case 'jump_in_box':
      case 'jump_onto_table': {
        // Parabolic jump arc
        const height = 1.8 * Math.sin(progress * Math.PI);
        this.mesh.position.y = this.defaultPosition.y + height;
        this.body.scale.y = 1.0 + Math.sin(progress * Math.PI) * 0.25;
        this.leftHand.position.y = 0.5 + height * 0.4;
        this.rightHand.position.y = 0.5 + height * 0.4;
        break;
      }

      case 'dive_into_box': {
        const height = 2.2 * Math.sin(progress * Math.PI);
        this.mesh.position.y = this.defaultPosition.y + height;
        this.mesh.rotation.x = progress * Math.PI * 0.6; // Forward dive tilt
        break;
      }

      case 'traverse_through_tunnel':
      case 'cross_bridge':
      case 'stroll_along_path': {
        // Walking bounce & forward wobble
        this.mesh.position.y = this.defaultPosition.y + Math.abs(Math.sin(progress * Math.PI * 6)) * 0.3;
        this.leftFoot.position.z = Math.sin(progress * Math.PI * 6) * 0.2;
        this.rightFoot.position.z = -Math.sin(progress * Math.PI * 6) * 0.2;
        break;
      }

      case 'crouch_under_table':
      case 'hide_behind_tree': {
        // Squish and crouch
        this.body.scale.y = 0.65;
        this.body.scale.x = 1.2;
        this.body.scale.z = 1.2;
        break;
      }

      case 'fail_bump': {
        // Bonk against object, bounce back and wobble
        const t = progress;
        if (t < 0.25) {
          this.mesh.position.z += 0.2; // Forward impact
        } else {
          this.mesh.position.z -= (t - 0.25) * 0.8; // Recoil back
          this.mesh.rotation.z = Math.sin(t * Math.PI * 8) * 0.35; // Dizzy shake
          this.mesh.rotation.x = -0.3;
        }
        break;
      }

      case 'celebrate':
      case 'play_guitar_stage':
      case 'clap_hands': {
        // Joyful spin and double hop
        this.mesh.rotation.y = progress * Math.PI * 4;
        this.mesh.position.y = this.defaultPosition.y + Math.abs(Math.sin(progress * Math.PI * 4)) * 0.8;
        this.leftHand.position.y = 0.9;
        this.rightHand.position.y = 0.9;
        break;
      }

      default: {
        this.body.position.y = 0.55 + Math.sin(elapsed * this.idleBobSpeed) * 0.04;
      }
    }

    if (progress >= 1.0) {
      const cb = this.onAnimationComplete;
      this.currentAnimation = null;
      if (cb) cb();
    }
  }
}
