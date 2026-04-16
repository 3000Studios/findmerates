import React from 'react';

export default function CookiePolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12">
        <h1 className="text-4xl font-display font-bold text-slate-900 mb-2">Cookie Policy</h1>
        <p className="text-slate-400 text-sm mb-8">Last updated: April 13, 2026</p>
        <div className="prose prose-slate max-w-none">
          <p>We use cookies and similar technologies to keep the site working, remember preferences, understand usage, and support advertising.</p>
          <p>Some cookies are essential. Others may be used for analytics or ad personalization through partners like Google AdSense.</p>
          <p>If you want to limit cookies, adjust your browser settings or use available consent controls in your region.</p>
        </div>
      </div>
    </div>
  );
}
