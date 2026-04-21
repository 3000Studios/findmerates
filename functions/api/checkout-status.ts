type LinkStatus = { ok: boolean; status?: number; reason?: string };

async function check(url: string | null): Promise<LinkStatus> {
  if (!url) return { ok: false, reason: "missing" };
  try {
    const res = await fetch(url, { redirect: "follow" });
    const status = res.status;
    const text = await res.text();
    const bad =
      /Something went wrong/i.test(text) ||
      /could not be found/i.test(text) ||
      /not found/i.test(text);
    return { ok: res.ok && !bad, status, reason: bad ? "not_found" : "ok" };
  } catch (e) {
    return { ok: false, reason: "fetch_error" };
  }
}

export const onRequestGet: PagesFunction = async ({ env }) => {
  const stripeMonthly = (env as any).VITE_STRIPE_PAYMENT_LINK as string | undefined;
  const stripeSix = (env as any).VITE_STRIPE_6MONTH_LINK as string | undefined;
  const paypalMonthly = (env as any).VITE_PAYPAL_PAYMENT_LINK as string | undefined;
  const paypalSix = (env as any).VITE_PAYPAL_6MONTH_LINK as string | undefined;

  const [sM, s6, pM, p6] = await Promise.all([
    check(stripeMonthly || null),
    check(stripeSix || null),
    check(paypalMonthly || null),
    check(paypalSix || null),
  ]);

  return new Response(
    JSON.stringify({
      stripe: { monthly: sM, six_month: s6 },
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

