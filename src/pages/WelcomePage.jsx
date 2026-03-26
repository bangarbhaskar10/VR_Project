import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { speakWelcome, initVoices } from '../utils/speech.js';
import { useApp } from '../context/AppContext.jsx';
import FloatingEmojis from '../components/FloatingEmojis.jsx';
import MusicToggle from '../components/MusicToggle.jsx';

// Decorative background characters for the welcome screen
const BG_EMOJIS = ['🌟', '⭐', '🎈', '🦋', '🌈', '🌸', '🎉', '✨', '💫', '🎀', '🎵', '🌺'];

// Fun characters that bob around the screen
const CHARACTERS = [
  { emoji: '🦄', x: 8,  y: 20,  delay: 0 },
  { emoji: '🐬', x: 85, y: 18,  delay: 0.4 },
  { emoji: '🐻', x: 5,  y: 70,  delay: 0.8 },
  { emoji: '🦁', x: 88, y: 68,  delay: 0.2 },
  { emoji: '🐸', x: 45, y: 88,  delay: 0.6 },
  { emoji: '🦊', x: 20, y: 45,  delay: 1.0 },
  { emoji: '🐨', x: 75, y: 45,  delay: 0.3 },
];

function WelcomePage() {
  const navigate = useNavigate();
  const { totalStars, streak, language } = useApp();
  const [voicesReady, setVoicesReady] = useState(false);
  const [greeted, setGreeted] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [photoError, setPhotoError] = useState(false);

  // Initialise TTS voices and play welcome greeting
  useEffect(() => {
    initVoices().then(() => setVoicesReady(true));
    const t = setTimeout(() => setShowButtons(true), 800);
    return () => clearTimeout(t);
  }, []);

  // Auto-greet once voices are ready
  useEffect(() => {
    if (voicesReady && !greeted) {
      const t = setTimeout(() => {
        speakWelcome();
        setGreeted(true);
      }, 600);
      return () => clearTimeout(t);
    }
  }, [voicesReady, greeted]);

  const handleGreetAgain = useCallback(() => speakWelcome(), []);

  return (
    <div
      className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #1a0533 0%, #2d1b69 30%, #1e3a5f 60%, #0f2027 100%)' }}
    >
      {/* Animated star field background */}
      <FloatingEmojis emojis={BG_EMOJIS} count={18} />

      {/* Decorative gradient rings */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-[600px] h-[600px] rounded-full border-2 border-purple-500/10 animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-[450px] h-[450px] rounded-full border border-pink-500/15 animate-pulse-slow"
             style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-[300px] h-[300px] rounded-full border border-blue-400/20 animate-pulse-slow"
             style={{ animationDelay: '2s' }} />
      </div>

      {/* Floating animated characters */}
      {CHARACTERS.map((c) => (
        <motion.div
          key={c.emoji}
          className="absolute text-5xl md:text-6xl select-none pointer-events-none"
          style={{ left: `${c.x}%`, top: `${c.y}%` }}
          animate={{ y: [0, -20, 0], rotate: [-5, 5, -5] }}
          transition={{ duration: 3 + c.delay, delay: c.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          {c.emoji}
        </motion.div>
      ))}

      {/* MAIN CONTENT */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center max-w-2xl w-full">

        {/* Streak badge */}
        {streak.count > 1 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-4 flex items-center gap-2 bg-orange-400/90 text-white rounded-full px-5 py-2 shadow-lg font-bold text-sm"
          >
            🔥 {streak.count} Day Streak!
          </motion.div>
        )}

        {/* ── Veera's Photo ──────────────────────────────────── */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.05 }}
          className="mb-3 relative"
        >
          {/* Glowing ring behind photo */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'linear-gradient(135deg, #ff6b9d, #fbbf24, #a855f7)',
              filter: 'blur(10px)',
              opacity: 0.7,
              transform: 'scale(1.12)',
            }}
          />
          {/* Spinning rainbow border */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'conic-gradient(#ff6b9d, #fbbf24, #a855f7, #22d3ee, #ff6b9d)',
              padding: '3px',
              borderRadius: '9999px',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />
          {/* Photo or fallback emoji */}
          {!photoError ? (
            <motion.img
              src="/veera.jpg"
              alt="Veera"
              onError={() => setPhotoError(true)}
              className="relative w-28 h-28 md:w-36 md:h-36 rounded-full object-cover shadow-2xl"
              style={{
                border: '4px solid rgba(255,255,255,0.9)',
                position: 'relative',
                zIndex: 1,
              }}
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          ) : (
            <div
              className="relative w-28 h-28 md:w-36 md:h-36 rounded-full flex items-center justify-center shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #ff6b9d, #a855f7)',
                border: '4px solid rgba(255,255,255,0.9)',
                zIndex: 1,
                fontSize: '4rem',
              }}
            >
              👧
            </div>
          )}
          {/* Star badge on photo */}
          <motion.div
            className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full w-8 h-8 flex items-center justify-center text-base shadow-lg"
            style={{ zIndex: 2 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ⭐
          </motion.div>
        </motion.div>

        {/* Welcome title */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.15 }}
          className="mb-2"
        >
          <h1 className="text-4xl md:text-6xl font-black text-white text-shadow-lg leading-tight">
            Welcome
          </h1>
          <motion.h1
            className="text-5xl md:text-7xl font-black leading-tight"
            style={{
              background: 'linear-gradient(135deg, #ff6b9d, #fbbf24, #a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            Veera! 🎉
          </motion.h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-white/80 text-lg md:text-xl font-bold mb-2"
        >
          Let's learn and have fun today! ✨
        </motion.p>

        {/* Stars display */}
        {totalStars > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mb-3 flex items-center gap-2 bg-yellow-500/20 border border-yellow-400/40
                       rounded-full px-4 py-2 text-yellow-300 font-bold"
          >
            ⭐ You have {totalStars} stars!
          </motion.div>
        )}

        {/* Speak greeting button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleGreetAgain}
          className="mb-6 text-4xl bg-white/10 hover:bg-white/20 rounded-full w-14 h-14
                     flex items-center justify-center border-2 border-white/30
                     transition-colors cursor-pointer shadow-lg"
          title="Hear greeting again"
        >
          🔊
        </motion.button>

        {/* Big action buttons */}
        <AnimatePresence>
          {showButtons && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="flex flex-col sm:flex-row gap-4 w-full max-w-md"
            >
              {/* Start Learning */}
              <motion.button
                whileTap={{ scale: 0.92 }}
                whileHover={{ scale: 1.04, y: -3 }}
                onClick={() => navigate('/learn')}
                className="flex-1 btn-toddler text-white shadow-2xl border-b-4 border-purple-700"
                style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}
              >
                <span className="block text-4xl mb-1">📚</span>
                <span>Start Learning</span>
              </motion.button>

              {/* Take a Test */}
              <motion.button
                whileTap={{ scale: 0.92 }}
                whileHover={{ scale: 1.04, y: -3 }}
                onClick={() => navigate('/test')}
                className="flex-1 btn-toddler text-white shadow-2xl border-b-4 border-pink-700"
                style={{ background: 'linear-gradient(135deg, #f472b6, #ec4899)' }}
              >
                <span className="block text-4xl mb-1">🧠</span>
                <span>Take a Test</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Parent dashboard link — small & subtle */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          onClick={() => navigate('/parent')}
          className="mt-6 text-white/40 text-sm font-semibold hover:text-white/70 transition-colors"
        >
          👨‍👩‍👧 Parent Dashboard
        </motion.button>
      </div>

      {/* Music toggle */}
      <MusicToggle />
    </div>
  );
}

export default WelcomePage;
