import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Newspaper, Clock, ArrowRight, MessageSquare, ChevronRight, TrendingUp, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import { Story, RateResult, RateCategory } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { fetchLatestFinancialNews, generateMarketRates } from '../services/intelligenceService';
import RateCard from '../components/RateCard';

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [stories, setStories] = useState<Story[]>([]);
  const [rates, setRates] = useState<RateResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      if (categoryId) {
        const [newsData, rateData] = await Promise.all([
          fetchLatestFinancialNews(categoryId),
          generateMarketRates(categoryId as RateCategory)
        ]);
        setStories(newsData);
        setRates(rateData);
      }
      setLoading(false);
    };
    loadData();
  }, [categoryId]);

  const categoryTitles: Record<string, string> = {
    mortgage: 'Home Mortgages',
    cd: 'Certificate of Deposit',
    auto_loan: 'Auto Financing',
    personal_loan: 'Personal Credit',
    savings: 'High-Yield Savings',
    trends: 'Market Intelligence'
  };

  const title = categoryTitles[categoryId || ''] || 'Financial Intelligence';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-900">
        <div className="flex flex-col items-center gap-6">
          <Loader2 className="w-12 h-12 text-accent-gold animate-spin" />
          <p className="text-accent-gold font-bold uppercase tracking-[0.5em] text-[10px]">Synchronizing Market Data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-32">
      {/* Hero Section */}
      <section className="relative pt-32 pb-48 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-brand-900/60 z-10" />
        <div className="absolute inset-0 -z-10">
          <img 
            src={`https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=2000&sig=${categoryId}`} 
            alt={title} 
            className="w-full h-full object-cover grayscale brightness-[0.2]" 
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="flex items-center gap-4 mb-8">
            <span className="w-12 h-px bg-accent-gold" />
            <span className="text-accent-gold font-bold uppercase tracking-[0.5em] text-[10px]">Institutional Intelligence</span>
          </div>
          <h1 className="text-6xl md:text-9xl font-display font-bold text-white mb-8 uppercase tracking-tighter leading-[0.9]">
            {title.split(' ')[0]}<br />
            <span className="text-accent-gold">{title.split(' ').slice(1).join(' ')}</span>
          </h1>
          <p className="text-slate-500 text-xl max-w-2xl font-medium leading-relaxed">
            Real-time analysis and predictive modeling for {title.toLowerCase()}. Our autonomous systems track thousands of data points to bring you the most accurate market position.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-1">
          {/* Rates Section */}
          <div className="lg:col-span-8 space-y-1">
            <div className="bg-brand-600 p-12 border border-white/5 flex items-center justify-between">
              <h2 className="text-2xl font-display font-bold text-white uppercase tracking-tight">Current Market Rates</h2>
              <div className="flex items-center gap-3 text-[9px] font-bold text-accent-gold uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" /> Verified Data
              </div>
            </div>
            {rates.map((rate) => (
              <RateCard key={rate.id} result={rate} />
            ))}
            {rates.length === 0 && (
              <div className="bg-brand-600 p-24 text-center border border-white/5">
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No live rates found for this sector.</p>
              </div>
            )}
          </div>

          {/* Sidebar / News Section */}
          <div className="lg:col-span-4 space-y-1">
            <div className="bg-accent-gold p-12 text-brand-900">
              <h3 className="text-xl font-display font-bold uppercase tracking-tight mb-4">Market Briefing</h3>
              <p className="text-brand-900/70 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                Autonomous updates synthesized from global financial feeds.
              </p>
            </div>
            
            {stories.map((story, i) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <Link to={`/stories/${story.slug}`} className="block bg-brand-600 border border-white/5 p-8 hover:border-accent-gold/50 transition-all">
                  <div className="flex items-center gap-3 text-accent-gold font-bold text-[9px] uppercase tracking-widest mb-4">
                    <Clock className="w-3 h-3" /> {new Date(story.publishedAt).toLocaleDateString()}
                  </div>
                  <h4 className="text-white font-display font-bold text-lg mb-4 uppercase tracking-tight group-hover:text-accent-gold transition-colors group-hover:scale-[1.02] origin-left">
                    {story.title}
                  </h4>
                  <p className="text-slate-500 text-[10px] font-medium leading-relaxed uppercase tracking-widest line-clamp-2">
                    {story.excerpt}
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-white font-bold text-[9px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    Read Intelligence <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* AdSense Placeholder */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
        <div className="ad-slot">
          <div className="text-center">
            <p className="text-slate-700 mb-2">ADVERTISEMENT</p>
            <div className="w-full h-px bg-white/5 mb-2" />
            <p className="text-slate-800">GOOGLE ADSENSE PLACEMENT</p>
          </div>
        </div>
      </div>
    </div>
  );
}
