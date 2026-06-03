import React, { useState, useEffect } from 'react';
import { Download, Loader2, ShieldCheck, Sparkles, ArrowLeft, FileText } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { generateProGuide } from '../services/intelligenceService';
import Markdown from 'react-markdown';
import { motion } from 'motion/react';

export default function ProGuide() {
  const [guideContent, setGuideContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate('/');
        return;
      }

      const userSnap = await getDoc(doc(db, 'users', user.uid));
      if (userSnap.exists() && userSnap.data().isPro) {
        setIsPro(true);
        const content = await generateProGuide();
        setGuideContent(content);
      } else {
        navigate('/pro');
      }
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const handleDownload = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-900">
        <div className="flex flex-col items-center gap-6">
          <Loader2 className="w-12 h-12 text-accent-gold animate-spin" />
          <p className="text-accent-gold font-bold uppercase tracking-[0.5em] text-[10px]">Synthesizing Institutional Intelligence</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-32">
      <section className="relative pt-32 pb-48 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-brand-900/80 z-10" />
        <div className="absolute inset-0 -z-10">
          <img 
            src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=2000" 
            alt="Corporate" 
            className="w-full h-full object-cover grayscale brightness-[0.1]" 
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <Link to="/" className="inline-flex items-center gap-3 text-slate-500 hover:text-white transition-colors mb-12 text-[10px] font-bold uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" /> Back to Intelligence
          </Link>
          
          <div className="flex items-center gap-4 mb-8">
            <span className="w-12 h-px bg-accent-gold" />
            <span className="text-accent-gold font-bold uppercase tracking-[0.5em] text-[10px]">Premium Asset</span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
            <div>
              <h1 className="text-6xl md:text-9xl font-display font-bold text-white mb-8 uppercase tracking-tighter leading-[0.9]">
                Rate Finder<br />
                <span className="text-accent-gold">Pro Guide.</span>
              </h1>
              <p className="text-slate-500 text-xl max-w-2xl font-medium leading-relaxed">
                The definitive blueprint for institutional financial optimization. 50+ pages of high-value intelligence, negotiation secrets, and predictive modeling.
              </p>
            </div>
            
            <button 
              onClick={handleDownload}
              className="inline-flex items-center gap-4 bg-accent-gold text-brand-900 font-bold uppercase tracking-widest text-sm px-8 py-4 hover:bg-accent-gold/90 transition-colors rounded-xl"
            >
              Download PDF <Download className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="bg-brand-600 border border-white/5 p-12 md:p-24 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5">
            <FileText className="w-64 h-64" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-16 pb-8 border-b border-white/5">
              <div className="w-12 h-12 bg-accent-gold text-brand-900 flex items-center justify-center font-display font-bold text-xl">F</div>
              <div>
                <p className="text-white font-bold uppercase tracking-widest text-xs">FindMeRates.com</p>
                <p className="text-slate-500 text-[9px] font-bold uppercase tracking-[0.3em]">Institutional Intelligence Division</p>
              </div>
              <div className="ml-auto flex items-center gap-3 text-[9px] font-bold text-accent-gold uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" /> Classified Pro Asset
              </div>
            </div>

            <div className="prose prose-invert prose-slate max-w-none prose-headings:font-display prose-headings:uppercase prose-headings:tracking-tight prose-headings:text-white prose-p:text-slate-400 prose-p:leading-relaxed prose-p:text-lg prose-strong:text-accent-gold prose-li:text-slate-400">
              <Markdown>{guideContent || ''}</Markdown>
            </div>

            <div className="mt-32 pt-12 border-t border-white/5 text-center">
              <p className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.5em]">
                © 2026 FindMeRates.com Intelligence Division. Unauthorized distribution is strictly prohibited.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
