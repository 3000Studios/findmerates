import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const allowedEnv = {
    VITE_ADSENSE_CLIENT_ID: env.VITE_ADSENSE_CLIENT_ID || '',
    VITE_API_BASE_URL: env.VITE_API_BASE_URL || '',
    VITE_ENABLE_ADS: env.VITE_ENABLE_ADS || 'true',
    VITE_STRIPE_BASIC_LINK: env.VITE_STRIPE_BASIC_LINK || '',
    VITE_STRIPE_PAYMENT_LINK: env.VITE_STRIPE_PAYMENT_LINK || '',
    VITE_STRIPE_6MONTH_LINK: env.VITE_STRIPE_6MONTH_LINK || '',
    VITE_PAYPAL_PAYMENT_LINK: env.VITE_PAYPAL_PAYMENT_LINK || '',
    VITE_PAYPAL_6MONTH_LINK: env.VITE_PAYPAL_6MONTH_LINK || '',
    GEMINI_API_KEY: env.GEMINI_API_KEY || '',
    VITE_GEMINI_API_KEY: env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY || '',
    VITE_GEMINI_MODEL: env.VITE_GEMINI_MODEL || 'gemini-2.0-flash',
    PEXELS_API_KEY: env.PEXELS_API_KEY || '',
    VITE_PEXELS_API_KEY: env.VITE_PEXELS_API_KEY || env.PEXELS_API_KEY || '',
    VITE_UNSPLASH_ACCESS_KEY: env.VITE_UNSPLASH_ACCESS_KEY || env.UNSPLASH_ACCESS_KEY || '',
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
    build: {
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
              return 'vendor-react';
            }
            if (id.includes('node_modules/firebase')) {
              return 'vendor-firebase';
            }
            if (id.includes('node_modules/motion') || id.includes('node_modules/framer-motion')) {
              return 'vendor-motion';
            }
            if (id.includes('node_modules/recharts') || id.includes('node_modules/d3')) {
              return 'vendor-charts';
            }
            if (id.includes('node_modules/@google/genai')) {
              return 'vendor-ai';
            }
            if (id.includes('node_modules/lucide-react')) {
              return 'vendor-ui';
            }
          },
        },
      },
    },
  };
});
