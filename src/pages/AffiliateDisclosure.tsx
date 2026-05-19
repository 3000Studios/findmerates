import React from "react";
import { Link } from "react-router-dom";

const LAST_UPDATED = "May 18, 2026";

export default function AffiliateDisclosure() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-slate-900 to-brand-900 px-4 py-16 text-white">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold md:text-5xl">Affiliate Disclosure</h1>
          <p className="mt-4 text-slate-300">Last updated: {LAST_UPDATED}</p>
        </div>
      </section>

      <article className="mx-auto max-w-3xl space-y-6 px-4 py-14 text-lg leading-relaxed text-slate-700">
        <p className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-base text-amber-900">
          <strong>Advertiser Disclosure:</strong> FindMeRates.com may receive compensation from companies whose
          offers appear on this site. This compensation may impact which offers are listed, where they
          appear, and the order in which they appear on category and comparison pages. Compensation does
          not influence the rate or terms a lender ultimately offers you, and it does not influence our
          editorial ratings, reviews, or recommendations.
        </p>

        <h2 className="text-2xl font-bold text-slate-900">FTC compliance</h2>
        <p>
          This disclosure is provided in accordance with the Federal Trade Commission's{" "}
          <em>Guides Concerning the Use of Endorsements and Testimonials in Advertising</em> (16 CFR Part 255)
          and the FTC's <em>.com Disclosures</em> guidance for online publishers.
        </p>

        <h2 className="text-2xl font-bold text-slate-900">Which links are affiliate links?</h2>
        <p>
          Links to financial products, lenders, banks, credit-card issuers, and brokerage services on
          FindMeRates.com may be affiliate links. When you click one and complete a qualifying action
          (submit a rate request, open an account, fund a deposit, apply for a loan, or complete a
          purchase), the partner may pay FindMeRates.com a referral fee. We tag those links with{" "}
          <code>rel="sponsored"</code> or <code>rel="nofollow"</code> as appropriate for search-engine guidelines.
        </p>

        <h2 className="text-2xl font-bold text-slate-900">Which offers do we feature?</h2>
        <p>
          FindMeRates.com does not include every lender or every offer available in the marketplace. The
          set of partners shown reflects: (a) partners we have established a referral relationship with,
          (b) publicly available rate data from non-partner institutions used for benchmarking, and (c)
          editorial judgments about which products best match common consumer needs. We aim to label
          sponsored placements clearly.
        </p>

        <h2 className="text-2xl font-bold text-slate-900">No influence on your rate</h2>
        <p>
          The rate or terms a lender offers <strong>you</strong> are determined by the lender's underwriting
          criteria — credit score, debt-to-income ratio, loan amount, loan term, collateral, geography,
          and current market conditions. Compensation paid to FindMeRates.com has no effect on the rate
          you are offered.
        </p>

        <h2 className="text-2xl font-bold text-slate-900">Related policies</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li><Link className="text-brand-700 underline" to="/how-we-make-money">How We Make Money</Link></li>
          <li><Link className="text-brand-700 underline" to="/editorial-policy">Editorial Policy</Link></li>
          <li><Link className="text-brand-700 underline" to="/methodology">Rate Methodology</Link></li>
          <li><Link className="text-brand-700 underline" to="/privacy">Privacy Policy</Link></li>
        </ul>
      </article>
    </div>
  );
}
