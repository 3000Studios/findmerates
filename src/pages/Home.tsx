import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Home as HomeIcon,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { motion } from "motion/react";
import MortgageCalculator from "../components/MortgageCalculator";
import BestOptionAnalyzer from "../components/BestOptionAnalyzer";
import PredictiveBriefing from "../components/PredictiveBriefing";
import { Story } from "../types";
import { fetchLatestFinancialNews } from "../services/intelligenceService";
import { playUiSound } from "../lib/sound";
import financialRatesVideo from "../components/video/financial rates.mp4";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [topStories, setTopStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      const news = await fetchLatestFinancialNews("general");
      setTopStories(news);
      setLoading(false);
    };
    loadNews();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/rates/mortgage?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const categories = [
    { id: "mortgage", name: "Mortgages", icon: HomeIcon, image: "photo-1560518883-ce09059eeffa" },
    { id: "cd", name: "CD Rates", icon: Wallet, image: "photo-1579621970563-ebec7560ff3e" },
    { id: "auto_loan", name: "Auto Loans", icon: BarChart3, image: "photo-1533473359331-0135ef1b58bf" },
    { id: "personal_loan", name: "Personal Loans", icon: BriefcaseBusiness, image: "photo-1554224155-6726b3ff858f" },
  ];

  return (
    <div className="overflow-hidden">
      <section className="relative">
        <div className="section-shell py-10 lg:py-16">
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative z-10"
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold text-brand-800 shadow-sm backdrop-blur">
                <Sparkles className="h-4 w-4" />
                Award-inspired financial clarity, built original
              </div>
              <h1 className="max-w-4xl text-5xl leading-[0.95] tracking-tight text-slate-950 md:text-7xl lg:text-[5.5rem]">
                Compare rates with a cleaner, calmer, more confident interface.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                A premium rate experience for mortgages, CDs, auto loans, and personal loans. Fast search, clearer actions, less noise.
              </p>

              <form onSubmit={handleSearch} className="mt-10 max-w-2xl">
                <div className="surface flex items-center gap-3 rounded-full px-4 py-3">
                  <Search className="ml-2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search a rate, term, or lender"
                    className="min-w-0 flex-1 bg-transparent py-2 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="submit" className="button-primary">
                    Search
                  </button>
                </div>
              </form>

              <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-600">
                <span className="rounded-full border border-slate-200 bg-white/75 px-4 py-2">Daily rate updates</span>
                <span className="rounded-full border border-slate-200 bg-white/75 px-4 py-2">AI briefing tools</span>
                <span className="rounded-full border border-slate-200 bg-white/75 px-4 py-2">Clear comparison cards</span>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/pro"
                  className="button-primary"
                  onMouseEnter={() => playUiSound("hover")}
                  onClickCapture={() => playUiSound("click")}
                >
                  Start Pro for $9.99
                </Link>
                <Link to="/guide" className="button-secondary" onMouseEnter={() => playUiSound("hover")}>
                  Read guide
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative"
            >
              <div className="card relative overflow-hidden p-6 lg:p-8">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(47,140,255,0.16),transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(200,163,90,0.14),transparent_35%)]" />
                <div className="relative space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="section-kicker">Today&apos;s Snapshot</span>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      +0.12% Avg improvement
                    </span>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl bg-brand-900 p-5 text-white">
                      <p className="text-sm text-brand-100">Best Mortgage</p>
                      <p className="mt-2 text-4xl font-semibold">6.24%</p>
                      <p className="mt-2 text-sm text-brand-100">30-year fixed, top-tier borrowers</p>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-white p-5">
                      <p className="text-sm text-slate-500">Best CD</p>
                      <p className="mt-2 text-4xl font-semibold text-slate-950">4.75%</p>
                      <p className="mt-2 text-sm text-slate-600">12-month term</p>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl border border-slate-200 bg-white p-5">
                      <p className="text-sm text-slate-500">Fastest Approval</p>
                      <p className="mt-2 text-xl font-semibold text-slate-950">Personal loan offers</p>
                      <p className="mt-2 text-sm text-slate-600">Pre-screened results in minutes</p>
                    </div>
                    <div className="rounded-3xl bg-brand-50 p-5 text-brand-900">
                      <p className="text-sm font-semibold">Pro intelligence</p>
                      <p className="mt-2 text-xl font-semibold">Actionable briefs and scenario tools</p>
                      <Link to="/pro" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">
                        Explore Pro <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-shell py-8 lg:py-14">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group overflow-hidden rounded-[28px] border border-white/70 bg-white/80 shadow-[0_18px_50px_rgba(16,34,68,0.08)]"
            >
              <div
                className="h-60 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.04]"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(16,34,68,0.12), rgba(16,34,68,0.62)), url(https://images.unsplash.com/${cat.image}?auto=format&fit=crop&q=80&w=900)`,
                }}
              />
              <div className="p-6">
                <cat.icon className="h-5 w-5 text-brand-700" />
                <h3 className="mt-4 text-2xl text-slate-950">{cat.name}</h3>
                <Link
                  to={`/rates/${cat.id}`}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-800"
                >
                  Explore <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section-shell py-8 lg:py-14">
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="card overflow-hidden bg-brand-900 text-white">
            <div className="grid gap-0 md:grid-cols-2">
              <div className="p-8 md:p-10">
                <div className="section-kicker text-brand-200">Immersive rates</div>
                <h2 className="mt-3 text-4xl text-white">Video-first rate insights.</h2>
                <p className="mt-4 text-brand-100">
                  Watch the market, click to explore, and jump between tools without leaving the page.
                </p>
                <div className="mt-6 flex gap-3">
                  <Link to="/stories" className="button-secondary border-white/10 bg-white text-brand-900" onMouseEnter={() => playUiSound("hover")}>
                    View stories
                  </Link>
                </div>
              </div>
              <div className="min-h-72 bg-[radial-gradient(circle_at_top_left,rgba(200,163,90,0.35),transparent_35%),linear-gradient(135deg,#102244,#184fb4)] p-8">
                <video
                  className="h-full w-full rounded-[24px] object-cover shadow-2xl"
                  src={financialRatesVideo}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              </div>
            </div>
          </div>

          <div className="card p-8">
            <div className="section-kicker">Pro perks</div>
            <h2 className="mt-3 text-3xl text-slate-950">More useful, more interactive.</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                "Priority briefing tools",
                "Rate alerts and scenario runs",
                "6 month special pricing",
                "Direct subscription access",
              ].map((item) => (
                <div key={item} className="rounded-3xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                  {item}
                </div>
              ))}
            </div>
            <Link to="/pro" className="button-primary mt-6 w-full" onClickCapture={() => playUiSound("click")}>
              Go to subscription
            </Link>
          </div>
        </div>
      </section>

      <section className="section-shell py-8 lg:py-14">
        <div className="grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <MortgageCalculator />
          </div>
          <div className="grid gap-4 lg:col-span-4">
            <BestOptionAnalyzer />
            <PredictiveBriefing />
          </div>
        </div>
      </section>

      <section className="section-shell py-8 lg:py-14">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <div className="section-kicker">Market briefing</div>
            <h2 className="mt-3 text-4xl text-slate-950 md:text-6xl">Recent stories, without the clutter.</h2>
          </div>
          <Link to="/stories" className="hidden items-center gap-2 text-sm font-semibold text-brand-800 md:inline-flex">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="card p-10 text-center text-slate-500">Loading stories...</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {topStories.map((story, i) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <Link to={`/stories/${story.slug}`} className="card group block p-6 transition-transform hover:-translate-y-1">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">
                    <ShieldCheck className="h-4 w-4" />
                    {new Date(story.publishedAt).toLocaleDateString()}
                  </div>
                  <h3 className="mt-5 text-2xl leading-tight text-slate-950 group-hover:text-brand-800">
                    {story.title}
                  </h3>
                  <p className="mt-4 line-clamp-3 text-sm leading-7 text-slate-600">
                    {story.excerpt}
                  </p>
                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-800">
                    Read story <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <section className="section-shell py-8 lg:py-14">
        <div className="card flex flex-col gap-8 bg-brand-900 px-6 py-10 text-white md:flex-row md:items-center md:justify-between md:px-10">
          <div>
            <div className="section-kicker text-brand-200">Premium access</div>
            <h2 className="mt-3 text-3xl md:text-5xl">Unlock the sharper tools.</h2>
            <p className="mt-4 max-w-2xl text-brand-100">
              Pro brings deeper analysis, clearer briefing flows, and a stronger decision layer for active rate shoppers.
            </p>
          </div>
          <Link to="/pro" className="button-secondary border-white/15 bg-white text-brand-900">
            Initialize Pro
          </Link>
        </div>
      </section>
    </div>
  );
}
