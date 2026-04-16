import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { db } from "./src/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";
import { rotateHeroStory } from "./src/services/newsService";
import { getLiveRates } from "./src/services/liveRates";
import { RateCategory } from "./src/types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;
  const cronSecret = process.env.CRON_SECRET;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Rate Data API (Mock for now, can be extended with Gemini)
  app.get("/api/rates", (req, res) => {
    const { category, location } = req.query;
    const normalizedCategory = String(category || "mortgage")
      .toLowerCase()
      .replace("-", "_");
    const allowedCategories = new Set(Object.values(RateCategory));
    const resolvedCategory = (allowedCategories.has(normalizedCategory as RateCategory)
      ? normalizedCategory
      : RateCategory.MORTGAGE) as RateCategory;

    getLiveRates(resolvedCategory)
      .then((results) => {
        res.json({
          category: resolvedCategory,
          location: location || "National",
          results,
        });
      })
      .catch((error) => {
        console.error("Error fetching live rates:", error);
        res.status(500).json({ error: "Failed to fetch live rates" });
      });
  });

  // Trending Topics API
  app.get("/api/trends", (req, res) => {
    res.json([
      { id: "1", title: "Fed Rate Cuts 2026", volume: "High", trend: "up" },
      {
        id: "2",
        title: "Best CD Rates for April",
        volume: "Medium",
        trend: "stable",
      },
      {
        id: "3",
        title: "Mortgage Refinance Strategies",
        volume: "High",
        trend: "up",
      },
      {
        id: "4",
        title: "Inflation Impact on Savings",
        volume: "Medium",
        trend: "down",
      },
    ]);
  });

  // Stories API (Firestore-backed)
  app.get("/api/stories", async (req, res) => {
    const { type, slug, category } = req.query;

    try {
      let q;
      if (slug) {
        q = query(
          collection(db, "stories"),
          where("slug", "==", slug),
          limit(1),
        );
      } else if (type === "top") {
        q = query(
          collection(db, "stories"),
          where("isTopStory", "==", true),
          limit(1),
        );
      } else if (category) {
        q = query(
          collection(db, "stories"),
          where("category", "==", category),
          orderBy("publishedAt", "desc"),
          limit(10),
        );
      } else {
        q = query(
          collection(db, "stories"),
          orderBy("publishedAt", "desc"),
          limit(20),
        );
      }

      const snapshot = await getDocs(q);
      const stories = snapshot.docs.map((doc) => {
        const data = doc.data() as any;
        return {
          id: doc.id,
          ...data,
          publishedAt: (data.publishedAt as Timestamp).toDate().toISOString(),
        };
      });

      res.json(stories);
    } catch (error) {
      console.error("Error fetching stories:", error);
      res.status(500).json({ error: "Failed to fetch stories" });
    }
  });

  // Manual Trigger for News Rotation (Simulating Cron)
  app.post("/api/cron/rotate-news", async (req, res) => {
    if (cronSecret) {
      const providedSecret = req.get("x-cron-secret");
      if (providedSecret !== cronSecret) {
        return res.status(401).json({ error: "Unauthorized" });
      }
    }

    try {
      await rotateHeroStory();
      res.json({ status: "success", message: "Hero story rotated" });
    } catch (error) {
      console.error("Error rotating news:", error);
      res.status(500).json({ error: "Failed to rotate news" });
    }
  });

  // Initial Rotation if no stories exist
  const checkStories = async () => {
    try {
      const q = query(collection(db, "stories"), limit(1));
      const snap = await getDocs(q);
      if (snap.empty) {
        console.log("No stories found, performing initial rotation...");
        await rotateHeroStory();
      }
    } catch (err) {
      console.error("Initial story check failed:", err);
    }
  };
  checkStories();

  // Hourly Rotation Simulation (In-memory for preview)
  setInterval(async () => {
    console.log("Performing hourly news rotation...");
    try {
      await rotateHeroStory();
    } catch (err) {
      console.error("Hourly rotation failed:", err);
    }
  }, 3600000);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
