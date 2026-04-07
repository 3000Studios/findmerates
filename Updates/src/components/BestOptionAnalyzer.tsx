import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { Zap, ArrowRight, Loader2, CheckCircle2, Info, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

type Goal = 'lowest_payment' | 'lowest_interest' | 'max_yield' | 'fast_approval';

export default function BestOptionAnalyzer() {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState('');
  const [goal, setGoal] = useState<Goal>('lowest_payment');
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<{
    title: string;
    reason: string;
    action: string;
    pros: string[];
  } | null>(null);

  const categories = [
    { id: 'mortgage', label: 'Home Mortgage', icon: '🏠' },
    { id: 'cd', label: 'Savings / CD', icon: '💰' },
    { id: 'auto_loan', label: 'Auto Loan', icon: '🚗' },
    { id: 'personal_loan', label: 'Personal Loan', icon: '💳' },
  ];

  const goals: Record<Goal, string> = {
    lowest_payment: 'Lowest Monthly Payment',
    lowest_interest: 'Lowest Total Interest Cost',
    max_yield: 'Maximum Savings Yield',
    fast_approval: 'Fastest Approval Time',
  };

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze the best financial option for a user interested in ${category} with a primary goal of ${goals[goal]}.`,
        config: {
          systemInstruction: "You are a senior financial analyst. Provide a 'Plain English' recommendation. Return JSON format.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Clear, catchy title of the recommendation" },
              reason: { type: Type.STRING, description: "Why this is the best option in 2 sentences" },
              action: { type: Type.STRING, description: "The immediate next step the user should take" },
              pros: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 key benefits" }
            },
            required: ["title", "reason", "action", "pros"]
          }
        }
      });

      const result = JSON.parse(response.text || '{}');
      setRecommendation(result);
      setStep(3);
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-brand-600 border border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden h-full flex flex-col">
      <div className="p-12 border-b border-white/5 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-white flex items-center gap-4 uppercase tracking-tight">
            <Zap className="w-6 h-6 text-accent-gold" /> Option Analyzer
          </h2>
          <p className="text-slate-500 mt-2 font-bold uppercase tracking-[0.3em] text-[9px]">Institutional grade recommendation engine.</p>
        </div>
        <div className="hidden md:flex items-center gap-3 bg-brand-900 border border-white/10 px-4 py-1.5 text-[9px] font-bold text-accent-gold uppercase tracking-widest">
          <Sparkles className="w-4 h-4" /> Powered by Gemini
        </div>
      </div>

      <div className="p-12 flex-grow flex flex-col justify-center">
        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
            <h3 className="text-xl font-display font-bold text-white text-center uppercase tracking-tight">Select Instrument</h3>
            <div className="grid grid-cols-2 gap-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setCategory(cat.id); setStep(2); }}
                  className="p-8 bg-brand-900 border border-white/5 hover:border-accent-gold/50 transition-all flex flex-col items-center gap-4 group"
                >
                  <span className="text-3xl grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all">{cat.icon}</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-white transition-colors">{cat.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
            <h3 className="text-xl font-display font-bold text-white text-center uppercase tracking-tight">Primary Objective</h3>
            <div className="grid grid-cols-1 gap-1">
              {(Object.keys(goals) as Goal[]).map((g) => (
                <button
                  key={g}
                  onClick={() => setGoal(g)}
                  className={cn(
                    "p-6 border text-left transition-all flex items-center justify-between",
                    goal === g ? "border-accent-gold bg-brand-900" : "border-white/5 bg-brand-900 hover:border-white/20"
                  )}
                >
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{goals[g]}</span>
                  {goal === g && <CheckCircle2 className="w-5 h-5 text-accent-gold" />}
                </button>
              ))}
            </div>
            <div className="flex justify-between items-center pt-8">
              <button onClick={() => setStep(1)} className="text-slate-600 font-bold uppercase tracking-widest text-[10px] hover:text-white transition-colors">Back</button>
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="btn-corporate btn-corporate-gold flex items-center gap-4"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                Execute Analysis
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && recommendation && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-900 border border-accent-gold/20 text-accent-gold flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl md:text-2xl lg:text-3xl font-display font-bold text-white mb-6 uppercase tracking-tight truncate">{recommendation.title}</h3>
              <p className="text-slate-500 text-sm md:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto font-medium">
                {recommendation.reason}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-1">
              {recommendation.pros.map((pro, i) => (
                <div key={i} className="bg-brand-900 p-6 border border-white/5 flex items-start gap-4">
                  <div className="w-5 h-5 bg-accent-gold/10 text-accent-gold flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{pro}</span>
                </div>
              ))}
            </div>

            <div className="bg-brand-900 p-8 border border-accent-gold/20 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-start gap-6">
                <Info className="w-6 h-6 text-accent-gold shrink-0 mt-1" />
                <div>
                  <p className="font-bold text-white uppercase tracking-widest text-xs">Strategic Next Step</p>
                  <p className="text-sm text-slate-500 mt-1 font-medium">{recommendation.action}</p>
                </div>
              </div>
              <button
                onClick={() => setStep(1)}
                className="btn-corporate bg-white/5 text-white border-white/10 hover:bg-white/10 flex items-center gap-4"
              >
                Reset <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
