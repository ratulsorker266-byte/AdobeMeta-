import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, CheckCircle, RotateCcw, Users, Zap, ShieldAlert, Sparkles, CreditCard } from 'lucide-react';
import confetti from 'canvas-confetti';
import { arcadeAudio } from './ArcadeSoundEngine';

interface AmongUsProps {
  soundOn: boolean;
}

interface Crewmate {
  id: string;
  name: string;
  color: string;
  avatar: string;
  isImpostor: boolean;
  alibi: string;
  speech: string;
}

const CREWMATES: Crewmate[] = [
  { id: 'red', name: 'Red', color: 'bg-red-500 text-white', avatar: '🔴', isImpostor: true, alibi: 'I was cleaning vents... I mean fixing shields!', speech: 'Why you looking at me? I saw Blue faking wires!' },
  { id: 'blue', name: 'Blue', color: 'bg-blue-500 text-white', avatar: '🔵', isImpostor: false, alibi: 'I was in Admin with Yellow the entire round.', speech: 'Yellow and I can vouch for each other. Vote Red!' },
  { id: 'green', name: 'Green', color: 'bg-emerald-500 text-white', avatar: '🟢', isImpostor: false, alibi: 'Visual scan verified in Medbay.', speech: 'Red was standing near the electrical vent!' },
  { id: 'yellow', name: 'Yellow', color: 'bg-yellow-400 text-slate-950', avatar: '🟡', isImpostor: false, alibi: 'Card swipe in Admin with Blue.', speech: 'Blue is clean, Red is super sus!' }
];

