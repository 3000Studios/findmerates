import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const allowedEnv = {
    VITE_ADSENSE_CLIENT_ID: env.VITE_ADSENSE_CLIENT_ID || '',
    VITE_API_BASE_URL: env.VITE_API_BASE_URL || '',
    VITE_ENABLE_ADS: env.VITE_ENABLE_ADS || 'TRUE',
    GEMINI_API_KEY: env.GEMINI_API_KEY || '',
  };

  const defineEnv = Object.entries(allowedEnv).reduce<Record<string, string>>((acc, [key, value]) => {
    acc[`process.env.${key}`] = JSON.stringify(value);
    acc[`import.meta.env.${key}`] = JSON.stringify(value);
    return acc;
  }, {});

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    define: {
      ...defineEnv,
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
