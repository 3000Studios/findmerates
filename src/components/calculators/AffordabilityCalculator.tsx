import React, { useState } from "react";
import { ArrowRight, DollarSign, Home, Percent, CreditCard } from "lucide-react";
import { formatCurrency } from "../../lib/utils";
import { Link } from "react-router-dom";

const PARTNERS = [
  { name: "Rocket Mortgage", desc: "Get a custom mortgage quote in minutes from a top-rated lender.", badge: "Popular", url: "https://www.rocketmortgage.com/" },
  { name: "Better Mortgage", desc: "No commissions, no lender fees. Free online rate quote.", badge: "No Fees", url: "https://better.com/" },
  { name: "SoFi Home Loans", desc: "Competitive rates and fast closing for qualified borrowers.", badge: "Fast Close", url: "https://www.sofi.com/home-loans/mortgage/" },
];

function calcMonthly(loanAmount: number, annualRate: number, termYears: number) {
  if (annualRate === 0) return loanAmount / (termYears * 12);
  const r = annualRate / 100 / 12;
  const n = termYears * 12;
  return (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export default function AffordabilityCalculator() {
  const [grossIncome, setGrossIncome] = useState(8000);
  const [monthlyDebts, setMonthlyDebts] = useState(500);
  const [downPayment, setDownPayment] = useState(60000);
  const [rate, setRate] = useState(6.5);
  const [term, setTerm] = useState(30);

  const maxHousingFrontEnd = grossIncome * 0.28;
  const maxHousingBackEnd = grossIncome * 0.43 - monthlyDebts;
  const maxMonthlyPayment = Math.max(0, Math.min(maxHousingFrontEnd, maxHousingBackEnd));

  const r = rate / 100 / 12;
  const n = term * 12;
  const loanFactor = r > 0 ? (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n)) : n;
  const maxLoan = maxMonthlyPayment * loanFactor;
  const maxHomePrice = maxLoan + downPayment;
  const estimatedPayment = calcMonthly(maxLoan, rate, term);

  const dti = grossIncome > 0 ? ((monthlyDebts + estimatedPayment) / grossIncome) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="card overflow-hidden">
        <div className="bg-brand-900 p-6 text-white md:p-8">
          <div className="section-kicker text-brand-200">Calculator</div>
          <h2 className="mt-3 flex items-center gap-3 text-3xl text-white">
            <Home className="h-6 w-6" />
            Loan Affordability Calculator
          </h2>
          <p className="mt-3 max-w-2xl text-brand-100">
            Find out the maximum home price and loan amount you can realistically afford based on your income and debts.
          </p>
        </div>

        <div className="grid gap-8 p-6 md:p-8 xl:grid-cols-[1fr_0.9fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <label className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
                <DollarSign className="h-4 w-4 text-slate-400" /> Gross Monthly Income
              </label>
              <input
                type="range"
                min="2000"
                max="50000"
                step="500"
                className="w-full accent-brand-700"
                value={grossIncome}
                onChange={(e) => setGrossIncome(Number(e.target.value))}
              />
              <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
                <span>$2k</span>
                <span className="font-semibold text-slate-950">{formatCurrency(grossIncome)}/mo</span>
                <span>$50k</span>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <label className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
                <CreditCard className="h-4 w-4 text-slate-400" /> Monthly Debt Payments
              </label>
              <input
                type="range"
                min="0"
                max="5000"
                step="50"
                className="w-full accent-brand-700"
                value={monthlyDebts}
                onChange={(e) => setMonthlyDebts(Number(e.target.value))}
              />
              <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
                <span>$0</span>
                <span className="font-semibold text-slate-950">{formatCurrency(monthlyDebts)}/mo</span>
                <span>$5k</span>
              </div>
              <p className="mt-2 text-xs text-slate-400">Car loans, student loans, credit cards — exclude current housing</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <label className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
                <DollarSign className="h-4 w-4 text-slate-400" /> Down Payment
              </label>
              <input
                type="range"
                min="0"
                max="500000"
                step="5000"
                className="w-full accent-brand-700"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
              />
              <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
                <span>$0</span>
                <span className="font-semibold text-slate-950">{formatCurrency(downPayment)}</span>
                <span>$500k</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <label className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <Percent className="h-4 w-4 text-slate-400" /> Interest Rate
                </label>
                <input
                  type="range"
                  min="2"
                  max="12"
                  step="0.125"
                  className="w-full accent-brand-700"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                />
                <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
                  <span>2%</span>
                  <span className="font-semibold text-slate-950">{rate.toFixed(3)}%</span>
                  <span>12%</span>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">Loan Term</label>
                <div className="grid grid-cols-1 gap-2">
                  {[15, 20, 30].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTerm(t)}
                      className={`rounded-xl border px-3 py-2 text-sm font-semibold transition-colors ${
                        term === t
                          ? "border-brand-900 bg-brand-900 text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-brand-50"
                      }`}
                    >
                      {t} years
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(16,34,68,0.08)]">
              <div className="rounded-[24px] bg-brand-50 p-6">
                <p className="section-kicker">Max home price</p>
                <p className="mt-4 text-5xl text-slate-950">{formatCurrency(maxHomePrice)}</p>
              </div>

              <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Max loan amount</span>
                  <span className="font-semibold text-slate-950">{formatCurrency(maxLoan)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Est. monthly payment</span>
                  <span className="font-semibold text-slate-950">{formatCurrency(estimatedPayment)}/mo</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Max housing (28% front)</span>
                  <span className="font-semibold text-slate-950">{formatCurrency(maxHousingFrontEnd)}/mo</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">DTI ratio</span>
                  <span className={`font-semibold ${dti <= 43 ? "text-emerald-700" : "text-red-600"}`}>
                    {dti.toFixed(1)}% {dti <= 36 ? "✓ Excellent" : dti <= 43 ? "✓ Acceptable" : "⚠ High"}
                  </span>
                </div>
              </div>

              <Link
                to="/rates/mortgage"
                className="button-primary mt-6 w-full justify-center"
              >
                Compare mortgage rates <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="rounded-2xl bg-brand-900 p-5 text-white text-sm">
              <p className="font-bold text-white mb-1">28/36 Rule</p>
              <p className="text-brand-200 text-xs leading-relaxed">
                Lenders generally want housing costs ≤ 28% of gross income and total debts ≤ 36–43%. Higher credit scores can unlock the upper end.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
        <p className="section-kicker">Sponsored partners</p>
        <h3 className="mt-2 text-xl font-display font-bold text-slate-900">Pre-qualify with top mortgage lenders</h3>
        <p className="mt-1 text-sm text-slate-500">Pre-qualifying won't hurt your credit score. Most lenders respond in under 3 minutes.</p>
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
                Pre-qualify free <ArrowRight className="h-3 w-3" />
              </span>
            </a>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-400">
          Advertiser disclosure: FindMeRates may earn compensation when you click partner links. Rates shown are for illustration only.
        </p>
      </div>
    </div>
  );
}
