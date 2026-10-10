import piexif from 'piexifjs';

export async function embedJpegMetadata(file: File, title: string, keywords: string[]): Promise<Blob> {
  // If file is not a JPEG, convert or return as-is safely
  const isJpeg = file.type === 'image/jpeg' || file.type === 'image/jpg' || /\.jpe?g$/i.test(file.name);
  
  if (!isJpeg) {
    // Attempt conversion via canvas to JPEG for metadata embedding
    try {
      return await convertToJpegAndEmbed(file, title, keywords);
    } catch {
      // Fallback: return original file as blob
      return file;
    }
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jpegDataDataURL = e.target?.result as string;
        if (!jpegDataDataURL || !jpegDataDataURL.startsWith('data:image/jpeg')) {
          return resolve(file);
        }
        
        const safeTitle = (title || '').trim();
        const safeKeywords = Array.isArray(keywords) ? keywords.filter(Boolean) : [];
        
        const zeroth: Record<string, any> = {};
        
        zeroth[piexif.ImageIFD.ImageDescription] = safeTitle;
        zeroth[piexif.ImageIFD.Software] = "AdobeMeta Pro AI";
        zeroth[piexif.ImageIFD.XPKeywords] = encodeUTF16(safeKeywords.join('; '));
        zeroth[piexif.ImageIFD.XPTitle] = encodeUTF16(safeTitle);
        zeroth[piexif.ImageIFD.XPComment] = encodeUTF16(safeTitle);
        zeroth[piexif.ImageIFD.XPSubject] = encodeUTF16(safeKeywords.slice(0, 5).join(', '));

        const exifObj = { "0th": zeroth };
        const exifBytes = piexif.dump(exifObj);

        let newJpegDataURL = jpegDataDataURL;
        try {
          let cleanJpeg = jpegDataDataURL;
          try {
            cleanJpeg = piexif.remove(jpegDataDataURL);
          } catch (_) {}
          newJpegDataURL = piexif.insert(exifBytes, cleanJpeg);
        } catch (insertErr) {
          console.warn('piexif insert error, falling back to original image bytes:', insertErr);
          newJpegDataURL = jpegDataDataURL;
        }
        
        const blob = dataURLtoBlob(newJpegDataURL);
        resolve(blob);
      } catch (err) {
        console.warn('Metadata embed warning, falling back to original file:', err);
        resolve(file);
      }
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

async function convertToJpegAndEmbed(file: File, title: string, keywords: string[]): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(file);
        
        // Fill white background for transparent PNGs
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        const jpegDataURL = canvas.toDataURL('image/jpeg', 0.95);
        const safeTitle = (title || '').trim();
        const safeKeywords = Array.isArray(keywords) ? keywords.filter(Boolean) : [];
        
        const zeroth: Record<string, any> = {};
        zeroth[piexif.ImageIFD.ImageDescription] = safeTitle;
        zeroth[piexif.ImageIFD.Software] = "AdobeMeta Pro AI";
        zeroth[piexif.ImageIFD.XPKeywords] = encodeUTF16(safeKeywords.join('; '));
        zeroth[piexif.ImageIFD.XPTitle] = encodeUTF16(safeTitle);
        zeroth[piexif.ImageIFD.XPComment] = encodeUTF16(safeTitle);
        zeroth[piexif.ImageIFD.XPSubject] = encodeUTF16(safeKeywords.slice(0, 5).join(', '));
        
        const exifObj = { "0th": zeroth };
        const exifBytes = piexif.dump(exifObj);
        const newJpegDataURL = piexif.insert(exifBytes, jpegDataURL);
        resolve(dataURLtoBlob(newJpegDataURL));
      } catch (err) {
        console.warn('Canvas conversion metadata embed error:', err);
        resolve(file);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };
    img.src = url;
  });
}

