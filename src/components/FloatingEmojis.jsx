import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * FloatingEmojis — Decorative background floating emoji characters.
 * Used on the Welcome page and module pages.
 *
 * Props:
 *   emojis  {string[]}  - Array of emoji characters to float
 *   count   {number}    - How many to show (default 12)
 */
function FloatingEmojis({ emojis = ['⭐', '🌟', '✨', '💫', '🎉'], count = 12 }) {
  const items = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      emoji: emojis[i % emojis.length],
      x: 5 + Math.random() * 90,
      y: 5 + Math.random() * 90,
      size: 1.5 + Math.random() * 2.5,
      duration: 2.5 + Math.random() * 3,
      delay: Math.random() * 2,
    })),
  [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {items.map((item) => (
        <motion.div
          key={item.id}
          className="absolute select-none"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            fontSize: `${item.size}rem`,
            opacity: 0.25,
          }}
          animate={{ y: [0, -25, 0], rotate: [-5, 5, -5] }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {item.emoji}
        </motion.div>
      ))}
    </div>
  );
}

export default FloatingEmojis;
