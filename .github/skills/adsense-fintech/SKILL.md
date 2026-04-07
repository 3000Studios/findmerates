---
name: adsense-fintech-development
description: "Specialized development workflow for AdSense-monetized fintech websites. Use when: optimizing ad placements, integrating AdSense, balancing UX with monetization, implementing rate calculators, financial data displays, content compliance for AdSense."
---

# AdSense-Driven Fintech Website Development

## Overview

This skill provides battle-tested patterns for building React-based financial rate finder websites monetized with Google AdSense. Covers ad placement strategy, UX optimization, compliance, and integration patterns.

## Ad Placement Patterns

### Best Performing Placements

#### 1. Hero Section Ad (Above Fold)
**Position**: Top right or between hero CTA and content
**Size**: 300×250 (Medium Rectangle) or 300×600 (Half Page)
**Performance**: High CTR (5-8%), but MUST not overshadow main CTA

```typescript
<section className="grid grid-cols-3 gap-6">
  <div className="col-span-2">
    <Hero />
  </div>
  <div className="col-span-1">
    <AdSenseSlot
      adClient="ca-pub-xxxxxxxxxxxxxxxx"
      adSlot="1234567890"
      format="300x250"
      fullWidth={false}
    />
  </div>
</section>
```

#### 2. Sidebar Sticky Ad (Desktop)
**Position**: Right sidebar (only on lg breakpoint)
**Size**: 300×600 (Half Page)
**Behavior**: Sticky scroll with user
**Performance**: 3-5% CTR, good for engagement

```typescript
<aside className="hidden lg:block sticky top-20">
  <AdSenseSlot
    adSlot="9876543210"
    format="300x600"
    responsive
    sticky
  />
</aside>
```

#### 3. Mid-Content Ad (Rate Cards)
**Position**: After 3rd-4th rate card in list
**Size**: 728×90 (Leaderboard) or responsive
**Trigger**: Only on pages with 5+ rate cards
**Performance**: 4-7% CTR

```typescript
{rates.map((rate, idx) => (
  <>
    <RateCard key={rate.id} {...rate} />
    {(idx + 1) % 4 === 0 && (
      <AdSenseSlot adSlot="5555555555" format="728x90" />
    )}
  </>
))}
```

#### 4. Footer Ad
**Position**: Footer, full width center
**Size**: 728×90 (Leaderboard)
**Behavior**: Always visible on scroll
**Performance**: 2-4% CTR

```typescript
<footer className="bg-slate-100 py-8">
  <div className="max-w-7xl mx-auto">
    <AdSenseSlot adSlot="1111111111" format="728x90" />
    {/* Footer content */}
  </div>
</footer>
```

#### 5. Mobile-Only Sticky Ad
**Position**: Sticky bottom footer
**Size**: 320×50 (Mobile Banner)
**Behavior**: Appears only on mobile after user scrolls
**Performance**: 6-10% CTR (highest on mobile)

```typescript
{/* Mobile only, sticky bottom */}
<div className="fixed bottom-0 left-0 right-0 lg:hidden z-40 bg-white border-t">
  <AdSenseSlot adSlot="2222222222" format="320x50" />
</div>
```

## AdSense Integration Component

### Resusable Component Pattern

```typescript
// components/AdSenseSlot.tsx
import { useEffect } from 'react';

interface AdSenseSlotProps {
  adClient: string;
  adSlot: string;
  format?: string;
  responsive?: boolean;
  sticky?: boolean;
  className?: string;
}

export default function AdSenseSlot({
  adClient,
  adSlot,
  format,
  responsive = true,
  sticky = false,
  className = '',
}: AdSenseSlotProps) {
  useEffect(() => {
    // Load or refresh AdSense ads
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  return (
    <div
      className={`${sticky ? 'sticky top-0' : ''} ${className}`}
      style={{ minHeight: '250px' }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minHeight: '250px' }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={format || 'auto'}
        data-full-width-responsive={responsive}
      ></ins>
    </div>
  );
}

// In window.d.ts
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}
```

### HTML Script Tag (in index.html or Layout)

```html
<!-- Add to public/index.html or in <head> via Layout -->
<script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxxxxxxxxxx"
  crossorigin="anonymous"
></script>
```

## AdSense Compliance & Content Policy

### Prohibited on Ad-Sensitive Pages

```typescript
// Legal/compliance pages should NOT show ads
const shouldShowAds = !location.pathname.match(/^\/(privacy|terms|disclaimer|legal)/);

return (
  <Layout showAds={shouldShowAds}>
    {children}
  </Layout>
);
```

### Allowed Financial Content
- ✅ Mortgage rates, APR calculations
- ✅ CD rates, savings rates
- ✅ Loan comparison tools
- ✅ Financial education content
- ✅ Market analysis & trends
- ❌ Cryptocurrency/crypto exchanges
- ❌ Forex trading platforms
- ❌ Gambling-like financial products

