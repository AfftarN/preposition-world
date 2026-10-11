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
    this.element.className = 'pointer-events-auto absolute bottom-4 right-3 md:right-4 z-20 w-[26rem] max-w-[calc(100vw-1.5rem)] max-h-[85vh] flex flex-col bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700/80 shadow-2xl p-4 md:p-5 transition-all duration-300 overflow-y-auto';
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
          <button id="pronounce-btn" title="Pronounce" class="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition">
            🔊
          </button>
          <button id="replay-btn" title="Replay 3D Action" class="px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-1">
            <span>▶</span> Replay
          </button>
        </div>
      </div>

      <!-- Mental Model Section -->
      <div class="space-y-2.5 text-xs">
        <!-- Interactive Hierarchy Graphic -->
        ${isTimePrep ? `
          <div class="p-3 rounded-xl bg-slate-950/90 border border-purple-500/40 shadow-inner">
            <div class="text-[11px] font-bold text-purple-300 mb-2 flex items-center justify-between">
              <span>📐 THE TIME PYRAMID (Click a tier to jump):</span>
              <span class="text-[10px] text-slate-400">Broad → Sharp</span>
            </div>

            <!-- Clickable Interactive Tiers -->
            <div class="space-y-1.5 font-mono text-[11px]">
              <!-- AT Tier -->
              <button data-jump="at-time" class="time-tier-btn w-full text-left flex items-center gap-2.5 p-2 rounded-lg transition border ${
                prep.id === 'at-time'
                  ? 'bg-pink-500/25 text-pink-300 border-pink-500 font-bold shadow-md shadow-pink-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border-slate-800'
              }">
                <span class="w-9 text-center text-[10px] uppercase font-black py-0.5 rounded bg-pink-950 text-pink-400 border border-pink-800">AT</span>
                <div>
                  <div class="text-xs">▲ Sharp Clock Point & Moments</div>
                  <div class="text-[10px] text-pink-400/80">at 5:00 PM • at noon • at midnight • at night</div>
                </div>
              </button>

              <!-- ON Tier -->
              <button data-jump="on-time" class="time-tier-btn w-full text-left flex items-center gap-2.5 p-2 rounded-lg transition border ${
                prep.id === 'on-time'
                  ? 'bg-purple-500/25 text-purple-300 border-purple-500 font-bold shadow-md shadow-purple-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border-slate-800'
              }">
                <span class="w-9 text-center text-[10px] uppercase font-black py-0.5 rounded bg-purple-950 text-purple-400 border border-purple-800">ON</span>
                <div>
                  <div class="text-xs">■ 1-Day Surface on Calendar</div>
                  <div class="text-[10px] text-purple-400/80">on Friday • on July 4th • on my birthday • on Monday morning</div>
                </div>
              </button>

              <!-- IN Tier -->
              <button data-jump="in-time" class="time-tier-btn w-full text-left flex items-center gap-2.5 p-2 rounded-lg transition border ${
                prep.id === 'in-time'
                  ? 'bg-indigo-500/25 text-indigo-300 border-indigo-500 font-bold shadow-md shadow-indigo-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border-slate-800'
              }">
                <span class="w-9 text-center text-[10px] uppercase font-black py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800">IN</span>
                <div>
                  <div class="text-xs">■■ Long Enclosed Containers</div>
                  <div class="text-[10px] text-indigo-400/80">in 2026 • in July • in summer • in the morning • in 5 min</div>
                </div>
              </button>
            </div>

            <!-- Golden Rules of Time Prepositions -->
            <div class="mt-3 pt-2.5 border-t border-slate-800/80 space-y-1.5 text-[10px] text-slate-300">
              <div class="font-bold text-amber-400 flex items-center gap-1">
                <span>⚡</span> The 3 Golden Rules to Never Forget:
              </div>
              <p><strong class="text-purple-300">1. Day Overrides All:</strong> Even if you have "morning", once a day is named, ON always wins: <em class="text-white">on Friday morning</em> (not in!).</p>
              <p><strong class="text-pink-300">2. Night is Special:</strong> We say <em class="text-white">in the morning / in the afternoon</em>, but strictly <em class="text-pink-300 font-bold">at night</em>!</p>
              <p><strong class="text-emerald-300">3. Zero Preposition:</strong> Never say in/on/at before <em class="text-white">next, last, this, every</em> (e.g. <em class="text-emerald-300">next Friday</em>, NOT on next Friday).</p>
            </div>
          </div>
        ` : ''}

        ${isPlaceCore ? `
          <div class="p-3 rounded-xl bg-slate-950/90 border border-sky-500/40 shadow-inner">
            <div class="text-[11px] font-bold text-sky-300 mb-2 flex items-center justify-between">
              <span>📐 SPATIAL DIMENSIONS (Click to jump):</span>
              <span class="text-[10px] text-slate-400">0D → 2D → 3D</span>
            </div>
            <div class="space-y-1.5 font-mono text-[11px]">
              <button data-jump="at-place" class="place-tier-btn w-full text-left flex items-center gap-2 p-1.5 rounded-lg transition border ${
                prep.id === 'at-place' ? 'bg-pink-500/25 text-pink-300 border-pink-500 font-bold' : 'text-slate-400 hover:bg-slate-800/60 border-slate-800'
              }">
                <span class="w-8 text-center text-[10px] uppercase font-bold py-0.5 rounded bg-pink-950 text-pink-400 border border-pink-800">AT</span>
                <span>📍 0D Point / Venue (at the bus stop, at the door, at home)</span>
              </button>
              <button data-jump="on-place" class="place-tier-btn w-full text-left flex items-center gap-2 p-1.5 rounded-lg transition border ${
                prep.id === 'on-place' ? 'bg-amber-500/25 text-amber-300 border-amber-500 font-bold' : 'text-slate-400 hover:bg-slate-800/60 border-slate-800'
              }">
                <span class="w-8 text-center text-[10px] uppercase font-bold py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">ON</span>
                <span>▬ 2D Surface (on the table, on the bus floor, on the wall)</span>
              </button>
              <button data-jump="in-place" class="place-tier-btn w-full text-left flex items-center gap-2 p-1.5 rounded-lg transition border ${
                prep.id === 'in-place' ? 'bg-sky-500/25 text-sky-300 border-sky-500 font-bold' : 'text-slate-400 hover:bg-slate-800/60 border-slate-800'
              }">
                <span class="w-8 text-center text-[10px] uppercase font-bold py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800">IN</span>
                <span>📦 3D Container / Volume (in the box, in the car, in the room)</span>
              </button>
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

    // Listeners for Tier buttons
    this.element.querySelectorAll('.time-tier-btn, .place-tier-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.soundFX.playClick();
        this.store.selectPreposition(btn.dataset.jump);
      });
    });

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
