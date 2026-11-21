import { GoogleGenAI, Type } from '@google/genai';
import { Story, RateResult, RateCategory } from '../types';
import { getLiveRates } from './liveRates';
import weeklyBriefsJson from '../data/weeklyBriefs.json';

// Static weekly briefs: real, dated, data-grounded articles written from
// verbatim FRED observations (see src/data/weeklyBriefs.json + the
// auto-blog generator in the empire-sweep W7 lane). These ALWAYS lead the
// feed, ahead of any Gemini-generated story, and they replace the generic
// fallback blurbs whenever at least one brief exists — generic
// AI-synthesized finance blurbs with no data are an E-E-A-T liability
// (profit audit 2026-10-29, finding H3) and must not be the face of /stories.
const STATIC_BRIEFS: Story[] = (weeklyBriefsJson as any[]).map((b) => ({
  id: b.id,
  title: b.title,
  slug: b.slug,
  excerpt: b.excerpt,
  content: b.content,
  imageUrl: `https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1000&sig=${b.id}`,
  category: b.category || 'general',
  author: b.author || 'FindMeRates Desk',
  publishedAt: b.publishedAt,
  isTopStory: !!b.isTopStory,
}));

function withStaticBriefs(stories: Story[]): Story[] {
  const seen = new Set(STATIC_BRIEFS.map((s) => s.slug));
  return [...STATIC_BRIEFS, ...stories.filter((s) => !seen.has(s.slug))];
}

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : undefined);
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.0-flash';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

function fallbackStories(category: string): Story[] {
  const items = [
    {
      title: `${category} rates stay selective as markets reset`,
      slug: `${category}-rates-selective-markets-reset`,
      excerpt: "A practical update on where the best offers are still appearing and what shoppers should watch next.",
      content: "## Rate update\n\nThe market remains selective. Compare fees, term length, and lock timing together.",
      imageSearchQuery: "finance dashboard",
      category,
      author: "FindMeRates Desk",
      isTopStory: true,
    },
    {
      title: `What rate shoppers should do this week`,
      slug: `rate-shoppers-should-do-this-week`,
      excerpt: "A short action list for borrowers and savers looking to move quickly without missing details.",
      content: "## Action list\n\nRe-run your search, compare the same term, and verify any promos in writing.",
      imageSearchQuery: "market analysis",
      category,
      author: "FindMeRates Desk",
      isTopStory: false,
    },
  ];

  return items.map((s, i) => ({
    ...s,
    id: `${category}-${i}`,
    publishedAt: new Date().toISOString(),
    imageUrl: `https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1000&sig=${i}`,
  }));
}

export async function fetchLatestFinancialNews(category: string): Promise<Story[]> {
  try {
    if (!ai) return STATIC_BRIEFS.length > 0 ? STATIC_BRIEFS : fallbackStories(category);
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: `Generate 6 unique, professional financial news stories for the category: ${category}. 
      Each story should have a title, slug, excerpt, content (markdown), and a professional image description for Pexels.
      Return the result in JSON format.`,
      config: {
        systemInstruction: "You are a senior financial journalist for FindMeRates.com. Your tone is institutional, authoritative, and precise. Rewrite current market trends as unique, high-value intelligence.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            stories: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  slug: { type: Type.STRING },
                  excerpt: { type: Type.STRING },
                  content: { type: Type.STRING },
                  imageSearchQuery: { type: Type.STRING },
                  category: { type: Type.STRING },
                  author: { type: Type.STRING },
                  isTopStory: { type: Type.BOOLEAN }
                },
                required: ["id", "title", "slug", "excerpt", "content", "imageSearchQuery", "category", "author", "isTopStory"]
              }
            }
          },
          required: ["stories"]
        }
      }
    });

    const result = JSON.parse(response.text || '{"stories": []}');
    const generated = result.stories.map((s: any) => ({
      ...s,
      publishedAt: new Date().toISOString(),
      imageUrl: `https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1000&sig=${s.id}` // Fallback image
    }));
    return withStaticBriefs(generated);
  } catch (error) {
    console.error('Error fetching financial news:', error);
    return STATIC_BRIEFS.length > 0 ? STATIC_BRIEFS : fallbackStories(category);
  }
}

export async function generateMarketRates(category: RateCategory): Promise<RateResult[]> {
  try {
    const liveRates = await getLiveRates(category);
    if (liveRates.length > 0) return liveRates;
    if (!ai) return [];
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: `Generate 5 realistic, current market rate results for ${category}. 
      Include provider name, rate (percentage), apr, term, and 3 key details.
      Return the result in JSON format.`,
      config: {
        systemInstruction: "You are a financial data analyst. Provide realistic, current market data for financial instruments.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            rates: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  provider: { type: Type.STRING },
                  rate: { type: Type.NUMBER },
                  apr: { type: Type.NUMBER },
                  term: { type: Type.STRING },
                  details: { type: Type.ARRAY, items: { type: Type.STRING } },
                  ctaUrl: { type: Type.STRING }
                },
                required: ["id", "provider", "rate", "apr", "term", "details", "ctaUrl"]
              }
            }
          },
          required: ["rates"]
        }
      }
    });

    const result = JSON.parse(response.text || '{"rates": []}');
    return result.rates.map((r: any) => ({
      ...r,
      category,
      lastUpdated: new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error generating market rates:', error);
    return [];
  }
}

export async function generateProGuide(): Promise<string> {
  try {
    if (!ai) {
      return `# Rate Finder Pro Guide\n\n## 1. Compare the full cost\nLook at rate, fees, term, and lock rules together.\n\n## 2. Match the product\nChoose the product that fits the use case, not just the headline rate.\n\n## 3. Verify the details\nConfirm assumptions in writing before you commit.`;
    }
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: `Write a comprehensive, 50-page (equivalent) financial intelligence guide titled "Rate Finder Pro Guide: Mastering Institutional Financial Optimization". 
      Include chapters on:
      1. The Mechanics of Interest Rates
      2. Institutional Negotiation Secrets
      3. Timing the Market: Predictive Indicators
      4. Hidden Fees and How to Avoid Them
      5. Advanced Portfolio Optimization
      Use professional, high-value language. Format in Markdown.`,
      config: {
        systemInstruction: "You are the Chief Investment Officer of FindMeRates.com. You are writing an exclusive guide for Pro subscribers."
      }
    });

    return response.text || "Guide content unavailable.";
  } catch (error) {
    console.error('Error generating Pro Guide:', error);
    return `# Rate Finder Pro Guide\n\n## 1. Compare the full cost\nLook at rate, fees, term, and lock rules together.\n\n## 2. Match the product\nChoose the product that fits the use case, not just the headline rate.\n\n## 3. Verify the details\nConfirm assumptions in writing before you commit.`;
  }
}
