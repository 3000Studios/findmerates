import React, { useState } from "react";
import { GoogleGenAI } from "@google/genai";
import { ArrowRight, Loader2, Sparkles, TrendingDown } from "lucide-react";
import { auth, db } from "../lib/firebase";
import { collection, getDocs, limit, query } from "firebase/firestore";

export default function PredictiveBriefing() {
  const [briefing, setBriefing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateBriefing = async () => {
    setLoading(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;
      if (!apiKey) {
        setBriefing(
          "Live briefing is temporarily unavailable because the AI key is missing. You can still compare current live rates and use the calculators.",
        );
        return;
      }
      const user = auth.currentUser;
      let context = "General market outlook.";

      if (user) {
        const searches = await getDocs(
          query(collection(db, `users/${user.uid}/savedSearches`), limit(3)),
        );
        if (!searches.empty) {
          context = `User is interested in: ${searches.docs.map((d) => d.data().query).join(", ")}`;
        }
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a short predictive financial rate briefing for 2026. Context: ${context}. Keep it under 150 words.`,
      });

      setBriefing(response.text || null);
    } catch (error) {
      console.error("Briefing error:", error);
      setBriefing(
        "We could not generate the live briefing right now. Please try again in a moment.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card relative overflow-hidden p-6 text-slate-950">
      <div className="absolute right-0 top-0 p-6 opacity-10">
        <Sparkles className="h-24 w-24" />
      </div>

      <div className="relative">
        <div className="section-kicker">AI briefing</div>
        <h2 className="mt-3 text-3xl text-slate-950">Your personalized rate briefing</h2>

        {briefing ? (
          <div className="mt-6 space-y-5">
            <p className="text-sm leading-7 text-slate-600">{briefing}</p>
            <div className="flex items-center justify-between rounded-3xl bg-brand-50 px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                <TrendingDown className="h-4 w-4" />
                Action bias
              </div>
              <span className="text-sm text-slate-500">Act now if locking a rate matters</span>
            </div>
          </div>
        ) : (
          <div className="mt-8 text-center">
            <button onClick={generateBriefing} disabled={loading} className="button-primary w-full">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Generate briefing
            </button>
            <p className="mt-3 text-sm text-slate-500">Creates a quick summary from your recent activity.</p>
          </div>
        )}
      </div>
    </div>
  );
}
