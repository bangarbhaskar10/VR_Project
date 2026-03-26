import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext.jsx';
import { ALL_MODULES } from '../data/modules.js';
import { speak } from '../utils/speech.js';
import Header from '../components/Header.jsx';
import MusicToggle from '../components/MusicToggle.jsx';
import FloatingEmojis from '../components/FloatingEmojis.jsx';

// Background gradient for the hub page
const HUB_BG = 'linear-gradient(135deg, #1a0533 0%, #2d1b69 40%, #1e3a5f 100%)';

// Stagger animation for module cards
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.7, y: 30 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } },
};

function LearningHub() {
  const navigate = useNavigate();
  const { language, getModuleProgress } = useApp();

  const handleModuleClick = (mod) => {
    speak(
      language === 'mr' ? `${mod.marathiTitle} शिकूया!` : `Let's learn ${mod.title}!`,
      { lang: language === 'mr' ? 'hi-IN' : 'en-IN', rate: 0.85 }
    );
    setTimeout(() => navigate(`/learn/${mod.id}`), 300);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: HUB_BG }}>
      <FloatingEmojis
        emojis={['📚', '🌟', '⭐', '🎈', '✨', '🎉']}
        count={10}
      />

      <Header
        title={language === 'mr' ? '📚 शिकूया!' : '📚 Choose to Learn!'}
        showBack
        backTo="/"
      />

      <main className="flex-1 px-4 py-6 relative z-10">
        {/* Section heading */}
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-white/80 font-bold text-lg mb-6"
        >
          {language === 'mr'
            ? 'कोणता विषय शिकायचा आहे?'
            : 'What would you like to learn today?'}
        </motion.h2>

        {/* Module grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          {ALL_MODULES.map((mod) => {
            const pct = getModuleProgress(mod.id, mod.totalItems);

            return (
              <motion.button
                key={mod.id}
                variants={cardVariants}
                whileTap={{ scale: 0.93 }}
                whileHover={{ y: -6, scale: 1.03 }}
                onClick={() => handleModuleClick(mod)}
                className="module-card relative overflow-hidden text-white"
                style={{
                  background: `linear-gradient(135deg, ${mod.color}dd, ${mod.color}99)`,
                  boxShadow: `0 8px 24px ${mod.color}44`,
                }}
              >
                {/* Progress bar at top */}
                {pct > 0 && (
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/20 rounded-t-3xl overflow-hidden">
                    <motion.div
                      className="h-full bg-white/70 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                )}

                {/* Completed badge */}
                {pct === 100 && (
                  <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900
                                  text-xs font-black rounded-full w-6 h-6 flex items-center justify-center">
                    ✓
                  </div>
                )}

                {/* Module emoji */}
                <motion.span
                  className="text-5xl md:text-6xl mb-3 block"
                  animate={{ rotate: [-2, 2, -2] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {mod.emoji}
                </motion.span>

                {/* Module title */}
                <span className="font-black text-base md:text-lg leading-tight block">
                  {language === 'mr' ? mod.marathiTitle : mod.title}
                </span>

                {/* Item count */}
                <span className="text-white/70 text-xs mt-1 font-semibold">
                  {mod.totalItems} {language === 'mr' ? 'आयटम' : 'items'}
                </span>

                {/* Progress label */}
                {pct > 0 && pct < 100 && (
                  <span className="text-white/80 text-xs mt-1 font-bold">
                    {pct}% done ✨
                  </span>
                )}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Test prompt */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <button
            onClick={() => navigate('/test')}
            className="btn-toddler text-white border-pink-700"
            style={{ background: 'linear-gradient(135deg, #ec4899, #a855f7)' }}
          >
            🧠 Take a Fun Test!
          </button>
        </motion.div>
      </main>

      <MusicToggle />
    </div>
  );
}

export default LearningHub;
