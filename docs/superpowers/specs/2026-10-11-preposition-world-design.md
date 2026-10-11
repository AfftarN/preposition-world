# Preposition World: 3D Isometric Simulator & Game for English Prepositions

- **Date:** 2026-10-11
- **Author:** AfftarN & OpenCode
- **Status:** Approved Draft for Implementation

---

## 1. Vision & Background

Learning English prepositions is notoriously challenging for non-native speakers because prepositions represent abstract conceptual boundaries and spatial metaphors rather than literal word-to-word translations.

Inspired by Laurentiu Raducu's approach (*"How I use LLMs to learn complex topics"*, creating a 3D tycoon simulation like *ChipTycoon* to anchor knowledge to physical 3D objects and animations), **Preposition World** is an interactive, low-poly isometric 3D web application where learners explore, test, and master English prepositions across three core dimensions:
1. **Space & Movement** (containers, surfaces, points, vectors).
2. **Time** (the hierarchical pyramid of `IN > ON > AT`).
3. **Collocations** (idiomatic verb & adjective preposition pairings).

---

## 2. Core Pillars & Pedagogical Framework

### 2.1 The Mental Model Approach
Instead of memorizing flat grammar rules, every preposition is linked to a visual-spatial mental model:
- `IN`: 3D volume / enclosed space / immersion (*in the box, in the car, in 2026, in a city*).
- `ON`: 2D surface / contact / platform you can stand on (*on the table, on the bus, on Monday, on the wall*).
- `AT`: 0D pinpoint coordinate / point in space or exact time (*at the bus stop, at 5:00 PM, at the door*).
- Directional vectors: `INTO` (movement crossing a boundary into volume), `ONTO` (movement landing on surface), `THROUGH` (entry, transit, and exit of a volume/passage), `ACROSS` (movement from one boundary to opposite across surface).

### 2.2 Comic Failure Feedback
When a user selects an incorrect preposition in Quest mode, the simulator visually renders the literal absurdity of the error:
- *Mistake:* "Pip jumped **in** the table."
- *Visualization:* Pip collides with the solid wooden tabletop and bounces off with dizzy stars, accompanied by a prompt: *"A table has a surface (ON), not an interior container (IN)!"*

---

## 3. Architecture & Tech Stack

### 3.1 Tech Stack
- **Build Tool:** Vite (ES modules, fast HMR and bundle optimization).
- **3D Graphics Engine:** Three.js + OrbitControls (isometric orthographic or narrow FOV perspective camera, soft pastel lighting, low-poly procedural geometries).
- **Styling & UI:** Tailwind CSS (modern frosted-glass HUD overlays, clean typography, responsive drawer for mobile/desktop).
- **Icons:** Lucide Icons.
- **Audio & Speech:** Web Audio API (gentle sound effects) + Web Speech API (`speechSynthesis` for native English pronunciation).
- **Testing:** Vitest (unit tests validating prepositions dataset, quest structures, and quiz engine).
- **Hosting & CI/CD:** GitHub Actions workflow building and deploying to GitHub Pages under `https://afftarn.github.io/preposition-world/`.

### 3.2 Directory Structure
```text
preposition-world/
├── .github/
│   └── workflows/
│       └── deploy.yml            # Automated GitHub Pages deployment
├── index.html                    # Single Page App shell
├── package.json
├── vite.config.js                # Base path configuration for GitHub Pages
├── src/
│   ├── main.js                   # Application bootstrap and loop
│   ├── scene/
│   │   ├── World.js              # 3D island coordinator, lighting, terrain
│   │   ├── CameraManager.js      # Smooth camera panning and tweening
│   │   ├── Character.js          # Pip mesh model and kinematic animations
│   │   └── zones/
│   │       ├── SpatialZone.js    # Room, box, bridge, tunnel, bus, table
│   │       ├── TimeZone.js       # Interactive Time Pyramid (IN > ON > AT)
│   │       └── CollocationZone.js# Interactive vignettes (good at, depend on, etc.)
│   ├── data/
│   │   ├── prepositions.js       # Structured dataset of 30+ prepositions
│   │   └── quests.js             # 20+ progressive interactive quest scenarios
│   ├── state/
│   │   └── Store.js              # Reactive state (mode, selected item, progress)
│   ├── ui/
│   │   ├── HUD.js                # Top bar, play/pause/speed controls, sound toggle
│   │   ├── ExplorerPanel.js      # Sidebar catalog of prepositions with filters
│   │   ├── MentalModelCard.js    # Explanation card with native speaker perspective
│   │   └── QuestModal.js         # Challenge prompts, interactive choices, score
│   └── audio/
│       └── SoundEffects.js       # Procedural Web Audio FX (blip, success, bounce)
└── tests/
    └── dataset.test.js           # Verification of curriculum data integrity
```

