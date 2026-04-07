import React, { useState } from 'react';
import { Check, Zap, Star, ShieldCheck, ArrowRight, Download, Bell, Search, CreditCard, Sparkles, Globe, BarChart3, Lock, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { auth, db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function Pro() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubscribe = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert('Please sign in to subscribe.');
      return;
    }

    setLoading(true);
    try {
      // Simulate Stripe checkout and success
      await updateDoc(doc(db, 'users', user.uid), {
        isPro: true,
        hasSeenProWelcome: false // Reset to show modal on next load
      });
      
      // Redirect to home where the modal will trigger
      navigate('/');
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: Bell, title: 'Instant Rate Alerts', desc: 'Get notified the second rates drop below your target.' },
    { icon: Search, title: 'Advanced Search', desc: 'Filter by credit score, LTV, and hyper-local data.' },
    { icon: Zap, title: 'Priority Updates', desc: 'See new rates up to 4 hours before free users.' },
    { icon: Download, title: 'Rate Finder Pro Guide', desc: 'Exclusive 50-page guide to mastering financial rates.' },
  ];

  return (
    <div className="pb-32">
      <section className="relative pt-48 pb-64 text-white overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-brand-900/80 z-0" />
        <div className="absolute inset-0 -z-10">
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000" 
            alt="Corporate" 
            className="w-full h-full object-cover grayscale brightness-[0.1]" 
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="flex items-center justify-center gap-4 mb-12">
              <span className="w-12 h-px bg-accent-gold" />
              <span className="text-[10px] font-bold text-accent-gold uppercase tracking-[0.5em]">Premium Intelligence Tier</span>
              <span className="w-12 h-px bg-accent-gold" />
            </div>
            
            <h1 className="text-6xl md:text-[120px] font-display font-bold mb-12 uppercase tracking-tighter leading-[0.9]">
              FindMeRates <span className="text-accent-gold">PRO.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto mb-24 font-medium leading-relaxed">
              The ultimate tool for institutional-grade financial optimization. Save thousands with real-time intelligence and automated predictive alerts.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-1 items-stretch">
            <div className="lg:col-span-7 bg-brand-600 border border-white/5 p-12 md:p-24 text-left">
              <h2 className="text-3xl font-display font-bold text-white mb-12 uppercase tracking-tight">Institutional Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {[
                  { icon: BarChart3, title: 'Predictive Modeling', desc: 'AI-driven rate forecasts' },
                  { icon: Globe, title: 'Global Coverage', desc: 'International market data' },
                  { icon: Lock, title: 'Priority Access', desc: 'Early rate shift alerts' },
                  { icon: ShieldCheck, title: 'Verified Data', desc: 'Institutional source audit' },
                  { icon: Bell, title: 'Custom Alerts', desc: 'Real-time push notifications' },
                  { icon: Search, title: 'Deep Search', desc: 'Hyper-local data filtering' },
                ].map((feature) => (
                  <div key={feature.title} className="flex gap-6">
                    <feature.icon className="w-6 h-6 text-accent-gold shrink-0" />
                    <div>
                      <h4 className="text-white text-sm font-bold uppercase tracking-widest mb-2">{feature.title}</h4>
                      <p className="text-slate-500 text-xs font-medium leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 bg-accent-gold p-12 md:p-24 flex flex-col justify-between text-left">
              <div>
                <div className="flex justify-between items-center mb-12">
                  <h3 className="text-brand-900 text-2xl font-display font-bold uppercase tracking-tight">Pro Access</h3>
                  <span className="px-4 py-1 bg-brand-900 text-white text-[9px] font-bold uppercase tracking-widest">Annual Plan</span>
                </div>
                <div className="flex items-baseline gap-2 mb-12">
                  <span className="text-8xl font-display font-bold text-brand-900">$49</span>
                  <span className="text-brand-900/60 text-xl font-bold uppercase tracking-widest">/mo</span>
                </div>
                <ul className="space-y-6 mb-16">
                  {['Unlimited Rate Comparisons', 'Real-time AI Briefings', 'Custom Rate Alerts', 'API Access (Beta)', 'Priority Support'].map((item) => (
                    <li key={item} className="flex items-center gap-4 text-brand-900 text-sm font-bold uppercase tracking-widest">
                      <div className="w-2 h-2 bg-brand-900" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <button 
                onClick={handleSubscribe}
                disabled={loading}
                className="w-full btn-corporate bg-brand-900 text-white border-none flex items-center justify-center gap-4 text-lg disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6" />}
                Initialize Subscription <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
          {features.map((f, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-12 bg-brand-600 border border-white/5 hover:border-accent-gold/50 transition-all group"
            >
              <div className="w-12 h-12 bg-brand-900 border border-white/5 flex items-center justify-center text-accent-gold mb-10 group-hover:scale-110 transition-transform">
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-display font-bold text-white mb-6 uppercase tracking-tight">{f.title}</h3>
              <p className="text-slate-500 text-xs font-medium leading-relaxed uppercase tracking-widest">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pro Guide Teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-600 border border-white/5 flex flex-col lg:flex-row items-stretch">
          <div className="p-12 lg:p-24 flex-grow">
            <div className="flex items-center gap-4 mb-8">
              <span className="w-8 h-px bg-accent-gold" />
              <span className="text-accent-gold font-bold uppercase tracking-[0.5em] text-[10px]">Exclusive Asset</span>
            </div>
            <h2 className="text-4xl md:text-7xl font-display font-bold text-white mb-10 uppercase tracking-tighter leading-tight">Rate Finder <span className="text-accent-gold">Pro Guide.</span></h2>
            <p className="text-slate-500 text-xl mb-16 max-w-2xl font-medium leading-relaxed">
              Institutional secrets of the banking industry. We reveal exactly when to lock your rate, how to negotiate fees, and how to spot hidden costs.
            </p>
            <div className="flex flex-wrap gap-1">
              {['50+ Pages', 'Updated Monthly', '$49.99 Value'].map(tag => (
                <div key={tag} className="px-8 py-4 bg-brand-900 border border-white/5 text-white text-[10px] font-bold uppercase tracking-widest">
                  {tag}
                </div>
              ))}
            </div>
          </div>
          <div className="w-full lg:w-2/5 bg-brand-900 p-24 flex items-center justify-center relative overflow-hidden border-l border-white/5">
            <div className="absolute inset-0 bg-accent-gold/5 blur-3xl rounded-full" />
            <motion.div 
              whileHover={{ rotate: 0, scale: 1.05 }}
              className="w-64 h-80 bg-brand-600 border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] transform rotate-6 flex flex-col p-10 relative z-10"
            >
              <div className="w-12 h-12 bg-accent-gold mb-8" />
              <div className="h-2 w-full bg-white/5 mb-4" />
              <div className="h-2 w-3/4 bg-white/5 mb-16" />
              <div className="mt-auto text-[8px] font-bold text-slate-700 uppercase tracking-[0.4em]">FIND ME RATES PRO</div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
