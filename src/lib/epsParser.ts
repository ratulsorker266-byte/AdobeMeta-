/**
 * High-Performance EPS (Encapsulated PostScript) & Illustrator (.AI) Visual Renderer & Parser
 *
 * Guarantees 100% viewable vector previews & ground-truth metadata extraction for Adobe Stock:
 * 1. Primary Server-Side Ghostscript (-dEPSFitPage) 1280px High-Definition sRGB Vector Rendering.
 * 2. Client-Side Adobe XMP <xmpGImg:image> Base64 JPEG extractor (properly decodes &#xA; XML newline entities).
 * 3. Client-Side Adobe Illustrator %AI7_Thumbnail 8-bit 256-Color Palette + RLE Canvas Renderer.
 * 4. Browser Image Decode Verification (new Image() naturalWidth check) so broken <img> icons can NEVER occur.
 * 5. In-flight Promise deduplication via WeakMap<File, Promise<ParsedEpsData>>.
 */

export interface ParsedEpsData {
  previewUrl: string;
  base64ForAi: string;
  hasEmbeddedThumbnail: boolean;
  metadata: {
    title?: string;
    keywords?: string[];
    description?: string;
    creator?: string;
    boundingBox?: { x1: number; y1: number; x2: number; y2: number; width: number; height: number };
    colorPalette?: string[];
  };
}

const epsParseCache = new WeakMap<File, Promise<ParsedEpsData>>();

/**
 * Fast Base64 conversion for Uint8Arrays
 */
function uint8ToBase64(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  const chunkSize = 16384;
  for (let i = 0; i < len; i += chunkSize) {
    const chunk = bytes.subarray(i, Math.min(i + chunkSize, len));
    binary += String.fromCharCode.apply(null, chunk as any);
  }
  return btoa(binary);
}

/**
 * Checks if a file is an EPS or AI vector file by extension or MIME type.
 */
export function isEpsFile(file: File): boolean {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  return (
    ext === 'eps' ||
    ext === 'ai' ||
    file.type === 'application/postscript' ||
    file.type === 'image/x-eps' ||
    file.type === 'application/eps' ||
    file.type === 'application/x-eps'
  );
}

/**
 * Verifies that a data:image/* URL genuinely decodes in the browser with valid dimensions (>= 16x16).
 * Prevents CMYK or truncated binary streams from ever showing a broken <img> icon.
 */
export function verifyBrowserImageDecodes(dataUrl: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (!dataUrl || !dataUrl.startsWith('data:image/')) {
      return resolve(false);
    }
    const img = new Image();
    const timer = setTimeout(() => {
      resolve(false);
    }, 3500);

    img.onload = () => {
      clearTimeout(timer);
      resolve(img.naturalWidth >= 16 && img.naturalHeight >= 16);
    };
    img.onerror = () => {
      clearTimeout(timer);
      resolve(false);
    };
    img.src = dataUrl;
  });
}

/**
 * Extracts Adobe XMP <xmpGImg:image> Base64 JPEG (properly stripping &#xA; XML newline entities)
 */
