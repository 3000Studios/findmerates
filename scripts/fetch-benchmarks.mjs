// scripts/fetch-benchmarks.mjs
// Build-time benchmark fetch for FindMeRates.com.
// Pulls the site's own public data sources (FRED fredgraph.csv — no API key,
// same endpoints src/services/liveRates.ts and functions/api/rates.ts use)
// and writes scripts/benchmarks.json: latest value + observation date,
// previous observation, ~1-year-ago value, and the last 12 observations
// for each series. prerender.mjs bakes these figures — with their real
// dates and sources — into the static HTML of every rate page, so crawlers
// see real, dated benchmark numbers instead of a page with no rates in it.
//
// Resilience (builds must not die because FRED hiccuped once):
//  - each series is retried 3x; a series that fails keeps its previous
//    entry from the last good benchmarks.json (its observation date stays
//    truthful — prerender prints the date the figure is actually from).
//  - exit 1 ONLY if a REQUIRED series has no usable value at all
//    (no fetch + no previous file). A stale-but-dated figure is honest;
//    a missing figure would ship a rates page with no rates, which is the
//    defect this file exists to fix.
//
// No invented numbers: every value in benchmarks.json is a verbatim FRED
// observation. Derived figures (week-over-week bps) are computed from two
// verbatim observations and labelled as such.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_PATH = path.join(__dirname, "benchmarks.json");
const FRED_BASE = "https://fred.stlouisfed.org/graph/fredgraph.csv?id=";

// Series the site already relies on (see liveRates.ts / functions/api/rates.ts).
// required: the build fails without a usable value. optional: warned, not fatal.
const SERIES = [
  { id: "MORTGAGE30US", label: "30-year fixed mortgage rate", source: "Freddie Mac Primary Mortgage Market Survey (PMMS), via FRED", required: true },
  { id: "MORTGAGE15US", label: "15-year fixed mortgage rate", source: "Freddie Mac Primary Mortgage Market Survey (PMMS), via FRED", required: true },
  { id: "DGS10", label: "10-year Treasury yield", source: "U.S. Department of the Treasury, via FRED", required: true },
  { id: "DGS2", label: "2-year Treasury yield", source: "U.S. Department of the Treasury, via FRED", required: false },
  { id: "DGS1", label: "1-year Treasury yield", source: "U.S. Department of the Treasury, via FRED", required: true },
  { id: "SOFR", label: "Secured Overnight Financing Rate", source: "Federal Reserve Bank of New York, via FRED", required: true },
  { id: "FEDFUNDS", label: "Effective federal funds rate", source: "Federal Reserve, via FRED (monthly)", required: false },
  { id: "DPRIME", label: "Bank prime loan rate", source: "Federal Reserve H.15, via FRED", required: false },
];

const HISTORY_POINTS = 12; // last N observations kept per series (weekly tables)
const MAX_AGE_DAYS_FALLBACK = 21; // previous-file entry older than this is unusable

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function parseFredCsv(text, seriesId) {
  if (!text || text.trimStart().startsWith("<")) {
    throw new Error(`FRED returned non-CSV for ${seriesId}`);
  }
  const lines = text.trim().split("\n");
  if (lines.length < 2) throw new Error(`FRED CSV too short for ${seriesId}`);
  const obs = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(",");
    const date = (parts[0] || "").trim();
    const raw = (parts[1] || "").trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;
    if (!raw || raw === ".") continue;
    const value = Number(raw);
    if (Number.isFinite(value)) obs.push({ date, value });
  }
  if (obs.length === 0) throw new Error(`No valid observations for ${seriesId}`);
  return obs;
}

async function fetchSeries(seriesId, attempts = 3) {
  let lastErr = null;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(`${FRED_BASE}${encodeURIComponent(seriesId)}`, {
        headers: { "User-Agent": "FindMeRates.com build (contact: hello@findmerates.com)" },
        signal: AbortSignal.timeout(30000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return parseFredCsv(await res.text(), seriesId);
    } catch (err) {
      lastErr = err;
      if (i < attempts - 1) await sleep(2000 * (i + 1));
    }
  }
  throw lastErr;
}

function yearAgo(obs, latestDate) {
  const target = new Date(latestDate);
  target.setFullYear(target.getFullYear() - 1);
  const targetStr = target.toISOString().slice(0, 10);
  // closest observation on or before the 1-year-ago date
  let best = null;
  for (const o of obs) {
    if (o.date <= targetStr) best = o;
    else break;
  }
  return best;
}

async function main() {
  let previous = null;
  if (fs.existsSync(OUT_PATH)) {
    try {
      previous = JSON.parse(fs.readFileSync(OUT_PATH, "utf8"));
    } catch {
      previous = null;
    }
  }

  const today = new Date().toISOString().slice(0, 10);
  const out = { generatedAt: today, sourceNote: "Verbatim FRED observations (fredgraph.csv, no API key). Deltas are computed from two verbatim observations.", series: {} };
  const failedRequired = [];

  for (const s of SERIES) {
    let obs = null;
    try {
      obs = await fetchSeries(s.id);
      console.log(`[benchmarks] ${s.id}: ${obs.length} obs, latest ${obs[obs.length - 1].date} = ${obs[obs.length - 1].value}`);
    } catch (err) {
      console.warn(`[benchmarks] WARN ${s.id} fetch failed: ${err.message}`);
      const prev = previous?.series?.[s.id];
      if (prev?.latest?.date) {
        const ageDays = (Date.parse(today) - Date.parse(prev.latest.date)) / 86400000;
        if (ageDays <= MAX_AGE_DAYS_FALLBACK) {
          console.warn(`[benchmarks] keeping previous ${s.id} entry (observed ${prev.latest.date}, ${Math.round(ageDays)}d old)`);
          out.series[s.id] = { ...prev, stale: true };
          continue;
        }
        console.warn(`[benchmarks] previous ${s.id} entry too old (${Math.round(ageDays)}d) — dropping`);
      }
      if (s.required) failedRequired.push(s.id);
      continue;
    }

    const latest = obs[obs.length - 1];
    const prevObs = obs.length > 1 ? obs[obs.length - 2] : null;
    const ya = yearAgo(obs, latest.date);
    out.series[s.id] = {
      id: s.id,
      label: s.label,
      source: s.source,
      latest,
      previous: prevObs,
      yearAgo: ya,
      history: obs.slice(-HISTORY_POINTS),
    };
  }

  if (failedRequired.length > 0) {
    console.error(`[benchmarks] FATAL: no usable value for required series: ${failedRequired.join(", ")}`);
    process.exit(1);
  }

  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2) + "\n", "utf8");
  console.log(`[benchmarks] wrote ${path.relative(ROOT, OUT_PATH)} (${Object.keys(out.series).length} series, generated ${today})`);
}

main().catch((err) => {
  console.error("[benchmarks] FATAL:", err);
  process.exit(1);
});
