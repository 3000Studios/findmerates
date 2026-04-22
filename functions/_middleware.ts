export const onRequest: PagesFunction = async ({ request, next }) => {
  const url = new URL(request.url);

  if (url.pathname === "/ads.txt") {
    const adsTxtContent =
      "google.com, pub-5800977493749262, DIRECT, f08c47fec0942fa0";

    return new Response(adsTxtContent, {
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "public, max-age=3600",
      },
    });
  }

  return next();
};

