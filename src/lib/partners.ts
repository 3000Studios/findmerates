import { RateCategory } from "../types";

export type PartnerOffer = {
  id: string;
  name: string;
  description: string;
  url: string;
  badge?: string;
  sponsored?: boolean;
};

function parseOffers(value: string | undefined): PartnerOffer[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as PartnerOffer[];
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
}

function envKeyForCategory(category: RateCategory): string {
  switch (category) {
    case RateCategory.MORTGAGE: return "VITE_PARTNER_OFFERS_MORTGAGE";
    case RateCategory.CD: return "VITE_PARTNER_OFFERS_CD";
    case RateCategory.AUTO_LOAN: return "VITE_PARTNER_OFFERS_AUTO_LOAN";
    case RateCategory.PERSONAL_LOAN: return "VITE_PARTNER_OFFERS_PERSONAL_LOAN";
    case RateCategory.REFINANCE: return "VITE_PARTNER_OFFERS_REFINANCE";
    case RateCategory.SAVINGS: return "VITE_PARTNER_OFFERS_SAVINGS";
    default: return "";
  }
}

const DEFAULT_OFFERS: Record<string, PartnerOffer[]> = {
  [RateCategory.MORTGAGE]: [
    { id: "d-mort-rocket", name: "Rocket Mortgage", description: "Get a custom mortgage quote in minutes from a top-rated national lender.", url: "https://www.rocketmortgage.com/", badge: "Popular", sponsored: false },
    { id: "d-mort-better", name: "Better Mortgage", description: "No commissions, no lender fees. Get a free online rate quote.", url: "https://better.com/", badge: "No Fees", sponsored: false },
    { id: "d-mort-sofi", name: "SoFi Home Loans", description: "Member-friendly mortgages with competitive rates and fast closing.", url: "https://www.sofi.com/home-loans/mortgage/", sponsored: false }
  ],
  [RateCategory.CD]: [
    { id: "d-cd-marcus", name: "Marcus by Goldman Sachs", description: "High-yield CDs with terms from 6 months to 6 years and no fees.", url: "https://www.marcus.com/us/en/savings/high-yield-cd", badge: "High Yield", sponsored: false },
    { id: "d-cd-ally", name: "Ally Bank", description: "No-penalty and high-yield CDs from a top online bank.", url: "https://www.ally.com/bank/cd-rates/", sponsored: false },
    { id: "d-cd-discover", name: "Discover Bank", description: "Competitive CD rates with terms up to 10 years and FDIC insurance.", url: "https://www.discover.com/online-banking/cd/", sponsored: false }
  ],
  [RateCategory.AUTO_LOAN]: [
    { id: "d-auto-ls", name: "LightStream", description: "Low APRs for excellent credit. New, used, and refinance auto loans.", url: "https://www.lightstream.com/auto-loans", badge: "Low APR", sponsored: false },
    { id: "d-auto-co", name: "Capital One Auto Navigator", description: "Pre-qualify with no impact to your credit score in minutes.", url: "https://www.capitalone.com/cars/", sponsored: false },
    { id: "d-auto-aa", name: "Auto Approve", description: "Compare auto refinance offers from multiple lenders in one place.", url: "https://autoapprove.com/", sponsored: false }
  ],
  [RateCategory.PERSONAL_LOAN]: [
    { id: "d-pers-sofi", name: "SoFi Personal Loans", description: "Fixed-rate personal loans up to $100,000 with no fees.", url: "https://www.sofi.com/personal-loans/", badge: "No Fees", sponsored: false },
    { id: "d-pers-ls", name: "LightStream", description: "Same-day funding and low rates for good-credit borrowers.", url: "https://www.lightstream.com/personal-loans", sponsored: false },
    { id: "d-pers-disc", name: "Discover Personal Loans", description: "Fixed rates, no origination fees, direct payment to creditors.", url: "https://www.discover.com/personal-loans/", sponsored: false }
  ],
  [RateCategory.REFINANCE]: [
    { id: "d-refi-better", name: "Better.com Refi", description: "Refinance with no commissions and no lender fees.", url: "https://better.com/refinance", sponsored: false },
    { id: "d-refi-rocket", name: "Rocket Mortgage Refi", description: "See how much you could save with a fast online refinance quote.", url: "https://www.rocketmortgage.com/refinance", sponsored: false }
  ],
  [RateCategory.SAVINGS]: [
    { id: "d-sav-marcus", name: "Marcus High-Yield Savings", description: "Competitive APY with no fees and no minimum deposit.", url: "https://www.marcus.com/us/en/savings/high-yield-savings", badge: "High APY", sponsored: false },
    { id: "d-sav-ally", name: "Ally Online Savings", description: "No monthly maintenance fees, daily compounding interest.", url: "https://www.ally.com/bank/online-savings-account/", sponsored: false }
  ]
};

export function getPartnerOffers(category: RateCategory): PartnerOffer[] {
  const key = envKeyForCategory(category);
  const fromEnv = key ? parseOffers((import.meta as any).env?.[key]) : [];
  if (fromEnv.length > 0) return fromEnv;
  return DEFAULT_OFFERS[category] || [];
}
