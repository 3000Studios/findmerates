import React from 'react';
import { RateResult } from '../types';
import { formatCurrency, formatPercent, cn } from '../lib/utils';
import { ExternalLink, Info, TrendingUp, ShieldCheck } from 'lucide-react';

export default function RateCard({ result }: { result: RateResult }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="flex-shrink-0 w-full md:w-48 flex flex-col items-center md:items-start gap-2">
          <div className="h-12 w-full bg-slate-50 rounded flex items-center justify-center border border-slate-100">
            <span className="font-display font-bold text-slate-400">{result.provider}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium uppercase tracking-wider">
            <ShieldCheck className="w-3 h-3" /> FDIC Insured
          </div>
        </div>

        <div className="flex-grow grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
          <div className="text-center md:text-left">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Rate</p>
            <p className="text-3xl font-display font-bold text-slate-900">{formatPercent(result.rate)}</p>
          </div>
          <div className="text-center md:text-left">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">APR</p>
            <p className="text-3xl font-display font-bold text-slate-900">{formatPercent(result.apr || result.rate)}</p>
          </div>
          <div className="hidden md:block">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Term</p>
            <p className="text-lg font-semibold text-slate-700">{result.term}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full md:w-auto">
          <a
            href={result.ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-700 transition-colors shadow-sm"
          >
            Check Rate <ExternalLink className="ml-2 w-4 h-4" />
          </a>
          <button className="text-xs text-slate-500 font-medium hover:text-brand-600 transition-colors flex items-center justify-center gap-1">
            <Info className="w-3 h-3" /> View Details
          </button>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-4">
        {result.details.map((detail, i) => (
          <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
            {detail}
          </span>
        ))}
        <span className="ml-auto text-[10px] text-slate-400">Last updated: {new Date(result.lastUpdated).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
