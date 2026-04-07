import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, Clock, ArrowRight, MessageSquare, ChevronRight, Loader2, Sparkles } from 'lucide-react';
import { Story } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { fetchLatestFinancialNews } from '../services/intelligenceService';

export default function Stories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStories = async () => {
      setIsLoading(true);
      const news = await fetchLatestFinancialNews('general');
      setStories(news);
      setIsLoading(false);
    };
    loadStories();
  }, []);

  return (
    <div className="pb-32">
      {/* Hero Section */}
      <section className="relative pt-32 pb-48 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-brand-900/80 z-10" />
        <div className="absolute inset-0 -z-10">
          <img 
            src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=2000" 
            alt="Market" 
            className="w-full h-full object-cover grayscale brightness-[0.1]" 
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <nav className="flex items-center gap-4 text-[10px] font-bold text-accent-gold mb-12 uppercase tracking-[0.5em]">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">Intelligence Feed</span>
          </nav>
          <h1 className="text-6xl md:text-9xl font-display font-bold text-white mb-8 uppercase tracking-tighter leading-[0.9]">
            Market<br />
            <span className="text-accent-gold">Intelligence.</span>
          </h1>
          <p className="text-slate-500 text-xl max-w-2xl font-medium leading-relaxed">
            Autonomous financial reporting synthesized from global market data. Real-time updates on interest rates, inflation, and institutional shifts.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-1">
          <div className="lg:col-span-8 space-y-4">
            {isLoading ? (
              <div className="bg-brand-600 p-24 text-center border border-white/5">
                <Loader2 className="w-12 h-12 text-accent-gold animate-spin mx-auto mb-6" />
                <p className="text-accent-gold font-bold uppercase tracking-[0.5em] text-[10px]">Synchronizing Feeds</p>
              </div>
            ) : (
              stories.map((story, i) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group overflow-hidden"
                >
                  <Link
                    to={`/stories/${story.slug}`}
                    className="flex flex-col md:flex-row gap-6 md:gap-12 bg-brand-600 p-6 md:p-12 border border-white/5 hover:border-accent-gold/50 transition-all"
                  >
                    <div className="md:w-1/3 aspect-square overflow-hidden border border-white/5 shrink-0">
                      <img
                        src={story.imageUrl}
                        alt={story.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="md:w-2/3 flex flex-col justify-center min-w-0">
                      <div className="flex items-center gap-6 text-[9px] font-bold text-slate-600 mb-6 uppercase tracking-[0.3em]">
                        <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {new Date(story.publishedAt).toLocaleDateString()}</span>
                        <span className="text-accent-gold">{story.category}</span>
                      </div>
                      <h2 className="text-xl md:text-3xl font-display font-bold text-white mb-6 group-hover:text-accent-gold transition-all group-hover:scale-[1.02] origin-left uppercase tracking-tight leading-tight truncate">
                        {story.title}
                      </h2>
                      <p className="text-slate-500 leading-relaxed mb-10 line-clamp-2 font-medium text-xs md:text-sm uppercase tracking-widest">
                        {story.excerpt}
                      </p>
                      <div className="flex items-center gap-3 text-[10px] font-bold text-white uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-opacity">
                        Read Intelligence <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </div>

          <div className="lg:col-span-4 space-y-1">
            <div className="ad-slot h-[600px]">Vertical Ad Placement</div>
            
            <div className="bg-brand-900 border border-white/5 p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-5">
                <Sparkles className="w-32 h-32" />
              </div>
              <h3 className="text-2xl font-display font-bold text-white mb-8 uppercase tracking-tight leading-tight">Institutional<br />Updates.</h3>
              <p className="text-slate-500 mb-12 font-medium leading-relaxed text-sm">Subscribe to our autonomous intelligence feed for hourly market shifts.</p>
              <form className="space-y-4">
                <input
                  type="email"
                  placeholder="Institutional Email"
                  className="w-full px-8 py-6 bg-brand-600 border border-white/10 text-white placeholder-slate-700 focus:outline-none focus:border-accent-gold/50 font-bold uppercase tracking-widest text-[10px]"
                />
                <button className="btn-corporate btn-corporate-gold w-full">
                  Initialize Sync
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
