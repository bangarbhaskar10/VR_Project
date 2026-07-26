import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext.jsx';
import { WORKSHEET_LEVELS } from '../data/worksheets.js';
import { speak, stop } from '../utils/speech.js';
import StarBurst from '../components/StarBurst.jsx';
import MusicToggle from '../components/MusicToggle.jsx';

// ── Flatten all sheets from all levels for quick lookup ──────────────────────
const ALL_SHEETS = WORKSHEET_LEVELS.flatMap((lvl) =>
  lvl.subjects.flatMap((sub) =>
    sub.sheets.map((sh) => ({
      ...sh,
      levelLabel: lvl.label,
      subjectLabel: sub.label,
      levelColor: lvl.color,
      subjectColor: sub.color,
    }))
  )
);

// ── Count emoji display (render N copies of an emoji) ────────────────────────
function CountDisplay({ emoji, count }) {
  return (
    <div className="flex flex-wrap justify-center gap-1 my-3 px-2">
      {Array.from({ length: count }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.06, type: 'spring', stiffness: 300 }}
          className="text-3xl select-none"
        >
          {emoji}
        </motion.span>
      ))}
    </div>
  );
}

// ── Option button shared by mcq / image_mcq / count ─────────────────────────
function OptionBtn({ opt, index, answered, correct, onPick, isCount }) {
  const isSelected = answered === (isCount ? opt : opt.id);
  const isRight = isCount ? (opt === correct) : opt.correct;

  let bg = 'rgba(255,255,255,0.12)';
  let border = 'rgba(255,255,255,0.2)';
  if (isSelected && isRight)  { bg = 'rgba(34,197,94,0.85)';  border = 'rgba(134,239,172,0.8)'; }
  if (isSelected && !isRight) { bg = 'rgba(239,68,68,0.75)';  border = 'rgba(252,165,165,0.8)'; }

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.5, y: 30 }}
      animate={{ opacity: 1, scale: isSelected && isRight ? 1.06 : 1, y: 0 }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 280 }}
      whileTap={{ scale: 0.9 }}
      onClick={onPick}
      disabled={!!answered}
      className="rounded-3xl p-4 flex flex-col items-center justify-center gap-1.5
                 border-2 text-white cursor-pointer select-none shadow-lg min-h-[100px]
                 disabled:cursor-not-allowed transition-colors"
      style={{ borderColor: border, background: bg }}
    >
      {isCount ? (
        <span className="font-black text-3xl">{opt}</span>
      ) : (
        <>
          {opt.emoji && <span className="text-4xl">{opt.emoji}</span>}
          <span className="font-black text-sm text-center leading-tight">{opt.label}</span>
        </>
      )}
      {isSelected && isRight  && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-2xl">✅</motion.span>}
      {isSelected && !isRight && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-2xl">❌</motion.span>}
    </motion.button>
  );
}

