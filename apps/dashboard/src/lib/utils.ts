const DEFAULT_PORT = 3001 as const;

export const getBaseUrl = () => {
  if (process.env.VITE_DASHBOARD_URL) {
    return process.env.VITE_DASHBOARD_URL;
  }
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return `http://localhost:${process.env.PORT ?? DEFAULT_PORT}`;
};
