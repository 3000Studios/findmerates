import React from "react";
import Markdown from "react-markdown";
import { BookOpen, Download, ShieldCheck, Sparkles, PlayCircle, Radar } from "lucide-react";
import { Link } from "react-router-dom";
import AdSenseSlot from "../components/AdSenseSlot";
import { AD_CLIENT, AD_SLOTS } from "../lib/ad-config";

const guideContent = `
# Rate Finder Guide
## Practical steps for comparing rates with confidence

### 1. Compare the full cost
Look at the rate, fees, points, term, and repayment rules together. The lowest headline rate is not always the cheapest option.

### 2. Match the product to the use case
Choose a loan or deposit product based on purpose, timeline, and flexibility. A good fit matters more than a small rate difference.

### 3. Check the timing
Rates can move with market conditions. If you are rate shopping, compare offers close together so the numbers are easier to trust.

### 4. Confirm the details
Ask the lender to confirm any assumptions in writing, including credit-score ranges, down payment, and account requirements.

### 5. Use comparison tools
Run the same scenario across multiple providers so you can compare apples to apples.

### 6. Re-run the search
If the market moved, refresh your search and compare the newest result set before you lock anything in.
`;

export default function Guide() {
  return (
    <div className="section-shell py-12">
      <div className="card overflow-hidden">
        <div className="relative overflow-hidden bg-brand-900 p-6 text-white md:p-10">
          <div className="absolute right-0 top-0 p-8 opacity-10">
            <BookOpen className="h-40 w-40" />
          </div>
          <div className="relative z-10 max-w-3xl">
            <div className="section-kicker text-brand-200">Guide</div>
            <h1 className="mt-4 text-4xl text-white md:text-6xl">A clearer guide to rate shopping.</h1>
            <p className="mt-4 text-base leading-7 text-brand-100 md:text-lg">
              Straightforward advice for comparing financial products without the hype.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => window.print()} className="button-secondary border-white/15 bg-white text-brand-900">
                <Download className="h-4 w-4" />
                Print guide
              </button>
              <Link to="/pro-guide" className="button-primary bg-white text-brand-900">
                <Sparkles className="h-4 w-4" />
                Pro guide
              </Link>
              <Link to="/rates/search" className="button-secondary border-white/15 bg-brand-900 text-white">
                <PlayCircle className="h-4 w-4" />
                Live search
              </Link>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-3 text-xs font-semibold text-brand-100">
                <ShieldCheck className="h-4 w-4" />
                Informational only, not financial advice
              </span>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                ["Best rate scanner", "Compare the latest offers fast"],
                ["Guided actions", "Use the next-best step for each product"],
                ["Mobile friendly", "Short sections and tap targets"],
              ].map(([title, desc]) => (
                <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="mt-1 text-xs leading-6 text-brand-100">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-8 p-8 md:p-12 lg:grid-cols-[1fr_320px]">
          <article className="prose prose-slate max-w-none prose-headings:font-display prose-headings:text-slate-950 prose-h2:border-b prose-h2:border-slate-200 prose-h2:pb-2">
            <Markdown>{guideContent}</Markdown>
          </article>

          <aside className="space-y-4">
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
              <p className="section-kicker">Quick links</p>
              <div className="mt-4 space-y-3 text-sm font-medium">
                <Link to="/rates/mortgage" className="block text-brand-800 hover:text-brand-900">
                  Mortgage rates
                </Link>
                <Link to="/rates/cd" className="block text-brand-800 hover:text-brand-900">
                  CD rates
                </Link>
                <Link to="/calculators" className="block text-brand-800 hover:text-brand-900">
                  Calculators
                </Link>
                <Link to="/stories" className="block text-brand-800 hover:text-brand-900">
                  Market news
                </Link>
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
              <p className="section-kicker">What to watch</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Focus on total cost, not just the advertised rate. Small fee differences can outweigh a headline rate discount.
              </p>
            </div>

            <div className="rounded-[24px] border border-brand-200 bg-brand-50 p-5">
              <p className="section-kicker">Fast action</p>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                Use the live search flow to compare products and jump straight into the calculator from mobile.
              </p>
              <Link to="/rates/search" className="button-primary mt-4 w-full">
                <Radar className="h-4 w-4" />
                Search now
              </Link>
            </div>
          </aside>
        </div>

        <div className="border-t border-slate-200 px-8 py-8 md:px-12">
          <div className="ad-slot">
            <AdSenseSlot
              adClient={AD_CLIENT}
              adSlot={AD_SLOTS.guideContent.slotId}
              format={AD_SLOTS.guideContent.format}
              minHeight={250}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
