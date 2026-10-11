import { speakText } from '../audio/Speech.js';

export class MentalModelCard {
  constructor(container, store, soundFX, onReplayAnimation) {
    this.container = container;
    this.store = store;
    this.soundFX = soundFX;
    this.onReplayAnimation = onReplayAnimation;
    this.element = null;

    this.render();
    this.store.subscribe(() => this.update());
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'pointer-events-auto absolute bottom-4 right-3 md:right-4 z-20 w-96 max-w-[calc(100vw-1.5rem)] bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-700/80 shadow-2xl p-4 md:p-5 transition-all duration-300';
    this.container.appendChild(this.element);
    this.update();
  }

  update() {
    if (!this.element) return;
    const state = this.store.getState();

    // Only visible in sandbox mode
    if (state.mode !== 'sandbox') {
      this.element.classList.add('hidden');
      return;
    } else {
      this.element.classList.remove('hidden');
    }

    const prep = this.store.getSelectedPreposition();
    if (!prep) return;

    this.element.innerHTML = `
      <!-- Header -->
      <div class="flex items-start justify-between gap-3 mb-3 pb-3 border-b border-slate-800">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-2xl font-black text-amber-400 font-mono tracking-tight">${prep.name}</span>
            <span class="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              ${prep.category}
            </span>
          </div>
          <p class="text-xs font-semibold text-slate-300 mt-0.5">${prep.title}</p>
        </div>

        <div class="flex items-center gap-1.5">
          <!-- Pronounce audio button -->
          <button id="pronounce-btn" title="Pronounce (Web Speech)" class="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition">
            🔊
          </button>
          <!-- Replay 3D action -->
          <button id="replay-btn" title="Replay 3D Action" class="px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-1">
            <span>▶</span> Replay
          </button>
        </div>
      </div>

      <!-- Mental Model Section -->
      <div class="space-y-3 text-xs">
        <!-- Native Intuition -->
        <div class="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
          <span class="font-bold text-amber-300 block mb-1 flex items-center gap-1.5">
            <span>💡</span> Native Speaker Mental Model:
          </span>
          <p class="text-slate-300 leading-relaxed">${prep.mentalModel}</p>
        </div>

        <!-- Formula -->
        <div class="flex items-center gap-2 p-2 rounded-lg bg-slate-950/40 border border-slate-800 font-mono text-[11px] text-emerald-400">
          <span class="text-slate-500">Pattern:</span>
          <span>${prep.formula}</span>
        </div>

        <!-- Contrast Example -->
        <div class="p-2.5 rounded-xl bg-sky-950/30 border border-sky-800/40">
          <span class="font-bold text-sky-400 block mb-1 flex items-center gap-1.5">
            <span>⚖️</span> Conceptual Contrast:
          </span>
          <p class="text-slate-300 leading-relaxed">${prep.contrastExample}</p>
        </div>

        <!-- ESL Trap / Common Mistake -->
        <div class="p-2.5 rounded-xl bg-rose-950/25 border border-rose-800/40">
          <span class="font-bold text-rose-400 block mb-1 flex items-center gap-1.5">
            <span>⚠️</span> Common ESL Trap:
          </span>
          <p class="text-slate-300 leading-relaxed">${prep.commonMistake}</p>
        </div>
      </div>
    `;

    // Listeners
    this.element.querySelector('#pronounce-btn').addEventListener('click', () => {
      this.soundFX.playClick();
      speakText(prep.pronunciationText);
    });

    this.element.querySelector('#replay-btn').addEventListener('click', () => {
      this.soundFX.playClick();
      if (this.onReplayAnimation) this.onReplayAnimation(prep);
    });
  }
}
