import Parser from 'rss-parser';
import { GoogleGenAI, Type } from "@google/genai";
import { db } from '../lib/firebase';
import { collection, addDoc, query, where, getDocs, updateDoc, doc, orderBy, limit, serverTimestamp, Timestamp } from 'firebase/firestore';
import { Story } from '../types';

const parser = new Parser({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/rss+xml, application/xml, text/xml, */*'
  }
});
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const RSS_FEEDS = [
  'https://www.federalreserve.gov/feeds/press_all.xml',
  'https://www.bls.gov/feed/home.rss',
  'https://finance.yahoo.com/news/rssindex'
];

export async function fetchLatestNews() {
  try {
    const feedResults = await Promise.allSettled(RSS_FEEDS.map(url => parser.parseURL(url)));
    
    const allItems = feedResults
      .filter((result): result is PromiseFulfilledResult<Parser.Output<any>> => result.status === 'fulfilled')
      .flatMap(result => result.value.items)
      .sort((a, b) => {
        return new Date(b.pubDate || 0).getTime() - new Date(a.pubDate || 0).getTime();
      });

    if (allItems.length === 0) {
      console.warn('No items found in any RSS feeds');
      return null;
    }

    return allItems[0]; // Return the most recent item
  } catch (error) {
    console.error('Error fetching RSS feeds:', error);
    return null;
  }
}

export async function generateStoryFromNews(newsItem: any) {
  if (!newsItem) return null;

  const prompt = `
    You are a world-class financial journalist and SEO expert for FindMeRates.com.
    Based on the following news snippet, write a comprehensive, original, and SEO-optimized article (1000-1500 words).
    
    News Title: ${newsItem.title}
    News Content: ${newsItem.contentSnippet || newsItem.content}
    Source: ${newsItem.link}

    Requirements:
    1. Title: Create a catchy, SEO-optimized title.
    2. Excerpt: A 2-3 sentence summary for meta descriptions.
    3. Content: A deep-dive article with multiple sections (H2, H3), bullet points, and expert analysis.
    4. Category: Assign one of [Mortgage, Loans, Insurance, Credit, Savings, Trends].
    5. SEO Keywords: Include keywords like "best rates", "interest rates today", "loan rates", "mortgage rates".
    6. Internal Linking: Mention other financial topics naturally.
    7. Finance Joke: Include a light, safe finance-related joke at the end of the article.
    8. Tone: Professional, authoritative, yet accessible.

    Output format: JSON with fields [title, excerpt, content, category, joke].
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            excerpt: { type: Type.STRING },
            content: { type: Type.STRING },
            category: { type: Type.STRING },
            joke: { type: Type.STRING }
          },
          required: ["title", "excerpt", "content", "category", "joke"]
        }
      }
    });

    const data = JSON.parse(response.text);
    return data;
  } catch (error) {
    console.error('Error generating story with Gemini:', error);
    return null;
  }
}

export async function getPexelsVideo(query: string) {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    console.warn('PEXELS_API_KEY not found, falling back to placeholder');
    return 'https://storage.googleapis.com/aistudio-build-assets/findmerates_hero_bg.mp4';
  }

  try {
    const response = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=1`, {
      headers: {
        Authorization: apiKey
      }
    });
    const data = await response.json();
    if (data.videos && data.videos.length > 0) {
      // Return the highest quality mp4 link
      const videoFiles = data.videos[0].video_files;
      const bestFile = videoFiles.find((f: any) => f.quality === 'hd') || videoFiles[0];
      return bestFile.link;
    }
  } catch (error) {
    console.error('Error fetching Pexels video:', error);
  }
  return 'https://storage.googleapis.com/aistudio-build-assets/findmerates_hero_bg.mp4';
}

export async function rotateHeroStory() {
  const latestNews = await fetchLatestNews();
  if (!latestNews) return;

  const storyData = await generateStoryFromNews(latestNews);
  if (!storyData) return;

  // Search for relevant financial stock footage
  const videoUrl = await getPexelsVideo(storyData.category + ' finance business');

  // 1. Find current hero and demote it
  const heroQuery = query(collection(db, 'stories'), where('isTopStory', '==', true));
  const heroSnap = await getDocs(heroQuery);
  
  for (const docSnap of heroSnap.docs) {
    await updateDoc(doc(db, 'stories', docSnap.id), {
      isTopStory: false
    });
  }

  // 2. Create new hero story
  const slug = storyData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  
  const newStory = {
    title: storyData.title,
    slug: slug,
    excerpt: storyData.excerpt,
    content: storyData.content + `\n\n---\n\n**Just for laughs:** ${storyData.joke}`,
    category: storyData.category,
    publishedAt: Timestamp.now(),
    isTopStory: true,
    author: 'FindMeRates AI Editorial',
    heroVideoUrl: videoUrl,
    imageUrl: `https://picsum.photos/seed/${slug}/1200/600`
  };

  await addDoc(collection(db, 'stories'), newStory);
  console.log('Rotated hero story successfully:', newStory.title);
}
