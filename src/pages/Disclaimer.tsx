import React from 'react';

export default function Disclaimer() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12">
        <h1 className="text-4xl font-display font-bold text-slate-900 mb-2">Disclaimer</h1>
        <p className="text-slate-400 text-sm mb-8">Last updated: April 13, 2026</p>
        <div className="prose prose-slate max-w-none">
          <p>FindMeRates.com is an independent comparison site. We do not guarantee that any rate, fee, term, or offer shown on the site is still available when you view it.</p>
          <p>Advertising and affiliate relationships may affect placement or visibility of some products. This does not change our editorial intent to present useful comparison information.</p>
          <p>All financial decisions should be verified directly with the provider.</p>
        </div>
      </div>
    </div>
  );
}
