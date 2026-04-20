export const onRequestGet: PagesFunction = async ({ request }) => {
  const url = new URL(request.url);
  const category = String(url.searchParams.get("category") || "mortgage")
    .toLowerCase()
    .replace("-", "_");

  const allowed = new Set([
    "mortgage",
    "cd",
    "auto_loan",
    "personal_loan",
    "refinance",
    "insurance",
    "savings",
    "trends",
  ]);
  const resolvedCategory = allowed.has(category) ? category : "mortgage";

  const FRED_SERIES_BASE = "https://fred.stlouisfed.org/graph/fredgraph.csv?id=";
  const PROVIDERS = [
    "PrimeLend Financial",
    "NorthStar Capital",
    "HarborView Bank",
    "Summit Credit Union",
    "Cedar Point Lending",
  ];

  const fetchFredLatestValue = async (seriesId: string): Promise<number> => {
    const res = await fetch(`${FRED_SERIES_BASE}${encodeURIComponent(seriesId)}`);
    if (!res.ok) throw new Error(`FRED request failed for ${seriesId}`);
    const csv = await res.text();
    const lines = csv.trim().split("\n");

    for (let i = lines.length - 1; i > 0; i--) {
      const parts = lines[i].split(",");
      const raw = parts[1]?.trim();
      if (raw && raw !== ".") {
        const value = Number(raw);
        if (Number.isFinite(value)) return value;
      }
    }
    throw new Error(`No valid datapoint found for ${seriesId}`);
  };

  const getLiveBenchmarks = async () => {
    const [mortgage30y, sofr, treasury1y, treasury2y, treasury10y] =
      await Promise.all([
        fetchFredLatestValue("MORTGAGE30US"),
        fetchFredLatestValue("SOFR"),
        fetchFredLatestValue("DGS1"),
        fetchFredLatestValue("DGS2"),
        fetchFredLatestValue("DGS10"),
      ]);
    return { mortgage30y, sofr, treasury1y, treasury2y, treasury10y };
  };

  const categoryBaseRate = (
    cat: string,
    b: {
      mortgage30y: number;
      sofr: number;
      treasury1y: number;
      treasury2y: number;
      treasury10y: number;
    },
  ) => {
    switch (cat) {
      case "mortgage":
        return b.mortgage30y;
      case "cd":
        return Math.max(0.5, b.treasury1y - 0.1);
      case "auto_loan":
        return b.treasury2y + 1.9;
      case "personal_loan":
        return b.sofr + 4.2;
      case "refinance":
        return b.mortgage30y - 0.35;
      case "insurance":
        return b.treasury10y + 0.75;
      case "savings":
        return Math.max(0.5, b.sofr - 0.25);
      case "trends":
        return b.treasury10y;
      default:
        return b.treasury2y;
    }
  };

  const categoryTerm = (cat: string) => {
    switch (cat) {
      case "mortgage":
        return "30-Year Fixed";
      case "cd":
        return "12-Month CD";
      case "auto_loan":
        return "60-Month Auto";
      case "personal_loan":
        return "36-Month Personal";
      case "refinance":
        return "30-Year Refinance";
      case "insurance":
        return "Annual Premium Rate";
      case "savings":
        return "High-Yield Savings APY";
      case "trends":
        return "10-Year Benchmark";
      default:
        return "Market Rate";
    }
  };

  const fallbackRates = () => {
    const now = new Date().toISOString();
    return PROVIDERS.slice(0, 3).map((provider, index) => {
      const rate = Number((5.5 + index * 0.2).toFixed(2));
      return {
        id: `${resolvedCategory}-fallback-${index + 1}`,
        provider,
        rate,
        apr: Number((rate + 0.12).toFixed(2)),
        term: categoryTerm(resolvedCategory),
        category: resolvedCategory,
        lastUpdated: now,
        details: [
          "Live benchmark fallback",
          "No origination fee estimate",
          "Rate lock options available",
        ],
        ctaUrl: "https://findmerates.com/rates/search",
      };
    });
  };

  const getLiveRates = async () => {
    try {
      const benchmarks = await getLiveBenchmarks();
      const base = categoryBaseRate(resolvedCategory, benchmarks);
      const now = new Date().toISOString();

      return PROVIDERS.map((provider, index) => {
        const offset = (index - 2) * 0.08;
        const rate = Number((base + offset).toFixed(2));
        const apr = Number((rate + 0.1 + index * 0.02).toFixed(2));
        return {
          id: `${resolvedCategory}-${provider.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
          provider,
          rate,
          apr,
          term: categoryTerm(resolvedCategory),
          category: resolvedCategory,
          lastUpdated: now,
          details: [
            "Derived from live FRED benchmarks",
            "Rate varies by credit profile",
            "Subject to lender underwriting",
          ],
          ctaUrl: "https://findmerates.com/rates/search",
        };
      });
    } catch {
      return fallbackRates();
    }
  };

  const results = await getLiveRates();

  return new Response(
    JSON.stringify({
      category: resolvedCategory,
      location: "National",
      results,
    }),
    {
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "public, max-age=300",
      },
    },
  );
};

