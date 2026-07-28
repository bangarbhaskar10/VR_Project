import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { speak } from '../utils/speech.js';
import { EXAM_TIMETABLE, ORAL_SECTIONS, WRITTEN_SECTIONS } from '../data/examData.js';
import Header from '../components/Header.jsx';
import MusicToggle from '../components/MusicToggle.jsx';
import FloatingEmojis from '../components/FloatingEmojis.jsx';

const BG = 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0c2340 100%)';

const DAYS_LEFT = (() => {
  const exam = new Date('2026-08-10');
  const today = new Date();
  const diff = Math.ceil((exam - today) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
})();

function ExamHub() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('timetable'); // 'timetable' | 'oral' | 'written'

  return (
    <div className="min-h-screen flex flex-col" style={{ background: BG }}>
      <FloatingEmojis emojis={['📝', '✏️', '📚', '🎯', '🏆', '⭐', '📐', '🔢']} count={10} />

      <Header title="🎯 Exam Prep" showBack backTo="/" />

      {/* Countdown badge */}
      {DAYS_LEFT > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mt-2 bg-red-500/80 rounded-2xl px-4 py-2 text-white font-black text-sm text-center shadow-lg"
        >
          🗓️ Exam starts in {DAYS_LEFT} days! — 10th August 2026
        </motion.div>
      )}

      {/* Tab bar */}
      <div className="flex gap-2 px-4 mt-4 mb-2">
        {[
          { id: 'timetable', label: '🗓️ Timetable' },
          { id: 'oral',      label: '🗣️ Oral'      },
          { id: 'written',   label: '✍️ Written'   },
        ].map((t) => (
          <motion.button
            key={t.id}
            whileTap={{ scale: 0.93 }}
            onClick={() => setTab(t.id)}
            className="flex-1 rounded-2xl py-2.5 font-black text-sm border-2 transition-all"
            style={{
              background: tab === t.id ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)',
              borderColor: tab === t.id ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.1)',
              color: 'white',
            }}
          >
            {t.label}
          </motion.button>
        ))}
      </div>

      <main className="flex-1 px-4 py-3 relative z-10 overflow-y-auto">
        <AnimatePresence mode="wait">

          {/* ── TIMETABLE ── */}
          {tab === 'timetable' && (
            <motion.div key="tt" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <p className="text-white/70 font-bold text-sm text-center mb-3">
                Little Master's Pre School · Nursery · 1st Unit Test 2026-27
              </p>
              <div className="flex flex-col gap-2 max-w-md mx-auto">
                {EXAM_TIMETABLE.map((row, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 border border-white/10"
                    style={{ background: `${row.color}22` }}
                  >
                    <span className="text-2xl">{row.emoji}</span>
                    <div className="flex-1">
                      <p className="text-white font-black text-sm">{row.subject}</p>
                      <p className="text-white/50 text-xs">{row.date}</p>
                    </div>
                    <span
                      className="text-xs font-black rounded-full px-3 py-1"
                      style={{
                        background: row.type === 'oral' ? 'rgba(16,185,129,0.3)' : 'rgba(139,92,246,0.3)',
                        color: row.type === 'oral' ? '#6ee7b7' : '#c4b5fd',
                      }}
                    >
                      {row.type === 'oral' ? '🗣️ Oral' : '✍️ Written'}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── ORAL PRACTICE ── */}
          {tab === 'oral' && (
            <motion.div key="oral" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <p className="text-white/70 font-bold text-sm text-center mb-3">
                Tap a subject to practise
              </p>
              <div className="flex flex-col gap-3 max-w-md mx-auto">
                {ORAL_SECTIONS.map((sec, i) => (
                  <motion.button
                    key={sec.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ y: -3 }}
                    onClick={() => {
                      speak(`Let's practise ${sec.subject}!`, { rate: 0.85 });
                      navigate(`/exam/${sec.id}`);
                    }}
                    className="flex items-center gap-4 rounded-3xl px-5 py-4 text-white text-left shadow-xl"
                    style={{
                      background: `linear-gradient(135deg, ${sec.color}cc, ${sec.color}77)`,
                      boxShadow: `0 6px 20px ${sec.color}44`,
                    }}
                  >
                    <span className="text-4xl">{sec.emoji}</span>
                    <div className="flex-1">
                      <p className="font-black text-lg">{sec.subject}</p>
                      <p className="text-white/70 text-xs mt-0.5">{sec.description}</p>
                      <p className="text-white/50 text-xs mt-0.5">{sec.questions.length} questions</p>
                    </div>
                    <span className="text-2xl text-white/40">›</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── WRITTEN PRACTICE ── */}
          {tab === 'written' && (
            <motion.div key="written" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <p className="text-white/70 font-bold text-sm text-center mb-3">
                Practice paper-pattern questions
              </p>
              <div className="flex flex-col gap-4 max-w-md mx-auto">
                {WRITTEN_SECTIONS.map((sec, i) => (
                  <motion.div
                    key={sec.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="rounded-3xl overflow-hidden shadow-xl"
                    style={{ background: `linear-gradient(135deg, ${sec.color}cc, ${sec.color}66)` }}
                  >
                    {/* Header */}
                    <div className="px-5 pt-4 pb-2">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-4xl">{sec.emoji}</span>
                        <div>
                          <p className="font-black text-white text-lg">{sec.subject}</p>
                          <p className="text-white/60 text-xs">{sec.questions.length} questions</p>
                        </div>
                      </div>
                      {/* Paper pattern list */}
                      <div className="bg-black/20 rounded-2xl px-4 py-3 mb-3">
                        <p className="text-white/80 font-black text-xs mb-2 uppercase tracking-wide">Paper Pattern</p>
                        {sec.paperPattern.map((p, j) => (
                          <p key={j} className="text-white/70 text-xs leading-relaxed">{p}</p>
                        ))}
                      </div>
                    </div>
                    <div className="px-5 pb-4">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          speak(`Let's practise ${sec.subject}!`, { rate: 0.85 });
                          navigate(`/exam/${sec.id}`);
                        }}
                        className="w-full rounded-2xl py-3 bg-white/20 text-white font-black text-base
                                   border border-white/30 hover:bg-white/30 transition-colors"
                      >
                        ✏️ Start Practice
                      </motion.button>
                    </div>
                  </motion.div>
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

export default ExamHub;
