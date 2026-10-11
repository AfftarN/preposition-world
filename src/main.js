import { World } from './scene/World.js';
import { Character } from './scene/Character.js';
import { SpatialZone } from './scene/zones/SpatialZone.js';
import { TimeZone } from './scene/zones/TimeZone.js';
import { CollocationZone } from './scene/zones/CollocationZone.js';
import { VisualVectors } from './scene/VisualVectors.js';

import { prepositions } from './data/prepositions.js';
import { quests } from './data/quests.js';
import { Store } from './state/Store.js';
import { soundFX } from './audio/SoundEffects.js';

import { HUD } from './ui/HUD.js';
import { ExplorerPanel } from './ui/ExplorerPanel.js';
import { MentalModelCard } from './ui/MentalModelCard.js';
import { QuestModal } from './ui/QuestModal.js';

// --- APPLICATION BOOTSTRAP ---

const canvas = document.getElementById('webgl-canvas');
const appContainer = document.getElementById('app');

// 1. Initialize 3D World
const world = new World(canvas);

// 2. Initialize 3D Zones & Character
const character = new Character();
const spatialZone = new SpatialZone();
const timeZone = new TimeZone();
const collocationZone = new CollocationZone();
const visualVectors = new VisualVectors(world.scene);

// Register meshes and updatables
world.scene.add(spatialZone.group);
world.scene.add(timeZone.group);
world.scene.add(collocationZone.group);
world.scene.add(character.mesh);

world.addUpdatable(character);
world.addUpdatable(timeZone);
world.addUpdatable(collocationZone);

// Aggregate all 3D target coordinates
const allTargets = {
  ...spatialZone.targets,
  ...timeZone.targets,
  ...collocationZone.targets
};

// 3. Initialize Reactive State Store
const store = new Store(prepositions, quests);
soundFX.setEnabled(store.getState().soundEnabled);

// 4. Coordinator functions
function displayPrepositionIn3D(prep) {
  if (!prep) return;
  const target = allTargets[prep.visualTarget];
  if (!target) return;

  // Camera smooth focus
  if (prep.category === 'time') {
    // Elevate and frame the full Time Pyramid
    world.cameraManager.focusOn({ x: 8, y: 2.3, z: -3.6 }, 1.35);
  } else {
    world.cameraManager.focusOn(target, 0.95);
  }

  // Position Character
  character.setPosition(target.x, target.y, target.z);
  character.playAnimation(prep.animationType);

  // Render visual mental model vectors
  visualVectors.clear();
  const prepId = prep.id;

  if (prepId === 'in-place') {
    visualVectors.showContainer(target, { x: 2.2, y: 1.5, z: 2.2 });
  } else if (prepId === 'in-time') {
    visualVectors.showContainer({ x: 8, y: 0.9, z: -4 }, { x: 7.4, y: 1.05, z: 7.4 });
  } else if (prepId === 'on-place') {
    visualVectors.showSurface(target, { x: 2.6, z: 2.0 });
  } else if (prepId === 'on-time') {
    visualVectors.showSurface({ x: 8, y: 2.1, z: -4 }, { x: 5.2, z: 5.2 });
  } else if (prepId === 'at-place') {
    visualVectors.showCoordinatePoint(target, true);
  } else if (prepId === 'at-time') {
    visualVectors.showCoordinatePoint(target, false);
  } else if (['into', 'through', 'across', 'onto', 'towards'].includes(prep.name)) {
    const fromCoord = { x: target.x - 2.5, y: target.y + 1.2, z: target.z - 2.0 };
    visualVectors.showArrow(fromCoord, target, 0x22c55e);
  }
}

function handleQuestExecution(quest, answerResult) {
  const target = allTargets[quest.zoneTarget] || { x: 0, y: 1, z: 0 };
  world.cameraManager.focusOn(target, 0.9);

  if (answerResult.success) {
    character.setPosition(target.x, target.y, target.z);
    character.playAnimation(quest.animationAction || 'celebrate');
    visualVectors.showCoordinatePoint(target);
  } else {
    // Comic failure bounce!
    character.setPosition(target.x, target.y, target.z);
    character.playAnimation('fail_bump');
    visualVectors.clear();
  }
}

// 5. Initialize UI Components
new HUD(appContainer, store, soundFX, () => {
  world.cameraManager.resetView();
  visualVectors.clear();
});

new ExplorerPanel(appContainer, store, soundFX);

new MentalModelCard(appContainer, store, soundFX, (prep) => {
  displayPrepositionIn3D(prep);
});

new QuestModal(appContainer, store, soundFX, (quest, answerResult) => {
  handleQuestExecution(quest, answerResult);
});

// 6. Reactive Store Subscriptions
let previousPrepositionId = null;
let previousMode = null;
let previousQuestIndex = null;

store.subscribe((state) => {
  // Speed control
  character.animationDuration = state.playbackSpeed === 0.5 ? 2.0 : 1.0;

  // On Preposition selection change in Sandbox
  if (state.mode === 'sandbox' && state.selectedPrepositionId !== previousPrepositionId) {
    previousPrepositionId = state.selectedPrepositionId;
    const prep = store.getSelectedPreposition();
    displayPrepositionIn3D(prep);
  }

  // On Quest selection change
  if (state.mode === 'quest' && state.activeQuestIndex !== previousQuestIndex) {
    previousQuestIndex = state.activeQuestIndex;
    const quest = store.getCurrentQuest();
    if (quest && allTargets[quest.zoneTarget]) {
      world.cameraManager.focusOn(allTargets[quest.zoneTarget], 1.0);
      visualVectors.clear();
    }
  }

  // On mode toggle
  if (state.mode !== previousMode) {
    previousMode = state.mode;
    if (state.mode === 'sandbox') {
      const prep = store.getSelectedPreposition();
      displayPrepositionIn3D(prep);
    } else {
      const quest = store.getCurrentQuest();
      if (quest && allTargets[quest.zoneTarget]) {
        world.cameraManager.focusOn(allTargets[quest.zoneTarget], 1.0);
        visualVectors.clear();
      }
    }
  }
});

// 7. Initial focus
displayPrepositionIn3D(store.getSelectedPreposition());

// 8. Start Rendering Loop
world.animate();
