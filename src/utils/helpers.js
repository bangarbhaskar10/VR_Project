/**
 * helpers.js — General utility functions
 */

/**
 * Shuffle an array (Fisher-Yates).
 * @param {any[]} arr
 * @returns {any[]} New shuffled array
 */
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Pick N random unique items from an array.
 * @param {any[]} arr
 * @param {number} n
 * @returns {any[]}
 */
export function pickRandom(arr, n) {
  return shuffle(arr).slice(0, n);
}

/**
 * Clamp a number between min and max.
 */
export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

/**
 * Wait for ms milliseconds (async).
 */
export function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Get a random item from an array.
 */
export function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Format a date as a readable string.
 */
export function formatDate(dateStr) {
  if (!dateStr) return 'Never';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
