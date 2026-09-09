// Automatically bundle all images in assets/images directory via Vite
const localImageModules = import.meta.glob('../assets/images/*', {
  eager: true,
  import: 'default',
});

// Map of filename (e.g. 'image3.jpg', 'resguad1.jpg', 'comm1.jpg') -> bundled asset URL
const filenameMap = {};
for (const [path, mod] of Object.entries(localImageModules)) {
  const filename = path.split('/').pop().toLowerCase();
  filenameMap[filename] = mod;
}

/**
 * Resolves an image path from database or local assets to a working browser URL.
 * Handles:
 * 1. Bundled asset paths like "../assets/images/image3.jpg" or local file names like "comm1.jpg"
 * 2. Uploaded relative paths like "/uploads/custom.jpg" (falls back to backend URL)
 * 3. Full external URLs like "https://..."
 */
export const resolveImageUrl = (src, fallback = '') => {
  if (!src) return fallback;

  // Already a full external URL or data URI
  if (typeof src === 'string' && (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:'))) {
    return src;
  }

  if (typeof src === 'string') {
    // Extract base filename (e.g. "image3.jpg" from "../assets/images/image3.jpg" or "/uploads/resguad1.jpg")
    const filename = src.split('/').pop().split('?')[0].toLowerCase();
    if (filenameMap[filename]) {
      return filenameMap[filename];
    }

    // If it's an uploaded file from backend
    if (src.startsWith('/uploads/')) {
      const backendBase = import.meta.env.VITE_API_URL
        ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '')
        : 'https://api.primeinfrastudio.com';
      return `${backendBase}${src}`;
    }
  }

  return src || fallback;
};

export default resolveImageUrl;
