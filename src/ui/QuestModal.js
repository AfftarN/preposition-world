import { speakText } from '../audio/Speech.js';

export class QuestModal {
  constructor(container, store, soundFX, onQuestAction) {
    this.container = container;
    this.store = store;
    this.soundFX = soundFX;
    this.onQuestAction = onQuestAction;
    this.element = null;

    this.render();
    this.store.subscribe(() => this.update());
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'pointer-events-auto absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[32rem] max-w-[calc(100vw-1.5rem)] bg-slate-900/95 backdrop-blur-md rounded-2xl border border-emerald-500/30 shadow-2xl p-4 md:p-5 transition-all duration-300';
    this.container.appendChild(this.element);
    this.update();
  }

  update() {
    if (!this.element) return;
    const state = this.store.getState();

    // Only visible in quest mode
    if (state.mode !== 'quest') {
      this.element.classList.add('hidden');
      return;
    } else {
      this.element.classList.remove('hidden');
    }

    const quest = this.store.getCurrentQuest();
    if (!quest) return;

    const isAllCompleted = state.completedQuestIds.length >= this.store.quests.length;
    const result = state.lastAnswerResult;

    if (isAllCompleted && !result) {
      // All Quests Completed Screen!
      this.element.innerHTML = `
        <div class="text-center py-4 space-y-3">
          <div class="text-4xl animate-bounce">🏆</div>
          <h2 class="text-xl font-extrabold text-white">Preposition Master!</h2>
          <p class="text-xs text-slate-300 max-w-sm mx-auto">
            You completed all ${this.store.quests.length} interactive preposition quests with a total score of
            <span class="text-amber-400 font-bold font-mono">${state.score} pts</span>!
          </p>
          <div class="pt-2 flex justify-center gap-3">
            <button id="restart-quests-btn" class="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition">
              Restart Quests
            </button>
            <button id="back-to-sandbox-btn" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition">
              Explore in Sandbox
            </button>
          </div>
        </div>
      `;

      this.element.querySelector('#restart-quests-btn').addEventListener('click', () => {
        this.soundFX.playClick();
        this.store.resetQuests();
      });

      this.element.querySelector('#back-to-sandbox-btn').addEventListener('click', () => {
        this.soundFX.playClick();
        this.store.setMode('sandbox');
      });
      return;
    }

    const prepMap = new Map(this.store.prepositions.map(p => [p.id, p]));

    this.element.innerHTML = `
      <!-- Top Quest Header -->
      <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs">
        <div class="flex items-center gap-2">
          <span class="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-mono font-bold flex items-center justify-center border border-emerald-500/30">
            ${state.activeQuestIndex + 1}
          </span>
          <span class="font-bold text-slate-200">Quest ${state.activeQuestIndex + 1} of ${this.store.quests.length}</span>
        </div>
        <div class="flex items-center gap-2">
          <button id="prev-quest-btn" title="Previous quest" class="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700 transition">◀</button>
          <button id="next-quest-btn" title="Next quest" class="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700 transition">▶</button>
        </div>
      </div>

      <!-- Prompt description -->
      <p class="text-xs text-slate-300 leading-relaxed mb-3">
        ${quest.prompt}
      </p>

      <!-- Sentence with blank -->
      <div class="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center font-mono text-sm md:text-base text-amber-300 font-bold mb-4 shadow-inner">
        ${quest.sentenceWithBlank}
      </div>

      <!-- Result Banner (Feedback) -->
      ${result ? `
        <div class="p-3 rounded-xl mb-4 text-xs ${
          result.success
            ? 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-300'
            : 'bg-rose-950/60 border border-rose-500/50 text-rose-300'
        }">
          <div class="font-bold flex items-center gap-1.5 mb-1 text-sm">
            <span>${result.success ? '🎉 Spot on!' : '💥 Comic Misunderstanding:'}</span>
          </div>
          <p class="leading-relaxed">
            ${result.success ? 'Correct preposition! Pip executed the movement perfectly.' : result.failExplanation}
          </p>
        </div>
      ` : ''}

      <!-- Options Buttons -->
      <div class="grid grid-cols-3 gap-2">
        ${quest.options.map(optId => {
          const prep = prepMap.get(optId);
          const label = prep ? prep.name : optId;
          const isSelected = result && result.optionId === optId;
          let btnStyle = 'bg-slate-800/80 hover:bg-slate-800 hover:border-slate-600 text-slate-200 border-slate-700';

          if (result) {
            if (optId === result.correctId) {
              btnStyle = 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-500/20';
            } else if (isSelected && !result.success) {
              btnStyle = 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-500/20 animate-shake';
            }
          }

          return `
            <button
              data-opt="${optId}"
              class="quest-option-btn p-2.5 rounded-xl border text-xs md:text-sm font-mono font-bold transition flex items-center justify-center gap-1.5 ${btnStyle}"
            >
              ${label}
            </button>
          `;
        }).join('')}
      </div>

      <!-- Action Footer -->
      ${result ? `
        <div class="mt-3 pt-3 border-t border-slate-800 flex justify-end gap-2">
          ${result.success ? `
            <button id="continue-quest-btn" class="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-1.5">
              <span>Next Challenge</span> <span>→</span>
            </button>
          ` : `
            <button id="retry-quest-btn" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition">
              Try Another Option
            </button>
          `}
        </div>
      ` : ''}
    `;

    // Listeners for options
    this.element.querySelectorAll('.quest-option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const optId = btn.dataset.opt;
        const answerResult = this.store.answerQuest(optId);
        if (answerResult.success) {
          this.soundFX.playSuccess();
        } else {
          this.soundFX.playFail();
        }
        if (this.onQuestAction) {
          this.onQuestAction(quest, answerResult);
        }
      });
    });

    // Navigation buttons
    this.element.querySelector('#prev-quest-btn')?.addEventListener('click', () => {
      this.soundFX.playClick();
      this.store.previousQuest();
    });

    this.element.querySelector('#next-quest-btn')?.addEventListener('click', () => {
      this.soundFX.playClick();
      this.store.nextQuest();
    });

    this.element.querySelector('#continue-quest-btn')?.addEventListener('click', () => {
      this.soundFX.playClick();
      this.store.nextQuest();
    });

    this.element.querySelector('#retry-quest-btn')?.addEventListener('click', () => {
      this.soundFX.playClick();
      this.store.setState({ lastAnswerResult: null });
    });
  }
}