// ── Circle the Letter ────────────────────────────────────────────────────────
// Shows a big emoji + word, child taps the correct starting letter from a 2×2 grid
function CircleLetterQ({ question, answered, onAnswer }) {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Big emoji + word */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white/15 rounded-3xl px-8 py-5 flex flex-col items-center gap-1 shadow-lg"
      >
        <span className="text-7xl select-none">{question.emoji}</span>
        <span className="text-white font-black text-2xl mt-1 tracking-wide">{question.word}</span>
      </motion.div>

      <p className="text-white/70 font-bold text-sm">🔵 Circle the correct starting letter</p>

      {/* 2×2 letter grid */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
        {question.options.map((opt, i) => {
          const isSelected = answered === opt.id;
          const isRight = opt.correct;
          let bg = 'rgba(255,255,255,0.12)';
          let border = 'rgba(255,255,255,0.2)';
          if (isSelected && isRight)  { bg = 'rgba(34,197,94,0.85)';  border = 'rgba(134,239,172,0.8)'; }
          if (isSelected && !isRight) { bg = 'rgba(239,68,68,0.75)';  border = 'rgba(252,165,165,0.8)'; }

          return (
            <motion.button
              key={opt.id}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: isSelected && isRight ? 1.08 : 1 }}
              transition={{ delay: i * 0.08, type: 'spring', stiffness: 280 }}
              whileTap={{ scale: 0.88 }}
              onClick={() => onAnswer(opt)}
              disabled={!!answered}
              className="rounded-3xl py-5 flex flex-col items-center justify-center border-2
                         text-white font-black text-4xl shadow-lg disabled:cursor-not-allowed"
              style={{ background: bg, borderColor: border }}
            >
              {opt.label}
              {isSelected && isRight  && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-2xl mt-1">✅</motion.span>}
              {isSelected && !isRight && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-2xl mt-1">❌</motion.span>}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ── Match the Similar ────────────────────────────────────────────────────────
// Tap a left item → tap its matching right item. Works pair-by-pair.
// matchState: { leftPicked: id|null, matched: {leftId: rightId} }
function MatchQ({ question, onAllMatched }) {
  const [leftPicked, setLeftPicked] = useState(null);
  const [matched, setMatched]       = useState({});   // leftId → rightId
  const [wrong, setWrong]           = useState(null); // rightId that was wrong

  // Shuffle right column once on mount
  const [rightOrder] = useState(() =>
    [...question.pairs].map((p) => p.right).sort(() => Math.random() - 0.5)
  );

  const totalPairs = question.pairs.length;
  const allDone    = Object.keys(matched).length === totalPairs;

  useEffect(() => {
    if (allDone) {
      speak('All matched! Well done!', { rate: 0.88, pitch: 1.3 });
      setTimeout(() => onAllMatched(), 1400);
    }
  }, [allDone]);

  const handleLeft = (leftId) => {
    if (matched[leftId]) return;
    setLeftPicked(leftId);
    speak(question.pairs.find((p) => p.left.id === leftId)?.left.label || '', { rate: 0.85 });
  };

  const handleRight = (rightId) => {
    if (!leftPicked) return;
    // find the pair that owns this right
    const pair = question.pairs.find((p) => p.right.id === rightId);
    if (pair && pair.left.id === leftPicked) {
      // correct
      setMatched((m) => ({ ...m, [leftPicked]: rightId }));
      setLeftPicked(null);
      speak('Correct match!', { rate: 0.88, pitch: 1.3 });
    } else {
      // wrong
      setWrong(rightId);
      speak('Try again!', { rate: 0.85, pitch: 1.1 });
      setTimeout(() => { setWrong(null); setLeftPicked(null); }, 900);
    }
  };

  const matchedRightIds = new Set(Object.values(matched));

  return (
    <div className="flex flex-col gap-3 w-full max-w-sm">
      <p className="text-white/70 font-bold text-sm text-center">
        Tap a left item, then tap its match on the right!
      </p>

      <div className="flex gap-3">
        {/* Left column */}
        <div className="flex-1 flex flex-col gap-2">
          {question.pairs.map((pair) => {
            const isMatched  = !!matched[pair.left.id];
            const isPicked   = leftPicked === pair.left.id;
            return (
              <motion.button
                key={pair.left.id}
                whileTap={{ scale: 0.9 }}
                onClick={() => !isMatched && handleLeft(pair.left.id)}
                disabled={isMatched}
                className="rounded-2xl py-3 px-2 flex flex-col items-center justify-center border-2
                           text-white font-bold text-sm min-h-[64px] disabled:cursor-default"
                style={{
                  background: isMatched ? 'rgba(34,197,94,0.7)'
                            : isPicked  ? 'rgba(251,191,36,0.8)'
                            :             'rgba(255,255,255,0.12)',
                  borderColor: isMatched ? 'rgba(134,239,172,0.9)'
                             : isPicked  ? 'rgba(251,191,36,0.9)'
                             :             'rgba(255,255,255,0.25)',
                  boxShadow: isPicked ? '0 0 14px rgba(251,191,36,0.6)' : 'none',
                }}
                animate={{ scale: isPicked ? 1.05 : 1 }}
              >
                <span className="text-2xl">{pair.left.emoji}</span>
                {pair.left.label !== pair.left.emoji && (
                  <span className="text-xs mt-0.5 font-black">{pair.left.label}</span>
                )}
                {isMatched && <span className="text-base mt-0.5">✅</span>}
              </motion.button>
            );
          })}
        </div>

        {/* Arrow column */}
        <div className="flex flex-col gap-2 justify-around py-1">
          {question.pairs.map((_, i) => (
            <div key={i} className="text-white/40 text-xl font-black">→</div>
          ))}
        </div>

        {/* Right column (shuffled) */}
        <div className="flex-1 flex flex-col gap-2">
          {rightOrder.map((right) => {
            const isMatched = matchedRightIds.has(right.id);
            const isWrong   = wrong === right.id;
            return (
              <motion.button
                key={right.id}
                whileTap={{ scale: 0.9 }}
                onClick={() => !isMatched && handleRight(right.id)}
                disabled={isMatched || !leftPicked}
                className="rounded-2xl py-3 px-2 flex flex-col items-center justify-center border-2
                           text-white font-bold text-sm min-h-[64px] disabled:cursor-default"
                style={{
                  background: isMatched ? 'rgba(34,197,94,0.7)'
                            : isWrong   ? 'rgba(239,68,68,0.7)'
                            :             'rgba(255,255,255,0.12)',
                  borderColor: isMatched ? 'rgba(134,239,172,0.9)'
                             : isWrong   ? 'rgba(252,165,165,0.9)'
                             :             'rgba(255,255,255,0.25)',
                }}
                animate={{ x: isWrong ? [-6, 6, -4, 4, 0] : 0 }}
                transition={{ duration: 0.35 }}
              >
                <span className="text-2xl">{right.emoji}</span>
                {right.label !== right.emoji && right.label && (
                  <span className="text-xs mt-0.5 font-black">{right.label}</span>
                )}
                {isMatched && <span className="text-base mt-0.5">✅</span>}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Progress */}
      <p className="text-center text-white/50 text-xs font-bold mt-1">
        {Object.keys(matched).length}/{totalPairs} matched
      </p>
    </div>
  );
}

// ── True / False question ────────────────────────────────────────────────────
function TrueFalseQ({ question, answered, onAnswer }) {
  const buttons = [
    { id: 'true',  label: '✅ True',  value: true  },
    { id: 'false', label: '❌ False', value: false },
  ];
  return (
    <div className="flex gap-4 mt-4 justify-center">
      {buttons.map((b) => {
        const isSelected = answered === String(b.value);
        const isRight = b.value === question.answer;
        let bg = 'rgba(255,255,255,0.12)';
        let border = 'rgba(255,255,255,0.25)';
        if (isSelected && isRight)  { bg = 'rgba(34,197,94,0.85)';  border = 'rgba(134,239,172,0.8)'; }
        if (isSelected && !isRight) { bg = 'rgba(239,68,68,0.75)';  border = 'rgba(252,165,165,0.8)'; }
        return (
          <motion.button
            key={b.id}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: b.value ? 0 : 0.1, type: 'spring', stiffness: 260 }}
            whileTap={{ scale: 0.9 }}
            disabled={!!answered}
            onClick={() => onAnswer(String(b.value))}
            className="flex-1 max-w-[140px] rounded-3xl py-6 text-white font-black text-xl
                       border-2 shadow-lg disabled:cursor-not-allowed"
            style={{ background: bg, borderColor: border }}
          >
            {b.label}
          </motion.button>
        );
      })}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
function WorksheetPage() {
  const navigate = useNavigate();
  const { sheetId } = useParams();
  const { awardStars, recordGameCompleted } = useApp();

  const sheet = ALL_SHEETS.find((s) => s.id === sheetId);

  const [qIndex, setQIndex]       = useState(0);
  const [answered, setAnswered]   = useState(null);   // selected answer key
  const [score, setScore]         = useState(0);
  const [showBurst, setShowBurst] = useState(false);
  const [done, setDone]           = useState(false);
  const [wrongHint, setWrongHint] = useState(false);

  const question = sheet?.questions[qIndex];
  const total    = sheet?.questions.length || 0;

  // Speak the question on load / change
  useEffect(() => {
    if (!question) return;
    const delay = setTimeout(() => speakQuestion(question), 400);
    return () => clearTimeout(delay);
  }, [qIndex, question]);

  const speakQuestion = useCallback((q) => {
    if (!q) return;
    let text = q.question;
    if (q.type === 'truefalse')     text = `True or False? ${q.question}`;
    if (q.type === 'count')         text = `Count them! ${q.question}`;
    if (q.type === 'circle_letter') text = `${q.question} Circle the correct letter!`;
    if (q.type === 'match')         text = `${q.question} Tap to match!`;
    speak(text, { rate: 0.80, pitch: 1.05 });
  }, []);

  const handleCorrect = () => {
    stop();
    setScore((s) => s + 1);
    awardStars(1);
    setShowBurst(true);
    const cheers = ['Well done!', 'Correct!', 'That is right!', 'Yes!', 'Good one!'];
    speak(cheers[Math.floor(Math.random() * cheers.length)], { rate: 0.88, pitch: 1.3 });
  };

  const handleWrong = () => {
    setWrongHint(true);
    const enc = ['Try again!', 'Almost!', 'Think carefully!'];
    speak(enc[Math.floor(Math.random() * enc.length)], { rate: 0.85, pitch: 1.2 });
    setTimeout(() => {
      setAnswered(null);
      setWrongHint(false);
      speakQuestion(question);
    }, 2200);
  };

  // mcq / image_mcq answer
  const handleMCQAnswer = (opt) => {
    if (answered) return;
    setAnswered(opt.id);
    if (opt.correct) handleCorrect();
    else handleWrong();
  };

  // count answer
  const handleCountAnswer = (val) => {
    if (answered) return;
    setAnswered(val);
    if (val === question.answer) handleCorrect();
    else handleWrong();
  };

  // circle_letter answer
  const handleCircleLetterAnswer = (opt) => {
    if (answered) return;
    setAnswered(opt.id);
    if (opt.correct) handleCorrect();
    else handleWrong();
  };

  // match — called when all pairs matched (auto-advance)
  const handleMatchAllDone = () => {
    handleCorrect();
  };

  // true/false answer
  const handleTFAnswer = (val) => {
    if (answered) return;
    setAnswered(val);
    if (val === String(question.answer)) handleCorrect();
    else handleWrong();
  };

  const handleBurstDone = () => {
    setShowBurst(false);
    const next = qIndex + 1;
    if (next >= total) {
      recordGameCompleted('worksheet');
      setDone(true);
      const pct = Math.round(((score + 1) / total) * 100);
      const msg = pct === 100
        ? 'Perfect score! You are amazing, Veera!'
        : pct >= 70
        ? 'Great job, Veera! You did so well!'
        : 'Well done for trying! Keep practising!';
      speak(msg, { rate: 0.82, pitch: 1.2 });
    } else {
      setAnswered(null);
      setQIndex(next);
    }
  };

  if (!sheet) {
    return (
      <div className="min-h-screen flex items-center justify-center"
           style={{ background: 'linear-gradient(135deg,#1a0533,#2d1b69)' }}>
        <div className="text-white text-center">
          <p className="text-5xl mb-4">🤔</p>
          <p className="font-bold text-xl">Worksheet not found!</p>
          <button onClick={() => navigate('/worksheets')}
                  className="mt-6 btn-toddler text-white px-6 py-3"
                  style={{ background: 'linear-gradient(135deg,#a855f7,#7c3aed)' }}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const sheetColor = sheet.color;

  // ── DONE SCREEN ────────────────────────────────────────────────────────────
  if (done) {
    const finalScore = score;
    const pct   = Math.round((finalScore / total) * 100);
    const emoji = pct === 100 ? '🏆' : pct >= 70 ? '🌟' : pct >= 40 ? '😊' : '💪';
    const grade = pct === 100 ? 'A+' : pct >= 80 ? 'A' : pct >= 60 ? 'B' : pct >= 40 ? 'C' : 'D';

    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 gap-6"
           style={{ background: `linear-gradient(160deg, ${sheetColor}cc, #1a0533)` }}>

        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="text-9xl">
          {emoji}
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                   className="text-white font-black text-3xl text-center">
          Worksheet Done! 🎉
        </motion.h1>

        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/20 rounded-3xl px-10 py-6 text-center w-full max-w-sm">
          <p className="text-yellow-300 font-black text-5xl">{finalScore}/{total}</p>
          <p className="text-white font-bold text-2xl mt-2">Grade: {grade}</p>
          <p className="text-white font-bold text-lg mt-1">{'⭐'.repeat(Math.min(finalScore, 10))}{'☆'.repeat(Math.max(0, total - finalScore))}</p>
          <p className="text-white/80 mt-3 text-base">
            {pct === 100
              ? 'Perfect! You are a worksheet champion!'
              : pct >= 70
              ? 'Excellent work! Keep it up!'
              : 'Great effort! Practise makes perfect!'}
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-4 justify-center">
          <motion.button whileTap={{ scale: 0.9 }}
                         onClick={() => { setScore(0); setQIndex(0); setAnswered(null); setDone(false); }}
                         className="btn-toddler text-white text-lg px-8 py-4"
                         style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
            🔄 Try Again
          </motion.button>
          <motion.button whileTap={{ scale: 0.9 }}
                         onClick={() => { stop(); navigate('/worksheets'); }}
                         className="btn-toddler text-white text-lg px-8 py-4"
                         style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}>
            📋 More Sheets
          </motion.button>
          <motion.button whileTap={{ scale: 0.9 }}
                         onClick={() => { stop(); navigate('/'); }}
                         className="btn-toddler text-white text-lg px-8 py-4"
                         style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}>
            🏠 Home
          </motion.button>
        </div>
      </div>
    );
  }

  if (!question) return null;

  // ── QUESTION SCREEN ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col"
         style={{ background: `linear-gradient(160deg, ${sheetColor}cc 0%, #1a0533 55%, #0f172a 100%)` }}>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/20 backdrop-blur-sm sticky top-0 z-50 shadow-lg">
        <motion.button whileTap={{ scale: 0.85 }}
                       onClick={() => { stop(); navigate('/worksheets'); }}
                       className="w-12 h-12 rounded-2xl bg-white/30 flex items-center justify-center text-2xl shadow-md border-2 border-white/40">
          ⬅️
        </motion.button>
        <div className="text-center flex-1 mx-2">
          <h1 className="text-white font-black text-base leading-tight">{sheet.emoji} {sheet.title}</h1>
          <p className="text-white/60 text-xs font-semibold">{sheet.levelLabel} · {sheet.subjectLabel}</p>
        </div>
        <div className="bg-white/20 rounded-2xl px-3 py-1.5 text-white font-black text-sm">
          {qIndex + 1}/{total}
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 py-2 px-4">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className="rounded-full transition-all duration-300"
               style={{
                 width: i === qIndex ? 20 : 10,
                 height: 10,
                 background: i < qIndex
                   ? 'rgba(134,239,172,0.9)'
                   : i === qIndex
                   ? 'rgba(255,255,255,0.9)'
                   : 'rgba(255,255,255,0.25)',
               }} />
        ))}
      </div>

      {/* Score */}
      <div className="flex items-center justify-between px-6 py-1">
        <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5">
          <span className="text-lg">✅</span>
          <span className="text-white font-black">{score} correct</span>
        </div>
        <div className="flex items-center gap-2 bg-yellow-500/30 rounded-full px-4 py-1.5">
          <span className="text-lg">⭐</span>
          <span className="text-yellow-300 font-black">{score} stars</span>
        </div>
        <motion.button whileTap={{ scale: 0.85 }}
                       onClick={() => speakQuestion(question)}
                       className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center text-xl"
                       title="Hear question again">
          🔊
        </motion.button>
      </div>

      {/* Question area */}
      <main className="flex-1 flex flex-col items-center px-4 py-3 gap-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={qIndex}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-sm"
          >
            {/* Question text — hidden for circle_letter (it renders its own layout) */}
            {question.type !== 'circle_letter' && (
              <div className="bg-white/10 rounded-3xl px-5 py-4 mb-3 text-center">
                <p className="text-white/60 text-xs font-bold uppercase tracking-wide mb-1">
                  Question {qIndex + 1}
                </p>
                <p className="text-white font-black text-lg leading-snug">
                  {question.question}
                </p>
                {question.type === 'count' && (
                  <CountDisplay emoji={question.emoji} count={question.count} />
                )}
              </div>
            )}

            {/* Wrong-answer hint */}
            {wrongHint && question.hint && question.type !== 'match' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-orange-400/80 rounded-2xl px-4 py-2 text-white font-bold text-sm text-center mb-2"
              >
                💡 Hint: {question.hint}
              </motion.div>
            )}

            {/* MCQ / image_mcq */}
            {(question.type === 'mcq' || question.type === 'image_mcq') && (
              <div className="grid grid-cols-2 gap-3">
                {question.options.map((opt, i) => (
                  <OptionBtn
                    key={opt.id}
                    opt={opt}
                    index={i}
                    answered={answered}
                    correct={opt.correct}
                    onPick={() => handleMCQAnswer(opt)}
                    isCount={false}
                  />
                ))}
              </div>
            )}

            {/* Count MCQ */}
            {question.type === 'count' && (
              <div className="grid grid-cols-2 gap-3">
                {question.options.map((opt, i) => (
                  <OptionBtn
                    key={opt}
                    opt={opt}
                    index={i}
                    answered={answered}
                    correct={question.answer}
                    onPick={() => handleCountAnswer(opt)}
                    isCount={true}
                  />
                ))}
              </div>
            )}

            {/* True / False */}
            {question.type === 'truefalse' && (
              <TrueFalseQ
                question={question}
                answered={answered}
                onAnswer={handleTFAnswer}
              />
            )}

            {/* Circle the Letter */}
            {question.type === 'circle_letter' && (
              <CircleLetterQ
                question={question}
                answered={answered}
                onAnswer={handleCircleLetterAnswer}
              />
            )}

            {/* Match the Similar */}
            {question.type === 'match' && (
              <MatchQ
                key={qIndex}
                question={question}
                onAllMatched={handleMatchAllDone}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <StarBurst visible={showBurst} message="Correct! ⭐ Great work!" onDone={handleBurstDone} />
      <MusicToggle />
    </div>
  );
}

export default WorksheetPage;
