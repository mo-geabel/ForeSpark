const rawApiUrl = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');

export const API_URL = (() => {
  if (!rawApiUrl) {
    return import.meta.env.DEV ? 'http://localhost:5000' : 'https://api.forespark.net';
  }
  // If user entered e.g. "api.forespark.net" without https://
  if (!rawApiUrl.startsWith('http://') && !rawApiUrl.startsWith('https://') && !rawApiUrl.startsWith('/')) {
    return `https://${rawApiUrl}`;
  }
  return rawApiUrl;
})();
