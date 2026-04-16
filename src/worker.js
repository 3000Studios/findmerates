export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      
      // Handle API routes
      if (url.pathname.startsWith('/api/')) {
        return handleApiRequest(request, env);
      }

      // Delegate static asset and SPA handling to Pages assets binding.
      if (env.ASSETS && typeof env.ASSETS.fetch === "function") {
        return env.ASSETS.fetch(request);
      }

      return new Response("Assets binding is not configured", { status: 500 });
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
    const category = url.searchParams.get('category');
    const location = url.searchParams.get('location');
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
