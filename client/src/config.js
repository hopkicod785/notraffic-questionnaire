// In production, API is served from the same origin
export const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:3001');

