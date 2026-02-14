import { genId } from "./ui.js";
import { defaultScenarios } from "./defaultScenarios.js";
import { inferColorKeyFromName } from "./colorThemes.js";
import { getAllScenarios, saveScenario, deleteScenario, migrateFromLocalStorage } from "./db.js";

export const STORAGE_KEY = "raca-simple-packing-v1";

export const appState = {
  scenarios: [],
  lastOpenedScenarioId: null,
};

// Async load
export async function loadState() {
  try {
    // Try migration first
    await migrateFromLocalStorage(STORAGE_KEY);

    const stored = await getAllScenarios();
    if (!stored || stored.length === 0) {
      await bootstrapDefaults();
    } else {
      appState.scenarios = stored;
    }

    // Load last opened ID from localStorage (UI state, okay to keep in localStorage)
    const lastId = localStorage.getItem("raca-last-scenario-id");
    appState.lastOpenedScenarioId = lastId || null;

  } catch (e) {
    console.error("State load error", e);
    // Fallback to defaults in memory if critical failure
    if (appState.scenarios.length === 0) {
      // minimal in-memory fallback
      appState.scenarios = [];
    }
  }
}

export async function saveState() {
  // Typically we save individual scenarios now. This function might become deprecated 
  // or just save "global" state like lastOpenedScenarioId.
  localStorage.setItem("raca-last-scenario-id", appState.lastOpenedScenarioId || "");
}

export async function bootstrapDefaults() {
  const newScenarios = defaultScenarios.map((sc) => ({
    id: genId("scenario"),
    name: sc.name,
    icon: sc.icon || "🎒",
    colorKey: sc.colorKey || inferColorKeyFromName(sc.name),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    items: sc.items.map((label) => ({
      id: genId("item"),
      label,
      done: false,
    })),
  }));

  for (const s of newScenarios) {
    await saveScenario(s);
  }
  appState.scenarios = newScenarios;
}

export function getScenarioById(id) {
  return appState.scenarios.find((s) => s.id === id) || null;
}

// Update single scenario in DB
export async function updateScenario(updated) {
  const idx = appState.scenarios.findIndex((s) => s.id === updated.id);
  if (idx !== -1) {
    updated.updatedAt = Date.now();
    appState.scenarios[idx] = updated;
    await saveScenario(updated);
  }
}

// Add new scenario reference wrapper
export async function addScenario(scenario) {
  appState.scenarios.push(scenario);
  await saveScenario(scenario);
}

// Remove wrapper
export async function removeScenario(id) {
  appState.scenarios = appState.scenarios.filter(s => s.id !== id);
  await deleteScenario(id);
}
