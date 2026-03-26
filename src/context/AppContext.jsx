import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loadProgress, saveProgress, loadPreferences, savePreferences } from '../utils/storage.js';

/**
 * Global application context.
 * Manages: language toggle, music toggle, progress tracking, stars/rewards.
 */
const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Language: 'en' (English) or 'mr' (Marathi)
  const [language, setLanguage] = useState('en');

  // Background music toggle
  const [musicOn, setMusicOn] = useState(false);

  // Total stars earned across all activities
  const [totalStars, setTotalStars] = useState(0);

  // Per-module progress: { moduleId: { seen: Set, completed: boolean } }
  const [progress, setProgress] = useState({});

  // Daily streak
  const [streak, setStreak] = useState({ count: 0, lastDate: null });

  // Load saved preferences and progress on mount
  useEffect(() => {
    const prefs = loadPreferences();
    if (prefs.language) setLanguage(prefs.language);
    if (typeof prefs.totalStars === 'number') setTotalStars(prefs.totalStars);
    if (prefs.streak) setStreak(prefs.streak);

    const savedProgress = loadProgress();
    if (savedProgress) setProgress(savedProgress);

    // Update streak
    updateStreak();
  }, []);

  // Persist preferences when they change
  useEffect(() => {
    savePreferences({ language, totalStars, streak });
  }, [language, totalStars, streak]);

  // Persist progress when it changes
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  /**
   * Updates the daily learning streak.
   * Increments if user opened app on a new day, resets if day was skipped.
   */
  const updateStreak = () => {
    const today = new Date().toDateString();
    setStreak((prev) => {
      if (!prev.lastDate) return { count: 1, lastDate: today };
      if (prev.lastDate === today) return prev;

      const last = new Date(prev.lastDate);
      const now = new Date(today);
      const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        return { count: prev.count + 1, lastDate: today };
      } else {
        return { count: 1, lastDate: today };
      }
    });
  };

  /**
   * Award stars to the child.
   * @param {number} count - Number of stars to add
   */
  const awardStars = useCallback((count = 1) => {
    setTotalStars((prev) => prev + count);
  }, []);

  /**
   * Mark an item as seen within a module.
   * @param {string} moduleId
   * @param {string|number} itemId
   */
  const markSeen = useCallback((moduleId, itemId) => {
    setProgress((prev) => {
      const mod = prev[moduleId] || { seen: [], completed: false };
      const seen = mod.seen.includes(itemId) ? mod.seen : [...mod.seen, itemId];
      return { ...prev, [moduleId]: { ...mod, seen } };
    });
  }, []);

  /**
   * Mark a full module as completed.
   * @param {string} moduleId
   */
  const markModuleComplete = useCallback((moduleId) => {
    setProgress((prev) => ({
      ...prev,
      [moduleId]: { ...(prev[moduleId] || { seen: [] }), completed: true },
    }));
    awardStars(5);
  }, [awardStars]);

  /**
   * Get completion percentage for a module.
   * @param {string} moduleId
   * @param {number} total - Total items in module
   */
  const getModuleProgress = useCallback((moduleId, total) => {
    const mod = progress[moduleId];
    if (!mod || !mod.seen.length) return 0;
    return Math.round((mod.seen.length / total) * 100);
  }, [progress]);

  const toggleLanguage = useCallback(() => {
    setLanguage((l) => (l === 'en' ? 'mr' : 'en'));
  }, []);

  const toggleMusic = useCallback(() => {
    setMusicOn((m) => !m);
  }, []);

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    musicOn,
    toggleMusic,
    totalStars,
    awardStars,
    progress,
    markSeen,
    markModuleComplete,
    getModuleProgress,
    streak,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/**
 * Custom hook to access global app state.
 * Usage: const { language, totalStars } = useApp();
 */
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export default AppContext;
