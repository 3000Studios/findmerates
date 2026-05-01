import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calculator, Calendar, DollarSign, Percent } from "lucide-react";
import { formatCurrency } from "../lib/utils";
import { playUiSound } from "../lib/sound";

export default function MortgageCalculator() {
  const [loanAmount, setLoanAmount] = useState(300000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);

  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;
  const monthlyPayment =
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1) || 0;

  return (
    <div className="card overflow-hidden">
      <div className="bg-brand-900 p-6 text-white md:p-8">
        <div className="section-kicker text-brand-200">Calculator</div>
        <h2 className="mt-3 flex items-center gap-3 text-3xl text-white">
          <Calculator className="h-6 w-6" />
          Mortgage calculator
        </h2>
        <p className="mt-3 max-w-2xl text-brand-100">
          Estimate monthly payments with a cleaner control surface and clearer output.
        </p>
      </div>

      <div className="grid gap-8 p-6 md:p-8 xl:grid-cols-[1fr_0.9fr]">
        <div className="space-y-8">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <label className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
              <DollarSign className="h-4 w-4 text-slate-400" /> Loan Amount
            </label>
            <input
              type="range"
              min="50000"
              max="2000000"
              step="10000"
              className="w-full accent-brand-700"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
            />
            <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
              <span>$50k</span>
              <span className="font-semibold text-slate-950">{formatCurrency(loanAmount)}</span>
              <span>$2M</span>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <label className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
              <Percent className="h-4 w-4 text-slate-400" /> Interest Rate
            </label>
            <input
              type="range"
              min="1"
              max="15"
              step="0.125"
              className="w-full accent-brand-700"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
            />
            <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
              <span>1%</span>
              <span className="font-semibold text-slate-950">{interestRate}%</span>
              <span>15%</span>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <label className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
              <Calendar className="h-4 w-4 text-slate-400" /> Loan Term
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[15, 20, 30].map((term) => (
                <button
                  key={term}
                  onClick={() => setLoanTerm(term)}
                  className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors ${
                    loanTerm === term
                      ? "border-brand-900 bg-brand-900 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:border-brand-200 hover:bg-brand-50"
                  }`}
                >
                  {term} years
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(16,34,68,0.08)] md:p-8">
          <div className="rounded-[24px] bg-brand-50 p-6">
            <p className="section-kicker">Estimated payment</p>
            <p className="mt-4 text-5xl text-slate-950 md:text-6xl">{formatCurrency(monthlyPayment)}</p>
            <p className="mt-2 text-sm text-slate-500">Principal and interest only</p>
          </div>

          <div className="mt-6 space-y-4 border-t border-slate-100 pt-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Total Principal</span>
              <span className="font-semibold text-slate-950">{formatCurrency(loanAmount)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Total Interest</span>
              <span className="font-semibold text-slate-950">
                {formatCurrency(monthlyPayment * loanTerm * 12 - loanAmount)}
              </span>
            </div>
          </div>

          <Link 
            to="/rates/mortgage" 
            className="button-primary mt-8 w-full justify-center"
            onMouseEnter={() => playUiSound("hover")}
          >
            See how this compares to today&apos;s best rates <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
