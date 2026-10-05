// Tactile Audio Feedback using Browser Web Audio API (Zero external assets, instant response)
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function isSoundEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem('adobemeta_sound_enabled') !== 'false';
}

export function setSoundEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('adobemeta_sound_enabled', enabled ? 'true' : 'false');
}

/**
 * Whispering mechanical camera shutter click (Leica / Hasselblad feel)
 */
export function playShutterSound(): void {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    
    // First click (shutter opening)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(1400, now);
    osc1.frequency.exponentialRampToValueAtTime(120, now + 0.04);
    gain1.gain.setValueAtTime(0.08, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.04);

    // Second click (shutter curtain closing)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(900, now + 0.05);
    osc2.frequency.exponentialRampToValueAtTime(80, now + 0.09);
    gain2.gain.setValueAtTime(0.06, now + 0.05);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.05);
    osc2.stop(now + 0.09);
  } catch (_) {}
}

/**
 * Soft glass harmonic chime for successful operations & copy actions
 */
export function playChimeSound(): void {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08); // A5
    
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.35);
  } catch (_) {}
}

/**
 * Crisp minimalist haptic tick for room and tab switches
 */
export function playTickSound(): void {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1800, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.02);
    
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.02);
  } catch (_) {}
}

/**
 * Pure crystal water droplet plop sound (multi-harmonic resonant cavity + sub-aquatic shimmer)
 */
export function playWaterDropSound(): void {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    // 1. Primary water droplet resonant cavity sweep
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    const startFreq = 310 + Math.random() * 55;
    const endFreq = 1040 + Math.random() * 160;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.088);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.068, now + 0.014);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.16);

    // 2. Secondary harmonic crown-droplet plink (delayed 55ms like real falling splash drop)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(640 + Math.random() * 90, now + 0.055);
    osc2.frequency.exponentialRampToValueAtTime(1480 + Math.random() * 180, now + 0.115);

    gain2.gain.setValueAtTime(0.0005, now + 0.055);
    gain2.gain.linearRampToValueAtTime(0.032, now + 0.068);
    gain2.gain.exponentialRampToValueAtTime(0.0005, now + 0.145);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.055);
    osc2.stop(now + 0.15);
  } catch (_) {}
}

/**
 * Soft sub-aquatic micro-bubble hover chime when entering cards/buttons
 */
export function playWaterHoverBubble(): void {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const base = 540 + Math.random() * 190;
    osc.frequency.setValueAtTime(base, now);
    osc.frequency.exponentialRampToValueAtTime(base * 1.68, now + 0.048);

    gain.gain.setValueAtTime(0.02, now);
    gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.058);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.062);
  } catch (_) {}
}

/**
 * Ultrasonic / Audible FSK Data Modem Packet Burst (Transmits binary metadata bits as frequency-shift tones)
 * Returns an array of frequency points so a live spectrogram can visualize the acoustic transmission.
 */
export function playAcousticModemTransmission(
  textPayload: string,
  onStep?: (bitIndex: number, totalBits: number, freqHz: number, charNow: string) => void,
  onComplete?: () => void
): () => void {
  const ctx = getAudioContext();
  const cleanStr = (textPayload || 'AMP49-PACKET').slice(0, 42);
  const totalSteps = cleanStr.length * 4;
  let step = 0;
  let cancelled = false;

  const timer = setInterval(() => {
    if (cancelled || step >= totalSteps) {
      clearInterval(timer);
      if (!cancelled && onComplete) onComplete();
      return;
    }

    const charIdx = Math.floor(step / 4);
    const nibbleShift = (step % 4) * 2;
    const code = cleanStr.charCodeAt(charIdx) || 65;
    const dibit = (code >> nibbleShift) & 0x03;

    // 4-FSK Frequencies: 00 -> 1240Hz, 01 -> 1680Hz, 10 -> 2120Hz, 11 -> 2640Hz
    const fskTable = [1240, 1680, 2120, 2640];
    const freq = fskTable[dibit];

    if (ctx && isSoundEnabled()) {
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.028, now);
        gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.042);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.045);
      } catch (_) {}
    }

    if (onStep) {
      onStep(step + 1, totalSteps, freq, cleanStr[charIdx]);
    }
    step++;
  }, 48);

  return () => {
    cancelled = true;
    clearInterval(timer);
  };
}


