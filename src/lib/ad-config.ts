// Ad Slots Configuration Reference
// Optimized for maximum AdSense revenue with auto-optimization

// Declare global gtag function for Google Analytics
declare global {
  function gtag(...args: any[]): void;
}

export const AD_CLIENT = 'ca-pub-5800977493749262'; // Your AdSense client ID

// Revenue Optimization Settings
export const AD_OPTIMIZATION = {
  // Enable Google's auto-optimization features
  autoOptimize: true,

  // Allow ads on all pages except legal/compliance
  allowedPages: ['*'], // All pages
  blockedPages: ['/privacy', '/terms', '/legal', '/disclaimer'],

  // Maximum ads per page (AdSense limit is 3)
  maxAdsPerPage: 3,

  // Minimum content-to-ad ratio
  minContentRatio: 0.6, // 60% content, 40% ads

  // Ad refresh settings (for dynamic content)
  refreshInterval: 30000, // 30 seconds
  maxRefreshes: 3,

  // Performance monitoring
  enableAnalytics: true,
  trackImpressions: true,
  trackClicks: true,
} as const;

export const AD_SLOTS = {
  // Hero/Above-fold advertisement - High CTR placement
  hero: {
    slotId: '1234567890',
    format: 'auto', // Let Google optimize format
    placement: 'Right side of hero section',
    minHeight: 250,
    responsive: true, // Enable responsive optimization
  },

  // Sidebar sticky ad (desktop only) - Premium placement
  sidebar: {
    slotId: '0987654321',
    format: 'auto', // Google chooses best format
    placement: 'Right sidebar, sticky on scroll',
    minHeight: 600,
    responsive: true,
    sticky: true,
    visibleOn: ['lg', 'xl'], // Desktop only for higher CPM
  },

  // Mid-content ad (between rate cards) - Contextual placement
  midContent: {
    slotId: '5555555555',
    format: 'auto', // Auto-optimize for content
    placement: 'After 3-4 rate cards',
    minHeight: 90,
    responsive: true,
  },

  // Footer ad - Exit intent placement
  footer: {
    slotId: '6666666666',
    format: 'auto', // Let Google optimize
    placement: 'Center of footer',
    minHeight: 90,
    responsive: true,
  },

  // Mobile sticky ad - Highest CTR on mobile
  mobileSticky: {
    slotId: '7777777777',
    format: 'auto', // Mobile-optimized auto format
    placement: 'Sticky bottom on mobile only',
    minHeight: 50,
    responsive: true,
    sticky: true,
    visibleOn: ['sm', 'md'], // Mobile and tablet only
  },

  // Page-specific: Rates page - Above fold
  ratesAboveFold: {
    slotId: '8888888888',
    format: 'auto',
    placement: 'Top of rates listing',
    minHeight: 250,
    responsive: true,
  },

  // Page-specific: Rates page - Mid content
  ratesMidContent: {
    slotId: '3333333333',
    format: 'auto',
    placement: 'Middle of rates listing',
    minHeight: 250,
    responsive: true,
  },

  // Page-specific: Calculator page - Above calculator
  calculatorBefore: {
    slotId: '9999999999',
    format: 'auto',
    placement: 'Above calculator',
    minHeight: 90,
    responsive: true,
  },

  // Page-specific: Calculator page - After results
  calculatorAfter: {
    slotId: '4444444444',
    format: 'auto',
    placement: 'After calculator results',
    minHeight: 250,
    responsive: true,
  },

  // Page-specific: Guide/Blog pages - Content ad
  guideContent: {
    slotId: '2222222222',
    format: 'auto',
    placement: 'Right side of guide content',
    minHeight: 250,
    responsive: true,
  },

  // Page-specific: Dashboard - Personalized ads
  dashboardTop: {
    slotId: '5555555555',
    format: 'auto',
    placement: 'Top of dashboard',
    minHeight: 90,
    responsive: true,
  },

  // Page-specific: Pro page - Premium placement
  proAboveFold: {
    slotId: '6666666666',
    format: 'auto',
    placement: 'Above pro features',
    minHeight: 250,
    responsive: true,
  },

  // Additional revenue opportunities
  interstitial: {
    slotId: '7777777777',
    format: 'auto',
    placement: 'Between major sections',
    minHeight: 250,
    responsive: true,
  },

  // Native ads for better UX
  nativeContent: {
    slotId: '8888888888',
    format: 'auto',
    placement: 'Integrated with content',
    minHeight: 250,
    responsive: true,
  },
} as const;

// ============================================
// Usage Example in Components
// ============================================

/*
import AdSenseSlot from './AdSenseSlot';
import { AD_CLIENT, AD_SLOTS } from '../lib/ad-config';

export function RatesPage() {
  return (
    <>
      <AdSenseSlot
        adClient={AD_CLIENT}
        adSlot={AD_SLOTS.ratesAboveFold.slotId}
        format={AD_SLOTS.ratesAboveFold.format}
      />
      // Rates content
    </>
  );
}
*/

// ============================================
// Performance Monitoring
// ============================================

interface AdMetrics {
  slotName: keyof typeof AD_SLOTS;
  impressions: number;
  clicks: number;
  revenue: number;
  ctr: number; // Click-through rate (%)
  rpm: number; // Revenue per thousand impressions
}

// Track ad performance
export function trackAdPerformance(metrics: AdMetrics) {
  // Send to analytics service
  if (typeof gtag !== 'undefined') {
    gtag('event', 'ad_performance', {
      slot: metrics.slotName,
      ctr: metrics.ctr,
      rpm: metrics.rpm,
    });
  }
}
