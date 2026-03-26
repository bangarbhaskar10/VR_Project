import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext.jsx';

/**
 * MusicToggle — Floating button to toggle background music.
 * Uses the Web Audio API to generate pleasant background tones
 * (no external audio files needed).
 */
function MusicToggle() {
  const { musicOn, toggleMusic } = useApp();
  const audioCtxRef = useRef(null);
  const nodesRef = useRef([]);
  const intervalRef = useRef(null);

  // Musical notes in Hz (C major pentatonic — pleasant and simple)
  const notes = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25];
  let noteIdx = 0;

  const startMusic = () => {
    if (!window.AudioContext && !window.webkitAudioContext) return;

    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    audioCtxRef.current = ctx;

    const playNote = () => {
      if (!audioCtxRef.current) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.frequency.value = notes[noteIdx % notes.length];
      noteIdx++;
      osc.type = 'sine';

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.1);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.9);
      nodesRef.current.push(osc);
    };

    playNote();
    intervalRef.current = setInterval(playNote, 900);
  };

  const stopMusic = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    nodesRef.current = [];
  };

  useEffect(() => {
    if (musicOn) {
      startMusic();
    } else {
      stopMusic();
    }
    return stopMusic;
  }, [musicOn]);

  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      whileHover={{ scale: 1.1 }}
      onClick={toggleMusic}
      className={`fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-2xl border-4 border-white/50 ${
        musicOn ? 'bg-green-500' : 'bg-gray-500/70'
      }`}
      title={musicOn ? 'Turn off music' : 'Turn on music'}
    >
      <motion.span
        animate={musicOn ? { rotate: [0, 10, -10, 0] } : { rotate: 0 }}
        transition={{ repeat: musicOn ? Infinity : 0, duration: 1 }}
      >
        {musicOn ? '🎵' : '🔇'}
      </motion.span>
    </motion.button>
  );
}

export default MusicToggle;
