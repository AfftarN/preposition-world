import { describe, it, expect } from 'vitest';
import { prepositions, categories } from '../src/data/prepositions.js';
import { quests } from '../src/data/quests.js';

describe('Curriculum Data Layer', () => {
  describe('Prepositions Dataset', () => {
    it('contains at least 25 prepositions', () => {
      expect(Array.isArray(prepositions)).toBe(true);
      expect(prepositions.length).toBeGreaterThanOrEqual(25);
    });

    it('covers place, movement, time, and collocation categories', () => {
      const cats = new Set(prepositions.map(p => p.category));
      expect(cats.has('place')).toBe(true);
      expect(cats.has('movement')).toBe(true);
      expect(cats.has('time')).toBe(true);
      expect(cats.has('collocation')).toBe(true);
    });

    it('has all required fields for each preposition', () => {
      prepositions.forEach(p => {
        expect(p.id, `id in ${p.name}`).toBeTruthy();
        expect(p.name, `name in ${p.id}`).toBeTruthy();
        expect(p.category, `category in ${p.id}`).toBeTruthy();
        expect(p.mentalModel, `mentalModel in ${p.id}`).toBeTruthy();
        expect(p.formula, `formula in ${p.id}`).toBeTruthy();
        expect(p.contrastExample, `contrastExample in ${p.id}`).toBeTruthy();
        expect(p.commonMistake, `commonMistake in ${p.id}`).toBeTruthy();
        expect(p.pronunciationText, `pronunciationText in ${p.id}`).toBeTruthy();
        expect(p.visualTarget, `visualTarget in ${p.id}`).toBeTruthy();
        expect(p.animationType, `animationType in ${p.id}`).toBeTruthy();
      });
    });

    it('exports standard categories definitions', () => {
      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBe(4);
    });
  });

  describe('Quests Dataset', () => {
    it('contains at least 15 quests', () => {
      expect(Array.isArray(quests)).toBe(true);
      expect(quests.length).toBeGreaterThanOrEqual(15);
    });

    it('has valid quest options and correctId references', () => {
      const prepIds = new Set(prepositions.map(p => p.id));

      quests.forEach((q, idx) => {
        expect(q.id, `quest index ${idx} id`).toBeTruthy();
        expect(q.prompt, `quest ${q.id} prompt`).toBeTruthy();
        expect(q.sentenceWithBlank, `quest ${q.id} sentenceWithBlank`).toBeTruthy();
        expect(Array.isArray(q.options), `quest ${q.id} options`).toBe(true);
        expect(q.options.length).toBeGreaterThanOrEqual(2);
        expect(q.options.includes(q.correctId), `quest ${q.id} options include correctId`).toBe(true);
        expect(prepIds.has(q.correctId), `quest ${q.id} correctId in prepositions`).toBe(true);
        expect(q.failExplanations, `quest ${q.id} failExplanations`).toBeDefined();
        expect(q.zoneTarget, `quest ${q.id} zoneTarget`).toBeTruthy();
      });
    });
  });
});
