import React, { useEffect, useState } from 'react';
import { Check, Zap, Star, ShieldCheck, ArrowRight, Download, Bell, Search, CreditCard, Sparkles, Globe, BarChart3, Lock, Loader2, Coins } from 'lucide-react';
import { motion } from 'motion/react';
import { auth, db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { playUiSound } from '../lib/sound';
import { trackEvent } from '../lib/analytics';

export default function Pro() {
  const [loading, setLoading] = useState(false);
  const [checkoutOk, setCheckoutOk] = useState<null | {
    stripeBasic: boolean;
    stripeMonthly: boolean;
    stripeSix: boolean;
    paypalMonthly: boolean;
    paypalSix: boolean;
  }>(null);
  const stripeBasicLink =
    (import.meta.env.VITE_STRIPE_BASIC_LINK as string | undefined) ||
    "https://buy.stripe.com/fZu7sL2KxdTgbJCeMibAs0B";
  const stripeLink =
    (import.meta.env.VITE_STRIPE_PAYMENT_LINK as string | undefined) ||
    (import.meta.env.VITE_STRIPE_PRO_LINK as string | undefined) ||
    "https://buy.stripe.com/00w3cvetfg1o00U9rYbAs0C";
  const stripeSixMonthLink =
    (import.meta.env.VITE_STRIPE_6MONTH_LINK as string | undefined) ||
    "https://buy.stripe.com/14AeVdacZ16u3d60VsbAs0D";
  const paypalLink = import.meta.env.VITE_PAYPAL_PAYMENT_LINK as string | undefined;
  const paypalSixMonthLink = import.meta.env.VITE_PAYPAL_6MONTH_LINK as string | undefined;

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch("/api/checkout-status", { cache: "no-store" });
        const data = await res.json() as any;
        setCheckoutOk({
          stripeBasic: Boolean(data?.stripe?.basic?.ok),
          stripeMonthly: Boolean(data?.stripe?.monthly?.ok),
          stripeSix: Boolean(data?.stripe?.six_month?.ok),
          paypalMonthly: Boolean(data?.paypal?.monthly?.ok),
          paypalSix: Boolean(data?.paypal?.six_month?.ok),
        });
      } catch {
        setCheckoutOk(null);
      }
    };
    run();
  }, []);

  const createUserRecord = async () => {
    const user = auth.currentUser;
    if (!user) return false;
    await setDoc(
      doc(db, 'users', user.uid),
      {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Member',
        photoURL: user.photoURL || null,
        isPro: false,
        role: 'member',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { merge: true },
    );
    return true;
  };

  const openPaymentLink = (url?: string) => {
    if (!url) return;
    window.location.assign(url);
  };

  const handleCheckoutClick = async (provider: "stripe" | "paypal", plan: string, url?: string) => {
    if (!url) return;
    void trackEvent("checkout_click", { provider, plan, url, surface: "pro_buttons" });
    openPaymentLink(url);
  };

  const handleSubscribe = async (plan: "basic" | "pro_monthly" | "pro_six_month" = "pro_monthly") => {
    setLoading(true);
    try {
      if (auth.currentUser) {
        void createUserRecord();
      }
      const preferredLink =
        plan === "basic"
          ? stripeBasicLink
          : plan === "pro_six_month"
            ? stripeSixMonthLink
            : stripeLink;
      if (preferredLink) {
        void trackEvent('pro_signup_start', { surface: 'pro_primary', plan });
        void trackEvent('checkout_click', {
          surface: 'pro_primary',
          provider: preferredLink.includes('stripe.com') ? 'stripe' : 'paypal',
          plan,
          url: preferredLink,
        });
        openPaymentLink(preferredLink);
        return;
      }
      alert('Payment checkout is currently unavailable. Please try again shortly.');
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Sign-in or checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: Bell, title: 'Instant Rate Alerts', desc: 'Get notified the second rates drop below your target.' },
    { icon: Search, title: 'Advanced Search', desc: 'Filter by credit score, LTV, and hyper-local data.' },
    { icon: Zap, title: 'Priority Updates', desc: 'See new rates before free users.' },
    { icon: Download, title: 'Rate Finder Pro Guide', desc: 'Sharper guide to financial rates.' },
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
              Tiered intelligence to match your market pace.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto">
            {/* Basic Tier */}
            <div className="bg-brand-800 border border-white/10 p-12 flex flex-col justify-between text-left rounded-[32px]">
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-white text-2xl font-display font-bold uppercase tracking-tight">Basic</h3>
                  <span className="px-4 py-1 bg-white/10 text-white text-[9px] font-bold uppercase tracking-widest rounded-full">Lead Alerts</span>
                </div>
                <div className="flex items-baseline gap-2 mb-12">
                  <span className="text-6xl font-display font-bold text-white">$2.99</span>
                  <span className="text-white/60 text-xl font-bold uppercase tracking-widest">/mo</span>
                </div>
                <ul className="space-y-4 mb-16">
                  {['Rate Drop Email Alerts', 'Weekly Market Recap', 'Standard Calculator Access', 'Basic Rate Comparison'].map((item) => (
                    <li key={item} className="flex items-center gap-4 text-white/80 text-sm font-bold uppercase tracking-widest">
                      <div className="w-1.5 h-1.5 bg-accent-gold rounded-full" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <button 
                onClick={() => handleSubscribe("basic")}
                className="w-full button-secondary border-white/20 bg-white/5 text-white hover:bg-white/10 py-6 text-lg rounded-2xl"
              >
                Choose Basic
              </button>
            </div>

            {/* Pro Tier */}
            <div className="bg-accent-gold p-12 flex flex-col justify-between text-left rounded-[32px] shadow-[0_30px_100px_rgba(200,163,90,0.15)] relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-900 text-white text-[10px] font-bold uppercase tracking-[0.3em] px-6 py-2 rounded-full">
                Most Popular
              </div>
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-brand-900 text-2xl font-display font-bold uppercase tracking-tight">Pro</h3>
                  <span className="px-4 py-1 bg-brand-900 text-white text-[9px] font-bold uppercase tracking-widest rounded-full">Full Intelligence</span>
                </div>
                <div className="flex items-baseline gap-2 mb-12">
                  <span className="text-7xl font-display font-bold text-brand-900">$9.99</span>
                  <span className="text-brand-900/60 text-xl font-bold uppercase tracking-widest">/mo</span>
                </div>
                <div className="mb-8 rounded-2xl bg-brand-900/10 p-4 text-brand-900">
                  <p className="text-[10px] font-bold uppercase tracking-widest">Savings Pack</p>
                  <p className="mt-1 text-lg font-semibold">$39.99 for 6 months</p>
                </div>
                <ul className="space-y-4 mb-16">
                  {['Everything in Basic', 'AI Scenario Analysis', 'Priority Briefing Flows', 'Deep Decision Layer', 'Exclusive Pro Guide'].map((item) => (
                    <li key={item} className="flex items-center gap-4 text-brand-900 text-sm font-bold uppercase tracking-widest">
                      <div className="w-1.5 h-1.5 bg-brand-900 rounded-full" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <button 
                onClick={() => handleSubscribe("pro_monthly")}
                disabled={loading}
                className="w-full bg-brand-900 text-white py-6 text-lg rounded-2xl flex items-center justify-center gap-3 font-bold"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6" />}
                Join Pro Access
              </button>
              <button
                onClick={() => handleSubscribe("pro_six_month")}
                disabled={loading}
                className="mt-3 w-full border border-brand-900/20 bg-brand-900/10 text-brand-900 py-4 text-sm rounded-2xl flex items-center justify-center gap-3 font-bold uppercase tracking-widest hover:bg-brand-900/15 transition-colors"
              >
                Choose 6-Month Savings Pack
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
          <div className="p-12 lg:p-24 grow">
            <div className="flex items-center gap-4 mb-8">
              <span className="w-8 h-px bg-accent-gold" />
              <span className="text-accent-gold font-bold uppercase tracking-[0.5em] text-[10px]">Exclusive Asset</span>
            </div>
            <h2 className="text-4xl md:text-7xl font-display font-bold text-white mb-10 uppercase tracking-tighter leading-tight">Rate Finder <span className="text-accent-gold">Pro Guide.</span></h2>
            <p className="text-slate-500 text-xl mb-16 max-w-2xl font-medium leading-relaxed">
              Practical decision tools, alerts, and a sharper guide to comparing products.
            </p>
            <div className="flex flex-wrap gap-1">
              {['50+ Pages', 'Updated Monthly', '$39.99 6-month special'].map(tag => (
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
