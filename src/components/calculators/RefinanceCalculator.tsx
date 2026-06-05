import React, { useState } from "react";
import { ArrowRight, DollarSign, Percent, Calendar, RefreshCw } from "lucide-react";
import { formatCurrency } from "../../lib/utils";
import { Link } from "react-router-dom";

const PARTNERS = [
  { name: "Better.com", desc: "No commissions, no lender fees. Get a free refi quote in minutes.", badge: "No Fees", url: "https://better.com/refinance" },
  { name: "Rocket Mortgage", desc: "See how much you could save with a fast online refinance quote.", badge: "Top Rated", url: "https://www.rocketmortgage.com/refinance" },
  { name: "SoFi Home Loans", desc: "Member-friendly refi with competitive rates and fast closing.", badge: "Fast Close", url: "https://www.sofi.com/home-loans/mortgage-refinance/" },
];

function calcMonthly(balance: number, annualRate: number, months: number) {
  if (annualRate === 0) return balance / months;
  const r = annualRate / 100 / 12;
  return (balance * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

export default function RefinanceCalculator() {
  const [currentRate, setCurrentRate] = useState(7.5);
  const [newRate, setNewRate] = useState(6.5);
  const [balance, setBalance] = useState(300000);
  const [remainingYears, setRemainingYears] = useState(25);
  const [closingCosts, setClosingCosts] = useState(4000);

  const remainingMonths = remainingYears * 12;
  const oldPayment = calcMonthly(balance, currentRate, remainingMonths);
  const newPayment = calcMonthly(balance, newRate, remainingMonths);
  const monthlySavings = oldPayment - newPayment;
  const breakEvenMonths = monthlySavings > 0 ? Math.ceil(closingCosts / monthlySavings) : Infinity;
  const fiveYearSavings = Math.max(0, monthlySavings * 60 - closingCosts);
  const lifetimeSavings = Math.max(0, monthlySavings * remainingMonths - closingCosts);

  return (
    <div className="space-y-6">
      <div className="card overflow-hidden">
        <div className="bg-brand-900 p-6 text-white md:p-8">
          <div className="section-kicker text-brand-200">Calculator</div>
          <h2 className="mt-3 flex items-center gap-3 text-3xl text-white">
            <RefreshCw className="h-6 w-6" />
            Refinance Calculator
          </h2>
          <p className="mt-3 max-w-2xl text-brand-100">
            See how much you could save by refinancing to a lower rate, and how quickly you'd break even on closing costs.
          </p>
        </div>

        <div className="grid gap-8 p-6 md:p-8 xl:grid-cols-[1fr_0.9fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <label className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
                <DollarSign className="h-4 w-4 text-slate-400" /> Remaining Loan Balance
              </label>
              <input
                type="range"
                min="50000"
                max="1500000"
                step="10000"
                className="w-full accent-brand-700"
                value={balance}
                onChange={(e) => setBalance(Number(e.target.value))}
              />
              <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
                <span>$50k</span>
                <span className="font-semibold text-slate-950">{formatCurrency(balance)}</span>
                <span>$1.5M</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <label className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <Percent className="h-4 w-4 text-slate-400" /> Current Rate
                </label>
                <input
                  type="range"
                  min="2"
                  max="12"
                  step="0.125"
                  className="w-full accent-brand-700"
                  value={currentRate}
                  onChange={(e) => setCurrentRate(Number(e.target.value))}
                />
                <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
                  <span>2%</span>
                  <span className="font-semibold text-slate-950">{currentRate.toFixed(3)}%</span>
                  <span>12%</span>
                </div>
              </div>

              <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
                <label className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <Percent className="h-4 w-4 text-emerald-500" /> New Rate
                </label>
                <input
                  type="range"
                  min="2"
                  max="12"
                  step="0.125"
                  className="w-full accent-emerald-600"
                  value={newRate}
                  onChange={(e) => setNewRate(Number(e.target.value))}
                />
                <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
                  <span>2%</span>
                  <span className="font-semibold text-emerald-700">{newRate.toFixed(3)}%</span>
                  <span>12%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <label className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <Calendar className="h-4 w-4 text-slate-400" /> Years Remaining
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[10, 15, 20, 25, 30].map((y) => (
                    <button
                      key={y}
                      onClick={() => setRemainingYears(y)}
                      className={`rounded-xl border px-2 py-2 text-xs font-semibold transition-colors ${
                        remainingYears === y
                          ? "border-brand-900 bg-brand-900 text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-brand-50"
                      }`}
                    >
                      {y} yr
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <label className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <DollarSign className="h-4 w-4 text-slate-400" /> Closing Costs
                </label>
                <input
                  type="range"
                  min="0"
                  max="15000"
                  step="500"
                  className="w-full accent-brand-700"
                  value={closingCosts}
                  onChange={(e) => setClosingCosts(Number(e.target.value))}
                />
                <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
                  <span>$0</span>
                  <span className="font-semibold text-slate-950">{formatCurrency(closingCosts)}</span>
                  <span>$15k</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(16,34,68,0.08)]">
              <div className={`rounded-[24px] p-6 ${monthlySavings > 0 ? "bg-emerald-50" : "bg-red-50"}`}>
                <p className="section-kicker">Monthly savings</p>
                <p className={`mt-4 text-5xl ${monthlySavings > 0 ? "text-emerald-700" : "text-red-600"}`}>
                  {monthlySavings > 0 ? "+" : ""}{formatCurrency(monthlySavings)}
                </p>
                <p className="mt-2 text-sm text-slate-500">Per month</p>
              </div>

              <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Old payment</span>
                  <span className="font-semibold text-slate-500 line-through">{formatCurrency(oldPayment)}/mo</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">New payment</span>
                  <span className="font-semibold text-emerald-700">{formatCurrency(newPayment)}/mo</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Break-even</span>
                  <span className="font-semibold text-slate-950">
                    {monthlySavings > 0 && isFinite(breakEvenMonths)
                      ? `${breakEvenMonths} months`
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">5-year savings</span>
                  <span className="font-semibold text-emerald-700">{formatCurrency(fiveYearSavings)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Lifetime savings</span>
                  <span className="font-semibold text-emerald-700">{formatCurrency(lifetimeSavings)}</span>
                </div>
              </div>

              <Link
                to="/rates/refinance"
                className="button-primary mt-6 w-full justify-center"
              >
                Compare refi rates now <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
        <p className="section-kicker">Sponsored partners</p>
        <h3 className="mt-2 text-xl font-display font-bold text-slate-900">Top refinance lenders</h3>
        <p className="mt-1 text-sm text-slate-500">Pre-qualify online — most take under 3 minutes and won't hurt your credit score.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {PARTNERS.map((p) => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="group flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-all hover:border-brand-300 hover:bg-brand-50 hover:shadow-md"
            >
              <span className="text-xs font-bold uppercase tracking-widest text-brand-600">{p.badge}</span>
              <p className="font-bold text-slate-900 group-hover:text-brand-800">{p.name}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{p.desc}</p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700">
                Get quote <ArrowRight className="h-3 w-3" />
              </span>
            </a>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-400">
          Advertiser disclosure: FindMeRates may earn compensation when you click partner links.
        </p>
      </div>
    </div>
  );
}
