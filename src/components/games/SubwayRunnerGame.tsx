import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Sparkles, Zap, Magnet } from 'lucide-react';
import { arcadeAudio } from './ArcadeSoundEngine';

interface SubwayRunnerProps {
  soundOn: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface FloatingText {
  id: number;
  text: string;
  x: number;
  y: number;
  color: string;
  life: number;
}

export const SubwayRunnerGame: React.FC<SubwayRunnerProps> = ({ soundOn }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [score, setScore] = useState<number>(0);
  const [coins, setCoins] = useState<number>(0);
  const [activePowerup, setActivePowerup] = useState<string | null>(null);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('subway_runner_highscore') || '0', 10);
    } catch {
      return 0;
    }
  });

  const stateRef = useRef({
    gameState: 'idle' as 'idle' | 'playing' | 'gameover',
    lane: 0, // -1: Left, 0: Center, 1: Right
    targetLane: 0,
    playerX: 0,
    playerY: 0,
    isJumping: false,
    jumpVelocity: 0,
    isSliding: false,
    slideTimer: 0,
    speed: 7,
    distance: 0,
    coins: 0,
    scoreMultiplier: 1,
    multiplierTimer: 0,
    hasMagnet: false,
    magnetTimer: 0,
    screenShake: 0,
    obstacles: [] as {
      z: number; // 1 (far) to 0 (near)
      lane: number;
      type: 'barrier' | 'train' | 'overhead';
      passed: boolean;
    }[],
    coinItems: [] as {
      z: number;
      lane: number;
      xOffset: number;
      collected: boolean;
    }[],
    powerups: [] as {
      z: number;
      lane: number;
      type: 'magnet' | 'multiplier';
      collected: boolean;
    }[],
    particles: [] as Particle[],
    floatingTexts: [] as FloatingText[],
    frame: 0
  });

  useEffect(() => {
    arcadeAudio.soundEnabled = soundOn;
  }, [soundOn]);

  const triggerShake = (amount = 12) => {
    stateRef.current.screenShake = amount;
  };

  const addFloatingText = (text: string, x: number, y: number, color = '#facc15') => {
    stateRef.current.floatingTexts.push({
      id: Date.now() + Math.random(),
      text,
      x,
      y,
      color,
      life: 45
    });
  };

  const spawnCoinParticles = (x: number, y: number) => {
    for (let i = 0; i < 8; i++) {
      stateRef.current.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6 - 2,
        life: 25,
        maxLife: 25,
        color: Math.random() > 0.3 ? '#facc15' : '#38bdf8',
        size: Math.random() * 4 + 2
      });
    }
  };

  const startGame = () => {
    stateRef.current.gameState = 'playing';
    stateRef.current.lane = 0;
    stateRef.current.targetLane = 0;
    stateRef.current.playerX = 0;
    stateRef.current.playerY = 0;
    stateRef.current.isJumping = false;
    stateRef.current.isSliding = false;
    stateRef.current.speed = 7;
    stateRef.current.distance = 0;
    stateRef.current.coins = 0;
    stateRef.current.scoreMultiplier = 1;
    stateRef.current.multiplierTimer = 0;
    stateRef.current.hasMagnet = false;
    stateRef.current.magnetTimer = 0;
    stateRef.current.obstacles = [];
    stateRef.current.coinItems = [];
    stateRef.current.powerups = [];
    stateRef.current.particles = [];
    stateRef.current.floatingTexts = [];
    stateRef.current.screenShake = 0;
    stateRef.current.frame = 0;

    setScore(0);
    setCoins(0);
    setActivePowerup(null);
    setGameState('playing');
    arcadeAudio.playJump();
  };

  const moveLeft = () => {
    if (stateRef.current.gameState !== 'playing') return;
    if (stateRef.current.targetLane > -1) {
      stateRef.current.targetLane -= 1;
      arcadeAudio.playJump();
    }
  };

  const moveRight = () => {
    if (stateRef.current.gameState !== 'playing') return;
    if (stateRef.current.targetLane < 1) {
      stateRef.current.targetLane += 1;
      arcadeAudio.playJump();
    }
  };

  const jump = () => {
    if (stateRef.current.gameState === 'idle' || stateRef.current.gameState === 'gameover') {
      startGame();
      return;
    }
    if (!stateRef.current.isJumping && !stateRef.current.isSliding) {
      stateRef.current.isJumping = true;
      stateRef.current.jumpVelocity = 13.5;
      arcadeAudio.playJump();
    }
  };

  const slide = () => {
    if (stateRef.current.gameState !== 'playing') return;
    if (stateRef.current.isJumping) {
      stateRef.current.isJumping = false;
      stateRef.current.playerY = 0;
    }
    stateRef.current.isSliding = true;
    stateRef.current.slideTimer = 32;
    arcadeAudio.playJump();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        moveLeft();
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        moveRight();
      } else if (['ArrowUp', 'KeyW', 'Space'].includes(e.code)) {
        e.preventDefault();
        jump();
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        slide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Main Canvas Render & Animation Loop
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

      ctx.save();

      // Screen shake translation
      if (state.screenShake > 0) {
        const shakeX = (Math.random() - 0.5) * state.screenShake;
        const shakeY = (Math.random() - 0.5) * state.screenShake;
        ctx.translate(shakeX, shakeY);
        state.screenShake *= 0.88;
        if (state.screenShake < 0.5) state.screenShake = 0;
      }

      ctx.clearRect(-10, -10, width + 20, height + 20);

      // Sky & Neon Horizon
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.45);
      skyGrad.addColorStop(0, '#030712');
      skyGrad.addColorStop(0.6, '#1e1b4b');
      skyGrad.addColorStop(1, '#4338ca');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height * 0.45);

      // Futuristic City Skyline with glowing windows
      ctx.fillStyle = '#111827';
      const buildingWidths = [45, 65, 38, 75, 52, 48, 70, 85];
      let bX = 5;
      buildingWidths.forEach((bw, idx) => {
        const bh = 55 + ((idx * 29) % 55);
        ctx.fillRect(bX, height * 0.45 - bh, bw, bh);

        // Windows
        ctx.fillStyle = (idx + Math.floor(state.frame / 20)) % 2 === 0 ? '#facc15' : '#38bdf8';
        for (let wy = height * 0.45 - bh + 8; wy < height * 0.45 - 8; wy += 12) {
          ctx.fillRect(bX + 8, wy, 4, 6);
          ctx.fillRect(bX + bw - 12, wy, 4, 6);
        }
        ctx.fillStyle = '#111827';
        bX += bw + 8;
      });

      // Ground Track Area
      const groundGrad = ctx.createLinearGradient(0, height * 0.45, 0, height);
      groundGrad.addColorStop(0, '#111827');
      groundGrad.addColorStop(1, '#030712');
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, height * 0.45, width, height * 0.55);

      // Vanishing Point
      const vpX = width / 2;
      const vpY = height * 0.43;

      const trackBaseWidth = width * 0.88;
      const trackTopWidth = width * 0.14;

      const laneXPos = (lane: number, zNorm: number) => {
        const currentWidth = trackBaseWidth * (1 - zNorm) + trackTopWidth * zNorm;
        const laneWidth = currentWidth / 3;
        return vpX + lane * laneWidth;
      };

      // Draw Glowing Neon Track Rails
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#818cf8';
      ctx.shadowBlur = 8;
      for (let l = -1.5; l <= 1.5; l += 1) {
        ctx.beginPath();
        ctx.moveTo(vpX + l * (trackTopWidth / 3), vpY);
        ctx.lineTo(vpX + l * (trackBaseWidth / 3), height);
        ctx.stroke();
      }
      ctx.shadowBlur = 0;

      // Moving High-Speed Track Ties / Sleepers
      const sleeperOffset = (state.distance * 2.2) % 28;
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 2;
      for (let y = height; y > vpY; y -= 16) {
        const adjustedY = y - sleeperOffset;
        if (adjustedY <= vpY || adjustedY >= height) continue;
        const z = (height - adjustedY) / (height - vpY);
        const w = (trackBaseWidth * (1 - z) + trackTopWidth * z) / 2;
        ctx.beginPath();
        ctx.moveTo(vpX - w, adjustedY);
        ctx.lineTo(vpX + w, adjustedY);
        ctx.stroke();
      }

      // Overhead Tunnel Arch Rings (giving real 3D speed feel)
      const tunnelRingZ = (state.distance * 0.05) % 0.33;
      for (let rz = tunnelRingZ; rz < 1; rz += 0.33) {
        const ringY = vpY + (height - vpY) * (1 - rz);
        const ringWidth = trackBaseWidth * (1 - rz) + trackTopWidth * rz;
        const ringHeight = 110 * (1 - rz * 0.7);

        ctx.strokeStyle = 'rgba(129, 140, 248, 0.25)';
        ctx.lineWidth = Math.max(1, 4 * (1 - rz));
        ctx.beginPath();
        ctx.arc(vpX, ringY, ringWidth / 2, Math.PI, 0);
        ctx.stroke();
      }

      if (state.gameState === 'playing') {
        state.frame++;
        state.distance += state.speed * 0.12;
        state.speed = Math.min(14, 7 + state.distance * 0.006);
        setScore(Math.floor(state.distance * state.scoreMultiplier));

        // Smooth Lane Swerve with dynamic bank tilt
        const targetX = state.targetLane * (trackBaseWidth / 3.1);
        state.playerX += (targetX - state.playerX) * 0.28;

        // Jump Physics
        if (state.isJumping) {
          state.playerY += state.jumpVelocity;
          state.jumpVelocity -= 0.82;
          if (state.playerY <= 0) {
            state.playerY = 0;
            state.isJumping = false;
            triggerShake(4);
          }
        }

        // Slide Timer
        if (state.isSliding) {
          state.slideTimer--;
          if (state.slideTimer <= 0) {
            state.isSliding = false;
          }
        }

        // Timers for Powerups
        if (state.hasMagnet) {
          state.magnetTimer--;
          if (state.magnetTimer <= 0) {
            state.hasMagnet = false;
            setActivePowerup(null);
          }
        }
        if (state.scoreMultiplier > 1) {
          state.multiplierTimer--;
          if (state.multiplierTimer <= 0) {
            state.scoreMultiplier = 1;
            setActivePowerup(null);
          }
        }

        // Hoverboard Spark Particles
        if (state.frame % 2 === 0) {
          state.particles.push({
            x: vpX + state.playerX + (Math.random() - 0.5) * 16,
            y: height - 20 - state.playerY,
            vx: (Math.random() - 0.5) * 2,
            vy: Math.random() * 2 + 1,
            life: 18,
            maxLife: 18,
            color: state.hasMagnet ? '#a855f7' : state.scoreMultiplier > 1 ? '#38bdf8' : '#f43f5e',
            size: Math.random() * 3 + 2
          });
        }

        // Spawn Obstacles (Barriers, Bullet Trains, Overhead Signs)
        if (state.frame % 52 === 0) {
          const lane = Math.floor(Math.random() * 3) - 1;
          const types: ('barrier' | 'train' | 'overhead')[] = ['barrier', 'train', 'overhead'];
          const type = types[Math.floor(Math.random() * types.length)];
          state.obstacles.push({ z: 1, lane, type, passed: false });
        }

        // Spawn Coins in strings
        if (state.frame % 18 === 0) {
          const lane = Math.floor(Math.random() * 3) - 1;
          state.coinItems.push({ z: 1, lane, xOffset: 0, collected: false });
        }

        // Spawn Powerups (Magnet & 2X Multiplier)
        if (state.frame % 280 === 0) {
          const lane = Math.floor(Math.random() * 3) - 1;
          const pType = Math.random() > 0.5 ? 'magnet' : 'multiplier';
          state.powerups.push({ z: 1, lane, type: pType, collected: false });
        }

        // Move Obstacles
        for (let i = state.obstacles.length - 1; i >= 0; i--) {
          const obs = state.obstacles[i];
          obs.z -= state.speed * 0.0024;

          if (obs.z <= 0) {
            state.obstacles.splice(i, 1);
            continue;
          }

          // Collision Check
          if (obs.z > 0.08 && obs.z < 0.22 && !obs.passed) {
            const laneDiff = Math.abs(state.playerX - obs.lane * (trackBaseWidth / 3.1));
            if (laneDiff < 32) {
              if (obs.type === 'barrier' && !state.isJumping) {
                state.gameState = 'gameover';
                setGameState('gameover');
                triggerShake(20);
                arcadeAudio.playCrash();
              } else if (obs.type === 'overhead' && !state.isSliding) {
                state.gameState = 'gameover';
                setGameState('gameover');
                triggerShake(20);
                arcadeAudio.playCrash();
              } else if (obs.type === 'train') {
                state.gameState = 'gameover';
                setGameState('gameover');
                triggerShake(25);
                arcadeAudio.playCrash();
              }
            }
          }
        }

        // Move & Magnetize Coins
        for (let i = state.coinItems.length - 1; i >= 0; i--) {
          const coin = state.coinItems[i];
          coin.z -= state.speed * 0.0024;

          if (coin.z <= 0) {
            state.coinItems.splice(i, 1);
            continue;
          }

          // Magnet Attraction Logic
          if (state.hasMagnet && coin.z < 0.65) {
            const coinX = laneXPos(coin.lane, coin.z);
            const playerScreenX = vpX + state.playerX;
            coin.xOffset += (playerScreenX - coinX) * 0.18;
          }

          // Collection Collision
          if (coin.z > 0.06 && coin.z < 0.26 && !coin.collected) {
            const currentCoinX = laneXPos(coin.lane, coin.z) + coin.xOffset;
            const playerScreenX = vpX + state.playerX;
            if (Math.abs(currentCoinX - playerScreenX) < 38) {
              coin.collected = true;
              state.coins += 1;
              setCoins(state.coins);
              arcadeAudio.playCoin(1 + (state.coins % 8) * 0.08);
              spawnCoinParticles(playerScreenX, height - 40 - state.playerY);
            }
          }
        }

        // Move & Collect Powerups
        for (let i = state.powerups.length - 1; i >= 0; i--) {
          const p = state.powerups[i];
          p.z -= state.speed * 0.0024;

          if (p.z <= 0) {
            state.powerups.splice(i, 1);
            continue;
          }

          if (p.z > 0.06 && p.z < 0.24 && !p.collected) {
            const laneDiff = Math.abs(state.playerX - p.lane * (trackBaseWidth / 3.1));
            if (laneDiff < 36) {
              p.collected = true;
              triggerShake(8);
              arcadeAudio.playVictory();

              if (p.type === 'magnet') {
                state.hasMagnet = true;
                state.magnetTimer = 240; // 4 seconds
                setActivePowerup('🧲 COIN MAGNET!');
                addFloatingText('MAGNET! 🧲', vpX + state.playerX, height - 70, '#c084fc');
              } else {
                state.scoreMultiplier = 2;
                state.multiplierTimer = 240;
                setActivePowerup('⚡ 2X MULTIPLIER!');
                addFloatingText('2X BOOST! ⚡', vpX + state.playerX, height - 70, '#38bdf8');
              }
            }
          }
        }

        // High Score
        const total = Math.floor(state.distance * state.scoreMultiplier) + state.coins * 10;
        if (total > highScore) {
          setHighScore(total);
          try {
            localStorage.setItem('subway_runner_highscore', total.toString());
          } catch (_) {}
        }
      }

      // Render Obstacles (3D Depth Sorted)
      state.obstacles
        .slice()
        .sort((a, b) => b.z - a.z)
        .forEach((obs) => {
          const z = obs.z;
          const currentY = vpY + (height - vpY) * (1 - z);
          const x = laneXPos(obs.lane, z);
          const scale = 1 - z * 0.82;

          if (obs.type === 'train') {
            const tW = 46 * scale;
            const tH = 68 * scale;
            // Train Cab
            ctx.fillStyle = '#dc2626';
            ctx.fillRect(x - tW / 2, currentY - tH, tW, tH);

            // High-voltage Train Headlights
            ctx.fillStyle = '#fef08a';
            ctx.shadowColor = '#facc15';
            ctx.shadowBlur = 10 * scale;
            ctx.fillRect(x - tW / 2 + 5 * scale, currentY - 14 * scale, 7 * scale, 7 * scale);
            ctx.fillRect(x + tW / 2 - 12 * scale, currentY - 14 * scale, 7 * scale, 7 * scale);
            ctx.shadowBlur = 0;

            // Windshield
            ctx.fillStyle = '#38bdf8';
            ctx.fillRect(x - tW / 2 + 6 * scale, currentY - tH + 8 * scale, tW - 12 * scale, 18 * scale);
          } else if (obs.type === 'barrier') {
            const bW = 42 * scale;
            const bH = 24 * scale;
            ctx.fillStyle = '#f59e0b';
            ctx.fillRect(x - bW / 2, currentY - bH, bW, bH);
            // Caution diagonal stripes
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(x - bW / 4, currentY - bH, 6 * scale, bH);
            ctx.fillRect(x + bW / 6, currentY - bH, 6 * scale, bH);
          } else if (obs.type === 'overhead') {
            const oW = 50 * scale;
            const oH = 15 * scale;
            const clearance = 30 * scale;
            ctx.fillStyle = '#9333ea';
            ctx.fillRect(x - oW / 2, currentY - clearance - oH, oW, oH);
            // Neon Warning Text on Sign
            ctx.fillStyle = '#fef08a';
            ctx.font = `bold ${Math.max(6, 9 * scale)}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText('DUCK ⬇', x, currentY - clearance - 3 * scale);

            // Metal Pillars
            ctx.fillStyle = '#6b7280';
            ctx.fillRect(x - oW / 2, currentY - clearance, 3 * scale, clearance);
            ctx.fillRect(x + oW / 2 - 3 * scale, currentY - clearance, 3 * scale, clearance);
          }
        });

      // Render Coins with Shimmer Rotation
      state.coinItems.forEach((coin) => {
        if (coin.collected) return;
        const z = coin.z;
        const currentY = vpY + (height - vpY) * (1 - z) - 16 * (1 - z);
        const x = laneXPos(coin.lane, z) + coin.xOffset;
        const r = Math.max(3, 8 * (1 - z * 0.7));

        // Pulsing Coin Spin
        const spinW = Math.abs(Math.sin((state.frame + coin.z * 10) * 0.15)) * r;

        ctx.fillStyle = '#facc15';
        ctx.shadowColor = '#eab308';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.ellipse(x, currentY, Math.max(2, spinW), r, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ca8a04';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // Render Powerup Orbs
      state.powerups.forEach((p) => {
        if (p.collected) return;
        const z = p.z;
        const currentY = vpY + (height - vpY) * (1 - z) - 24 * (1 - z);
        const x = laneXPos(p.lane, z);
        const r = Math.max(5, 12 * (1 - z * 0.7));

        ctx.fillStyle = p.type === 'magnet' ? '#c084fc' : '#38bdf8';
        ctx.shadowColor = p.type === 'magnet' ? '#a855f7' : '#0284c7';
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(x, currentY, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.max(7, 12 * (1 - z * 0.7))}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(p.type === 'magnet' ? '🧲' : '2X', x, currentY + 4 * (1 - z * 0.7));
      });

      // Render Particles
      for (let i = state.particles.length - 1; i >= 0; i--) {
        const pt = state.particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life--;

        if (pt.life <= 0) {
          state.particles.splice(i, 1);
          continue;
        }

        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size * (pt.life / pt.maxLife), 0, Math.PI * 2);
        ctx.fill();
      }

      // Render Surfer Character with animated running cycle
      const pBaseY = height - 26 - state.playerY;
      const pX = vpX + state.playerX;
      const bankAngle = (state.targetLane * (trackBaseWidth / 3.1) - state.playerX) * 0.003;

      ctx.save();
      ctx.translate(pX, pBaseY);
      ctx.rotate(bankAngle);

      if (state.isSliding) {
        // High-tech Cyber Skateboard
        ctx.fillStyle = '#06b6d4';
        ctx.shadowColor = '#22d3ee';
        ctx.shadowBlur = 10;
        ctx.fillRect(-22, 6, 44, 7);
        ctx.shadowBlur = 0;

        // Low Crouching Character
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(0, -5, 13, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Glowing Neon Hoverboard
        ctx.fillStyle = state.hasMagnet ? '#a855f7' : '#f43f5e';
        ctx.shadowColor = state.hasMagnet ? '#c084fc' : '#fb7185';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.ellipse(0, 8, 22, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Running Leg Cycle
        const runPhase = Math.sin(state.frame * 0.4);
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-6, -6);
        ctx.lineTo(-6 + runPhase * 6, 6);
        ctx.moveTo(6, -6);
        ctx.lineTo(6 - runPhase * 6, 6);
        ctx.stroke();

        // Runner Hoodie Body
        ctx.fillStyle = '#4f46e5';
        ctx.fillRect(-9, -28, 18, 24);

        // Swinging Arms
        ctx.strokeStyle = '#818cf8';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(-9, -24);
        ctx.lineTo(-9 - runPhase * 8, -12);
        ctx.moveTo(9, -24);
        ctx.lineTo(9 + runPhase * 8, -12);
        ctx.stroke();

        // Head & Cap
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.arc(0, -34, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ef4444'; // Cap Visor
        ctx.fillRect(-9, -41, 20, 5);
      }
      ctx.restore();

      // Render Floating Text Popups
      for (let i = state.floatingTexts.length - 1; i >= 0; i--) {
        const ft = state.floatingTexts[i];
        ft.y -= 1.2;
        ft.life--;

        if (ft.life <= 0) {
          state.floatingTexts.splice(i, 1);
          continue;
        }

        ctx.fillStyle = ft.color;
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, ft.x, ft.y);
      }

      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [highScore]);

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative rounded-3xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-950">
        <canvas
          ref={canvasRef}
          width={480}
          height={320}
          onClick={jump}
          className="cursor-pointer block max-w-full touch-none"
        />

        {gameState === 'idle' && (
          <div
            onClick={startGame}
            className="absolute inset-0 bg-slate-950/75 flex flex-col items-center justify-center p-6 text-center cursor-pointer select-none"
          >
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-600 to-pink-500 border border-indigo-400/50 text-white flex items-center justify-center mb-3 shadow-xl animate-bounce">
              <Play className="w-8 h-8 fill-current ml-1" />
            </div>
            <h3 className="text-2xl font-black text-white tracking-wide mb-1">
              Subway Contributor Rush
            </h3>
            <p className="text-xs text-slate-300 max-w-xs mb-4 leading-relaxed">
              3D Endless Rail Runner! Switch lanes, jump oncoming bullet trains, slide under signs, and grab Coin Magnets!
            </p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm px-6 py-3 rounded-2xl transition flex items-center gap-2 shadow-xl"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Tap or Press Space to Rush!</span>
            </button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div
            onClick={startGame}
            className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center cursor-pointer select-none"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-1">
              Train Wreck!
            </span>
            <h3 className="text-3xl font-black text-white mb-2">Game Over</h3>
            <div className="flex items-center gap-4 bg-slate-900/90 border border-slate-800 px-6 py-3 rounded-2xl mb-4 shadow">
              <div>
                <span className="text-[10px] uppercase text-slate-400 font-bold block">Distance</span>
                <span className="text-xl font-black text-amber-400 font-mono">{score}m</span>
              </div>
              <div className="w-px h-8 bg-slate-800" />
              <div>
                <span className="text-[10px] uppercase text-slate-400 font-bold block">Coins</span>
                <span className="text-xl font-black text-yellow-300 font-mono">{coins} 🪙</span>
              </div>
              <div className="w-px h-8 bg-slate-800" />
              <div>
                <span className="text-[10px] uppercase text-slate-400 font-bold block">Record</span>
                <span className="text-xl font-black text-emerald-400 font-mono">{highScore}</span>
              </div>
            </div>
            <button
              onClick={startGame}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition flex items-center gap-2 shadow-lg"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Again (Spacebar)</span>
            </button>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="absolute top-3 left-4 right-4 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-3">
              <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 px-3 py-1 rounded-xl text-white font-mono font-bold text-sm">
                {score}m
              </div>
              <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 px-3 py-1 rounded-xl text-yellow-400 font-mono font-bold text-sm flex items-center gap-1">
                <span>🪙</span>
                <span>{coins}</span>
              </div>
            </div>

            {activePowerup && (
              <div className="bg-purple-950/90 border border-purple-500/50 px-3 py-1 rounded-xl text-purple-200 text-xs font-black animate-pulse shadow-lg">
                {activePowerup}
              </div>
            )}
          </div>
        )}
      </div>

      {/* On-Screen Touch Controls */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={moveLeft}
          className="p-3 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-white rounded-2xl shadow transition"
          title="Move Left (A / Left Arrow)"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button
          onClick={jump}
          className="p-3 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-white rounded-2xl shadow transition"
          title="Jump (W / Up Arrow / Space)"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
        <button
          onClick={slide}
          className="p-3 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-white rounded-2xl shadow transition"
          title="Slide / Roll (S / Down Arrow)"
        >
          <ArrowDown className="w-5 h-5" />
        </button>
        <button
          onClick={moveRight}
          className="p-3 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-white rounded-2xl shadow transition"
          title="Move Right (D / Right Arrow)"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center justify-between w-full max-w-[480px] text-xs text-slate-400 px-1">
        <span>Controls: <strong>A / D</strong> to switch lanes, <strong>W</strong> jump, <strong>S</strong> slide</span>
        <span>High Score: <strong className="text-emerald-400 font-mono">{highScore}</strong></span>
      </div>
    </div>
  );
};
