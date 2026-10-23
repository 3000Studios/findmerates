# Affiliate Wiring — Implementation Plan (findmerates)

Prepared 2026-10-23 (Websites Phase B). Companion doc: `AFFILIATE_SETUP.md`
(affiliate accounts + pasting links — the money step).

Verdict up front: the affiliate plumbing is **already built and placed**. What
remains is (A1) one coverage gap, (A2) configuration once affiliate links exist,
and (B) placing the existing rate-alert capture on the `/rates/*` pages.

## A. Affiliate links on /rates/* — already wired

- Component: `src/components/PartnerOffers.tsx`; data: `src/lib/partners.ts`.
- Placement: Home, `/rates/search` (`src/pages/Rates.tsx`), and every
  `/rates/:categoryId` page (`src/pages/CategoryPage.tsx`). No placement work needed.
- Monetization switch: setting `VITE_PARTNER_OFFERS_<CATEGORY>` (JSON array) in
  the Cloudflare Pages production environment replaces the direct lender links
  with sponsored offers — cards flip to the "Sponsored" badge and the advertiser
  disclosure wording automatically.

## A1. Gap — the INSURANCE category renders no offers

`RateCategory.INSURANCE` exists and `/rates/insurance` renders via CategoryPage,
but `src/lib/partners.ts` has no env key and no defaults for it, so no offer
cards appear there. Patch (in `src/lib/partners.ts`):

1. In `envKeyForCategory` add:
   `case RateCategory.INSURANCE: return "VITE_PARTNER_OFFERS_INSURANCE";`
2. Add a `DEFAULT_OFFERS[RateCategory.INSURANCE]` array (2–3 national carriers,
   direct URLs, `sponsored: false`). Pick the carriers when the affiliate links
   are ready so the defaults and the sponsored set stay consistent.

Effort: ~15 lines. Do it together with the first affiliate-link drop (A2).

## A2. Config checklist — when affiliate links exist

- [ ] Join the networks and get a tracked link per offer (see AFFILIATE_SETUP.md).
- [ ] Cloudflare Pages → project `findmerates` → Settings → Environment
      variables (Production): set `VITE_PARTNER_OFFERS_MORTGAGE` first
      (highest payout), then `REFINANCE`, `PERSONAL_LOAN`, `AUTO_LOAN`,
      `SAVINGS`, `CD` (and `INSURANCE` after A1).
- [ ] Every offer object: the tracked affiliate URL in `url`, `"sponsored": true`.
- [ ] Redeploy; click-test one card per category; confirm the `outbound_click`
      events fire and the cards show the "Sponsored" badge + disclosure.

## B. Rate-alert email capture on /rates/* — spec (placement only)

Current state (better than assumed): the capture component already exists —
`src/components/RateAlertForm.tsx` writes signups to the Firestore collection
`rateAlertSignups` with `{email, source, path, createdAt, uid}` and fires a
`rate_alert_signup` analytics event. A leads backend also exists
(`functions/api/leads.ts` + D1). The form is placed **only on the home page**
(`src/pages/Home.tsx`). No new backend is needed.

Change:

1. `src/pages/CategoryPage.tsx`: render `<RateAlertForm />` below
   `<PartnerOffers />`, so every `/rates/:categoryId` page carries the capture.
   Attribution works as-is — the form records `window.location.pathname` — but
   prefer extending `RateAlertForm` with an optional `source` prop
   (default `"home_rate_alert"`) and pass `rates_<category>` from CategoryPage.
2. `src/pages/Rates.tsx` (`/rates/search`): same placement under the offers
   block, source `rates_search`.
3. Verify after deploy: submit a test signup from a `/rates` page and confirm
   the document lands in `rateAlertSignups` (the home form already writes
   there in production, so no Firestore rules change is expected).

Follow-on (out of scope here): capture alone does not send alerts. A scheduled
job that watches rates (`src/services/liveRates.ts` / `functions/api/rates.ts`)
and emails subscribers is a separate build — until it exists, do not expand
the alert promises in page copy beyond what the form already says.
