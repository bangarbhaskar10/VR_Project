import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext.jsx';
import { WORKSHEET_LEVELS } from '../data/worksheets.js';
import { speak } from '../utils/speech.js';
import Header from '../components/Header.jsx';
import MusicToggle from '../components/MusicToggle.jsx';
import FloatingEmojis from '../components/FloatingEmojis.jsx';

const BG = 'linear-gradient(135deg, #1a0533 0%, #0c2340 50%, #0f2027 100%)';

const cardVariants = {
  hidden: { opacity: 0, scale: 0.7, y: 30 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } },
};

function WorksheetHub() {
  const navigate = useNavigate();
  const { language } = useApp();

  // step: 'level' | 'subject' | 'sheet'
  const [step, setStep] = useState('level');
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const handleLevelClick = (level) => {
    speak(
      language === 'mr'
        ? `${level.marathiLabel} वर्कशीट!`
        : `${level.label} worksheets! Let's practise!`,
      { rate: 0.85 }
    );
    setSelectedLevel(level);
    setStep('subject');
  };

  const handleSubjectClick = (subject) => {
    speak(
      language === 'mr'
        ? `${subject.marathiLabel} वर्कशीट शिकूया!`
        : `${subject.label} worksheets! Great choice!`,
      { rate: 0.85 }
    );
    setSelectedSubject(subject);
    setStep('sheet');
  };

  const handleSheetClick = (sheet) => {
    speak(`Let's start ${sheet.title}!`, { rate: 0.85 });
    setTimeout(() => navigate(`/worksheets/${sheet.id}`), 300);
  };

  const handleBack = () => {
    if (step === 'sheet') {
      setStep('subject');
      setSelectedSubject(null);
    } else if (step === 'subject') {
      setStep('level');
      setSelectedLevel(null);
    } else {
      navigate('/');
    }
  };

  const title =
    step === 'level'
      ? (language === 'mr' ? '📋 वर्कशीट' : '📋 Worksheets')
      : step === 'subject'
      ? `${selectedLevel.emoji} ${language === 'mr' ? selectedLevel.marathiLabel : selectedLevel.label}`
      : `${selectedSubject.emoji} ${language === 'mr' ? selectedSubject.marathiLabel : selectedSubject.label}`;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: BG }}>
      <FloatingEmojis emojis={['📝', '✏️', '📚', '🌟', '⭐', '🎉', '🔢', '📖']} count={10} />

      <Header title={title} showBack onBack={handleBack} />

      <main className="flex-1 px-4 py-6 relative z-10">
        <AnimatePresence mode="wait">

          {/* ── LEVEL SELECTION ── */}
          {step === 'level' && (
            <motion.div
              key="level"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
            >
              <p className="text-center text-white/80 font-bold text-lg mb-6">
                {language === 'mr' ? 'कोणती कक्षा निवडायची आहे?' : 'Choose your class level'}
              </p>
              <div className="flex flex-col gap-5 max-w-md mx-auto">
                {WORKSHEET_LEVELS.map((level, i) => (
                  <motion.button
                    key={level.id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="show"
                    transition={{ delay: i * 0.12 }}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    onClick={() => handleLevelClick(level)}
                    className="relative overflow-hidden rounded-3xl p-6 text-white text-left shadow-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${level.color}dd, ${level.color}88)`,
                      boxShadow: `0 10px 30px ${level.color}44`,
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-6xl">{level.emoji}</span>
                      <div>
                        <p className="font-black text-2xl">
                          {language === 'mr' ? level.marathiLabel : level.label}
                        </p>
                        <p className="text-white/70 font-semibold text-sm mt-0.5">{level.ageRange}</p>
                        <p className="text-white/60 text-xs mt-1">
                          {level.subjects.length} subjects •{' '}
                          {level.subjects.reduce((a, s) => a + s.sheets.length, 0)} worksheets
                        </p>
                      </div>
                    </div>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 text-3xl">›</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── SUBJECT SELECTION ── */}
          {step === 'subject' && selectedLevel && (
            <motion.div
              key="subject"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
            >
              <p className="text-center text-white/80 font-bold text-lg mb-6">
                {language === 'mr' ? 'कोणता विषय निवडायचा आहे?' : 'Choose a subject'}
              </p>
              <div className="grid grid-cols-2 gap-5 max-w-sm mx-auto">
                {selectedLevel.subjects.map((subject, i) => (
                  <motion.button
                    key={subject.id}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.12, type: 'spring', stiffness: 250 }}
                    whileTap={{ scale: 0.93 }}
                    whileHover={{ y: -5, scale: 1.03 }}
                    onClick={() => handleSubjectClick(subject)}
                    className="rounded-3xl p-6 text-white flex flex-col items-center gap-2 shadow-xl"
                    style={{
                      background: `linear-gradient(135deg, ${subject.color}dd, ${subject.color}88)`,
                      boxShadow: `0 8px 24px ${subject.color}44`,
                    }}
                  >
                    <span className="text-5xl">{subject.emoji}</span>
                    <span className="font-black text-lg">
                      {language === 'mr' ? subject.marathiLabel : subject.label}
                    </span>
                    <span className="text-white/60 text-xs">{subject.sheets.length} worksheets</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── SHEET SELECTION ── */}
          {step === 'sheet' && selectedSubject && (
            <motion.div
              key="sheet"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
            >
              <p className="text-center text-white/80 font-bold text-lg mb-6">
                {language === 'mr' ? 'कोणती वर्कशीट करायची आहे?' : 'Pick a worksheet'}
              </p>
              <div className="flex flex-col gap-4 max-w-md mx-auto">
                {selectedSubject.sheets.map((sheet, i) => (
                  <motion.button
                    key={sheet.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ y: -3, scale: 1.01 }}
                    onClick={() => handleSheetClick(sheet)}
                    className="relative overflow-hidden rounded-3xl p-5 text-white text-left shadow-xl"
                    style={{
                      background: `linear-gradient(135deg, ${sheet.color}cc, ${sheet.color}77)`,
                      boxShadow: `0 6px 20px ${sheet.color}44`,
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{sheet.emoji}</span>
                      <div>
                        <p className="font-black text-lg">{sheet.title}</p>
                        <p className="text-white/70 text-sm mt-0.5">
                          {sheet.questions.length} questions
                        </p>
                      </div>
                    </div>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-4xl">›</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      <MusicToggle />
    </div>
  );
}

export default WorksheetHub;
