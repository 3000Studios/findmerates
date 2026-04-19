// FindMeRates.com - AdSense Configuration
// Publisher: ca-pub-5800977493749262
// All slot IDs below are real slots from the AdSense account.
// Replace any "REPLACE_WITH_REAL_SLOT_ID" values in the AdSense dashboard
// after creating the ad units there.

declare global {
interface Window {
  adsbygoogle: any[];
}
}

export const AD_CLIENT = 'ca-pub-5800977493749262';

function getSlotEnv(key: string): string {
  const value = (import.meta as any)?.env?.[key];
  return typeof value === 'string' ? value.trim() : '';
}

// Revenue optimization settings
export const AD_OPTIMIZATION = {
autoOptimize: true,
allowedPages: ['*'],
blockedPages: ['/privacy', '/terms', '/legal', '/disclaimer', '/cookies'],
maxAdsPerPage: 3,
minContentRatio: 0.6,
enableAnalytics: true,
} as const;

// Ad slot definitions
// NOTE: slotId values must match the ad units you create in your AdSense dashboard.
// Set these at deploy time (Cloudflare Pages env vars) so we never hardcode them in git.
// Format: "auto" lets Google pick the best format for the placement.
export const AD_SLOTS = {
// Top of page - leaderboard (728x90 desktop / 320x50 mobile)
topBanner: {
  slotId: getSlotEnv('VITE_AD_SLOT_TOP_BANNER'),
  format: 'horizontal' as const,
  placement: 'Top of page, above header',
  minHeight: 90,
  responsive: true,
},

// Sidebar sticky (desktop only) - 300x600 or 160x600
sidebar: {
  slotId: getSlotEnv('VITE_AD_SLOT_SIDEBAR'),
  format: 'auto' as const,
  placement: 'Right sidebar, sticky on scroll',
  minHeight: 600,
  responsive: true,
  sticky: true,
},

// Mid-content between rate cards
midContent: {
  slotId: getSlotEnv('VITE_AD_SLOT_MID_CONTENT'),
  format: 'auto' as const,
  placement: 'After 3-4 rate cards',
  minHeight: 90,
  responsive: true,
},

// Pre-footer leaderboard
footer: {
  slotId: getSlotEnv('VITE_AD_SLOT_FOOTER'),
  format: 'horizontal' as const,
  placement: 'Above footer',
  minHeight: 90,
  responsive: true,
},

// Mobile sticky bottom banner (mobile only)
mobileSticky: {
  slotId: getSlotEnv('VITE_AD_SLOT_MOBILE_STICKY'),
  format: 'auto' as const,
  placement: 'Sticky bottom on mobile',
  minHeight: 50,
  responsive: true,
  sticky: true,
},

// Rates page - above fold
ratesAboveFold: {
  slotId: getSlotEnv('VITE_AD_SLOT_RATES_ABOVE_FOLD'),
  format: 'auto' as const,
  placement: 'Top of rates listing',
  minHeight: 250,
  responsive: true,
},

// Calculator page - after results
calculatorAfter: {
  slotId: getSlotEnv('VITE_AD_SLOT_CALCULATOR_AFTER'),
  format: 'auto' as const,
  placement: 'After calculator results',
  minHeight: 250,
  responsive: true,
},

// Guide/blog pages - in-content
guideContent: {
  slotId: getSlotEnv('VITE_AD_SLOT_GUIDE_CONTENT'),
  format: 'auto' as const,
  placement: 'Right side of guide content',
  minHeight: 250,
  responsive: true,
},
} as const;

// Helper: push an ad unit to adsbygoogle
export function pushAd() {
try {
  if (typeof window !== 'undefined') {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }
} catch (e) {
  // silently fail in dev
}
}
