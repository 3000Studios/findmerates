import React from 'react';
import MortgageCalculator from '../components/MortgageCalculator';
import { Calculator, Home, RefreshCw, Wallet, CreditCard, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdSenseSlot from '../components/AdSenseSlot';
import { AD_CLIENT, AD_SLOTS } from '../lib/ad-config';
import FinanceVideoStrip from "../components/FinanceVideoStrip";
import HeroVideo from "../components/HeroVideo";

export default function Calculators() {
  const calcs = [
    { icon: Home, title: 'Mortgage Calculator', desc: 'Estimate your monthly principal and interest payments.', href: '/calculators/mortgage' },
    { icon: RefreshCw, title: 'Refinance Calculator', desc: 'See how much you could save by refinancing your current loan.', href: '/calculators/refinance' },
    { icon: Wallet, title: 'CD Calculator', desc: 'Calculate the future value of your certificate of deposit.', href: '/calculators/cd' },
    { icon: CreditCard, title: 'Loan Affordability', desc: 'Find out how much house you can actually afford.', href: '/calculators/affordability' },
    { icon: ShieldCheck, title: 'Insurance Estimator', desc: 'Get a quick estimate on your monthly insurance premiums.', href: '/calculators/insurance' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="relative mb-16 overflow-hidden rounded-[32px] border border-white/10 bg-brand-900 px-6 py-16 text-center">
        <HeroVideo
          query="calculator finance desk"
          fallbackQuery="financial planning calculator desk"
          posterOnly
          overlayClassName="bg-gradient-to-b from-brand-900/85 via-brand-900/75 to-brand-900/95"
        />
        <div className="relative z-10">
          <h1 className="text-4xl font-display font-bold text-white mb-4 md:text-5xl">Financial Calculators</h1>
          <p className="text-white/75 max-w-2xl mx-auto">
            Free tools to help you make informed financial decisions. All our calculators are updated with the latest market data.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <FinanceVideoStrip variant="calculator" />
          <MortgageCalculator />
          
          {/* AdSense Mid-Content Ad */}
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <AdSenseSlot
              adClient={AD_CLIENT}
              adSlot={AD_SLOTS.midContent.slotId}
              format={AD_SLOTS.midContent.format}
              minHeight={250}
              className="w-full"
            />
          </div>
          
          <div className="bg-white rounded-2xl border border-slate-200 p-8">
            <h3 className="text-xl font-display font-bold text-slate-900 mb-6">Why use our calculators?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-slate-800 mb-2">Accuracy</h4>
                <p className="text-sm text-slate-500">Our algorithms use industry-standard formulas and real-time interest rates.</p>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 mb-2">Privacy</h4>
                <p className="text-sm text-slate-500">We don't store your financial data unless you explicitly save a calculation.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="font-display font-bold text-slate-900 mb-4">Other Calculators</h3>
          {calcs.map((c) => (
            <Link
              key={c.title}
              to={c.href}
              className="block p-6 bg-white border border-slate-200 rounded-xl hover:border-brand-600 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                  <c.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors">{c.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">{c.desc}</p>
                </div>
              </div>
            </Link>
          ))}
          
          <div className="bg-brand-900 rounded-2xl p-8 text-white mt-8">
            <h4 className="font-display font-bold mb-2">Need a pro opinion?</h4>
            <p className="text-brand-200 text-sm mb-6">Our AI assistant can help you analyze your specific scenario.</p>
            <Link to="/pro" className="block w-full py-3 bg-brand-500 hover:bg-brand-400 rounded-lg font-semibold transition-colors text-center">
              Ask AI Assistant
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
