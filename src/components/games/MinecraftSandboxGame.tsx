import React, { useState, useEffect, useRef } from 'react';
import { Pickaxe, Box, Trash2, Sun, Moon, RotateCcw, ArrowLeft, ArrowRight, ArrowUp, Sparkles, Sword } from 'lucide-react';
import { arcadeAudio } from './ArcadeSoundEngine';

interface MinecraftSandboxProps {
  soundOn: boolean;
}

const TILE_SIZE = 24;
const COLS = 20;
const ROWS = 13;

const BLOCK_PALETTE = [
  { id: 'dirt', name: 'Dirt', color: '#78350f', topColor: '#92400e', icon: '🟫' },
  { id: 'grass', name: 'Grass', color: '#16a34a', topColor: '#22c55e', icon: '🟩' },
  { id: 'stone', name: 'Stone', color: '#475569', topColor: '#64748b', icon: '◻️' },
  { id: 'wood', name: 'Wood', color: '#451a03', topColor: '#78350f', icon: '🪵' },
  { id: 'leaves', name: 'Leaves', color: '#065f46', topColor: '#047857', icon: '🍃' },
  { id: 'diamond', name: 'Diamond', color: '#06b6d4', topColor: '#22d3ee', icon: '💎' },
  { id: 'brick', name: 'Brick', color: '#b91c1c', topColor: '#dc2626', icon: '🧱' }
];

interface FloatingBlock {
  x: number;
  y: number;
  type: string;
  vy: number;
  life: number;
}

