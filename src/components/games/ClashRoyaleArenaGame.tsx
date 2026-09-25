import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Swords, Shield, Zap, RotateCcw, Trophy, Crown, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { arcadeAudio } from './ArcadeSoundEngine';

interface ClashRoyaleProps {
  soundOn: boolean;
}

interface Troop {
  id: number;
  type: 'knight' | 'archer' | 'giant' | 'skeleton';
  side: 'player' | 'enemy';
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  speed: number;
  damage: number;
  range: number;
  attackCooldown: number;
  walkFrame: number;
}

interface Projectile {
  id: number;
  startX: number;
  startY: number;
  curX: number;
  curY: number;
  targetX: number;
  targetY: number;
  progress: number;
  type: 'arrow' | 'fireball' | 'cannon';
  damage: number;
  side: 'player' | 'enemy';
}

interface DamagePopup {
  id: number;
  text: string;
  x: number;
  y: number;
  color: string;
  life: number;
}

const CARDS = [
  { id: 'knight', name: 'Knight', cost: 3, icon: '⚔️', hp: 450, damage: 55, speed: 0.85, range: 20 },
  { id: 'archer', name: 'Archer', cost: 3, icon: '🏹', hp: 220, damage: 38, speed: 0.9, range: 75 },
  { id: 'giant', name: 'Giant', cost: 5, icon: '🗿', hp: 950, damage: 70, speed: 0.5, range: 24 },
  { id: 'skeleton', name: 'Skeletons', cost: 2, icon: '💀', hp: 120, damage: 32, speed: 1.2, range: 18 },
  { id: 'fireball', name: 'Fireball', cost: 4, icon: '🔥', hp: 0, damage: 240, speed: 0, range: 0 }
];

