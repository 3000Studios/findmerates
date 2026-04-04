// Ad Slots Configuration Reference
// Update with your actual AdSense ca-pub and ad slot IDs

export const AD_CLIENT = 'ca-pub-xxxxxxxxxxxxxxxx'; // Replace with your AdSense client ID

export const AD_SLOTS = {
  // Hero/Above-fold advertisement
  hero: {
    slotId: '1234567890',
    format: '300x250', // Medium Rectangle
    placement: 'Right side of hero section',
    minHeight: 250,
    responsive: false,
  },

  // Sidebar sticky ad (desktop only)
  sidebar: {
    slotId: '0987654321',
    format: '300x600', // Half Page
    placement: 'Right sidebar, sticky on scroll',
    minHeight: 600,
    responsive: true,
    sticky: true,
    visibleOn: ['lg', 'xl'], // Desktop only
  },

  // Mid-content ad (between rate cards)
  midContent: {
    slotId: '5555555555',
    format: '728x90', // Leaderboard
    placement: 'After 3-4 rate cards',
    minHeight: 90,
    responsive: true,
  },

  // Footer ad
  footer: {
    slotId: '6666666666',
    format: '728x90', // Leaderboard
    placement: 'Center of footer',
    minHeight: 90,
    responsive: true,
  },

  // Mobile sticky ad
  mobileSticky: {
    slotId: '7777777777',
    format: '320x50', // Mobile Banner
    placement: 'Sticky bottom on mobile only',
    minHeight: 50,
    responsive: true,
    sticky: true,
    visibleOn: ['sm', 'md'], // Mobile and tablet only
  },

  // Page-specific: Rates page
  ratesAboveFold: {
    slotId: '8888888888',
    format: '300x250',
    placement: 'Top of rates listing',
    minHeight: 250,
  },

  // Page-specific: Calculator page
  calculatorBefore: {
    slotId: '9999999999',
    format: '728x90',
    placement: 'Above calculator',
    minHeight: 90,
  },

  // Page-specific: Guide/Blog pages
  guideContent: {
    slotId: '2222222222',
    format: '300x250',
    placement: 'Right side of guide content',
    minHeight: 250,
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
      {/* Rates content */}
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
