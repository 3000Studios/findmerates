import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { auth, googleProvider, db } from "../lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { trackEvent } from "../lib/analytics";

export default function Signup() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const redirectChecked = useRef(false);

  const upsertUser = async (uid: string, email: string | null, displayName: string | null, photoURL: string | null) => {
    await setDoc(
      doc(db, "users", uid),
      {
        uid,
        email: email || "",
        displayName: displayName || "Member",
        photoURL: photoURL || null,
        isPro: false,
        role: "member",
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      },
      { merge: true },
    );
  };

  useEffect(() => {
    if (redirectChecked.current) return;
    redirectChecked.current = true;
    setBusy(true);
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          const { uid, email, displayName, photoURL } = result.user;
          await upsertUser(uid, email, displayName, photoURL);
          await trackEvent("pro_signup_success", { surface: "auth_google" });
          navigate("/dashboard");
        }
      })
      .catch(() => {
        setError("Google sign-in failed. Please try again.");
      })
      .finally(() => setBusy(false));
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === "signup") {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
      const user = auth.currentUser!;
      await upsertUser(user.uid, user.email, user.displayName, user.photoURL);
      await trackEvent("pro_signup_success", { surface: "auth_email", mode });
      navigate("/dashboard");
    } catch {
      setError("Sign-in failed. Please verify your email/password.");
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setBusy(true);
    setError(null);
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch {
      setError("Google sign-in failed. Please try again.");
      setBusy(false);
    }
  };

  return (
    <div className="section-shell py-16">
      <div className="mx-auto max-w-xl">
        <p className="section-kicker">Account</p>
        <h1 className="mt-2 text-4xl font-display font-bold text-slate-950">
          {mode === "signup" ? "Create your account" : "Sign in"}
        </h1>
        <p className="mt-4 text-slate-600">
          Save searches, manage alerts, and unlock Pro tools.
        </p>

        <div className="mt-10 card p-6">
          <button type="button" className="button-secondary w-full" onClick={google} disabled={busy}>
            Continue with Google
          </button>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-[0.24em]">
              or
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
                minLength={6}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-200"
              />
              <p className="mt-2 text-xs text-slate-500">Minimum 6 characters.</p>
            </div>

            {error && <p className="text-sm text-red-700">{error}</p>}

            <button type="submit" className="button-primary w-full" disabled={busy}>
              {busy ? "Working..." : mode === "signup" ? "Create account" : "Sign in"}
            </button>
          </form>

          <div className="mt-6 text-sm text-slate-600">
            {mode === "signup" ? (
              <button type="button" className="underline" onClick={() => setMode("signin")} disabled={busy}>
                Already have an account? Sign in
              </button>
            ) : (
              <button type="button" className="underline" onClick={() => setMode("signup")} disabled={busy}>
                New here? Create an account
              </button>
            )}
          </div>

          <p className="mt-6 text-xs text-slate-500">
            By continuing you agree to our <Link to="/terms" className="underline">Terms</Link> and{" "}
            <Link to="/privacy" className="underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

