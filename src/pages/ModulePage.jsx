import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext.jsx';
import { loadModuleData, getModule } from '../data/modules.js';
import { speak, stop } from '../utils/speech.js';
import Header from '../components/Header.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import ShapeDisplay from '../components/ShapeDisplay.jsx';
import MusicToggle from '../components/MusicToggle.jsx';

/**
 * ModulePage — A generic, data-driven learning page.
 * Works for all modules in the CBSE/ICSE Junior KG curriculum.
 *
 * Route: /learn/:moduleId
 */
function ModulePage() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { language, markSeen, markModuleComplete, getModuleProgress } = useApp();

  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [clicked, setClicked] = useState(false);
  const [direction, setDirection] = useState(1); // 1=forward, -1=back
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const moduleInfo = getModule(moduleId);

  // Load module data on mount
  useEffect(() => {
    setLoading(true);
    loadModuleData(moduleId).then((data) => {
      setItems(data);
      setLoading(false);
    });
    return () => stop();
  }, [moduleId]);

  // Auto-speak current item when it changes
  useEffect(() => {
    if (!items.length || loading) return;
    const item = items[currentIndex];
    const delay = setTimeout(() => speakCurrentItem(item), 400);
    markSeen(moduleId, item.id);
    return () => clearTimeout(delay);
  }, [currentIndex, items, loading]);

  const speakCurrentItem = useCallback((item) => {
    if (!item) return;
    if (language === 'mr' && item.marathiWord) {
      const voices = window.speechSynthesis?.getVoices() || [];
      const hasMarathi = voices.some((v) => v.lang.startsWith('mr'));
      speak(item.marathiWord, { lang: hasMarathi ? 'mr-IN' : 'hi-IN', rate: 0.75, pitch: 1.1 });
    } else {
      speak(buildPhrase(item, moduleId), { lang: 'en-US', rate: 0.82, pitch: 1.15 });
    }
  }, [language, moduleId]);

  const handleCardClick = () => {
    if (!items.length) return;
    setClicked(true);
    speakCurrentItem(items[currentIndex]);
    setTimeout(() => setClicked(false), 600);
  };

  const goNext = () => {
    if (currentIndex < items.length - 1) {
      setDirection(1);
      setCurrentIndex((i) => i + 1);
    } else {
      // Module complete
      markModuleComplete(moduleId);
      speak('Wonderful! You finished! You are amazing, Veera!', { rate: 0.85, pitch: 1.3 });
      setTimeout(() => navigate('/learn'), 2500);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((i) => i - 1);
    }
  };

  // ── Exit / Home handler ────────────────────────────────────────────────
  const handleExit = () => {
    stop();
    navigate('/');
  };

  if (!moduleInfo) { navigate('/learn'); return null; }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
           style={{ background: `linear-gradient(135deg, ${moduleInfo?.color || '#a855f7'}, #1a0533)` }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}
                    className="text-6xl">⭐</motion.div>
      </div>
    );
  }

  const item = items[currentIndex];
  const isLast = currentIndex === items.length - 1;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: `linear-gradient(160deg, ${moduleInfo.color}cc 0%, #1a0533 50%, #0f172a 100%)`,
      }}
    >
      {/* Header with back-to-hub button */}
      <Header
        title={language === 'mr' ? moduleInfo.marathiTitle : moduleInfo.title}
        showBack
        backTo="/learn"
      />

      {/* Progress */}
      <ProgressBar current={currentIndex} total={items.length} color={moduleInfo.color} />

      {/* Main card area */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-4 gap-4">

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-full max-w-sm"
          >
            {/* Main interactive card */}
            <motion.div
              onClick={handleCardClick}
              whileTap={{ scale: 0.95 }}
              animate={clicked ? { scale: [1, 1.08, 1], rotate: [0, -3, 3, 0] } : {}}
              transition={{ duration: 0.4 }}
              className="rounded-4xl shadow-2xl p-6 flex flex-col items-center cursor-pointer
                         select-none relative overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(255,255,255,0.2)',
                borderRadius: '2rem',
              }}
            >
              {/* Tap hint */}
              <div className="absolute top-3 right-3 text-white/40 text-xs font-bold">
                Tap to hear! 🔊
              </div>

              {/* Visual element */}
              <ItemVisual item={item} moduleId={moduleId} />

              {/* Item label */}
              <ItemLabel item={item} moduleId={moduleId} language={language} />

              {/* Marathi sub-label */}
              {language === 'mr' && item.marathiWord && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-center"
                >
                  <span className="text-white/90 font-black text-3xl md:text-4xl"
                        style={{ fontFamily: 'Noto Sans Devanagari, Nunito, sans-serif' }}>
                    {item.marathiWord}
                  </span>
                </motion.div>
              )}

              {/* Extra info (sound, example, etc.) */}
              <ExtraInfo item={item} moduleId={moduleId} />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex gap-4 items-center w-full max-w-sm">
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="flex-1 py-4 rounded-3xl font-black text-xl text-white shadow-lg
                       disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.3)' }}
          >
            ⬅️ Prev
          </motion.button>

          {/* Speak button */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={handleCardClick}
            className="w-16 h-16 rounded-full font-black text-3xl shadow-xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.25)', border: '3px solid rgba(255,255,255,0.5)' }}
          >
            🔊
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={goNext}
            className="flex-1 py-4 rounded-3xl font-black text-xl text-white shadow-lg"
            style={{
              background: isLast
                ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                : `linear-gradient(135deg, ${moduleInfo.color}, ${moduleInfo.color}99)`,
              border: '2px solid rgba(255,255,255,0.3)',
            }}
          >
            {isLast ? '🎉 Done!' : 'Next ➡️'}
          </motion.button>
        </div>

        {/* Item counter */}
        <p className="text-white/50 font-bold text-sm">
          {currentIndex + 1} of {items.length}
        </p>

        {/* ── EXIT / HOME BUTTON ──────────────────────────────────────── */}
        {!showExitConfirm ? (
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.04 }}
            onClick={() => setShowExitConfirm(true)}
            className="mt-2 flex items-center gap-2 px-6 py-3 rounded-3xl font-black text-white text-base shadow-lg"
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: '2px solid rgba(255,255,255,0.25)',
            }}
          >
            🏠 <span>Go Home</span>
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-2 mt-2"
          >
            <p className="text-white/80 text-sm font-bold">Leave this module?</p>
            <div className="flex gap-3">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleExit}
                className="px-5 py-2.5 rounded-2xl font-black text-white text-sm shadow-lg"
                style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)' }}
              >
                🏠 Yes, Home!
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowExitConfirm(false)}
                className="px-5 py-2.5 rounded-2xl font-black text-white text-sm shadow-lg"
                style={{ background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.3)' }}
              >
                ✏️ Keep Learning
              </motion.button>
            </div>
          </motion.div>
        )}
      </main>

      <MusicToggle />
    </div>
  );
}

