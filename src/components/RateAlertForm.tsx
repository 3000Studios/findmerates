import React, { useState } from "react";
import { Bell, Loader2, Mail, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { playUiSound } from "../lib/sound";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { trackEvent } from "../lib/analytics";

export default function RateAlertForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setError(null);
    setLoading(true);
    try {
      await addDoc(collection(db, "rateAlertSignups"), {
        email: email.trim(),
        source: "home_rate_alert",
        path: typeof window !== "undefined" ? window.location.pathname : null,
        createdAt: serverTimestamp(),
        uid: auth.currentUser?.uid || null,
      });
      void trackEvent("rate_alert_signup", { email: email.trim() });
      setSubmitted(true);
      playUiSound("click");
    } catch (err) {
      console.error("Rate alert signup failed", err);
      setError("Could not save your alert. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-[32px] bg-emerald-50 p-8 text-center border border-emerald-100"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-bold text-emerald-900">You're on the list!</h3>
        <p className="mt-2 text-emerald-700">We'll alert you the moment rates drop in your area.</p>
      </motion.div>
    );
  }

  return (
    <div className="rounded-[32px] bg-brand-900 p-8 text-white shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-6 opacity-10">
        <Bell className="h-24 w-24" />
      </div>
      <div className="relative z-10">
        <div className="section-kicker text-brand-100">Smart Alerts</div>
        <h3 className="mt-2 text-2xl font-bold">Never miss a rate drop.</h3>
        <p className="mt-3 text-brand-100/70 text-sm leading-relaxed">
          Get an instant email when lender benchmarks shift in your favor. No spam, just market intelligence.
        </p>
        
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-300" />
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl bg-white/10 border border-white/20 px-11 py-4 text-white placeholder:text-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-400 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="button-primary bg-white text-brand-900 hover:bg-brand-50 w-full justify-center py-4 text-base"
            onMouseEnter={() => playUiSound("hover")}
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Set Free Alert"}
          </button>
          {error && <p className="text-xs text-red-300">{error}</p>}
        </form>
        
        <p className="mt-4 text-[10px] text-center text-brand-300 flex items-center justify-center gap-2">
          <ShieldCheck className="h-3 w-3" />
          Bank-level encryption. Your data is never sold.
        </p>
      </div>
    </div>
  );
}
