import { categories } from '../data/prepositions.js';

export class ExplorerPanel {
  constructor(container, store, soundFX) {
    this.container = container;
    this.store = store;
    this.soundFX = soundFX;
    this.element = null;

    this.render();
    this.store.subscribe(() => this.update());
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'pointer-events-auto absolute top-20 left-3 md:left-4 z-20 w-80 max-w-[calc(100vw-1.5rem)] max-h-[calc(100vh-6.5rem)] flex flex-col bg-slate-900/85 backdrop-blur-md rounded-2xl border border-slate-800 shadow-2xl overflow-hidden transition-all duration-300';
    this.element.innerHTML = `
      <!-- Header -->
      <div class="p-3.5 border-b border-slate-800 flex items-center justify-between">
        <h2 class="text-sm font-extrabold text-white flex items-center gap-2">
          <span>📚</span> Preposition Catalog
        </h2>
        <span id="catalog-count" class="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
          ${this.store.prepositions.length} items
        </span>
      </div>

      <!-- Search Input -->
      <div class="p-3 border-b border-slate-800/60 bg-slate-950/40">
        <div class="relative">
          <input
            id="prep-search-input"
            type="text"
            placeholder="Search preposition (e.g. in, across, depend)..."
            class="w-full bg-slate-900 text-slate-100 placeholder-slate-500 text-xs px-3 py-2 rounded-xl border border-slate-700/80 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
          />
        </div>
      </div>

      <!-- Category Filter Tabs -->
      <div class="flex items-center gap-1 p-2 bg-slate-950/20 border-b border-slate-800/40 overflow-x-auto no-scrollbar">
        <button data-cat="all" class="cat-tab px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition">All</button>
        ${categories.map(c => `
          <button data-cat="${c.id}" class="cat-tab px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition">${c.title.split(' ')[0]}</button>
        `).join('')}
      </div>

      <!-- Prepositions List -->
      <div id="prep-list-container" class="flex-1 overflow-y-auto p-2 space-y-1.5">
        <!-- Injected dynamically -->
      </div>
    `;

    this.container.appendChild(this.element);

    // Search input listener
    const searchInput = this.element.querySelector('#prep-search-input');
    searchInput.addEventListener('input', (e) => {
      this.store.setSearchQuery(e.target.value);
    });

    // Category tabs listeners
    const tabs = this.element.querySelectorAll('.cat-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        this.soundFX.playClick();
        this.store.setFilter(tab.dataset.cat);
      });
    });

    this.update();
  }

  update() {
    if (!this.element) return;
    const state = this.store.getState();

    // Toggle visibility in sandbox vs quest mode
    if (state.mode !== 'sandbox') {
      this.element.classList.add('hidden');
      return;
    } else {
      this.element.classList.remove('hidden');
    }

    // Update active tab styles
    const tabs = this.element.querySelectorAll('.cat-tab');
    tabs.forEach(tab => {
      const isActive = tab.dataset.cat === state.activeFilter;
      tab.className = isActive
        ? 'cat-tab px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 whitespace-nowrap transition'
        : 'cat-tab px-2.5 py-1 rounded-lg text-[11px] font-medium text-slate-400 hover:text-slate-200 whitespace-nowrap transition';
    });

    // Filter items
    const query = state.searchQuery.toLowerCase().trim();
    const filtered = this.store.prepositions.filter(p => {
      const matchCat = state.activeFilter === 'all' || p.category === state.activeFilter;
      const matchQuery = !query || p.name.toLowerCase().includes(query) || p.title.toLowerCase().includes(query) || p.mentalModel.toLowerCase().includes(query);
      return matchCat && matchQuery;
    });

    const countBadge = this.element.querySelector('#catalog-count');
    countBadge.textContent = `${filtered.length} items`;

    // Render list
    const listContainer = this.element.querySelector('#prep-list-container');
    listContainer.innerHTML = filtered.map(p => {
      const isSelected = p.id === state.selectedPrepositionId;
      const catBadgeColor = {
        place: 'bg-sky-950 text-sky-400 border-sky-800',
        movement: 'bg-emerald-950 text-emerald-400 border-emerald-800',
        time: 'bg-purple-950 text-purple-400 border-purple-800',
        collocation: 'bg-amber-950 text-amber-400 border-amber-800'
      }[p.category] || 'bg-slate-800 text-slate-300';

      return `
        <button
          data-id="${p.id}"
          class="prep-item-btn w-full text-left p-2.5 rounded-xl border transition-all duration-200 flex items-center justify-between ${
            isSelected
              ? 'bg-amber-500/15 border-amber-500/60 shadow-md shadow-amber-500/10'
              : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
          }"
        >
          <div class="flex items-center gap-2.5 min-w-0">
            <span class="w-6 h-6 rounded-lg ${isSelected ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-300'} flex items-center justify-center text-xs font-mono font-bold">
              ${p.name.charAt(0).toUpperCase()}
            </span>
            <div class="min-w-0">
              <div class="text-xs font-bold ${isSelected ? 'text-amber-400' : 'text-slate-200'} truncate">
                ${p.name}
              </div>
              <div class="text-[10px] text-slate-400 truncate max-w-[170px]">
                ${p.formula}
              </div>
            </div>
          </div>
          <span class="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border ${catBadgeColor}">
            ${p.category}
          </span>
        </button>
      `;
    }).join('');

    // Attach click handlers
    listContainer.querySelectorAll('.prep-item-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.soundFX.playClick();
        this.store.selectPreposition(btn.dataset.id);
      });
    });
  }
}
