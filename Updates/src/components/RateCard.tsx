import React from 'react';
import { RateResult } from '../types';
import { formatCurrency, formatPercent, cn } from '../lib/utils';
import { ExternalLink, Info, TrendingUp, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export default function RateCard({ result }: { result: RateResult }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="bg-brand-600 border border-white/5 p-12 shadow-2xl hover:border-accent-gold/50 transition-all group"
    >
      <div className="flex flex-col lg:flex-row gap-12 items-center">
        <div className="flex-shrink-0 w-full lg:w-48 flex flex-col items-center lg:items-start gap-6">
          <div className="h-16 w-full bg-brand-900 border border-white/10 flex items-center justify-center overflow-hidden relative">
            <img 
              src={`https://logo.clearbit.com/${result.provider.toLowerCase().replace(/\s+/g, '')}.com`} 
              alt={result.provider}
              className="h-8 object-contain filter brightness-0 invert opacity-60 group-hover:opacity-100 transition-opacity"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).parentElement!.innerHTML = `<span class="font-display font-bold text-white text-xl uppercase tracking-tighter">${result.provider}</span>`;
              }}
            />
          </div>
          <div className="flex items-center gap-3 text-[9px] text-accent-gold font-bold uppercase tracking-[0.3em]">
            <ShieldCheck className="w-4 h-4" /> Verified
          </div>
        </div>

        <div className="flex-grow grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-12 w-full min-w-0">
          <div className="text-center lg:text-left min-w-0">
            <p className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.4em] mb-4 truncate">Market Rate</p>
            <p className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white tracking-tighter truncate">{formatPercent(result.rate)}</p>
          </div>
          <div className="text-center lg:text-left min-w-0">
            <p className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.4em] mb-4 truncate">Effective APR</p>
            <p className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-accent-gold tracking-tighter truncate">{formatPercent(result.apr || result.rate)}</p>
          </div>
          <div className="hidden lg:block min-w-0">
            <p className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.4em] mb-4 truncate">Instrument Term</p>
            <p className="text-lg lg:text-xl font-bold text-white uppercase tracking-widest truncate">{result.term}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full lg:w-auto">
          <a
            href={result.ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-corporate btn-corporate-gold inline-flex items-center justify-center gap-3"
          >
            Check Rate <ExternalLink className="w-4 h-4" />
          </a>
          <button className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.3em] hover:text-white transition-colors flex items-center justify-center gap-3">
            <Info className="w-4 h-4" /> Technical Details
          </button>
        </div>
      </div>
      
      <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap gap-1">
        {result.details.map((detail, i) => (
          <span key={i} className="px-6 py-2 text-[9px] font-bold uppercase tracking-widest bg-brand-900 text-slate-500 border border-white/5">
            {detail}
          </span>
        ))}
        <span className="ml-auto text-[9px] font-bold text-slate-700 uppercase tracking-[0.4em]">Last Sync: {new Date(result.lastUpdated).toLocaleDateString()}</span>
      </div>
    </motion.div>
  );
}
