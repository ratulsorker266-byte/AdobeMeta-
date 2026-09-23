/**
 * High-Performance Adobe Photoshop PSD & PSB Parser and Preview Engine
 *
 * Supports Photoshop PSD, PSB, and common typo extensions (.spd, .psd, .psb).
 * 1. Reads the composite canvas image from PSD binary data using ag-psd.
 * 2. Generates a crisp JPEG visual thumbnail for instant browser display in the dropzone.
 * 3. Extracts Photoshop document metadata, dimensions, color mode, and layer info.
 * 4. Supplies base64 thumbnail for Gemini Dual-Agent Vision AI to generate commercial microstock metadata.
 */

import { readPsd } from 'ag-psd';

export interface ParsedPsdData {
  previewUrl: string;
  base64ForAi: string;
  metadata: {
    title?: string;
    width?: number;
    height?: number;
    colorMode?: string;
    bitsPerChannel?: number;
    layerCount?: number;
  };
}

/**
 * Checks if a file is an Adobe Photoshop PSD / PSB (including user typo .spd)
 */
export function isPsdFile(file: File): boolean {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  if (['psd', 'psb', 'spd'].includes(ext)) return true;
  if (file.type === 'image/vnd.adobe.photoshop' || file.type === 'image/x-photoshop' || file.type === 'application/x-photoshop') return true;
  return false;
}

/**
 * Parses a Photoshop PSD/PSB file, renders its canvas thumbnail, and extracts dimensions
 */
export async function parsePsdFile(file: File): Promise<ParsedPsdData> {
  const arrayBuffer = await file.arrayBuffer();
  
  try {
    // Read PSD header and composite canvas image
    const psd = readPsd(arrayBuffer, { skipLayerImageData: true });
    
    let canvas: HTMLCanvasElement | null = null;
    let previewUrl = '';
    let base64ForAi = '';

    if (psd.canvas) {
      // Direct canvas provided by ag-psd
      canvas = psd.canvas as HTMLCanvasElement;
    } else {
      // Create fallback thumbnail canvas using dimensions
      canvas = document.createElement('canvas');
      const maxDim = 800;
      const w = psd.width || 800;
      const h = psd.height || 600;
      const scale = Math.min(1, maxDim / Math.max(w, h));
      canvas.width = Math.max(1, Math.round(w * scale));
      canvas.height = Math.max(1, Math.round(h * scale));
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw elegant mockup PSD placeholder if image data is raw CMYK without canvas
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#001e36');
        gradient.addColorStop(1, '#000814');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#31a8ff';
        ctx.font = 'bold 36px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Ps', canvas.width / 2, canvas.height / 2 - 20);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '16px sans-serif';
        ctx.fillText(`${file.name.replace(/\.[^/.]+$/, '')}`, canvas.width / 2, canvas.height / 2 + 30);
      }
    }

    if (canvas) {
      // Generate scaled JPEG for display & AI
      const displayCanvas = document.createElement('canvas');
      const maxDim = 1000;
      const scale = Math.min(1, maxDim / Math.max(canvas.width, canvas.height));
      displayCanvas.width = Math.max(1, Math.round(canvas.width * scale));
      displayCanvas.height = Math.max(1, Math.round(canvas.height * scale));
      const dCtx = displayCanvas.getContext('2d');
      if (dCtx) {
        dCtx.fillStyle = '#ffffff';
        dCtx.fillRect(0, 0, displayCanvas.width, displayCanvas.height);
        dCtx.drawImage(canvas, 0, 0, displayCanvas.width, displayCanvas.height);
        previewUrl = displayCanvas.toDataURL('image/jpeg', 0.88);
        base64ForAi = previewUrl.split(',')[1] || '';
      }
    }

    const cleanTitle = file.name
      .replace(/\.(psd|psb|spd)$/i, '')
      .replace(/[_-]+/g, ' ')
      .trim();

    return {
      previewUrl,
      base64ForAi,
      metadata: {
        title: cleanTitle,
        width: psd.width,
        height: psd.height,
        colorMode: psd.colorMode !== undefined ? String(psd.colorMode) : 'RGB',
        bitsPerChannel: psd.bitsPerChannel,
        layerCount: psd.children?.length || 0,
      }
    };
  } catch (err) {
    console.warn('PSD parser warning, creating stylized fallback preview:', err);
    // Create high-visibility fallback PSD preview canvas
    const fallbackCanvas = document.createElement('canvas');
    fallbackCanvas.width = 640;
    fallbackCanvas.height = 480;
    const ctx = fallbackCanvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createLinearGradient(0, 0, 640, 480);
      grad.addColorStop(0, '#001e36');
      grad.addColorStop(1, '#000c19');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 640, 480);

      // Adobe Photoshop icon badge
      ctx.fillStyle = '#31a8ff';
      ctx.fillRect(60, 50, 64, 64);
      ctx.fillStyle = '#001e36';
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Ps', 92, 82);

      // Filename text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(file.name, 145, 85);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '14px sans-serif';
      ctx.fillText('Adobe Photoshop Document (PSD / PSB)', 145, 110);
    }

    const previewUrl = fallbackCanvas.toDataURL('image/jpeg', 0.85);
    const cleanTitle = file.name
      .replace(/\.(psd|psb|spd)$/i, '')
      .replace(/[_-]+/g, ' ')
      .trim();

    return {
      previewUrl,
      base64ForAi: previewUrl.split(',')[1] || '',
      metadata: {
        title: cleanTitle,
      }
    };
  }
}
