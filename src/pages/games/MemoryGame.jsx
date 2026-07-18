import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext.jsx';
import { loadGamePool } from '../../data/modules.js';
import { speak, stop } from '../../utils/speech.js';
import { shuffle, pickRandom } from '../../utils/helpers.js';
import StarBurst from '../../components/StarBurst.jsx';
import MusicToggle from '../../components/MusicToggle.jsx';

const NUM_PAIRS = 6;
const GAME_COLOR = '#8B5CF6';

function MemoryGame() {
  const navigate = useNavigate();
  const { language, awardStars, recordGameCompleted } = useApp();

  const [pool, setPool] = useState([]);
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [moves, setMoves] = useState(0);
  const [pairsFound, setPairsFound] = useState(0);
  const [canFlip, setCanFlip] = useState(true);
  const [gameDone, setGameDone] = useState(false);
  const [showBurst, setShowBurst] = useState(false);
  const [loading, setLoading] = useState(true);

  const totalPairs = cards.length / 2;

  // Build a fresh board from a random selection of the mixed pool
  const dealCards = useCallback((sourcePool) => {
    const items = pickRandom(sourcePool, NUM_PAIRS);
    const paired = [...items, ...items].map((item, i) => ({
      ...item,
      cardId: `${item.id}-${i < items.length ? 'a' : 'b'}`,
      isFlipped: false,
      isMatched: false,
    }));
    setCards(shuffle(paired));
    setFlippedIndices([]);
    setMoves(0);
    setPairsFound(0);
    setGameDone(false);
    setCanFlip(true);
  }, []);

  // Load the mixed pool once on mount
  useEffect(() => {
    stop();
    loadGamePool().then((data) => {
      setPool(data);
      dealCards(data);
      setLoading(false);
      speak("Let's play the memory game! Find the matching pairs!", { rate: 0.9 });
    });
  }, [dealCards]);

  const handleCardClick = (index) => {
    if (!canFlip) return;
    if (cards[index].isFlipped || cards[index].isMatched) return;

    const newCards = cards.map((c, i) =>
      i === index ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);

    if (flippedIndices.length === 0) {
      setFlippedIndices([index]);
      return;
    }

    const firstIndex = flippedIndices[0];
    setFlippedIndices([]);
    setMoves((m) => m + 1);
    setCanFlip(false);

    if (newCards[firstIndex].id === newCards[index].id) {
      const matchedCards = newCards.map((c, i) =>
        i === firstIndex || i === index ? { ...c, isMatched: true } : c
      );
      setCards(matchedCards);
      awardStars(1);
      setShowBurst(true);
      const newPairsFound = pairsFound + 1;
      setPairsFound(newPairsFound);
      setCanFlip(true);

      if (newPairsFound >= totalPairs) {
        setTimeout(() => {
          setGameDone(true);
          speak('Amazing! You found all the pairs! You are so clever, Veera!', { rate: 0.9, pitch: 1.1 });
          recordGameCompleted('memory');
          awardStars(5);
        }, 600);
      }
    } else {
      speak('Try again!', { rate: 0.95, pitch: 1.1 });
      setTimeout(() => {
        setCards(newCards.map((c, i) =>
          i === firstIndex || i === index ? { ...c, isFlipped: false } : c
        ));
        setCanFlip(true);
      }, 1000);
    }
  };

  const restartGame = () => dealCards(pool);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
           style={{ background: `linear-gradient(135deg, ${GAME_COLOR}, #1a0533)` }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8 }}
                    className="text-7xl">🃏</motion.div>
      </div>
    );
  }

  if (gameDone) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 gap-6"
           style={{ background: `linear-gradient(160deg, ${GAME_COLOR}cc, #1a0533)` }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }} className="text-9xl">
          🏆
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                   className="text-white font-black text-3xl text-center">
          You found all pairs!
        </motion.h1>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/20 rounded-3xl px-10 py-6 text-center">
          <p className="text-yellow-300 font-black text-4xl">{totalPairs}/{totalPairs} pairs</p>
          <p className="text-white font-bold text-lg mt-1">in {moves} moves 🎉</p>
          <p className="text-white/80 mt-2">+{totalPairs + 5} ⭐ stars earned!</p>
        </motion.div>
        <div className="flex flex-wrap gap-4 justify-center">
          <motion.button whileTap={{ scale: 0.9 }} onClick={restartGame}
                         className="btn-toddler text-white"
                         style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
            🔄 New Cards
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
         style={{ background: `linear-gradient(160deg, ${GAME_COLOR}cc 0%, #1a0533 55%, #0f172a 100%)` }}>
      <div className="flex items-center justify-between px-4 py-3 bg-white/20 backdrop-blur-sm sticky top-0 z-50 shadow-lg">
        <motion.button whileTap={{ scale: 0.85 }} onClick={() => { stop(); navigate('/games'); }}
                       className="w-12 h-12 rounded-2xl bg-white/30 flex items-center justify-center text-2xl shadow-md border-2 border-white/40">
          ⬅️
        </motion.button>
        <h1 className="text-white font-black text-lg text-center flex-1 mx-2">
          🃏 {language === 'mr' ? 'स्मृती खेळ' : 'Memory Game'}
        </h1>
        <div className="bg-white/20 rounded-2xl px-3 py-1.5 text-white font-black text-sm text-center">
          <div>{pairsFound}/{totalPairs}</div>
          <div className="text-white/60 text-xs">pairs</div>
        </div>
      </div>

      <div className="flex justify-between items-center px-6 py-2">
        <div className="bg-white/10 rounded-full px-4 py-1.5 text-white font-bold text-sm">
          🃏 {moves} moves
        </div>
        <div className="bg-yellow-500/30 rounded-full px-4 py-1.5 text-yellow-300 font-bold text-sm">
          ⭐ {pairsFound} pairs
        </div>
      </div>

      <main className="flex-1 flex items-center justify-center px-3 py-2">
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 w-full max-w-sm">
          {cards.map((card, index) => (
            <motion.button
              key={card.cardId}
              onClick={() => handleCardClick(index)}
              whileTap={!card.isFlipped && !card.isMatched ? { scale: 0.9 } : {}}
              animate={card.isMatched ? { scale: [1, 1.12, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
              className="aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 shadow-lg border-2 cursor-pointer select-none"
              style={{
                borderColor: card.isMatched ? 'rgba(134,239,172,0.8)' : 'rgba(255,255,255,0.2)',
                background: card.isFlipped || card.isMatched
                  ? `linear-gradient(135deg, ${card.color || GAME_COLOR}cc, ${card.color || GAME_COLOR}66)`
                  : 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              }}
            >
              <AnimatePresence mode="wait">
                {card.isFlipped || card.isMatched ? (
                  <motion.div
                    key="front"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col items-center gap-0.5"
                  >
                    <span className="text-3xl leading-none">{card.emoji}</span>
                    <span className="text-[10px] font-black text-white/90 text-center leading-tight px-1">
                      {language === 'mr' ? card.marathiWord : card.word}
                    </span>
                    {card.isMatched && <span className="text-base">✅</span>}
                  </motion.div>
                ) : (
                  <motion.span
                    key="back"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="text-3xl"
                  >
                    ❓
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>
      </main>

      <StarBurst visible={showBurst} message="Match! ⭐ Great job!" onDone={() => setShowBurst(false)} />
      <MusicToggle />
    </div>
  );
}

export default MemoryGame;
