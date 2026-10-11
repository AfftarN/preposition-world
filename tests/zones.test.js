import { describe, it, expect } from 'vitest';
import { prepositions } from '../src/data/prepositions.js';
import { SpatialZone } from '../src/scene/zones/SpatialZone.js';
import { TimeZone } from '../src/scene/zones/TimeZone.js';
import { CollocationZone } from '../src/scene/zones/CollocationZone.js';
import { Character } from '../src/scene/Character.js';

describe('3D Zones and Character Targets', () => {
  it('instantiates all 3 zones with valid Three.js groups and targets', () => {
    const spatial = new SpatialZone();
    const time = new TimeZone();
    const collocation = new CollocationZone();

    expect(spatial.group).toBeDefined();
    expect(time.group).toBeDefined();
    expect(collocation.group).toBeDefined();

    const allTargets = {
      ...spatial.targets,
      ...time.targets,
      ...collocation.targets
    };

    // Check that every preposition visualTarget is mapped to 3D coordinates
    prepositions.forEach(prep => {
      const targetCoord = allTargets[prep.visualTarget];
      expect(
        targetCoord,
        `preposition "${prep.name}" (${prep.id}) target "${prep.visualTarget}" should exist in zones`
      ).toBeDefined();
      expect(typeof targetCoord.x).toBe('number');
      expect(typeof targetCoord.y).toBe('number');
      expect(typeof targetCoord.z).toBe('number');
    });
  });

  it('instantiates Character with mesh and animation controller', () => {
    const character = new Character();
    expect(character.mesh).toBeDefined();
    expect(typeof character.playAnimation).toBe('function');
    expect(typeof character.update).toBe('function');
  });
});