function extractXmpThumbnailFromText(combinedText: string): { previewUrl: string; base64: string } | null {
  try {
    const xmpImgMatch = combinedText.match(/<xmpGImg:image[^>]*>([\s\S]*?)<\/xmpGImg:image>/i);
    if (xmpImgMatch && xmpImgMatch[1]) {
      const cleanB64 = xmpImgMatch[1]
        .replace(/&#x[0-9a-fA-F]+;/g, '')
        .replace(/&#\d+;/g, '')
        .replace(/[\s\r\n]+/g, '');
      if (cleanB64.length > 200) {
        return {
          previewUrl: `data:image/jpeg;base64,${cleanB64}`,
          base64: cleanB64,
        };
      }
    }
  } catch (_) {}
  return null;
}

/**
 * Client-side Adobe Illustrator %AI7_Thumbnail 8-bit 256-color palette + RLE decoder -> Canvas JPEG
 */
function extractAi7ThumbnailToCanvas(headText: string): { previewUrl: string; base64: string } | null {
  try {
    const ai7Match = headText.match(/%AI7_Thumbnail:\s*(\d+)\s+(\d+)\s+8[\r\n]+([\s\S]*?)(?:%%EndData|%%EndComments|[\r\n][^%])/i);
    if (!ai7Match) return null;

    const w = parseInt(ai7Match[1], 10);
    const h = parseInt(ai7Match[2], 10);
    if (w <= 0 || h <= 0 || w > 2048 || h > 2048) return null;

    const dataSection = ai7Match[3].replace(/%%BeginData:[^\r\n]*[\r\n]+/i, '');
    const hex = dataSection.replace(/[\s\r\n%]+/g, '');
    if (hex.length < 1536) return null;

    const byteLen = Math.floor(hex.length / 2);
    const rawBytes = new Uint8Array(byteLen);
    for (let i = 0; i < byteLen; i++) {
      rawBytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
    }

    if (rawBytes.length <= 768) return null;
    const palette = rawBytes.subarray(0, 768);
    let dataOffset = 768;
    const isRle =
      rawBytes.length > 771 &&
      rawBytes[768] === 0x52 && // 'R'
      rawBytes[769] === 0x4c && // 'L'
      rawBytes[770] === 0x45;   // 'E'
    if (isRle) dataOffset = 771;

    const numPixels = w * h;
    const indices = new Uint8Array(numPixels);
    let pIdx = 0;
    let i = dataOffset;

    if (isRle) {
      while (i < rawBytes.length && pIdx < numPixels) {
        const b = rawBytes[i++];
        if (b === 0xfd) {
          if (i >= rawBytes.length) break;
          const lenOrFlag = rawBytes[i++];
          if (lenOrFlag === 0xfd) {
            indices[pIdx++] = 0xfd;
          } else {
            const val = i < rawBytes.length ? rawBytes[i++] : 0;
            for (let r = 0; r < lenOrFlag && pIdx < numPixels; r++) {
              indices[pIdx++] = val;
            }
          }
        } else {
          indices[pIdx++] = b;
        }
      }
    } else {
      while (i < rawBytes.length && pIdx < numPixels) {
        indices[pIdx++] = rawBytes[i++];
      }
    }

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const imgData = ctx.createImageData(w, h);
    const rgba = imgData.data;
    for (let px = 0; px < numPixels; px++) {
      const cIdx = indices[px] * 3;
      const outIdx = px * 4;
      rgba[outIdx] = palette[cIdx] ?? 255;
      rgba[outIdx + 1] = palette[cIdx + 1] ?? 255;
      rgba[outIdx + 2] = palette[cIdx + 2] ?? 255;
      rgba[outIdx + 3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);

    // Scale up cleanly to 512px for crisp UI preview
    const outCanvas = document.createElement('canvas');
    const scale = Math.max(1, Math.min(4, 512 / Math.max(w, h)));
    outCanvas.width = Math.round(w * scale);
    outCanvas.height = Math.round(h * scale);
    const outCtx = outCanvas.getContext('2d');
    if (outCtx) {
      outCtx.fillStyle = '#FFFFFF';
      outCtx.fillRect(0, 0, outCanvas.width, outCanvas.height);
      outCtx.drawImage(canvas, 0, 0, outCanvas.width, outCanvas.height);
      const dataUrl = outCanvas.toDataURL('image/jpeg', 0.92);
      return {
        previewUrl: dataUrl,
        base64: dataUrl.split(',')[1] || '',
      };
    }

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    return {
      previewUrl: dataUrl,
      base64: dataUrl.split(',')[1] || '',
    };
  } catch (_) {
    return null;
  }
}

/**
 * Parses an EPS or AI file and returns a guaranteed viewable preview URL and embedded metadata.
 * Caches in-flight and completed results per File object.
 */
export function parseEpsFile(file: File, forceRefresh = false): Promise<ParsedEpsData> {
  if (!forceRefresh && epsParseCache.has(file)) {
    return epsParseCache.get(file)!;
  }

  const task = parseEpsFileInternal(file);
  epsParseCache.set(file, task);
  return task;
}

async function parseEpsFileInternal(file: File): Promise<ParsedEpsData> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);

    // 1. Check for DOS Binary EPS header (0xC5 0xD0 0xD3 0xC6)
    const isDosBinary =
      uint8.length >= 30 &&
      uint8[0] === 0xc5 &&
      uint8[1] === 0xd0 &&
      uint8[2] === 0xd3 &&
      uint8[3] === 0xc6;

    let psStart = 0;
    let psLength = uint8.length;

    if (isDosBinary) {
      const view = new DataView(arrayBuffer);
      psStart = view.getUint32(4, true);
      const rawPsLen = view.getUint32(8, true);
      if (psStart > 0 && psStart < uint8.length) {
        psLength = rawPsLen > 0 ? Math.min(uint8.length - psStart, rawPsLen) : uint8.length - psStart;
      } else {
        psStart = 0;
      }
    }

    // 2. Decode Head (up to 2MB) and Tail (up to 1MB) of PostScript for DSC metadata & XMP thumbnails
    const headText = decodePostScriptText(uint8, psStart, Math.min(psLength, 2000000));
    const tailText =
      psLength > 2000000
        ? decodePostScriptText(uint8, psStart + psLength - 1000000, 1000000)
        : '';
    const combinedText = tailText ? `${headText}\n${tailText}` : headText;

    const metadata = extractMetadataFromText(combinedText);
    if (!metadata.title) {
      metadata.title = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ').trim();
    }

    // ATTEMPT 1 (PRIMARY HIGH-RES VECTOR RENDER): Server-Side Ghostscript Engine (/api/render-eps)
    // Renders the true PostScript vector paths at up to 1280px resolution with 4x anti-aliasing!
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);

      const res = await fetch('/api/render-eps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/postscript',
          'x-file-name': encodeURIComponent(file.name),
        },
        body: file,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.previewUrl) {
          const isValid = await verifyBrowserImageDecodes(data.previewUrl);
          if (isValid) {
            return {
              previewUrl: data.previewUrl,
              base64ForAi: data.base64ForAi || data.previewUrl.split(',')[1] || '',
              hasEmbeddedThumbnail: true,
              metadata: {
                ...metadata,
                ...(data.metadata || {}),
              },
            };
          }
        }
      }
    } catch (serverErr) {
      console.warn('Server EPS render fallback triggered:', serverErr);
    }

    // ATTEMPT 2: Client-Side Adobe XMP <xmpGImg:image> Base64 JPEG (decodes &#xA; entities)
    const xmpRaster = extractXmpThumbnailFromText(combinedText);
    if (xmpRaster && (await verifyBrowserImageDecodes(xmpRaster.previewUrl))) {
      return {
        previewUrl: xmpRaster.previewUrl,
        base64ForAi: xmpRaster.base64,
        hasEmbeddedThumbnail: true,
        metadata,
      };
    }

    // ATTEMPT 3: Client-Side Illustrator %AI7_Thumbnail 8-bit 256-color RLE Canvas Decoder
    const ai7Raster = extractAi7ThumbnailToCanvas(headText);
    if (ai7Raster && (await verifyBrowserImageDecodes(ai7Raster.previewUrl))) {
      return {
        previewUrl: ai7Raster.previewUrl,
        base64ForAi: ai7Raster.base64,
        hasEmbeddedThumbnail: true,
        metadata,
      };
    }

    // ATTEMPT 4: Client-Side %AI9_Data_Thumbnail / %BeginPhotoshop Hex JPEG
    const hexThumb = extractIllustratorThumbnail(combinedText);
    if (hexThumb && (await verifyBrowserImageDecodes(hexThumb))) {
      return {
        previewUrl: hexThumb,
        base64ForAi: hexThumb.split(',')[1] || '',
        hasEmbeddedThumbnail: true,
        metadata,
      };
    }

    // ATTEMPT 5: EPSI ASCII-hex preview (%%BeginPreview:)
    const epsiRaster = extractEpsiPreview(headText);
    if (epsiRaster && (await verifyBrowserImageDecodes(epsiRaster))) {
      return {
        previewUrl: epsiRaster,
        base64ForAi: epsiRaster.split(',')[1] || '',
        hasEmbeddedThumbnail: true,
        metadata,
      };
    }

    // ATTEMPT 6: Clean vector artboard preview canvas (when file has no renderable paths/thumbnails)
    const generatedPreview = generateVectorCardPreview(file.name, file.size, metadata);
    return {
      previewUrl: generatedPreview,
      base64ForAi: generatedPreview.split(',')[1] || '',
      hasEmbeddedThumbnail: false,
      metadata,
    };
  } catch (err) {
    console.warn('EPS parser error, generating fallback preview:', err);
    const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ').trim();
    const fallback = generateVectorCardPreview(file.name, file.size, { title: cleanTitle });
    return {
      previewUrl: fallback,
      base64ForAi: fallback.split(',')[1] || '',
      hasEmbeddedThumbnail: false,
      metadata: { title: cleanTitle },
    };
  }
}

