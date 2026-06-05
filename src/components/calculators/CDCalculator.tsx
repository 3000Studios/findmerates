import React, { useState } from "react";
import { ArrowRight, DollarSign, Percent, Calendar, TrendingUp } from "lucide-react";
import { formatCurrency } from "../../lib/utils";
import { Link } from "react-router-dom";

const TERMS = [
  { label: "3 mo", months: 3 },
  { label: "6 mo", months: 6 },
  { label: "12 mo", months: 12 },
  { label: "24 mo", months: 24 },
  { label: "36 mo", months: 36 },
  { label: "60 mo", months: 60 },
];

const PARTNERS = [
  { name: "Marcus by Goldman Sachs", apy: "4.75%", badge: "High Yield", url: "https://www.marcus.com/us/en/savings/high-yield-cd" },
  { name: "Ally Bank", apy: "4.65%", badge: "No Penalty Option", url: "https://www.ally.com/bank/cd-rates/" },
  { name: "Discover Bank", apy: "4.60%", badge: "FDIC Insured", url: "https://www.discover.com/online-banking/cd/" },
];

export default function CDCalculator() {
  const [principal, setPrincipal] = useState(10000);
  const [apy, setApy] = useState(4.75);
  const [termMonths, setTermMonths] = useState(12);

  const termYears = termMonths / 12;
  const rate = apy / 100;
  const n = 12;
  const futureValue = principal * Math.pow(1 + rate / n, n * termYears);
  const totalInterest = futureValue - principal;

  return (
    <div className="space-y-6">
      <div className="card overflow-hidden">
        <div className="bg-brand-900 p-6 text-white md:p-8">
          <div className="section-kicker text-brand-200">Calculator</div>
          <h2 className="mt-3 flex items-center gap-3 text-3xl text-white">
            <TrendingUp className="h-6 w-6" />
            CD Calculator
          </h2>
          <p className="mt-3 max-w-2xl text-brand-100">
            See exactly how much your certificate of deposit will earn at maturity.
          </p>
        </div>

        <div className="grid gap-8 p-6 md:p-8 xl:grid-cols-[1fr_0.9fr]">
          <div className="space-y-8">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <label className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
                <DollarSign className="h-4 w-4 text-slate-400" /> Deposit Amount
              </label>
              <input
                type="range"
                min="500"
                max="250000"
                step="500"
                className="w-full accent-brand-700"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
              />
              <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
                <span>$500</span>
                <span className="font-semibold text-slate-950">{formatCurrency(principal)}</span>
                <span>$250k</span>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <label className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
                <Percent className="h-4 w-4 text-slate-400" /> Annual APY
              </label>
              <input
                type="range"
                min="0.5"
                max="6"
                step="0.05"
                className="w-full accent-brand-700"
                value={apy}
                onChange={(e) => setApy(Number(e.target.value))}
              />
              <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
                <span>0.5%</span>
                <span className="font-semibold text-slate-950">{apy.toFixed(2)}% APY</span>
                <span>6%</span>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <label className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
                <Calendar className="h-4 w-4 text-slate-400" /> Term
              </label>
              <div className="grid grid-cols-3 gap-3">
                {TERMS.map((t) => (
                  <button
                    key={t.months}
                    onClick={() => setTermMonths(t.months)}
                    className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors ${
                      termMonths === t.months
                        ? "border-brand-900 bg-brand-900 text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:border-brand-200 hover:bg-brand-50"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(16,34,68,0.08)] md:p-8">
            <div className="rounded-[24px] bg-brand-50 p-6">
              <p className="section-kicker">At maturity</p>
              <p className="mt-4 text-5xl text-slate-950 md:text-6xl">{formatCurrency(futureValue)}</p>
              <p className="mt-2 text-sm text-slate-500">After {termMonths} months</p>
            </div>

            <div className="mt-6 space-y-4 border-t border-slate-100 pt-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Initial Deposit</span>
                <span className="font-semibold text-slate-950">{formatCurrency(principal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Interest Earned</span>
                <span className="font-semibold text-emerald-600">+{formatCurrency(totalInterest)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Effective APY</span>
                <span className="font-semibold text-slate-950">{apy.toFixed(2)}%</span>
              </div>
            </div>

            <Link
              to="/rates/cd"
              className="button-primary mt-8 w-full justify-center"
            >
              Compare today's best CD rates <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
        <p className="section-kicker">Sponsored partners</p>
        <h3 className="mt-2 text-xl font-display font-bold text-slate-900">Open a CD with today's best rates</h3>
        <p className="mt-1 text-sm text-slate-500">These partners are FDIC-insured and offer competitive APYs matching or near your estimated rate.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {PARTNERS.map((p) => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="group flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-all hover:border-brand-300 hover:bg-brand-50 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-brand-600">{p.badge}</span>
              </div>
              <p className="font-bold text-slate-900 group-hover:text-brand-800">{p.name}</p>
              <p className="text-2xl font-display font-bold text-brand-700">{p.apy} APY</p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700">
                Open account <ArrowRight className="h-3 w-3" />
              </span>
            </a>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-400">
          Advertiser disclosure: FindMeRates may earn compensation when you click partner links. Rates shown are illustrative; verify current rates with the lender.
        </p>
      </div>
    </div>
  );
}