### Ad Filter Configuration

In AdSense account, block ad categories that compete with your rates:
```
- Payday loans
- Predatory lending
- High-risk investments
- Unregulated crypto/forex
- Work-from-home schemes
```

## UX Balance: Ads vs Content

### The Golden Ratio
- **Desktop**: 60% content / 40% ads + whitespace
- **Tablet**: 70% content / 30% ads
- **Mobile**: 85% content / 15% ads (one sticky ad only)

### Page Layout Formula
```
[HERO + Optional Ad]
↓
[Rate Cards / Calculator Content]
↓
[Mid-Content Ad] ← After 3-4 cards
↓
[More Content]
↓
[Footer Ad]
↓
[Mobile Sticky Ad] ← Mobile only
```

### Avoid These Mistakes
1. **Ad Clutter**: Never place 2+ ads side-by-side
2. **Ad Over CTA**: Don't let ads obscure "Compare," "Apply," "Calculate" buttons
3. **Page Bloat**: Ads shouldn't push content below fold on mobile
4. **Ad Flicker**: Use fixed ad slots to prevent layout shift
5. **Ad Frequency Too High**: More than 2-3 ads per screen height = bounce risk

## Performance Impact: AdSense

### Load Time Targets With AdSense
- AdSense script adds ~100-200ms load time
- Budget for this in Core Web Vitals monitoring
- Use async ad loading to prevent blocking

### Optimization Strategies

**Lazy Load Ads (Viewport-based)**
```typescript
import { useInView } from 'react-intersection-observer'; // or native Intersection Observer

function LazyAdSlot({ adSlot }: { adSlot: string }) {
  const { ref, inView } = useInView({ threshold: 0.5 });

  return (
    <div ref={ref}>
      {inView && (
        <AdSenseSlot adSlot={adSlot} />
      )}
    </div>
  );
}
```

**Defer Non-Critical Ads**
```typescript
// Only load middle/footer ads after LCP (Largest Contentful Paint)
useEffect(() => {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name.includes('largest-contentful-paint')) {
        // Load ads now
        loadSecondaryAds();
      }
    }
  });
  observer.observe({ entryTypes: ['largest-contentful-paint'] });
}, []);
```

## Revenue Optimization

### Factors Affecting AdSense Revenue

**1. Traffic Quality (Highest Impact)**
- Premium traffic (organic search users) = higher CPM
- Bot traffic = $0 CPM (filtered out)
- Solution: Monitor invalid traffic in AdSense dashboard; block referral spam in analytics

**2. Page Speed**
- Pages <2s load = 2-3× higher CPM than pages >3s
- Measure with PageSpeed Insights
- Priority: Image optimization, code splitting, lazy loading rates

**3. Content Relevance**
- High-quality financial content = 2-5× CPM vs generic content
- Targeted rate data (by ZIP code/type) = higher relevance
- Avoid thin/duplicate content

**4. Niche Value**
- Mortgage rates (US) = $3-8 CPM
- Credit cards = $5-10 CPM
- Financial planning = $2-5 CPM
- Cryptocurrency = Often lower CPM (many blocked ad networks)

**5. Traffic Geography**
- US/UK/CA/AU traffic = $2-8 CPM
- India/SE Asia = $0.5-2 CPM
- Strategy: Target high-value geos, geo-target rate content

### A/B Testing Setup

```typescript
// Track ad performance by placement
function trackAdClick(placement: string) {
  gtag('event', 'ad_click', {
    ad_placement: placement,
    page_type: currentPageType,
    timestamp: new Date(),
  });
}

// Measure CTR by position
const adMetrics = {
  hero: { impressions: 5000, clicks: 350 }, // 7% CTR
  sidebar: { impressions: 4200, clicks: 168 }, // 4% CTR
  midContent: { impressions: 3800, clicks: 228 }, // 6% CTR
};
```

## Rate Calculator UX with Ads

### Avoid Ads in Calculators
**Rule**: Never place ads inside a calculator component or its immediate results.

```typescript
// ❌ Bad: Ad inside calculator
<MortgageCalculator>
  <Input />
  <AdSenseSlot /> {/* WRONG */}
  <Results />
</MortgageCalculator>

// ✅ Good: Ad before/after calculator
<div className="space-y-6">
  <AdSenseSlot adSlot="before-calc" format="728x90" />
  <MortgageCalculator />
  <AdSenseSlot adSlot="after-calc" format="300x250" />
</div>
```

### Calculator-Specific Guidance
- Show rate ads BELOW calculator results (in "Offers from Lenders" section)
- Ad placement signals relevance: user calculated, now show matching rates
- Ads should enhance user journey, not interrupt it

## Gemini Chat + AdSense Integration

### Context Injection for Better Ads
The Gemini Chat assistant can improve ad relevance by mentioning related products:

