import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Gamepad2,
  Trophy,
  Sparkles,
  RotateCcw,
  Volume2,
  VolumeX,
  Play,
  Zap,
  Flame,
  Layers,
  Crown
} from 'lucide-react';
import { SubwayRunnerGame } from './games/SubwayRunnerGame';
import { TempleRunGame } from './games/TempleRunGame';
import { CandyCrushGame } from './games/CandyCrushGame';
import { HillClimbGame } from './games/HillClimbGame';
import { MinecraftSandboxGame } from './games/MinecraftSandboxGame';
import { ClashRoyaleArenaGame } from './games/ClashRoyaleArenaGame';
import { AmongUsDeductionGame } from './games/AmongUsDeductionGame';

interface ContributorArcadeModalProps {
  isOpen: boolean;
  onClose: () => void;
  isProcessing: boolean;
  completedCount: number;
  totalCount: number;
  showToast: (msg: string) => void;
}

type GameType =
  | 'subway'
  | 'temple'
  | 'candy'
  | 'hillclimb'
  | 'minecraft'
  | 'clash'
  | 'amongus'
  | 'flappy';

// ==========================================
// FLAPPY DRONE (KEPT BY REQUEST)
// ==========================================
const FlappyDroneGame: React.FC<{ soundOn: boolean }> = ({ soundOn }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('flappy_drone_highscore') || '0', 10);
    } catch {
      return 0;
    }
  });

  const stateRef = useRef({
    gameState: 'idle' as 'idle' | 'playing' | 'gameover',
    droneY: 150,
    droneVelocity: 0,
    gravity: 0.38,
    jumpPower: -6.5,
    pipes: [] as { x: number; top: number; bottom: number; passed: boolean }[],
    score: 0,
    frame: 0
  });

  const jump = () => {
    if (stateRef.current.gameState === 'idle') {
      stateRef.current.gameState = 'playing';
      stateRef.current.droneY = 150;
      stateRef.current.droneVelocity = stateRef.current.jumpPower;
      stateRef.current.pipes = [];
      stateRef.current.score = 0;
      setScore(0);
      setGameState('playing');
      return;
    }
    if (stateRef.current.gameState === 'playing') {
      stateRef.current.droneVelocity = stateRef.current.jumpPower;
    } else if (stateRef.current.gameState === 'gameover') {
      stateRef.current.gameState = 'playing';
      stateRef.current.droneY = 150;
      stateRef.current.droneVelocity = stateRef.current.jumpPower;
      stateRef.current.pipes = [];
      stateRef.current.score = 0;
      setScore(0);
      setGameState('playing');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const gameLoop = () => {
      const state = stateRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background Sky Gradient
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid Lines
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      if (state.gameState === 'playing') {
        state.frame++;
        state.droneVelocity += state.gravity;
        state.droneY += state.droneVelocity;

        // Spawn pillars
        if (state.frame % 95 === 0) {
          const gap = 110;
          const minHeight = 40;
          const maxHeight = canvas.height - gap - minHeight;
          const top = Math.floor(Math.random() * (maxHeight - minHeight)) + minHeight;
          state.pipes.push({
            x: canvas.width,
            top,
            bottom: canvas.height - top - gap,
            passed: false
          });
        }

        // Move & Render Pipes
        for (let i = state.pipes.length - 1; i >= 0; i--) {
          const pipe = state.pipes[i];
          pipe.x -= 2.4;

          // Score check
          if (!pipe.passed && pipe.x + 40 < 60) {
            pipe.passed = true;
            state.score++;
            setScore(state.score);

            if (state.score > highScore) {
              setHighScore(state.score);
              try {
                localStorage.setItem('flappy_drone_highscore', state.score.toString());
              } catch (_) {}
            }
          }

          // Draw Top Pipe
          ctx.fillStyle = '#4f46e5';
          ctx.fillRect(pipe.x, 0, 42, pipe.top);
          ctx.fillStyle = '#818cf8';
          ctx.fillRect(pipe.x - 3, pipe.top - 12, 48, 12);

          // Draw Bottom Pipe
          const bottomY = canvas.height - pipe.bottom;
          ctx.fillStyle = '#4f46e5';
          ctx.fillRect(pipe.x, bottomY, 42, pipe.bottom);
          ctx.fillStyle = '#818cf8';
          ctx.fillRect(pipe.x - 3, bottomY, 48, 12);

          // Collision Check
          const droneX = 60;
          const droneRadius = 13;
          if (
            droneX + droneRadius > pipe.x &&
            droneX - droneRadius < pipe.x + 42 &&
            (state.droneY - droneRadius < pipe.top || state.droneY + droneRadius > bottomY)
          ) {
            state.gameState = 'gameover';
            setGameState('gameover');
          }

          if (pipe.x < -60) {
            state.pipes.splice(i, 1);
          }
        }

        // Floor / Ceiling hit
        if (state.droneY > canvas.height - 15 || state.droneY < 15) {
          state.gameState = 'gameover';
          setGameState('gameover');
        }
      }

      // Draw Drone
      const droneX = 60;
      const droneY = state.droneY;

      ctx.save();
      ctx.translate(droneX, droneY);
      const angle = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, (state.droneVelocity * 4 * Math.PI) / 180));
      ctx.rotate(angle);

      // Body
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(0, 0, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Camera Eye
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(5, 0, 6, 0, Math.PI * 2);
      ctx.fill();

      // Lens Reflection
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(6, -2, 2, 0, Math.PI * 2);
      ctx.fill();

      // Propellers
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-18, -12);
      ctx.lineTo(18, -12);
      ctx.stroke();
      ctx.restore();

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [highScore]);

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-950">
        <canvas
          ref={canvasRef}
          width={480}
          height={320}
          onClick={jump}
          className="cursor-pointer block max-w-full touch-none"
        />

        {gameState === 'idle' && (
          <div
            onClick={jump}
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center cursor-pointer select-none"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center mb-3 animate-bounce">
              <Play className="w-7 h-7 fill-current ml-0.5" />
            </div>
            <h3 className="text-xl font-black text-white tracking-wide mb-1">Flappy Stock Drone</h3>
            <p className="text-xs text-slate-300 max-w-xs mb-3">
              Fly through marketplace compliance pillars without crashing!
            </p>
            <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              Click or Press Space to Start
            </span>
          </div>
        )}

        {gameState === 'gameover' && (
          <div
            onClick={jump}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center cursor-pointer select-none"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-1">
              Collision!
            </span>
            <h3 className="text-2xl font-black text-white mb-2">Game Over</h3>
            <div className="flex items-center gap-4 bg-slate-900/90 border border-slate-800 px-5 py-2.5 rounded-xl mb-4">
              <div>
                <span className="text-[10px] uppercase text-slate-400 font-bold block">Score</span>
                <span className="text-xl font-black text-amber-400">{score}</span>
              </div>
              <div className="w-px h-8 bg-slate-800" />
              <div>
                <span className="text-[10px] uppercase text-slate-400 font-bold block">Best</span>
                <span className="text-xl font-black text-emerald-400">{highScore}</span>
              </div>
            </div>
            <button
              onClick={jump}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-2 shadow-lg"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Again (Spacebar)</span>
            </button>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="absolute top-3 left-4 flex items-center gap-3 pointer-events-none">
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 px-3 py-1 rounded-xl text-white font-mono font-black text-lg">
              {score}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between w-full max-w-[480px] text-xs text-slate-400 px-1">
        <span>Controls: <strong>Spacebar</strong> or <strong>Tap</strong></span>
        <span>High Score: <strong className="text-emerald-400 font-mono">{highScore}</strong></span>
      </div>
    </div>
  );
};

