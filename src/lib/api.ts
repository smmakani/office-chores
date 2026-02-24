// Empty string in dev → Vite proxy forwards /api/* to localhost:3001
// Set VITE_API_URL=https://your-app.onrender.com on Netlify for production
export const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? '';