---

## 4. 3D World & Zones Specification

### 4.1 Island Layout (The Diorama)
The scene is set on a floating low-poly island surrounded by stylized animated water.
- **Center-Left:** *Spatial Park & Room* (houses, open-top transparent box, solid table, arched bridge over river, tunnel through a grassy hill, bus stop and open-roof bus).
- **Center-Right:** *Time Plaza* (stepped 3-tier pyramid with rotating sun/moon dial indicating years/months, days, hours).
- **Foreground:** *Collocation Stage* (interactive vignettes: guitar on stage for `good at`, balancing lever for `depend on`, telescope for `interested in`).

### 4.2 Character (Pip)
- Low-poly cute robot/bean character with expressive eyes and limbs.
- Rigged for procedural animations: walk, jump, sit, look around, bounce, dive, and celebratory dances.

### 4.3 Simulation Controls
- **Play / Pause:** Freeze animation at any exact spatial intersection.
- **Playback Speed:** 0.5x (slow-motion for analyzing motion vectors) and 1x.
- **Vector Overlay:** Toggleable holographic lines showing spatial vectors, container boundaries, and contact planes.

---

## 5. Learning & Game Modes

### 5.1 Mode A: Sandbox (Free Exploration)
- User browses categories:
  - *Place & Position:* `in`, `on`, `at`, `under`, `behind`, `in front of`, `between`, `above`, `below`.
  - *Movement & Direction:* `into`, `out of`, `onto`, `off`, `through`, `across`, `towards`, `along`.
  - *Time:* `in` (centuries, decades, years, months), `on` (days, dates), `at` (precise clock times, holidays).
  - *Collocations:* `interested in`, `good at`, `depend on`, `listen to`, `wait for`, `afraid of`, `famous for`.
- Clicking a preposition triggers:
  1. Smooth camera zoom and focus on the corresponding zone.
  2. Pip performs the associated action.
  3. Mental Model Card reveals:
     - Core intuition ("Why English speakers think this way").
     - Clear contrast examples (*in the car* vs *on the bus*).
     - Pronunciation button.
     - Common traps for Russian/ESL speakers.

### 5.2 Mode B: Quest Mode (Quests & Challenges)
- Progressive scenario-based challenges.
- Learner receives prompt (e.g., *"Pip wants to enter the underground tunnel from the park. Which action is correct?"*).
- Options presented as choices with instant 3D feedback.
- Incorrect choice triggers comic fail animation + targeted tip.
- Correct choice awards points and saves milestone to `localStorage`.

---

## 6. GitHub Integration & Deployment

- **Repository:** `AfftarN/preposition-world`
- **Visibility:** Public
- **GitHub Pages:**
  - Automated deployment on push to `main` branch via GitHub Actions (`actions/deploy-pages`).
  - Base URL configured in Vite: `/preposition-world/`.

---

## 7. Verification & Quality Gates

- **Unit Tests:** Vitest suites validating that every preposition has complete metadata, audio tags, valid coordinates, and quest linkages.
- **Build Quality:** Strict zero-warning Vite production build.
- **Cross-device Responsiveness:** Mobile touch controls (pinch-zoom, drag) and desktop mouse controls.
