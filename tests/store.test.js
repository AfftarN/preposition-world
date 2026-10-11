import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Store } from '../src/state/Store.js';
import { prepositions } from '../src/data/prepositions.js';
import { quests } from '../src/data/quests.js';

describe('Reactive State Store', () => {
  let store;

  beforeEach(() => {
    // Mock localStorage
    const storage = {};
    global.localStorage = {
      getItem: vi.fn(key => storage[key] || null),
      setItem: vi.fn((key, val) => { storage[key] = val; }),
      removeItem: vi.fn(key => { delete storage[key]; }),
      clear: vi.fn(() => { for (const k in storage) delete storage[k]; })
    };

    store = new Store(prepositions, quests);
  });

  it('initializes with default sandbox state', () => {
    const state = store.getState();
    expect(state.mode).toBe('sandbox');
    expect(state.selectedPrepositionId).toBe('in-place');
    expect(state.soundEnabled).toBe(true);
    expect(state.playbackSpeed).toBe(1);
    expect(state.isPaused).toBe(false);
    expect(state.activeQuestIndex).toBe(0);
    expect(state.score).toBe(0);
  });

  it('updates mode and notifies subscribers', () => {
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);

    store.setMode('quest');
    expect(store.getState().mode).toBe('quest');
    expect(listener).toHaveBeenCalled();

    unsubscribe();
    store.setMode('sandbox');
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('selects a preposition', () => {
    store.selectPreposition('on-place');
    expect(store.getState().selectedPrepositionId).toBe('on-place');
    const selected = store.getSelectedPreposition();
    expect(selected.name).toBe('on');
  });

  it('processes quest answers and handles scoring', () => {
    store.setMode('quest');
    const currentQuest = store.getCurrentQuest();
    expect(currentQuest).toBeDefined();

    // Wrong answer
    const wrongOption = currentQuest.options.find(opt => opt !== currentQuest.correctId);
    const wrongResult = store.answerQuest(wrongOption);
    expect(wrongResult.success).toBe(false);
    expect(wrongResult.failExplanation).toBeDefined();
    expect(store.getState().score).toBe(0);

    // Correct answer
    const correctResult = store.answerQuest(currentQuest.correctId);
    expect(correctResult.success).toBe(true);
    expect(store.getState().score).toBe(10);
    expect(store.getState().completedQuestIds.includes(currentQuest.id)).toBe(true);
  });

  it('advances through quests and wraps or finishes', () => {
    store.setMode('quest');
    const initialIndex = store.getState().activeQuestIndex;
    store.nextQuest();
    expect(store.getState().activeQuestIndex).toBe(initialIndex + 1);

    store.resetQuests();
    expect(store.getState().activeQuestIndex).toBe(0);
    expect(store.getState().score).toBe(0);
  });

  it('toggles audio, pause state, and playback speed', () => {
    store.toggleSound();
    expect(store.getState().soundEnabled).toBe(false);
    store.toggleSound();
    expect(store.getState().soundEnabled).toBe(true);

    store.togglePause();
    expect(store.getState().isPaused).toBe(true);

    store.setPlaybackSpeed(0.5);
    expect(store.getState().playbackSpeed).toBe(0.5);
  });
});
