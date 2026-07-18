import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext.jsx';
import { speak, stop } from '../../utils/speech.js';
import MusicToggle from '../../components/MusicToggle.jsx';
import StarBurst from '../../components/StarBurst.jsx';

const TRACE_MODES = [
  { id: 'numbers', title: 'Numbers', emoji: '🔢', color: '#EF4444', description: 'Trace 1 to 10' },
  { id: 'alphabets', title: 'Alphabets', emoji: '🔤', color: '#7C3AED', description: 'Trace A to Z' },
];

const NUMBER_ITEMS = Array.from({ length: 10 }, (_, i) => ({
  id: `n${i + 1}`,
  display: String(i + 1),
  speak: `Number ${i + 1}. Trace the number ${i + 1}!`,
  color: '#EF4444',
}));

const ALPHA_ITEMS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((l) => ({
  id: `l${l}`,
  display: l,
  speak: `Letter ${l}. Trace the letter ${l}!`,
  color: '#7C3AED',
}));

const BRUSH_COLORS = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#FF6FC8', '#FFB347'];

function TraceGame() {
  const navigate = useNavigate();
  const { awardStars, recordGameCompleted } = useApp();

  const [mode, setMode] = useState(null);
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [brushColor, setBrushColor] = useState(BRUSH_COLORS[0]);
  const [brushSize, setBrushSize] = useState(14);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [showBurst, setShowBurst] = useState(false);
  const [doneCount, setDoneCount] = useState(0);

  const canvasRef = useRef(null);
  const lastPos = useRef(null);

  const currentItem = items[currentIndex];

  useEffect(() => {
    if (!mode) return;
    const list = mode === 'numbers' ? NUMBER_ITEMS : ALPHA_ITEMS;
    setItems(list);
    setCurrentIndex(0);
    setDoneCount(0);
    setHasDrawn(false);
    speak(`Let\'s trace ${mode === 'numbers' ? 'numbers' : 'letters'}! Trace with your finger!`, { rate: 0.82 });
  }, [mode]);

  useEffect(() => {
    if (currentItem) {
      clearCanvas();
      setHasDrawn(false);
      setTimeout(() => speak(currentItem.speak, { rate: 0.78, pitch: 1.1 }), 300);
    }
  }, [currentIndex, currentItem]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    lastPos.current = null;
  };

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if (e.touches) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDraw = useCallback((e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsDrawing(true);
    setHasDrawn(true);
    lastPos.current = getPos(e, canvas);
  }, []);

  const draw = useCallback((e) => {
    e.preventDefault();
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e, canvas);

    ctx.beginPath();
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = 0.95;

    if (lastPos.current) {
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
    lastPos.current = pos;
  }, [isDrawing, brushColor, brushSize]);

  const endDraw = useCallback((e) => {
    e.preventDefault();
    setIsDrawing(false);
    lastPos.current = null;
  }, []);

  const handleNext = () => {
    if (!hasDrawn) return;
    awardStars(1);
    setShowBurst(true);
    setDoneCount((d) => d + 1);
  };

  const handleBurstDone = () => {
    setShowBurst(false);
    const nextIndex = currentIndex + 1;
    if (nextIndex >= items.length) {
      speak('Amazing! You traced them all! You are a little artist, Veera!', { rate: 0.82, pitch: 1.2 });
      recordGameCompleted('trace');
      setTimeout(() => navigate('/games'), 2500);
    } else {
      setCurrentIndex(nextIndex);
    }
  };

  // Mode selector
  if (!mode) {
    return (
      <div className="min-h-screen flex flex-col"
           style={{ background: 'linear-gradient(135deg, #1a0533, #2d1b69, #1e3a5f)' }}>
        <div className="flex items-center justify-between px-4 py-4 bg-white/10">
          <motion.button whileTap={{ scale: 0.85 }} onClick={() => navigate('/games')}
                         className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center text-2xl">
            ⬅️
          </motion.button>
          <h1 className="text-white font-black text-xl">✏️ Trace &amp; Draw</h1>
          <div className="w-11" />
        </div>
        <main className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
          <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className="text-white font-bold text-xl text-center">
            What would you like to trace?
          </motion.p>
          <div className="grid grid-cols-2 gap-5 w-full max-w-sm">
            {TRACE_MODES.map((m, i) => (
              <motion.button
                key={m.id}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, type: 'spring', stiffness: 250 }}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05, y: -4 }}
                onClick={() => { speak(`Let\'s trace ${m.title}!`, { rate: 0.85 }); setMode(m.id); }}
                className="module-card text-white py-8"
                style={{
                  background: `linear-gradient(135deg, ${m.color}ee, ${m.color}99)`,
                  boxShadow: `0 6px 20px ${m.color}44`,
                }}
              >
                <span className="text-5xl mb-3 block">{m.emoji}</span>
                <span className="font-black text-lg">{m.title}</span>
                <span className="text-white/70 text-xs mt-1">{m.description}</span>
              </motion.button>
            ))}
          </div>
        </main>
        <MusicToggle />
      </div>
    );
  }

  if (!currentItem) return null;

  const modeColor = mode === 'numbers' ? '#EF4444' : '#7C3AED';

  return (
    <div className="min-h-screen flex flex-col"
         style={{ background: `linear-gradient(160deg, ${modeColor}cc 0%, #1a0533 55%, #0f172a 100%)` }}>
      <div className="flex items-center justify-between px-4 py-3 bg-white/20 backdrop-blur-sm sticky top-0 z-50 shadow-lg">
        <motion.button whileTap={{ scale: 0.85 }} onClick={() => { stop(); setMode(null); }}
                       className="w-12 h-12 rounded-2xl bg-white/30 flex items-center justify-center text-2xl shadow-md border-2 border-white/40">
          ⬅️
        </motion.button>
        <h1 className="text-white font-black text-lg text-center flex-1 mx-2">
          ✏️ Trace {mode === 'numbers' ? 'Numbers' : 'Alphabets'}
        </h1>
        <div className="bg-white/20 rounded-2xl px-3 py-1.5 text-white font-black text-sm">
          {currentIndex + 1}/{items.length}
        </div>
      </div>

      <main className="flex-1 flex flex-col items-center px-4 py-3 gap-3">
        {/* Template + canvas */}
        <div className="relative w-full max-w-xs mx-auto" style={{ touchAction: 'none' }}>
          {/* Template character behind canvas */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
               style={{ zIndex: 1 }}>
            <span
              className="font-black select-none"
              style={{
                fontSize: '9rem',
                color: 'rgba(255,255,255,0.12)',
                lineHeight: 1,
                userSelect: 'none',
              }}
            >
              {currentItem.display}
            </span>
          </div>
          {/* Drawing canvas */}
          <canvas
            ref={canvasRef}
            width={320}
            height={300}
            className="relative rounded-3xl border-2 border-white/30 w-full cursor-crosshair"
            style={{
              zIndex: 2,
              background: 'rgba(255,255,255,0.05)',
              touchAction: 'none',
            }}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={endDraw}
          />
        </div>

        {/* Speak button */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={() => speak(currentItem.speak, { rate: 0.78, pitch: 1.1 })}
          className="bg-white/20 rounded-full px-5 py-2 text-white font-bold text-sm flex items-center gap-2"
        >
          🔊 Hear it again
        </motion.button>

        {/* Colour picker */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <span className="text-white/60 text-xs font-bold">Colour:</span>
          {BRUSH_COLORS.map((c) => (
            <motion.button
              key={c}
              whileTap={{ scale: 0.85 }}
              onClick={() => setBrushColor(c)}
              className="w-8 h-8 rounded-full border-2 transition-all"
              style={{
                backgroundColor: c,
                borderColor: brushColor === c ? 'white' : 'transparent',
                boxShadow: brushColor === c ? `0 0 0 2px ${c}` : 'none',
              }}
            />
          ))}
        </div>

        {/* Size picker */}
        <div className="flex items-center gap-3">
          <span className="text-white/60 text-xs font-bold">Size:</span>
          {[8, 14, 22].map((s) => (
            <motion.button
              key={s}
              whileTap={{ scale: 0.85 }}
              onClick={() => setBrushSize(s)}
              className="flex items-center justify-center rounded-full border-2 border-white/30 bg-white/10 transition-all"
              style={{
                width: s + 14, height: s + 14,
                borderColor: brushSize === s ? 'white' : 'rgba(255,255,255,0.3)',
              }}
            >
              <div className="rounded-full bg-white" style={{ width: s, height: s }} />
            </motion.button>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-1">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={clearCanvas}
            className="btn-toddler text-white text-sm px-5 py-3"
            style={{ background: 'linear-gradient(135deg, #9CA3AF, #6B7280)' }}
          >
            🗑️ Clear
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleNext}
            disabled={!hasDrawn}
            className="btn-toddler text-white text-sm px-5 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: hasDrawn
              ? 'linear-gradient(135deg, #22c55e, #16a34a)'
              : 'rgba(255,255,255,0.1)' }}
          >
            {currentIndex + 1 >= items.length ? '🎉 Finish' : '➡️ Next'}
          </motion.button>
        </div>
      </main>

      <StarBurst visible={showBurst} message="Great tracing! ⭐" onDone={handleBurstDone} />
      <MusicToggle />
    </div>
  );
}

export default TraceGame;
