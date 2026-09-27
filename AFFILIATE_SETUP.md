# FindMeRates — Affiliate Setup (make the offers earn)

**Status right now:** all 27 offer links are plain bankrate.com / nerdwallet.com URLs with
zero affiliate tracking. Every click currently earns $0. The plumbing below is live —
you just need to join programs and paste your links.

## How the plumbing works (already built)

- Every offer CTA on the site now points to `/out/<offer-id>` (e.g. `/out/mortgage-compare-a`).
- `scripts/build.mjs` generates Cloudflare `_redirects` rules: `/out/<id> → <your affiliate URL> 302`.
- To monetize an offer, add an `"affHref"` field to that offer in `content/offers.json`:

```json
{
  "id": "mortgage-compare-a",
  "title": "Compare mortgage rates in minutes",
  "href": "https://www.bankrate.com/mortgages/",
  "affHref": "PASTE-YOUR-AFFILIATE-URL-HERE",
  ...
}
```

- Rebuild (`npm run build`) and redeploy. No other file changes needed — every page
  (`/offers`, all `/rates/*` hubs, home rotation, article footers) picks it up.
- Click attribution: Cloudflare Pages analytics shows hits per `/out/<id>` rule.

## Programs to join (verified Sept 2026)

Join the **networks** first (one approval each), then grab links per offer:

| Network | Why | Sign up |
|---|---|---|
| CJ Affiliate | LendingTree program lives here — mortgages, personal/auto loans, credit cards; up to ~$70 per qualified lead | cj.com |
| Impact | SoFi program lives here — student/personal loans, mortgage refi; $100–$150 per lead | impact.com |
| FlexOffers | Broad finance bench (banks, cards, insurance) | flexoffers.com |
| ShareASale / Awin | Backup coverage for banks, cards, insurance | shareasale.com / awin.com |

**Fastest path to first dollars:** LendingTree via CJ covers mortgages, refi, personal loans,
auto loans, and credit cards in one program — one approval, then paste the same base
affiliate link pattern across ~15 of the 27 offers (each offer gets its own tracked link
from the CJ dashboard so you can see which page converts).

## Priority order (highest intent first)

1. `mortgage-compare-a`, `mortgage-refi`, `mortgage-prequal` — highest payout per lead
2. `personal-loan-*`, `auto-loan-*` — high volume
3. `credit-card-*` — high volume, lower payout
4. `savings-*`, `cd-*`, `checking-*` — bank bonus offers ($200–$300 CPA on some banks)
5. `insurance-*`, `heloc-*`, `student-*`, `business-*`, `investing-*`

## Compliance (don't skip)

- The affiliate disclosure is already on every offer card and in `/privacy-policy`.
- Finance is regulated: keep the "not a lender / educational only" copy as-is, never
  promise approvals or specific rates in your own copy.
- When you paste `affHref` links, keep `rel="sponsored nofollow"` (already on all CTAs).
