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
import RateGuidedFlow from "../components/RateGuidedFlow";
import SlideOver from "../components/SlideOver";
import RateAlertForm from "../components/RateAlertForm";
import { Story } from "../types";
import { fetchLatestFinancialNews } from "../services/intelligenceService";
import { playUiSound } from "../lib/sound";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [topStories, setTopStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<null | { id: string; name: string }>(null);
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
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=2000"
            alt="Secure Home"
            className="h-full w-full object-cover opacity-20 brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-900/40 via-transparent to-slate-50" />
        </div>
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
                Stop overpaying — AI finds the margin lenders hide.
              </div>
              <h1 className="max-w-4xl text-5xl leading-[0.95] tracking-tight text-slate-950 md:text-7xl lg:text-[5.5rem]">
                Run an AI rate analysis in 60 seconds. Then compare live benchmarks.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                Start free. Get a personalized next-step recommendation. Upgrade only when you want pro alerts and deeper scenarios.
              </p>

              <div className="mt-10 max-w-2xl">
                <div className="card border-white/70 bg-white/80 p-5 shadow-[0_22px_70px_rgba(26,43,60,0.12)]">
                  <BestOptionAnalyzer />
                </div>
              </div>

              <div className="mt-6 max-w-2xl">
                <RateGuidedFlow />
              </div>

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
                  Join Pro ($9.99/mo)
                </Link>
                <Link to="/guide" className="button-secondary" onMouseEnter={() => playUiSound("hover")}>
                  Read guide
                </Link>
              </div>

              <div className="mt-12 pt-8 border-t border-slate-200/50">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">As seen on and trusted by</p>
                <div className="flex flex-wrap items-center gap-8 opacity-40 grayscale contrast-125">
                  <span className="text-xl font-display font-black tracking-tighter">FORBES</span>
                  <span className="text-xl font-display font-black tracking-tighter">BLOOMBERG</span>
                  <span className="text-xl font-display font-black tracking-tighter">REUTERS</span>
                  <span className="text-xl font-display font-black tracking-tighter">CNN BUSINESS</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative"
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="card relative overflow-hidden p-6 lg:p-8"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-brand-100/20 via-transparent to-accent-gold/10" />
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
              </motion.div>
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
              <div className="grid grid-cols-[42%_58%] md:block">
                <div
                  className="h-36 md:h-60 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.03]"
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(16,34,68,0.10), rgba(16,34,68,0.42)), url(https://images.unsplash.com/${cat.image}?auto=format&fit=crop&q=80&w=900)`,
                  }}
                />
                <div className="p-5 md:p-6">
                  <cat.icon className="h-5 w-5 text-brand-700" />
                  <h3 className="mt-3 text-xl md:text-2xl text-slate-950">{cat.name}</h3>
                  <p className="mt-2 text-sm text-slate-700">Live lender benchmarks and clearer comparisons.</p>
                  <button
                    onClick={() => setSelectedCategory({ id: cat.id, name: cat.name })}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-800 hover:text-brand-900"
                    onMouseEnter={() => playUiSound("hover")}
                    onClickCapture={() => playUiSound("click")}
                  >
                    Run AI analysis <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <SlideOver
        open={Boolean(selectedCategory)}
        title={selectedCategory ? `${selectedCategory.name} analysis` : "Analysis"}
        subtitle="Use the free AI analyzer once, then jump into live rate comparisons with one click."
        onClose={() => setSelectedCategory(null)}
        footer={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link
              to="/pro"
              className="button-secondary border-white/15 bg-white/5 text-white hover:bg-white/10"
              onClick={() => setSelectedCategory(null)}
            >
              Unlock Pro alerts
            </Link>
            <button
              onClick={() => {
                if (!selectedCategory) return;
                const id = selectedCategory.id;
                setSelectedCategory(null);
                navigate(`/rates/${id}`);
              }}
              className="button-primary"
            >
              Compare live rates <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        }
      >
        <div className="card border-white/15 bg-white/5 p-5 text-white">
          <p className="text-sm leading-7 text-brand-50">
            Pick your goal. Get a plain-English recommendation. Then click “Compare live rates” to view benchmark cards and take the next step.
          </p>
        </div>
        <div className="mt-5">
          <BestOptionAnalyzer />
        </div>
      </SlideOver>

      <section className="section-shell py-8 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="card overflow-hidden bg-brand-900 text-white">
            <div className="grid gap-0 md:grid-cols-2">
              <div className="p-8 md:p-10">
                <div className="section-kicker text-brand-100">Immersive rates</div>
                <h2 className="mt-3 text-4xl text-white">Market motion, in seconds.</h2>
                <p className="mt-4 text-brand-50">
                  Quick visuals to keep attention — then a single click to compare rates or read the latest market recap.
                </p>
                <div className="mt-6 flex gap-3">
                  <Link to="/stories" className="button-secondary border-white/10 bg-white text-brand-900" onMouseEnter={() => playUiSound("hover")}>
                    View stories
                  </Link>
                </div>
              </div>
              <div className="min-h-72 p-8">
                <img
                  src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=800"
                  alt="Financial Growth"
                  className="h-full w-full rounded-[24px] object-cover shadow-2xl brightness-75"
                />
              </div>
            </div>
          </div>

          <RateAlertForm />
        </div>
      </section>

      <section className="section-shell py-8 lg:py-14">
        <div className="grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <MortgageCalculator />
          </div>
          <div className="grid gap-4 lg:col-span-4">
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
            <div className="section-kicker text-brand-100">Premium access</div>
            <h2 className="mt-3 text-3xl md:text-5xl">Unlock the sharper tools.</h2>
            <p className="mt-4 max-w-2xl text-brand-50">
              Pro brings deeper analysis, clearer briefing flows, and a stronger decision layer for active rate shoppers.
            </p>
          </div>
          <Link to="/pro" className="button-secondary border-white/15 bg-white text-brand-900">
            Join Pro
          </Link>
        </div>
      </section>
    </div>
  );
}
