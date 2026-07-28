import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext.jsx';
import { ORAL_SECTIONS, WRITTEN_SECTIONS } from '../data/examData.js';
import { speak, stop } from '../utils/speech.js';
import StarBurst from '../components/StarBurst.jsx';
import MusicToggle from '../components/MusicToggle.jsx';

const ALL_SECTIONS = [...ORAL_SECTIONS, ...WRITTEN_SECTIONS];

// ── Count display ─────────────────────────────────────────────────────────────
function CountDisplay({ emoji, count }) {
  return (
    <div className="flex flex-wrap justify-center gap-1 my-3 px-2">
      {Array.from({ length: count }).map((_, i) => (
        <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: i * 0.06, type: 'spring', stiffness: 300 }}
          className="text-3xl select-none">{emoji}</motion.span>
      ))}
    </div>
  );
}

// ── Option button ─────────────────────────────────────────────────────────────
function OptionBtn({ opt, index, answered, onPick, isCount, correctVal }) {
  const isSelected = answered === (isCount ? opt : opt.id);
  const isRight    = isCount ? opt === correctVal : opt.correct;
  let bg = 'rgba(255,255,255,0.12)', border = 'rgba(255,255,255,0.2)';
  if (isSelected && isRight)  { bg = 'rgba(34,197,94,0.85)';  border = 'rgba(134,239,172,0.8)'; }
  if (isSelected && !isRight) { bg = 'rgba(239,68,68,0.75)';  border = 'rgba(252,165,165,0.8)'; }
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.5, y: 30 }}
      animate={{ opacity: 1, scale: isSelected && isRight ? 1.06 : 1, y: 0 }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 280 }}
      whileTap={{ scale: 0.9 }} onClick={onPick} disabled={!!answered}
      className="rounded-3xl p-4 flex flex-col items-center justify-center gap-1.5 border-2
                 text-white cursor-pointer select-none shadow-lg min-h-[90px] disabled:cursor-not-allowed"
      style={{ borderColor: border, background: bg }}
    >
      {isCount ? <span className="font-black text-3xl">{opt}</span> : (
        <>
          {opt.emoji && <span className="text-3xl">{opt.emoji}</span>}
          <span className="font-black text-sm text-center leading-tight">{opt.label}</span>
        </>
      )}
      {isSelected && isRight  && <motion.span initial={{ scale:0 }} animate={{ scale:1 }} className="text-xl">✅</motion.span>}
      {isSelected && !isRight && <motion.span initial={{ scale:0 }} animate={{ scale:1 }} className="text-xl">❌</motion.span>}
    </motion.button>
  );
}

