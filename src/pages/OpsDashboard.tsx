import React, { useEffect, useMemo, useState } from "react";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { auth, db } from "../lib/firebase";
import { collection, getCountFromServer, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

type Check = { label: string; ok: boolean; detail?: string };

function env(name: string) {
  return (import.meta as any).env?.[name] as string | undefined;
}

export default function OpsDashboard() {
  const [authReady, setAuthReady] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [checks, setChecks] = useState<Check[] | null>(null);

  const allowedEmails = useMemo(() => {
    const raw = env("VITE_ADMIN_EMAILS") || "";
    return raw
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
  }, []);

  const opsKey = env("VITE_OPS_KEY") || "";
  const hasKey = useMemo(() => {
    if (!opsKey) return false;
    const params = new URLSearchParams(window.location.search);
    return params.get("key") === opsKey;
  }, [opsKey]);

  const authorized = useMemo(() => {
    if (hasKey) return true;
    if (!email) return false;
    if (!allowedEmails.length) return false;
    return allowedEmails.includes(email.toLowerCase());
  }, [allowedEmails, email, hasKey]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setEmail(user?.email || null);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!authorized) return;

    const run = async () => {
      const results: Check[] = [];

      const adsEnabled = env("VITE_ENABLE_ADS") !== "FALSE";
      results.push({
        label: "Ads enabled",
        ok: adsEnabled,
        detail: adsEnabled ? "VITE_ENABLE_ADS is enabled" : "VITE_ENABLE_ADS=FALSE",
      });

      try {
        const res = await fetch("/ads.txt", { cache: "no-store" });
        const text = await res.text();
        const ok = res.ok && text.includes("google.com") && text.includes("pub-");
        results.push({
          label: "ads.txt present",
          ok,
          detail: ok ? "ads.txt looks valid" : "ads.txt missing or invalid",
        });
      } catch {
        results.push({ label: "ads.txt present", ok: false, detail: "fetch failed" });
      }

      const checkoutOk =
        Boolean(env("VITE_STRIPE_PAYMENT_LINK")) &&
        Boolean(env("VITE_STRIPE_6MONTH_LINK")) &&
        Boolean(env("VITE_PAYPAL_PAYMENT_LINK")) &&
        Boolean(env("VITE_PAYPAL_6MONTH_LINK"));
      results.push({
        label: "Checkout links ready",
        ok: checkoutOk,
        detail: checkoutOk ? "Stripe + PayPal links present" : "One or more links missing",
      });

      const offersOk =
        Boolean(env("VITE_PARTNER_OFFERS_MORTGAGE")) ||
        Boolean(env("VITE_PARTNER_OFFERS_CD")) ||
        Boolean(env("VITE_PARTNER_OFFERS_AUTO_LOAN")) ||
        Boolean(env("VITE_PARTNER_OFFERS_PERSONAL_LOAN"));
      results.push({
        label: "Partner offers configured",
        ok: offersOk,
        detail: offersOk ? "At least one offer list configured" : "No offer lists set",
      });

      try {
        const leadsCount = await getCountFromServer(collection(db, "leads"));
        results.push({
          label: "Leads collection reachable",
          ok: true,
          detail: `${leadsCount.data().count} total leads`,
        });
      } catch {
        results.push({
          label: "Leads collection reachable",
          ok: false,
          detail: "Firestore rules blocked or offline",
        });
      }

      try {
        const q = query(collection(db, "leads"), where("status", "==", "new"));
        const newCount = await getCountFromServer(q);
        results.push({
          label: "New leads queue",
          ok: true,
          detail: `${newCount.data().count} new leads`,
        });
      } catch {
        results.push({
          label: "New leads queue",
          ok: false,
          detail: "Unable to query new leads",
        });
      }

      setChecks(results);
    };

    run();
  }, [authorized]);

  if (!authReady) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-700" />
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24">
        <h1 className="text-3xl font-display font-bold text-slate-950">
          Not authorized
        </h1>
        <p className="mt-4 text-slate-600">
          Access requires an admin email in <code>VITE_ADMIN_EMAILS</code> or a
          valid <code>?key=</code> query parameter.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <p className="section-kicker">Operations</p>
      <h1 className="mt-2 text-4xl font-display font-bold text-slate-950">
        Ops Dashboard
      </h1>
      <p className="mt-4 text-slate-600">
        Quick readiness checks for monetization, checkout, and lead capture.
      </p>

      <div className="mt-10 grid gap-4">
        {!checks ? (
          <div className="card p-6 flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-brand-700" />
            <p className="text-slate-700">Running checks…</p>
          </div>
        ) : (
          checks.map((c) => (
            <div key={c.label} className="card p-6 flex items-start gap-4">
              {c.ok ? (
                <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="h-6 w-6 text-red-600 shrink-0" />
              )}
              <div className="min-w-0">
                <p className="font-semibold text-slate-950">{c.label}</p>
                {c.detail && (
                  <p className="mt-1 text-sm text-slate-600">{c.detail}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

