import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext.jsx';
import { ALL_MODULES, loadModuleData } from '../data/modules.js';
import { speak, stop } from '../utils/speech.js';
import { shuffle, pickRandom } from '../utils/helpers.js';
import Header from '../components/Header.jsx';
import StarBurst from '../components/StarBurst.jsx';
import ShapeDisplay from '../components/ShapeDisplay.jsx';
import MusicToggle from '../components/MusicToggle.jsx';

/**
 * TestPage — Interactive quiz/game for Veera.
 * Presents 4 choices; child taps the correct answer.
 * Only positive feedback — no failure messages.
 *
 * Route: /test  or  /test/:moduleId
 */
function TestPage() {
  const navigate = useNavigate();
  const { moduleId: paramModuleId } = useParams();
  const { language, awardStars } = useApp();

  const [selectedModuleId, setSelectedModuleId] = useState(paramModuleId || null);
  const [moduleItems, setModuleItems] = useState([]);

  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [answered, setAnswered] = useState(null); // 'correct' | 'retry'
  const [showBurst, setShowBurst] = useState(false);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const questionRef = useRef(null);

  // Load module data when selection changes
  useEffect(() => {
    if (!selectedModuleId) return;
    setLoading(true);
    stop();
    loadModuleData(selectedModuleId).then((data) => {
      setModuleItems(data);
      setLoading(false);
    });
  }, [selectedModuleId]);

  useEffect(() => {
    if (moduleItems.length >= 4) nextQuestion(moduleItems);
  }, [moduleItems]);

  const nextQuestion = useCallback((items) => {
    const pool = items || moduleItems;
    if (pool.length < 2) return;

    const correct = pool[Math.floor(Math.random() * pool.length)];
    const wrongs = pickRandom(
      pool.filter((i) => i.id !== correct.id),
      Math.min(3, pool.length - 1)
    );
    const allOptions = shuffle([correct, ...wrongs]);

    setQuestion(correct);
    setOptions(allOptions);
    setAnswered(null);
    setQuestionCount((c) => c + 1);

    setTimeout(() => askQuestion(correct), 400);
  }, [moduleItems, language]);

  const askQuestion = (correct) => {
    if (!correct) return;
    const phrase = buildQuestion(correct, selectedModuleId, language);
    speak(phrase, { lang: language === 'mr' ? 'hi-IN' : 'en-IN', rate: 0.82, pitch: 1.1 });
  };

  const handleAnswer = (option) => {
    if (answered) return;

    if (option.id === question.id) {
      stop();
      setAnswered('correct');
      setScore((s) => s + 1);
      awardStars(1);
      setShowBurst(true);

      const cheers = [
        'Yay! That is correct! You are so smart, Veera!',
        'Wonderful! Great job!',
        'Superstar! That is right!',
        'Amazing! You did it!',
        'Hooray! Correct answer!',
      ];
      speak(cheers[Math.floor(Math.random() * cheers.length)], { rate: 0.88, pitch: 1.3 });
    } else {
      setAnswered('retry');
      const encouragements = [
        'Try again! You can do it!',
        'Almost! Try once more!',
        'Keep trying! You are great!',
      ];
      speak(encouragements[Math.floor(Math.random() * encouragements.length)], {
        rate: 0.85, pitch: 1.2
      });
      setTimeout(() => {
        setAnswered(null);
        askQuestion(question);
      }, 2000);
    }
  };

  const handleBurstDone = () => {
    setShowBurst(false);
    setTimeout(() => nextQuestion(), 400);
  };

  // ── Go home handler ────────────────────────────────────────────────────
  const handleGoHome = () => {
    stop();
    navigate('/');
  };

  // ── Module selector screen ──────────────────────────────────────────────
  if (!selectedModuleId) {
    return (
      <div className="min-h-screen flex flex-col"
           style={{ background: 'linear-gradient(135deg, #1a0533, #2d1b69, #1e3a5f)' }}>
        <Header title="🧠 Choose a Quiz!" showBack backTo="/" />

        <main className="flex-1 flex flex-col items-center justify-center px-4 py-6">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white font-black text-2xl text-center mb-6"
          >
            Which topic do you want to test?
          </motion.h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-2xl">
            {ALL_MODULES.map((mod, i) => (
              <motion.button
                key={mod.id}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04, type: 'spring', stiffness: 250 }}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05, y: -4 }}
                onClick={() => {
                  speak(`Let's test ${mod.title}!`, { rate: 0.85 });
                  setSelectedModuleId(mod.id);
                }}
                className="module-card text-white py-5"
                style={{
                  background: `linear-gradient(135deg, ${mod.color}ee, ${mod.color}99)`,
                  boxShadow: `0 6px 20px ${mod.color}44`,
                }}
              >
                <span className="text-4xl mb-2 block">{mod.emoji}</span>
                <span className="font-black text-sm md:text-base">{mod.title}</span>
              </motion.button>
            ))}
          </div>
        </main>
        <MusicToggle />
      </div>
    );
  }

  // ── Loading screen ──────────────────────────────────────────────────────
  if (loading || !question) {
    const mod = ALL_MODULES.find((m) => m.id === selectedModuleId);
    return (
      <div className="min-h-screen flex items-center justify-center"
           style={{ background: `linear-gradient(135deg, ${mod?.color || '#a855f7'}, #1a0533)` }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8 }}
                    className="text-7xl">⭐</motion.div>
      </div>
    );
  }

  const mod = ALL_MODULES.find((m) => m.id === selectedModuleId);

  // ── Quiz screen ─────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: `linear-gradient(160deg, ${mod?.color}cc 0%, #1a0533 55%, #0f172a 100%)` }}
    >
      <Header title={`${mod?.emoji} ${language === 'mr' ? mod?.marathiTitle : mod?.title} Quiz`}
              showBack backTo="/test" />

      {/* Score bar */}
      <div className="flex items-center justify-between px-6 py-2">
        <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5">
          <span className="text-lg">✅</span>
          <span className="text-white font-black">{score} correct</span>
        </div>
        <div className="flex items-center gap-2 bg-yellow-500/30 rounded-full px-4 py-1.5">
          <span className="text-lg">⭐</span>
          <span className="text-yellow-300 font-black">{score} stars</span>
        </div>
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => askQuestion(question)}
          className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center text-xl"
        >
          🔊
        </motion.button>
      </div>

      {/* Question */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-2 gap-5">

        {/* Question prompt */}
        <motion.div
          key={questionCount}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <p className="text-white/70 font-bold text-base mb-1">
            {language === 'mr' ? 'कोणते आहे?' : 'Which one is...'}
          </p>
          <h2 className="text-white font-black text-3xl md:text-4xl text-shadow">
            {buildQuestionLabel(question, selectedModuleId, language)}
          </h2>
        </motion.div>

        {/* Options grid */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
          <AnimatePresence>
            {options.map((option, i) => {
              const isCorrect = option.id === question.id;
              const isSelected = answered && isCorrect;

              return (
                <motion.button
                  key={`${questionCount}-${option.id}`}
                  initial={{ opacity: 0, scale: 0.5, y: 40 }}
                  animate={{
                    opacity: 1,
                    scale: isSelected ? 1.06 : 1,
                    y: 0,
                  }}
                  transition={{ delay: i * 0.1, type: 'spring', stiffness: 280 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleAnswer(option)}
                  disabled={!!answered}
                  className="rounded-3xl p-4 flex flex-col items-center justify-center gap-2
                             border-2 text-white cursor-pointer select-none shadow-lg min-h-[120px]
                             disabled:cursor-not-allowed"
                  style={{
                    borderColor: isSelected ? 'rgba(134,239,172,0.8)' : 'rgba(255,255,255,0.2)',
                    background: isSelected ? 'rgba(34,197,94,0.85)' : 'rgba(255,255,255,0.12)',
                  }}
                >
                  <OptionVisual item={option} moduleId={selectedModuleId} />
                  <span className="font-black text-sm text-center leading-tight">
                    {getOptionLabel(option, selectedModuleId)}
                  </span>
                  {isSelected && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-2xl">
                      ✅
                    </motion.span>
                  )}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        {/* ── Action buttons: Skip | New Topic | 🏠 Home ──────────────── */}
        <div className="flex flex-wrap gap-3 justify-center">
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => nextQuestion()}
            className="btn-toddler text-white text-base px-6 py-3 border-purple-700"
            style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}
          >
            ⏭️ Skip
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => {
              stop();
              setSelectedModuleId(null);
              setScore(0);
              setQuestion(null);
              setQuestionCount(0);
            }}
            className="btn-toddler text-white text-base px-6 py-3 border-pink-700"
            style={{ background: 'linear-gradient(135deg, #ec4899, #f43f5e)' }}
          >
            🔄 New Topic
          </motion.button>

          {/* 🏠 Go Home — always visible during quiz */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={handleGoHome}
            className="btn-toddler text-white text-base px-6 py-3 border-orange-700"
            style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
          >
            🏠 Home
          </motion.button>
        </div>
      </main>

      {/* Star burst celebration overlay */}
      <StarBurst
        visible={showBurst}
        message="Correct! ⭐ Superstar!"
        onDone={handleBurstDone}
      />

      <MusicToggle />
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildQuestion(item, moduleId, language) {
  if (language === 'mr' && item.marathiWord) return `${item.marathiWord} कोणते आहे?`;
  switch (moduleId) {
    case 'numbers':    return `Can you find the number ${item.word}?`;
    case 'alphabets':  return `Where is the letter ${item.letter}? ${item.letter} for ${item.word}`;
    case 'animals':    return `Which one is the ${item.word}?`;
    case 'birds':      return `Can you find the ${item.word}?`;
    case 'colors':     return `Which color is ${item.word}?`;
    case 'shapes':     return `Can you find the ${item.word}?`;
    case 'days':       return `Which day is ${item.word}?`;
    case 'months':     return `Which month is ${item.word}?`;
    case 'fruits':     return `Which one is a ${item.word}?`;
    case 'vegetables': return `Which one is a ${item.word}?`;
    case 'bodyparts':  return `Can you point to your ${item.word}?`;
    case 'family':     return `Who is ${item.word}?`;
    case 'vehicles':   return `Which one is a ${item.word}?`;
    case 'clothes':    return `Which one is a ${item.word}?`;
    case 'food':       return `Which one is ${item.word}?`;
    case 'weather':    return `Which shows ${item.word} weather?`;
    case 'community':  return `Who is a ${item.word}?`;
    case 'opposites':  return `What is the opposite of ${item.example?.replace('Opposite: ', '').split(' ')[0] || item.word}?`;
    default:           return `Find the ${item.word}`;
  }
}

function buildQuestionLabel(item, moduleId, language) {
  if (language === 'mr' && item.marathiWord) return item.marathiWord;
  switch (moduleId) {
    case 'numbers':   return item.word;
    case 'alphabets': return `Letter ${item.letter}`;
    default:          return item.word;
  }
}

function getOptionLabel(item, moduleId) {
  switch (moduleId) {
    case 'numbers':   return `${item.numeral} - ${item.word}`;
    case 'alphabets': return item.letter;
    case 'colors':    return item.word;
    default:          return item.word;
  }
}

// ─── Option visual ───────────────────────────────────────────────────────────
function OptionVisual({ item, moduleId }) {
  if (moduleId === 'shapes') {
    return <ShapeDisplay type={item.svgType} color={item.color} size={60} />;
  }
  if (moduleId === 'colors') {
    return (
      <div
        className="w-14 h-14 rounded-2xl shadow-lg border-2 border-white/30"
        style={{ backgroundColor: item.hex }}
      />
    );
  }
  if (moduleId === 'numbers') {
    return <span className="text-4xl font-black text-white">{item.numeral}</span>;
  }
  if (moduleId === 'alphabets') {
    return (
      <div className="flex flex-col items-center">
        <span className="text-4xl font-black text-white">{item.letter}</span>
        <span className="text-3xl">{item.emoji}</span>
      </div>
    );
  }
  return <span className="text-5xl">{item.emoji}</span>;
}

export default TestPage;
