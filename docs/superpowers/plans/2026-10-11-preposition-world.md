# Preposition World Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and publish "Preposition World", an interactive 3D isometric simulation and quest web application to master English prepositions with visual spatial mental models and comic failure animations.

**Architecture:** Single-page web app built with Vite and Three.js. It features a reactive lightweight Store, a low-poly procedural 3D island with character Pip and three thematic zones (Spatial, Time Pyramid, Collocations), synchronized with modern Tailwind CSS HUD panels, Web Audio sound effects, and Web Speech pronunciation.

**Tech Stack:** JavaScript (ES Modules), Vite, Three.js, OrbitControls, Tailwind CSS, Lucide Icons, Web Audio API, Web Speech API, Vitest.

**Spec:** `docs/superpowers/specs/2026-10-11-preposition-world-design.md`

## Global Constraints
- Target repository: `AfftarN/preposition-world`
- Deployment target: GitHub Pages under `/preposition-world/`
- Zero external assets required (all 3D meshes, textures, and sounds are procedurally generated for zero asset loading latency)
- Full responsiveness on desktop and mobile touch devices

## Review Focus
1. Mobile / Touch Viewport: OrbitControls must not trap page touch events or break drawer scrolling.
2. Web Speech API fallback: If speech synthesis is unavailable on the device or browser, UI must fail gracefully without throwing uncaught exceptions.
3. 3D Animation Interruption: Switching prepositions mid-animation must safely reset Pip's kinematic state and tween without clipping into geometry.
4. Quest Reset & Edge Cases: Reaching the final quest must display a completion celebration and allow restarting or reviewing mistakes without state corruption.
5. GitHub Pages Base Path: Assets, scripts, and links must properly resolve with the `/preposition-world/` base path.

---

### Task 1: Project Scaffolding, GitHub Repo & CI/CD Setup

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `.gitignore`
- Create: `.github/workflows/deploy.yml`
- Test: `tests/scaffold.test.js`

**Interfaces:**
- Consumes: Node.js, Vite, npm
- Produces: Project build script (`npm run build`), test runner (`npm test`), GitHub repository `AfftarN/preposition-world`

- [ ] **Step 1: Write test for build configuration**
Create `tests/scaffold.test.js` checking that vite config exports the expected base path `/preposition-world/`.

- [ ] **Step 2: Run test to verify failure**
Run: `npx vitest run tests/scaffold.test.js` (fails as files do not exist yet)

- [ ] **Step 3: Setup package.json, vite.config.js, .gitignore, and GitHub Actions workflow**
Initialize dependencies (`three`, `lucide`, `tailwindcss`, `vite`, `vitest`). Configure `vite.config.js` with `base: '/preposition-world/'`. Create `.github/workflows/deploy.yml` with GitHub Pages deployment steps.

- [ ] **Step 4: Run test and build verification**
Run: `npx vitest run tests/scaffold.test.js` and `npm run build`
Expected: PASS and dist directory generated without errors.

- [ ] **Step 5: Create remote GitHub repo and commit**
Run `git init`, create remote repo `AfftarN/preposition-world` via `gh repo create`, commit initial scaffolding.

---

### Task 2: Core Data Layer (Prepositions & Quests Curriculum)

**Files:**
- Create: `src/data/prepositions.js`
- Create: `src/data/quests.js`
- Test: `tests/dataset.test.js`

**Interfaces:**
- Consumes: None
- Produces:
  - `prepositions`: Array of Preposition objects `{ id, name, category, mentalModel, formula, contrastExample, commonMistake, pronunciationText, visualTarget, animationType }`
  - `categories`: Array of `{ id, title, icon }`
  - `quests`: Array of Quest objects `{ id, prompt, sentenceWithBlank, options, correctId, failExplanations, zoneTarget, animationAction }`

- [ ] **Step 1: Write the failing test for curriculum data**
Create `tests/dataset.test.js` asserting:
- `prepositions` contains at least 25 entries across `place`, `movement`, `time`, and `collocation`.
- Each preposition has non-empty `id`, `name`, `category`, `mentalModel`, and `animationType`.
- `quests` contains at least 15 scenarios.
- For every quest, `correctId` exists in its `options` and corresponds to a valid preposition in `prepositions`.

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run tests/dataset.test.js`
Expected: FAIL (cannot find module `src/data/prepositions.js`)

- [ ] **Step 3: Implement `src/data/prepositions.js` and `src/data/quests.js`**
Author comprehensive, linguistically accurate datasets with clear mental models for ESL learners.

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run tests/dataset.test.js`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add src/data/ tests/dataset.test.js
git commit -m "feat(data): add comprehensive prepositions and quests datasets"
```

---

### Task 3: Reactive State Store & Audio System

**Files:**
- Create: `src/state/Store.js`
- Create: `src/audio/SoundEffects.js`
- Create: `src/audio/Speech.js`
- Test: `tests/store.test.js`

**Interfaces:**
- Consumes: `src/data/prepositions.js`, `src/data/quests.js`
- Produces:
  - `Store`: `{ getState(), setState(), subscribe(listener), selectPreposition(id), setMode(mode), answerQuest(optionId), nextQuest(), resetQuests() }`
  - `soundFX`: `{ playClick(), playSuccess(), playFail(), playWhoosh(), setEnabled(bool) }`
  - `speakText(text: string)`: Web Speech API helper

- [ ] **Step 1: Write failing test for Store**
Create `tests/store.test.js` testing mode transitions, preposition selection, quest answering, scoring, and subscriber callbacks.

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run tests/store.test.js`
Expected: FAIL

