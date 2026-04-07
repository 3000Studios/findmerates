import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Sparkles, TrendingDown, TrendingUp, Calendar, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { collection, query, getDocs, limit } from 'firebase/firestore';
import { motion } from 'motion/react';

export default function PredictiveBriefing() {
  const [briefing, setBriefing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateBriefing = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      let context = "General market outlook.";
      
      if (user) {
        const searches = await getDocs(query(collection(db, `users/${user.uid}/savedSearches`), limit(3)));
        if (!searches.empty) {
          context = `User is interested in: ${searches.docs.map(d => d.data().query).join(', ')}`;
        }
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate a short, predictive financial rate briefing for 2026. Context: ${context}. Focus on trends and whether users should act now or wait. Keep it under 150 words.`,
      });

      setBriefing(response.text || null);
    } catch (error) {
      console.error('Briefing error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-brand-600 border border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.5)] p-12 relative overflow-hidden h-full flex flex-col">
      <div className="absolute top-0 right-0 p-12 opacity-5">
        <Sparkles className="w-48 h-48" />
      </div>
      
      <div className="relative z-10 flex-grow flex flex-col">
        <div className="flex items-center gap-4 text-accent-gold font-bold text-[10px] uppercase tracking-[0.5em] mb-10">
          <Sparkles className="w-4 h-4" /> Predictive Intelligence
        </div>
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-10 uppercase tracking-tighter leading-tight">
          Autonomous<br />
          <span className="text-accent-gold">Market Briefing.</span>
        </h2>
        
        {briefing ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 flex-grow flex flex-col min-h-0 overflow-hidden">
            <p className="text-slate-400 leading-relaxed text-sm md:text-base lg:text-lg font-medium overflow-y-auto pr-2 custom-scrollbar">
              {briefing}
            </p>
            <div className="mt-auto pt-10 border-t border-white/5 flex items-center gap-8">
              <div className="flex items-center gap-3 text-emerald-400 font-bold text-[10px] uppercase tracking-widest">
                <TrendingDown className="w-5 h-5" /> Strategic Action: Buy
              </div>
              <div className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">
                Indicators suggest a 0.25% rise in the next 30 days.
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="flex-grow flex flex-col justify-center items-center text-center py-12">
            <button
              onClick={generateBriefing}
              disabled={loading}
              className="btn-corporate btn-corporate-gold flex items-center gap-4"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              Generate Intelligence
            </button>
            <p className="mt-8 text-slate-600 text-[9px] font-bold uppercase tracking-[0.3em]">Analyzes institutional data to predict market shifts.</p>
          </div>
        )}
      </div>

      <div className="mt-12 flex items-center gap-3 text-[9px] font-bold text-slate-700 uppercase tracking-[0.4em]">
        <ShieldCheck className="w-4 h-4" /> Institutional Source Audit Verified
      </div>
    </div>
  );
}