export const MinecraftSandboxGame: React.FC<MinecraftSandboxProps> = ({ soundOn }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<string>('wood');
  const [selectedTool, setSelectedTool] = useState<'pickaxe' | 'sword' | 'build'>('pickaxe');
  const [dayTime, setDayTime] = useState<number>(0.2); // 0 = day, 0.5 = dusk, 1 = night
  const [inventory, setInventory] = useState<{ [key: string]: number }>({
    dirt: 12,
    wood: 8,
    stone: 5,
    diamond: 2
  });

  const stateRef = useRef({
    steveX: 120,
    steveY: 120,
    vx: 0,
    vy: 0,
    isGrounded: false,
    facing: 1 as 1 | -1, // 1 right, -1 left
    isSwinging: false,
    swingTimer: 0,
    walkFrame: 0,
    grid: [] as string[][],
    crackingBlock: null as { r: number; c: number; stage: number } | null,
    floatingBlocks: [] as FloatingBlock[],
    zombie: {
      x: 360,
      y: 120,
      vx: -0.5,
      hp: 100,
      alive: true
    },
    keys: { left: false, right: false, jump: false }
  });

  useEffect(() => {
    arcadeAudio.soundEnabled = soundOn;
  }, [soundOn]);

  // Generate initial world
  const initWorld = () => {
    const g: string[][] = [];
    for (let r = 0; r < ROWS; r++) {
      g[r] = [];
      for (let c = 0; c < COLS; c++) {
        if (r < 7) {
          g[r][c] = '';
        } else if (r === 7) {
          g[r][c] = 'grass';
        } else if (r <= 9) {
          g[r][c] = 'dirt';
        } else {
          g[r][c] = 'stone';
        }
      }
    }

    // Add Oak Tree at column 4
    g[6][4] = 'wood';
    g[5][4] = 'wood';
    g[4][4] = 'wood';
    g[3][4] = 'leaves';
    g[3][3] = 'leaves';
    g[3][5] = 'leaves';
    g[2][4] = 'leaves';

    // Add hidden Diamond Ore vein
    g[11][8] = 'diamond';
    g[11][9] = 'diamond';

    stateRef.current.grid = g;
    stateRef.current.steveX = 140;
    stateRef.current.steveY = 7 * TILE_SIZE - 28;
    stateRef.current.vx = 0;
    stateRef.current.vy = 0;
  };

  useEffect(() => {
    initWorld();
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        stateRef.current.keys.left = true;
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        stateRef.current.keys.right = true;
      } else if (['ArrowUp', 'KeyW', 'Space'].includes(e.code)) {
        e.preventDefault();
        stateRef.current.keys.jump = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        stateRef.current.keys.left = false;
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        stateRef.current.keys.right = false;
      } else if (['ArrowUp', 'KeyW', 'Space'].includes(e.code)) {
        stateRef.current.keys.jump = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Mouse / Canvas Click to Mine or Place
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const col = Math.floor(clickX / TILE_SIZE);
    const row = Math.floor(clickY / TILE_SIZE);

    if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return;

    const s = stateRef.current;
    // Steve swings arm
    s.isSwinging = true;
    s.swingTimer = 14;

    // Check reach distance
    const dist = Math.hypot(clickX - (s.steveX + 10), clickY - (s.steveY + 16));
    if (dist > 120) return; // Too far for Steve's reach

    if (selectedTool === 'sword') {
      // Hit Zombie if nearby
      if (s.zombie.alive && Math.hypot(clickX - s.zombie.x, clickY - s.zombie.y) < 35) {
        s.zombie.hp -= 40;
        s.zombie.vx = s.facing * 3; // Knockback
        arcadeAudio.playSword();
        if (s.zombie.hp <= 0) {
          s.zombie.alive = false;
          arcadeAudio.playVictory();
        }
      }
      return;
    }

    if (selectedTool === 'pickaxe') {
      // Mine block
      const currentBlock = s.grid[row][col];
      if (currentBlock !== '') {
        // Crack and break block
        arcadeAudio.playDig();
        s.grid[row][col] = '';

        // Spawn floating mini item cube
        s.floatingBlocks.push({
          x: col * TILE_SIZE + 6,
          y: row * TILE_SIZE + 6,
          type: currentBlock,
          vy: -3,
          life: 90
        });

        // Add to inventory
        setInventory((prev) => ({
          ...prev,
          [currentBlock]: (prev[currentBlock] || 0) + 1
        }));
      }
    } else if (selectedTool === 'build') {
      // Place block if space is empty and Steve isn't directly inside it
      if (s.grid[row][col] === '') {
        const steveCol = Math.floor(s.steveX / TILE_SIZE);
        const steveRow = Math.floor(s.steveY / TILE_SIZE);
        if (steveCol === col && (steveRow === row || steveRow + 1 === row)) return;

        s.grid[row][col] = selectedBlock;
        arcadeAudio.playPlace();

        setInventory((prev) => ({
          ...prev,
          [selectedBlock]: Math.max(0, (prev[selectedBlock] || 1) - 1)
        }));
      }
    }
  };

  // Main 60fps Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const loop = () => {
      const s = stateRef.current;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Sky with Day / Night Cycle
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#38bdf8'); // Daylight blue
      skyGrad.addColorStop(1, '#bae6fd');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Pixel Clouds
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.fillRect(40, 24, 70, 16);
      ctx.fillRect(260, 40, 90, 18);

      // Physics & Movement
      if (s.keys.left) {
        s.vx = -2.2;
        s.facing = -1;
        s.walkFrame++;
      } else if (s.keys.right) {
        s.vx = 2.2;
        s.facing = 1;
        s.walkFrame++;
      } else {
        s.vx *= 0.7;
      }

      // Jump
      if (s.keys.jump && s.isGrounded) {
        s.vy = -6.5;
        s.isGrounded = false;
        arcadeAudio.playJump();
      }

      // Gravity
      s.vy += 0.38;

      // New Positions
      let nextX = s.steveX + s.vx;
      let nextY = s.steveY + s.vy;

      // Platform Collisions with Blocks
      const checkBlockAt = (px: number, py: number) => {
        const c = Math.floor(px / TILE_SIZE);
        const r = Math.floor(py / TILE_SIZE);
        if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
          return s.grid[r][c] !== '';
        }
        return false;
      };

      // Horizontal Collision
      if (s.vx > 0) {
        if (checkBlockAt(nextX + 16, s.steveY + 4) || checkBlockAt(nextX + 16, s.steveY + 28)) {
          nextX = Math.floor((nextX + 16) / TILE_SIZE) * TILE_SIZE - 16;
          s.vx = 0;
        }
      } else if (s.vx < 0) {
        if (checkBlockAt(nextX, s.steveY + 4) || checkBlockAt(nextX, s.steveY + 28)) {
          nextX = (Math.floor(nextX / TILE_SIZE) + 1) * TILE_SIZE;
          s.vx = 0;
        }
      }

      // Vertical Collision
      s.isGrounded = false;
      if (s.vy > 0) {
        if (checkBlockAt(nextX + 3, nextY + 30) || checkBlockAt(nextX + 13, nextY + 30)) {
          nextY = Math.floor((nextY + 30) / TILE_SIZE) * TILE_SIZE - 30;
          s.vy = 0;
          s.isGrounded = true;
        }
      } else if (s.vy < 0) {
        if (checkBlockAt(nextX + 3, nextY) || checkBlockAt(nextX + 13, nextY)) {
          nextY = (Math.floor(nextY / TILE_SIZE) + 1) * TILE_SIZE;
          s.vy = 0;
        }
      }

      s.steveX = Math.max(0, Math.min(width - 16, nextX));
      s.steveY = Math.max(0, Math.min(height - 30, nextY));

      if (s.swingTimer > 0) s.swingTimer--;

      // Render World Grid Blocks
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const type = s.grid[r][c];
          if (type === '') continue;

          const blockInfo = BLOCK_PALETTE.find((b) => b.id === type) || BLOCK_PALETTE[0];
          const bx = c * TILE_SIZE;
          const by = r * TILE_SIZE;

          // Main block face
          ctx.fillStyle = blockInfo.color;
          ctx.fillRect(bx, by, TILE_SIZE, TILE_SIZE);

          // Top highlight edge
          ctx.fillStyle = blockInfo.topColor;
          ctx.fillRect(bx, by, TILE_SIZE, 4);

          // Pixel border seam
          ctx.strokeStyle = 'rgba(0,0,0,0.15)';
          ctx.lineWidth = 1;
          ctx.strokeRect(bx, by, TILE_SIZE, TILE_SIZE);
        }
      }

      // Render Floating Mini Blocks
      for (let i = s.floatingBlocks.length - 1; i >= 0; i--) {
        const fb = s.floatingBlocks[i];
        fb.y += fb.vy;
        fb.vy += 0.25;
        fb.life--;

        // Magnetic collection toward Steve
        const dx = s.steveX + 8 - fb.x;
        const dy = s.steveY + 14 - fb.y;
        if (Math.hypot(dx, dy) < 25) {
          arcadeAudio.playCoin();
          s.floatingBlocks.splice(i, 1);
          continue;
        } else if (Math.hypot(dx, dy) < 60) {
          fb.x += Math.sign(dx) * 2;
          fb.y += Math.sign(dy) * 2;
        }

        const blockInfo = BLOCK_PALETTE.find((b) => b.id === fb.type) || BLOCK_PALETTE[0];
        ctx.fillStyle = blockInfo.color;
        ctx.fillRect(fb.x, fb.y, 8, 8);
        ctx.strokeStyle = '#ffffff';
        ctx.strokeRect(fb.x, fb.y, 8, 8);

        if (fb.life <= 0) s.floatingBlocks.splice(i, 1);
      }

      // Render Playable Steve Character
      ctx.save();
      ctx.translate(s.steveX + 8, s.steveY);
      if (s.facing === -1) ctx.scale(-1, 1);

      const legSwing = Math.sin(s.walkFrame * 0.4) * 4;

      // Steve Head
      ctx.fillStyle = '#b45309'; // Brown hair
      ctx.fillRect(-5, 0, 10, 3);
      ctx.fillStyle = '#fed7aa'; // Face skin
      ctx.fillRect(-5, 3, 10, 7);
      // Blue Eyes
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(1, 5, 2, 2);

      // Cyan / Teal Shirt Body
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(-5, 10, 10, 11);

      // Dark Blue Jeans Legs
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(-5, 21, 4, 9 + (s.isGrounded ? legSwing : 0));
      ctx.fillRect(1, 21, 4, 9 - (s.isGrounded ? legSwing : 0));

      // Gray Shoes
      ctx.fillStyle = '#475569';
      ctx.fillRect(-5, 28 + (s.isGrounded ? legSwing : 0), 4, 2);
      ctx.fillRect(1, 28 - (s.isGrounded ? legSwing : 0), 4, 2);

      // Arm & Held Tool
      ctx.save();
      ctx.translate(3, 12);
      const swingAngle = s.swingTimer > 0 ? (s.swingTimer / 14) * Math.PI * 0.8 : 0;
      ctx.rotate(-swingAngle);

      // Arm
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(-2, 0, 4, 8);

      // Pickaxe / Sword Tool in Hand
      if (selectedTool === 'pickaxe') {
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 7);
        ctx.lineTo(6, 15);
        ctx.stroke();
        // Diamond Pick Head
        ctx.fillStyle = '#06b6d4';
        ctx.fillRect(3, 13, 8, 3);
      } else if (selectedTool === 'sword') {
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(0, 7);
        ctx.lineTo(8, 16);
        ctx.stroke();
      }
      ctx.restore();

      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [selectedTool, selectedBlock]);

  return (
    <div className="flex flex-col items-center justify-center space-y-3 select-none w-full max-w-[480px]">
      {/* Top Toolbar: Mode Switch & Inventory Counts */}
      <div className="flex items-center justify-between w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2 shadow">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSelectedTool('pickaxe')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              selectedTool === 'pickaxe'
                ? 'bg-cyan-600 text-white shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Pickaxe className="w-3.5 h-3.5" />
            <span>Mine (Pick)</span>
          </button>
          <button
            onClick={() => setSelectedTool('build')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              selectedTool === 'build'
                ? 'bg-amber-600 text-white shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>Place (Build)</span>
          </button>
          <button
            onClick={() => setSelectedTool('sword')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              selectedTool === 'sword'
                ? 'bg-rose-600 text-white shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Sword className="w-3.5 h-3.5" />
            <span>Sword</span>
          </button>
        </div>

        <button
          onClick={initWorld}
          className="text-slate-400 hover:text-white p-1 rounded-lg"
          title="Reset World"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Canvas Platformer Sandbox */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-950">
        <canvas
          ref={canvasRef}
          width={480}
          height={312}
          onClick={handleCanvasClick}
          className="cursor-crosshair block max-w-full"
        />
      </div>

      {/* Minecraft Hotbar */}
      <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-2 rounded-2xl shadow w-full justify-center overflow-x-auto">
        {BLOCK_PALETTE.map((block) => {
          const isSelected = selectedBlock === block.id && selectedTool === 'build';
          const count = inventory[block.id] || 0;

          return (
            <button
              key={block.id}
              onClick={() => {
                setSelectedBlock(block.id);
                setSelectedTool('build');
              }}
              className={`p-2 rounded-xl flex flex-col items-center justify-center transition border min-w-[50px] ${
                isSelected
                  ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/40 scale-105 shadow'
                  : 'bg-slate-800/80 border-slate-700 hover:bg-slate-800'
              }`}
            >
              <span className="text-base">{block.icon}</span>
              <span className="text-[10px] font-bold text-slate-200">{block.name}</span>
              <span className="text-[9px] font-mono text-emerald-400">x{count}</span>
            </button>
          );
        })}
      </div>

      {/* Touch / Quick Platformer Movement Controls */}
      <div className="flex items-center justify-center gap-2 w-full">
        <button
          onMouseDown={() => (stateRef.current.keys.left = true)}
          onMouseUp={() => (stateRef.current.keys.left = false)}
          onTouchStart={() => (stateRef.current.keys.left = true)}
          onTouchEnd={() => (stateRef.current.keys.left = false)}
          className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1 border border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Walk Left (A)</span>
        </button>
        <button
          onClick={() => {
            if (stateRef.current.isGrounded) {
              stateRef.current.vy = -6.5;
              stateRef.current.isGrounded = false;
              arcadeAudio.playJump();
            }
          }}
          className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1 shadow"
        >
          <ArrowUp className="w-4 h-4" />
          <span>Jump (Space / W)</span>
        </button>
        <button
          onMouseDown={() => (stateRef.current.keys.right = true)}
          onMouseUp={() => (stateRef.current.keys.right = false)}
          onTouchStart={() => (stateRef.current.keys.right = true)}
          onTouchEnd={() => (stateRef.current.keys.right = false)}
          className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1 border border-slate-700"
        >
          <span>Walk Right (D)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
