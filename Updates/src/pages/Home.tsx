import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, TrendingUp, Home as HomeIcon, CreditCard, Wallet, ArrowRight, Zap, ShieldCheck, Star, Clock, MessageSquare, Newspaper, TrendingDown, Sparkles, ChevronRight, Play } from 'lucide-react';
import { Story, RateCategory } from '../types';
import { cn } from '../lib/utils';
import { motion, useScroll, useTransform } from 'motion/react';
import MortgageCalculator from '../components/MortgageCalculator';
import BestOptionAnalyzer from '../components/BestOptionAnalyzer';
import PredictiveBriefing from '../components/PredictiveBriefing';
import { fetchLatestFinancialNews } from '../services/intelligenceService';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [topStories, setTopStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);

  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      const news = await fetchLatestFinancialNews('general');
      setTopStories(news);
      setLoading(false);
    };
    loadNews();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/rates/mortgage?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const categories = [
    { id: 'mortgage', name: 'Mortgages', icon: HomeIcon, color: 'text-accent-gold', img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800' },
    { id: 'cd', name: 'CD Rates', icon: Wallet, color: 'text-accent-gold', img: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=800' },
    { id: 'auto_loan', name: 'Auto Loans', icon: CreditCard, color: 'text-accent-gold', img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800' },
    { id: 'personal_loan', name: 'Personal', icon: TrendingUp, color: 'text-accent-gold', img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800' },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section with Video */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover grayscale brightness-[0.2]"
          >
            <source src="https://player.vimeo.com/external/434045526.sd.mp4?s=c27dc3699069539d210fd3b70d05d73b9c48dc1f&profile_id=164&oauth2_token_id=57447761" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-brand-900/40" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="flex items-center justify-center gap-4 mb-12">
              <span className="w-12 h-px bg-accent-gold" />
              <span className="text-[10px] font-bold text-accent-gold uppercase tracking-[0.5em]">Autonomous Financial Intelligence</span>
              <span className="w-12 h-px bg-accent-gold" />
            </div>
            
            <h1 className="text-7xl md:text-[160px] font-display font-bold mb-12 uppercase tracking-tighter leading-[0.85] text-white">
              FindMe<span className="text-accent-gold">Rates.</span>
            </h1>
            
            <p className="text-xl md:text-3xl text-slate-500 max-w-4xl mx-auto mb-20 font-medium leading-relaxed uppercase tracking-tight">
              The world's most advanced autonomous rate tracking engine. <br className="hidden md:block" />
              Institutional intelligence for the modern investor.
            </p>

            <form onSubmit={handleSearch} className="max-w-3xl mx-auto relative group">
              <input
                type="text"
                placeholder="Search institutional rates (e.g. 30yr Fixed, 5yr CD)..."
                className="w-full bg-brand-600 border border-white/10 px-10 py-8 text-white text-lg placeholder:text-slate-700 focus:outline-none focus:border-accent-gold/50 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-accent-gold text-brand-900 p-5 hover:bg-white transition-colors">
                <Search className="w-6 h-6" />
              </button>
            </form>
          </motion.div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30">
          <span className="text-[8px] font-bold uppercase tracking-[0.5em] text-white">Initialize Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-accent-gold to-transparent" />
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative overflow-hidden aspect-[4/5] bg-brand-600 border border-white/5"
            >
              <img 
                src={cat.img} 
                alt={cat.name} 
                className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.3] group-hover:scale-110 group-hover:brightness-[0.5] transition-all duration-700" 
              />
              <div className="absolute inset-0 p-12 flex flex-col justify-between z-10">
                <cat.icon className="w-10 h-10 text-accent-gold" />
                <div>
                  <h3 className="text-3xl font-display font-bold text-white mb-6 uppercase tracking-tight">{cat.name}</h3>
                  <Link to={`/rates/${cat.id}`} className="inline-flex items-center gap-3 text-[10px] font-bold text-accent-gold uppercase tracking-[0.3em] hover:text-white transition-colors">
                    Explore Sector <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Intelligence & Tools Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-1">
          <div className="lg:col-span-8">
            <MortgageCalculator />
          </div>
          <div className="lg:col-span-4 space-y-1">
            <BestOptionAnalyzer />
            <PredictiveBriefing />
          </div>
        </div>
      </section>

      {/* News / Stories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="flex items-end justify-between mb-20">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <span className="w-8 h-px bg-accent-gold" />
              <span className="text-accent-gold font-bold uppercase tracking-[0.5em] text-[10px]">Financial Intelligence</span>
            </div>
            <h2 className="text-5xl md:text-8xl font-display font-bold text-white uppercase tracking-tighter">Market <span className="text-accent-gold">Briefings.</span></h2>
          </div>
          <Link to="/stories" className="hidden md:flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] hover:text-white transition-colors">
            View All Intelligence <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
          {topStories.map((story, i) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group"
            >
              <Link to={`/stories/${story.slug}`} className="block bg-brand-600 border border-white/5 p-12 hover:border-accent-gold/50 transition-all h-full">
                <div className="flex items-center gap-3 text-accent-gold font-bold text-[9px] uppercase tracking-widest mb-8">
                  <Clock className="w-4 h-4" /> {new Date(story.publishedAt).toLocaleDateString()}
                </div>
                <h4 className="text-xl md:text-2xl font-display font-bold text-white mb-8 uppercase tracking-tight group-hover:text-accent-gold transition-colors group-hover:scale-[1.02] origin-left truncate">
                  {story.title}
                </h4>
                <p className="text-slate-500 text-xs font-medium leading-relaxed uppercase tracking-widest line-clamp-3">
                  {story.excerpt}
                </p>
                <div className="mt-12 flex items-center gap-3 text-white font-bold text-[9px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  Read Full Intel <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* AdSense Placement */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="ad-slot">
          <div className="text-center">
            <p className="text-slate-700 mb-2">ADVERTISEMENT</p>
            <div className="w-full h-px bg-white/5 mb-2" />
            <p className="text-slate-800">GOOGLE ADSENSE PLACEMENT</p>
          </div>
        </div>
      </section>

      {/* Pro CTA */}
      <section className="bg-accent-gold py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className="w-12 h-px bg-brand-900" />
            <span className="text-[10px] font-bold text-brand-900 uppercase tracking-[0.5em]">Premium Access</span>
            <span className="w-12 h-px bg-brand-900" />
          </div>
          <h2 className="text-6xl md:text-9xl font-display font-bold text-brand-900 mb-12 uppercase tracking-tighter leading-[0.85]">
            Unlock Institutional<br />
            <span className="opacity-50">Intelligence.</span>
          </h2>
          <Link to="/pro" className="btn-corporate bg-brand-900 text-white border-none inline-flex items-center gap-4 text-xl">
            Initialize Pro Subscription <Zap className="w-6 h-6" />
          </Link>
        </div>
      </section>
    </div>
  );
}
