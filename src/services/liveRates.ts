import { RateCategory, RateResult } from "../types";

const FRED_SERIES_BASE = "https://fred.stlouisfed.org/graph/fredgraph.csv?id=";

type LiveBenchmarks = {
  mortgage30y: number;
  sofr: number;
  treasury1y: number;
  treasury2y: number;
  treasury10y: number;
};

const PROVIDERS = [
  "PrimeLend Financial",
  "NorthStar Capital",
  "HarborView Bank",
  "Summit Credit Union",
  "Cedar Point Lending",
];

async function fetchFredLatestValue(seriesId: string): Promise<number> {
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
}

async function getLiveBenchmarks(): Promise<LiveBenchmarks> {
  const [mortgage30y, sofr, treasury1y, treasury2y, treasury10y] =
    await Promise.all([
      fetchFredLatestValue("MORTGAGE30US"),
      fetchFredLatestValue("SOFR"),
      fetchFredLatestValue("DGS1"),
      fetchFredLatestValue("DGS2"),
      fetchFredLatestValue("DGS10"),
    ]);

  return { mortgage30y, sofr, treasury1y, treasury2y, treasury10y };
}

function categoryBaseRate(category: RateCategory, b: LiveBenchmarks): number {
  switch (category) {
    case RateCategory.MORTGAGE:
      return b.mortgage30y;
    case RateCategory.CD:
      return Math.max(0.5, b.treasury1y - 0.1);
    case RateCategory.AUTO_LOAN:
      return b.treasury2y + 1.9;
    case RateCategory.PERSONAL_LOAN:
      return b.sofr + 4.2;
    case RateCategory.REFINANCE:
      return b.mortgage30y - 0.35;
    case RateCategory.INSURANCE:
      return b.treasury10y + 0.75;
    case RateCategory.SAVINGS:
      return Math.max(0.5, b.sofr - 0.25);
    case RateCategory.TRENDS:
      return b.treasury10y;
    default:
      return b.treasury2y;
  }
}

function categoryTerm(category: RateCategory): string {
  switch (category) {
    case RateCategory.MORTGAGE:
      return "30-Year Fixed";
    case RateCategory.CD:
      return "12-Month CD";
    case RateCategory.AUTO_LOAN:
      return "60-Month Auto";
    case RateCategory.PERSONAL_LOAN:
      return "36-Month Personal";
    case RateCategory.REFINANCE:
      return "30-Year Refinance";
    case RateCategory.INSURANCE:
      return "Annual Premium Rate";
    case RateCategory.SAVINGS:
      return "High-Yield Savings APY";
    case RateCategory.TRENDS:
      return "10-Year Benchmark";
    default:
      return "Market Rate";
  }
}

function fallbackRates(category: RateCategory): RateResult[] {
  const now = new Date().toISOString();
  return PROVIDERS.slice(0, 3).map((provider, index) => {
    const rate = Number((5.5 + index * 0.2).toFixed(2));
    return {
      id: `${category}-fallback-${index + 1}`,
      provider,
      rate,
      apr: Number((rate + 0.12).toFixed(2)),
      term: categoryTerm(category),
      category,
      lastUpdated: now,
      details: [
        "Live benchmark fallback",
        "No origination fee estimate",
        "Rate lock options available",
      ],
      ctaUrl: "https://findmerates.com/rates/search",
    };
  });
}

export async function getLiveRates(category: RateCategory): Promise<RateResult[]> {
  try {
    const benchmarks = await getLiveBenchmarks();
    const base = categoryBaseRate(category, benchmarks);
    const now = new Date().toISOString();

    return PROVIDERS.map((provider, index) => {
      const offset = (index - 2) * 0.08;
      const rate = Number((base + offset).toFixed(2));
      const apr = Number((rate + 0.1 + index * 0.02).toFixed(2));
      return {
        id: `${category}-${provider.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        provider,
        rate,
        apr,
        term: categoryTerm(category),
        category,
        lastUpdated: now,
        details: [
          "Derived from live FRED benchmarks",
          "Rate varies by credit profile",
          "Subject to lender underwriting",
        ],
        ctaUrl: "https://findmerates.com/rates/search",
      };
    });
  } catch (error) {
    console.error("Failed to load live rates:", error);
    return fallbackRates(category);
  }
}

