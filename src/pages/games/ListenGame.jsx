import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext.jsx';
import { ALL_MODULES, loadModuleData } from '../../data/modules.js';
import { speak, stop } from '../../utils/speech.js';
import { shuffle, pickRandom } from '../../utils/helpers.js';
import Header from '../../components/Header.jsx';
import StarBurst from '../../components/StarBurst.jsx';
import MusicToggle from '../../components/MusicToggle.jsx';

const TOTAL_QUESTIONS = 10;

function ListenGame() {
  const navigate = useNavigate();
  const { moduleId: paramModuleId } = useParams();
  const { language, awardStars, recordGameCompleted } = useApp();

  const [selectedModuleId, setSelectedModuleId] = useState(paramModuleId || null);
  const [moduleItems, setModuleItems] = useState([]);
  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [answered, setAnswered] = useState(null);
  const [showBurst, setShowBurst] = useState(false);
  const [score, setScore] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [askedIds, setAskedIds] = useState([]);
  const [quizDone, setQuizDone] = useState(false);
  const [loading, setLoading] = useState(false);

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
    if (moduleItems.length >= 2) startGame(moduleItems);
  }, [moduleItems]);

  const startGame = (items) => {
    setScore(0);
    setQuestionIndex(0);
    setAskedIds([]);
    setQuizDone(false);
    pickNextQuestion(items, [], 0);
  };

  const speakWord = useCallback((item) => {
    if (!item) return;
    const word = language === 'mr' && item.marathiWord ? item.marathiWord : item.word;
    speak(word, { lang: language === 'mr' ? 'hi-IN' : 'en-IN', rate: 0.78, pitch: 1.15 });
  }, [language]);

  const pickNextQuestion = useCallback((items, prevAskedIds, currentIndex) => {
    const pool = items || moduleItems;
    if (pool.length < 2) return;
    if (currentIndex >= TOTAL_QUESTIONS) { setQuizDone(true); return; }

    let remaining = pool.filter((i) => !prevAskedIds.includes(i.id));
    if (remaining.length === 0) remaining = pool;

    const correct = remaining[Math.floor(Math.random() * remaining.length)];
    const wrongs = pickRandom(pool.filter((i) => i.id !== correct.id), Math.min(3, pool.length - 1));

    setQuestion(correct);
    setOptions(shuffle([correct, ...wrongs]));
    setAnswered(null);
    setAskedIds([...prevAskedIds, correct.id]);

    setTimeout(() => speakWord(correct), 400);
  }, [moduleItems, speakWord]);

  const handleAnswer = (option) => {
    if (answered) return;

    if (option.id === question.id) {
      stop();
      setAnswered('correct');
      setScore((s) => s + 1);
      awardStars(1);
      setShowBurst(true);
      const cheers = [
        'Yes! That is right!',
        'Wonderful! You heard it!',
        'Superstar! Correct!',
        'Amazing! Well done!',
      ];
      speak(cheers[Math.floor(Math.random() * cheers.length)], { rate: 0.88, pitch: 1.3 });
    } else {
      setAnswered('retry');
      speak('Try again! Listen carefully!', { rate: 0.85, pitch: 1.2 });
      setTimeout(() => {
        setAnswered(null);
        speakWord(question);
      }, 2000);
    }
  };

  const handleBurstDone = () => {
    setShowBurst(false);
    const nextIndex = questionIndex + 1;
    setQuestionIndex(nextIndex);
    setTimeout(() => pickNextQuestion(moduleItems, askedIds, nextIndex), 300);
  };

  // Module selector
  if (!selectedModuleId) {
    return (
      <div className="min-h-screen flex flex-col"
           style={{ background: 'linear-gradient(135deg, #1a0533, #2d1b69, #1e3a5f)' }}>
        <Header title="👂 Listening Game" showBack backTo="/games" />
        <main className="flex-1 flex flex-col items-center px-4 py-6">
          <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className="text-white font-bold text-lg text-center mb-6">
            Choose a topic to listen!
          </motion.p>
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
                  speak(`Listen and find the ${mod.title}!`, { rate: 0.85 });
                  setSelectedModuleId(mod.id);
                }}
                className="module-card text-white py-5"
                style={{
                  background: `linear-gradient(135deg, ${mod.color}ee, ${mod.color}99)`,
                  boxShadow: `0 6px 20px ${mod.color}44`,
                }}
              >
                <span className="text-4xl mb-2 block">{mod.emoji}</span>
                <span className="font-black text-sm">{mod.title}</span>
              </motion.button>
            ))}
          </div>
        </main>
        <MusicToggle />
      </div>
    );
  }

  const mod = ALL_MODULES.find((m) => m.id === selectedModuleId);

  if (loading || (!question && !quizDone)) {
    return (
      <div className="min-h-screen flex items-center justify-center"
           style={{ background: `linear-gradient(135deg, ${mod?.color || '#F59E0B'}, #1a0533)` }}>
        <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 0.6 }}
                    className="text-7xl">👂</motion.div>
      </div>
    );
  }

  // Results
  if (quizDone) {
    const percent = Math.round((score / TOTAL_QUESTIONS) * 100);
    const emoji = percent === 100 ? '🏆' : percent >= 70 ? '🌟' : '😊';
    const msg = percent === 100
      ? 'Perfect! You have super ears, Veera!'
      : percent >= 70
      ? 'Great listening! Well done!'
      : 'Keep practising! You are getting better!';

    speak(msg, { rate: 0.82, pitch: 1.2 });
    recordGameCompleted('listen');

    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 gap-6"
           style={{ background: `linear-gradient(160deg, ${mod?.color}cc, #1a0533)` }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }} className="text-9xl">
          {emoji}
        </motion.div>
        <h1 className="text-white font-black text-3xl text-center">Listening Done!</h1>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/20 rounded-3xl px-10 py-6 text-center">
          <p className="text-yellow-300 font-black text-5xl">{score}/{TOTAL_QUESTIONS}</p>
          <p className="text-white font-bold text-lg mt-1">{'⭐'.repeat(score)}{'☆'.repeat(TOTAL_QUESTIONS - score)}</p>
          <p className="text-white/80 mt-3">{msg}</p>
        </motion.div>
        <div className="flex flex-wrap gap-4 justify-center">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => startGame(moduleItems)}
                         className="btn-toddler text-white"
                         style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
            🔄 Play Again
          </motion.button>
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => { stop(); setSelectedModuleId(null); setQuizDone(false); }}
                         className="btn-toddler text-white"
                         style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}>
            🎯 New Topic
          </motion.button>
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => { stop(); navigate('/games'); }}
                         className="btn-toddler text-white"
                         style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}>
            🎮 Games
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col"
         style={{ background: `linear-gradient(160deg, ${mod?.color}cc 0%, #1a0533 55%, #0f172a 100%)` }}>
      <div className="flex items-center justify-between px-4 py-3 bg-white/20 backdrop-blur-sm sticky top-0 z-50 shadow-lg">
        <motion.button whileTap={{ scale: 0.85 }} onClick={() => { stop(); setSelectedModuleId(null); }}
                       className="w-12 h-12 rounded-2xl bg-white/30 flex items-center justify-center text-2xl shadow-md border-2 border-white/40">
          ⬅️
        </motion.button>
        <h1 className="text-white font-black text-lg text-center flex-1 mx-2">
          👂 {language === 'mr' ? mod?.marathiTitle : mod?.title}
        </h1>
        <div className="bg-white/20 rounded-2xl px-3 py-1.5 text-white font-black text-sm">
          {questionIndex + 1}/{TOTAL_QUESTIONS}
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 py-2 px-4">
        {Array.from({ length: TOTAL_QUESTIONS }).map((_, i) => (
          <div key={i} className="rounded-full transition-all duration-300"
               style={{
                 width: i === questionIndex ? 20 : 10, height: 10,
                 background: i < questionIndex ? 'rgba(134,239,172,0.9)'
                   : i === questionIndex ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.25)',
               }} />
        ))}
      </div>

      {/* Score */}
      <div className="flex items-center justify-between px-6 py-1">
        <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5">
          <span>✅</span>
          <span className="text-white font-black">{score} correct</span>
        </div>
        <div className="flex items-center gap-2 bg-yellow-500/30 rounded-full px-4 py-1.5">
          <span>⭐</span>
          <span className="text-yellow-300 font-black">{score} stars</span>
        </div>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-2 gap-6">
        {/* Listen prompt — NO word shown */}
        <motion.div key={questionIndex} initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center bg-white/10 rounded-3xl px-10 py-6 border-2 border-white/20">
          <motion.div
            className="text-7xl mb-3"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            👂
          </motion.div>
          <p className="text-white font-black text-xl">Listen carefully!</p>
          <p className="text-white/60 text-sm mt-1">Tap the correct picture</p>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => speakWord(question)}
            className="mt-4 bg-white/20 hover:bg-white/30 rounded-full px-5 py-2 text-white font-bold text-sm flex items-center gap-2 mx-auto"
          >
            🔊 Hear again
          </motion.button>
        </motion.div>

        {/* Options grid */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
          <AnimatePresence>
            {options.map((option, i) => {
              const isCorrect = option.id === question.id;
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
                  className="rounded-3xl p-4 flex flex-col items-center justify-center gap-2 border-2 text-white cursor-pointer select-none shadow-lg min-h-[110px] disabled:cursor-not-allowed"
                  style={{
                    borderColor: isSelected ? 'rgba(134,239,172,0.8)' : 'rgba(255,255,255,0.2)',
                    background: isSelected ? 'rgba(34,197,94,0.85)' : 'rgba(255,255,255,0.12)',
                  }}
                >
                  <span className="text-5xl">{option.emoji}</span>
                  <span className="font-black text-xs text-center leading-tight">
                    {language === 'mr' ? option.marathiWord : option.word}
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
      </main>

      <StarBurst visible={showBurst} message="Correct! ⭐ Great ears!" onDone={handleBurstDone} />
      <MusicToggle />
    </div>
  );
}

export default ListenGame;
