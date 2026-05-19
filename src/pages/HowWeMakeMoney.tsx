import React from "react";
import { Link } from "react-router-dom";

const LAST_UPDATED = "May 18, 2026";

export default function HowWeMakeMoney() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-slate-900 to-brand-900 px-4 py-16 text-white">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold md:text-5xl">How We Make Money</h1>
          <p className="mt-4 text-slate-300">Last updated: {LAST_UPDATED}</p>
        </div>
      </section>

      <article className="mx-auto max-w-3xl space-y-6 px-4 py-14 text-lg leading-relaxed text-slate-700">
        <p>
          FindMeRates.com is free for consumers to use. We earn revenue in three primary ways, disclosed
          here in full as required by the Federal Trade Commission's guidance on endorsements and the
          Google AdSense program policies.
        </p>

        <h2 className="text-2xl font-bold text-slate-900">1. Display advertising</h2>
        <p>
          We display ads served by Google AdSense (publisher ID <code>ca-pub-5800977493749262</code>) on most
          pages. These ads are selected by Google based on contextual signals and, where applicable, your
          ad-personalization settings. Google may use cookies and similar technologies to serve and
          measure ads. You can manage your ad personalization at{" "}
          <a className="text-brand-700 underline" href="https://adssettings.google.com/" rel="noopener noreferrer" target="_blank">
            adssettings.google.com
          </a>
          . Ad placement and content are not chosen by FindMeRates.com editorial staff.
        </p>

        <h2 className="text-2xl font-bold text-slate-900">2. Affiliate and referral partnerships</h2>
        <p>
          When you click a partner offer on FindMeRates.com and complete a qualifying action — such as
          submitting a rate-quote form, opening an account, or applying for a loan — the lender or
          financial institution may pay us a referral fee. The amount paid varies by partner and product
          category. This compensation may influence which offers appear and the order in which they are
          displayed on category pages. It does <strong>not</strong> influence the rate or terms the lender
          ultimately offers you, and it does not influence our editorial assessment of a product.
        </p>
        <p>
          Partner relationships are disclosed inline next to each offer where they apply. See our{" "}
          <Link className="text-brand-700 underline" to="/affiliate-disclosure">Affiliate Disclosure</Link>{" "}
          for FTC-required details.
        </p>

        <h2 className="text-2xl font-bold text-slate-900">3. Optional consumer subscriptions</h2>
        <p>
          FindMeRates Pro is an optional paid tier that adds rate-drop alerts, scenario tools, and
          ad-reduced browsing. Pro is available at $9.99/month or $39.99 for six months paid in full. Pro
          revenue is consumer-paid and is fully independent of lender relationships.
        </p>

        <h2 className="text-2xl font-bold text-slate-900">What this means for you</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>You will never pay more because we were compensated by a lender — referral fees are paid by the lender, not by you.</li>
          <li>The lender determines the rate offered to you based on your credit profile, loan terms, and underwriting criteria — not based on what they pay us.</li>
          <li>We do not accept payment to change editorial ratings, rankings, or recommendations.</li>
          <li>We label sponsored placements when they appear.</li>
        </ul>

        <h2 className="text-2xl font-bold text-slate-900">Questions?</h2>
        <p>
          Email <a className="text-brand-700 underline" href="mailto:hello@findmerates.com">hello@findmerates.com</a> for any
          questions about a specific partner relationship, a corrections request, or a partnership inquiry. Also see our{" "}
          <Link className="text-brand-700 underline" to="/editorial-policy">Editorial Policy</Link> and{" "}
          <Link className="text-brand-700 underline" to="/methodology">Methodology</Link>.
        </p>
      </article>
    </div>
  );
}
