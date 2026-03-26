import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { speak, isSpeaking } from '../utils/speech.js';

/**
 * SpeakButton — A big tappable button that speaks text aloud.
 * Shows a wave animation while speaking.
 *
 * Props:
 *   text    {string}  - Text to speak
 *   lang    {string}  - Language tag (default 'en-US')
 *   label   {string}  - Button label / emoji (default '🔊')
 *   size    {string}  - 'sm' | 'md' | 'lg'
 *   className {string}
 */
function SpeakButton({ text, lang = 'en-US', label = '🔊', size = 'md', className = '' }) {
  const [speaking, setSpeaking] = useState(false);

  const sizes = {
    sm: 'w-10 h-10 text-xl',
    md: 'w-14 h-14 text-3xl',
    lg: 'w-20 h-20 text-5xl',
  };

  const handleSpeak = () => {
    if (speaking) return;
    setSpeaking(true);
    speak(text, {
      lang,
      rate: 0.8,
      pitch: 1.15,
      onEnd: () => setSpeaking(false),
    });
  };

  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      whileHover={{ scale: 1.08 }}
      onClick={handleSpeak}
      className={`rounded-full bg-white/90 shadow-lg flex items-center justify-center
                  border-4 border-purple-300 cursor-pointer select-none ${sizes[size]} ${className}`}
      title={`Hear: ${text}`}
    >
      <motion.span
        animate={speaking ? { scale: [1, 1.3, 1] } : { scale: 1 }}
        transition={{ repeat: speaking ? Infinity : 0, duration: 0.6 }}
      >
        {speaking ? '🔊' : label}
      </motion.span>
    </motion.button>
  );
}

export default SpeakButton;
