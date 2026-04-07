# AdSense & Fintech Development Skill

## Quick Start

This skill provides complete guidance for monetizing FindMeRates with Google AdSense while maintaining excellent user experience.

### Files in This Skill

- **SKILL.md** - Complete best practices guide for AdSense integration
- **AdSenseSlot-template.tsx** - Copy-paste React component for ad placements
- **ad-config.ts** - Centralized configuration for all ad slots

## How to Use

### 1. When You Have an AdSense Question
Ask in chat and mention any of these keywords:
- "optimize ad placement"
- "AdSense revenue"
- "ad UX balance"
- "AdSense compliance"
- "ad performance"
- "mobile ads"

The agent will automatically load this skill.

### 2. Copy the AdSenseSlot Component
```bash
# Copy AdSenseSlot-template.tsx to src/components/AdSenseSlot.tsx
cp .github/skills/adsense-fintech/AdSenseSlot-template.tsx src/components/AdSenseSlot.tsx
```

### 3. Configure Your Ad Slots
Edit `.github/skills/adsense-fintech/ad-config.ts` with your:
- AdSense Publisher ID (ca-pub-xxxxxx...)
- Ad slot IDs from your AdSense account

### 4. Import and Use in Pages
```typescript
import AdSenseSlot from '../components/AdSenseSlot';
import { AD_CLIENT, AD_SLOTS } from '../lib/ad-config';

export function RatesPage() {
  return (
    <>
      <AdSenseSlot
        adClient={AD_CLIENT}
        adSlot={AD_SLOTS.midContent.slotId}
        format={AD_SLOTS.midContent.format}
      />
      {/* Page content */}
    </>
  );
}
```

## Ad Placement Best Practices Summary

| Placement | Size | Position | CTR | Mobile |
|-----------|------|----------|-----|--------|
| Hero | 300×250 | Top right | 5-8% | No |
| Sidebar | 300×600 | Right, sticky | 3-5% | No |
| Mid-Content | 728×90 | After 3 cards | 4-7% | Adaptive |
| Footer | 728×90 | Center footer | 2-4% | Yes |
| Mobile Sticky | 320×50 | Bottom fixed | 6-10% | Yes |

## Common Tasks

### Task: Add AdSense to Rates Page
1. Import AdSenseSlot and config
2. Add slot above fold (before rate cards)
3. Add slot after every 4 rate cards
4. Test on mobile for stacking issues

### Task: Optimize Revenue for Home Page
1. Add hero ad (top right of CTA area)
2. Add footer ad with leaderboard format
3. Add mobile sticky ad
4. Monitor RPM in AdSense dashboard
5. A/B test placements after 1 week

### Task: Fix Layout Shift Issues
1. Use minHeight to reserve space for ads
2. Set explicit dimensions in ad data-attributes
3. Test with PageSpeed Insights
4. Check CLS (Cumulative Layout Shift) < 0.1

## Compliance Checklist

✅ Before going live:
- [ ] AdSense account approved
- [ ] Ad slots created in AdSense dashboard
- [ ] Privacy policy updated with ad disclosure
- [ ] Terms of Service includes ad terms
- [ ] Site approved for AdSense program
- [ ] No ads on /legal, /privacy, /terms pages
- [ ] HTTPS enabled
- [ ] Tested on mobile and desktop

## Revenue Targets

**Realistic Goals** (first 6 months with AdSense):
- **Month 1-2**: $0 (freshly approved site, low traffic)
- **Month 3-4**: $50-200 (depends on traffic quality)
- **Month 6+**: $500-2000 (5-10K quality visitors/month)

**CPM Range** (Cost Per Thousand impressions):
- US financial traffic: $2-8
- Global average: $1-3
- Bot-free traffic with good content = higher CPM

## Troubleshooting

**Ads not showing?**
- Check AdSense approval status
- Verify ad slots exist in account
- Check browser console for errors
- Allow cookies/storage permissions
- Test in incognito window

**Low revenue?**
- Increase traffic quality (organic > paid)
- Improve content depth (thin content = low CPM)
- Check invalid traffic rate in dashboard
- Ensure targeting to high-value geographies
- Note: Financial content competes with pay-per-click ads (lower CPM)

**Layout breaking on mobile?**
- Use responsive="true" attribute
- Reserve minHeight for all ads
- Test "full-width-responsive" setting
- Consider only 1 ad on mobile (sticky bottom)

## Next Steps

1. ✅ Review SKILL.md for comprehensive guidelines
2. ✅ Copy AdSenseSlot component to your project
3. ✅ Add your AdSense credentials to ad-config.ts
4. ✅ Implement ads on Home, Rates, and Calculators pages
5. ✅ Test responsive behavior on all breakpoints
6. ✅ Monitor performance for first 2 weeks
7. ✅ Optimize based on CTR and revenue data
