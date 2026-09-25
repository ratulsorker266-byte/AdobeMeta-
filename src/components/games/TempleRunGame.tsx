import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Shield, Zap, Sparkles, Trophy } from 'lucide-react';
import { arcadeAudio } from './ArcadeSoundEngine';

interface TempleRunProps {
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

export const TempleRunGame: React.FC<TempleRunProps> = ({ soundOn }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [score, setScore] = useState<number>(0);
  const [coins, setCoins] = useState<number>(0);
  const [activePowerup, setActivePowerup] = useState<string | null>(null);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('temple_run_highscore') || '0', 10);
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
    speed: 7.5,
    distance: 0,
    coins: 0,
    scoreMultiplier: 1,
    hasShield: false,
    shieldTimer: 0,
    hasMagnet: false,
    magnetTimer: 0,
    boostTimer: 0,
    monkeyDistance: 50, // 0 = caught, 100 = far behind
    stumblePenalty: 0,
    screenShake: 0,
    obstacles: [] as {
      z: number;
      lane: number;
      type: 'log' | 'arch' | 'firepit';
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
      type: 'shield' | 'magnet' | 'boost';
      collected: boolean;
    }[],
    particles: [] as Particle[],
    floatingTexts: [] as FloatingText[],
    frame: 0
  });

  useEffect(() => {
    arcadeAudio.soundEnabled = soundOn;
  }, [soundOn]);

  const triggerShake = (amount = 10) => {
    stateRef.current.screenShake = amount;
  };

  const addFloatingText = (text: string, x: number, y: number, color = '#facc15') => {
    stateRef.current.floatingTexts.push({
      id: Date.now() + Math.random(),
      text,
      x,
      y,
      color,
      life: 40
    });
  };

  const spawnParticles = (x: number, y: number, color: string, count = 12) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = 2 + Math.random() * 4.5;
      stateRef.current.particles.push({
        x,
        y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd - 1,
        life: 25 + Math.random() * 15,
        maxLife: 40,
        color,
        size: 3 + Math.random() * 3
      });
    }
  };

  const startGame = () => {
    const s = stateRef.current;
    s.gameState = 'playing';
    s.lane = 0;
    s.targetLane = 0;
    s.playerX = 0;
    s.playerY = 0;
    s.isJumping = false;
    s.jumpVelocity = 0;
    s.isSliding = false;
    s.slideTimer = 0;
    s.speed = 7.5;
    s.distance = 0;
    s.coins = 0;
    s.scoreMultiplier = 1;
    s.hasShield = false;
    s.shieldTimer = 0;
    s.hasMagnet = false;
    s.magnetTimer = 0;
    s.boostTimer = 0;
    s.monkeyDistance = 60;
    s.stumblePenalty = 0;
    s.obstacles = [];
    s.coinItems = [];
    s.powerups = [];
    s.particles = [];
    s.floatingTexts = [];
    s.frame = 0;

    setScore(0);
    setCoins(0);
    setActivePowerup(null);
    setGameState('playing');
    arcadeAudio.playJump();
  };

  // Lane movement and actions
  const moveLeft = () => {
    if (stateRef.current.gameState !== 'playing') return;
    if (stateRef.current.targetLane > -1) {
      stateRef.current.targetLane--;
      arcadeAudio.playSlide();
    }
  };

  const moveRight = () => {
    if (stateRef.current.gameState !== 'playing') return;
    if (stateRef.current.targetLane < 1) {
      stateRef.current.targetLane++;
      arcadeAudio.playSlide();
    }
  };

  const jump = () => {
    if (stateRef.current.gameState !== 'playing') {
      startGame();
      return;
    }
    const s = stateRef.current;
    if (!s.isJumping) {
      s.isJumping = true;
      s.jumpVelocity = 14;
      s.isSliding = false;
      arcadeAudio.playJump();
    }
  };

  const slide = () => {
    if (stateRef.current.gameState !== 'playing') return;
    const s = stateRef.current;
    if (s.isJumping) {
      s.playerY = 0;
      s.isJumping = false;
    }
    s.isSliding = true;
    s.slideTimer = 34;
    arcadeAudio.playSlide();
  };

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

  // Main 60fps Game Loop
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

      // Handle Screen Shake
      ctx.save();
      if (state.screenShake > 0) {
        const shakeX = (Math.random() - 0.5) * state.screenShake;
        const shakeY = (Math.random() - 0.5) * state.screenShake;
        ctx.translate(shakeX, shakeY);
        state.screenShake *= 0.88;
        if (state.screenShake < 0.5) state.screenShake = 0;
      }

      ctx.clearRect(0, 0, width, height);

      // Deep Ancient Jungle Sky Background
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.45);
      skyGrad.addColorStop(0, '#052e16'); // Dark jungle green
      skyGrad.addColorStop(0.6, '#064e3b');
      skyGrad.addColorStop(1, '#065f46');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height * 0.45);

      // Jungle Canopy Mountain Silhouettes
      ctx.fillStyle = '#022c22';
      ctx.beginPath();
      ctx.moveTo(0, height * 0.45);
      for (let x = 0; x <= width; x += 30) {
        const hOffset = Math.sin((x + state.distance * 0.5) * 0.02) * 20 + Math.cos(x * 0.05) * 12;
        ctx.lineTo(x, height * 0.38 - hOffset);
      }
      ctx.lineTo(width, height * 0.45);
      ctx.fill();

      // Ancient Stone Wall Abyss
      const abyssGrad = ctx.createLinearGradient(0, height * 0.45, 0, height);
      abyssGrad.addColorStop(0, '#1c1917');
      abyssGrad.addColorStop(1, '#0c0a09');
      ctx.fillStyle = abyssGrad;
      ctx.fillRect(0, height * 0.45, width, height * 0.55);

      // 3D Perspective Projection Constants
      const vpX = width / 2;
      const vpY = height * 0.44;
      const pathBaseWidth = width * 0.84;
      const pathTopWidth = width * 0.12;

      const laneXPos = (lane: number, zNorm: number) => {
        const currentWidth = pathBaseWidth * (1 - zNorm) + pathTopWidth * zNorm;
        const laneWidth = currentWidth / 3;
        return vpX + lane * laneWidth;
      };

      // Ancient Stone Path with Mossy Tiles
      ctx.fillStyle = '#44403c';
      ctx.beginPath();
      ctx.moveTo(vpX - pathTopWidth / 2, vpY);
      ctx.lineTo(vpX + pathTopWidth / 2, vpY);
      ctx.lineTo(vpX + pathBaseWidth / 2, height);
      ctx.lineTo(vpX - pathBaseWidth / 2, height);
      ctx.closePath();
      ctx.fill();

      // Stone Tile Seams rushing forward
      const tileOffset = (state.distance * 3.5) % 26;
      ctx.strokeStyle = '#292524';
      ctx.lineWidth = 2.5;
      for (let y = height; y > vpY; y -= 18) {
        const adjustedY = y - tileOffset;
        if (adjustedY <= vpY || adjustedY >= height) continue;
        const z = (height - adjustedY) / (height - vpY);
        const w = (pathBaseWidth * (1 - z) + pathTopWidth * z) / 2;
        ctx.beginPath();
        ctx.moveTo(vpX - w, adjustedY);
        ctx.lineTo(vpX + w, adjustedY);
        ctx.stroke();
      }

      // Stone Path Golden Runes Borders (Glowing)
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(vpX - pathTopWidth / 2, vpY);
      ctx.lineTo(vpX - pathBaseWidth / 2, height);
      ctx.moveTo(vpX + pathTopWidth / 2, vpY);
      ctx.lineTo(vpX + pathBaseWidth / 2, height);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Flaming Torches on Temple Pillars
      const torchZ = (state.distance * 0.04) % 0.35;
      for (let tz = torchZ; tz < 1; tz += 0.35) {
        const curY = vpY + (height - vpY) * (1 - tz);
        const curW = (pathBaseWidth * (1 - tz) + pathTopWidth * tz) / 2;
        const scale = 1 - tz * 0.75;

        // Left Torch
        const lx = vpX - curW - 8 * scale;
        ctx.fillStyle = '#78350f';
        ctx.fillRect(lx - 3 * scale, curY - 24 * scale, 6 * scale, 24 * scale);
        // Flame
        ctx.fillStyle = '#f97316';
        ctx.shadowColor = '#ea580c';
        ctx.shadowBlur = 10 * scale;
        ctx.beginPath();
        ctx.arc(lx, curY - 26 * scale, 5 * scale, 0, Math.PI * 2);
        ctx.fill();

        // Right Torch
        const rx = vpX + curW + 8 * scale;
        ctx.fillStyle = '#78350f';
        ctx.fillRect(rx - 3 * scale, curY - 24 * scale, 6 * scale, 24 * scale);
        // Flame
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.arc(rx, curY - 26 * scale, 5 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Game Logic updates
      if (state.gameState === 'playing') {
        state.frame++;
        const currentSpeed = state.boostTimer > 0 ? state.speed * 1.8 : state.speed;
        state.distance += currentSpeed * 0.12;
        state.speed = Math.min(15, 7.5 + state.distance * 0.007);
        setScore(Math.floor(state.distance * state.scoreMultiplier));

        // Smooth Lane Swerve
        const targetX = state.targetLane * (pathBaseWidth / 3.2);
        state.playerX += (targetX - state.playerX) * 0.28;

        // Jump Physics
        if (state.isJumping) {
          state.playerY += state.jumpVelocity;
          state.jumpVelocity -= 0.85;
          if (state.playerY <= 0) {
            state.playerY = 0;
            state.isJumping = false;
            triggerShake(3);
          }
        }

        // Slide Timer
        if (state.isSliding) {
          state.slideTimer--;
          if (state.slideTimer <= 0) {
            state.isSliding = false;
          }
        }

        // Powerup Timers
        if (state.shieldTimer > 0) {
          state.shieldTimer--;
          if (state.shieldTimer <= 0) state.hasShield = false;
        }
        if (state.magnetTimer > 0) {
          state.magnetTimer--;
          if (state.magnetTimer <= 0) state.hasMagnet = false;
        }
        if (state.boostTimer > 0) {
          state.boostTimer--;
          spawnParticles(vpX + state.playerX, height - 20, '#f97316', 2);
        }

        // Demon Monkey Pursuit Physics
        if (state.stumblePenalty > 0) {
          state.stumblePenalty--;
          state.monkeyDistance = Math.max(12, state.monkeyDistance - 0.7);
        } else {
          state.monkeyDistance = Math.min(70, state.monkeyDistance + 0.15);
        }

        // Spawn Obstacles
        if (state.frame % 70 === 0) {
          const lane = Math.floor(Math.random() * 3) - 1;
          const types: ('log' | 'arch' | 'firepit')[] = ['log', 'arch', 'firepit'];
          const type = types[Math.floor(Math.random() * types.length)];
          state.obstacles.push({ z: 1, lane, type, passed: false });
        }

        // Spawn Coins
        if (state.frame % 35 === 0) {
          const lane = Math.floor(Math.random() * 3) - 1;
          for (let c = 0; c < 4; c++) {
            state.coinItems.push({
              z: 1 + c * 0.05,
              lane,
              xOffset: 0,
              collected: false
            });
          }
        }

        // Spawn Powerups
        if (state.frame % 280 === 0) {
          const lane = Math.floor(Math.random() * 3) - 1;
          const types: ('shield' | 'magnet' | 'boost')[] = ['shield', 'magnet', 'boost'];
          state.powerups.push({
            z: 1,
            lane,
            type: types[Math.floor(Math.random() * types.length)],
            collected: false
          });
        }

        // Move Obstacles
        for (let i = state.obstacles.length - 1; i >= 0; i--) {
          const obs = state.obstacles[i];
          obs.z -= 0.016 * (currentSpeed / 7.5);

          // Collision Check
          if (obs.z < 0.18 && obs.z > 0.02 && !obs.passed) {
            const laneDiff = Math.abs(state.targetLane - obs.lane);
            if (laneDiff < 0.65) {
              // Check Jump/Slide avoidance
              let avoided = false;
              if (obs.type === 'log' && state.playerY > 18) avoided = true;
              if (obs.type === 'arch' && state.isSliding) avoided = true;
              if (obs.type === 'firepit' && state.playerY > 22) avoided = true;

              if (avoided) {
                obs.passed = true;
                addFloatingText('+50 IDOL EVASION!', vpX + state.playerX, height - 80, '#38bdf8');
                arcadeAudio.playStunt();
              } else if (state.hasShield || state.boostTimer > 0) {
                // Shield smashes obstacle!
                obs.passed = true;
                triggerShake(8);
                spawnParticles(vpX + state.playerX, height - 40, '#38bdf8', 20);
                addFloatingText('SMASHED!', vpX + state.playerX, height - 70, '#38bdf8');
                arcadeAudio.playExplosion();
              } else {
                // Trip or Caught by Demon Monkey
                if (state.monkeyDistance < 25) {
                  // Game Over!
                  state.gameState = 'gameover';
                  setGameState('gameover');
                  triggerShake(18);
                  arcadeAudio.playCrash();
                } else {
                  // Stumble! Monkey lunges close!
                  obs.passed = true;
                  state.stumblePenalty = 120;
                  state.monkeyDistance = 18;
                  triggerShake(10);
                  addFloatingText('⚠️ STUMBLE! MONKEY NEAR!', vpX + state.playerX, height - 80, '#ef4444');
                  arcadeAudio.playCrash();
                }
              }
            }
          }

          if (obs.z <= 0) {
            state.obstacles.splice(i, 1);
          }
        }

        // Move Coins & Magnet Pull
        for (let i = state.coinItems.length - 1; i >= 0; i--) {
          const coin = state.coinItems[i];
          coin.z -= 0.016 * (currentSpeed / 7.5);

          if (state.hasMagnet && coin.z < 0.5) {
            const targetX = laneXPos(state.targetLane, coin.z);
            const curX = laneXPos(coin.lane, coin.z) + coin.xOffset;
            coin.xOffset += (targetX - curX) * 0.25;
          }

          if (coin.z < 0.22 && coin.z > 0 && !coin.collected) {
            const targetX = laneXPos(state.targetLane, coin.z);
            const curX = laneXPos(coin.lane, coin.z) + coin.xOffset;
            if (Math.abs(targetX - curX) < 30) {
              coin.collected = true;
              state.coins++;
              setCoins(state.coins);
              arcadeAudio.playCoin(1 + (state.coins % 8) * 0.1);
              spawnParticles(curX, height - 40, '#facc15', 8);
            }
          }

          if (coin.z <= 0) {
            state.coinItems.splice(i, 1);
          }
        }

        // Move Powerups
        for (let i = state.powerups.length - 1; i >= 0; i--) {
          const p = state.powerups[i];
          p.z -= 0.016 * (currentSpeed / 7.5);

          if (p.z < 0.22 && p.z > 0 && !p.collected) {
            if (Math.abs(state.targetLane - p.lane) < 0.6) {
              p.collected = true;
              if (p.type === 'shield') {
                state.hasShield = true;
                state.shieldTimer = 360;
                addFloatingText('🛡️ SHIELD ACTIVE!', vpX + state.playerX, height - 70, '#38bdf8');
              } else if (p.type === 'magnet') {
                state.hasMagnet = true;
                state.magnetTimer = 360;
                addFloatingText('🧲 COIN VACUUM!', vpX + state.playerX, height - 70, '#c084fc');
              } else if (p.type === 'boost') {
                state.boostTimer = 240;
                addFloatingText('⚡ HYPER SPRINT!', vpX + state.playerX, height - 70, '#f97316');
              }
              arcadeAudio.playVictory();
            }
          }

          if (p.z <= 0) {
            state.powerups.splice(i, 1);
          }
        }

        // High Score
        const total = Math.floor(state.distance) + state.coins * 10;
        if (total > highScore) {
          setHighScore(total);
          try {
            localStorage.setItem('temple_run_highscore', total.toString());
          } catch (_) {}
        }
      }

      // Render Obstacles (3D Depth)
      state.obstacles
        .slice()
        .sort((a, b) => b.z - a.z)
        .forEach((obs) => {
          const z = obs.z;
          const currentY = vpY + (height - vpY) * (1 - z);
          const x = laneXPos(obs.lane, z);
          const scale = 1 - z * 0.82;

          if (obs.type === 'log') {
            // Fallen mossy log across lane
            const lW = 50 * scale;
            const lH = 14 * scale;
            ctx.fillStyle = '#78350f';
            ctx.fillRect(x - lW / 2, currentY - lH, lW, lH);
            // Moss top
            ctx.fillStyle = '#15803d';
            ctx.fillRect(x - lW / 2, currentY - lH - 3 * scale, lW, 4 * scale);
          } else if (obs.type === 'arch') {
            // Ancient Spiked Stone Arch
            const aW = 54 * scale;
            const aH = 18 * scale;
            const clearance = 26 * scale;
            ctx.fillStyle = '#57534e';
            ctx.fillRect(x - aW / 2, currentY - clearance - aH, aW, aH);
            // Spikes hanging down
            ctx.fillStyle = '#dc2626';
            ctx.font = `bold ${Math.max(6, 10 * scale)}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText('SLIDE ⬇', x, currentY - clearance - 3 * scale);
            // Pillars
            ctx.fillStyle = '#44403c';
            ctx.fillRect(x - aW / 2, currentY - clearance, 4 * scale, clearance);
            ctx.fillRect(x + aW / 2 - 4 * scale, currentY - clearance, 4 * scale, clearance);
          } else if (obs.type === 'firepit') {
            // Blazing Fire Trap
            const fW = 44 * scale;
            const fH = 10 * scale;
            ctx.fillStyle = '#b91c1c';
            ctx.fillRect(x - fW / 2, currentY - fH, fW, fH);
            ctx.fillStyle = '#f97316';
            ctx.beginPath();
            ctx.arc(x, currentY - fH / 2, 12 * scale, 0, Math.PI * 2);
            ctx.fill();
          }
        });

      // Render Coins
      state.coinItems.forEach((coin) => {
        if (coin.collected) return;
        const z = coin.z;
        const currentY = vpY + (height - vpY) * (1 - z) - 14 * (1 - z);
        const x = laneXPos(coin.lane, z) + coin.xOffset;
        const r = Math.max(3, 8 * (1 - z * 0.7));
        const spinW = Math.abs(Math.sin((state.frame + coin.z * 10) * 0.2)) * r;

        ctx.fillStyle = '#facc15';
        ctx.shadowColor = '#eab308';
        ctx.shadowBlur = 6;
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
        const currentY = vpY + (height - vpY) * (1 - z) - 22 * (1 - z);
        const x = laneXPos(p.lane, z);
        const r = Math.max(5, 12 * (1 - z * 0.7));

        ctx.fillStyle = p.type === 'shield' ? '#38bdf8' : p.type === 'magnet' ? '#c084fc' : '#f97316';
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(x, currentY, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.max(7, 12 * (1 - z * 0.7))}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(p.type === 'shield' ? '🛡️' : p.type === 'magnet' ? '🧲' : '⚡', x, currentY + 4 * (1 - z * 0.7));
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

      // Render Player (Adventurer Guy)
      const pBaseY = height - 24 - state.playerY;
      const pX = vpX + state.playerX;
      const bankAngle = (state.targetLane * (pathBaseWidth / 3.2) - state.playerX) * 0.003;

      ctx.save();
      ctx.translate(pX, pBaseY);
      ctx.rotate(bankAngle);

      // Adventurer Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.beginPath();
      ctx.ellipse(0, 10 + state.playerY * 0.6, 18, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Shield Aura
      if (state.hasShield) {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#0284c7';
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(0, -18, 26, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      if (state.isSliding) {
        // Sliding on knees/dirt
        ctx.fillStyle = '#d97706';
        ctx.fillRect(-18, 4, 36, 6);
        ctx.fillStyle = '#78350f'; // Adventurer Hat
        ctx.beginPath();
        ctx.arc(6, -2, 10, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Running Adventurer
        const runCycle = Math.sin(state.frame * 0.45);

        // Legs
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-6, -4);
        ctx.lineTo(-6 + runCycle * 7, 8);
        ctx.moveTo(6, -4);
        ctx.lineTo(6 - runCycle * 7, 8);
        ctx.stroke();

        // Leather Jacket / Body
        ctx.fillStyle = '#92400e';
        ctx.fillRect(-8, -26, 16, 22);

        // Arms swinging
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(-8, -22);
        ctx.lineTo(-8 - runCycle * 8, -10);
        ctx.moveTo(8, -22);
        ctx.lineTo(8 + runCycle * 8, -10);
        ctx.stroke();

        // Head & Fedora Hat
        ctx.fillStyle = '#fed7aa'; // Face
        ctx.beginPath();
        ctx.arc(0, -32, 9, 0, Math.PI * 2);
        ctx.fill();

        // Fedora
        ctx.fillStyle = '#451a03';
        ctx.fillRect(-12, -40, 24, 4);
        ctx.fillRect(-7, -46, 14, 7);
      }
      ctx.restore();

      // Render Demon Monkey Chasing Behind!
      const monkeyY = height - 10 + (state.monkeyDistance - 20) * 0.8;
      if (state.monkeyDistance < 55) {
        ctx.save();
        ctx.translate(pX * 0.85 + (vpX * 0.15), monkeyY);
        // Demon Monkey Body (Black shadow with fiery red eyes)
        ctx.fillStyle = '#1c1917';
        ctx.beginPath();
        ctx.arc(0, -18, 16, 0, Math.PI * 2);
        ctx.fill();
        // Arms lunging forward
        ctx.strokeStyle = '#1c1917';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(-12, -14);
        ctx.lineTo(-24, -28 + Math.sin(state.frame * 0.4) * 6);
        ctx.moveTo(12, -14);
        ctx.lineTo(24, -28 - Math.sin(state.frame * 0.4) * 6);
        ctx.stroke();
        // Glowing Red Demon Eyes
        ctx.fillStyle = '#ef4444';
        ctx.shadowColor = '#dc2626';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(-5, -20, 3, 0, Math.PI * 2);
        ctx.arc(5, -20, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();
      }

      // Render Floating Text
      for (let i = state.floatingTexts.length - 1; i >= 0; i--) {
        const ft = state.floatingTexts[i];
        ft.y -= 1.2;
        ft.life--;
        if (ft.life <= 0) {
          state.floatingTexts.splice(i, 1);
          continue;
        }
        ctx.fillStyle = ft.color;
        ctx.font = 'bold 13px sans-serif';
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
    <div className="flex flex-col items-center justify-center space-y-3 select-none">
      {/* Top HUD */}
      <div className="flex items-center justify-between w-full max-w-[480px] bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2 shadow">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-amber-400 font-black text-sm">🪙</span>
            <span className="font-mono font-bold text-amber-300 text-sm">{coins}</span>
          </div>
          <div className="w-px h-4 bg-slate-800" />
          <div>
            <span className="text-[10px] uppercase text-slate-400 font-bold block">Distance</span>
            <span className="font-mono font-bold text-white text-sm">{score}m</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs text-slate-400 font-mono">Best: <strong className="text-emerald-400">{highScore}</strong></span>
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
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mb-3 animate-bounce">
              <Play className="w-7 h-7 fill-current ml-0.5" />
            </div>
            <h3 className="text-xl font-black text-white tracking-wide mb-1">Temple Idol Run</h3>
            <p className="text-xs text-slate-300 max-w-xs mb-3">
              Escape the temple ruins! Jump over logs, slide under spiked arches, and dodge the Demon Monkey!
            </p>
            <button
              onClick={startGame}
              className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-2 shadow-lg"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Temple Run (Space / W)</span>
            </button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div
            onClick={startGame}
            className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center cursor-pointer select-none"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-1">
              Caught by Demon Monkey!
            </span>
            <h3 className="text-2xl font-black text-white mb-2">Game Over</h3>
            <div className="flex items-center gap-4 bg-slate-900/90 border border-slate-800 px-5 py-2.5 rounded-xl mb-4">
              <div>
                <span className="text-[10px] uppercase text-slate-400 font-bold block">Distance</span>
                <span className="text-xl font-black text-amber-400 font-mono">{score}m</span>
              </div>
              <div className="w-px h-8 bg-slate-800" />
              <div>
                <span className="text-[10px] uppercase text-slate-400 font-bold block">Coins</span>
                <span className="text-xl font-black text-emerald-400 font-mono">{coins}</span>
              </div>
            </div>
            <button
              onClick={startGame}
              className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-2 shadow-lg"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Run Again (Spacebar)</span>
            </button>
          </div>
        )}
      </div>

      {/* Controls Bar for Desktop & Mobile Touch */}
      <div className="flex items-center justify-center gap-2 w-full max-w-[480px]">
        <button
          onClick={moveLeft}
          className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1 border border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Left (A)</span>
        </button>
        <button
          onClick={jump}
          className="flex-1 py-2 bg-amber-600 hover:bg-amber-500 active:scale-95 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1 shadow-md"
        >
          <ArrowUp className="w-4 h-4" />
          <span>Jump (W)</span>
        </button>
        <button
          onClick={slide}
          className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1 shadow-md"
        >
          <ArrowDown className="w-4 h-4" />
          <span>Slide (S)</span>
        </button>
        <button
          onClick={moveRight}
          className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1 border border-slate-700"
        >
          <span>Right (D)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
