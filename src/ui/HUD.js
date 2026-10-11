export class HUD {
  constructor(container, store, soundFX, onResetCamera) {
    this.container = container;
    this.store = store;
    this.soundFX = soundFX;
    this.onResetCamera = onResetCamera;
    this.element = null;

    this.render();
    this.store.subscribe(() => this.update());
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'pointer-events-auto flex flex-wrap items-center justify-between gap-3 p-3 md:p-4 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/60 shadow-lg';
    this.element.innerHTML = `
      <!-- Brand & Title -->
      <div class="flex items-center gap-2.5">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-400 flex items-center justify-center shadow-md shadow-amber-500/20 text-slate-950 font-black text-lg">
          P
        </div>
        <div>
          <h1 class="text-base md:text-lg font-extrabold tracking-tight text-white flex items-center gap-2">
            Preposition World
            <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">3D SIM</span>
          </h1>
          <p class="text-xs text-slate-400 hidden sm:block">Master English prepositions through spatial mental models</p>
        </div>
      </div>

      <!-- Mode Switcher -->
      <div class="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700/70 shadow-inner">
        <button id="mode-sandbox-btn" class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5">
          <span>🔍</span> Sandbox
        </button>
        <button id="mode-quest-btn" class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5">
          <span>🎯</span> Quests
        </button>
      </div>

      <!-- Quick Controls -->
      <div class="flex items-center gap-2">
        <!-- Score pill (visible in quest mode) -->
        <div id="score-pill" class="hidden items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-600/40 text-emerald-300 text-xs font-mono font-bold">
          <span>⭐</span> <span id="score-text">0 pts</span>
        </div>

        <!-- Speed toggle -->
        <button id="speed-btn" title="Toggle simulation speed" class="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono border border-slate-700 transition">
          1.0x
        </button>

        <!-- Pause toggle -->
        <button id="pause-btn" title="Pause / Resume" class="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition">
          ⏸️
        </button>

        <!-- Audio toggle -->
        <button id="sound-btn" title="Toggle sound effects" class="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition">
          🔊
        </button>

        <!-- Reset Camera -->
        <button id="reset-cam-btn" title="Reset Camera View" class="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition">
          🔄 View
        </button>
      </div>
    `;

    this.container.appendChild(this.element);

    // Event listeners
    this.element.querySelector('#mode-sandbox-btn').addEventListener('click', () => {
      this.soundFX.playClick();
      this.store.setMode('sandbox');
    });

    this.element.querySelector('#mode-quest-btn').addEventListener('click', () => {
      this.soundFX.playClick();
      this.store.setMode('quest');
    });

    this.element.querySelector('#speed-btn').addEventListener('click', () => {
      this.soundFX.playClick();
      const current = this.store.getState().playbackSpeed;
      const next = current === 1.0 ? 0.5 : 1.0;
      this.store.setPlaybackSpeed(next);
    });

    this.element.querySelector('#pause-btn').addEventListener('click', () => {
      this.soundFX.playClick();
      this.store.togglePause();
    });

    this.element.querySelector('#sound-btn').addEventListener('click', () => {
      this.store.toggleSound();
      this.soundFX.setEnabled(this.store.getState().soundEnabled);
      if (this.store.getState().soundEnabled) this.soundFX.playClick();
    });

    this.element.querySelector('#reset-cam-btn').addEventListener('click', () => {
      this.soundFX.playClick();
      if (this.onResetCamera) this.onResetCamera();
    });

    this.update();
  }

  update() {
    if (!this.element) return;
    const state = this.store.getState();

    // Mode buttons
    const sandboxBtn = this.element.querySelector('#mode-sandbox-btn');
    const questBtn = this.element.querySelector('#mode-quest-btn');
    if (state.mode === 'sandbox') {
      sandboxBtn.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 shadow-sm flex items-center gap-1.5';
      questBtn.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5';
    } else {
      sandboxBtn.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5';
      questBtn.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 text-slate-950 shadow-sm flex items-center gap-1.5';
    }

    // Score pill
    const scorePill = this.element.querySelector('#score-pill');
    const scoreText = this.element.querySelector('#score-text');
    if (state.mode === 'quest') {
      scorePill.classList.remove('hidden');
      scorePill.classList.add('flex');
      scoreText.textContent = `${state.score} pts (${state.completedQuestIds.length}/${this.store.quests.length})`;
    } else {
      scorePill.classList.add('hidden');
      scorePill.classList.remove('flex');
    }

    // Speed button
    const speedBtn = this.element.querySelector('#speed-btn');
    speedBtn.textContent = `${state.playbackSpeed}x`;
    speedBtn.className = state.playbackSpeed === 0.5
      ? 'px-2.5 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 text-xs font-mono border border-amber-500/40 transition'
      : 'px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono border border-slate-700 transition';

    // Pause button
    const pauseBtn = this.element.querySelector('#pause-btn');
    pauseBtn.textContent = state.isPaused ? '▶️' : '⏸️';

    // Sound button
    const soundBtn = this.element.querySelector('#sound-btn');
    soundBtn.textContent = state.soundEnabled ? '🔊' : '🔇';
  }
}
