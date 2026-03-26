import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext.jsx';
import { stop } from '../utils/speech.js';

/**
 * App header — shown on module and hub pages.
 * Shows: back button, title, stars count, language toggle.
 */
function Header({ title, showBack = true, backTo = '/learn' }) {
  const navigate = useNavigate();
  const { totalStars, language, toggleLanguage } = useApp();

  const handleBack = () => {
    stop();
    navigate(backTo);
  };

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="flex items-center justify-between px-4 py-3 bg-white/20 backdrop-blur-sm sticky top-0 z-50 shadow-lg"
    >
      {/* Back Button */}
      {showBack ? (
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={handleBack}
          className="w-12 h-12 rounded-2xl bg-white/30 flex items-center justify-center text-2xl shadow-md border-2 border-white/40"
          aria-label="Go back"
        >
          ⬅️
        </motion.button>
      ) : (
        <div className="w-12" />
      )}

      {/* Title */}
      <h1 className="text-white font-black text-xl md:text-2xl text-shadow drop-shadow-lg text-center flex-1 mx-2">
        {title}
      </h1>

      {/* Right side: Stars + Language */}
      <div className="flex items-center gap-2">
        {/* Stars counter */}
        <motion.div
          whileTap={{ scale: 0.9 }}
          className="flex items-center gap-1 bg-yellow-400 rounded-2xl px-3 py-1.5 shadow-md"
        >
          <span className="text-xl">⭐</span>
          <span className="font-black text-yellow-900 text-sm">{totalStars}</span>
        </motion.div>

        {/* Language toggle */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={toggleLanguage}
          className="w-12 h-12 rounded-2xl bg-white/30 flex items-center justify-center text-lg font-black text-white shadow-md border-2 border-white/40"
          title={`Switch to ${language === 'en' ? 'Marathi' : 'English'}`}
        >
          {language === 'en' ? 'मर' : 'EN'}
        </motion.button>
      </div>
    </motion.header>
  );
}

export default Header;
