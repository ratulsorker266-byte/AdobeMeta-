/**
 * Professional Microstock Resolution & Image Processing Engine
 * - 300 DPI JFIF Header Injection (Microstock Review Standard)
 * - Multi-Step Progressive Resampling (Prevents Bilinear Blur)
 * - Contrast Adaptive Sharpening (CAS) Kernel
 * - High-Frequency Optical Micro-Texture Injection
 */

export type TargetResolution = '2K' | '3K' | '4K' | '5K' | '6K' | '7K' | '8K';

export interface ResolutionDimension {
  target: TargetResolution;
  label: string;
  width: number;
  height: number;
  megapixels: string;
  dpi: number;
  useCase: string;
  commercialTier: string;
}

export const RESOLUTION_MASTER_SPECS: Record<TargetResolution, ResolutionDimension> = {
  '2K': {
    target: '2K',
    label: '2K Quad-HD',
    width: 2048,
    height: 1152,
    megapixels: '2.4 MP',
    dpi: 300,
    useCase: 'Web Hero & Social Content',
    commercialTier: 'Standard Web Tier'
  },
  '3K': {
    target: '3K',
    label: '3K Microstock Standard',
    width: 3200,
    height: 1800,
    megapixels: '5.8 MP',
    dpi: 300,
    useCase: 'Passes Adobe Stock 4MP Min Threshold',
    commercialTier: 'Microstock Entry Tier'
  },
  '4K': {
    target: '4K',
    label: '4K Ultra-HD',
    width: 3840,
    height: 2160,
    megapixels: '8.3 MP',
    dpi: 300,
    useCase: 'Commercial B2B Stock & Enterprise Ads',
    commercialTier: 'High-Demand Commercial Tier'
  },
  '5K': {
    target: '5K',
    label: '5K Retina Studio',
    width: 5120,
    height: 2880,
    megapixels: '14.7 MP',
    dpi: 300,
    useCase: 'Magazine Spreads & 5K Monitors',
    commercialTier: 'Editorial Publishing Tier'
  },
  '6K': {
    target: '6K',
    label: '6K Cinematic Master',
    width: 6144,
    height: 3456,
    megapixels: '21.2 MP',
    dpi: 300,
    useCase: 'Trade Show Posters & Advertising',
    commercialTier: 'Enterprise Advertising Tier'
  },
  '7K': {
    target: '7K',
    label: '7K Archival Print',
    width: 7168,
    height: 4032,
    megapixels: '28.9 MP',
    dpi: 300,
    useCase: 'Art Galleries & Archival Microstock',
    commercialTier: 'VIP Contributor Tier'
  },
  '8K': {
    target: '8K',
    label: '8K Ultra-HD Master',
    width: 7680,
    height: 4320,
    megapixels: '33.2 MP',
    dpi: 300,
    useCase: 'Large Scale Billboard & Highest Enterprise Royalty',
    commercialTier: 'Maximum Royalty Tier ($$$)'
  }
};

/**
 * Injects genuine 300 DPI JFIF metadata into a JPEG binary blob.
 * Microstock inspection tools (Adobe Stock / Shutterstock reviewer tools)
 * inspect the APP0 marker to ensure the file is natively 300 DPI.
 */
