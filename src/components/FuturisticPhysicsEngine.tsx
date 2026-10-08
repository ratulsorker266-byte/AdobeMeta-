import React, { useEffect, useRef } from 'react';
import { playWaterDropSound, playWaterHoverBubble } from '../lib/audioFeedback';

interface FuturisticPhysicsEngineProps {
  enabled: boolean;
  themeMode: 'light' | 'dark';
}

interface WaterWave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  lineWidth: number;
  speed: number;
  hue: number;
  isSplash: boolean;
}

interface SplashDroplet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
  hue: number;
}

interface WaterBubble {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
  wobblePhase: number;
  wobbleSpeed: number;
  hue: number;
}

interface CausticNode {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  phase: number;
  speed: number;
}

interface WakePoint {
  x: number;
  y: number;
  alpha: number;
  size: number;
}

interface KoiSilhouette {
  x: number;
  y: number;
  angle: number;
  targetAngle: number;
  speed: number;
  baseSpeed: number;
  size: number;
  tailPhase: number;
  tailSpeed: number;
  colorPrimary: string;
  colorAccent: string;
}

export const FuturisticPhysicsEngine: React.FC<FuturisticPhysicsEngineProps> = ({
  enabled,
  themeMode,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorDropRef = useRef<HTMLDivElement>(null);
  const cursorTrailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const isTouchOrMobile =
      typeof window !== 'undefined' &&
      ((window.matchMedia && window.matchMedia('(hover: none), (pointer: coarse)').matches) ||
        window.innerWidth < 768);

    if (enabled && !prefersReducedMotion && !isTouchOrMobile) {
      root.classList.add('futuristic-bounce-active', 'aquatic-water-world');
    } else {
      root.classList.remove('futuristic-bounce-active', 'aquatic-water-world');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const waves: WaterWave[] = [];
    const droplets: SplashDroplet[] = [];
    const bubbles: WaterBubble[] = [];
    const wakeTrail: WakePoint[] = [];
    const causticNodes: CausticNode[] = [];
    const kois: KoiSilhouette[] = [];

    // 1D Shallow-Water Wave Simulation along top meniscus (64 springs)
    const NUM_SPRINGS = 64;
    const springY = new Float32Array(NUM_SPRINGS);
    const springV = new Float32Array(NUM_SPRINGS);

    const initCausticMesh = () => {
      causticNodes.length = 0;
      const cols = 7;
      const rows = 4;
      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          const bx = (width / cols) * c;
          const by = (height / rows) * r;
          causticNodes.push({
            x: bx,
            y: by,
            baseX: bx,
            baseY: by,
            phase: (r * cols + c) * 0.75,
            speed: 0.016 + ((r + c) % 3) * 0.005,
          });
        }
      }
    };
    initCausticMesh();

    // Seed 2 ultra-graceful depth-blurred bioluminescent Koi silhouettes swimming far beneath UI cards
    const seedKois = () => {
      kois.length = 0;
      kois.push(
        {
          x: width * 0.22,
          y: height * 0.68,
          angle: 0.25,
          targetAngle: 0.25,
          speed: 0.95,
          baseSpeed: 0.95,
          size: 24,
          tailPhase: 0,
          tailSpeed: 0.11,
          colorPrimary: 'rgba(245, 158, 11, 0.16)', // Golden Amber Koi
          colorAccent: 'rgba(56, 189, 248, 0.22)',
        },
        {
          x: width * 0.78,
          y: height * 0.32,
          angle: Math.PI - 0.3,
          targetAngle: Math.PI - 0.3,
          speed: 0.82,
          baseSpeed: 0.82,
          size: 20,
          tailPhase: 2.4,
          tailSpeed: 0.095,
          colorPrimary: 'rgba(14, 165, 233, 0.18)', // Crystal Cyan Koi
          colorAccent: 'rgba(251, 191, 36, 0.16)',
        }
      );
    };
    seedKois();

    // Seed 36 3D spherical oxygen & bioluminescent pearls rising through the water
    for (let i = 0; i < 36; i++) {
      bubbles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.42,
        vy: -(0.42 + Math.random() * 0.95),
        r: 2.0 + Math.random() * 6.5,
        alpha: 0.22 + Math.random() * 0.36,
        wobblePhase: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.025 + Math.random() * 0.035,
        hue: [195, 188, 204, 42][i % 4],
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initCausticMesh();
    };
    window.addEventListener('resize', handleResize);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let lastWaveX = mouseX;
    let lastWaveY = mouseY;
    let dropX = mouseX;
    let dropY = mouseY;
    let dropVx = 0;
    let dropVy = 0;
    let trailX = mouseX;
    let trailY = mouseY;

    let activeFloatingEl: HTMLElement | null = null;
    let lastHoveredEl: HTMLElement | null = null;
    let rafId = 0;
    let time = 0;

    const spawnRipple = (x: number, y: number, isSplash = false, customRadius?: number) => {
      if (waves.length > 60) waves.shift();
      waves.push({
        x,
        y,
        radius: isSplash ? 8 : 3,
        maxRadius: customRadius || (isSplash ? 275 : 110 + Math.random() * 45),
        alpha: isSplash ? 0.78 : 0.46,
        lineWidth: isSplash ? 3.8 : 2.1,
        speed: isSplash ? 4.5 : 2.4,
        hue: isSplash ? 192 : 198,
        isSplash,
      });

      // Pluck top meniscus wave springs if near top of screen or on click
      const springIdx = Math.max(
        0,
        Math.min(NUM_SPRINGS - 1, Math.floor((x / Math.max(1, width)) * NUM_SPRINGS))
      );
      if (isSplash || y < 180) {
        springV[springIdx] += isSplash ? 14 : 5.5;
        if (springIdx > 0) springV[springIdx - 1] += isSplash ? 9 : 3;
        if (springIdx < NUM_SPRINGS - 1) springV[springIdx + 1] += isSplash ? 9 : 3;
      }

      if (isSplash) {
        // Secondary cyan harmonic ring
        waves.push({
          x,
          y,
          radius: 1,
          maxRadius: 190,
          alpha: 0.56,
          lineWidth: 2.3,
          speed: 3.1,
          hue: 186,
          isSplash: true,
        });
        // Tertiary golden sunbeam refraction ring
        waves.push({
          x,
          y,
          radius: 1,
          maxRadius: 125,
          alpha: 0.45,
          lineWidth: 1.6,
          speed: 2.15,
          hue: 43,
          isSplash: true,
        });

        // 3D Crown Splash Water Droplets arcing upwards and falling back with secondary ripples
        for (let d = 0; d < 14; d++) {
          const ang = (Math.PI * 2 * d) / 14 + (Math.random() - 0.5) * 0.28;
          const spd = 2.4 + Math.random() * 4.5;
          droplets.push({
            x,
            y,
            vx: Math.cos(ang) * spd,
            vy: Math.sin(ang) * spd - 3.5,
            r: 2.1 + Math.random() * 3.3,
            alpha: 0.9,
            hue: d % 3 === 0 ? 43 : 195,
          });
        }
        if (droplets.length > 75) {
          droplets.splice(0, droplets.length - 75);
        }

        // Burst of rising oxygen bubbles from splash core
        for (let b = 0; b < 8; b++) {
          bubbles.push({
            x: x + (Math.random() - 0.5) * 34,
            y: y + (Math.random() - 0.5) * 34,
            vx: (Math.random() - 0.5) * 2.1,
            vy: -(1.3 + Math.random() * 2.3),
            r: 2.4 + Math.random() * 4.8,
            alpha: 0.68,
            wobblePhase: Math.random() * Math.PI * 2,
            wobbleSpeed: 0.042,
            hue: b % 2 === 0 ? 195 : 43,
          });
        }
        if (bubbles.length > 64) {
          bubbles.splice(0, bubbles.length - 64);
        }

        // Gently startle nearby Koi fish to dart gracefully when user splashes near them
        for (const koi of kois) {
          const distToKoi = Math.hypot(koi.x - x, koi.y - y);
          if (distToKoi < 380) {
            koi.targetAngle = Math.atan2(koi.y - y, koi.x - x);
            koi.speed = 3.2;
          }
        }
      }
    };

    const drawSubSurfaceKoi = (koi: KoiSilhouette, isLight: boolean) => {
      // Update Koi swimming physics
      koi.tailPhase += koi.tailSpeed * (koi.speed / koi.baseSpeed);
      koi.speed += (koi.baseSpeed - koi.speed) * 0.03;

      // Gentle wandering steering
      if (Math.random() < 0.02) {
        koi.targetAngle += (Math.random() - 0.5) * 0.65;
      }

      // Gently curve away from pointer if very close
      const dxm = koi.x - mouseX;
      const dym = koi.y - mouseY;
      const dm = Math.hypot(dxm, dym);
      if (dm < 150 && dm > 1) {
        koi.targetAngle = Math.atan2(dym, dxm);
        koi.speed = Math.min(2.4, koi.speed + 0.08);
      }

      // Shortest angle interpolation
      let diff = koi.targetAngle - koi.angle;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      koi.angle += diff * 0.04;

      koi.x += Math.cos(koi.angle) * koi.speed;
      koi.y += Math.sin(koi.angle) * koi.speed;

      // Wrap around screen edges smoothly
      const margin = 90;
      if (koi.x < -margin) koi.x = width + margin;
      if (koi.x > width + margin) koi.x = -margin;
      if (koi.y < -margin) koi.y = height + margin;
      if (koi.y > height + margin) koi.y = -margin;

      ctx.save();
      ctx.translate(koi.x, koi.y);
      ctx.rotate(koi.angle);

      const s = koi.size;
      const tailSway = Math.sin(koi.tailPhase) * (s * 0.34);
      const midSway = Math.sin(koi.tailPhase - 0.7) * (s * 0.12);

      // Soft sub-aquatic shadow beneath the Koi
      ctx.save();
      ctx.translate(4, 12);
      ctx.beginPath();
      ctx.moveTo(s * 0.9, 0);
      ctx.quadraticCurveTo(s * 0.2, s * 0.38 + midSway, -s * 0.95, tailSway);
      ctx.quadraticCurveTo(s * 0.2, -s * 0.38 + midSway, s * 0.9, 0);
      ctx.fillStyle = isLight ? 'rgba(15, 23, 42, 0.045)' : 'rgba(0, 0, 0, 0.16)';
      ctx.fill();
      ctx.restore();

      // Pectoral fins
      ctx.beginPath();
      ctx.ellipse(s * 0.2, s * 0.38, s * 0.28, s * 0.11, 0.55, 0, Math.PI * 2);
      ctx.ellipse(s * 0.2, -s * 0.38, s * 0.28, s * 0.11, -0.55, 0, Math.PI * 2);
      ctx.fillStyle = koi.colorAccent;
      ctx.fill();

      // Fluid streamlined Koi body + forked tail fin
      ctx.beginPath();
      ctx.moveTo(s * 0.95, 0);
      ctx.quadraticCurveTo(s * 0.3, s * 0.42 + midSway, -s * 0.75, tailSway * 0.65);
      ctx.lineTo(-s * 1.35, tailSway + s * 0.32);
      ctx.quadraticCurveTo(-s * 1.05, tailSway, -s * 1.35, tailSway - s * 0.32);
      ctx.lineTo(-s * 0.75, tailSway * 0.65);
      ctx.quadraticCurveTo(s * 0.3, -s * 0.42 + midSway, s * 0.95, 0);
      ctx.closePath();

      const bodyGrad = ctx.createLinearGradient(s, 0, -s * 1.3, 0);
      bodyGrad.addColorStop(0, koi.colorPrimary);
      bodyGrad.addColorStop(0.65, koi.colorAccent);
      bodyGrad.addColorStop(1, 'rgba(56, 189, 248, 0.02)');
      ctx.fillStyle = bodyGrad;
      ctx.fill();

      ctx.restore();
    };

    const renderWaterWorld = () => {
      if (document.hidden) {
        rafId = requestAnimationFrame(renderWaterWorld);
        return;
      }
      time += 0.022;
      ctx.clearRect(0, 0, width, height);

      const isLight = themeMode === 'light';

      // 1. Update 1D Shallow-Water Wave Springs at Top Viewport Meniscus
      for (let i = 0; i < NUM_SPRINGS; i++) {
        const force = -0.045 * springY[i];
        springV[i] += force;
        springV[i] *= 0.94;
        springY[i] += springV[i];
      }
      // Propagate neighbor wave heights
      for (let i = 0; i < NUM_SPRINGS; i++) {
        if (i > 0) {
          springV[i - 1] += (springY[i] - springY[i - 1]) * 0.06;
        }
        if (i < NUM_SPRINGS - 1) {
          springV[i + 1] += (springY[i] - springY[i + 1]) * 0.06;
        }
      }

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      const stepX = width / (NUM_SPRINGS - 1);
      for (let i = 0; i < NUM_SPRINGS; i++) {
        const x = i * stepX;
        const distToMouse = Math.abs(x - dropX);
        const mousePull = Math.max(0, 1 - distToMouse / 280) * Math.sin(time * 4.2) * 5.5;
        const y =
          7 +
          springY[i] +
          Math.sin(x * 0.0055 + time * 1.9) * 3.2 +
          Math.cos(x * 0.013 - time * 1.3) * 1.8 +
          mousePull;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, 0);
      ctx.closePath();
      const topGrad = ctx.createLinearGradient(0, 0, 0, 24);
      topGrad.addColorStop(
        0,
        isLight ? 'rgba(14, 165, 233, 0.26)' : 'rgba(56, 189, 248, 0.30)'
      );
      topGrad.addColorStop(1, 'rgba(14, 165, 233, 0)');
      ctx.fillStyle = topGrad;
      ctx.fill();
      ctx.restore();

      // 2. Interactive Voronoi/Delaunay-style Underwater Caustic Sunbeam Mesh
      const cols = 7;
      const rows = 4;
      for (let i = 0; i < causticNodes.length; i++) {
        const n = causticNodes[i];
        n.phase += n.speed;
        const dx = n.baseX - dropX;
        const dy = n.baseY - dropY;
        const d = Math.hypot(dx, dy);
        const push = d < 320 && d > 1 ? ((320 - d) / 320) * 24 : 0;
        n.x =
          n.baseX +
          Math.sin(n.phase) * 34 +
          (d > 1 ? (dx / d) * push : 0);
        n.y =
          n.baseY +
          Math.cos(n.phase * 0.85) * 26 +
          (d > 1 ? (dy / d) * push : 0);
      }

      ctx.save();
      ctx.strokeStyle = isLight
        ? 'rgba(14, 165, 233, 0.042)'
        : 'rgba(56, 189, 248, 0.045)';
      ctx.lineWidth = 1.1;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = r * (cols + 1) + c;
          const n1 = causticNodes[idx];
          const n2 = causticNodes[idx + 1];
          const n3 = causticNodes[idx + cols + 1];
          if (n1 && n2 && n3) {
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.lineTo(n3.x, n3.y);
            ctx.closePath();
            ctx.stroke();
          }
        }
      }
      ctx.restore();

      // 3. Draw Deep Sub-Surface Koi Silhouettes (swimming calmly under the glass UI)
      for (const koi of kois) {
        drawSubSurfaceKoi(koi, isLight);
      }

      // 4. Interactive Caustic Sunlight Spotlight around Pointer
      const causticGrad = ctx.createRadialGradient(
        dropX,
        dropY,
        8,
        dropX,
        dropY,
        340
      );
      if (isLight) {
        causticGrad.addColorStop(0, 'rgba(14, 165, 233, 0.16)');
        causticGrad.addColorStop(0.38, 'rgba(56, 189, 248, 0.08)');
        causticGrad.addColorStop(0.72, 'rgba(245, 158, 11, 0.045)');
        causticGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      } else {
        causticGrad.addColorStop(0, 'rgba(56, 189, 248, 0.21)');
        causticGrad.addColorStop(0.42, 'rgba(14, 165, 233, 0.095)');
        causticGrad.addColorStop(0.75, 'rgba(245, 158, 11, 0.055)');
        causticGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      }
      ctx.fillStyle = causticGrad;
      ctx.fillRect(0, 0, width, height);

      // 5. Silky Hydrodynamic Wake Ribbon trailing the pointer
      if (wakeTrail.length > 1) {
        for (let i = wakeTrail.length - 1; i >= 0; i--) {
          wakeTrail[i].alpha -= 0.028;
          wakeTrail[i].size += 0.35;
          if (wakeTrail[i].alpha <= 0.01) {
            wakeTrail.splice(i, 1);
          }
        }
        if (wakeTrail.length > 1) {
          ctx.save();
          for (let i = 1; i < wakeTrail.length; i++) {
            const p0 = wakeTrail[i - 1];
            const p1 = wakeTrail[i];
            ctx.beginPath();
            ctx.moveTo(p0.x, p0.y);
            ctx.lineTo(p1.x, p1.y);
            ctx.strokeStyle = isLight
              ? `rgba(14, 165, 233, ${(p1.alpha * 0.42).toFixed(3)})`
              : `rgba(56, 189, 248, ${(p1.alpha * 0.48).toFixed(3)})`;
            ctx.lineWidth = Math.max(1, (1 - p1.alpha) * 10);
            ctx.lineCap = 'round';
            ctx.stroke();
          }
          ctx.restore();
        }
      }

      // 6. Update & Draw Rising 3D Glass Water Bubbles
      for (let i = 0; i < bubbles.length; i++) {
        const b = bubbles[i];
        b.wobblePhase += b.wobbleSpeed;
        b.x += b.vx + Math.sin(b.wobblePhase) * 0.55;
        b.y += b.vy;

        // Swirl away from pointer vortex
        const dx = b.x - mouseX;
        const dy = b.y - mouseY;
        const dist = Math.hypot(dx, dy);
        if (dist < 135 && dist > 1) {
          const force = (135 - dist) / 135;
          b.x += (dx / dist) * force * 2.9;
          b.y += (dy / dist) * force * 2.3;
        }

        if (b.y < -25) {
          b.y = height + 20;
          b.x = Math.random() * width;
        }

        // Outer glass bubble rim
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.strokeStyle = isLight
          ? `hsla(${b.hue}, 88%, 42%, ${b.alpha})`
          : `hsla(${b.hue}, 92%, 72%, ${b.alpha})`;
        ctx.lineWidth = 1.3;
        ctx.stroke();

        // Subtle inner water refraction fill
        ctx.fillStyle = isLight
          ? `hsla(${b.hue}, 90%, 60%, ${b.alpha * 0.18})`
          : `hsla(${b.hue}, 90%, 65%, ${b.alpha * 0.15})`;
        ctx.fill();

        // Top-left specular light reflection dot (gives real 3D spherical bubble look)
        ctx.beginPath();
        ctx.arc(b.x - b.r * 0.34, b.y - b.r * 0.34, Math.max(0.9, b.r * 0.28), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(0.95, b.alpha * 2.0)})`;
        ctx.fill();
      }

      // 7. Update & Draw 3D Crown Splash Droplets (on click)
      for (let i = droplets.length - 1; i >= 0; i--) {
        const d = droplets[i];
        d.x += d.vx;
        d.y += d.vy;
        d.vy += 0.26; // Gravity pull
        d.alpha -= 0.021;

        if (d.alpha <= 0.02) {
          // Spawn a tiny secondary micro-ripple where the droplet lands back on the water!
          if (Math.random() < 0.42) {
            waves.push({
              x: d.x,
              y: d.y,
              radius: 1,
              maxRadius: 32,
              alpha: 0.36,
              lineWidth: 1.3,
              speed: 1.6,
              hue: d.hue,
              isSplash: false,
            });
          }
          droplets.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = isLight
          ? `hsla(${d.hue}, 90%, 48%, ${d.alpha.toFixed(2)})`
          : `hsla(${d.hue}, 95%, 70%, ${d.alpha.toFixed(2)})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(d.x - d.r * 0.3, d.y - d.r * 0.3, d.r * 0.32, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${d.alpha.toFixed(2)})`;
        ctx.fill();
      }

      // 8. Update & Draw Expanding Prismatic Water Surface Ripples
      for (let i = waves.length - 1; i >= 0; i--) {
        const w = waves[i];
        w.radius += w.speed;
        const progress = w.radius / w.maxRadius;
        const currentAlpha = w.alpha * Math.pow(1 - progress, 1.25);

        if (w.radius >= w.maxRadius || currentAlpha <= 0.008) {
          waves.splice(i, 1);
          continue;
        }

        // Primary Aqua Wave Crest
        ctx.beginPath();
        ctx.arc(w.x, w.y, w.radius, 0, Math.PI * 2);
        ctx.strokeStyle = isLight
          ? `hsla(${w.hue}, 88%, 45%, ${currentAlpha.toFixed(3)})`
          : `hsla(${w.hue}, 92%, 66%, ${currentAlpha.toFixed(3)})`;
        ctx.lineWidth = w.lineWidth * (1 - progress * 0.45);
        ctx.stroke();

        // Inner Specular Sunlight Highlight Ring
        if (w.radius > 10) {
          ctx.beginPath();
          ctx.arc(w.x, w.y, w.radius * 0.85, 0, Math.PI * 2);
          ctx.strokeStyle = isLight
            ? `rgba(255, 255, 255, ${(currentAlpha * 0.88).toFixed(3)})`
            : `rgba(186, 230, 253, ${(currentAlpha * 0.55).toFixed(3)})`;
          ctx.lineWidth = 1.15;
          ctx.stroke();
        }
      }

      // 9. Liquid Water Droplet Cursor Follower Physics
      dropVx = (dropVx + (mouseX - dropX) * 0.22) * 0.74;
      dropVy = (dropVy + (mouseY - dropY) * 0.22) * 0.74;
      dropX += dropVx;
      dropY += dropVy;

      trailX += (dropX - trailX) * 0.14;
      trailY += (dropY - trailY) * 0.14;

      const speed = Math.min(Math.hypot(dropVx, dropVy), 32);
      const angle = Math.atan2(dropVy, dropVx) * (180 / Math.PI);
      const stretchX = 1 + speed * 0.021;
      const stretchY = Math.max(0.68, 1 - speed * 0.011);

      if (cursorDropRef.current) {
        cursorDropRef.current.style.transform = `translate3d(${dropX - 12}px, ${dropY - 12}px, 0) rotate(${angle.toFixed(
          1
        )}deg) scale(${stretchX.toFixed(3)}, ${stretchY.toFixed(3)})`;
      }

      if (cursorTrailRef.current) {
        cursorTrailRef.current.style.transform = `translate3d(${trailX - 6}px, ${trailY - 6}px, 0) scale(${Math.max(
          0.55,
          1 - speed * 0.015
        ).toFixed(2)})`;
      }

      rafId = requestAnimationFrame(renderWaterWorld);
    };

    rafId = requestAnimationFrame(renderWaterWorld);

    const handlePointerMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Record hydrodynamic wake ribbon point
      wakeTrail.push({ x: mouseX, y: mouseY, alpha: 0.65, size: 2 });
      if (wakeTrail.length > 22) wakeTrail.shift();

      // Spawn continuous water wake ripples as pointer glides
      const moveDist = Math.hypot(mouseX - lastWaveX, mouseY - lastWaveY);
      if (moveDist > 20) {
        spawnRipple(mouseX, mouseY, false);
        lastWaveX = mouseX;
        lastWaveY = mouseY;
      }

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        'button, a, label, select, [data-bounce-card], .group'
      ) as HTMLElement | null;

      if (interactive) {
        if (activeFloatingEl && activeFloatingEl !== interactive) {
          activeFloatingEl.style.transform = '';
          activeFloatingEl.style.removeProperty('--spot-x');
          activeFloatingEl.style.removeProperty('--spot-y');
        }
        activeFloatingEl = interactive;

        const rect = interactive.getBoundingClientRect();

        // When entering a new card or button, emit a water displacement wave & micro-bubble sound
        if (lastHoveredEl !== interactive) {
          lastHoveredEl = interactive;
          spawnRipple(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2,
            false,
            Math.min(185, Math.max(rect.width, rect.height) * 0.78)
          );
          playWaterHoverBubble();
        }

        if (rect.width > 0 && rect.height > 0 && rect.width < 1050) {
          const localX = e.clientX - rect.left;
          const localY = e.clientY - rect.top;
          interactive.style.setProperty('--spot-x', `${localX.toFixed(0)}px`);
          interactive.style.setProperty('--spot-y', `${localY.toFixed(0)}px`);

          // Controlled physical proximity response (subtle magnetic attraction & perspective depth)
          const relX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
          const relY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

          const isSmall = rect.width < 290 && rect.height < 95;
          if (isSmall) {
            const floatX = relX * 4.5;
            const floatY = relY * 3.2 - 2.5;
            interactive.style.transform = `translate3d(${floatX.toFixed(1)}px, ${floatY.toFixed(
              1
            )}px, 8px) scale(1.032)`;
          } else {
            const tiltX = -relY * 4.2;
            const tiltY = relX * 4.2;
            interactive.style.transform = `perspective(1050px) translate3d(${(relX * 3.4).toFixed(
              1
            )}px, -5px, 14px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale(1.012)`;
          }
        }
        if (cursorDropRef.current) {
          cursorDropRef.current.dataset.cursorState =
            interactive.tagName === 'BUTTON' || interactive.tagName === 'A' ? 'action' : 'card';
        }
      } else {
        lastHoveredEl = null;
        if (cursorDropRef.current) {
          cursorDropRef.current.dataset.cursorState = 'default';
        }
        if (activeFloatingEl) {
          activeFloatingEl.style.transform = '';
          activeFloatingEl.style.removeProperty('--spot-x');
          activeFloatingEl.style.removeProperty('--spot-y');
          activeFloatingEl = null;
        }
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      spawnRipple(e.clientX, e.clientY, true);
      playWaterDropSound();
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      if (activeFloatingEl) {
        activeFloatingEl.style.transform = '';
      }
      root.classList.remove('futuristic-bounce-active', 'aquatic-water-world');
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [enabled, themeMode]);

  if (!enabled) return null;

  const isLight = themeMode === 'light';

  return (
    <div className="pointer-events-none fixed inset-0 z-[9990] overflow-hidden">
      {/* Ambient Crystal Sub-Aquatic Refraction Layer */}
      <div
        className={`fixed inset-0 pointer-events-none transition-opacity duration-500 ${
          isLight
            ? 'bg-[radial-gradient(ellipse_at_50%_0%,rgba(14,165,233,0.10),transparent_65%),radial-gradient(ellipse_at_85%_90%,rgba(56,189,248,0.08),transparent_60%)]'
            : 'bg-[radial-gradient(ellipse_at_50%_0%,rgba(14,165,233,0.14),transparent_65%),radial-gradient(ellipse_at_85%_90%,rgba(56,189,248,0.10),transparent_60%)]'
        }`}
      />

      {/* Interactive 60fps Liquid Water Ripple, Caustic Mesh, Sub-Surface Koi & 3D Crown Splash Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none"
      />

      {/* Trailing Secondary Micro Water Droplet (Subtle 12px trailing aura) */}
      <div
        ref={cursorTrailRef}
        className={`custom-spatial-cursor hidden md:block w-3 h-3 rounded-full will-change-transform border ${
          isLight
            ? 'border-sky-500/40 bg-sky-300/15 shadow-[inset_0_1px_2px_rgba(255,255,255,0.85)]'
            : 'border-sky-400/35 bg-sky-400/10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)]'
        }`}
      />

      {/* Primary Subtle Optical Cursor Follower (24px precision ring) */}
      <div
        ref={cursorDropRef}
        className={`custom-spatial-cursor hidden md:flex w-6 h-6 rounded-full will-change-transform items-center justify-center border transition-all duration-200 backdrop-blur-[1px] data-[cursor-state=action]:scale-125 data-[cursor-state=card]:scale-110 ${
          isLight
            ? 'border-neutral-900/35 bg-white/25 shadow-[0_4px_16px_rgba(15,23,42,0.12),inset_0_1px_4px_rgba(255,255,255,0.9)]'
            : 'border-white/35 bg-white/10 shadow-[0_4px_18px_rgba(56,189,248,0.28),inset_0_1px_4px_rgba(255,255,255,0.5)]'
        }`}
      >
        {/* Specular Micro Lens Highlight */}
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
      </div>
    </div>
  );
};
