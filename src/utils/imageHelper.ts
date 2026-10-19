/**
 * Helper to compress and convert user selected photos (from phone camera/gallery)
 * into lightweight Base64 data URLs suitable for localStorage persistence.
 */
export async function compressImageFile(file: File, maxWidth = 700, maxHeight = 700, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('অনুগ্রহ করে একটি ছবি ফাইল নির্বাচন করুন।'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('ছবি পড়তে সমস্যা হয়েছে।'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('ছবি লোড করা যায়নি।'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio preserved dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('ক্যানভাস তৈরি করা যায়নি।'));
          return;
        }

        // Draw image smoothly
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to compressed jpeg data url
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}
