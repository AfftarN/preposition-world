const STORAGE_KEY = 'preposition_world_state_v1';

export class Store {
  constructor(prepositions, quests) {
    this.prepositions = prepositions;
    this.quests = quests;
    this.listeners = new Set();

    // Default state
    const saved = this.loadSavedState();
    this.state = {
      mode: 'sandbox', // 'sandbox' | 'quest'
      selectedPrepositionId: prepositions[0]?.id || 'in-place',
      activeFilter: 'all', // 'all' | 'place' | 'movement' | 'time' | 'collocation'
      searchQuery: '',
      soundEnabled: saved.soundEnabled ?? true,
      playbackSpeed: 1, // 0.5 | 1
      isPaused: false,
      activeQuestIndex: 0,
      score: saved.score ?? 0,
      completedQuestIds: saved.completedQuestIds ?? [],
      lastAnswerResult: null, // { success, optionId, failExplanation }
    };
  }

  loadSavedState() {
    try {
      if (typeof localStorage !== 'undefined') {
        const item = localStorage.getItem(STORAGE_KEY);
        if (item) return JSON.parse(item);
      }
    } catch {
      // Ignore storage errors
    }
    return {};
  }

  saveState() {
    try {
      if (typeof localStorage !== 'undefined') {
        const data = {
          score: this.state.score,
          completedQuestIds: this.state.completedQuestIds,
          soundEnabled: this.state.soundEnabled
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
    } catch {
      // Ignore storage errors
    }
  }

  getState() {
    return this.state;
  }

  setState(partial) {
    this.state = { ...this.state, ...partial };
    this.saveState();
    this.notify();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  // --- ACTIONS ---

  setMode(mode) {
    if (this.state.mode !== mode) {
      this.setState({ mode, lastAnswerResult: null });
    }
  }

  setFilter(filter) {
    this.setState({ activeFilter: filter });
  }

  setSearchQuery(query) {
    this.setState({ searchQuery: query });
  }

  selectPreposition(id) {
    if (this.state.selectedPrepositionId !== id) {
      this.setState({ selectedPrepositionId: id });
    }
  }

  getSelectedPreposition() {
    return this.prepositions.find(p => p.id === this.state.selectedPrepositionId) || this.prepositions[0];
  }

  getCurrentQuest() {
    return this.quests[this.state.activeQuestIndex] || this.quests[0];
  }

  answerQuest(optionId) {
    const currentQuest = this.getCurrentQuest();
    if (!currentQuest) return { success: false };

    const success = currentQuest.correctId === optionId;
    let failExplanation = null;

    if (!success) {
      failExplanation = currentQuest.failExplanations[optionId] || 'Not quite the right preposition for this situation.';
    }

    const completed = new Set(this.state.completedQuestIds);
    let newScore = this.state.score;

    if (success && !completed.has(currentQuest.id)) {
      completed.add(currentQuest.id);
      newScore += 10;
    }

    const result = {
      success,
      optionId,
      correctId: currentQuest.correctId,
      failExplanation
    };

    this.setState({
      score: newScore,
      completedQuestIds: Array.from(completed),
      lastAnswerResult: result
    });

    return result;
  }

  nextQuest() {
    const nextIndex = (this.state.activeQuestIndex + 1) % this.quests.length;
    this.setState({
      activeQuestIndex: nextIndex,
      lastAnswerResult: null
    });
  }

  previousQuest() {
    const prevIndex = (this.state.activeQuestIndex - 1 + this.quests.length) % this.quests.length;
    this.setState({
      activeQuestIndex: prevIndex,
      lastAnswerResult: null
    });
  }

  resetQuests() {
    this.setState({
      activeQuestIndex: 0,
      score: 0,
      completedQuestIds: [],
      lastAnswerResult: null
    });
  }

  setPlaybackSpeed(speed) {
    this.setState({ playbackSpeed: speed });
  }

  togglePause() {
    this.setState({ isPaused: !this.state.isPaused });
  }

  toggleSound() {
    this.setState({ soundEnabled: !this.state.soundEnabled });
  }
}
