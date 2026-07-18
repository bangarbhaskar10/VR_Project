import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext.jsx';
import { speak, stop } from '../../utils/speech.js';
import { shuffle } from '../../utils/helpers.js';
import StarBurst from '../../components/StarBurst.jsx';
import MusicToggle from '../../components/MusicToggle.jsx';

const TOTAL_QUESTIONS = 10;

const COUNT_OBJECTS = [
  { name: 'stars',       emoji: '⭐' },
  { name: 'butterflies', emoji: '🦋' },
  { name: 'apples',      emoji: '🍎' },
  { name: 'bees',        emoji: '🐝' },
  { name: 'flowers',     emoji: '🌸' },
  { name: 'balloons',    emoji: '🎈' },
  { name: 'rockets',     emoji: '🚀' },
  { name: 'fish',        emoji: '🐟' },
  { name: 'cats',        emoji: '🐱' },
  { name: 'hearts',      emoji: '❤️' },
];

function generateOptions(correct) {
  const wrongs = new Set();
  while (wrongs.size < 3) {
    const r = Math.floor(Math.random() * 10) + 1;
    if (r !== correct) wrongs.add(r);
  }
  return shuffle([correct, ...Array.from(wrongs)]);
}

function CountGame() {
  const navigate = useNavigate();
  const { awardStars, recordGameCompleted } = useApp();

  const [questionIndex, setQuestionIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [object, setObject] = useState(COUNT_OBJECTS[0]);
  const [options, setOptions] = useState([]);
  const [answered, setAnswered] = useState(null);
  const [score, setScore] = useState(0);
  const [showBurst, setShowBurst] = useState(false);
  const [quizDone, setQuizDone] = useState(false);

  const generateQuestion = useCallback((index) => {
    const newCount = Math.floor(Math.random() * 10) + 1;
    const newObj = COUNT_OBJECTS[index % COUNT_OBJECTS.length];
    setCount(newCount);
    setObject(newObj);
    setOptions(generateOptions(newCount));
    setAnswered(null);
    setTimeout(() => {
      speak(
        `Count the ${newObj.name}! How many ${newObj.name} do you see?`,
        { rate: 0.8, pitch: 1.1 }
      );
    }, 300);
  }, []);

  useEffect(() => {
    speak("Let's count! How many can you count?", { rate: 0.82 });
    setTimeout(() => generateQuestion(0), 1200);
  }, []);

  const handleAnswer = (selected) => {
    if (answered) return;

    if (selected === count) {
      stop();
      setAnswered('correct');
      setScore((s) => s + 1);
      awardStars(1);
      setShowBurst(true);
      const cheers = [
        `Yes! ${count}! You counted right!`,
        `Correct! You are so clever, Veera!`,
        `Amazing! That is ${count}!`,
      ];
      speak(cheers[Math.floor(Math.random() * cheers.length)], { rate: 0.88, pitch: 1.3 });
    } else {
      setAnswered('retry');
      speak(`Try again! Count the ${object.name} again!`, { rate: 0.85, pitch: 1.2 });
      setTimeout(() => {
        setAnswered(null);
        speak(`How many ${object.name} do you see?`, { rate: 0.8, pitch: 1.1 });
      }, 2000);
    }
  };

  const handleBurstDone = () => {
    setShowBurst(false);
    const nextIndex = questionIndex + 1;
    if (nextIndex >= TOTAL_QUESTIONS) {
      setQuizDone(true);
      const msg = score >= 8
        ? 'Perfect counting! You are a math star, Veera!'
        : 'Great job counting! Keep practising!';
      speak(msg, { rate: 0.82, pitch: 1.2 });
      recordGameCompleted('count');
    } else {
      setQuestionIndex(nextIndex);
      setTimeout(() => generateQuestion(nextIndex), 300);
    }
  };

  const restartGame = () => {
    setQuestionIndex(0);
    setScore(0);
    setQuizDone(false);
    generateQuestion(0);
  };

  if (quizDone) {
    const emoji = score >= 9 ? '🏆' : score >= 7 ? '🌟' : '😊';
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 gap-6"
           style={{ background: 'linear-gradient(160deg, #10B981cc, #1a0533)' }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }} className="text-9xl">
          {emoji}
        </motion.div>
        <h1 className="text-white font-black text-3xl text-center">Counting Done!</h1>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }} className="bg-white/20 rounded-3xl px-10 py-6 text-center">
          <p className="text-yellow-300 font-black text-5xl">{score}/{TOTAL_QUESTIONS}</p>
          <p className="text-white font-bold mt-1">{'⭐'.repeat(score)}{'☆'.repeat(TOTAL_QUESTIONS - score)}</p>
        </motion.div>
        <div className="flex flex-wrap gap-4 justify-center">
          <motion.button whileTap={{ scale: 0.9 }} onClick={restartGame}
                         className="btn-toddler text-white"
                         style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
            🔄 Play Again
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
         style={{ background: 'linear-gradient(160deg, #10B981cc 0%, #1a0533 55%, #0f172a 100%)' }}>
      <div className="flex items-center justify-between px-4 py-3 bg-white/20 backdrop-blur-sm sticky top-0 z-50 shadow-lg">
        <motion.button whileTap={{ scale: 0.85 }} onClick={() => { stop(); navigate('/games'); }}
                       className="w-12 h-12 rounded-2xl bg-white/30 flex items-center justify-center text-2xl shadow-md border-2 border-white/40">
          ⬅️
        </motion.button>
        <h1 className="text-white font-black text-xl text-center flex-1 mx-2">
          🔢 Counting Game
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
        <motion.button whileTap={{ scale: 0.85 }}
                       onClick={() => speak(`How many ${object.name} do you see?`, { rate: 0.8, pitch: 1.1 })}
                       className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center text-xl">
          🔊
        </motion.button>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-2 gap-6">
        {/* Counting objects display */}
        <motion.div
          key={questionIndex}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/10 rounded-3xl p-5 border-2 border-white/20 w-full max-w-sm"
        >
          <p className="text-white/70 font-bold text-center mb-3 text-sm">
            How many {object.name} do you see?
          </p>
          <div className="flex flex-wrap justify-center gap-2 min-h-[80px] items-center">
            {Array.from({ length: count }).map((_, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.07, type: 'spring', stiffness: 300 }}
                className="text-3xl select-none"
              >
                {object.emoji}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Number options */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
          {options.map((num, i) => {
            const isCorrect = num === count;
            const isSelected = answered && isCorrect;
            return (
              <motion.button
                key={`${questionIndex}-${num}`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: isSelected ? 1.06 : 1 }}
                transition={{ delay: i * 0.1, type: 'spring', stiffness: 280 }}
                whileTap={{ scale: 0.88 }}
                onClick={() => handleAnswer(num)}
                disabled={!!answered}
                className="rounded-3xl p-4 flex flex-col items-center justify-center gap-1 border-2 text-white cursor-pointer select-none shadow-lg min-h-[90px] disabled:cursor-not-allowed"
                style={{
                  borderColor: isSelected ? 'rgba(134,239,172,0.8)' : 'rgba(255,255,255,0.2)',
                  background: isSelected ? 'rgba(34,197,94,0.85)' : 'rgba(255,255,255,0.12)',
                }}
              >
                <span className="font-black text-4xl leading-none">{num}</span>
                {isSelected && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-2xl">
                    ✅
                  </motion.span>
                )}
              </motion.button>
            );
          })}
        </div>
      </main>

      <StarBurst visible={showBurst} message={`${count}! Correct! ⭐`} onDone={handleBurstDone} />
      <MusicToggle />
    </div>
  );
}

export default CountGame;
