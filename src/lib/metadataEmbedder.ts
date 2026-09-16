import piexif from 'piexifjs';

export async function embedJpegMetadata(file: File, title: string, keywords: string[]): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jpegDataDataURL = e.target?.result as string;
        
        const zeroth: Record<string, any> = {};
        
        zeroth[piexif.ImageIFD.ImageDescription] = title;
        zeroth[piexif.ImageIFD.XPKeywords] = encodeUTF16(keywords.join(';'));
        zeroth[piexif.ImageIFD.XPTitle] = encodeUTF16(title);

        const exifObj = { "0th": zeroth };
        const exifBytes = piexif.dump(exifObj);
        const newJpegDataURL = piexif.insert(exifBytes, jpegDataDataURL);
        
        const blob = dataURLtoBlob(newJpegDataURL);
        resolve(blob);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (error) => reject(error);
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
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}
