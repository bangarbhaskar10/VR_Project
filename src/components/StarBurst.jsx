import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * StarBurst — Full-screen celebration overlay.
 * Shows animated stars + a message when the child answers correctly.
 *
 * Props:
 *   visible  {boolean}  - Whether to show the burst
 *   message  {string}   - Message to display (e.g., "Correct! ⭐")
 *   onDone   {Function} - Called after animation completes
 */
function StarBurst({ visible, message = '⭐ Yay! ⭐', onDone }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (visible) {
      // Generate random star particles
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1 + Math.random() * 2.5,
        delay: Math.random() * 0.4,
        emoji: ['⭐', '🌟', '✨', '💫', '🎉', '🎊'][Math.floor(Math.random() * 6)],
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => {
        onDone?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          {/* Overlay glow */}
          <div className="absolute inset-0 bg-yellow-300/20" />

          {/* Floating particles */}
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ x: `${p.x}vw`, y: '110vh', opacity: 1, scale: 0 }}
              animate={{ y: '-20vh', opacity: 0, scale: p.size }}
              transition={{ duration: 1.5, delay: p.delay, ease: 'easeOut' }}
              className="absolute text-4xl"
              style={{ left: `${p.x}%` }}
            >
              {p.emoji}
            </motion.div>
          ))}

          {/* Central message */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className="relative z-10 bg-white rounded-3xl px-10 py-8 shadow-2xl text-center border-4 border-yellow-400"
          >
            <div className="text-6xl mb-3">🌟</div>
            <div className="text-3xl font-black text-purple-700">{message}</div>
            <div className="text-5xl mt-2">⭐⭐⭐</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default StarBurst;
