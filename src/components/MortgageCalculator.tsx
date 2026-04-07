import React, { useState } from 'react';
import { Calculator, DollarSign, Percent, Calendar, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../lib/utils';

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
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
      <div className="p-8 bg-brand-600 text-white">
        <h2 className="text-2xl font-display font-bold flex items-center gap-2">
          <Calculator className="w-6 h-6" /> Mortgage Calculator
        </h2>
        <p className="text-brand-100 mt-1">Estimate your monthly mortgage payments.</p>
      </div>
      
      <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-slate-400" /> Loan Amount
            </label>
            <input
              type="range"
              min="50000"
              max="2000000"
              step="10000"
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
            />
            <div className="mt-2 flex justify-between items-center">
              <span className="text-xs text-slate-400">$50k</span>
              <span className="text-lg font-bold text-slate-900">{formatCurrency(loanAmount)}</span>
              <span className="text-xs text-slate-400">$2M</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <Percent className="w-4 h-4 text-slate-400" /> Interest Rate
            </label>
            <input
              type="range"
              min="1"
              max="15"
              step="0.125"
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
            />
            <div className="mt-2 flex justify-between items-center">
              <span className="text-xs text-slate-400">1%</span>
              <span className="text-lg font-bold text-slate-900">{interestRate}%</span>
              <span className="text-xs text-slate-400">15%</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" /> Loan Term (Years)
            </label>
            <div className="grid grid-cols-3 gap-4">
              {[15, 20, 30].map((term) => (
                <button
                  key={term}
                  onClick={() => setLoanTerm(term)}
                  className={`py-3 rounded-xl font-semibold transition-all border ${
                    loanTerm === term
                      ? 'bg-brand-600 text-white border-brand-600 shadow-md'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-brand-600'
                  }`}
                >
                  {term} Years
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl p-8 flex flex-col justify-center items-center text-center border border-slate-100">
          <p className="text-slate-500 font-medium uppercase tracking-widest text-xs mb-4">Estimated Monthly Payment</p>
          <p className="text-6xl font-display font-bold text-slate-900 mb-2">{formatCurrency(monthlyPayment)}</p>
          <p className="text-slate-400 text-sm mb-8">Principal & Interest only</p>
          
          <div className="w-full pt-8 border-t border-slate-200 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Total Principal</span>
              <span className="font-semibold text-slate-900">{formatCurrency(loanAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Total Interest</span>
              <span className="font-semibold text-slate-900">{formatCurrency(monthlyPayment * loanTerm * 12 - loanAmount)}</span>
            </div>
          </div>

          <button className="mt-10 w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
            Get Pre-Approved <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
