export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      
      // Handle API routes
      if (url.pathname.startsWith('/api/')) {
        return handleApiRequest(request, env);
      }
      
      // For all other requests, serve the SPA
      const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="google-adsense-account" content="${env.VITE_ADSENSE_CLIENT_ID || ''}">
    <title>FindMeRates - Compare Mortgage Rates, CD Rates & Loan Options</title>
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${env.VITE_ADSENSE_CLIENT_ID || ''}"
     crossorigin="anonymous"></script>
    <link rel="stylesheet" href="/assets/index-CsHE5ebA.css">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/assets/index-DCAfw8_I.js"></script>
  </body>
</html>`;
      
      return new Response(indexHtml, {
        headers: {
          'Content-Type': 'text/html',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    } catch (error) {
      return new Response('Internal Server Error', { status: 500 });
    }
  },
};

async function handleApiRequest(request, env) {
  const url = new URL(request.url);
  
  if (url.pathname === '/api/health') {
    return Response.json({ status: 'ok', timestamp: new Date().toISOString() });
  }
  
  if (url.pathname === '/api/rates') {
    const { category, location } = url.searchParams;
    return Response.json({
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
  }
  
  return new Response('API endpoint not found', { status: 404 });
}