// ==========================================
// MAIN ARCADE MODAL WITH ALL 7 POPULAR GAMES
// ==========================================
export const ContributorArcadeModal: React.FC<ContributorArcadeModalProps> = ({
  isOpen,
  onClose,
  isProcessing,
  completedCount,
  totalCount,
  showToast
}) => {
  const [activeGame, setActiveGame] = useState<GameType>('subway');
  const [soundOn, setSoundOn] = useState<boolean>(true);

  if (!isOpen) return null;

  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const games = [
    { id: 'subway', name: 'Subway Surfers', icon: '🏄', desc: '3-Lane Endless Runner' },
    { id: 'temple', name: 'Temple Run', icon: '🏃', desc: '3D Ancient Ruins Sprint' },
    { id: 'candy', name: 'Candy Crush', icon: '🍬', desc: 'Fruit Match-3 Puzzle' },
    { id: 'hillclimb', name: 'Hill Climb', icon: '🚗', desc: '2D Physics Driving' },
    { id: 'minecraft', name: 'Minecraft', icon: '⛏️', desc: '2D Steve Platformer' },
    { id: 'clash', name: 'Clash Royale', icon: '⚔️', desc: 'Real-Time Arena Battle' },
    { id: 'amongus', name: 'Among Us', icon: '🛸', desc: 'Impostor Social Deduction' },
    { id: 'flappy', name: 'Flappy Drone', icon: '🚁', desc: 'Retro Gate Flight' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[96vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-3.5 border-b border-slate-800 bg-slate-950/90 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-500/20 via-indigo-500/20 to-purple-500/20 border border-amber-500/30 text-amber-400 shadow-sm">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Contributor Arcade
                </h3>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  8 Epic Games
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Enjoy world-famous mini-games while AI finishes analyzing and keywording your visuals!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundOn(!soundOn)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title={soundOn ? 'Mute Sound Effects' : 'Enable Sound Effects'}
            >
              {soundOn ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Background Processing Queue Bar */}
        {isProcessing && (
          <div className="bg-gradient-to-r from-indigo-950 via-slate-950 to-indigo-950 px-6 py-2 border-b border-indigo-500/20 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-bold text-slate-200">
                AI Metadata Generation in Progress...
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-emerald-400">
                {completedCount} / {totalCount} Files ({percent}%)
              </span>
              <div className="w-24 bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full transition-all duration-300"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* 7 Games Switcher Navigation (Clean horizontal pill scroll) */}
        <div className="px-4 py-2.5 flex items-center gap-2 bg-slate-950/60 overflow-x-auto border-b border-slate-800/80">
          {games.map((g) => {
            const isActive = activeGame === g.id;
            return (
              <button
                key={g.id}
                onClick={() => setActiveGame(g.id as GameType)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap select-none shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/20 ring-1 ring-white/20'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                <span className="text-sm">{g.icon}</span>
                <span>{g.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active Game Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center justify-center">
          {activeGame === 'subway' && <SubwayRunnerGame soundOn={soundOn} />}
          {activeGame === 'temple' && <TempleRunGame soundOn={soundOn} />}
          {activeGame === 'candy' && <CandyCrushGame soundOn={soundOn} />}
          {activeGame === 'hillclimb' && <HillClimbGame soundOn={soundOn} />}
          {activeGame === 'minecraft' && <MinecraftSandboxGame soundOn={soundOn} />}
          {activeGame === 'clash' && <ClashRoyaleArenaGame soundOn={soundOn} />}
          {activeGame === 'amongus' && <AmongUsDeductionGame soundOn={soundOn} />}
          {activeGame === 'flappy' && <FlappyDroneGame soundOn={soundOn} />}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>High scores save automatically in your browser.</span>
          </div>

          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition"
          >
            Back to Studio
          </button>
        </div>
      </motion.div>
    </div>
  );
};
