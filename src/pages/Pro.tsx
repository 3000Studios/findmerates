import React, { useState } from 'react';
import { Check, Zap, Star, ShieldCheck, ArrowRight, Download, Bell, Search } from 'lucide-react';
import { motion } from 'motion/react';

export default function Pro() {
  const features = [
    { icon: Bell, title: 'Instant Rate Alerts', desc: 'Get notified the second rates drop below your target.' },
    { icon: Search, title: 'Advanced Search', desc: 'Filter by credit score, LTV, and hyper-local data.' },
    { icon: Zap, title: 'Priority Updates', desc: 'See new rates up to 4 hours before free users.' },
    { icon: Download, title: 'Rate Finder Pro Guide', desc: 'Exclusive 50-page guide to mastering financial rates.' },
  ];

  return (
    <div className="pb-20">
      <section className="bg-slate-900 pt-20 pb-32 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-600/10 -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/20 text-brand-400 border border-brand-500/30 mb-6 uppercase tracking-wider">
              <Star className="w-3 h-3 mr-1 fill-current" /> Premium Utility
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">FindMeRates <span className="text-brand-500">PRO</span></h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12">
              The ultimate tool for financial optimization. Save thousands with real-time intelligence and automated alerts.
            </p>
          </motion.div>

          <div className="max-w-md mx-auto bg-white rounded-3xl p-8 text-slate-900 shadow-2xl relative">
            <div className="absolute -top-4 -right-4 bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">BEST VALUE</div>
            <div className="mb-8">
              <p className="text-slate-500 font-medium uppercase tracking-widest text-xs mb-2">Annual Plan</p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl font-display font-bold">$9.99</span>
                <span className="text-slate-500">/mo</span>
              </div>
              <p className="text-slate-400 text-sm mt-2">Billed annually at $119.88</p>
            </div>

            <ul className="space-y-4 mb-8 text-left">
              {['Unlimited Rate Alerts', 'Hyper-local Data Access', 'Ad-free Experience', 'Pro Guide Included', 'Priority Support'].map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                  <div className="w-5 h-5 bg-brand-100 rounded-full flex items-center justify-center text-brand-600">
                    <Check className="w-3 h-3" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>

            <button className="w-full py-4 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-all shadow-lg hover:shadow-brand-500/20">
              Upgrade to Pro Now
            </button>
            <p className="text-[10px] text-slate-400 mt-4 flex items-center justify-center gap-1 uppercase tracking-widest">
              <ShieldCheck className="w-3 h-3" /> Secure Checkout via PayPal
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="w-10 h-10 bg-brand-50 rounded-lg flex items-center justify-center text-brand-600 mb-4">
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pro Guide Teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-900 rounded-3xl overflow-hidden flex flex-col lg:flex-row items-center">
          <div className="p-12 lg:p-20 flex-grow">
            <span className="text-brand-400 font-bold uppercase tracking-widest text-xs mb-4 block">Exclusive Bonus</span>
            <h2 className="text-4xl font-display font-bold text-white mb-6">Rate Finder Pro Guide</h2>
            <p className="text-brand-200 text-lg mb-8 max-w-xl">
              Learn the secrets of the banking industry. We show you exactly when to lock your rate, how to negotiate fees, and how to spot hidden costs.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg text-white text-sm font-medium border border-white/10">50+ Pages</div>
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg text-white text-sm font-medium border border-white/10">Updated Monthly</div>
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg text-white text-sm font-medium border border-white/10">$49.99 Value</div>
            </div>
          </div>
          <div className="w-full lg:w-1/3 bg-brand-800 p-12 flex items-center justify-center">
            <div className="w-48 h-64 bg-white rounded-lg shadow-2xl transform rotate-6 flex flex-col p-4">
              <div className="w-8 h-8 bg-brand-600 rounded mb-4" />
              <div className="h-2 w-full bg-slate-100 mb-2" />
              <div className="h-2 w-3/4 bg-slate-100 mb-8" />
              <div className="mt-auto text-[10px] font-bold text-slate-400">FIND ME RATES PRO</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
