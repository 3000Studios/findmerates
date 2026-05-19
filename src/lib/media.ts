export type MediaItem = {
  id: string;
  kind: "image" | "video";
  url: string;
  thumb: string;
  width: number;
  height: number;
  alt: string;
  credit: {
    name: string;
    profileUrl: string;
    sourceUrl: string;
    sourceName: "Pexels" | "Unsplash";
  };
};

const PEXELS_KEY = (import.meta as any).env?.VITE_PEXELS_API_KEY as string | undefined;
const UNSPLASH_KEY = (import.meta as any).env?.VITE_UNSPLASH_ACCESS_KEY as string | undefined;

// Session cache keyed by source+query+perPage so repeated component mounts don't refetch.
const cache = new Map<string, MediaItem[]>();

function cacheKey(source: string, query: string, perPage: number) {
  return `${source}:${query.toLowerCase()}:${perPage}`;
}

async function safeFetchJson(url: string, init?: RequestInit): Promise<any | null> {
  try {
    const res = await fetch(url, init);
    if (!res.ok) {
      console.warn(`[media] ${url} -> ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.warn(`[media] fetch failed for ${url}`, err);
    return null;
  }
}

export async function searchPexelsPhotos(query: string, perPage = 8): Promise<MediaItem[]> {
  if (!PEXELS_KEY) return [];
  const key = cacheKey("pexels-photo", query, perPage);
  if (cache.has(key)) return cache.get(key)!;
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`;
  const data = await safeFetchJson(url, { headers: { Authorization: PEXELS_KEY } });
  if (!data?.photos) return [];
  const items: MediaItem[] = data.photos.map((p: any) => ({
    id: `pexels-photo-${p.id}`,
    kind: "image" as const,
    url: p.src?.large2x || p.src?.large || p.src?.original,
    thumb: p.src?.medium || p.src?.small,
    width: p.width,
    height: p.height,
    alt: p.alt || query,
    credit: {
      name: p.photographer || "Pexels contributor",
      profileUrl: p.photographer_url || "https://www.pexels.com",
      sourceUrl: p.url || "https://www.pexels.com",
      sourceName: "Pexels",
    },
  }));
  cache.set(key, items);
  return items;
}

export async function searchPexelsVideos(query: string, perPage = 4): Promise<MediaItem[]> {
  if (!PEXELS_KEY) return [];
  const key = cacheKey("pexels-video", query, perPage);
  if (cache.has(key)) return cache.get(key)!;
  const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`;
  const data = await safeFetchJson(url, { headers: { Authorization: PEXELS_KEY } });
  if (!data?.videos) return [];
  const items: MediaItem[] = data.videos
    .map((v: any) => {
      const files = (v.video_files || []) as any[];
      // Prefer mp4 HD around 1080p-1440p for hero use; fall back to highest available.
      const sorted = files
        .filter((f) => f.file_type === "video/mp4" && f.link)
        .sort((a, b) => (b.height || 0) - (a.height || 0));
      const preferred =
        sorted.find((f) => (f.height || 0) <= 1440 && (f.height || 0) >= 720) || sorted[0];
      if (!preferred) return null;
      const pic = (v.video_pictures || [])[0]?.picture || v.image;
      return {
        id: `pexels-video-${v.id}`,
        kind: "video" as const,
        url: preferred.link,
        thumb: pic || v.image,
        width: v.width || preferred.width || 1920,
        height: v.height || preferred.height || 1080,
        alt: query,
        credit: {
          name: v.user?.name || "Pexels contributor",
          profileUrl: v.user?.url || "https://www.pexels.com",
          sourceUrl: v.url || "https://www.pexels.com",
          sourceName: "Pexels" as const,
        },
      } as MediaItem;
    })
    .filter(Boolean) as MediaItem[];
  cache.set(key, items);
  return items;
}

export async function searchUnsplashPhotos(query: string, perPage = 8): Promise<MediaItem[]> {
  if (!UNSPLASH_KEY) return [];
  const key = cacheKey("unsplash-photo", query, perPage);
  if (cache.has(key)) return cache.get(key)!;
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape&content_filter=high`;
  const data = await safeFetchJson(url, {
    headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` },
  });
  if (!data?.results) return [];
  const items: MediaItem[] = data.results.map((p: any) => ({
    id: `unsplash-photo-${p.id}`,
    kind: "image" as const,
    url: p.urls?.regular || p.urls?.full,
    thumb: p.urls?.small || p.urls?.thumb,
    width: p.width,
    height: p.height,
    alt: p.alt_description || p.description || query,
    credit: {
      name: p.user?.name || "Unsplash contributor",
      profileUrl: p.user?.links?.html
        ? `${p.user.links.html}?utm_source=findmerates&utm_medium=referral`
        : "https://unsplash.com",
      sourceUrl: p.links?.html
        ? `${p.links.html}?utm_source=findmerates&utm_medium=referral`
        : "https://unsplash.com",
      sourceName: "Unsplash",
    },
  }));
  cache.set(key, items);
  return items;
}

export async function searchMixedMedia(query: string, perPage = 10): Promise<MediaItem[]> {
  const half = Math.max(2, Math.ceil(perPage / 2));
  const [pex, uns] = await Promise.all([
    searchPexelsPhotos(query, half),
    searchUnsplashPhotos(query, half),
  ]);
  const merged: MediaItem[] = [];
  const max = Math.max(pex.length, uns.length);
  for (let i = 0; i < max; i++) {
    if (pex[i]) merged.push(pex[i]);
    if (uns[i]) merged.push(uns[i]);
  }
  return merged.slice(0, perPage);
}