// ── Circle the letter ─────────────────────────────────────────────────────────
function CircleLetterQ({ question, answered, onAnswer }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div initial={{ scale:0.7, opacity:0 }} animate={{ scale:1, opacity:1 }}
        className="bg-white/15 rounded-3xl px-8 py-5 flex flex-col items-center gap-1 shadow-lg">
        <span className="text-7xl select-none">{question.emoji}</span>
        <span className="text-white font-black text-2xl mt-1 tracking-wide">{question.word}</span>
      </motion.div>
      <p className="text-white/70 font-bold text-sm">🔵 Circle the correct starting letter</p>
      <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
        {question.options.map((opt, i) => {
          const isSelected = answered === opt.id;
          const isRight = opt.correct;
          let bg = 'rgba(255,255,255,0.12)', border = 'rgba(255,255,255,0.2)';
          if (isSelected && isRight)  { bg = 'rgba(34,197,94,0.85)';  border = 'rgba(134,239,172,0.8)'; }
          if (isSelected && !isRight) { bg = 'rgba(239,68,68,0.75)';  border = 'rgba(252,165,165,0.8)'; }
          return (
            <motion.button key={opt.id}
              initial={{ opacity:0, scale:0.6 }} animate={{ opacity:1, scale: isSelected && isRight ? 1.08 : 1 }}
              transition={{ delay: i * 0.08, type:'spring', stiffness:280 }}
              whileTap={{ scale:0.88 }} onClick={() => onAnswer(opt)} disabled={!!answered}
              className="rounded-3xl py-5 flex flex-col items-center justify-center border-2
                         text-white font-black text-4xl shadow-lg disabled:cursor-not-allowed"
              style={{ background: bg, borderColor: border }}>
              {opt.label}
              {isSelected && isRight  && <motion.span initial={{ scale:0 }} animate={{ scale:1 }} className="text-2xl mt-1">✅</motion.span>}
              {isSelected && !isRight && <motion.span initial={{ scale:0 }} animate={{ scale:1 }} className="text-2xl mt-1">❌</motion.span>}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ── True / False ──────────────────────────────────────────────────────────────
function TrueFalseQ({ question, answered, onAnswer }) {
  return (
    <div className="flex gap-4 mt-4 justify-center">
      {[{ id:'true', label:'✅ True', value:true },{ id:'false', label:'❌ False', value:false }].map((b) => {
        const isSelected = answered === String(b.value);
        const isRight = b.value === question.answer;
        let bg = 'rgba(255,255,255,0.12)', border = 'rgba(255,255,255,0.25)';
        if (isSelected && isRight)  { bg = 'rgba(34,197,94,0.85)';  border = 'rgba(134,239,172,0.8)'; }
        if (isSelected && !isRight) { bg = 'rgba(239,68,68,0.75)';  border = 'rgba(252,165,165,0.8)'; }
        return (
          <motion.button key={b.id}
            initial={{ opacity:0, scale:0.7 }} animate={{ opacity:1, scale:1 }}
            transition={{ delay: b.value ? 0 : 0.1, type:'spring', stiffness:260 }}
            whileTap={{ scale:0.9 }} disabled={!!answered} onClick={() => onAnswer(String(b.value))}
            className="flex-1 max-w-[140px] rounded-3xl py-6 text-white font-black text-xl
                       border-2 shadow-lg disabled:cursor-not-allowed"
            style={{ background: bg, borderColor: border }}>
            {b.label}
          </motion.button>
        );
      })}
    </div>
  );
}

// ── Match ─────────────────────────────────────────────────────────────────────
function MatchQ({ question, onAllMatched }) {
  const [leftPicked, setLeftPicked] = useState(null);
  const [matched, setMatched]       = useState({});
  const [wrong, setWrong]           = useState(null);
  const [rightOrder] = useState(() =>
    [...question.pairs].map((p) => p.right).sort(() => Math.random() - 0.5)
  );
  const total = question.pairs.length;
  const allDone = Object.keys(matched).length === total;

  useEffect(() => {
    if (allDone) {
      speak('All matched! Well done!', { rate: 0.88, pitch: 1.3 });
      setTimeout(() => onAllMatched(), 1400);
    }
  }, [allDone]);

  const handleLeft = (id) => {
    if (matched[id]) return;
    setLeftPicked(id);
    speak(question.pairs.find((p) => p.left.id === id)?.left.label || '', { rate: 0.85 });
  };

  const handleRight = (id) => {
    if (!leftPicked) return;
    const pair = question.pairs.find((p) => p.right.id === id);
    if (pair && pair.left.id === leftPicked) {
      setMatched((m) => ({ ...m, [leftPicked]: id }));
      setLeftPicked(null);
      speak('Correct!', { rate: 0.88, pitch: 1.3 });
    } else {
      setWrong(id);
      speak('Try again!', { rate: 0.85, pitch: 1.1 });
      setTimeout(() => { setWrong(null); setLeftPicked(null); }, 900);
    }
  };

  const matchedRightIds = new Set(Object.values(matched));

  return (
    <div className="flex flex-col gap-3 w-full max-w-sm">
      <p className="text-white/70 font-bold text-sm text-center">Tap left, then tap its match on the right!</p>
      <div className="flex gap-3">
        <div className="flex-1 flex flex-col gap-2">
          {question.pairs.map((pair) => {
            const isMatched = !!matched[pair.left.id];
            const isPicked  = leftPicked === pair.left.id;
            return (
              <motion.button key={pair.left.id} whileTap={{ scale:0.9 }}
                onClick={() => !isMatched && handleLeft(pair.left.id)} disabled={isMatched}
                animate={{ scale: isPicked ? 1.05 : 1 }}
                className="rounded-2xl py-3 px-2 flex flex-col items-center justify-center border-2
                           text-white font-bold text-sm min-h-[60px] disabled:cursor-default"
                style={{
                  background: isMatched ? 'rgba(34,197,94,0.7)' : isPicked ? 'rgba(251,191,36,0.8)' : 'rgba(255,255,255,0.12)',
                  borderColor: isMatched ? 'rgba(134,239,172,0.9)' : isPicked ? 'rgba(251,191,36,0.9)' : 'rgba(255,255,255,0.25)',
                  boxShadow: isPicked ? '0 0 14px rgba(251,191,36,0.6)' : 'none',
                }}>
                <span className="text-xl">{pair.left.emoji}</span>
                {pair.left.label !== pair.left.emoji && <span className="text-xs mt-0.5 font-black">{pair.left.label}</span>}
                {isMatched && <span className="text-sm">✅</span>}
              </motion.button>
            );
          })}
        </div>
        <div className="flex flex-col gap-2 justify-around py-1">
          {question.pairs.map((_, i) => <div key={i} className="text-white/40 text-lg font-black">→</div>)}
        </div>
        <div className="flex-1 flex flex-col gap-2">
          {rightOrder.map((right) => {
            const isMatched = matchedRightIds.has(right.id);
            const isWrong   = wrong === right.id;
            return (
              <motion.button key={right.id} whileTap={{ scale:0.9 }}
                onClick={() => !isMatched && handleRight(right.id)} disabled={isMatched || !leftPicked}
                animate={{ x: isWrong ? [-6,6,-4,4,0] : 0 }} transition={{ duration:0.35 }}
                className="rounded-2xl py-3 px-2 flex flex-col items-center justify-center border-2
                           text-white font-bold text-sm min-h-[60px] disabled:cursor-default"
                style={{
                  background: isMatched ? 'rgba(34,197,94,0.7)' : isWrong ? 'rgba(239,68,68,0.7)' : 'rgba(255,255,255,0.12)',
                  borderColor: isMatched ? 'rgba(134,239,172,0.9)' : isWrong ? 'rgba(252,165,165,0.9)' : 'rgba(255,255,255,0.25)',
                }}>
                <span className="text-xl">{right.emoji}</span>
                {right.label !== right.emoji && right.label && <span className="text-xs mt-0.5 font-black">{right.label}</span>}
                {isMatched && <span className="text-sm">✅</span>}
              </motion.button>
            );
          })}
        </div>
      </div>
      <p className="text-center text-white/50 text-xs font-bold">{Object.keys(matched).length}/{total} matched</p>
    </div>
  );
}

// ── Recite card ───────────────────────────────────────────────────────────────
function ReciteCard({ question, onDone }) {
  const [spoken, setSpoken] = useState(false);
  const handleSpeak = () => {
    const text = question.lines.join('. ');
    speak(text, { rate: 0.78, pitch: 1.1 });
    setSpoken(true);
  };
  useEffect(() => {
    const t = setTimeout(handleSpeak, 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm">
      <motion.div initial={{ scale:0.8, opacity:0 }} animate={{ scale:1, opacity:1 }}
        className="bg-white/10 rounded-3xl px-5 py-5 w-full border border-white/20">
        <p className="text-white/60 text-xs font-bold uppercase tracking-wide mb-3 text-center">
          {question.emoji} {question.prompt}
        </p>
        {question.lines.map((line, i) => (
          <motion.p key={i} initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}
            transition={{ delay: i * 0.12 }}
            className="text-white font-bold text-base leading-relaxed text-center mb-1">
            {line}
          </motion.p>
        ))}
      </motion.div>

      <motion.button whileTap={{ scale:0.9 }} onClick={handleSpeak}
        className="bg-white/20 rounded-full px-6 py-3 text-white font-bold flex items-center gap-2 border border-white/30">
        🔊 Listen again
      </motion.button>

      <motion.button whileTap={{ scale:0.9 }}
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.6 }}
        onClick={onDone}
        className="w-full rounded-3xl py-4 text-white font-black text-lg border-2 border-white/30"
        style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
        ✅ I can say it! Next →
      </motion.button>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
function ExamPractice() {
  const navigate    = useNavigate();
  const { sectionId } = useParams();
  const { awardStars } = useApp();

  const section = ALL_SECTIONS.find((s) => s.id === sectionId);

  const [qIndex, setQIndex]       = useState(0);
  const [answered, setAnswered]   = useState(null);
  const [score, setScore]         = useState(0);
  const [showBurst, setShowBurst] = useState(false);
  const [done, setDone]           = useState(false);
  const [wrongHint, setWrongHint] = useState(false);

  const question = section?.questions[qIndex];
  const total    = section?.questions.length || 0;

  useEffect(() => {
    if (!question) return;
    if (question.type === 'recite') return;
    const t = setTimeout(() => speakQuestion(question), 400);
    return () => clearTimeout(t);
  }, [qIndex, question]);

  const speakQuestion = useCallback((q) => {
    if (!q) return;
    let text = q.question || q.prompt || '';
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
    setTimeout(() => { setAnswered(null); setWrongHint(false); speakQuestion(question); }, 2200);
  };

  const handleMCQAnswer    = (opt) => { if (answered) return; setAnswered(opt.id); opt.correct ? handleCorrect() : handleWrong(); };
  const handleCountAnswer  = (val) => { if (answered) return; setAnswered(val);    val === question.answer ? handleCorrect() : handleWrong(); };
  const handleTFAnswer     = (val) => { if (answered) return; setAnswered(val);    val === String(question.answer) ? handleCorrect() : handleWrong(); };
  const handleCircleAnswer = (opt) => { if (answered) return; setAnswered(opt.id); opt.correct ? handleCorrect() : handleWrong(); };
  const handleMatchDone    = () => handleCorrect();
  const handleReciteDone   = () => { awardStars(1); advanceQuestion(); };

  const advanceQuestion = () => {
    const next = qIndex + 1;
    if (next >= total) {
      setDone(true);
      const pct = Math.round(((score + 1) / total) * 100);
      speak(pct === 100 ? 'Perfect! You are ready for the exam!' : 'Great practice! Keep it up!', { rate: 0.82, pitch: 1.2 });
    } else {
      setAnswered(null);
      setQIndex(next);
    }
  };

  const handleBurstDone = () => { setShowBurst(false); advanceQuestion(); };

  if (!section) {
    return (
      <div className="min-h-screen flex items-center justify-center"
           style={{ background: 'linear-gradient(135deg,#1a0533,#2d1b69)' }}>
        <div className="text-white text-center">
          <p className="text-5xl mb-4">🤔</p>
          <p className="font-bold text-xl">Section not found!</p>
          <button onClick={() => navigate('/exam')}
            className="mt-6 btn-toddler text-white px-6 py-3"
            style={{ background: 'linear-gradient(135deg,#a855f7,#7c3aed)' }}>Go Back</button>
        </div>
      </div>
    );
  }

  const sectionColor = section.color;

  // ── DONE ──────────────────────────────────────────────────────────────────
  if (done) {
    const pct   = Math.round((score / total) * 100);
    const emoji = pct === 100 ? '🏆' : pct >= 70 ? '🌟' : '💪';
    const grade = pct === 100 ? 'A+' : pct >= 80 ? 'A' : pct >= 60 ? 'B' : 'C';
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 gap-6"
           style={{ background: `linear-gradient(160deg, ${sectionColor}cc, #1a0533)` }}>
        <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', stiffness:200 }} className="text-9xl">{emoji}</motion.div>
        <motion.h1 initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="text-white font-black text-3xl text-center">Practice Done! 🎉</motion.h1>
        <motion.div initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.3 }}
          className="bg-white/20 rounded-3xl px-10 py-6 text-center w-full max-w-sm">
          <p className="text-yellow-300 font-black text-5xl">{score}/{total}</p>
          <p className="text-white font-bold text-2xl mt-2">Grade: {grade}</p>
          <p className="text-white/80 mt-3 text-base">{pct === 100 ? 'You are ready for the exam!' : 'Keep practising — you can do it!'}</p>
        </motion.div>
        <div className="flex flex-wrap gap-4 justify-center">
          <motion.button whileTap={{ scale:0.9 }}
            onClick={() => { setScore(0); setQIndex(0); setAnswered(null); setDone(false); }}
            className="btn-toddler text-white text-lg px-8 py-4"
            style={{ background:'linear-gradient(135deg,#22c55e,#16a34a)' }}>🔄 Try Again</motion.button>
          <motion.button whileTap={{ scale:0.9 }}
            onClick={() => { stop(); navigate('/exam'); }}
            className="btn-toddler text-white text-lg px-8 py-4"
            style={{ background:'linear-gradient(135deg,#a855f7,#7c3aed)' }}>🎯 Exam Hub</motion.button>
          <motion.button whileTap={{ scale:0.9 }}
            onClick={() => { stop(); navigate('/'); }}
            className="btn-toddler text-white text-lg px-8 py-4"
            style={{ background:'linear-gradient(135deg,#f97316,#ea580c)' }}>🏠 Home</motion.button>
        </div>
      </div>
    );
  }

  if (!question) return null;

  // ── QUESTION SCREEN ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col"
         style={{ background: `linear-gradient(160deg, ${sectionColor}cc 0%, #1a0533 55%, #0f172a 100%)` }}>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/20 backdrop-blur-sm sticky top-0 z-50 shadow-lg">
        <motion.button whileTap={{ scale:0.85 }} onClick={() => { stop(); navigate('/exam'); }}
          className="w-12 h-12 rounded-2xl bg-white/30 flex items-center justify-center text-2xl shadow-md border-2 border-white/40">
          ⬅️
        </motion.button>
        <div className="text-center flex-1 mx-2">
          <h1 className="text-white font-black text-base leading-tight">{section.emoji} {section.subject}</h1>
          <p className="text-white/60 text-xs font-semibold">Exam Prep · 1st Unit Test</p>
        </div>
        <div className="bg-white/20 rounded-2xl px-3 py-1.5 text-white font-black text-sm">{qIndex + 1}/{total}</div>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-1.5 py-2 px-4 flex-wrap">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className="rounded-full transition-all duration-300"
            style={{
              width: i === qIndex ? 18 : 9, height: 9,
              background: i < qIndex ? 'rgba(134,239,172,0.9)' : i === qIndex ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.25)',
            }} />
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
        {question.type !== 'recite' && (
          <motion.button whileTap={{ scale:0.85 }} onClick={() => speakQuestion(question)}
            className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center text-xl">
            🔊
          </motion.button>
        )}
      </div>

      {/* Question area */}
      <main className="flex-1 flex flex-col items-center px-4 py-3 gap-4">
        <AnimatePresence mode="wait">
          <motion.div key={qIndex}
            initial={{ opacity:0, scale:0.85 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.85 }}
            transition={{ duration:0.2 }} className="w-full max-w-sm">

            {/* Recite */}
            {question.type === 'recite' && (
              <ReciteCard question={question} onDone={handleReciteDone} />
            )}

            {/* All other types — show question text box */}
            {question.type !== 'recite' && question.type !== 'circle_letter' && (
              <div className="bg-white/10 rounded-3xl px-5 py-4 mb-3 text-center">
                <p className="text-white/60 text-xs font-bold uppercase tracking-wide mb-1">Question {qIndex + 1}</p>
                <p className="text-white font-black text-lg leading-snug">{question.question}</p>
                {question.type === 'count' && <CountDisplay emoji={question.emoji} count={question.count} />}
              </div>
            )}

            {/* Hint */}
            {wrongHint && question.hint && question.type !== 'match' && (
              <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
                className="bg-orange-400/80 rounded-2xl px-4 py-2 text-white font-bold text-sm text-center mb-2">
                💡 Hint: {question.hint}
              </motion.div>
            )}

            {/* MCQ / image_mcq */}
            {(question.type === 'mcq' || question.type === 'image_mcq') && (
              <div className="grid grid-cols-2 gap-3">
                {question.options.map((opt, i) => (
                  <OptionBtn key={opt.id} opt={opt} index={i} answered={answered} onPick={() => handleMCQAnswer(opt)} isCount={false} />
                ))}
              </div>
            )}

            {/* Count */}
            {question.type === 'count' && (
              <div className="grid grid-cols-2 gap-3">
                {question.options.map((opt, i) => (
                  <OptionBtn key={opt} opt={opt} index={i} answered={answered} onPick={() => handleCountAnswer(opt)} isCount={true} correctVal={question.answer} />
                ))}
              </div>
            )}

            {/* True/False */}
            {question.type === 'truefalse' && <TrueFalseQ question={question} answered={answered} onAnswer={handleTFAnswer} />}

            {/* Circle letter */}
            {question.type === 'circle_letter' && <CircleLetterQ question={question} answered={answered} onAnswer={handleCircleAnswer} />}

            {/* Match */}
            {question.type === 'match' && <MatchQ key={qIndex} question={question} onAllMatched={handleMatchDone} />}

          </motion.div>
        </AnimatePresence>
      </main>

      <StarBurst visible={showBurst} message="Correct! ⭐" onDone={handleBurstDone} />
      <MusicToggle />
    </div>
  );
}

export default ExamPractice;
