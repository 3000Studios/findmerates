import React from 'react';
import MortgageCalculator from '../components/MortgageCalculator';
import { Calculator, Home, RefreshCw, Wallet, CreditCard, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Calculators() {
  const calcs = [
    { icon: Home, title: 'Mortgage Calculator', desc: 'Estimate your monthly principal and interest payments.', href: '/calculators/mortgage' },
    { icon: RefreshCw, title: 'Refinance Calculator', desc: 'See how much you could save by refinancing your current loan.', href: '/calculators/refinance' },
    { icon: Wallet, title: 'CD Calculator', desc: 'Calculate the future value of your certificate of deposit.', href: '/calculators/cd' },
    { icon: CreditCard, title: 'Loan Affordability', desc: 'Find out how much house you can actually afford.', href: '/calculators/affordability' },
    { icon: ShieldCheck, title: 'Insurance Estimator', desc: 'Get a quick estimate on your monthly insurance premiums.', href: '/calculators/insurance' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
      <div className="text-center mb-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className="w-12 h-px bg-accent-gold" />
            <span className="text-[10px] font-bold text-accent-gold uppercase tracking-[0.5em]">Precision Instruments</span>
            <span className="w-12 h-px bg-accent-gold" />
          </div>
          <h1 className="text-5xl md:text-9xl font-display font-bold text-white mb-12 uppercase tracking-tighter leading-[0.9]">
            Financial <span className="text-accent-gold">Calculators.</span>
          </h1>
          <p className="text-slate-500 max-w-3xl mx-auto text-xl font-medium leading-relaxed">
            Institutional-grade modeling tools for informed financial decision making. Updated in real-time with global market data.
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-1">
        <div className="lg:col-span-8 space-y-1">
          <div className="bg-brand-600 border border-white/5 p-12 md:p-24">
            <MortgageCalculator />
          </div>
          
          <div className="ad-slot">Institutional Advertisement</div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-brand-600 border border-white/5 p-12 md:p-24"
          >
            <h3 className="text-3xl font-display font-bold text-white mb-12 uppercase tracking-tight">Why use our tools?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="space-y-6">
                <div className="w-12 h-12 bg-brand-900 border border-white/10 flex items-center justify-center text-accent-gold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-white uppercase tracking-tight">Accuracy</h4>
                <p className="text-slate-500 font-medium leading-relaxed">Our algorithms use industry-standard formulas and real-time interest rates from over 1,200 providers.</p>
              </div>
              <div className="space-y-6">
                <div className="w-12 h-12 bg-brand-900 border border-white/10 flex items-center justify-center text-accent-gold">
                  <Wallet className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-white uppercase tracking-tight">Privacy</h4>
                <p className="text-slate-500 font-medium leading-relaxed">We don't store your financial data. All calculations are performed locally and securely within your session.</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-4 space-y-1">
          <h3 className="text-xl font-display font-bold text-white mb-12 uppercase tracking-tight px-12 pt-12">Other Instruments</h3>
          <div className="space-y-1">
            {calcs.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={c.href}
                  className="block p-12 bg-brand-600 border border-white/5 hover:border-accent-gold/50 transition-all group"
                >
                  <div className="flex items-center gap-8">
                    <div className="w-12 h-12 bg-brand-900 border border-white/5 flex items-center justify-center text-slate-600 group-hover:text-accent-gold transition-all">
                      <c.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-accent-gold transition-colors uppercase tracking-widest">{c.title}</h4>
                      <p className="text-[9px] font-bold text-slate-700 mt-2 uppercase tracking-[0.2em]">{c.desc}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          
          <div className="bg-accent-gold p-12">
            <h4 className="text-brand-900 text-xl font-display font-bold mb-6 uppercase tracking-tight leading-tight">Pro Analysis</h4>
            <p className="text-brand-900/70 text-sm mb-10 font-medium leading-relaxed">Our AI assistant can help you analyze your specific scenario with institutional precision.</p>
            <button className="w-full btn-corporate bg-brand-900 text-white border-none flex items-center justify-center gap-3">
              <Sparkles className="w-4 h-4" /> Ask AI Assistant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
