import React, { useState, useEffect, useCallback } from 'react';
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

const TOTAL_QUESTIONS = 10;

function TestPage() {
  const navigate = useNavigate();
  const { moduleId: paramModuleId } = useParams();
  const { language, awardStars } = useApp();

  const [selectedModuleId, setSelectedModuleId] = useState(paramModuleId || null);
  const [moduleItems, setModuleItems] = useState([]);

  const [question, setQuestion]     = useState(null);
  const [options, setOptions]       = useState([]);
  const [answered, setAnswered]     = useState(null);
  const [showBurst, setShowBurst]   = useState(false);
  const [score, setScore]           = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0); // 0-based, 0..9
  const [askedIds, setAskedIds]     = useState([]);       // ids already shown
  const [quizDone, setQuizDone]     = useState(false);
  const [loading, setLoading]       = useState(false);

  // ── Load module data ────────────────────────────────────────────────────
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
    if (moduleItems.length >= 2) startQuiz(moduleItems);
  }, [moduleItems]);

  // ── Start fresh quiz ────────────────────────────────────────────────────
  const startQuiz = (items) => {
    setScore(0);
    setQuestionIndex(0);
    setAskedIds([]);
    setQuizDone(false);
    pickNextQuestion(items, [], 0);
  };

  // ── Pick next unique question ───────────────────────────────────────────
  const pickNextQuestion = useCallback((items, prevAskedIds, currentIndex) => {
    const pool = items || moduleItems;
    if (pool.length < 2) return;

    // If we've done all 10 questions → show results
    if (currentIndex >= TOTAL_QUESTIONS) {
      setQuizDone(true);
      return;
    }

    // Pick from unseen items; if all seen, restart pool
    let remaining = pool.filter((i) => !prevAskedIds.includes(i.id));
    if (remaining.length === 0) remaining = pool; // cycle if module < 10 items

    const correct = remaining[Math.floor(Math.random() * remaining.length)];
    const wrongs  = pickRandom(
      pool.filter((i) => i.id !== correct.id),
      Math.min(3, pool.length - 1)
    );

    setQuestion(correct);
    setOptions(shuffle([correct, ...wrongs]));
    setAnswered(null);
    setAskedIds([...prevAskedIds, correct.id]);

    setTimeout(() => askQuestion(correct), 400);
  }, [moduleItems, language]);

  const askQuestion = (correct) => {
    if (!correct) return;
    const phrase = buildQuestion(correct, selectedModuleId, language);
    speak(phrase, { lang: language === 'mr' ? 'hi-IN' : 'en-IN', rate: 0.82, pitch: 1.1 });
  };

  // ── Handle answer ───────────────────────────────────────────────────────
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
      speak(encouragements[Math.floor(Math.random() * encouragements.length)], { rate: 0.85, pitch: 1.2 });
      setTimeout(() => {
        setAnswered(null);
        askQuestion(question);
      }, 2000);
    }
  };

  // After star burst, move to next question
  const handleBurstDone = () => {
    setShowBurst(false);
    const nextIndex = questionIndex + 1;
    setQuestionIndex(nextIndex);
    setTimeout(() => pickNextQuestion(moduleItems, askedIds, nextIndex), 300);
  };

  // ── Back: reset to module selector (navigate won't work — same URL) ─────
  const handleBackToSelector = () => {
    stop();
    setSelectedModuleId(null);
    setQuestion(null);
    setQuizDone(false);
    setScore(0);
    setQuestionIndex(0);
    setAskedIds([]);
  };

  // ── MODULE SELECTOR SCREEN ──────────────────────────────────────────────
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

  // ── LOADING SCREEN ──────────────────────────────────────────────────────
  const mod = ALL_MODULES.find((m) => m.id === selectedModuleId);
  if (loading || (!question && !quizDone)) {
    return (
      <div className="min-h-screen flex items-center justify-center"
           style={{ background: `linear-gradient(135deg, ${mod?.color || '#a855f7'}, #1a0533)` }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8 }}
                    className="text-7xl">⭐</motion.div>
      </div>
    );
  }

  // ── RESULTS SCREEN (after 10 questions) ────────────────────────────────
  if (quizDone) {
    const percent = Math.round((score / TOTAL_QUESTIONS) * 100);
    const emoji   = percent === 100 ? '🏆' : percent >= 70 ? '🌟' : percent >= 40 ? '😊' : '💪';
    const msg     = percent === 100
      ? 'Perfect score! You are amazing, Veera!'
      : percent >= 70
      ? 'Great job, Veera! You did so well!'
      : 'Well done for trying! Keep practising!';

    // speak result once
    speak(msg, { rate: 0.82, pitch: 1.2 });

    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 gap-6"
           style={{ background: `linear-gradient(160deg, ${mod?.color}cc, #1a0533)` }}>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="text-9xl"
        >
          {emoji}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white font-black text-3xl text-center"
        >
          Quiz Done!
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/20 rounded-3xl px-10 py-6 text-center"
        >
          <p className="text-yellow-300 font-black text-5xl">{score}/{TOTAL_QUESTIONS}</p>
          <p className="text-white font-bold text-lg mt-1">{'⭐'.repeat(score)}{'☆'.repeat(TOTAL_QUESTIONS - score)}</p>
          <p className="text-white/80 mt-3 text-base">{msg}</p>
        </motion.div>

        <div className="flex flex-wrap gap-4 justify-center">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => startQuiz(moduleItems)}
            className="btn-toddler text-white text-lg px-8 py-4"
            style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}
          >
            🔄 Play Again
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleBackToSelector}
            className="btn-toddler text-white text-lg px-8 py-4"
            style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}
          >
            🎯 New Topic
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => { stop(); navigate('/'); }}
            className="btn-toddler text-white text-lg px-8 py-4"
            style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
          >
            🏠 Home
          </motion.button>
        </div>
      </div>
    );
  }

  // ── QUIZ SCREEN ─────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: `linear-gradient(160deg, ${mod?.color}cc 0%, #1a0533 55%, #0f172a 100%)` }}
    >
      {/* Back button resets state — does NOT navigate (same URL bug fix) */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/20 backdrop-blur-sm sticky top-0 z-50 shadow-lg">
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={handleBackToSelector}
          className="w-12 h-12 rounded-2xl bg-white/30 flex items-center justify-center text-2xl shadow-md border-2 border-white/40"
          aria-label="Back to topic selector"
        >
          ⬅️
        </motion.button>

        <h1 className="text-white font-black text-xl text-shadow text-center flex-1 mx-2">
          {mod?.emoji} {language === 'mr' ? mod?.marathiTitle : mod?.title} Quiz
        </h1>

        {/* Question counter */}
        <div className="bg-white/20 rounded-2xl px-3 py-1.5 text-white font-black text-sm">
          {questionIndex + 1}/{TOTAL_QUESTIONS}
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 py-2 px-4">
        {Array.from({ length: TOTAL_QUESTIONS }).map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === questionIndex ? 20 : 10,
              height: 10,
              background: i < questionIndex
                ? 'rgba(134,239,172,0.9)'   // answered
                : i === questionIndex
                ? 'rgba(255,255,255,0.9)'   // current
                : 'rgba(255,255,255,0.25)', // upcoming
            }}
          />
        ))}
      </div>

      {/* Score bar */}
      <div className="flex items-center justify-between px-6 py-1">
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
          title="Repeat question"
        >
          🔊
        </motion.button>
      </div>

      {/* Question */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-2 gap-5">
        <motion.div
          key={questionIndex}
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
              const isCorrect  = option.id === question.id;
              const isSelected = answered && isCorrect;

              return (
                <motion.button
                  key={`${questionIndex}-${option.id}`}
                  initial={{ opacity: 0, scale: 0.5, y: 40 }}
                  animate={{ opacity: 1, scale: isSelected ? 1.06 : 1, y: 0 }}
                  transition={{ delay: i * 0.1, type: 'spring', stiffness: 280 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleAnswer(option)}
                  disabled={!!answered}
                  className="rounded-3xl p-4 flex flex-col items-center justify-center gap-2
                             border-2 text-white cursor-pointer select-none shadow-lg min-h-[120px]
                             disabled:cursor-not-allowed"
                  style={{
                    borderColor: isSelected ? 'rgba(134,239,172,0.8)' : 'rgba(255,255,255,0.2)',
                    background:  isSelected ? 'rgba(34,197,94,0.85)'  : 'rgba(255,255,255,0.12)',
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

        {/* Skip button */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={() => {
            const nextIndex = questionIndex + 1;
            setQuestionIndex(nextIndex);
            pickNextQuestion(moduleItems, askedIds, nextIndex);
          }}
          className="btn-toddler text-white text-base px-8 py-3"
          style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}
        >
          ⏭️ Skip
        </motion.button>
      </main>

      <StarBurst
        visible={showBurst}
        message="Correct! ⭐ Superstar!"
        onDone={handleBurstDone}
      />

      <MusicToggle />
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
    default:          return item.word;
  }
}

function OptionVisual({ item, moduleId }) {
  if (moduleId === 'shapes') return <ShapeDisplay type={item.svgType} color={item.color} size={60} />;
  if (moduleId === 'colors') {
    return <div className="w-14 h-14 rounded-2xl shadow-lg border-2 border-white/30"
                style={{ backgroundColor: item.hex }} />;
  }
  if (moduleId === 'numbers')   return <span className="text-4xl font-black text-white">{item.numeral}</span>;
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
