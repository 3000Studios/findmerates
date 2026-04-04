import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, Home as HomeIcon, CreditCard, Wallet, ArrowRight, Zap, ShieldCheck, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { RateCategory } from '../types';
import { cn } from '../lib/utils';
import PredictiveBriefing from '../components/PredictiveBriefing';

export default function Home() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/rates/search?q=${encodeURIComponent(query)}`);
    }
  };

  const categories = [
    { name: 'Mortgages', icon: HomeIcon, href: '/rates/mortgage', color: 'bg-blue-500', rate: '6.25%' },
    { name: 'CD Rates', icon: Wallet, href: '/rates/cd', color: 'bg-emerald-500', rate: '5.15%' },
    { name: 'Auto Loans', icon: Zap, href: '/rates/auto_loan', color: 'bg-orange-500', rate: '5.99%' },
    { name: 'Personal Loans', icon: CreditCard, href: '/rates/personal_loan', color: 'bg-purple-500', rate: '7.49%' },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,rgba(14,165,233,0.1)_0%,rgba(255,255,255,0)_100%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-100 mb-6 uppercase tracking-wider">
              <TrendingUp className="w-3 h-3 mr-1" /> Real-time Rate Comparisons
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-slate-900 mb-6 leading-[1.1]">
              Find the best rates<br />
              <span className="text-brand-600">in seconds.</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Compare mortgages, CD rates, and loans from top providers. 
              Get personalized results with zero impact on your credit score.
            </p>

            <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative group">
              <div className="absolute inset-0 bg-brand-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center bg-white rounded-2xl shadow-xl border border-slate-200 p-2">
                <Search className="w-6 h-6 text-slate-400 ml-4" />
                <input
                  type="text"
                  placeholder="Try 'mortgage rates in Georgia' or 'best CD rates'..."
                  className="flex-grow px-4 py-4 text-lg focus:outline-none text-slate-900 placeholder-slate-400"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-brand-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-brand-700 transition-colors shadow-lg"
                >
                  Search
                </button>
              </div>
            </form>
          </motion.div>

          <div className="mt-16 flex flex-wrap justify-center gap-8 text-slate-400 text-sm font-medium uppercase tracking-widest">
            <span className="flex items-center gap-2"><ShieldCheck className="w-5 h-5" /> FDIC Insured</span>
            <span className="flex items-center gap-2"><Star className="w-5 h-5" /> 4.9/5 TrustScore</span>
            <span className="flex items-center gap-2"><Zap className="w-5 h-5" /> Instant Updates</span>
          </div>
        </div>
      </section>

      {/* Ad Slot (AdSense Compliance: Clearly separated) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="ad-slot">Advertisement - Your Ad Here</div>
      </div>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group relative bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
              onClick={() => navigate(cat.href)}
            >
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white mb-6", cat.color)}>
                <cat.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-slate-900 mb-2">{cat.name}</h3>
              <p className="text-slate-500 text-sm mb-4">Starting as low as</p>
              <p className="text-3xl font-display font-bold text-brand-600 mb-6">{cat.rate}</p>
              <div className="flex items-center text-sm font-semibold text-brand-600 group-hover:gap-2 transition-all">
                Compare Rates <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Predictive Briefing Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PredictiveBriefing />
      </section>

      {/* Trust Section */}
      <section className="bg-slate-900 py-24 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white rounded-full animate-pulse" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-8">Trusted by over 2 million users.</h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-12 text-lg">
            We analyze thousands of data points daily to ensure you get the most accurate and up-to-date financial information.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <p className="text-4xl font-display font-bold text-brand-500 mb-2">1,000+</p>
              <p className="text-slate-500 text-sm uppercase tracking-widest">Providers</p>
            </div>
            <div>
              <p className="text-4xl font-display font-bold text-brand-500 mb-2">24/7</p>
              <p className="text-slate-500 text-sm uppercase tracking-widest">Monitoring</p>
            </div>
            <div>
              <p className="text-4xl font-display font-bold text-brand-500 mb-2">$2B+</p>
              <p className="text-slate-500 text-sm uppercase tracking-widest">Loans Compared</p>
            </div>
            <div>
              <p className="text-4xl font-display font-bold text-brand-500 mb-2">0</p>
              <p className="text-slate-500 text-sm uppercase tracking-widest">Credit Impact</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
