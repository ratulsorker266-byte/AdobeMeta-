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

  const encoder = new TextEncoder();
  const updatedPsBytes = encoder.encode(updatedPsText);

  if (isDosBinaryEps) {
    // If it was DOS binary EPS, rebuild DOS header with new PS length
    const view = new DataView(arrayBuffer);
    const wmfStart = view.getUint32(20, true);
    const wmfLength = view.getUint32(24, true);
    const tiffStart = view.getUint32(12, true);
    const tiffLength = view.getUint32(16, true);

    const newHeader = new Uint8Array(30);
    newHeader.set(uint8.subarray(0, 30));
    const newView = new DataView(newHeader.buffer);

    const newPsLength = updatedPsBytes.length;
    newView.setUint32(8, newPsLength, true); // update PS byte count

    // If TIFF preview existed after PS, shift its offset
    if (tiffLength > 0 && tiffStart >= psStart + psLength) {
      const newTiffStart = psStart + newPsLength;
      newView.setUint32(12, newTiffStart, true);
    }
    if (wmfLength > 0 && wmfStart >= psStart + psLength) {
      const newWmfStart = psStart + newPsLength;
      newView.setUint32(20, newWmfStart, true);
    }

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