```typescript
// In GeminiChat systemInstruction:
"You are a financial rate expert. If user asks about refinancing, mention they can compare current rates on our platform. This helps AdSense serve targeted ads."
```

### Avoid Ad-Chat Overlap
- Chat bubble position: bottom-right (avoid ad collisions)
- Minimize chat z-index stacking issues
- On mobile, minimize chat height to prevent obscuring sticky ad

```typescript
// Responsive chat size
const chatClasses = isMobile 
  ? 'w-80 h-[400px]' // Shorter on mobile
  : 'w-96 h-[500px]'; // Standard on desktop
```

## Firestore & Rate Data for Ads

### Tagging Rates for Ad Relevance
Store rate metadata to help AdSense optimize:

```typescript
interface RateOffer {
  id: string;
  provider: string;
  type: 'mortgage' | 'cd' | 'savings';
  rate: number;
  tags: ['refi', 'first-time', 'fha', 'jumbo']; // ← For ad targeting
  age: '1h' | '1d' | '1w'; // ← Freshness signal
  promoted: boolean; // ← Hide from ads if affiliate promotion
}
```

## Mobile-Specific AdSense Strategy

### Mobile Traffic Often 60-70% of Total
- Mobile CPM typically 30-50% lower than desktop
- BUT CTR is often 50-100% higher
- Most revenue = mobile desktop combo, not mobile alone

### Mobile Best Practices
- **ONE sticky ad only** (bottom 320×50 banner)
- Auto-hide sticky ad on scroll up (UX smoother)
- Full-width responsive ads (use data-full-width-responsive)
- Prevent ad clipping on notch/fold devices

```typescript
// Detect safe area for mobile ads
const isMobileWithNotch = /iPhone/.test(navigator.userAgent);
const adBottomSpacing = isMobileWithNotch ? 'mb-12' : 'mb-6';
```

## Monitoring & Analytics

### Key Metrics to Track
```
1. AdSense RPM (Revenue Per Mille)
   = (Total Revenue / Total Impressions) * 1000
   Target: $2-5 RPM for financial content

2. CTR (Click-Through Rate)
   = (Clicks / Impressions) * 100
   Target: 2-8% depending on placement

3. Page CPM (Cost Per Thousand)
   = (Revenue / Pageviews) * 1000
   Tells you actual advertiser value

4. Invalid Traffic Rate
   Monitor in AdSense Dashboard
   Target: <5%
```

### Dashboard Setup (Recommended)
```typescript
interface AdMetrics {
  date: string;
  impressions: number;
  clicks: number;
  revenue: number;
  ctr: number;
  rpm: number;
  placement: string; // hero, sidebar, etc.
}

// Store in Firestore for historical tracking
```

## Troubleshooting Common Issues

### Ads Not Showing
1. ✅ Check ad slots are valid in AdSense account
2. ✅ Verify AdSense script loads (Network tab)
3. ✅ Check content compliance (not in blocked category)
4. ✅ Ensure site is approved for AdSense
5. ✅ Check browser console for CSP errors

### Low CTR or Revenue
1. **Ad placement too low** → Move above fold
2. **Poor content relevance** → Improve financial content depth
3. **Bot traffic** → Implement analytics bot filtering
4. **Low traffic volume** → Need 5K+ monthly visitors for reliable CPM
5. **Wrong geography** → Adjust targeting to high-value regions

### Layout Shift (CLS Issues)
```typescript
// Reserve space for ads to prevent layout shift
<div style={{ minHeight: '250px', width: '300px' }}>
  <AdSenseSlot />
</div>
```

## Compliance Checklist

- [ ] AdSense account approved and active
- [ ] Ad slots match approved formats (300×250, 728×90, etc.)
- [ ] Content includes financial disclaimers (rates subject to change, etc.)
- [ ] Privacy policy linked in footer
- [ ] Terms of Service includes ad disclaimer
- [ ] No ad placement on /privacy or /legal pages
- [ ] Verified site ownership in Google Search Console
- [ ] HTTPS enabled
- [ ] No click-baiting around ads
- [ ] No artificial ad manipulation
- [ ] Proper spacing between editorial content and ads

## Templates & Code Snippets

### Full Page Layout with Ads
See: `.github/skills/adsense-fintech/templates/page-layout-with-ads.tsx`

### Ad Configuration Manager
See: `.github/skills/adsense-fintech/templates/ad-config.ts`

### Analytics Wrapper
See: `.github/skills/adsense-fintech/templates/ad-analytics.ts`

## When to Use This Skill

✅ **When you need**:
- Ad placement strategy for pages
- AdSense component code
- Revenue optimization guidance
- Mobile ad UX review
- Compliance verification
- Performance impact analysis

❌ **When NOT to use**:
- General React coding (use main instructions)
- Firebase/Firestore queries (use main instructions)
- Gemini API integration (use main instructions)
- Non-fintech AdSense sites