/**
 * Safely decodes a slice of PostScript text using Latin1.
 */
function decodePostScriptText(uint8: Uint8Array, start: number, length: number): string {
  const safeStart = Math.max(0, Math.min(start, uint8.length));
  const safeLength = Math.min(length, uint8.length - safeStart);
  if (safeLength <= 0) return '';
  const sub = uint8.subarray(safeStart, safeStart + safeLength);
  const decoder = new TextDecoder('latin1');
  return decoder.decode(sub);
}

/**
 * Extracts metadata from PostScript DSC headers and embedded XMP.
 */
function extractMetadataFromText(text: string): ParsedEpsData['metadata'] {
  const metadata: ParsedEpsData['metadata'] = {};

  // Extract %%Title:
  const titleMatch = text.match(/%%Title:\s*([^\r\n]+)/i);
  if (titleMatch && titleMatch[1]) {
    const raw = titleMatch[1].trim().replace(/^\(+|\)+$/g, '');
    if (raw && !raw.startsWith('Untitled') && !raw.endsWith('.eps') && !raw.endsWith('.ai') && raw.length > 2) {
      metadata.title = cleanPsString(raw);
    }
  }

  // Extract %%Creator:
  const creatorMatch = text.match(/%%Creator:\s*([^\r\n]+)/i);
  if (creatorMatch && creatorMatch[1]) {
    metadata.creator = creatorMatch[1].trim();
  }

  // Extract %%HiResBoundingBox or %%BoundingBox: llx lly urx ury
  const hiResMatch = text.match(/%%HiResBoundingBox:\s*(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/i);
  const bboxMatch = text.match(/%%BoundingBox:\s*(-?\d+)\s+(-?\d+)\s+(-?\d+)\s+(-?\d+)/i);
  if (hiResMatch) {
    const x1 = Math.floor(parseFloat(hiResMatch[1]));
    const y1 = Math.floor(parseFloat(hiResMatch[2]));
    const x2 = Math.ceil(parseFloat(hiResMatch[3]));
    const y2 = Math.ceil(parseFloat(hiResMatch[4]));
    const width = Math.abs(x2 - x1);
    const height = Math.abs(y2 - y1);
    if (width > 0 && height > 0) {
      metadata.boundingBox = { x1, y1, x2, y2, width, height };
    }
  } else if (bboxMatch) {
    const x1 = parseInt(bboxMatch[1], 10);
    const y1 = parseInt(bboxMatch[2], 10);
    const x2 = parseInt(bboxMatch[3], 10);
    const y2 = parseInt(bboxMatch[4], 10);
    const width = Math.abs(x2 - x1);
    const height = Math.abs(y2 - y1);
    if (width > 0 && height > 0) {
      metadata.boundingBox = { x1, y1, x2, y2, width, height };
    }
  }

  // Extract %%Keywords:
  const keywordsMatch = text.match(/%%Keywords:\s*([^\r\n]+)/i);
  if (keywordsMatch && keywordsMatch[1]) {
    const parts = keywordsMatch[1].split(/[,;]+/).map((k) => k.trim()).filter((k) => k.length > 1);
    if (parts.length > 0) {
      metadata.keywords = parts;
    }
  }

  // Extract %%Subject:
  const subjectMatch = text.match(/%%Subject:\s*([^\r\n]+)/i);
  if (subjectMatch && subjectMatch[1]) {
    metadata.description = cleanPsString(subjectMatch[1].trim());
  }

  // Extract Adobe XMP XML if embedded
  const xmpMatch = text.match(/<x:xmpmeta[\s\S]*?<\/x:xmpmeta>/i);
  if (xmpMatch) {
    const xmpText = xmpMatch[0];
    const dcTitle = xmpText.match(/<dc:title>[\s\S]*?<rdf:li[^>]*>([^<]+)<\/rdf:li>/i);
    if (dcTitle && dcTitle[1] && !dcTitle[1].trim().startsWith('Untitled')) {
      metadata.title = decodeXmlEntities(dcTitle[1].trim());
    }

    const dcDesc = xmpText.match(/<dc:description>[\s\S]*?<rdf:li[^>]*>([^<]+)<\/rdf:li>/i);
    if (dcDesc && dcDesc[1] && !metadata.description) {
      metadata.description = decodeXmlEntities(dcDesc[1].trim());
    }

    const dcTags: string[] = [];
    const subjectBlock = xmpText.match(/<dc:subject>[\s\S]*?<\/dc:subject>/i);
    if (subjectBlock) {
      const tagRegex = /<rdf:li>([^<]+)<\/rdf:li>/gi;
      let m;
      while ((m = tagRegex.exec(subjectBlock[0])) !== null) {
        if (m[1]) dcTags.push(decodeXmlEntities(m[1].trim()));
      }
    }
    if (dcTags.length > 0 && (!metadata.keywords || metadata.keywords.length === 0)) {
      metadata.keywords = dcTags;
    }
  }

  // Extract color swatches from PostScript drawing commands (e.g., 0.2 0.5 0.8 rg / setrgbcolor)
  const colors: string[] = [];
  const rgbRegex = /([0-1](?:\.\d+)?)\s+([0-1](?:\.\d+)?)\s+([0-1](?:\.\d+)?)\s+(?:rg|setrgbcolor)/gi;
  let rgbMatch;
  let count = 0;
  while ((rgbMatch = rgbRegex.exec(text)) !== null && count < 6) {
    const r = Math.round(parseFloat(rgbMatch[1]) * 255);
    const g = Math.round(parseFloat(rgbMatch[2]) * 255);
    const b = Math.round(parseFloat(rgbMatch[3]) * 255);
    if ((r > 15 || g > 15 || b > 15) && (r < 240 || g < 240 || b < 240)) {
      const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
      if (!colors.includes(hex)) {
        colors.push(hex);
        count++;
      }
    }
  }
  if (colors.length > 0) {
    metadata.colorPalette = colors;
  }

  return metadata;
}

/**
 * Attempts to extract an Illustrator JPEG/PNG thumbnail embedded in PostScript comments.
 */
function extractIllustratorThumbnail(text: string): string | null {
  const thumbMatch =
    text.match(/%(?:AI9|AI12)_Data_Thumbnail:?[^\r\n]*[\r\n]+([\s\S]*?)(?:%%EndPreview|%%EndComments|%AI9_Data_Thumbnail_End|[\r\n][^%])/i) ||
    text.match(/%BeginPhotoshop:[^\r\n]*[\r\n]+([\s\S]*?)%EndPhotoshop/i);
  if (thumbMatch && thumbMatch[1]) {
    try {
      const hex = thumbMatch[1].replace(/[\s\r\n%]+/g, '');
      if (hex.length > 100) {
        const bytes = new Uint8Array(hex.length / 2);
        for (let i = 0; i < hex.length; i += 2) {
          bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
        }
        if (bytes[0] === 0xff && bytes[1] === 0xd8) {
          return `data:image/jpeg;base64,${uint8ToBase64(bytes)}`;
        }
        if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
          return `data:image/png;base64,${uint8ToBase64(bytes)}`;
        }
      }
    } catch (_) {}
  }
  return null;
}

