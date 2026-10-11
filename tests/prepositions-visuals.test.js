import { describe, it, expect } from 'vitest';
import { Character } from '../src/scene/Character.js';
import { SpatialZone } from '../src/scene/zones/SpatialZone.js';
import { TimeZone } from '../src/scene/zones/TimeZone.js';
import { VisualVectors } from '../src/scene/VisualVectors.js';
import * as THREE from 'three';

describe('ON & AT Implementation and Kinematics', () => {
  it('updates both mesh position and defaultPosition on Character.setPosition', () => {
    const char = new Character();
    char.setPosition(5, 2.5, -3);

    expect(char.mesh.position.x).toBe(5);
    expect(char.mesh.position.y).toBe(2.5);
    expect(char.mesh.position.z).toBe(-3);

    expect(char.defaultPosition.x).toBe(5);
    expect(char.defaultPosition.y).toBe(2.5);
    expect(char.defaultPosition.z).toBe(-3);
  });

  it('sets table target height to the actual tabletop surface level', () => {
    const spatial = new SpatialZone();
    // Table is at base 0.9 + tabletop 1.0 = ~2.0
    expect(spatial.targets.table.y).toBeGreaterThanOrEqual(1.9);
  });

  it('has dedicated animation handlers for AT and ON actions', () => {
    const char = new Character();

    // Test hop_on_table animation
    char.setPosition(0, 2.0, 0);
    char.playAnimation('hop_on_table');
    char.update(0.05, 0.1);
    expect(char.currentAnimation).toBe('hop_on_table');

    // Test stand_at_stop animation
    char.playAnimation('stand_at_stop');
    char.update(0.05, 0.1);
    expect(char.currentAnimation).toBe('stand_at_stop');

    // Test climb_pyramid_at animation
    char.playAnimation('climb_pyramid_at');
    char.update(0.05, 0.1);
    expect(char.currentAnimation).toBe('climb_pyramid_at');
  });

  it('renders coordinate pin and target rings in VisualVectors for AT', () => {
    const scene = new THREE.Scene();
    const vectors = new VisualVectors(scene);

    vectors.showCoordinatePoint({ x: 2, y: 1, z: 4 });
    expect(vectors.group.children.length).toBeGreaterThan(0);

    vectors.showSurface({ x: 0, y: 2, z: 0 }, { x: 2, z: 2 });
    expect(vectors.group.children.length).toBeGreaterThan(0);
  });
});
