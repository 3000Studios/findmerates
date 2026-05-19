import React from "react";
import { Link } from "react-router-dom";

const LAST_UPDATED = "May 18, 2026";

export default function Methodology() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-slate-900 to-brand-900 px-4 py-16 text-white">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold md:text-5xl">Rate Methodology</h1>
          <p className="mt-4 text-slate-300">Last updated: {LAST_UPDATED}</p>
        </div>
      </section>

      <article className="mx-auto max-w-3xl space-y-6 px-4 py-14 text-lg leading-relaxed text-slate-700">
        <p>
          This page explains how FindMeRates.com sources, verifies, and displays rate data across our six
          primary product categories.
        </p>

        <h2 className="text-2xl font-bold text-slate-900">Mortgage rates</h2>
        <p>
          National average mortgage rates are sourced from the <em>Freddie Mac Primary Mortgage Market
          Survey (PMMS)</em>, published weekly, and supplemented by the Federal Reserve Economic Data series{" "}
          <code>MORTGAGE30US</code> and <code>MORTGAGE15US</code>. Lender-specific offers are sourced from the
          partner's publicly accessible rate sheet or product page. Personalized rates require credit
          underwriting and are determined by the lender.
        </p>

        <h2 className="text-2xl font-bold text-slate-900">CD &amp; savings rates</h2>
        <p>
          National average CD APYs are sourced from the FDIC <em>Weekly National Rates and Rate Caps</em>{" "}
          report. Top-yield CD offers and high-yield savings account APYs are pulled from publicly listed
          rate sheets at FDIC-insured banks and NCUA-insured credit unions.
        </p>

        <h2 className="text-2xl font-bold text-slate-900">Auto loan rates</h2>
        <p>
          National average auto loan rates are sourced from the Federal Reserve <em>G.19 Consumer Credit</em>{" "}
          release. Lender offers are sourced from partner-published APR ranges.
        </p>

        <h2 className="text-2xl font-bold text-slate-900">Personal loan rates</h2>
        <p>
          National average personal loan APRs are sourced from the Federal Reserve G.19 Consumer Credit
          release. Lender-specific APR ranges are pulled from each partner's published product page.
        </p>

        <h2 className="text-2xl font-bold text-slate-900">Update cadence</h2>
        <p>
          Category rate pages are reviewed at least weekly. The "Last reviewed" date displayed on each
          page reflects the most recent editorial review, not the timestamp of every data refresh.
        </p>

        <h2 className="text-2xl font-bold text-slate-900">Rate disclaimer</h2>
        <p className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-base text-slate-700">
          Rates displayed are for informational purposes only and may not reflect the rate ultimately
          offered to you. Your actual rate depends on your credit profile, loan amount, term, lender
          criteria, and current market conditions. Always confirm the rate directly with the lender
          before applying. FindMeRates.com is not a lender and does not originate loans.
        </p>

        <h2 className="text-2xl font-bold text-slate-900">Related pages</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li><Link className="text-brand-700 underline" to="/editorial-policy">Editorial Policy</Link></li>
          <li><Link className="text-brand-700 underline" to="/how-we-make-money">How We Make Money</Link></li>
          <li><Link className="text-brand-700 underline" to="/affiliate-disclosure">Affiliate Disclosure</Link></li>
        </ul>
      </article>
    </div>
  );
}