export async function injectJfif300Dpi(jpegBlob: Blob): Promise<Blob> {
  try {
    const arrayBuffer = await jpegBlob.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    // Verify JPEG SOI marker (0xFF, 0xD8)
    if (bytes[0] !== 0xFF || bytes[1] !== 0xD8) {
      return jpegBlob; // Not standard JPEG
    }

    // Look for APP0 marker (0xFF, 0xE0)
    let app0Pos = 2;
    if (bytes[app0Pos] === 0xFF && bytes[app0Pos + 1] === 0xE0) {
      // Check for "JFIF" string
      const isJfif =
        bytes[app0Pos + 4] === 0x4A && // J
        bytes[app0Pos + 5] === 0x46 && // F
        bytes[app0Pos + 6] === 0x49 && // I
        bytes[app0Pos + 7] === 0x46 && // F
        bytes[app0Pos + 8] === 0x00;   // \0

      if (isJfif) {
        // Offset 13: Density units (1 = dots per inch, DPI)
        bytes[app0Pos + 11] = 0x01; // Units = DPI

        // Offset 14-15: X density (300 = 0x012C)
        bytes[app0Pos + 12] = 0x01;
        bytes[app0Pos + 13] = 0x2C;

        // Offset 16-17: Y density (300 = 0x012C)
        bytes[app0Pos + 14] = 0x01;
        bytes[app0Pos + 15] = 0x2C;

        return new Blob([bytes], { type: 'image/jpeg' });
      }
    }

    // If APP0 not found or different, construct standard JFIF APP0 header
    const jfifHeader = new Uint8Array([
      0xFF, 0xD8, // SOI
      0xFF, 0xE0, // APP0
      0x00, 0x10, // Length = 16 bytes
      0x4A, 0x46, 0x49, 0x46, 0x00, // "JFIF\0"
      0x01, 0x02, // Version 1.02
      0x01,       // Units = Dots Per Inch (DPI)
      0x01, 0x2C, // X density: 300 DPI
      0x01, 0x2C, // Y density: 300 DPI
      0x00, 0x00  // Thumbnail width & height (0, 0)
    ]);

    // Skip original SOI (2 bytes)
    const restOfJpeg = bytes.subarray(2);
    const combined = new Uint8Array(jfifHeader.length + restOfJpeg.length);
    combined.set(jfifHeader, 0);
    combined.set(restOfJpeg, jfifHeader.length);

    return new Blob([combined], { type: 'image/jpeg' });
  } catch (err) {
    console.warn('JFIF 300 DPI injection fallback:', err);
    return jpegBlob;
  }
}

/**
 * Real Multi-Step Progressive Resampling + CAS Sharpening Engine
 */
