import React, { useState } from 'react';
import { Calculator, DollarSign, Percent, Calendar, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { motion } from 'motion/react';

export default function MortgageCalculator() {
  const [loanAmount, setLoanAmount] = useState(300000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);

  const calculatePayment = () => {
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    const payment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    return payment || 0;
  };

  const monthlyPayment = calculatePayment();

  return (
    <div className="bg-brand-900 border border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden">
      <div className="p-12 bg-accent-gold text-brand-900">
        <h2 className="text-3xl font-display font-bold flex items-center gap-4 uppercase tracking-tight">
          <Calculator className="w-8 h-8" /> Mortgage Modeling
        </h2>
        <p className="text-brand-900/70 mt-2 font-bold uppercase tracking-[0.3em] text-[10px]">Institutional grade principal and interest estimation.</p>
      </div>
      
      <div className="p-12 grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-7 space-y-12">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-6 flex items-center gap-3 uppercase tracking-[0.4em]">
              <DollarSign className="w-4 h-4 text-accent-gold" /> Principal Amount
            </label>
            <input
              type="range"
              min="50000"
              max="2000000"
              step="10000"
              className="w-full h-1 bg-white/10 appearance-none cursor-pointer accent-accent-gold"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
            />
            <div className="mt-6 flex justify-between items-center">
              <span className="text-[9px] font-bold text-slate-700 uppercase tracking-widest">$50k</span>
              <span className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-white tracking-tighter truncate">{formatCurrency(loanAmount)}</span>
              <span className="text-[9px] font-bold text-slate-700 uppercase tracking-widest">$2M</span>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-6 flex items-center gap-3 uppercase tracking-[0.4em]">
              <Percent className="w-4 h-4 text-accent-gold" /> Annual Interest Rate
            </label>
            <input
              type="range"
              min="1"
              max="15"
              step="0.125"
              className="w-full h-1 bg-white/10 appearance-none cursor-pointer accent-accent-gold"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
            />
            <div className="mt-6 flex justify-between items-center">
              <span className="text-[9px] font-bold text-slate-700 uppercase tracking-widest">1%</span>
              <span className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-accent-gold tracking-tighter truncate">{interestRate}%</span>
              <span className="text-[9px] font-bold text-slate-700 uppercase tracking-widest">15%</span>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-6 flex items-center gap-3 uppercase tracking-[0.4em]">
              <Calendar className="w-4 h-4 text-accent-gold" /> Amortization Period
            </label>
            <div className="grid grid-cols-3 gap-1">
              {[15, 20, 30].map((term) => (
                <button
                  key={term}
                  onClick={() => setLoanTerm(term)}
                  className={`py-6 font-bold text-[10px] uppercase tracking-widest transition-all border ${
                    loanTerm === term
                      ? 'bg-accent-gold text-brand-900 border-accent-gold'
                      : 'bg-brand-600 text-slate-500 border-white/5 hover:border-accent-gold/50'
                  }`}
                >
                  {term} Years
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-brand-600 p-12 flex flex-col justify-center items-center text-center border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/5 blur-3xl rounded-full" />
          <p className="text-slate-600 font-bold uppercase tracking-[0.4em] text-[9px] mb-8">Monthly Debt Service</p>
          <p className="text-4xl md:text-5xl lg:text-7xl font-display font-bold text-white mb-6 tracking-tighter truncate">{formatCurrency(monthlyPayment)}</p>
          <p className="text-slate-700 text-[9px] font-bold uppercase tracking-[0.3em] mb-12">Institutional Estimate</p>
          
          <div className="w-full pt-12 border-t border-white/5 space-y-6">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
              <span className="text-slate-600">Total Principal</span>
              <span className="text-white">{formatCurrency(loanAmount)}</span>
            </div>
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
              <span className="text-slate-600">Total Interest</span>
              <span className="text-accent-gold">{formatCurrency(monthlyPayment * loanTerm * 12 - loanAmount)}</span>
            </div>
          </div>

          <button className="btn-corporate btn-corporate-gold mt-16 w-full flex items-center justify-center gap-4">
            Initialize Pre-Approval <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
