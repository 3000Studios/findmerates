import React, { useMemo, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { RateCategory } from "../types";
import { trackEvent } from "../lib/analytics";

type CreditRange = "740+" | "670-739" | "580-669" | "<580" | "prefer_not_say";

export default function LeadCaptureForm({
  category,
}: {
  category: RateCategory;
}) {
  const [zip, setZip] = useState("");
  const [amount, setAmount] = useState("");
  const [creditRange, setCreditRange] = useState<CreditRange>("prefer_not_say");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [tcpaConsent, setTcpaConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );

  const phoneProvided = useMemo(() => phone.trim().length > 0, [phone]);

  const zipOk = /^\d{5}$/.test(zip.trim());
  const emailOk = email.trim().length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const requiredOk =
    zipOk && consent && emailOk && (!phoneProvided || tcpaConsent);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requiredOk) return;
    setStatus("submitting");

    try {
      const payload = {
        category,
        zip: zip.trim(),
        amount: amount.trim(),
        creditRange,
        email: email.trim() || null,
        phone: phone.trim() || null,
        consent,
        tcpaConsent: phoneProvided ? tcpaConsent : null,
        user: auth.currentUser
          ? {
              uid: auth.currentUser.uid,
              email: auth.currentUser.email || null,
              displayName: auth.currentUser.displayName || null,
            }
          : null,
        createdAt: serverTimestamp(),
        path: window.location.pathname,
        href: window.location.href,
        status: "new",
      };

      await addDoc(collection(db, "leads"), payload);
      await trackEvent("lead_submit", {
        category,
        zip: zip.trim(),
        hasEmail: Boolean(email.trim()),
        hasPhone: Boolean(phoneProvided),
      });

      setStatus("success");
      setZip("");
      setAmount("");
      setCreditRange("prefer_not_say");
      setEmail("");
      setPhone("");
      setConsent(false);
      setTcpaConsent(false);
    } catch (error) {
      await trackEvent("lead_error", {
        category,
        message: error instanceof Error ? error.message : String(error),
      });
      setStatus("error");
    }
  };

  return (
    <div className="card p-6">
      <p className="section-kicker">Get matched</p>
      <h2 className="mt-2 text-xl font-display font-bold text-slate-950">
        Get matched in 2 minutes
      </h2>
      <p className="mt-2 text-sm text-slate-600">
        Optional: share a few details and we’ll route you to the best next step.
      </p>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              ZIP code (required)
            </label>
            <input
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              inputMode="numeric"
              pattern="\\d{5}"
              placeholder="10001"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-200"
              required
            />
            {!zipOk && zip.trim().length > 0 && (
              <p className="mt-2 text-xs text-red-600">Enter a valid 5‑digit ZIP.</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Amount (optional)
            </label>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="$300,000"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-200"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Credit score range (optional)
          </label>
          <select
            value={creditRange}
            onChange={(e) => setCreditRange(e.target.value as CreditRange)}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-200"
          >
            <option value="prefer_not_say">Prefer not to say</option>
            <option value="740+">740+</option>
            <option value="670-739">670–739</option>
            <option value="580-669">580–669</option>
            <option value="<580">Below 580</option>
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Email (optional)
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="you@email.com"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-200"
            />
            {!emailOk && email.trim().length > 0 && (
              <p className="mt-2 text-xs text-red-600">Enter a valid email.</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Phone (optional)
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              inputMode="tel"
              placeholder="(555) 555‑5555"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-200"
            />
          </div>
        </div>

        <div className="space-y-3 rounded-3xl border border-slate-200 bg-white/70 p-4">
          <label className="flex gap-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 h-4 w-4"
              required
            />
            <span>
              I consent to FindMeRates using this information to help me compare
              offers and contact me about this request. I can opt out anytime.
            </span>
          </label>

          {phoneProvided && (
            <label className="flex gap-3 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={tcpaConsent}
                onChange={(e) => setTcpaConsent(e.target.checked)}
                className="mt-1 h-4 w-4"
                required
              />
              <span>
                If I provided a phone number, I agree I may be contacted at that
                number (including via automated technology) about this request.
                Consent is not required to use the site.
              </span>
            </label>
          )}
        </div>

        <button
          type="submit"
          className="button-primary w-full"
          disabled={!requiredOk || status === "submitting"}
        >
          {status === "submitting" ? "Submitting..." : "Get matched"}
        </button>

        {status === "success" && (
          <p className="text-sm text-emerald-700">
            Submitted. We’ll follow up with the best next step shortly.
          </p>
        )}
        {status === "error" && (
          <p className="text-sm text-red-700">
            Something went wrong. Please try again in a moment.
          </p>
        )}

        <p className="text-xs text-slate-500">
          By submitting, you agree to our Privacy Policy. We may earn compensation
          from partners. This does not affect your rate eligibility.
        </p>
      </form>
    </div>
  );
}

