import React from "react";
import { ExternalLink, Sparkles } from "lucide-react";
import { RateCategory } from "../types";
import { getPartnerOffers } from "../lib/partners";
import { trackEvent } from "../lib/analytics";

const CATEGORY_LABEL: Record<string, string> = {
  [RateCategory.MORTGAGE]: "Mortgage",
  [RateCategory.CD]: "CD",
  [RateCategory.AUTO_LOAN]: "Auto Loan",
  [RateCategory.PERSONAL_LOAN]: "Personal Loan",
};

export default function PartnerOffers({ category }: { category: RateCategory }) {
  const offers = getPartnerOffers(category);
  if (!offers.length) return null;

  const label = CATEGORY_LABEL[category] || "Rate";

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="section-kicker">Partner offers</p>
          <h2 className="mt-2 text-xl font-display font-bold text-slate-950">
            Top {label} picks
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Sponsored offers from partners. Offer availability varies by profile.
          </p>
        </div>
        <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-800">
          <Sparkles className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {offers.slice(0, 5).map((offer) => (
          <a
            key={offer.id}
            href={offer.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackEvent("outbound_click", {
                kind: "partner_offer",
                category,
                offerId: offer.id,
                partner: offer.name,
                url: offer.url,
              })
            }
            className="group rounded-3xl border border-slate-200 bg-white/80 p-5 transition-all hover:-translate-y-0.5 hover:border-brand-200"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-950">{offer.name}</p>
                <p className="mt-2 text-xs leading-5 text-slate-600">{offer.description}</p>
              </div>
              <ExternalLink className="h-4 w-4 text-slate-400 transition-colors group-hover:text-brand-700" />
            </div>
            {offer.badge && (
              <div className="mt-4 inline-flex rounded-full bg-brand-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-700">
                {offer.badge}
              </div>
            )}
          </a>
        ))}
      </div>

      <p className="mt-6 text-xs text-slate-500">
        We may earn compensation when you click partner links. This does not affect
        your rate or eligibility.
      </p>
    </div>
  );
}

