/**
 * storage.js — localStorage helpers
 *
 * Persists: preferences (language, stars, streak) and per-module progress.
 * Designed to be easily swapped for a remote API later.
 */

const KEYS = {
  preferences: 'veera_prefs_v1',
  progress: 'veera_progress_v1',
};

// ── Preferences (language, stars, streak) ─────────────────────────────────

/** @returns {object} Saved preferences or empty object */
export function loadPreferences() {
  try {
    const raw = localStorage.getItem(KEYS.preferences);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/** @param {object} prefs */
export function savePreferences(prefs) {
  try {
    localStorage.setItem(KEYS.preferences, JSON.stringify(prefs));
  } catch {
    // Storage might be full — fail silently
  }
}

// ── Module Progress ────────────────────────────────────────────────────────

/** @returns {object} Saved progress map or empty object */
export function loadProgress() {
  try {
    const raw = localStorage.getItem(KEYS.progress);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/** @param {object} progress */
export function saveProgress(progress) {
  try {
    localStorage.setItem(KEYS.progress, JSON.stringify(progress));
  } catch {}
}

// ── Helpers ────────────────────────────────────────────────────────────────

/** Clear ALL saved data (for parent dashboard reset). */
export function clearAllData() {
  try {
    localStorage.removeItem(KEYS.preferences);
    localStorage.removeItem(KEYS.progress);
  } catch {}
}

/**
 * Get total items seen across all modules.
 * @param {object} progress
 */
export function getTotalItemsSeen(progress) {
  return Object.values(progress).reduce((sum, mod) => {
    return sum + (mod?.seen?.length || 0);
  }, 0);
}

/**
 * Get total modules completed.
 * @param {object} progress
 */
export function getTotalModulesCompleted(progress) {
  return Object.values(progress).filter((mod) => mod?.completed).length;
}
