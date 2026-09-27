# FindMeRates — Newsletter ESP setup (free)

**Status right now:** the newsletter forms save emails to the visitor's own browser
localStorage — a demo. No list is being built. To collect real subscribers:

## Option A — Buttondown (simplest, free tier)

1. Sign up at buttondown.com (free tier available).
2. Create a newsletter → Settings → API → copy your **username**.
3. Your subscribe endpoint is:
   `https://buttondown.com/api/emails/embed-subscribe/<username>`
   (accepts a plain HTML form POST with an `email` field — no JS needed).
4. In `content/site.json`, set:
   ```json
   "newsletter": { "endpoint": "https://buttondown.com/api/emails/embed-subscribe/<username>", "emailField": "email" }
   ```
5. Rebuild + redeploy. Forms now post straight to Buttondown (opens a confirmation tab).

## Option B — Brevo (most generous free tier: 300 emails/day)

1. Sign up at brevo.com → Contacts → Forms → create a subscription form.
2. Brevo gives you an HTML form with its own `action` URL — paste that URL as
   `newsletter.endpoint` in `content/site.json` and set `newsletter.emailField`
   to the field name Brevo's form uses for the email input (usually `EMAIL`).
3. Rebuild + redeploy.

## Notes

- `emailField` defaults to `email`; some ESPs want `EMAIL` — check their form HTML.
- With an endpoint set, the site.js demo-save handler disables itself for those forms.
- The consent checkbox + privacy-policy copy already satisfy the basics; confirm your
  ESP's double opt-in setting matches what you promise on `/newsletter`.
