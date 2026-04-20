import { RateCategory } from "../types";

export type PartnerOffer = {
  id: string;
  name: string;
  description: string;
  url: string;
  badge?: string;
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

function envKeyForCategory(category: RateCategory) {
  switch (category) {
    case RateCategory.MORTGAGE:
      return "VITE_PARTNER_OFFERS_MORTGAGE";
    case RateCategory.CD:
      return "VITE_PARTNER_OFFERS_CD";
    case RateCategory.AUTO_LOAN:
      return "VITE_PARTNER_OFFERS_AUTO_LOAN";
    case RateCategory.PERSONAL_LOAN:
      return "VITE_PARTNER_OFFERS_PERSONAL_LOAN";
    default:
      return "";
  }
}

export function getPartnerOffers(category: RateCategory): PartnerOffer[] {
  const key = envKeyForCategory(category);
  if (!key) return [];
  return parseOffers((import.meta as any).env?.[key]);
}

