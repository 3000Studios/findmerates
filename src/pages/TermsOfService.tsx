import React from 'react';

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12">
        <h1 className="text-4xl font-display font-bold text-slate-900 mb-2">Terms of Service</h1>
        <p className="text-slate-400 text-sm mb-8">Last updated: April 13, 2026</p>
        <div className="prose prose-slate max-w-none">
          <p>FindMeRates.com is provided for informational purposes only. We are not a bank, lender, broker, or financial advisor.</p>
          <p>Rate information may change without notice. You should always verify current terms directly with the lender or financial institution before applying for any product.</p>
          <p>You agree not to misuse the site, attempt unauthorized access, scrape protected areas, or interfere with the operation of the service.</p>
          <p>We may update or remove content, features, or ads at any time. Continued use of the site means you accept the current version of these terms.</p>
        </div>
      </div>
    </div>
  );
}
