import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, RotateCcw, Trophy, Zap, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { arcadeAudio } from './ArcadeSoundEngine';

interface CandyCrushProps {
  soundOn: boolean;
}

interface CandyCell {
  id: string; // unique key for animations
  type: string;
  isSpecial?: 'striped-h' | 'striped-v' | 'bomb';
  isPopping?: boolean;
}

const CANDY_TYPES = [
  { id: 'red', icon: '🍓', color: 'from-rose-500 to-red-600', name: 'Strawberry', glow: '#f43f5e' },
  { id: 'blue', icon: '🫐', color: 'from-blue-500 to-indigo-600', name: 'Blueberry', glow: '#38bdf8' },
  { id: 'orange', icon: '🍊', color: 'from-amber-500 to-orange-600', name: 'Orange', glow: '#f97316' },
  { id: 'green', icon: '🍏', color: 'from-emerald-500 to-green-600', name: 'Apple', glow: '#10b981' },
  { id: 'purple', icon: '🍇', color: 'from-purple-500 to-fuchsia-600', name: 'Grape', glow: '#c084fc' },
  { id: 'yellow', icon: '🍋', color: 'from-yellow-400 to-amber-500', name: 'Lemon', glow: '#facc15' }
];

const GRID_SIZE = 7;
const TARGET_SCORE = 1200;
const MAX_MOVES = 22;

