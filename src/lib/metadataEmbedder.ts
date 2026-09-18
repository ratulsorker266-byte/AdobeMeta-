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
        zeroth[piexif.ImageIFD.XPKeywords] = encodeUTF16(safeKeywords.join('; '));
        zeroth[piexif.ImageIFD.XPTitle] = encodeUTF16(safeTitle);

        const exifObj = { "0th": zeroth };
        const exifBytes = piexif.dump(exifObj);
        const newJpegDataURL = piexif.insert(exifBytes, jpegDataDataURL);
        
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
        zeroth[piexif.ImageIFD.XPKeywords] = encodeUTF16(safeKeywords.join('; '));
        zeroth[piexif.ImageIFD.XPTitle] = encodeUTF16(safeTitle);
        
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
