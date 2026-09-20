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
        zeroth[piexif.ImageIFD.Software] = "StockMeta Pro AI";
        zeroth[piexif.ImageIFD.XPKeywords] = encodeUTF16(safeKeywords.join('; '));
        zeroth[piexif.ImageIFD.XPTitle] = encodeUTF16(safeTitle);
        zeroth[piexif.ImageIFD.XPComment] = encodeUTF16(safeTitle);
        zeroth[piexif.ImageIFD.XPSubject] = encodeUTF16(safeKeywords.slice(0, 5).join(', '));

        const exifObj = { "0th": zeroth };
        const exifBytes = piexif.dump(exifObj);

        let cleanJpeg = jpegDataDataURL;
        try {
          cleanJpeg = piexif.remove(jpegDataDataURL);
        } catch (_) {}

        const newJpegDataURL = piexif.insert(exifBytes, cleanJpeg);
        
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
        zeroth[piexif.ImageIFD.Software] = "StockMeta Pro AI";
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
   <photoshop:Source>StockMeta Pro AI</photoshop:Source>
   <xmp:CreatorTool>StockMeta Pro Suite</xmp:CreatorTool>
  </rdf:Description>
 </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>`;
}

