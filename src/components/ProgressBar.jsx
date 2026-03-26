import React from 'react';
import { motion } from 'framer-motion';

/**
 * ProgressBar — Shows current index within a module.
 *
 * Props:
 *   current  {number}  - Current index (0-based)
 *   total    {number}  - Total items
 *   color    {string}  - Tailwind color class or hex
 */
function ProgressBar({ current, total, color = '#A855F7' }) {
  const pct = total > 0 ? ((current + 1) / total) * 100 : 0;

  return (
    <div className="w-full px-4 py-2">
      {/* Dots for small sets, bar for larger */}
      {total <= 12 ? (
        <div className="flex justify-center gap-1.5 flex-wrap">
          {Array.from({ length: total }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: i === current ? 1.4 : 1,
                backgroundColor: i <= current ? color : 'rgba(255,255,255,0.3)',
              }}
              transition={{ type: 'spring', stiffness: 400 }}
              className="w-3 h-3 rounded-full border-2 border-white/40"
              style={{ backgroundColor: i <= current ? color : 'rgba(255,255,255,0.3)' }}
            />
          ))}
        </div>
      ) : (
        <div className="relative w-full h-4 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          />
          <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-white drop-shadow">
            {current + 1} / {total}
          </span>
        </div>
      )}
    </div>
  );
}

export default ProgressBar;
