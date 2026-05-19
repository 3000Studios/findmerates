import React from "react";
import { Link } from "react-router-dom";

const LAST_UPDATED = "May 18, 2026";

export default function EditorialPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-slate-900 to-brand-900 px-4 py-16 text-white">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold md:text-5xl">Editorial Policy</h1>
          <p className="mt-4 text-slate-300">Last updated: {LAST_UPDATED}</p>
        </div>
      </section>

      <article className="mx-auto max-w-3xl space-y-6 px-4 py-14 text-lg leading-relaxed text-slate-700">
        <p>
          FindMeRates.com publishes rate comparisons, calculators, and explanatory financial content for
          U.S. consumers. Our editorial standards are set out below.
        </p>

        <h2 className="text-2xl font-bold text-slate-900">Independence</h2>
        <p>
          Editorial decisions are made independently of advertising and affiliate relationships. Partners
          cannot pay to influence the editorial assessment of a product, the order of organic
          recommendations, or the content of a guide or article. Sponsored placements, when used, are
          labeled.
        </p>

        <h2 className="text-2xl font-bold text-slate-900">Sourcing</h2>
        <p>
          Rate data is sourced from publicly available references including:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Freddie Mac Primary Mortgage Market Survey (PMMS)</li>
          <li>FDIC Weekly National Rates and Rate Caps report</li>
          <li>Federal Reserve G.19 Consumer Credit release</li>
          <li>Federal Reserve Economic Data (FRED) series for mortgage and Treasury benchmarks</li>
          <li>Lender-published rate sheets and product pages</li>
        </ul>
        <p>See our <Link className="text-brand-700 underline" to="/methodology">Methodology</Link> page for the full source list and how data is verified.</p>

        <h2 className="text-2xl font-bold text-slate-900">Updates &amp; review cadence</h2>
        <p>
          Category rate pages are reviewed at least weekly and updated when source data changes
          materially. Each page displays the date it was last reviewed.
        </p>

        <h2 className="text-2xl font-bold text-slate-900">Corrections</h2>
        <p>
          Email <a className="text-brand-700 underline" href="mailto:hello@findmerates.com">hello@findmerates.com</a> to
          report a factual error. Material corrections are noted at the bottom of the affected page along
          with the date the correction was made.
        </p>

        <h2 className="text-2xl font-bold text-slate-900">Not financial advice</h2>
        <p>
          Content on FindMeRates.com is informational and is not personalized financial, tax, accounting,
          or legal advice. We are not a registered investment adviser, broker-dealer, mortgage broker, or
          insurance producer. Consult a licensed professional for advice specific to your situation.
        </p>

        <h2 className="text-2xl font-bold text-slate-900">Use of AI</h2>
        <p>
          Some FindMeRates.com features use large language models to generate plain-English summaries,
          briefings, and chat responses. AI-generated outputs are reviewed for accuracy where they affect
          published rate data or product recommendations, and AI is not used to set editorial rankings.
        </p>
      </article>
    </div>
  );
}
