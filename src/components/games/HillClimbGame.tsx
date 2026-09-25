import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, ArrowRight, ArrowLeft, Fuel, Sparkles, Trophy } from 'lucide-react';
import { arcadeAudio } from './ArcadeSoundEngine';

interface HillClimbProps {
  soundOn: boolean;
}

interface SmokeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

export const HillClimbGame: React.FC<HillClimbProps> = ({ soundOn }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [distance, setDistance] = useState<number>(0);
  const [coins, setCoins] = useState<number>(0);
  const [fuel, setFuel] = useState<number>(100);
  const [gasActive, setGasActive] = useState<boolean>(false);
  const [brakeActive, setBrakeActive] = useState<boolean>(false);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('hill_climb_highscore') || '0', 10);
    } catch {
      return 0;
    }
  });

  const stateRef = useRef({
    gameState: 'idle' as 'idle' | 'playing' | 'gameover',
    carX: 80,
    carY: 150,
    vx: 0,
    vy: 0,
    angle: 0,
    vAngle: 0,
    wheelRotation: 0,
    frontSuspension: 0,
    rearSuspension: 0,
    airTime: 0,
    flipAccumulator: 0,
    fuel: 100,
    distance: 0,
    coins: 0,
    gasPressed: false,
    brakePressed: false,
    smokeParticles: [] as SmokeParticle[],
    coinsList: [] as { x: number; collected: boolean }[],
    fuelsList: [] as { x: number; collected: boolean }[],
    stuntMessage: '' as string,
    stuntTimer: 0
  });

  useEffect(() => {
    arcadeAudio.soundEnabled = soundOn;
  }, [soundOn]);

  // Smooth undulating terrain
  const getGroundY = (x: number) => {
    return (
      235 +
      Math.sin(x * 0.006) * 38 +
      Math.sin(x * 0.016) * 22 +
      Math.sin(x * 0.035) * 8
    );
  };

  const getGroundSlope = (x: number) => {
    const dx = 4;
    const y1 = getGroundY(x - dx);
    const y2 = getGroundY(x + dx);
    return Math.atan2(y2 - y1, dx * 2);
  };

  const startGame = () => {
    const s = stateRef.current;
    s.gameState = 'playing';
    s.carX = 80;
    s.carY = getGroundY(80) - 26;
    s.vx = 0;
    s.vy = 0;
    s.angle = 0;
    s.vAngle = 0;
    s.wheelRotation = 0;
    s.airTime = 0;
    s.flipAccumulator = 0;
    s.fuel = 100;
    s.distance = 0;
    s.coins = 0;
    s.gasPressed = false;
    s.brakePressed = false;
    s.smokeParticles = [];
    s.stuntMessage = '';
    s.stuntTimer = 0;

    // Collectibles along track
    const newCoins = [];
    const newFuels = [];
    for (let x = 320; x < 8000; x += 190) {
      newCoins.push({ x, collected: false });
      if (x % 570 === 0) {
        newFuels.push({ x: x + 90, collected: false });
      }
    }
    s.coinsList = newCoins;
    s.fuelsList = newFuels;

    setDistance(0);
    setCoins(0);
    setFuel(100);
    setGameState('playing');
    arcadeAudio.playJump();
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowRight', 'KeyD'].includes(e.code)) {
        stateRef.current.gasPressed = true;
        setGasActive(true);
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        stateRef.current.brakePressed = true;
        setBrakeActive(true);
      } else if (e.code === 'Space') {
        if (stateRef.current.gameState !== 'playing') {
          startGame();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowRight', 'KeyD'].includes(e.code)) {
        stateRef.current.gasPressed = false;
        setGasActive(false);
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        stateRef.current.brakePressed = false;
        setBrakeActive(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Main Physics & Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const loop = () => {
      const state = stateRef.current;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Camera view following car
      const cameraX = state.carX - 130;

      // Vivid Hill Country Sky
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#0284c7');
      skyGrad.addColorStop(0.65, '#93c5fd');
      skyGrad.addColorStop(1, '#dbeafe');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Distant Sun
      ctx.fillStyle = '#fef08a';
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(width - 70, 48, 28, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Distant Rolling Hills (Parallax)
      ctx.fillStyle = '#059669';
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let sx = 0; sx <= width; sx += 20) {
        const worldX = sx + cameraX * 0.3;
        const bgY = 190 + Math.sin(worldX * 0.003) * 45;
        ctx.lineTo(sx, bgY);
      }
      ctx.lineTo(width, height);
      ctx.fill();

      // Foreground Grass Terrain
      ctx.fillStyle = '#16a34a'; // Vibrant green grass
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let sx = 0; sx <= width; sx += 8) {
        const worldX = sx + cameraX;
        const gy = getGroundY(worldX);
        ctx.lineTo(sx, gy);
      }
      ctx.lineTo(width, height);
      ctx.fill();

      // Dirt Layer Beneath Grass
      ctx.fillStyle = '#78350f'; // Rich earth brown
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let sx = 0; sx <= width; sx += 8) {
        const worldX = sx + cameraX;
        const gy = getGroundY(worldX) + 12;
        ctx.lineTo(sx, gy);
      }
      ctx.lineTo(width, height);
      ctx.fill();

      // Collectible Coins
      state.coinsList.forEach((c) => {
        if (c.collected) return;
        const screenX = c.x - cameraX;
        if (screenX < -25 || screenX > width + 25) return;
        const gy = getGroundY(c.x) - 20;

        ctx.fillStyle = '#f59e0b';
        ctx.shadowColor = '#d97706';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(screenX, gy, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('$', screenX, gy + 3);
      });

      // Collectible Fuel Jerrycans
      state.fuelsList.forEach((f) => {
        if (f.collected) return;
        const screenX = f.x - cameraX;
        if (screenX < -25 || screenX > width + 25) return;
        const gy = getGroundY(f.x) - 25;

        // Red Gas Canister
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(screenX - 9, gy, 18, 22);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 8px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('GAS', screenX, gy + 14);
      });

      // Physics Simulation
      if (state.gameState === 'playing') {
        // Gravity
        state.vy += 0.42;

        // User Input Controls
        if (state.gasPressed && state.fuel > 0) {
          state.vx += 0.32;
          state.vAngle -= 0.009; // Front rises under throttle
          state.fuel -= 0.11;
          state.wheelRotation += 0.35;

          // Exhaust Smoke Particles
          if (Math.random() < 0.6) {
            const exhaustX = state.carX - Math.cos(state.angle) * 24;
            const exhaustY = state.carY - Math.sin(state.angle) * 24 + 4;
            state.smokeParticles.push({
              x: exhaustX,
              y: exhaustY,
              vx: -Math.cos(state.angle) * 2 - Math.random(),
              vy: -1 - Math.random() * 1.5,
              size: 4 + Math.random() * 4,
              alpha: 0.8
            });
          }

          if (Math.random() < 0.1) {
            arcadeAudio.playEngineRev(1.2);
          }
        }

        if (state.brakePressed) {
          state.vx -= 0.25;
          state.vAngle += 0.01; // Nose dives under brake
          state.wheelRotation -= 0.2;
        }

        // Air Drag
        state.vx *= 0.988;
        state.vy *= 0.99;
        state.vAngle *= 0.95;

        // Update Position
        state.carX += state.vx;
        state.carY += state.vy;
        state.angle += state.vAngle;

        // Track air time & flip stunts
        const rearX = state.carX - Math.cos(state.angle) * 20;
        const frontX = state.carX + Math.cos(state.angle) * 20;
        const rearGround = getGroundY(rearX) - 10;
        const frontGround = getGroundY(frontX) - 10;
        const avgGround = (rearGround + frontGround) / 2;

        const isGrounded = state.carY >= avgGround - 2;

        if (!isGrounded) {
          state.airTime++;
          state.flipAccumulator += state.vAngle;

          // Backflip stunt (+2PI)
          if (state.flipAccumulator < -Math.PI * 1.8) {
            state.flipAccumulator = 0;
            state.coins += 50;
            state.stuntMessage = '🔥 BACKFLIP! +50 COINS';
            state.stuntTimer = 60;
            arcadeAudio.playStunt();
          } else if (state.flipAccumulator > Math.PI * 1.8) {
            state.flipAccumulator = 0;
            state.coins += 50;
            state.stuntMessage = '⚡ FRONTFLIP! +50 COINS';
            state.stuntTimer = 60;
            arcadeAudio.playStunt();
          }
        } else {
          // Landing
          if (state.airTime > 40) {
            state.coins += 20;
            state.stuntMessage = '🏆 AIR TIME BONUS! +20 COINS';
            state.stuntTimer = 50;
            arcadeAudio.playCoin(1.5);
          }
          state.airTime = 0;
          state.flipAccumulator = 0;

          // Ground Contact & Slope Alignment
          state.carY = avgGround;
          state.vy = 0;

          const slope = getGroundSlope(state.carX);
          state.angle += (slope - state.angle) * 0.22;
          state.vx *= 0.978;
        }

        // True Crash Detection (Driver Head hitting terrain)
        const driverX = state.carX - Math.sin(state.angle) * 22;
        const driverY = state.carY - Math.cos(state.angle) * 22;
        const driverGround = getGroundY(driverX);

        if (driverY >= driverGround - 4) {
          state.gameState = 'gameover';
          setGameState('gameover');
          arcadeAudio.playCrash();
        }

        // Out of Fuel Check
        if (state.fuel <= 0 && Math.abs(state.vx) < 0.2) {
          state.gameState = 'gameover';
          setGameState('gameover');
          arcadeAudio.playCrash();
        }

        // Collect Coins
        state.coinsList.forEach((c) => {
          if (!c.collected && Math.abs(state.carX - c.x) < 28) {
            c.collected = true;
            state.coins += 5;
            setCoins(state.coins);
            arcadeAudio.playCoin(1 + (state.coins % 6) * 0.1);
          }
        });

        // Collect Fuel
        state.fuelsList.forEach((f) => {
          if (!f.collected && Math.abs(state.carX - f.x) < 32) {
            f.collected = true;
            state.fuel = Math.min(100, state.fuel + 45);
            arcadeAudio.playVictory();
          }
        });

        // Update score
        const curDist = Math.max(0, Math.floor((state.carX - 80) / 10));
        state.distance = curDist;
        setDistance(curDist);
        setFuel(Math.round(state.fuel));

        if (curDist > highScore) {
          setHighScore(curDist);
          try {
            localStorage.setItem('hill_climb_highscore', curDist.toString());
          } catch (_) {}
        }
      }

      // Render Exhaust Smoke
      for (let i = state.smokeParticles.length - 1; i >= 0; i--) {
        const p = state.smokeParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.size += 0.35;
        p.alpha -= 0.025;

        if (p.alpha <= 0) {
          state.smokeParticles.splice(i, 1);
          continue;
        }

        ctx.fillStyle = `rgba(203, 213, 225, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x - cameraX, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Render 4x4 Jeep with Rotating Tires & Animated Driver
      const carScreenX = state.carX - cameraX;
      const carScreenY = state.carY;

      ctx.save();
      ctx.translate(carScreenX, carScreenY);
      ctx.rotate(state.angle);

      // Chassis Red Body
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(-24, -14, 48, 14);

      // Roll Bar & Windshield
      ctx.strokeStyle = '#991b1b';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(-16, -14);
      ctx.lineTo(-6, -28);
      ctx.lineTo(14, -28);
      ctx.lineTo(20, -14);
      ctx.stroke();

      // Blue Glass Windshield
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(-4, -26, 16, 12);

      // Driver (Animated Bobbing Head)
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(0, -18 + Math.sin(state.wheelRotation) * 1.5, 7, 0, Math.PI * 2);
      ctx.fill();

      // Steering wheel
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(8, -14);
      ctx.lineTo(12, -20);
      ctx.stroke();

      // Wheels (Animated Spokes & Tire Treads)
      const drawWheel = (wx: number, wy: number) => {
        ctx.save();
        ctx.translate(wx, wy);
        ctx.rotate(state.wheelRotation);

        // Black Rubber Tire with Tread Grip
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(0, 0, 11, 0, Math.PI * 2);
        ctx.fill();

        // Silver Alloy Rim
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, Math.PI * 2);
        ctx.fill();

        // Rim Spokes
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2;
        for (let sp = 0; sp < 4; sp++) {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          const spAngle = (sp * Math.PI) / 2;
          ctx.lineTo(Math.cos(spAngle) * 9, Math.sin(spAngle) * 9);
          ctx.stroke();
        }
        ctx.restore();
      };

      drawWheel(-18, 3);
      drawWheel(18, 3);

      ctx.restore();

      // Render Stunt Message
      if (state.stuntTimer > 0) {
        state.stuntTimer--;
        ctx.fillStyle = '#facc15';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 6;
        ctx.fillText(state.stuntMessage, width / 2, 75);
        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [highScore]);

  return (
    <div className="flex flex-col items-center justify-center space-y-3 select-none w-full max-w-[480px]">
      {/* Top HUD: Distance, Fuel Bar, Coins */}
      <div className="flex items-center justify-between w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2 shadow">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-amber-400 font-black text-sm">🪙</span>
            <span className="font-mono font-bold text-amber-300 text-sm">{coins}</span>
          </div>
          <div className="w-px h-4 bg-slate-800" />
          <div>
            <span className="text-[10px] uppercase text-slate-400 font-bold block">Distance</span>
            <span className="font-mono font-bold text-white text-sm">{distance}m</span>
          </div>
        </div>

        {/* Fuel Gauge */}
        <div className="flex items-center gap-2">
          <Fuel className={`w-4 h-4 ${fuel < 25 ? 'text-rose-500 animate-bounce' : 'text-amber-400'}`} />
          <div className="w-20 bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700">
            <div
              className={`h-full transition-all ${
                fuel < 25 ? 'bg-rose-500' : 'bg-gradient-to-r from-amber-400 to-emerald-400'
              }`}
              style={{ width: `${fuel}%` }}
            />
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-950">
        <canvas ref={canvasRef} width={480} height={320} className="block max-w-full" />

        {gameState === 'idle' && (
          <div
            onClick={startGame}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center cursor-pointer select-none"
          >
            <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center mb-3 animate-bounce">
              <Play className="w-7 h-7 fill-current ml-0.5" />
            </div>
            <h3 className="text-xl font-black text-white tracking-wide mb-1">
              Hill Climb Racing Pro
            </h3>
            <p className="text-xs text-slate-300 max-w-xs mb-3">
              Physics driving! Accelerate uphill, do mid-air backflips for bonus points, and don't smash your helmet!
            </p>
            <button
              onClick={startGame}
              className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-2 shadow-lg"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Driving (Spacebar)</span>
            </button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div
            onClick={startGame}
            className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center cursor-pointer select-none"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-1">
              {fuel <= 0 ? 'Out of Fuel!' : 'Driver Crash!'}
            </span>
            <h3 className="text-2xl font-black text-white mb-2">Game Over</h3>
            <div className="flex items-center gap-4 bg-slate-900/90 border border-slate-800 px-5 py-2.5 rounded-xl mb-4">
              <div>
                <span className="text-[10px] uppercase text-slate-400 font-bold block">Distance</span>
                <span className="text-xl font-black text-amber-400 font-mono">{distance}m</span>
              </div>
              <div className="w-px h-8 bg-slate-800" />
              <div>
                <span className="text-[10px] uppercase text-slate-400 font-bold block">Coins</span>
                <span className="text-xl font-black text-emerald-400 font-mono">{coins}</span>
              </div>
            </div>
            <button
              onClick={startGame}
              className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-2 shadow-lg"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Drive Again</span>
            </button>
          </div>
        )}
      </div>

      {/* Tactile Big Pedals for Touch & Mobile */}
      <div className="flex items-center justify-between w-full max-w-[480px] gap-4">
        {/* Red Brake Pedal */}
        <button
          onMouseDown={() => {
            stateRef.current.brakePressed = true;
            setBrakeActive(true);
          }}
          onMouseUp={() => {
            stateRef.current.brakePressed = false;
            setBrakeActive(false);
          }}
          onTouchStart={() => {
            stateRef.current.brakePressed = true;
            setBrakeActive(true);
          }}
          onTouchEnd={() => {
            stateRef.current.brakePressed = false;
            setBrakeActive(false);
          }}
          className={`flex-1 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 border ${
            brakeActive
              ? 'bg-rose-700 text-white scale-95 border-rose-500 ring-2 ring-rose-400'
              : 'bg-rose-950/80 hover:bg-rose-900 text-rose-300 border-rose-800'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Brake / Reverse (A / ◄)</span>
        </button>

        {/* Green Gas Pedal */}
        <button
          onMouseDown={() => {
            stateRef.current.gasPressed = true;
            setGasActive(true);
          }}
          onMouseUp={() => {
            stateRef.current.gasPressed = false;
            setGasActive(false);
          }}
          onTouchStart={() => {
            stateRef.current.gasPressed = true;
            setGasActive(true);
          }}
          onTouchEnd={() => {
            stateRef.current.gasPressed = false;
            setGasActive(false);
          }}
          className={`flex-1 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 border ${
            gasActive
              ? 'bg-emerald-600 text-white scale-95 border-emerald-400 ring-2 ring-emerald-300'
              : 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border-emerald-800'
          }`}
        >
          <span>Gas / Throttle (D / ►)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