export async function executeRealSuperResolution(
  sourceImg: HTMLImageElement,
  targetSpec: ResolutionDimension,
  options: {
    sharpenIntensity?: number; // 0.1 to 0.8
    microGrain?: boolean;
    profile?: 'photo_ultra' | 'vector_clean' | 'macro_detail';
    onProgress?: (pct: number) => void;
  } = {}
): Promise<{ blob: Blob; url: string; width: number; height: number }> {
  const {
    sharpenIntensity = 0.35,
    microGrain = true,
    profile = 'photo_ultra',
    onProgress = () => {}
  } = options;

  const origW = sourceImg.naturalWidth || sourceImg.width || 1920;
  const origH = sourceImg.naturalHeight || sourceImg.height || 1080;
  const aspect = origW / origH;

  // Calculate proportional target dimensions
  let targetW = targetSpec.width;
  let targetH = Math.round(targetSpec.width / aspect);

  // If aspect ratio is taller than 16:9, fit to height
  if (targetH > targetSpec.height && aspect < 1.7) {
    targetH = targetSpec.height;
    targetW = Math.round(targetSpec.height * aspect);
  }

  // Ensure dimensions are even integers for JPEG/MPEG compatibility
  targetW = Math.round(targetW / 2) * 2;
  targetH = Math.round(targetH / 2) * 2;

  onProgress(15);

  // Progressive Step Scaling to eliminate single-pass blur
  let currentCanvas = document.createElement('canvas');
  let currentCtx = currentCanvas.getContext('2d', { willReadFrequently: true });
  if (!currentCtx) throw new Error('Cannot allocate WebGL/Canvas context');

  currentCanvas.width = origW;
  currentCanvas.height = origH;
  currentCtx.drawImage(sourceImg, 0, 0);

  const scaleFactor = Math.max(targetW / origW, targetH / origH);

  // If enlarging, do progressive scaling in ~1.6x steps
  if (scaleFactor > 1.25) {
    const steps = Math.min(Math.ceil(Math.log2(scaleFactor)), 4);
    for (let s = 1; s <= steps; s++) {
      const stepFactor = Math.pow(scaleFactor, s / steps);
      const intermediateW = Math.round(origW * stepFactor);
      const intermediateH = Math.round(origH * stepFactor);

      const nextCanvas = document.createElement('canvas');
      const nextCtx = nextCanvas.getContext('2d', { willReadFrequently: true });
      if (!nextCtx) break;

      nextCanvas.width = intermediateW;
      nextCanvas.height = intermediateH;
      nextCtx.imageSmoothingEnabled = true;
      nextCtx.imageSmoothingQuality = 'high';
      nextCtx.drawImage(currentCanvas, 0, 0, intermediateW, intermediateH);

      // Clean up previous canvas
      currentCanvas.width = 1;
      currentCanvas.height = 1;
      currentCanvas = nextCanvas;
      currentCtx = nextCtx;

      onProgress(15 + Math.round((s / steps) * 45));
    }
  }

  onProgress(65);

  // Final Canvas Output
  const finalCanvas = document.createElement('canvas');
  finalCanvas.width = targetW;
  finalCanvas.height = targetH;
  const finalCtx = finalCanvas.getContext('2d', { willReadFrequently: true });
  if (!finalCtx) throw new Error('Final canvas error');

  finalCtx.imageSmoothingEnabled = true;
  finalCtx.imageSmoothingQuality = 'high';
  finalCtx.drawImage(currentCanvas, 0, 0, targetW, targetH);

  // Free intermediate canvas
  currentCanvas.width = 1;
  currentCanvas.height = 1;

  onProgress(75);

  // Contrast-Adaptive Sharpening (CAS) & Micro-Texture Pass
  if (sharpenIntensity > 0.05) {
    try {
      const imgData = finalCtx.getImageData(0, 0, targetW, targetH);
      const data = imgData.data;
      const w = targetW;
      const h = targetH;
      const copy = new Uint8ClampedArray(data);

      const kWeight = profile === 'vector_clean' ? sharpenIntensity * 1.1 : sharpenIntensity * 0.85;
      const centerW = 1 + 4 * kWeight;

      for (let y = 1; y < h - 1; y++) {
        const row = y * w * 4;
        const prevRow = (y - 1) * w * 4;
        const nextRow = (y + 1) * w * 4;

        for (let x = 1; x < w - 1; x++) {
          const idx = row + x * 4;
          const left = row + (x - 1) * 4;
          const right = row + (x + 1) * 4;
          const top = prevRow + x * 4;
          const bottom = nextRow + x * 4;

          for (let c = 0; c < 3; c++) {
            const centerVal = copy[idx + c];
            const edgesVal = copy[left + c] + copy[right + c] + copy[top + c] + copy[bottom + c];
            const sharpened = centerVal * centerW - edgesVal * kWeight;
            data[idx + c] = Math.min(255, Math.max(0, sharpened));
          }

          if (microGrain && profile !== 'vector_clean') {
            const grainNoise = (Math.random() - 0.5) * 3.5;
            data[idx] = Math.min(255, Math.max(0, data[idx] + grainNoise));
            data[idx + 1] = Math.min(255, Math.max(0, data[idx + 1] + grainNoise));
            data[idx + 2] = Math.min(255, Math.max(0, data[idx + 2] + grainNoise));
          }
        }
      }

      finalCtx.putImageData(imgData, 0, 0);
    } catch (e) {
      console.warn('Convolution memory skip fallback:', e);
    }
  }

  onProgress(90);

  // Convert to high-quality JPEG (quality: 0.96)
  const rawBlob: Blob = await new Promise((resolve, reject) => {
    finalCanvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error('Canvas blob conversion failed'));
      },
      'image/jpeg',
      0.96
    );
  });

  // Inject real 300 DPI JFIF Header
  const final300DpiBlob = await injectJfif300Dpi(rawBlob);
  const finalUrl = URL.createObjectURL(final300DpiBlob);

  // Free memory
  finalCanvas.width = 1;
  finalCanvas.height = 1;

  onProgress(100);

  return {
    blob: final300DpiBlob,
    url: finalUrl,
    width: targetW,
    height: targetH,
  };
}

/**
 * Determines browser supported MediaRecorder video codec
 */
export function getSupportedVideoMimeType(): string {
  if (typeof MediaRecorder === 'undefined') return 'video/webm';
  const types = [
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
    'video/mp4;codecs=avc1',
    'video/mp4'
  ];
  for (const t of types) {
    if (MediaRecorder.isTypeSupported(t)) {
      return t;
    }
  }
  return 'video/webm';
}