function decodeUTF16(bytes: number[]): string {
  if (!Array.isArray(bytes) || bytes.length === 0) return '';
  let out = '';
  for (let i = 0; i < bytes.length - 1; i += 2) {
    const code = (bytes[i] & 0xff) | ((bytes[i + 1] & 0xff) << 8);
    if (code === 0) break;
    out += String.fromCharCode(code);
  }
  return out.trim();
}

/**
 * Reads existing EXIF / Windows XP / XMP metadata embedded inside a JPEG image
 * so contributors uploading pre-tagged or partially-tagged photos don't lose existing tags.
 */
export async function readEmbeddedJpegMetadata(
  file: File
): Promise<{ title?: string; keywords?: string[]; description?: string } | null> {
  const isJpeg =
    file.type === 'image/jpeg' || file.type === 'image/jpg' || /\.jpe?g$/i.test(file.name);
  if (!isJpeg) return null;

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const dataUrl = e.target?.result as string;
        if (!dataUrl || !dataUrl.startsWith('data:image/jpeg')) {
          return resolve(null);
        }

        let extractedTitle = '';
        let extractedDesc = '';
        let extractedKeywords: string[] = [];

        try {
          const exifObj = piexif.load(dataUrl);
          const zeroth = exifObj?.['0th'] || {};

          if (zeroth[piexif.ImageIFD.XPTitle]) {
            extractedTitle = decodeUTF16(zeroth[piexif.ImageIFD.XPTitle]);
          }
          if (zeroth[piexif.ImageIFD.ImageDescription] && typeof zeroth[piexif.ImageIFD.ImageDescription] === 'string') {
            const desc = zeroth[piexif.ImageIFD.ImageDescription].trim();
            if (!extractedTitle) extractedTitle = desc;
            extractedDesc = desc;
          }
          if (zeroth[piexif.ImageIFD.XPKeywords]) {
            const kwStr = decodeUTF16(zeroth[piexif.ImageIFD.XPKeywords]);
            if (kwStr) {
              extractedKeywords = kwStr
                .split(/[;,]+/)
                .map((k) => k.trim())
                .filter((k) => k.length >= 2);
            }
          }
        } catch (_) {}

        // Also scan raw binary head (first 128KB) for embedded Adobe XMP <dc:title> and <dc:subject>
        try {
          const b64 = dataUrl.split(',')[1] || '';
          const headChunk = atob(b64.slice(0, 160000));
          if (!extractedTitle) {
            const titleMatch = headChunk.match(/<dc:title>[\s\S]*?<rdf:li[^>]*>([\s\S]*?)<\/rdf:li>[\s\S]*?<\/dc:title>/i);
            if (titleMatch?.[1]) {
              extractedTitle = titleMatch[1].replace(/&amp;/g, '&').replace(/&quot;/g, '"').trim();
            }
          }
          if (extractedKeywords.length === 0) {
            const subjectMatch = headChunk.match(/<dc:subject>[\s\S]*?<rdf:Bag>([\s\S]*?)<\/rdf:Bag>[\s\S]*?<\/dc:subject>/i);
            if (subjectMatch?.[1]) {
              const liMatches = [...subjectMatch[1].matchAll(/<rdf:li[^>]*>([\s\S]*?)<\/rdf:li>/gi)];
              extractedKeywords = liMatches
                .map((m) => m[1].replace(/&amp;/g, '&').trim())
                .filter((k) => k.length >= 2);
            }
          }
        } catch (_) {}

        if (extractedTitle || extractedKeywords.length > 0) {
          return resolve({
            title: extractedTitle || undefined,
            description: extractedDesc || extractedTitle || undefined,
            keywords: extractedKeywords.length > 0 ? extractedKeywords : undefined,
          });
        }
        resolve(null);
      } catch {
        resolve(null);
      }
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

function encodeUTF16(str: string): number[] {
  const bytes: number[] = [];
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    bytes.push(code & 0xff, (code >> 8) & 0xff);
  }
  bytes.push(0, 0);
  return bytes;
}

