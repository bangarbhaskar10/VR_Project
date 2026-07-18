import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext.jsx';
import { speak } from '../utils/speech.js';
import Header from '../components/Header.jsx';
import MusicToggle from '../components/MusicToggle.jsx';
import FloatingEmojis from '../components/FloatingEmojis.jsx';

const GAMES = [
  {
    id: 'memory',
    title: 'Memory Game',
    marathiTitle: 'स्मृती खेळ',
    emoji: '🃏',
    color: '#8B5CF6',
    description: 'Flip cards & find pairs!',
    path: '/games/memory',
  },
  {
    id: 'listen',
    title: 'Listening Game',
    marathiTitle: 'ऐकण्याचा खेळ',
    emoji: '👂',
    color: '#F59E0B',
    description: 'Listen & pick the right one!',
    path: '/games/listen',
  },
  {
    id: 'count',
    title: 'Counting Game',
    marathiTitle: 'मोजण्याचा खेळ',
    emoji: '🔢',
    color: '#10B981',
    description: 'Count and find the number!',
    path: '/games/count',
  },
  {
    id: 'trace',
    title: 'Trace & Draw',
    marathiTitle: 'काढण्याचा खेळ',
    emoji: '✏️',
    color: '#EC4899',
    description: 'Trace numbers & letters!',
    path: '/games/trace',
  },
];

const cardVariants = {
  hidden: { opacity: 0, scale: 0.7, y: 30 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } },
};

function GamesHub() {
  const navigate = useNavigate();
  const { language } = useApp();

  return (
    <div className="min-h-screen flex flex-col"
         style={{ background: 'linear-gradient(135deg, #1a0533 0%, #2d1b69 40%, #1e3a5f 100%)' }}>
      <FloatingEmojis emojis={['🎮', '🃏', '⭐', '🎯', '✨', '🏆']} count={10} />

      <Header
        title={language === 'mr' ? '🎮 खेळूया!' : '🎮 Fun Games!'}
        showBack
        backTo="/"
      />

      <main className="flex-1 px-4 py-6 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-white/80 font-bold text-lg mb-6"
        >
          {language === 'mr' ? 'कोणता खेळ खेळायचा?' : 'Which game do you want to play?'}
        </motion.h2>

        <motion.div
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 gap-5 max-w-md mx-auto"
        >
          {GAMES.map((game) => (
            <motion.button
              key={game.id}
              variants={cardVariants}
              whileTap={{ scale: 0.92 }}
              whileHover={{ y: -6, scale: 1.03 }}
              onClick={() => {
                speak(
                  language === 'mr'
                    ? `${game.marathiTitle} खेळूया!`
                    : `Let's play ${game.title}!`,
                  { rate: 0.85 }
                );
                setTimeout(() => navigate(game.path), 300);
              }}
              className="module-card relative overflow-hidden text-white py-8"
              style={{
                background: `linear-gradient(135deg, ${game.color}dd, ${game.color}99)`,
                boxShadow: `0 8px 24px ${game.color}44`,
              }}
            >
              <motion.span
                className="text-5xl mb-3 block"
                animate={{ rotate: [-2, 2, -2] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                {game.emoji}
              </motion.span>
              <span className="font-black text-base leading-tight block">
                {language === 'mr' ? game.marathiTitle : game.title}
              </span>
              <span className="text-white/70 text-xs mt-1 block">
                {game.description}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Quick nav to learn and test */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex gap-3 justify-center"
        >
          <button
            onClick={() => navigate('/learn')}
            className="btn-toddler text-white border-purple-700 text-sm"
            style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}
          >
            📚 Learn
          </button>
          <button
            onClick={() => navigate('/test')}
            className="btn-toddler text-white border-pink-700 text-sm"
            style={{ background: 'linear-gradient(135deg, #ec4899, #a855f7)' }}
          >
            🧠 Quiz
          </button>
        </motion.div>
      </main>

      <MusicToggle />
    </div>
  );
}

export default GamesHub;
