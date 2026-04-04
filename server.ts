import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Rate Data API (Mock for now, can be extended with Gemini)
  app.get('/api/rates', (req, res) => {
    const { category, location } = req.query;
    // In a real app, this would fetch from a database or external API
    // For now, returning mock data that looks production-ready
    res.json({
      category,
      location: location || 'National',
      results: [
        {
          id: '1',
          provider: 'Global Trust Bank',
          rate: 6.25,
          apr: 6.35,
          term: '30-Year Fixed',
          category: category || 'mortgage',
          lastUpdated: new Date().toISOString(),
          details: ['No application fee', 'Fast closing'],
          ctaUrl: '#',
        },
        {
          id: '2',
          provider: 'Apex Financial',
          rate: 5.99,
          apr: 6.12,
          term: '15-Year Fixed',
          category: category || 'mortgage',
          lastUpdated: new Date().toISOString(),
          details: ['Low down payment options', 'Excellent customer service'],
          ctaUrl: '#',
        }
      ]
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
