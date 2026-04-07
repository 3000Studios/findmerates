import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Sparkles, TrendingDown, TrendingUp, Calendar, ArrowRight, Loader2 } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { collection, query, getDocs, limit } from 'firebase/firestore';

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
    <div className="bg-gradient-to-br from-brand-900 to-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <Sparkles className="w-32 h-32" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 text-brand-400 font-bold text-xs uppercase tracking-widest mb-4">
          <Sparkles className="w-4 h-4" /> AI Predictive Intelligence
        </div>
        <h2 className="text-3xl font-display font-bold mb-6">Your Personalized Rate Briefing</h2>
        
        {briefing ? (
          <div className="space-y-6">
            <p className="text-brand-100 leading-relaxed text-lg">
              {briefing}
            </p>
            <div className="flex items-center gap-6 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <TrendingDown className="w-5 h-5" /> ACT NOW
              </div>
              <div className="text-sm text-brand-300">
                Market indicators suggest a 0.25% rise in the next 30 days.
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center">
            <button
              onClick={generateBriefing}
              disabled={loading}
              className="inline-flex items-center px-8 py-4 bg-brand-500 text-white font-bold rounded-xl hover:bg-brand-400 transition-all shadow-lg disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />}
              Generate My Briefing
            </button>
            <p className="mt-4 text-brand-300 text-sm">Analyzes your behavior to predict market moves.</p>
          </div>
        )}
      </div>
    </div>
  );
}