export const ClashRoyaleArenaGame: React.FC<ClashRoyaleProps> = ({ soundOn }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [elixir, setElixir] = useState<number>(5);
  const [selectedCard, setSelectedCard] = useState<string>('knight');
  const [playerTowers, setPlayerTowers] = useState({ left: 600, right: 600, king: 1000 });
  const [enemyTowers, setEnemyTowers] = useState({ left: 600, right: 600, king: 1000 });
  const [gameResult, setGameResult] = useState<'playing' | 'win' | 'defeat'>('playing');

  const stateRef = useRef({
    elixir: 5,
    enemyElixir: 4,
    troops: [] as Troop[],
    projectiles: [] as Projectile[],
    popups: [] as DamagePopup[],
    playerTowers: { left: 600, right: 600, king: 1000 },
    enemyTowers: { left: 600, right: 600, king: 1000 },
    gameResult: 'playing' as 'playing' | 'win' | 'defeat',
    towerCooldowns: { pLeft: 0, pRight: 0, eLeft: 0, eRight: 0 },
    frame: 0
  });

  useEffect(() => {
    arcadeAudio.soundEnabled = soundOn;
  }, [soundOn]);

  const addDamagePopup = (text: string, x: number, y: number, color = '#f87171') => {
    stateRef.current.popups.push({
      id: Date.now() + Math.random(),
      text,
      x,
      y,
      color,
      life: 35
    });
  };

  const resetGame = () => {
    const s = stateRef.current;
    s.elixir = 5;
    s.enemyElixir = 4;
    s.troops = [];
    s.projectiles = [];
    s.popups = [];
    s.playerTowers = { left: 600, right: 600, king: 1000 };
    s.enemyTowers = { left: 600, right: 600, king: 1000 };
    s.gameResult = 'playing';
    setPlayerTowers({ left: 600, right: 600, king: 1000 });
    setEnemyTowers({ left: 600, right: 600, king: 1000 });
    setGameResult('playing');
    setElixir(5);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (stateRef.current.gameResult !== 'playing') return;
    const card = CARDS.find((c) => c.id === selectedCard);
    if (!card || stateRef.current.elixir < card.cost) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    if (card.id === 'fireball') {
      // Can target anywhere
      stateRef.current.elixir -= card.cost;
      setElixir(Math.floor(stateRef.current.elixir));
      arcadeAudio.playExplosion();

      // Launch fireball projectile from player side
      stateRef.current.projectiles.push({
        id: Date.now() + Math.random(),
        startX: 180,
        startY: 320,
        curX: 180,
        curY: 320,
        targetX: clickX,
        targetY: clickY,
        progress: 0,
        type: 'fireball',
        damage: 240,
        side: 'player'
      });
      return;
    }

    // Deploy troop on player's half (Y >= 165)
    if (clickY < 165) return;

    stateRef.current.elixir -= card.cost;
    setElixir(Math.floor(stateRef.current.elixir));

    if (card.id === 'skeleton') {
      // Spawn 3 skeletons in triangle
      for (let s = 0; s < 3; s++) {
        stateRef.current.troops.push({
          id: Date.now() + Math.random() + s,
          type: 'skeleton',
          side: 'player',
          x: clickX + (s - 1) * 16,
          y: clickY + (s === 1 ? -12 : 6),
          hp: card.hp,
          maxHp: card.hp,
          speed: card.speed,
          damage: card.damage,
          range: card.range,
          attackCooldown: 0,
          walkFrame: 0
        });
      }
      arcadeAudio.playSword();
    } else {
      stateRef.current.troops.push({
        id: Date.now() + Math.random(),
        type: card.id as any,
        side: 'player',
        x: clickX,
        y: clickY,
        hp: card.hp,
        maxHp: card.hp,
        speed: card.speed,
        damage: card.damage,
        range: card.range,
        attackCooldown: 0,
        walkFrame: 0
      });
      if (card.id === 'archer') arcadeAudio.playArrow();
      else arcadeAudio.playSword();
    }
  };

  // Main 60fps Battle Loop
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

      // Arena Grass Ground
      ctx.fillStyle = '#15803d'; // Royal grass
      ctx.fillRect(0, 0, width, height);

      // Two Battle Lanes (Dirt pathways)
      ctx.fillStyle = '#b45309';
      ctx.fillRect(72, 20, 36, height - 40);
      ctx.fillRect(252, 20, 36, height - 40);

      // River Dividing Arena in Middle
      const riverGrad = ctx.createLinearGradient(0, 155, 0, 185);
      riverGrad.addColorStop(0, '#0284c7');
      riverGrad.addColorStop(1, '#0369a1');
      ctx.fillStyle = riverGrad;
      ctx.fillRect(0, 155, width, 30);

      // Water Ripple Waves
      ctx.strokeStyle = 'rgba(255,255,255,0.25)';
      ctx.lineWidth = 1.5;
      for (let rw = 10; rw < width; rw += 40) {
        ctx.beginPath();
        const waveX = (rw + state.frame * 0.8) % width;
        ctx.moveTo(waveX, 168);
        ctx.lineTo(waveX + 18, 168);
        ctx.stroke();
      }

      // Wooden Bridges Across River (Left & Right lanes)
      const drawBridge = (bx: number) => {
        ctx.fillStyle = '#78350f';
        ctx.fillRect(bx - 22, 150, 44, 40);
        // Wood Planks
        ctx.strokeStyle = '#451a03';
        ctx.lineWidth = 2;
        for (let py = 154; py < 190; py += 7) {
          ctx.beginPath();
          ctx.moveTo(bx - 22, py);
          ctx.lineTo(bx + 22, py);
          ctx.stroke();
        }
      };
      drawBridge(90);
      drawBridge(270);

      // Game Logic updates
      if (state.gameResult === 'playing') {
        state.frame++;

        // Elixir generation
        if (state.frame % 38 === 0) {
          state.elixir = Math.min(10, state.elixir + 1);
          setElixir(Math.floor(state.elixir));
        }

        // Enemy AI Spawns
        if (state.frame % 150 === 0) {
          const enemyOptions: ('knight' | 'archer' | 'giant' | 'skeleton')[] = [
            'knight',
            'archer',
            'giant',
            'skeleton'
          ];
          const chosen = enemyOptions[Math.floor(Math.random() * enemyOptions.length)];
          const laneX = Math.random() < 0.5 ? 90 : 270;
          const card = CARDS.find((c) => c.id === chosen)!;

          state.troops.push({
            id: Date.now() + Math.random(),
            type: chosen,
            side: 'enemy',
            x: laneX + (Math.random() - 0.5) * 20,
            y: 75,
            hp: card.hp,
            maxHp: card.hp,
            speed: card.speed,
            damage: card.damage,
            range: card.range,
            attackCooldown: 0,
            walkFrame: 0
          });
        }

        // Tower Defensive Fire (Player Towers)
        ['left', 'right'].forEach((side) => {
          const tx = side === 'left' ? 90 : 270;
          const ty = 270;
          const hp = side === 'left' ? state.playerTowers.left : state.playerTowers.right;
          if (hp <= 0) return;

          // Find closest enemy in range (110px)
          const target = state.troops.find(
            (t) => t.side === 'enemy' && Math.hypot(t.x - tx, t.y - ty) < 110
          );
          if (target && state.frame % 45 === 0) {
            state.projectiles.push({
              id: Date.now() + Math.random(),
              startX: tx,
              startY: ty,
              curX: tx,
              curY: ty,
              targetX: target.x,
              targetY: target.y,
              progress: 0,
              type: 'arrow',
              damage: 32,
              side: 'player'
            });
            arcadeAudio.playArrow();
          }
        });

        // Tower Defensive Fire (Enemy Towers)
        ['left', 'right'].forEach((side) => {
          const tx = side === 'left' ? 90 : 270;
          const ty = 70;
          const hp = side === 'left' ? state.enemyTowers.left : state.enemyTowers.right;
          if (hp <= 0) return;

          const target = state.troops.find(
            (t) => t.side === 'player' && Math.hypot(t.x - tx, t.y - ty) < 110
          );
          if (target && state.frame % 45 === 0) {
            state.projectiles.push({
              id: Date.now() + Math.random(),
              startX: tx,
              startY: ty,
              curX: tx,
              curY: ty,
              targetX: target.x,
              targetY: target.y,
              progress: 0,
              type: 'arrow',
              damage: 32,
              side: 'enemy'
            });
          }
        });

        // Update Projectiles
        for (let i = state.projectiles.length - 1; i >= 0; i--) {
          const p = state.projectiles[i];
          p.progress += p.type === 'fireball' ? 0.04 : 0.08;

          p.curX = p.startX + (p.targetX - p.startX) * p.progress;
          p.curY = p.startY + (p.targetY - p.startY) * p.progress;

          if (p.progress >= 1) {
            // Impact!
            if (p.type === 'fireball') {
              arcadeAudio.playExplosion();
              addDamagePopup('-240 AOE!', p.targetX, p.targetY, '#f97316');
              // Damage enemy troops in blast radius
              state.troops.forEach((t) => {
                if (t.side === 'enemy' && Math.hypot(t.x - p.targetX, t.y - p.targetY) < 55) {
                  t.hp -= p.damage;
                }
              });
              // Damage enemy towers if in radius
              if (Math.hypot(90 - p.targetX, 70 - p.targetY) < 45) {
                state.enemyTowers.left -= 180;
                setEnemyTowers({ ...state.enemyTowers });
              }
              if (Math.hypot(270 - p.targetX, 70 - p.targetY) < 45) {
                state.enemyTowers.right -= 180;
                setEnemyTowers({ ...state.enemyTowers });
              }
            } else {
              // Arrow impact
              addDamagePopup(`-${p.damage}`, p.targetX, p.targetY, '#f87171');
              // Find target troop nearby
              const hitTroop = state.troops.find(
                (t) => t.side !== p.side && Math.hypot(t.x - p.targetX, t.y - p.targetY) < 25
              );
              if (hitTroop) {
                hitTroop.hp -= p.damage;
              }
            }
            state.projectiles.splice(i, 1);
          }
        }

        // Troop Logic & Combat
        for (let i = state.troops.length - 1; i >= 0; i--) {
          const troop = state.troops[i];
          if (troop.hp <= 0) {
            state.troops.splice(i, 1);
            continue;
          }

          troop.walkFrame++;
          if (troop.attackCooldown > 0) troop.attackCooldown--;

          // Find Target: Enemy Troops first, else nearest Tower
          const enemyTroops = state.troops.filter((t) => t.side !== troop.side);
          let target: any = null;
          let minDist = 9999;

          enemyTroops.forEach((e) => {
            const d = Math.hypot(e.x - troop.x, e.y - troop.y);
            if (d < minDist) {
              minDist = d;
              target = e;
            }
          });

          // If no enemy troop close, target enemy towers
          if (minDist > troop.range + 35) {
            if (troop.side === 'player') {
              const dLeft = Math.hypot(90 - troop.x, 70 - troop.y);
              const dRight = Math.hypot(270 - troop.x, 70 - troop.y);
              if (state.enemyTowers.left > 0 && dLeft < minDist) {
                minDist = dLeft;
                target = { isTower: true, side: 'enemy', which: 'left', x: 90, y: 70 };
              }
              if (state.enemyTowers.right > 0 && dRight < minDist) {
                minDist = dRight;
                target = { isTower: true, side: 'enemy', which: 'right', x: 270, y: 70 };
              }
            } else {
              const dLeft = Math.hypot(90 - troop.x, 270 - troop.y);
              const dRight = Math.hypot(270 - troop.x, 270 - troop.y);
              if (state.playerTowers.left > 0 && dLeft < minDist) {
                minDist = dLeft;
                target = { isTower: true, side: 'player', which: 'left', x: 90, y: 270 };
              }
              if (state.playerTowers.right > 0 && dRight < minDist) {
                minDist = dRight;
                target = { isTower: true, side: 'player', which: 'right', x: 270, y: 270 };
              }
            }
          }

          // Move or Attack
          if (target && minDist <= troop.range) {
            // In attack range
            if (troop.attackCooldown === 0) {
              troop.attackCooldown = 32;
              if (troop.type === 'archer') {
                // Fire arrow projectile
                state.projectiles.push({
                  id: Date.now() + Math.random(),
                  startX: troop.x,
                  startY: troop.y,
                  curX: troop.x,
                  curY: troop.y,
                  targetX: target.x,
                  targetY: target.y,
                  progress: 0,
                  type: 'arrow',
                  damage: troop.damage,
                  side: troop.side
                });
                arcadeAudio.playArrow();
              } else {
                // Melee strike
                if (target.isTower) {
                  if (target.side === 'enemy') {
                    if (target.which === 'left') state.enemyTowers.left -= troop.damage;
                    else state.enemyTowers.right -= troop.damage;
                    setEnemyTowers({ ...state.enemyTowers });
                  } else {
                    if (target.which === 'left') state.playerTowers.left -= troop.damage;
                    else state.playerTowers.right -= troop.damage;
                    setPlayerTowers({ ...state.playerTowers });
                  }
                } else {
                  target.hp -= troop.damage;
                }
                addDamagePopup(`-${troop.damage}`, target.x, target.y - 12);
                arcadeAudio.playSword();
              }
            }
          } else {
            // March toward target or bridge
            const targetY = troop.side === 'player' ? 70 : 270;
            const dy = targetY - troop.y;
            troop.y += Math.sign(dy) * troop.speed;

            // Route through bridges when crossing the river (Y 145-185)
            if (troop.y > 145 && troop.y < 185) {
              const nearestBridgeX = troop.x < 180 ? 90 : 270;
              const dx = nearestBridgeX - troop.x;
              troop.x += Math.sign(dx) * troop.speed * 0.9;
            }
          }
        }

        // Win / Loss condition
        if (state.enemyTowers.left <= 0 && state.enemyTowers.right <= 0) {
          state.gameResult = 'win';
          setGameResult('win');
          arcadeAudio.playVictory();
          confetti({ particleCount: 75, spread: 85 });
        } else if (state.playerTowers.left <= 0 && state.playerTowers.right <= 0) {
          state.gameResult = 'defeat';
          setGameResult('defeat');
          arcadeAudio.playCrash();
        }
      }

      // Render Towers
      const drawCrownTower = (tx: number, ty: number, hp: number, maxHp: number, isPlayer: boolean) => {
        if (hp <= 0) return;
        ctx.save();
        ctx.translate(tx, ty);

        // Stone Base
        ctx.fillStyle = '#475569';
        ctx.fillRect(-18, -14, 36, 28);

        // Battlement Turret Tops
        ctx.fillStyle = isPlayer ? '#2563eb' : '#dc2626';
        ctx.fillRect(-20, -22, 40, 10);
        // Tower Crest Flag
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.moveTo(0, -22);
        ctx.lineTo(8, -26);
        ctx.lineTo(0, -30);
        ctx.fill();

        // Tower Health Bar
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-18, -32, 36, 5);
        ctx.fillStyle = isPlayer ? '#10b981' : '#f43f5e';
        ctx.fillRect(-18, -32, Math.max(0, (hp / maxHp) * 36), 5);

        ctx.restore();
      };

      // Enemy Towers (Red Top)
      drawCrownTower(90, 70, state.enemyTowers.left, 600, false);
      drawCrownTower(270, 70, state.enemyTowers.right, 600, false);
      drawCrownTower(180, 40, state.enemyTowers.king, 1000, false);

      // Player Towers (Blue Bottom)
      drawCrownTower(90, 270, state.playerTowers.left, 600, true);
      drawCrownTower(270, 270, state.playerTowers.right, 600, true);
      drawCrownTower(180, 300, state.playerTowers.king, 1000, true);

      // Render Animated Troops
      state.troops.forEach((t) => {
        ctx.save();
        ctx.translate(t.x, t.y);

        const legWiggle = Math.sin(t.walkFrame * 0.4) * 4;

        if (t.type === 'knight') {
          // Armored Knight with Sword
          ctx.fillStyle = t.side === 'player' ? '#3b82f6' : '#ef4444';
          ctx.fillRect(-6, -10, 12, 14); // Armor
          ctx.fillStyle = '#94a3b8'; // Helm
          ctx.beginPath();
          ctx.arc(0, -14, 6, 0, Math.PI * 2);
          ctx.fill();
          // Sword
          ctx.strokeStyle = '#e2e8f0';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(6, -6);
          ctx.lineTo(12 + (t.attackCooldown > 15 ? 4 : 0), -12);
          ctx.stroke();
        } else if (t.type === 'archer') {
          // Hooded Archer with Bow
          ctx.fillStyle = t.side === 'player' ? '#059669' : '#b91c1c';
          ctx.beginPath();
          ctx.arc(0, -10, 7, 0, Math.PI * 2);
          ctx.fill();
          // Bow
          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(6, -8, 6, -Math.PI / 2, Math.PI / 2);
          ctx.stroke();
        } else if (t.type === 'giant') {
          // Giant Colossus (Big Brawler)
          ctx.fillStyle = t.side === 'player' ? '#d97706' : '#7c2d12';
          ctx.fillRect(-10, -18, 20, 24);
          ctx.fillStyle = '#fed7aa';
          ctx.beginPath();
          ctx.arc(0, -22, 9, 0, Math.PI * 2);
          ctx.fill();
        } else if (t.type === 'skeleton') {
          // Mini Skeleton
          ctx.fillStyle = '#f8fafc';
          ctx.beginPath();
          ctx.arc(0, -8, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#f8fafc';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(0, -4);
          ctx.lineTo(0, 4 + legWiggle);
          ctx.stroke();
        }

        // Mini HP Bar
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-10, -22, 20, 3);
        ctx.fillStyle = t.side === 'player' ? '#10b981' : '#f43f5e';
        ctx.fillRect(-10, -22, Math.max(0, (t.hp / t.maxHp) * 20), 3);

        ctx.restore();
      });

      // Render Projectiles
      state.projectiles.forEach((p) => {
        if (p.type === 'fireball') {
          // Flaming Meteor Ball
          ctx.fillStyle = '#f97316';
          ctx.shadowColor = '#ea580c';
          ctx.shadowBlur = 14;
          ctx.beginPath();
          ctx.arc(p.curX, p.curY, 9, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        } else {
          // Flying Arrow
          ctx.strokeStyle = '#fde047';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(p.curX, p.curY);
          const angle = Math.atan2(p.targetY - p.startY, p.targetX - p.startX);
          ctx.lineTo(p.curX - Math.cos(angle) * 8, p.curY - Math.sin(angle) * 8);
          ctx.stroke();
        }
      });

      // Render Floating Damage Numbers
      for (let i = state.popups.length - 1; i >= 0; i--) {
        const pop = state.popups[i];
        pop.y -= 0.8;
        pop.life--;
        if (pop.life <= 0) {
          state.popups.splice(i, 1);
          continue;
        }
        ctx.fillStyle = pop.color;
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(pop.text, pop.x, pop.y);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-3 select-none w-full max-w-[380px]">
      {/* Top HUD: Crown score & status */}
      <div className="flex items-center justify-between w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2 shadow">
        <div className="flex items-center gap-2">
          <Crown className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-white tracking-wide">Clash Arena</span>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono font-bold">
          <span className="text-rose-400">Enemy HP: {Math.max(0, enemyTowers.left + enemyTowers.right)}</span>
          <span className="text-slate-500">|</span>
          <span className="text-blue-400">You: {Math.max(0, playerTowers.left + playerTowers.right)}</span>
        </div>
      </div>

      {/* Battle Canvas */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-950">
        <canvas
          ref={canvasRef}
          width={360}
          height={340}
          onClick={handleCanvasClick}
          className="cursor-crosshair block"
        />

        {/* Win / Defeat Overlays */}
        {gameResult === 'win' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center">
            <Trophy className="w-14 h-14 text-amber-400 mb-2 animate-bounce" />
            <h3 className="text-2xl font-black text-white mb-1">Crown Victory!</h3>
            <p className="text-xs text-slate-300 mb-4">
              Enemy towers demolished! 3 Crowns awarded!
            </p>
            <button
              onClick={resetGame}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-2 shadow-lg"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Battle Again</span>
            </button>
          </div>
        )}

        {gameResult === 'defeat' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-2xl font-black text-rose-400 mb-1">Towers Destroyed!</h3>
            <p className="text-xs text-slate-300 mb-4">
              Regroup your deck and fight back!
            </p>
            <button
              onClick={resetGame}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-2 shadow-lg"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Arena</span>
            </button>
          </div>
        )}
      </div>

      {/* Elixir Meter */}
      <div className="w-full flex items-center gap-2 px-1">
        <div className="p-1 rounded-lg bg-fuchsia-500/20 text-fuchsia-400">
          <Zap className="w-4 h-4" />
        </div>
        <div className="flex-1 bg-slate-800 rounded-full h-3 overflow-hidden border border-slate-700">
          <div
            className="bg-gradient-to-r from-purple-600 to-fuchsia-400 h-full transition-all duration-300"
            style={{ width: `${(elixir / 10) * 100}%` }}
          />
        </div>
        <span className="text-xs font-mono font-bold text-fuchsia-300">{elixir} / 10</span>
      </div>

      {/* Battle Cards Deck Bar */}
      <div className="grid grid-cols-5 gap-2 w-full">
        {CARDS.map((card) => {
          const isSelected = selectedCard === card.id;
          const canAfford = elixir >= card.cost;

          return (
            <button
              key={card.id}
              onClick={() => setSelectedCard(card.id)}
              disabled={!canAfford}
              className={`p-2 rounded-2xl flex flex-col items-center justify-center text-center transition border ${
                isSelected
                  ? 'bg-indigo-600/30 border-amber-400 ring-2 ring-amber-400/50 scale-105 shadow-lg'
                  : canAfford
                  ? 'bg-slate-900 border-slate-700 hover:bg-slate-800'
                  : 'bg-slate-950/60 border-slate-800 opacity-50'
              }`}
            >
              <span className="text-xl mb-0.5">{card.icon}</span>
              <span className="text-[10px] font-bold text-slate-200 truncate w-full">{card.name}</span>
              <span className="text-[9px] font-black font-mono text-fuchsia-400 mt-0.5">
                ⚡{card.cost}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
