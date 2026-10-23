# FindMeRates — Affiliate Setup (make the offers earn)

**Status right now:** every partner offer on the site links straight to the lender
(rocketmortgage.com, sofi.com, ally.com, …) with zero affiliate tracking. Every
click currently earns $0. The plumbing below is live — you just need to join
programs and paste your links.

## How the plumbing works (already built)

- Offer cards are rendered by `src/components/PartnerOffers.tsx` on the home page,
  `/rates/search`, and every `/rates/:category` page. The data comes from
  `src/lib/partners.ts`.
- Each category's offers can be replaced without a code change by setting a
  Cloudflare Pages environment variable (Production) named
  `VITE_PARTNER_OFFERS_<CATEGORY>` to a JSON array of offers:

```json
[
  {
    "id": "mortgage-lendingtree",
    "name": "LendingTree",
    "description": "Compare mortgage offers from multiple lenders with one form.",
    "url": "PASTE-YOUR-AFFILIATE-URL-HERE",
    "badge": "Compare",
    "sponsored": true
  }
]
```

- Categories wired today: `MORTGAGE`, `CD`, `AUTO_LOAN`, `PERSONAL_LOAN`,
  `REFINANCE`, `SAVINGS`. If a variable is unset, the site falls back to the
  direct lender links in `DEFAULT_OFFERS` in `src/lib/partners.ts`.
- Set `"sponsored": true` on paid placements: the card badge flips to "Sponsored",
  the heading becomes "Partner offers", and the disclosure under the cards switches
  to the compensation wording. CTAs already carry `rel="sponsored"`.
- After changing a variable, redeploy (push to `main` or re-run the Pages deploy)
  so the new build picks it up. No other file changes needed — every page picks
  it up from the same source.
- Click attribution: offer clicks fire an `outbound_click` analytics event
  (offer id, category, partner, url) via `src/lib/analytics.ts`.

## Programs to join (verified Sept 2026)

Join the **networks** first (one approval each), then grab links per offer:

| Network | Why | Sign up |
|---|---|---|
| CJ Affiliate | LendingTree program lives here — mortgages, personal/auto loans, credit cards; up to ~$70 per qualified lead | cj.com |
| Impact | SoFi program lives here — student/personal loans, mortgage refi; $100–$150 per lead | impact.com |
| FlexOffers | Broad finance bench (banks, cards, insurance) | flexoffers.com |
| ShareASale / Awin | Backup coverage for banks, cards, insurance | shareasale.com / awin.com |

**Fastest path to first dollars:** LendingTree via CJ covers mortgages, refi, personal loans,
auto loans, and credit cards in one program — one approval, then paste a tracked
link per offer into the matching `VITE_PARTNER_OFFERS_<CATEGORY>` variable so you
can see which page converts.

## Priority order (highest intent first)

1. Mortgage + refinance offers — highest payout per lead
2. `personal-loan`, `auto-loan` — high volume
3. `savings`, `cd` — bank bonus offers ($200–$300 CPA on some banks)
4. `insurance` — no offers are configured for the insurance category yet; see
   AFFILIATE-WIRING-PLAN.md for the small patch that wires it up

## Compliance (don't skip)

- The advertiser disclosure runs under every offer card, and `/privacy`,
  `/affiliate-disclosure`, and `/how-we-make-money` describe how partner
  compensation works.
- Finance is regulated: keep the "not a lender / educational only" copy as-is, never
  promise approvals or specific rates in your own copy.
- Keep `"sponsored": true` on every paid placement so the cards keep
  `rel="sponsored"` and the "Sponsored" badge (already rendered automatically).