/**
 * Attempts to extract an EPSI 1-bit / 8-bit hex preview (%%BeginPreview:).
 */
function extractEpsiPreview(text: string): string | null {
  const previewMatch = text.match(/%%BeginPreview:\s*(\d+)\s+(\d+)\s+(\d+)\s+(\d+)([\s\S]*?)%%EndPreview/i);
  if (previewMatch) {
    try {
      const width = parseInt(previewMatch[1], 10);
      const height = parseInt(previewMatch[2], 10);
      const depth = parseInt(previewMatch[3], 10);
      const hexLines = previewMatch[5].replace(/[\s%]+/g, '');

      if (width > 0 && height > 0 && (depth === 1 || depth === 8)) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        const imgData = ctx.createImageData(width, height);
        const data = imgData.data;

        if (depth === 8) {
          let hexIdx = 0;
          for (let i = 0; i < width * height; i++) {
            const val = parseInt(hexLines.substring(hexIdx, hexIdx + 2) || 'FF', 16);
            hexIdx += 2;
            const px = i * 4;
            data[px] = val;
            data[px + 1] = val;
            data[px + 2] = val;
            data[px + 3] = 255;
          }
        } else if (depth === 1) {
          let bitIdx = 0;
          const bytes: number[] = [];
          for (let i = 0; i < hexLines.length; i += 2) {
            bytes.push(parseInt(hexLines.substring(i, i + 2), 16));
          }
          for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
              const byteIdx = Math.floor(bitIdx / 8);
              const bitOffset = 7 - (bitIdx % 8);
              const bit = byteIdx < bytes.length ? (bytes[byteIdx] >> bitOffset) & 1 : 1;
              bitIdx++;
              const val = bit === 0 ? 0 : 255;
              const px = (y * width + x) * 4;
              data[px] = val;
              data[px + 1] = val;
              data[px + 2] = val;
              data[px + 3] = 255;
            }
            if (bitIdx % 8 !== 0) {
              bitIdx += 8 - (bitIdx % 8);
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);
        return canvas.toDataURL('image/jpeg', 0.9);
      }
    } catch (_) {}
  }
  return null;
}