function dataURLtoBlob(dataurl: string): Blob {
  const arr = dataurl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * Generates an industry-standard Adobe XMP Sidecar XML file
 * Fully compatible with Adobe Photoshop, Lightroom, Illustrator, and Adobe Bridge.
 */
export function generateXmpSidecarXml(title: string, keywords: string[], description?: string): string {
  const escapeXml = (unsafe: string) => {
    return (unsafe || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  const safeTitle = escapeXml(title.trim());
  const safeDesc = escapeXml((description || title).trim());
  const keywordTags = (keywords || [])
    .filter(Boolean)
    .map(k => `        <rdf:li>${escapeXml(k.trim())}</rdf:li>`)
    .join('\n');

  return `<?xpacket begin="﻿" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Adobe XMP Core 5.6-c140 79.160451, 2017/05/06-01:08:21">
 <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <rdf:Description rdf:about=""
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:photoshop="http://ns.adobe.com/photoshop/1.0/"
    xmlns:xmp="http://ns.adobe.com/xap/1.0/"
    xmlns:Iptc4xmpCore="http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/">
   <dc:title>
    <rdf:Alt>
     <rdf:li xml:lang="x-default">${safeTitle}</rdf:li>
    </rdf:Alt>
   </dc:title>
   <dc:description>
    <rdf:Alt>
     <rdf:li xml:lang="x-default">${safeDesc}</rdf:li>
    </rdf:Alt>
   </dc:description>
   <dc:subject>
    <rdf:Bag>
${keywordTags}
    </rdf:Bag>
   </dc:subject>
   <photoshop:Headline>${safeTitle}</photoshop:Headline>
   <photoshop:Credit>Stock Contributor</photoshop:Credit>
   <photoshop:Source>AdobeMeta Pro AI</photoshop:Source>
   <xmp:CreatorTool>AdobeMeta Pro Suite</xmp:CreatorTool>
  </rdf:Description>
 </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>`;
}

/**
 * Writes internal PostScript DSC comments and embeds an Adobe XMP packet into an EPS file.
 * Microstock platforms (Adobe Stock, Shutterstock, Freepik, iStock/Getty) parse %%Title, %%Keywords,
 * and the embedded %begin_xmp_code ... %end_xmp_code block directly inside the EPS vector.
 */
export async function embedMetadataIntoEps(
  file: File,
  title: string,
  keywords: string[],
  description?: string
): Promise<Blob> {
  const safeTitle = (title || '').replace(/[\r\n]/g, ' ').trim();
  const safeDesc = (description || title || '').replace(/[\r\n]/g, ' ').trim();
  const safeKeywords = (keywords || []).map(k => k.replace(/[\r\n,]/g, '').trim()).filter(Boolean);

  const arrayBuffer = await file.arrayBuffer();
  const uint8 = new Uint8Array(arrayBuffer);

  // Check if EPS has a binary 30-byte DOS EPS header (0xC5D0D3C6)
  const isDosBinaryEps =
    uint8.length > 30 &&
    uint8[0] === 0xc5 &&
    uint8[1] === 0xd0 &&
    uint8[2] === 0xd3 &&
    uint8[3] === 0xc6;

  let psStart = 0;
  let psLength = uint8.length;

  if (isDosBinaryEps) {
    // Little-endian offset to PostScript section
    const view = new DataView(arrayBuffer);
    psStart = view.getUint32(4, true);
    psLength = view.getUint32(8, true);
  }

  // Decode the PostScript portion to text
  const decoder = new TextDecoder('latin1');
  const psText = decoder.decode(uint8.subarray(psStart, psStart + psLength));

  // Generate valid XMP block
  const xmpXml = generateXmpSidecarXml(safeTitle, safeKeywords, safeDesc);

  // Create standard PostScript DSC metadata headers
  const dscTitle = `%%Title: ${safeTitle}`;
  const dscKeywords = `%%Keywords: ${safeKeywords.join(', ')}`;
  const dscSubject = `%%Subject: ${safeDesc}`;
  const dscNotice = `%%Notice: Metadata injected by AdobeMeta Pro AI`;

  // Create standard embedded XMP packet for PostScript
  const embeddedXmpBlock = `\n%begin_xmp_code\n${xmpXml}\n%end_xmp_code\n`;

  let updatedPsText = psText;

  // 1. Update or inject %%Title:
  if (/%%Title:[^\r\n]*/i.test(updatedPsText)) {
    updatedPsText = updatedPsText.replace(/%%Title:[^\r\n]*/i, dscTitle);
  } else if (/^%![^\r\n]*/m.test(updatedPsText)) {
    updatedPsText = updatedPsText.replace(/^%![^\r\n]*/m, (match) => `${match}\n${dscTitle}`);
  } else {
    updatedPsText = `${dscTitle}\n${updatedPsText}`;
  }

  // 2. Update or inject %%Keywords:
  if (/%%Keywords:[^\r\n]*/i.test(updatedPsText)) {
    updatedPsText = updatedPsText.replace(/%%Keywords:[^\r\n]*/i, dscKeywords);
  } else {
    updatedPsText = updatedPsText.replace(
      new RegExp(dscTitle.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i'),
      (match) => `${match}\n${dscKeywords}\n${dscSubject}\n${dscNotice}`
    );
  }

  // 3. Remove existing embedded XMP if present
  updatedPsText = updatedPsText.replace(/%begin_xmp_code[\s\S]*?%end_xmp_code/gi, '');

  // 4. Inject fresh XMP right after %%EndComments if present, or before EOF
  if (/%%EndComments/i.test(updatedPsText)) {
    updatedPsText = updatedPsText.replace(/%%EndComments/i, `%%EndComments${embeddedXmpBlock}`);
  } else {
    updatedPsText = `${embeddedXmpBlock}\n${updatedPsText}`;
  }

  const updatedPsBytes = new Uint8Array(updatedPsText.length);
  for (let i = 0; i < updatedPsText.length; i++) {
    updatedPsBytes[i] = updatedPsText.charCodeAt(i) & 0xff;
  }

  if (isDosBinaryEps) {
    // Standard DOS EPS 30-byte header specification:
    // Bytes 4..7: PostScript start offset (uint32 LE)
    // Bytes 8..11: PostScript byte length (uint32 LE)
    // Bytes 12..15: Metafile (WMF) start offset (uint32 LE)
    // Bytes 16..19: Metafile (WMF) byte length (uint32 LE)
    // Bytes 20..23: TIFF start offset (uint32 LE)
    // Bytes 24..27: TIFF byte length (uint32 LE)
    const view = new DataView(arrayBuffer);
    const wmfStart = view.getUint32(12, true);
    const wmfLength = view.getUint32(16, true);
    const tiffStart = view.getUint32(20, true);
    const tiffLength = view.getUint32(24, true);

    const newHeader = new Uint8Array(30);
    newHeader.set(uint8.subarray(0, 30));
    const newView = new DataView(newHeader.buffer);

    const newPsLength = updatedPsBytes.length;
    const delta = newPsLength - psLength;
    newView.setUint32(8, newPsLength, true); // update PS byte count

    // Shift WMF or TIFF offsets if they appear after the PostScript section
    if (wmfLength > 0 && wmfStart >= psStart + psLength) {
      newView.setUint32(12, wmfStart + delta, true);
    }
    if (tiffLength > 0 && tiffStart >= psStart + psLength) {
      newView.setUint32(20, tiffStart + delta, true);
    }
    newView.setUint16(28, 0xffff, true); // ignore checksum per DOS EPS spec

    const prePs = uint8.subarray(0, psStart);
    const postPs = uint8.subarray(psStart + psLength);

    const merged = new Uint8Array(prePs.length + updatedPsBytes.length + postPs.length);
    merged.set(prePs, 0);
    merged.set(newHeader, 0);
    merged.set(updatedPsBytes, psStart);
    merged.set(postPs, psStart + updatedPsBytes.length);

    return new Blob([merged], { type: 'application/postscript' });
  }

  return new Blob([updatedPsBytes], { type: 'application/postscript' });
}