// ─── Slide animation variants ────────────────────────────────────────────────
const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
};

// ─── Visual renderer ─────────────────────────────────────────────────────────
function ItemVisual({ item, moduleId }) {
  if (moduleId === 'shapes') {
    return (
      <div className="mb-4">
        <ShapeDisplay type={item.svgType} color={item.color} size={180} />
      </div>
    );
  }

  if (moduleId === 'colors') {
    return (
      <motion.div
        className="w-40 h-40 rounded-3xl shadow-2xl mb-4 flex items-center justify-center text-6xl"
        style={{ backgroundColor: item.hex, boxShadow: `0 12px 40px ${item.hex}88` }}
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {item.emoji}
      </motion.div>
    );
  }

  if (moduleId === 'numbers') {
    return (
      <div className="flex flex-col items-center mb-4">
        <motion.span
          className="font-black leading-none text-white"
          style={{ fontSize: 'clamp(5rem, 20vw, 9rem)', textShadow: '0 4px 20px rgba(0,0,0,0.4)' }}
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {item.numeral}
        </motion.span>
        <div className="flex flex-wrap justify-center gap-1 mt-2 max-w-[200px]">
          {buildObjectEmojis(item)}
        </div>
      </div>
    );
  }

  if (moduleId === 'alphabets') {
    return (
      <div className="flex items-center gap-4 mb-4">
        <motion.span
          className="font-black text-white leading-none"
          style={{ fontSize: 'clamp(5rem, 18vw, 8rem)', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
          animate={{ scale: [1, 1.05, 1], rotate: [-2, 2, -2] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {item.letter}
        </motion.span>
        <span className="text-7xl md:text-8xl">{item.emoji}</span>
      </div>
    );
  }

  // Default: large emoji (animals, birds, fruits, vegetables, body parts, etc.)
  return (
    <motion.span
      className="text-[8rem] md:text-[10rem] mb-4 block leading-none select-none"
      animate={{ scale: [1, 1.06, 1], rotate: [-3, 3, -3] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      {item.emoji}
    </motion.span>
  );
}

/** Build small repeated emoji objects for numbers 1–10 */
function buildObjectEmojis(item) {
  if (item.id <= 10) {
    return Array.from({ length: item.id }, (_, i) => (
      <span key={i} className="text-2xl">{item.emoji}</span>
    ));
  }
  return <span className="text-white/70 text-lg font-bold">{item.emoji} × {item.numeral}</span>;
}

// ─── Label renderer ──────────────────────────────────────────────────────────
function ItemLabel({ item, moduleId, language }) {
  const getLabel = () => {
    if (moduleId === 'numbers')   return item.word;
    if (moduleId === 'alphabets') return `${item.letter} for ${item.word}`;
    if (moduleId === 'colors')    return item.word;
    if (moduleId === 'shapes')    return item.word;
    if (moduleId === 'days')      return item.word;
    if (moduleId === 'months')    return item.word;
    return item.word;
  };

  return (
    <motion.h2
      key={item.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-white font-black text-center text-shadow leading-tight"
      style={{ fontSize: 'clamp(1.8rem, 6vw, 3rem)' }}
    >
      {getLabel()}
    </motion.h2>
  );
}

// ─── Extra info renderer ─────────────────────────────────────────────────────
function ExtraInfo({ item, moduleId }) {
  const info = (() => {
    if (item.sound)    return `🔊 "${item.sound}"`;
    if (item.activity) return `🎯 ${item.activity}`;
    if (item.note)     return `💡 ${item.note}`;
    if (item.example)  return `💡 ${item.example}`;
    if (moduleId === 'alphabets' && item.phonics) return `📢 "${item.phonics}"`;
    return null;
  })();

  if (!info) return null;

  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="mt-3 text-white/70 text-sm font-bold text-center px-2"
    >
      {info}
    </motion.p>
  );
}

// ─── Phrase builder for TTS ───────────────────────────────────────────────────
function buildPhrase(item, moduleId) {
  switch (moduleId) {
    case 'numbers':    return `This is ${item.word}. ${item.word}!`;
    case 'alphabets':  return `${item.letter} for ${item.word}. ${item.phonics || ''}`;
    case 'animals':    return `This is a ${item.word}. The ${item.word} says, ${item.sound || ''}`;
    case 'birds':      return `This is a ${item.word}. The ${item.word} says, ${item.sound || ''}`;
    case 'colors':     return `This is the color ${item.word}. ${item.word}, ${item.example || ''}`;
    case 'shapes':     return `This is a ${item.word}. A ${item.word} ${item.example || ''}`;
    case 'days':       return `${item.word}! ${item.activity || ''}`;
    case 'months':     return `${item.word}. ${item.note || ''}`;
    case 'fruits':     return `This is a ${item.word}. ${item.example || ''}`;
    case 'vegetables': return `This is a ${item.word}. ${item.example || ''}`;
    case 'bodyparts':  return `This is your ${item.word}. ${item.example || ''}`;
    case 'family':     return `This is ${item.word}. ${item.example || ''}`;
    case 'vehicles':   return `This is a ${item.word}. ${item.example || ''}`;
    case 'clothes':    return `This is a ${item.word}. ${item.example || ''}`;
    case 'food':       return `This is ${item.word}. ${item.example || ''}`;
    case 'weather':    return `This is ${item.word} weather. ${item.example || ''}`;
    case 'community':  return `This is a ${item.word}. ${item.example || ''}`;
    case 'opposites':  return `${item.word}. ${item.example || ''}`;
    default:           return item.word;
  }
}

export default ModulePage;