- [ ] **Step 3: Implement Store.js, SoundEffects.js, and Speech.js**
Implement pub/sub store with localStorage persistence, Web Audio synthetic oscillators for sound effects, and safe speech synthesis.

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run tests/store.test.js`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add src/state/ src/audio/ tests/store.test.js
git commit -m "feat(state,audio): implement reactive store and audio systems"
```

---

### Task 4: Three.js World Base, Camera Manager & Lighting

**Files:**
- Create: `src/scene/World.js`
- Create: `src/scene/CameraManager.js`
- Test: `tests/camera.test.js`

**Interfaces:**
- Consumes: Three.js, OrbitControls
- Produces:
  - `World`: `{ scene, camera, renderer, init(container), animate(), addZone(zone) }`
  - `CameraManager`: `{ focusOn(targetVector, durationMs), resetView() }`

- [ ] **Step 1: Write unit test for CameraManager coordinates**
Create `tests/camera.test.js` verifying camera position interpolation calculations and boundary clamps.

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run tests/camera.test.js`
Expected: FAIL

- [ ] **Step 3: Implement World.js and CameraManager.js**
Set up Three.js scene with directional pastel sun, ambient lighting, soft shadows, low-poly floating island terrain, and smooth camera tweening.

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run tests/camera.test.js`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add src/scene/World.js src/scene/CameraManager.js tests/camera.test.js
git commit -m "feat(scene): initialize Three.js world and camera manager"
```

---

### Task 5: Character Pip & Interactive 3D Zones

**Files:**
- Create: `src/scene/Character.js`
- Create: `src/scene/zones/SpatialZone.js`
- Create: `src/scene/zones/TimeZone.js`
- Create: `src/scene/zones/CollocationZone.js`
- Create: `src/scene/VisualVectors.js`
- Test: `tests/zones.test.js`

**Interfaces:**
- Consumes: `World`, `Three.js`
- Produces:
  - `Character`: `{ mesh, playAnimation(type, callback), setPosition(x, y, z), reset() }`
  - `SpatialZone`, `TimeZone`, `CollocationZone`: 3D groups containing interactive models (table, box, bridge, tunnel, bus, pyramid, stage).
  - `VisualVectors`: Helper rendering translucent boundary planes, glowing containers, and motion vector arrows.

- [ ] **Step 1: Write test verifying zone coordinate targets**
Create `tests/zones.test.js` ensuring each preposition's `visualTarget` maps to an existing coordinate in one of the zones.

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run tests/zones.test.js`
Expected: FAIL

- [ ] **Step 3: Implement Character.js and the 3 Zones**
Construct low-poly procedural geometries:
- Pip (head, glowing visor eyes, limbs, procedural jump/bounce/collision anims).
- SpatialZone: room, transparent open box (`in`), table (`on`), bus stop (`at`), bridge (`across`), tunnel (`through`), bus (`onto/on`).
- TimeZone: 3-tier stepped pyramid (`in` > `on` > `at`) with rotating clock/calendar halo.
- CollocationZone: stage with guitar (`good at`), balancing scales (`depend on`), telescope (`interested in`).
- VisualVectors: highlight volumes, contact planes, and vector arrows.

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run tests/zones.test.js`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add src/scene/ tests/zones.test.js
git commit -m "feat(scene): build Pip character, 3D zones, and visual vectors"
```

---

### Task 6: UI Overlays (HUD, Explorer Panel, Mental Model Card, Quest Engine) & Main Bootstrap

**Files:**
- Create: `src/ui/HUD.js`
- Create: `src/ui/ExplorerPanel.js`
- Create: `src/ui/MentalModelCard.js`
- Create: `src/ui/QuestModal.js`
- Create: `src/main.js`
- Modify: `index.html`

**Interfaces:**
- Consumes: `Store`, `World`, `Character`, `SoundEffects`, `Speech`
- Produces: Complete playable interactive application

- [ ] **Step 1: Implement UI components**
Create sleek frosted glass HUD with:
- Top bar: Mode switcher (Sandbox / Quest), playback speed (0.5x, 1x), pause/play, audio toggle.
- Explorer Panel: Preposition pill selector, search bar, category chips.
- Mental Model Card: Card showing native speaker intuition, formula, contrast examples, audio button.
- Quest Modal: Scenario card, multiple choice options, instant visual feedback, comic error explanation.

- [ ] **Step 2: Wire `src/main.js` to coordinate 3D scene and UI**
Connect Store event subscriptions to trigger Pip animations, camera tweening, vector overlays, and sound FX.

- [ ] **Step 3: Verify end-to-end functionality and build**
Run: `npm run build`
Verify dist output size, bundle chunks, and zero console/build warnings.

- [ ] **Step 4: Commit**
```bash
git add src/ui/ src/main.js index.html
git commit -m "feat(ui): implement HUD, explorer, mental model card, and quest modal"
```

---

### Task 7: GitHub Remote Setup, Push & GitHub Pages Deployment

**Files:**
- Verify: `.github/workflows/deploy.yml`
- Verify: `package.json`

**Interfaces:**
- Consumes: GitHub CLI (`gh`), Git
- Produces: Remote repository `AfftarN/preposition-world`, live GitHub Pages deployment

- [ ] **Step 1: Check git status and run test suite**
Run: `npm test`
Expected: All test suites PASS.

- [ ] **Step 2: Create GitHub repository under AfftarN**
Run: `gh repo create AfftarN/preposition-world --public --source=. --remote=origin --push`

- [ ] **Step 3: Enable and verify GitHub Pages workflow**
Enable GitHub Pages on repository and push `main` branch.

- [ ] **Step 4: Final verification**
Check repository status on GitHub and provide live link.
