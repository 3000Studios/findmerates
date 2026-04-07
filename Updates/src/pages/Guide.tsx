import React from 'react';
import Markdown from 'react-markdown';
import { BookOpen, Download, ShieldCheck, Star } from 'lucide-react';

const guideContent = `
# Rate Finder Pro Guide
## Mastering the Art of Financial Rate Optimization

### Introduction
Welcome to the exclusive Rate Finder Pro Guide. This document is designed to give you the upper hand when dealing with banks, lenders, and financial institutions.

### 1. The "Lock-In" Secret
Lenders often wait for rates to tick up before encouraging you to lock in. **Pro Tip:** Monitor the 10-year Treasury yield. If it drops, mortgage rates usually follow within 24-48 hours.

### 2. The APR Trap
Don't just look at the interest rate. The APR (Annual Percentage Rate) includes fees and points. A lower interest rate with high points can actually cost you more over 5 years than a slightly higher rate with zero points.

### 3. CD Laddering for Maximum Yield
Instead of putting $50,000 into a single 5-year CD, split it into five $10,000 CDs with terms of 1, 2, 3, 4, and 5 years. This gives you liquidity every year while capturing the higher long-term rates.

### 4. Credit Score Optimization
Did you know that moving from a 739 to a 740 credit score can save you up to 0.25% on a mortgage? That's thousands of dollars over the life of the loan.

### 5. Negotiation Tactics
Always get at least three quotes. Use the lowest quote as leverage with your preferred bank. Most banks have a "match" policy they don't advertise.
`;

export default function Guide() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="bg-brand-900 p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <BookOpen className="w-48 h-48" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-brand-400 font-bold text-xs uppercase tracking-widest mb-4">
              <Star className="w-4 h-4 fill-current" /> Premium Content
            </div>
            <h1 className="text-4xl font-display font-bold mb-4">Rate Finder Pro Guide</h1>
            <p className="text-brand-200 max-w-xl">
              Your comprehensive manual for navigating the complex world of financial rates and saving thousands.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <button className="inline-flex items-center px-6 py-3 bg-white text-brand-900 font-bold rounded-xl hover:bg-brand-50 transition-colors">
                <Download className="w-4 h-4 mr-2" /> Download PDF
              </button>
              <span className="text-xs text-brand-400 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Verified for 2026
              </span>
            </div>
          </div>
        </div>

        <div className="p-12 prose prose-slate max-w-none">
          <div className="markdown-body">
            <Markdown>{guideContent}</Markdown>
          </div>
        </div>

        <div className="p-12 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-bold text-slate-900">Need more help?</p>
            <p className="text-sm text-slate-500">Our Pro members get 1-on-1 support from our rate analysts.</p>
          </div>
          <button className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors">
            Contact Analyst
          </button>
        </div>
      </div>
    </div>
  );
}