export const AmongUsDeductionGame: React.FC<AmongUsProps> = ({ soundOn }) => {
  const [phase, setPhase] = useState<'roam' | 'wires' | 'card' | 'meeting' | 'ejection'>('roam');
  const [playerX, setPlayerX] = useState<number>(140);
  const [playerY, setPlayerY] = useState<number>(130);
  const [facing, setFacing] = useState<1 | -1>(1);

  // Wires task state
  const [wireProgress, setWireProgress] = useState<{ [key: string]: boolean }>({
    red: false,
    blue: false,
    yellow: false,
    pink: false
  });
  const [selectedWire, setSelectedWire] = useState<string | null>(null);

  // Card Swipe task state
  const [cardProgress, setCardProgress] = useState<number>(0);
  const [cardStatus, setCardStatus] = useState<string>('Swipe Card from Left to Right');

  // Ejection state
  const [votedCrewmate, setVotedCrewmate] = useState<Crewmate | null>(null);
  const [ejectionText, setEjectionText] = useState<string>('');
  const [isVictory, setIsVictory] = useState<boolean>(false);

  useEffect(() => {
    arcadeAudio.soundEnabled = soundOn;
  }, [soundOn]);

  // Movement in spaceship room
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase !== 'roam') return;
      if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        setPlayerX((x) => Math.max(20, x - 14));
        setFacing(-1);
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        setPlayerX((x) => Math.min(390, x + 14));
        setFacing(1);
      } else if (['ArrowUp', 'KeyW'].includes(e.code)) {
        setPlayerY((y) => Math.max(40, y - 14));
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        setPlayerY((y) => Math.min(210, y + 14));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase]);

  // Wires Task
  const handleLeftWire = (color: string) => {
    setSelectedWire(color);
    arcadeAudio.playSlide();
  };

  const handleRightWire = (color: string) => {
    if (selectedWire === color) {
      arcadeAudio.playCoin();
      setWireProgress((prev) => {
        const next = { ...prev, [color]: true };
        if (Object.values(next).filter(Boolean).length === 4) {
          arcadeAudio.playVictory();
          setTimeout(() => {
            setPhase('roam');
          }, 600);
        }
        return next;
      });
      setSelectedWire(null);
    } else {
      arcadeAudio.playCrash();
      setSelectedWire(null);
    }
  };

  // Card Swipe
  const handleCardSwipe = (val: number) => {
    setCardProgress(val);
    if (val >= 90) {
      setCardStatus('ACCEPTED! Thank you.');
      arcadeAudio.playVictory();
      setTimeout(() => {
        setPhase('roam');
      }, 700);
    }
  };

  // Emergency Meeting Trigger
  const triggerEmergency = () => {
    arcadeAudio.playAlarm();
    setPhase('meeting');
  };

  // Vote Crewmate
  const voteCrewmate = (mate: Crewmate) => {
    setVotedCrewmate(mate);
    if (mate.isImpostor) {
      setEjectionText(`${mate.name} was an Impostor. (0 Impostors remain)`);
      setIsVictory(true);
      arcadeAudio.playVictory();
      confetti({ particleCount: 70, spread: 80 });
    } else {
      setEjectionText(`${mate.name} was NOT an Impostor. (1 Impostor remains)`);
      setIsVictory(false);
      arcadeAudio.playCrash();
    }
    setPhase('ejection');
  };

  const restartGame = () => {
    setWireProgress({ red: false, blue: false, yellow: false, pink: false });
    setSelectedWire(null);
    setCardProgress(0);
    setCardStatus('Swipe Card from Left to Right');
    setVotedCrewmate(null);
    setEjectionText('');
    setIsVictory(false);
    setPhase('roam');
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-3.5 select-none w-full max-w-[460px]">
      {/* Top HUD */}
      <div className="flex items-center justify-between w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 shadow">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-white tracking-wide">The Skeld Spaceship</span>
        </div>
        <span className="text-[11px] font-mono font-bold text-rose-400 bg-rose-950/60 px-2.5 py-0.5 rounded-full border border-rose-800/40">
          1 Impostor Among Us
        </span>
      </div>

      {/* PHASE 1: FREE ROAM IN SPACESHIP ROOM */}
      {phase === 'roam' && (
        <div className="relative w-full h-[280px] bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-4 flex flex-col justify-between">
          {/* Metal Floor Grid */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Interactive Stations */}
          <div className="flex items-center justify-between w-full z-10">
            {/* Electrical Wires Station */}
            <button
              onClick={() => setPhase('wires')}
              className="p-3 bg-amber-500/10 border border-amber-500/40 hover:bg-amber-500/20 text-amber-300 rounded-2xl flex items-center gap-2 text-xs font-bold transition shadow"
            >
              <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Fix Wires</span>
            </button>

            {/* Emergency Meeting Siren Button */}
            <button
              onClick={triggerEmergency}
              className="p-3 bg-rose-600/30 border-2 border-rose-500 hover:bg-rose-600/50 text-rose-200 rounded-2xl flex items-center gap-2 text-xs font-black transition animate-bounce shadow-lg"
            >
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>EMERGENCY!</span>
            </button>

            {/* Admin Card Swipe Station */}
            <button
              onClick={() => setPhase('card')}
              className="p-3 bg-cyan-500/10 border border-cyan-500/40 hover:bg-cyan-500/20 text-cyan-300 rounded-2xl flex items-center gap-2 text-xs font-bold transition shadow"
            >
              <CreditCard className="w-4 h-4 text-cyan-400" />
              <span>Swipe Card</span>
            </button>
          </div>

          {/* Other Crewmates roaming in background */}
          <div className="absolute left-28 top-28 flex items-center gap-2 opacity-80 pointer-events-none">
            <span className="text-2xl">🔴</span>
            <span className="text-[10px] font-bold text-red-400 bg-slate-900/90 px-1.5 py-0.5 rounded border border-red-500/30">
              Red (Near Vent...)
            </span>
          </div>

          <div className="absolute right-24 bottom-14 flex items-center gap-2 opacity-80 pointer-events-none">
            <span className="text-2xl">🔵</span>
            <span className="text-[10px] font-bold text-blue-400 bg-slate-900/90 px-1.5 py-0.5 rounded border border-blue-500/30">
              Blue (Scanning)
            </span>
          </div>

          {/* Player Animated Crewmate Character */}
          <motion.div
            style={{ left: playerX, top: playerY }}
            className="absolute z-20 flex flex-col items-center pointer-events-none transition-all duration-75"
          >
            {/* Visor & Suit */}
            <div
              className={`relative w-8 h-10 bg-cyan-500 rounded-2xl shadow-lg border-2 border-cyan-300 flex items-center justify-center ${
                facing === -1 ? 'scale-x-[-1]' : ''
              }`}
            >
              {/* Backpack */}
              <div className="absolute -left-2.5 w-3 h-6 bg-cyan-600 rounded-l-md" />
              {/* Goggle Visor */}
              <div className="w-4 h-3 bg-sky-200 rounded-full border border-sky-400 ml-1.5 shadow-inner" />
            </div>
            {/* Nameplate */}
            <span className="text-[9px] font-black text-cyan-300 bg-slate-900/90 px-1.5 rounded mt-0.5 border border-cyan-500/30">
              You
            </span>
          </motion.div>

          {/* Mobile Directional Roam Buttons */}
          <div className="flex items-center justify-center gap-2 w-full z-10 pt-4">
            <button
              onClick={() => {
                setPlayerX((x) => Math.max(20, x - 25));
                setFacing(-1);
              }}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-300 rounded-xl border border-slate-700"
            >
              ◄ Left
            </button>
            <button
              onClick={() => setPlayerY((y) => Math.max(40, y - 25))}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-300 rounded-xl border border-slate-700"
            >
              ▲ Up
            </button>
            <button
              onClick={() => setPlayerY((y) => Math.min(210, y + 25))}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-300 rounded-xl border border-slate-700"
            >
              ▼ Down
            </button>
            <button
              onClick={() => {
                setPlayerX((x) => Math.min(390, x + 25));
                setFacing(1);
              }}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-300 rounded-xl border border-slate-700"
            >
              Right ►
            </button>
          </div>
        </div>
      )}

      {/* PHASE 2: ELECTRICAL WIRES MINI-TASK */}
      {phase === 'wires' && (
        <div className="w-full bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col items-center">
          <div className="flex items-center justify-between w-full mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Electrical Wires</h3>
            </div>
            <button
              onClick={() => setPhase('roam')}
              className="text-xs text-slate-400 hover:text-white"
            >
              ✕ Exit Task
            </button>
          </div>

          <div className="flex items-center justify-between w-full max-w-[340px] py-4">
            {/* Left Terminal */}
            <div className="space-y-4">
              {['red', 'blue', 'yellow', 'pink'].map((col) => {
                const isConnected = wireProgress[col];
                const isSelected = selectedWire === col;
                return (
                  <button
                    key={col}
                    onClick={() => handleLeftWire(col)}
                    disabled={isConnected}
                    className={`w-12 h-6 rounded-lg transition border flex items-center justify-center text-xs font-bold ${
                      isConnected
                        ? 'opacity-40 border-slate-700 bg-slate-800'
                        : isSelected
                        ? 'ring-2 ring-white scale-105'
                        : ''
                    }`}
                    style={{
                      backgroundColor:
                        col === 'red' ? '#ef4444' : col === 'blue' ? '#3b82f6' : col === 'yellow' ? '#eab308' : '#ec4899'
                    }}
                  >
                    {isConnected ? '✓' : '•'}
                  </button>
                );
              })}
            </div>

            <div className="text-xs text-slate-500 font-mono">=== CONNECT ===</div>

            {/* Right Terminal (Scrambled Order) */}
            <div className="space-y-4">
              {['yellow', 'red', 'pink', 'blue'].map((col) => {
                const isConnected = wireProgress[col];
                return (
                  <button
                    key={col}
                    onClick={() => handleRightWire(col)}
                    disabled={isConnected}
                    className={`w-12 h-6 rounded-lg transition border flex items-center justify-center text-xs font-bold ${
                      isConnected ? 'opacity-40 border-slate-700 bg-slate-800' : 'hover:scale-105'
                    }`}
                    style={{
                      backgroundColor:
                        col === 'red' ? '#ef4444' : col === 'blue' ? '#3b82f6' : col === 'yellow' ? '#eab308' : '#ec4899'
                    }}
                  >
                    {isConnected ? '✓' : '•'}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* PHASE 3: ADMIN CARD SWIPE TASK */}
      {phase === 'card' && (
        <div className="w-full bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col items-center">
          <div className="flex items-center justify-between w-full mb-3">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Admin: Card Swipe</h3>
            </div>
            <button
              onClick={() => setPhase('roam')}
              className="text-xs text-slate-400 hover:text-white"
            >
              ✕ Exit Task
            </button>
          </div>

          <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 my-2 text-center">
            <span className="text-xs font-mono font-bold text-amber-400 block mb-2">
              {cardStatus}
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={cardProgress}
              onChange={(e) => handleCardSwipe(Number(e.target.value))}
              className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>
        </div>
      )}

      {/* PHASE 4: EMERGENCY MEETING DISCUSSION & VOTING */}
      {phase === 'meeting' && (
        <div className="w-full bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col items-center">
          <div className="flex items-center gap-2 mb-3 text-rose-400">
            <ShieldAlert className="w-6 h-6 animate-bounce" />
            <h3 className="text-base font-black uppercase tracking-wider text-white">
              Emergency Meeting!
            </h3>
          </div>

          <p className="text-xs text-slate-300 text-center mb-4 max-w-xs">
            Review crewmate testimonies and vote out the Impostor before they sabotage the ship!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full mb-4">
            {CREWMATES.map((mate) => (
              <div
                key={mate.id}
                className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl flex flex-col justify-between space-y-2 hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{mate.avatar}</span>
                    <span className="text-xs font-bold text-white">{mate.name}</span>
                  </div>
                  <button
                    onClick={() => voteCrewmate(mate)}
                    className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold rounded-xl transition shadow"
                  >
                    Vote Sus
                  </button>
                </div>
                <p className="text-[11px] italic text-slate-300 bg-slate-950/70 p-2 rounded-xl border border-slate-800">
                  &ldquo;{mate.speech}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PHASE 5: EJECTION CINEMATIC */}
      {phase === 'ejection' && (
        <div className="relative w-full h-[280px] bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-6 flex flex-col items-center justify-center text-center">
          {/* Starry Space Background */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-40 animate-pulse pointer-events-none" />

          {/* Floating Ejected Crewmate */}
          <motion.div
            initial={{ x: -180, rotate: 0 }}
            animate={{ x: 180, rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="text-5xl mb-4 pointer-events-none"
          >
            {votedCrewmate?.avatar}
          </motion.div>

          <h3 className="text-xl font-black text-white mb-2 z-10">{ejectionText}</h3>

          <p className="text-xs text-slate-400 mb-4 z-10">
            {isVictory ? 'All Impostors ejected! Ship is safe.' : 'The real Impostor is still on board!'}
          </p>

          <button
            onClick={restartGame}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-2 shadow-lg z-10"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </button>
        </div>
      )}
    </div>
  );
};
