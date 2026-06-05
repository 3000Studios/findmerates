import React, { useState } from "react";
import { ArrowRight, DollarSign, ShieldCheck, Home } from "lucide-react";
import { formatCurrency } from "../../lib/utils";

const COVERAGE_TYPES = [
  { id: "basic", label: "Basic", multiplier: 0.004, desc: "Dwelling only, minimal liability" },
  { id: "standard", label: "Standard", multiplier: 0.007, desc: "Dwelling + personal property + liability" },
  { id: "premium", label: "Premium", multiplier: 0.012, desc: "Full replacement cost + umbrella liability" },
];

const STATE_FACTORS: Record<string, number> = {
  FL: 1.9, TX: 1.6, LA: 1.7, OK: 1.5, KS: 1.4, MS: 1.5,
  AL: 1.3, MO: 1.3, AR: 1.3, TN: 1.2, GA: 1.1, SC: 1.1,
  NC: 1.0, VA: 1.0, CA: 1.1, NY: 1.3, NJ: 1.2, MA: 1.2,
  IL: 0.9, OH: 0.9, PA: 0.9, MI: 1.0, WI: 0.9, MN: 0.9,
  CO: 1.1, AZ: 1.0, WA: 0.9, OR: 0.9, ID: 0.8, MT: 0.8,
};

const STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
];

const PARTNERS = [
  { name: "Lemonade", desc: "AI-powered renters & homeowners insurance. Quote in 90 seconds.", badge: "Instant Quote", url: "https://www.lemonade.com/homeowners" },
  { name: "Policygenius", desc: "Compare quotes from 10+ insurers side by side.", badge: "Compare All", url: "https://www.policygenius.com/homeowners-insurance/" },
  { name: "Hippo Insurance", desc: "Modern home insurance with proactive protection features.", badge: "Modern Coverage", url: "https://www.hippo.com/" },
];

export default function InsuranceEstimator() {
  const [homeValue, setHomeValue] = useState(350000);
  const [state, setState] = useState("TX");
  const [coverage, setCoverage] = useState("standard");

  const coverageType = COVERAGE_TYPES.find((c) => c.id === coverage) || COVERAGE_TYPES[1];
  const stateFactor = STATE_FACTORS[state] ?? 1.0;
  const annualEstimate = homeValue * coverageType.multiplier * stateFactor;
  const monthlyEstimate = annualEstimate / 12;
  const lowEstimate = annualEstimate * 0.75;
  const highEstimate = annualEstimate * 1.35;

  return (
    <div className="space-y-6">
      <div className="card overflow-hidden">
        <div className="bg-brand-900 p-6 text-white md:p-8">
          <div className="section-kicker text-brand-200">Calculator</div>
          <h2 className="mt-3 flex items-center gap-3 text-3xl text-white">
            <ShieldCheck className="h-6 w-6" />
            Insurance Estimator
          </h2>
          <p className="mt-3 max-w-2xl text-brand-100">
            Get a rough monthly homeowners insurance estimate based on your home value, state, and coverage level. Compare quotes before you buy.
          </p>
        </div>

        <div className="grid gap-8 p-6 md:p-8 xl:grid-cols-[1fr_0.9fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <label className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
                <Home className="h-4 w-4 text-slate-400" /> Home Value / Replacement Cost
              </label>
              <input
                type="range"
                min="100000"
                max="2000000"
                step="25000"
                className="w-full accent-brand-700"
                value={homeValue}
                onChange={(e) => setHomeValue(Number(e.target.value))}
              />
              <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
                <span>$100k</span>
                <span className="font-semibold text-slate-950">{formatCurrency(homeValue)}</span>
                <span>$2M</span>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <label className="mb-4 block text-sm font-semibold text-slate-800">State</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-300"
              >
                {STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {(STATE_FACTORS[state] ?? 1) > 1.4 && (
                <p className="mt-2 text-xs text-amber-600">
                  ⚠ {state} has above-average insurance costs due to weather risk. Expect higher premiums.
                </p>
              )}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <label className="mb-4 block text-sm font-semibold text-slate-800">Coverage Level</label>
              <div className="space-y-3">
                {COVERAGE_TYPES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCoverage(c.id)}
                    className={`w-full flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition-all ${
                      coverage === c.id
                        ? "border-brand-900 bg-brand-900 text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:border-brand-200 hover:bg-brand-50"
                    }`}
                  >
                    <div>
                      <span className="font-semibold">{c.label}</span>
                      <p className={`text-xs mt-0.5 ${coverage === c.id ? "text-brand-200" : "text-slate-400"}`}>{c.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(16,34,68,0.08)]">
              <div className="rounded-[24px] bg-brand-50 p-6">
                <p className="section-kicker">Est. monthly premium</p>
                <p className="mt-4 text-5xl text-slate-950">{formatCurrency(monthlyEstimate)}</p>
                <p className="mt-2 text-sm text-slate-500">Rough estimate — compare quotes for exact pricing</p>
              </div>

              <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Annual estimate</span>
                  <span className="font-semibold text-slate-950">{formatCurrency(annualEstimate)}/yr</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Typical range</span>
                  <span className="font-semibold text-slate-950">
                    {formatCurrency(lowEstimate / 12)} – {formatCurrency(highEstimate / 12)}/mo
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Coverage level</span>
                  <span className="font-semibold text-slate-950 capitalize">{coverage}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">State risk factor</span>
                  <span className={`font-semibold ${stateFactor > 1.3 ? "text-amber-600" : "text-emerald-700"}`}>
                    {stateFactor > 1.3 ? "High risk" : stateFactor > 1.0 ? "Moderate" : "Low risk"}
                  </span>
                </div>
              </div>

              <a
                href="https://www.policygenius.com/homeowners-insurance/"
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="button-primary mt-6 w-full justify-center flex items-center gap-2"
              >
                Compare real quotes now <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-800 leading-relaxed">
              <strong>Disclaimer:</strong> This is a rough estimate using national averages and state risk factors. Actual premiums depend on your home's age, construction, claims history, credit score, deductible, and insurer. Always compare at least 3 quotes.
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
        <p className="section-kicker">Sponsored partners</p>
        <h3 className="mt-2 text-xl font-display font-bold text-slate-900">Compare homeowners insurance quotes</h3>
        <p className="mt-1 text-sm text-slate-500">Most quotes are free and take under 2 minutes. Comparing saves an average of $600/year.</p>
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
                Get free quote <ArrowRight className="h-3 w-3" />
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
