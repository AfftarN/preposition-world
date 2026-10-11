# 🌍 Preposition World — 3D English Preposition Simulator

> An interactive, low-poly isometric 3D simulation and game for mastering English prepositions through spatial mental models and comic failure animations.

Live Demo on GitHub Pages: **[https://afftarn.github.io/preposition-world/](https://afftarn.github.io/preposition-world/)**

---

## 💡 About the Project

Learning English prepositions is notoriously tricky for non-native speakers because they represent conceptual spatial metaphors and mental boundaries rather than literal word-for-word translations.

Inspired by Laurentiu Raducu's approach (*"How I use LLMs to learn complex topics"*, creating a 3D tycoon simulation to physically anchor conceptual knowledge to 3D objects), **Preposition World** turns abstract grammar into an intuitive, low-poly diorama.

### Core Features

- **3D Spatial Mental Models:**
  - `IN`: 3D enclosed volumes and containers (*in the box, in the car, in the city*).
  - `ON`: 2D flat surfaces and contact platforms (*on the table, on the bus, on the wall*).
  - `AT`: 0D pinpoint coordinates and functional venues (*at the bus stop, at 5 PM*).
  - Directional Vectors: `into`, `onto`, `through`, `across`, `out of`, `off`, `towards`.
- **The Time Pyramid (IN > ON > AT):**
  - Walk up the 3-tier stepped pyramid from broad eras/years (`IN 2026`), to specific days (`ON Friday`), to sharp needle clock points (`AT 5:00 PM`).
- **Collocations & Idioms Pavilion:**
  - Interactive vignettes for tricky pairs like `good at`, `interested in`, `depend on`, `listen to`, `congratulate on`.
- **Two Game Modes:**
  - **🔍 Sandbox (Exploration):** Freely rotate the island, select any preposition to see Pip animate the action, inspect the native speaker's intuition, contrast examples, and listen to native pronunciation (Web Speech API).
  - **🎯 Quest Mode (Interactive Challenges):** Progressive scenarios with multiple choices. Choosing an incorrect preposition triggers a comic visual misunderstanding (Pip bonks against the solid tabletop when trying to jump *in* the table!) with a clear explanation of why.
- **Pure Web Performance:** Zero external 3D asset downloads; all geometries, shaders, and sound effects (Web Audio API) are procedurally generated for zero-latency loading.

---

## 🛠️ Tech Stack

- **3D Engine:** [Three.js](https://threejs.org/) + OrbitControls
- **Build & Dev:** [Vite](https://vitejs.dev/)
- **UI & Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Testing:** [Vitest](https://vitest.dev/)
- **Audio & Speech:** Web Audio API (procedural retro synthesis) + Web Speech API (pronunciation)
- **Deployment:** GitHub Pages & GitHub Actions

---

## 🚀 Getting Started

### Local Development

```bash
# Clone the repository
git clone https://github.com/AfftarN/preposition-world.git
cd preposition-world

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

### Running Tests

```bash
npm test
```

### Building for Production

```bash
npm run build
```

---

## 📜 License

MIT © [AfftarN](https://github.com/AfftarN)
