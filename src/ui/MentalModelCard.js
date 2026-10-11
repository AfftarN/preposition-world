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
    this.element.className = 'pointer-events-auto absolute bottom-4 right-3 md:right-4 z-20 w-96 max-w-[calc(100vw-1.5rem)] bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700/80 shadow-2xl p-4 md:p-5 transition-all duration-300';
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

    const isTimePrep = prep.category === 'time';
    const isPlaceCore = ['in-place', 'on-place', 'at-place'].includes(prep.id);

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
      <div class="space-y-2.5 text-xs">
        <!-- Interactive Hierarchy Graphic -->
        ${isTimePrep ? `
          <div class="p-2.5 rounded-xl bg-slate-950/80 border border-purple-500/40">
            <div class="text-[11px] font-bold text-purple-300 mb-1.5 flex items-center justify-between">
              <span>📐 THE TIME PYRAMID</span>
              <span class="text-[10px] text-slate-400">Broad → Precise</span>
            </div>
            <div class="space-y-1 font-mono text-[11px]">
              <div class="flex items-center gap-2 p-1 rounded-lg ${prep.id === 'at-time' ? 'bg-pink-500/25 text-pink-300 border border-pink-500 font-bold' : 'text-slate-400'}">
                <span class="w-8 text-center text-[10px] uppercase font-bold py-0.5 rounded bg-pink-950 text-pink-400 border border-pink-800">AT</span>
                <span>▲ Sharp Point (5:00 PM, noon, midnight)</span>
              </div>
              <div class="flex items-center gap-2 p-1 rounded-lg ${prep.id === 'on-time' ? 'bg-purple-500/25 text-purple-300 border border-purple-500 font-bold' : 'text-slate-400'}">
                <span class="w-8 text-center text-[10px] uppercase font-bold py-0.5 rounded bg-purple-950 text-purple-400 border border-purple-800">ON</span>
                <span>■ 1-Day & Date (Friday, May 5th, Birthday)</span>
              </div>
              <div class="flex items-center gap-2 p-1 rounded-lg ${prep.id === 'in-time' ? 'bg-indigo-500/25 text-indigo-300 border border-indigo-500 font-bold' : 'text-slate-400'}">
                <span class="w-8 text-center text-[10px] uppercase font-bold py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800">IN</span>
                <span>■■ Long Container (2026, July, summer)</span>
              </div>
            </div>
          </div>
        ` : ''}

        ${isPlaceCore ? `
          <div class="p-2.5 rounded-xl bg-slate-950/80 border border-sky-500/40">
            <div class="text-[11px] font-bold text-sky-300 mb-1.5 flex items-center justify-between">
              <span>📐 SPATIAL DIMENSIONS</span>
              <span class="text-[10px] text-slate-400">0D → 2D → 3D</span>
            </div>
            <div class="space-y-1 font-mono text-[11px]">
              <div class="flex items-center gap-2 p-1 rounded-lg ${prep.id === 'at-place' ? 'bg-pink-500/25 text-pink-300 border border-pink-500 font-bold' : 'text-slate-400'}">
                <span class="w-8 text-center text-[10px] uppercase font-bold py-0.5 rounded bg-pink-950 text-pink-400 border border-pink-800">AT</span>
                <span>📍 0D Point (at the bus stop, at the door)</span>
              </div>
              <div class="flex items-center gap-2 p-1 rounded-lg ${prep.id === 'on-place' ? 'bg-amber-500/25 text-amber-300 border border-amber-500 font-bold' : 'text-slate-400'}">
                <span class="w-8 text-center text-[10px] uppercase font-bold py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">ON</span>
                <span>▬ 2D Surface (on the table, on the bus floor)</span>
              </div>
              <div class="flex items-center gap-2 p-1 rounded-lg ${prep.id === 'in-place' ? 'bg-sky-500/25 text-sky-300 border border-sky-500 font-bold' : 'text-slate-400'}">
                <span class="w-8 text-center text-[10px] uppercase font-bold py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800">IN</span>
                <span>📦 3D Container (in the box, in the car)</span>
              </div>
            </div>
          </div>
        ` : ''}

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
