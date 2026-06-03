export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);

      if (url.pathname.startsWith('/api/')) {
        return handleApiRequest(request, env);
      }

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

  if (url.pathname === '/api/checkout-status') {
    const stripeBasicLink   = env.VITE_STRIPE_BASIC_LINK   || 'https://buy.stripe.com/fZu7sL2KxdTgbJCeMibAs0B';
    const stripeMonthlyLink = env.VITE_STRIPE_PAYMENT_LINK  || 'https://buy.stripe.com/00w3cvetfg1o00U9rYbAs0C';
    const stripeSixLink     = env.VITE_STRIPE_6MONTH_LINK   || 'https://buy.stripe.com/14AeVdacZ16u3d60VsbAs0D';
    const paypalMonthlyLink = env.VITE_PAYPAL_PAYMENT_LINK  || '';
    const paypalSixLink     = env.VITE_PAYPAL_6MONTH_LINK   || '';

    return Response.json({
      stripe: {
        basic:      { ok: Boolean(stripeBasicLink),   url: stripeBasicLink },
        monthly:    { ok: Boolean(stripeMonthlyLink), url: stripeMonthlyLink },
        six_month:  { ok: Boolean(stripeSixLink),     url: stripeSixLink },
      },
      paypal: {
        monthly:    { ok: Boolean(paypalMonthlyLink), url: paypalMonthlyLink },
        six_month:  { ok: Boolean(paypalSixLink),     url: paypalSixLink },
      },
    }, {
      headers: { 'Cache-Control': 'no-store' },
    });
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
        },
      ],
    });
  }

  return new Response('API endpoint not found', { status: 404 });
}
