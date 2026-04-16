import React from 'react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12">
        <h1 className="text-4xl font-display font-bold text-slate-900 mb-2">Privacy Policy</h1>
        <p className="text-slate-400 text-sm mb-8">Last updated: April 13, 2026</p>
        <div className="prose prose-slate max-w-none">
          <p>FindMeRates.com respects your privacy and keeps data collection limited to what is needed to operate the site, improve content, and display advertising.</p>
          <p>We may collect information you submit through forms, such as your name, email address, subject, and message. We also collect basic technical data such as browser type, pages visited, device information, and approximate location derived from IP address.</p>
          <p>We use this information to respond to inquiries, maintain security, improve the site, measure traffic, and show relevant advertising. We do not sell your personal information.</p>
          <p>Advertising partners, including Google AdSense, may use cookies or similar technologies to serve and measure ads. You can control cookies through your browser settings and, where available, ad preference controls.</p>
          <p>If you submit a privacy request, contact us through the <Link to="/contact" className="text-brand-600 hover:underline">Contact page</Link>.</p>
        </div>
      </div>
    </div>
  );
}
