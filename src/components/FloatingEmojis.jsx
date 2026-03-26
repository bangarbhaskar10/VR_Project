import React, { useMemo } from 'react';

/**
 * FloatingEmojis — Decorative background floating emoji characters.
 *
 * Uses pure CSS @keyframes animations (no Framer Motion) so all animation
 * runs on the GPU compositor thread — smooth even on low-end devices.
 *
 * Props:
 *   emojis  {string[]}  - Array of emoji characters to float
 *   count   {number}    - How many to show (default 12)
 */

// Four CSS animation names to spread variety
const FLOAT_ANIMS = ['float', 'floatReverse', 'floatWide', 'floatSway'];

function FloatingEmojis({ emojis = ['⭐', '🌟', '✨', '💫', '🎉'], count = 12 }) {
  const items = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      emoji: emojis[i % emojis.length],
      x: 3 + Math.random() * 91,
      y: 3 + Math.random() * 91,
      size: 1.4 + Math.random() * 2,
      // Duration 2.8–5.5 s, staggered negative delay so they're already mid-animation on load
      duration: (2.8 + Math.random() * 2.7).toFixed(2),
      delay: -(Math.random() * 4).toFixed(2),
      anim: FLOAT_ANIMS[i % FLOAT_ANIMS.length],
    })),
  [count]);   // stable — only regenerates if count changes

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {items.map((item) => (
        <div
          key={item.id}
          style={{
            position: 'absolute',
            left: `${item.x}%`,
            top: `${item.y}%`,
            fontSize: `${item.size}rem`,
            opacity: 0.28,
            // Promote each element to its own GPU layer for zero-jank animation
            willChange: 'transform',
            animation: `${item.anim} ${item.duration}s ease-in-out ${item.delay}s infinite`,
          }}
        >
          {item.emoji}
        </div>
      ))}
    </div>
  );
}

export default FloatingEmojis;