/**
 * Generates a clean, gallery-grade vector artboard preview canvas when no raster preview exists.
 */
function generateVectorCardPreview(
  fileName: string,
  fileSizeBytes: number,
  metadata: ParsedEpsData['metadata']
): string {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 450;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Warm Architectural Artboard Background
  ctx.fillStyle = '#faf8f5';
  ctx.fillRect(0, 0, 600, 450);

  // Subtle CAD Grid
  ctx.strokeStyle = 'rgba(20, 20, 19, 0.05)';
  ctx.lineWidth = 1;
  const gridSize = 24;
  for (let x = 0; x < 600; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 450);
    ctx.stroke();
  }
  for (let y = 0; y < 450; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(600, y);
    ctx.stroke();
  }

  // Artboard Frame
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#d6d3cd';
  ctx.lineWidth = 2;
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(32, 32, 536, 386, 16);
  } else {
    ctx.rect(32, 32, 536, 386);
  }
  ctx.fill();
  ctx.stroke();

  // Top Vector Badge
  ctx.fillStyle = '#141413';
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(54, 52, 136, 30, 8);
  } else {
    ctx.rect(54, 52, 136, 30);
  }
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('EPS VECTOR ART', 122, 71);

  // Center Bezier Anchor Illustration
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(190, 220);
  ctx.bezierCurveTo(240, 130, 360, 130, 410, 220);
  ctx.stroke();

  // Control handles
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#141413';
  ctx.lineWidth = 2;
  [
    [190, 220],
    [300, 152],
    [410, 220],
  ].forEach(([cx, cy]) => {
    ctx.fillRect(cx - 5, cy - 5, 10, 10);
    ctx.strokeRect(cx - 5, cy - 5, 10, 10);
  });

  // Artwork Title
  const cleanTitle = (metadata.title || fileName.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ')).trim();
  const displayTitle = cleanTitle.length > 34 ? cleanTitle.substring(0, 31) + '...' : cleanTitle;
  ctx.fillStyle = '#141413';
  ctx.font = 'bold 22px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(displayTitle.toUpperCase(), 300, 285);

  // Dimensions & File Size
  const sizeMb = (fileSizeBytes / (1024 * 1024)).toFixed(2);
  const dimText = metadata.boundingBox
    ? `${metadata.boundingBox.width} × ${metadata.boundingBox.height} pt · ${sizeMb} MB`
    : `Scalable PostScript Vector · ${sizeMb} MB`;
  ctx.fillStyle = '#57534e';
  ctx.font = '600 14px monospace';
  ctx.fillText(dimText, 300, 318);

  // Color palette swatches if available
  const swatches = metadata.colorPalette && metadata.colorPalette.length > 0
    ? metadata.colorPalette
    : ['#141413', '#d97706', '#059669', '#2563eb', '#7c3aed'];
  const startX = 300 - ((swatches.length * 28) / 2);
  swatches.forEach((hex, idx) => {
    ctx.fillStyle = hex;
    ctx.beginPath();
    ctx.arc(startX + idx * 28 + 14, 362, 10, 0, Math.PI * 2);
    ctx.fill();
  });

  return canvas.toDataURL('image/jpeg', 0.9);
}

function cleanPsString(str: string): string {
  return str
    .replace(/^[\(\s]+|[\)\s]+$/g, '')
    .replace(/\\(\d{3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)))
    .replace(/\\([()\\])/g, '$1')
    .trim();
}

function decodeXmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .trim();
}
