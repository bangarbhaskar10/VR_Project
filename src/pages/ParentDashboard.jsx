import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext.jsx';
import { ALL_MODULES } from '../data/modules.js';
import { clearAllData } from '../utils/storage.js';
import { formatDate } from '../utils/helpers.js';

/**
 * ParentDashboard — A simple progress overview for parents.
 * Shows stars, streak, per-module progress, and a reset button.
 */
function ParentDashboard() {
  const navigate = useNavigate();
  const { totalStars, streak, progress, language, toggleLanguage } = useApp();
  const [confirmReset, setConfirmReset] = useState(false);
  const [photoError, setPhotoError] = useState(false);

  const totalSeen = Object.values(progress).reduce(
    (sum, mod) => sum + (mod?.seen?.length || 0), 0
  );
  const modulesCompleted = Object.values(progress).filter((m) => m?.completed).length;

  const handleReset = () => {
    if (!confirmReset) { setConfirmReset(true); return; }
    clearAllData();
    window.location.href = '/';
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-white/5 border-b border-white/10">
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={() => navigate('/')}
          className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center text-2xl"
        >
          ⬅️
        </motion.button>
        <h1 className="text-white font-black text-xl">👨‍👩‍👧 Parent Dashboard</h1>
        <div className="w-11" />
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">

        {/* ── Child info card with photo ──────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-6 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed, #4f46e5)' }}
        >
          {/* Background sparkles */}
          <div className="absolute inset-0 pointer-events-none opacity-20 text-4xl flex flex-wrap gap-4 items-center justify-around">
            {['⭐','✨','🌟','⭐','✨'].map((e, i) => (
              <span key={i}>{e}</span>
            ))}
          </div>

          {/* Photo */}
          <div className="relative inline-block mb-3">
            {/* Spinning glow ring */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'conic-gradient(#fbbf24, #ff6b9d, #a855f7, #22d3ee, #fbbf24)',
                padding: '3px',
                borderRadius: '9999px',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />
            {!photoError ? (
              <img
                src="/veera.jpg"
                alt="Veera"
                onError={() => setPhotoError(true)}
                className="relative w-24 h-24 rounded-full object-cover shadow-2xl"
                style={{ border: '4px solid rgba(255,255,255,0.95)', position: 'relative', zIndex: 1 }}
              />
            ) : (
              <div
                className="relative w-24 h-24 rounded-full flex items-center justify-center shadow-2xl text-5xl"
                style={{
                  background: 'linear-gradient(135deg, #ff6b9d, #fbbf24)',
                  border: '4px solid rgba(255,255,255,0.95)',
                  zIndex: 1,
                }}
              >
                👧
              </div>
            )}
            {/* Star badge */}
            <motion.div
              className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full w-7 h-7 flex items-center justify-center text-sm shadow-lg"
              style={{ zIndex: 2 }}
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ⭐
            </motion.div>
          </div>

          <h2 className="text-white font-black text-3xl">Veera</h2>
          <p className="text-white/80 font-semibold">Age: 2.5 years old 👶</p>
          <p className="text-white/60 text-sm mt-1">Junior KG Learner 📚</p>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total Stars', value: totalStars,         emoji: '⭐', color: '#EAB308' },
            { label: 'Day Streak',  value: streak.count,       emoji: '🔥', color: '#F97316' },
            { label: 'Modules Done',value: modulesCompleted,   emoji: '✅', color: '#22C55E' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl p-4 text-center border border-white/10"
              style={{ background: `${stat.color}22` }}
            >
              <div className="text-3xl mb-1">{stat.emoji}</div>
              <div className="text-white font-black text-2xl">{stat.value}</div>
              <div className="text-white/60 text-xs font-semibold">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Total items seen */}
        <div className="rounded-2xl p-4 bg-white/8 border border-white/10 text-center">
          <span className="text-white/60 text-sm font-semibold">Total items explored: </span>
          <span className="text-white font-black text-xl">{totalSeen}</span>
          <span className="text-white/60 text-sm font-semibold ml-1">items 🌟</span>
        </div>

        {/* Per-module progress */}
        <div>
          <h3 className="text-white/70 font-bold text-sm uppercase tracking-wider mb-3 px-1">
            Module Progress ({ALL_MODULES.length} total modules)
          </h3>
          <div className="space-y-2">
            {ALL_MODULES.map((mod) => {
              const mod_progress = progress[mod.id];
              const seen = mod_progress?.seen?.length || 0;
              const completed = mod_progress?.completed || false;
              const pct = Math.round((seen / mod.totalItems) * 100);

              return (
                <motion.div
                  key={mod.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-2xl p-4 bg-white/5 border border-white/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{mod.emoji}</span>
                      <span className="text-white font-bold text-sm">{mod.title}</span>
                      {completed && <span className="text-green-400 text-xs font-black">✅ Done!</span>}
                    </div>
                    <span className="text-white/60 text-xs font-semibold">
                      {seen}/{mod.totalItems}
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: mod.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Settings section */}
        <div className="rounded-3xl p-5 bg-white/5 border border-white/10 space-y-4">
          <h3 className="text-white font-black text-lg">⚙️ Settings</h3>

          {/* Language toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-bold">Language</p>
              <p className="text-white/50 text-sm">English / मराठी</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleLanguage}
              className="px-5 py-2 rounded-2xl font-black text-white text-sm"
              style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)' }}
            >
              {language === 'en' ? '🇮🇳 Switch to मराठी' : '🇬🇧 Switch to English'}
            </motion.button>
          </div>
        </div>

        {/* Reset button */}
        <div className="rounded-2xl p-4 bg-red-900/20 border border-red-500/20">
          <p className="text-white/70 text-sm mb-3">
            ⚠️ Reset all progress and stars? This cannot be undone.
          </p>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={handleReset}
            className={`w-full py-3 rounded-2xl font-black text-white transition-colors ${
              confirmReset ? 'bg-red-600' : 'bg-red-500/40 border border-red-500/40'
            }`}
          >
            {confirmReset ? '⚠️ Confirm Reset Everything' : '🗑️ Reset Progress'}
          </motion.button>
          {confirmReset && (
            <button
              onClick={() => setConfirmReset(false)}
              className="w-full mt-2 py-2 text-white/50 text-sm font-semibold"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Version info */}
        <p className="text-white/20 text-center text-xs pb-4">
          Veera's Learning World v2.0 · Built with ❤️ for Veera
        </p>
      </div>
    </div>
  );
}

export default ParentDashboard;
