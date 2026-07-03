import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, BadgeDollarSign, BellRing, CheckCircle2, CircleGauge, ShieldCheck, Sparkles, Target } from "lucide-react";
import { motion } from "motion/react";
import LeadCaptureForm from "../components/LeadCaptureForm";
import PartnerOffers from "../components/PartnerOffers";
import RateAlertForm from "../components/RateAlertForm";
import BestOptionAnalyzer from "../components/BestOptionAnalyzer";
import { RateCategory } from "../types";
import { playUiSound } from "../lib/sound";

const categoryCards = [
  {
    id: "mortgage",
    title: "Mortgage",
    body: "Surface better purchase and refinance paths before borrowers lock the wrong rate.",
  },
  {
    id: "cd",
    title: "CD Rates",
    body: "Push savings shoppers toward stronger yield offers with less noise.",
  },
  {
    id: "auto_loan",
    title: "Auto Loan",
    body: "Route buyers to lower payment options and cleaner monthly math.",
  },
  {
    id: "personal_loan",
    title: "Personal Loan",
    body: "Capture urgent demand with fast, high-intent comparison traffic.",
  },
] as const;

const revenueMoves = [
  {
    icon: Target,
    title: "High-intent comparison traffic",
    body: "Send users from the homepage into category pages with a clear task and one click.",
  },
  {
    icon: BellRing,
    title: "Email and alert capture",
    body: "Collect leads for rate drops, new matches, and follow-up conversion.",
  },
  {
    icon: BadgeDollarSign,
    title: "Sponsored partner offers",
    body: "Show direct lender links where users are already ready to act.",
  },
  {
    icon: CircleGauge,
    title: "Pro subscription upsell",
    body: "Use premium alerts and analysis to monetize repeat shoppers.",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<(typeof categoryCards)[number]["id"]>("mortgage");

  useEffect(() => {
    document.title = "FindMeRates.com | Compare rates, capture leads, convert traffic";
  }, []);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/rates/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="overflow-hidden">
      <section className="section-shell py-10 lg:py-16">
        <div className="grid items-start gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-800">
              <Sparkles className="h-4 w-4" />
              Built to convert search traffic into leads, offers, and subscriptions.
            </div>

            <div className="space-y-5">
              <p className="section-kicker">Revenue-first rate hub</p>
              <h1 className="max-w-3xl text-5xl leading-[0.94] tracking-tight text-slate-950 md:text-7xl lg:text-[5.2rem]">
                Turn rate shoppers into clicks, leads, and paid members.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                FindMeRates is now focused on one job: route each visitor to the highest-value next step, whether that is a partner offer, a lead form, or Pro access.
              </p>
            </div>

            <form onSubmit={submitSearch} className="card p-4 sm:p-5">
              <label className="block text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                Search intent
              </label>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="mortgage, refinance, CD, auto loan, personal loan"
                  className="min-h-12 flex-1 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-brand-300"
                />
                <button type="submit" className="button-primary">
                  Compare now <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1">Fast lead routing</span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1">Affiliate ready</span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1">Email capture</span>
              </div>
            </form>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {revenueMoves.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                  className="card p-5"
                >
                  <item.icon className="h-5 w-5 text-brand-700" />
                  <h2 className="mt-4 text-lg text-slate-950">{item.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.body}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="space-y-4"
          >
            <div className="card overflow-hidden bg-brand-900 text-white">
              <div className="border-b border-white/10 p-6">
                <p className="section-kicker text-brand-100">Primary conversion path</p>
                <h2 className="mt-3 text-3xl text-white">Start with one goal. Route to the best monetized action.</h2>
                <p className="mt-3 text-sm leading-7 text-brand-100/80">
                  No clutter. Just the shortest path from intent to click, lead, or subscription.
                </p>
              </div>
              <div className="grid gap-3 p-6 sm:grid-cols-2">
                {categoryCards.map((card) => (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => setSelectedCategory(card.id)}
                    className={`rounded-3xl border p-4 text-left transition-colors ${
                      selectedCategory === card.id
                        ? "border-white bg-white text-brand-900"
                        : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                    }`}
                  >
                    <div className="text-sm font-semibold">{card.title}</div>
                    <p className="mt-2 text-sm leading-6 opacity-85">{card.body}</p>
                  </button>
                ))}
              </div>
              <div className="border-t border-white/10 p-6">
                <Link
                  to={`/rates/${selectedCategory}`}
                  className="button-primary w-full justify-center bg-white text-brand-900 hover:bg-brand-50"
                  onMouseEnter={() => playUiSound("hover")}
                  onClickCapture={() => playUiSound("click")}
                >
                  Open {categoryCards.find((card) => card.id === selectedCategory)?.title} funnel
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-1 h-5 w-5 text-emerald-600" />
                <div>
                  <h2 className="text-xl text-slate-950">Trust layer</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Every monetization path still needs disclosures, consent, and clear routing. This redesign keeps those controls visible instead of burying them.
                  </p>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      </section>

      <section className="section-shell py-8 lg:py-14">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr]">
          <div className="space-y-6">
            <div className="card p-6">
              <p className="section-kicker">Monetization stack</p>
              <h2 className="mt-3 text-3xl text-slate-950">Use multiple revenue paths without looking desperate.</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                The site now pushes users into three clean outcomes: compare rates, request follow-up, or upgrade to Pro.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/pro" className="button-primary" onMouseEnter={() => playUiSound("hover")}>
                  View Pro pricing <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/calculators" className="button-secondary" onMouseEnter={() => playUiSound("hover")}>
                  Open calculators
                </Link>
              </div>
            </div>
            <RateAlertForm />
          </div>

          <LeadCaptureForm category={selectedCategory as RateCategory} />
        </div>
      </section>

      <section className="section-shell py-8 lg:py-14">
        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <PartnerOffers category={selectedCategory as RateCategory} />
          <div className="card p-6">
            <p className="section-kicker">Decision engine</p>
            <h2 className="mt-3 text-3xl text-slate-950">Use the analyzer to direct higher-intent users faster.</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              This remains the site&apos;s guided upsell: it helps users pick a path, then moves them into the right conversion surface.
            </p>
            <div className="mt-6">
              <BestOptionAnalyzer />
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell py-8 lg:py-14">
        <div className="card overflow-hidden bg-slate-950 px-6 py-10 text-white md:px-10">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="section-kicker text-brand-100">Pro</p>
              <h2 className="mt-3 text-3xl text-white md:text-5xl">Premium alerts, sharper analysis, better conversion value.</h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                Pro is where repeat visitors convert. Keep the freemium layer thin, then offer alerts and analysis to users who keep shopping.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/pro" className="button-primary bg-white text-brand-900 hover:bg-brand-50">
                  Explore Pro <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/how-we-make-money" className="button-secondary border-white/10 bg-white/5 text-white hover:bg-white/10">
                  Read disclosures
                </Link>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "Rate alerts when benchmarks move",
                "Cleaner decision flow for shoppers",
                "Sponsored partner routing",
                "Lead capture for high intent traffic",
              ].map((item) => (
                <div key={item} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  <p className="mt-4 text-sm leading-7 text-slate-200">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