export const CandyCrushGame: React.FC<CandyCrushProps> = ({ soundOn }) => {
  const [board, setBoard] = useState<CandyCell[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>(null);
  const [score, setScore] = useState<number>(0);
  const [movesLeft, setMovesLeft] = useState<number>(MAX_MOVES);
  const [isLevelCleared, setIsLevelCleared] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [comboBanner, setComboBanner] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  useEffect(() => {
    arcadeAudio.soundEnabled = soundOn;
  }, [soundOn]);

  const getRandomCandyType = () => {
    return CANDY_TYPES[Math.floor(Math.random() * CANDY_TYPES.length)].id;
  };

  const createInitialBoard = () => {
    const newBoard: CandyCell[][] = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      newBoard[r] = [];
      for (let c = 0; c < GRID_SIZE; c++) {
        let type = getRandomCandyType();
        while (
          (c >= 2 && newBoard[r][c - 1].type === type && newBoard[r][c - 2].type === type) ||
          (r >= 2 && newBoard[r - 1][c].type === type && newBoard[r - 2][c].type === type)
        ) {
          type = getRandomCandyType();
        }
        newBoard[r][c] = {
          id: `candy-${r}-${c}-${Math.random()}`,
          type
        };
      }
    }
    return newBoard;
  };

  const initGame = () => {
    setBoard(createInitialBoard());
    setScore(0);
    setMovesLeft(MAX_MOVES);
    setIsLevelCleared(false);
    setIsGameOver(false);
    setSelectedCell(null);
    setComboBanner(null);
    setIsAnimating(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const showComboText = (combo: number) => {
    const praises = ['Sweet! 🍬', 'Tasty! ✨', 'Delicious! 🍓', 'Sugar Rush! ⚡', 'DIVINE! 👑'];
    const text = praises[Math.min(combo - 1, praises.length - 1)];
    setComboBanner(text);
    setTimeout(() => {
      setComboBanner(null);
    }, 1200);
  };

  // Find 3+ matches
  const checkMatches = (currentBoard: CandyCell[][]) => {
    const matches: { r: number; c: number }[] = [];

    // Horizontal
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE - 2; c++) {
        const type = currentBoard[r][c].type;
        if (type && currentBoard[r][c + 1].type === type && currentBoard[r][c + 2].type === type) {
          matches.push({ r, c }, { r, c: c + 1 }, { r, c: c + 2 });
          let extra = c + 3;
          while (extra < GRID_SIZE && currentBoard[r][extra].type === type) {
            matches.push({ r, c: extra });
            extra++;
          }
        }
      }
    }

    // Vertical
    for (let c = 0; c < GRID_SIZE; c++) {
      for (let r = 0; r < GRID_SIZE - 2; r++) {
        const type = currentBoard[r][c].type;
        if (type && currentBoard[r + 1][c].type === type && currentBoard[r + 2][c].type === type) {
          matches.push({ r, c }, { r: r + 1, c }, { r: r + 2, c });
          let extra = r + 3;
          while (extra < GRID_SIZE && currentBoard[extra][c].type === type) {
            matches.push({ r: extra, c });
            extra++;
          }
        }
      }
    }

    return Array.from(new Set(matches.map((m) => `${m.r},${m.c}`))).map((str) => {
      const [r, c] = str.split(',').map(Number);
      return { r, c };
    });
  };

  // Step-by-step animated resolution loop
  const executeMatchesAndCascade = async (initialBoard: CandyCell[][], currentScore: number, combo = 1) => {
    setIsAnimating(true);
    let current = initialBoard.map((row) => [...row]);
    const matches = checkMatches(current);

    if (matches.length === 0) {
      setIsAnimating(false);
      return;
    }

    // Play Pop sound
    arcadeAudio.playCandyPop(combo);
    if (combo >= 2) {
      showComboText(combo);
    }

    // Mark matched cells as popping
    const poppingBoard = current.map((row, r) =>
      row.map((cell, c) => {
        if (matches.some((m) => m.r === r && m.c === c)) {
          return { ...cell, isPopping: true };
        }
        return cell;
      })
    );
    setBoard(poppingBoard);

    // Wait for pop animation
    await new Promise((res) => setTimeout(res, 220));

    // Calculate score
    const gained = matches.length * 35 * combo;
    const nextScore = currentScore + gained;
    setScore(nextScore);

    // Drop logic
    const nextBoard: (CandyCell | null)[][] = poppingBoard.map((row) =>
      row.map((cell) => (cell.isPopping ? null : cell))
    );

    for (let c = 0; c < GRID_SIZE; c++) {
      let emptyRow = GRID_SIZE - 1;
      for (let r = GRID_SIZE - 1; r >= 0; r--) {
        if (nextBoard[r][c] !== null) {
          if (emptyRow !== r) {
            nextBoard[emptyRow][c] = nextBoard[r][c];
            nextBoard[r][c] = null;
          }
          emptyRow--;
        }
      }
      // Fill from top with fresh candies
      while (emptyRow >= 0) {
        nextBoard[emptyRow][c] = {
          id: `candy-new-${emptyRow}-${c}-${Date.now()}-${Math.random()}`,
          type: getRandomCandyType()
        };
        emptyRow--;
      }
    }

    const settledBoard = nextBoard as CandyCell[][];
    setBoard(settledBoard);

    // Wait for fall drop easing
    await new Promise((res) => setTimeout(res, 260));

    // Check for cascade matches
    const furtherMatches = checkMatches(settledBoard);
    if (furtherMatches.length > 0) {
      await executeMatchesAndCascade(settledBoard, nextScore, combo + 1);
    } else {
      setIsAnimating(false);
      if (nextScore >= TARGET_SCORE) {
        setIsLevelCleared(true);
        arcadeAudio.playVictory();
        confetti({ particleCount: 80, spread: 90 });
      }
    }
  };

  const handleCellClick = async (r: number, c: number) => {
    if (isAnimating || movesLeft <= 0 || isLevelCleared || isGameOver) return;

    if (!selectedCell) {
      setSelectedCell({ r, c });
      arcadeAudio.playSlide();
      return;
    }

    // Check adjacency
    const dist = Math.abs(selectedCell.r - r) + Math.abs(selectedCell.c - c);
    if (dist === 1) {
      // Perform swap
      const swapped = board.map((row) => [...row]);
      const temp = swapped[selectedCell.r][selectedCell.c];
      swapped[selectedCell.r][selectedCell.c] = swapped[r][c];
      swapped[r][c] = temp;

      setBoard(swapped);
      arcadeAudio.playSlide();

      const matches = checkMatches(swapped);
      if (matches.length > 0) {
        const nextMoves = movesLeft - 1;
        setMovesLeft(nextMoves);
        setSelectedCell(null);
        await executeMatchesAndCascade(swapped, score, 1);

        if (nextMoves <= 0 && score < TARGET_SCORE) {
          setIsGameOver(true);
          arcadeAudio.playCrash();
        }
      } else {
        // Invalid swap - animate revert back
        setTimeout(() => {
          const reverted = swapped.map((row) => [...row]);
          const revTemp = reverted[selectedCell.r][selectedCell.c];
          reverted[selectedCell.r][selectedCell.c] = reverted[r][c];
          reverted[r][c] = revTemp;
          setBoard(reverted);
          setSelectedCell(null);
        }, 220);
      }
    } else {
      setSelectedCell({ r, c });
    }
  };

  const getCandyInfo = (type: string) => {
    return CANDY_TYPES.find((c) => c.id === type) || CANDY_TYPES[0];
  };

  const starsEarned = score >= TARGET_SCORE ? 3 : score >= TARGET_SCORE * 0.65 ? 2 : score >= TARGET_SCORE * 0.35 ? 1 : 0;

  return (
    <div className="flex flex-col items-center justify-center space-y-3.5 select-none w-full max-w-[420px]">
      {/* Top HUD with Star Progress */}
      <div className="flex items-center justify-between w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 shadow">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            {[1, 2, 3].map((star) => (
              <Star
                key={star}
                className={`w-3.5 h-3.5 ${
                  starsEarned >= star ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-black text-amber-300 font-mono">
            {score} / {TARGET_SCORE} pts
          </span>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Moves</span>
          <span
            className={`text-base font-black font-mono ${
              movesLeft <= 5 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'
            }`}
          >
            {movesLeft}
          </span>
        </div>
      </div>

      {/* Grid Container */}
      <div className="relative p-3 bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Animated Combo Banner Popup */}
        <AnimatePresence>
          {comboBanner && (
            <motion.div
              initial={{ scale: 0.4, opacity: 0, y: 15 }}
              animate={{ scale: 1.15, opacity: 1, y: 0 }}
              exit={{ scale: 0.6, opacity: 0, y: -20 }}
              className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
            >
              <div className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white font-black text-xl shadow-2xl border-2 border-white/40 drop-shadow-lg tracking-wider">
                {comboBanner}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-7 gap-1.5 w-[336px] h-[336px]">
          {board.map((row, r) =>
            row.map((cell, c) => {
              const candy = getCandyInfo(cell.type);
              const isSelected = selectedCell?.r === r && selectedCell?.c === c;

              return (
                <motion.button
                  key={cell.id}
                  layout
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{
                    scale: cell.isPopping ? 1.3 : 1,
                    opacity: cell.isPopping ? 0 : 1
                  }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  whileHover={{ scale: isAnimating ? 1 : 1.08 }}
                  whileTap={{ scale: isAnimating ? 1 : 0.92 }}
                  onClick={() => handleCellClick(r, c)}
                  className={`relative rounded-2xl flex items-center justify-center text-2xl transition select-none shadow-sm aspect-square ${
                    isSelected
                      ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-900 bg-slate-800 scale-105'
                      : 'bg-slate-900/90 hover:bg-slate-800/90'
                  }`}
                  style={{
                    boxShadow: isSelected ? `0 0 16px ${candy.glow}` : undefined
                  }}
                >
                  <span className="drop-shadow-md select-none transform transition-transform">
                    {candy.icon}
                  </span>
                </motion.button>
              );
            })
          )}
        </div>

        {/* Win Overlay */}
        {isLevelCleared && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xs rounded-3xl flex flex-col items-center justify-center p-6 text-center z-30">
            <Trophy className="w-14 h-14 text-amber-400 mb-2 animate-bounce" />
            <h3 className="text-2xl font-black text-white mb-1">Sweet Victory!</h3>
            <p className="text-xs text-slate-300 mb-4">
              Level Completed with <strong>{score} points</strong> and {movesLeft} moves remaining!
            </p>
            <button
              onClick={initGame}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-2 shadow-lg"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Next Level / Play Again</span>
            </button>
          </div>
        )}

        {/* Game Over Overlay */}
        {isGameOver && !isLevelCleared && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xs rounded-3xl flex flex-col items-center justify-center p-6 text-center z-30">
            <h3 className="text-2xl font-black text-rose-400 mb-1">Out of Moves!</h3>
            <p className="text-xs text-slate-300 mb-4">
              You scored <strong>{score} points</strong> (Target was {TARGET_SCORE}).
            </p>
            <button
              onClick={initGame}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-2 shadow-lg"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between w-full text-xs text-slate-400 px-1">
        <span>Click 2 adjacent fruits to match 3 or more</span>
        <button
          onClick={initGame}
          className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Board</span>
        </button>
      </div>
    </div>
  );
};
