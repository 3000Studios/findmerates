import React from "react";
import { ExternalLink, Info, ShieldCheck } from "lucide-react";
import { RateResult } from "../types";
import { formatPercent } from "../lib/utils";
import { trackEvent } from "../lib/analytics";

export default function RateCard({ result }: { result: RateResult }) {
  return (
    <div className="card p-6 transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(16,34,68,0.12)] hover:border-brand-200">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
        <div className="lg:w-52">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
            <span className="text-sm font-semibold text-slate-500">{result.provider}</span>
          </div>
          <div className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            <ShieldCheck className="h-3 w-3" />
            FDIC insured
          </div>
        </div>

        <div className="grid flex-1 grid-cols-2 gap-4 lg:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Rate</p>
            <p className="mt-2 text-3xl text-slate-950">{formatPercent(result.rate)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">APR</p>
            <p className="mt-2 text-3xl text-slate-950">{formatPercent(result.apr || result.rate)}</p>
          </div>
          <div className="hidden lg:block">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Term</p>
            <p className="mt-2 text-lg font-medium text-slate-700">{result.term}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:w-52">
          <a
            href={result.ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="button-primary w-full"
            onClick={() =>
              trackEvent("outbound_click", {
                kind: "rate_card",
                category: result.category,
                provider: result.provider,
                url: result.ctaUrl,
              })
            }
          >
            Check rate <ExternalLink className="h-4 w-4" />
          </a>
          <a
            href={result.ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-900"
            onClick={() =>
              trackEvent("outbound_click", {
                kind: "rate_card_details",
                category: result.category,
                provider: result.provider,
                url: result.ctaUrl,
              })
            }
          >
            <Info className="h-4 w-4" />
            View lender details
          </a>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
        {result.details.map((detail, i) => (
          <span key={i} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
            {detail}
          </span>
        ))}
        <span className="ml-auto text-xs text-slate-400">
          Updated {new Date(result.lastUpdated).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
