type LinkStatus = { ok: boolean; status?: number; reason?: string };

const FALLBACK_STRIPE_BASIC_LINK = "https://buy.stripe.com/fZu7sL2KxdTgbJCeMibAs0B";
const FALLBACK_STRIPE_MONTHLY_LINK = "https://buy.stripe.com/00w3cvetfg1o00U9rYbAs0C";
const FALLBACK_STRIPE_SIX_MONTH_LINK = "https://buy.stripe.com/14AeVdacZ16u3d60VsbAs0D";

async function check(url: string | null): Promise<LinkStatus> {
  if (!url) return { ok: false, reason: "missing" };
  try {
    const res = await fetch(url, { redirect: "follow" });
    const status = res.status;
    const text = await res.text();
    const bad =
      /Something went wrong/i.test(text) ||
      /could not be found/i.test(text);
    return { ok: res.ok && !bad, status, reason: bad ? "not_found" : "ok" };
  } catch (e) {
    return { ok: false, reason: "fetch_error" };
  }
}

export const onRequestGet: PagesFunction = async ({ env }) => {
  const stripeBasic = ((env as any).VITE_STRIPE_BASIC_LINK as string | undefined) || FALLBACK_STRIPE_BASIC_LINK;
  const stripeMonthly =
    ((env as any).VITE_STRIPE_PAYMENT_LINK as string | undefined) ||
    ((env as any).VITE_STRIPE_PRO_LINK as string | undefined) ||
    FALLBACK_STRIPE_MONTHLY_LINK;
  const stripeSix = ((env as any).VITE_STRIPE_6MONTH_LINK as string | undefined) || FALLBACK_STRIPE_SIX_MONTH_LINK;
  const paypalMonthly = (env as any).VITE_PAYPAL_PAYMENT_LINK as string | undefined;
  const paypalSix = (env as any).VITE_PAYPAL_6MONTH_LINK as string | undefined;

  const [sB, sM, s6, pM, p6] = await Promise.all([
    check(stripeBasic || null),
    check(stripeMonthly || null),
    check(stripeSix || null),
    check(paypalMonthly || null),
    check(paypalSix || null),
  ]);

  return new Response(
    JSON.stringify({
      stripe: { basic: sB, monthly: sM, six_month: s6 },
      paypal: { monthly: pM, six_month: p6 },
      checkedAt: new Date().toISOString(),
    }),
    {
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
      },
    },
  );
};
