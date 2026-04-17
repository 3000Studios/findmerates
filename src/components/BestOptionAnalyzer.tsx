import React, { useState } from "react";
import { GoogleGenAI, Type } from "@google/genai";
import { ArrowRight, CheckCircle2, Info, Loader2, Sparkles, Zap } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

type Goal = "lowest_payment" | "lowest_interest" | "max_yield" | "fast_approval";

export default function BestOptionAnalyzer() {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("");
  const [goal, setGoal] = useState<Goal>("lowest_payment");
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<{
    title: string;
    reason: string;
    action: string;
    pros: string[];
  } | null>(null);

  const categories = [
    { id: "mortgage", label: "Home Mortgage" },
    { id: "cd", label: "Savings / CD" },
    { id: "auto_loan", label: "Auto Loan" },
    { id: "personal_loan", label: "Personal Loan" },
  ];

  const goals: Record<Goal, string> = {
    lowest_payment: "Lowest Monthly Payment",
    lowest_interest: "Lowest Total Interest Cost",
    max_yield: "Maximum Savings Yield",
    fast_approval: "Fastest Approval Time",
  };

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;
      if (!apiKey) {
        setRecommendation({
          title: "Live AI analysis unavailable",
          reason:
            "The AI key is not configured, so advanced analysis cannot run right now. You can still compare live rates and use the calculators.",
          action: "Set VITE_GEMINI_API_KEY in your deployment environment and rerun this analysis.",
          pros: [
            "Core rates still load live",
            "Calculators remain available",
            "No data loss from this limitation",
          ],
        });
        setStep(3);
        return;
      }
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze the best financial option for a user interested in ${category} with a primary goal of ${goals[goal]}.`,
        config: {
          systemInstruction:
            "You are a senior financial analyst. Provide a concise, plain-English recommendation. Return JSON format.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              reason: { type: Type.STRING },
              action: { type: Type.STRING },
              pros: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["title", "reason", "action", "pros"],
          },
        },
      });

      setRecommendation(JSON.parse(response.text || "{}"));
      setStep(3);
    } catch (error) {
      console.error("Analysis error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-slate-200/80 bg-white p-6">
        <div className="section-kicker">AI analysis</div>
        <h2 className="mt-3 flex items-center gap-3 text-3xl text-slate-950">
          <Zap className="h-6 w-6 text-brand-700" />
          Best option analyzer
        </h2>
        <p className="mt-3 text-slate-600">
          A simpler guided flow that turns a rate category into an action.
        </p>
      </div>

      <div className="p-6">
        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            <h3 className="text-lg text-slate-950">Select a category</h3>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setCategory(cat.id);
                    setStep(2);
                  }}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-left transition-colors hover:border-brand-200 hover:bg-brand-50"
                >
                  <div className="text-sm font-semibold text-slate-950">{cat.label}</div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            <h3 className="text-lg text-slate-950">Primary objective</h3>
            <div className="space-y-3">
              {(Object.keys(goals) as Goal[]).map((g) => (
                <button
                  key={g}
                  onClick={() => setGoal(g)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-3xl border px-4 py-4 text-left transition-colors",
                    goal === g
                      ? "border-brand-900 bg-brand-900 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:border-brand-200 hover:bg-brand-50",
                  )}
                >
                  <span className="text-sm font-semibold">{goals[g]}</span>
                  {goal === g && <CheckCircle2 className="h-5 w-5" />}
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setStep(1)}
                className="text-sm font-semibold text-slate-500 hover:text-slate-900"
              >
                Back
              </button>
              <button onClick={handleAnalyze} disabled={loading} className="button-primary">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Analyze
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && recommendation && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            <div className="rounded-[24px] bg-brand-50 p-5">
              <h3 className="text-2xl text-slate-950">{recommendation.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{recommendation.reason}</p>
            </div>

            <div className="space-y-3">
              {recommendation.pros.map((pro, i) => (
                <div key={i} className="flex items-start gap-3 rounded-3xl border border-slate-200 bg-white p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
                  <span className="text-sm text-slate-700">{pro}</span>
                </div>
              ))}
            </div>

            <div className="rounded-[24px] border border-brand-200 bg-white p-5">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-5 w-5 text-brand-700" />
                <div>
                  <p className="text-sm font-semibold text-slate-950">Next step</p>
                  <p className="mt-1 text-sm leading-7 text-slate-600">{recommendation.action}</p>
                </div>
              </div>
              <button onClick={() => setStep(1)} className="button-secondary mt-5 w-full">
                Reset <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
