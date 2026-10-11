import { describe, it, expect, beforeEach } from 'vitest';
import { CameraManager } from '../src/scene/CameraManager.js';
import * as THREE from 'three';

describe('CameraManager & Coordinates', () => {
  let camera;
  let manager;

  beforeEach(() => {
    camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.set(20, 20, 20);
    manager = new CameraManager(camera);
  });

  it('initializes with default overview target', () => {
    expect(manager.target).toBeDefined();
    expect(manager.target.x).toBe(0);
    expect(manager.target.y).toBe(0);
    expect(manager.target.z).toBe(0);
  });

  it('sets target coordinates on focusOn', () => {
    manager.focusOn({ x: 5, y: 2, z: -3 }, 100);
    expect(manager.targetGoal.x).toBe(5);
    expect(manager.targetGoal.y).toBe(2);
    expect(manager.targetGoal.z).toBe(-3);
  });

  it('interpolates towards goal on update', () => {
    manager.focusOn({ x: 10, y: 0, z: 0 }, 100);
    const initialX = manager.target.x;
    manager.update(0.1);
    expect(manager.target.x).toBeGreaterThan(initialX);
  });

  it('resets view to default overview', () => {
    manager.focusOn({ x: 10, y: 10, z: 10 }, 50);
    manager.update(1.0);
    manager.resetView();
    expect(manager.targetGoal.x).toBe(0);
    expect(manager.targetGoal.y).toBe(0);
    expect(manager.targetGoal.z).toBe(0);
  });
});
