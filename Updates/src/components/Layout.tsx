import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { auth, googleProvider, db } from '../lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { Search, Menu, X, User as UserIcon, Bell, ChevronDown, ShieldCheck, ArrowUp, Sparkles, TrendingUp, Download, Zap } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import GeometricBackground from './GeometricBackground';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isPro, setIsPro] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const userRef = doc(db, 'users', u.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const data = userSnap.data();
          setIsPro(data.isPro || false);
          
          // Check if first time login as Pro
          if (data.isPro && !data.hasSeenProWelcome) {
            setShowProModal(true);
            await updateDoc(userRef, { hasSeenProWelcome: true });
          }
        } else {
          // Create user profile
          await setDoc(userRef, {
            uid: u.uid,
            email: u.email,
            displayName: u.displayName,
            photoURL: u.photoURL,
            isPro: false,
            hasSeenProWelcome: false,
            createdAt: new Date().toISOString()
          });
        }
      }
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { name: 'Mortgages', href: '/rates/mortgage' },
    { name: 'CD Rates', href: '/rates/cd' },
    { name: 'Auto Loans', href: '/rates/auto_loan' },
    { name: 'Calculators', href: '/calculators' },
    { name: 'Intelligence', href: '/stories' },
  ];

  return (
    <div className="min-h-screen flex flex-col selection:bg-accent-gold selection:text-brand-900">
      <GeometricBackground />
      
      {/* Google AdSense Script */}
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-replace-me" crossOrigin="anonymous"></script>

      <header className="sticky top-0 z-50 bg-brand-900/80 backdrop-blur-2xl border-b border-white/5">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-16">
              <Link to="/" className="flex items-center gap-4 group">
                <div className="w-10 h-10 bg-accent-gold flex items-center justify-center text-brand-900 font-display font-bold text-xl">
                  F
                </div>
                <div className="flex flex-col">
                  <span className="text-xl md:text-2xl font-display font-bold tracking-tight text-white uppercase group-hover:scale-[1.02] transition-transform origin-left">
                    FindMeRates<span className="text-accent-gold">.com</span>
                  </span>
                  <span className="text-[7px] font-bold tracking-[0.5em] text-slate-500 uppercase -mt-1">Global Financial Intelligence</span>
                </div>
              </Link>
              
              <div className="hidden lg:flex items-center gap-10">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={cn(
                      "text-[10px] font-bold transition-all uppercase tracking-[0.3em] py-2 border-b-2 border-transparent hover:scale-110 origin-center",
                      location.pathname === link.href ? "text-white border-accent-gold" : "text-slate-600 hover:text-white"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-8">
              {!isPro && (
                <Link 
                  to="/pro" 
                  className="hidden md:flex items-center gap-3 btn-corporate btn-corporate-gold !py-2 !px-6 !text-[9px]"
                >
                  <Sparkles className="w-3 h-3" /> Get Pro Access
                </Link>
              )}

              {user ? (
                <div className="flex items-center gap-6">
                  {isPro && (
                    <Link to="/pro-guide" className="text-accent-gold hover:text-white transition-colors">
                      <Download className="w-5 h-5" />
                    </Link>
                  )}
                  <button className="p-2 text-slate-500 hover:text-white transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-accent-gold" />
                  </button>
                  <div className="flex items-center gap-4 pl-6 border-l border-white/10">
                    <img src={user.photoURL || ''} className="w-8 h-8 border border-white/10" alt="User" />
                    <button onClick={handleLogout} className="text-[9px] font-bold text-slate-600 hover:text-white uppercase tracking-widest transition-colors">Logout</button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={handleLogin}
                  className="text-[9px] font-bold text-white uppercase tracking-widest border border-white/10 px-6 py-2 hover:bg-white/5 transition-colors"
                >
                  Sign In
                </button>
              )}

              <button 
                className="lg:hidden p-2 text-white"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Pro Welcome Modal */}
      <AnimatePresence>
        {showProModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-brand-900/90 backdrop-blur-xl"
              onClick={() => setShowProModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-brand-600 border border-accent-gold/30 p-12 max-w-2xl w-full text-center shadow-[0_50px_100px_rgba(0,0,0,0.8)]"
            >
              <div className="w-20 h-20 bg-accent-gold text-brand-900 flex items-center justify-center mx-auto mb-10">
                <Zap className="w-10 h-10" />
              </div>
              <h2 className="text-4xl font-display font-bold text-white mb-6 uppercase tracking-tighter">Welcome to Pro Intelligence</h2>
              <p className="text-slate-500 text-lg mb-12 font-medium leading-relaxed">
                Thanks for subscribing to FindMeRates Pro. Your institutional-grade financial toolkit is now active. As a welcome gift, we've prepared your exclusive 50-page Rate Finder Pro Guide.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/pro-guide" 
                  onClick={() => setShowProModal(false)}
                  className="flex-grow btn-corporate btn-corporate-gold flex items-center justify-center gap-4"
                >
                  Download Pro Guide <Download className="w-5 h-5" />
                </Link>
                <button 
                  onClick={() => setShowProModal(false)}
                  className="px-10 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden fixed inset-0 z-40 bg-brand-900 pt-24 px-8"
          >
            <div className="flex flex-col gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-3xl font-display font-bold text-white uppercase tracking-tighter"
                >
                  {link.name}
                </Link>
              ))}
              <Link 
                to="/pro" 
                onClick={() => setIsMenuOpen(false)}
                className="w-full py-6 bg-accent-gold text-brand-900 text-center font-bold uppercase tracking-widest text-sm"
              >
                Get Pro Access
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-brand-900 border-t border-white/5 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-24">
            <div className="md:col-span-6">
              <Link to="/" className="flex items-center gap-4 mb-10">
                <div className="w-8 h-8 bg-accent-gold flex items-center justify-center text-brand-900 font-display font-bold text-lg">
                  F
                </div>
                <span className="text-xl font-display font-bold text-white uppercase tracking-tight">
                  FindMeRates<span className="text-accent-gold">.com</span>
                </span>
              </Link>
              <p className="text-slate-600 max-w-md leading-relaxed text-sm font-medium">
                The world's most advanced autonomous financial intelligence platform. Real-time rate tracking, AI-driven market predictions, and institutional-grade analysis for the modern investor.
              </p>
            </div>
            
            <div className="md:col-span-3">
              <h4 className="text-white text-[10px] font-bold uppercase tracking-[0.5em] mb-10">Intelligence</h4>
              <ul className="space-y-6 text-xs font-bold uppercase tracking-widest">
                <li><Link to="/rates/mortgage" className="text-slate-600 hover:text-accent-gold transition-colors">Mortgage Rates</Link></li>
                <li><Link to="/rates/cd" className="text-slate-600 hover:text-accent-gold transition-colors">Savings & CD</Link></li>
                <li><Link to="/rates/auto_loan" className="text-slate-600 hover:text-accent-gold transition-colors">Auto Loans</Link></li>
                <li><Link to="/stories" className="text-slate-600 hover:text-accent-gold transition-colors">Market Stories</Link></li>
              </ul>
            </div>

            <div className="md:col-span-3">
              <h4 className="text-white text-[10px] font-bold uppercase tracking-[0.5em] mb-10">Company</h4>
              <ul className="space-y-6 text-xs font-bold uppercase tracking-widest">
                <li><Link to="/about" className="text-slate-600 hover:text-accent-gold transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="text-slate-600 hover:text-accent-gold transition-colors">Contact</Link></li>
                <li><Link to="/privacy" className="text-slate-600 hover:text-accent-gold transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-slate-600 hover:text-accent-gold transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12">
            <p className="text-[9px] font-bold text-slate-800 uppercase tracking-[0.5em]">
              © 2026 FindMeRates.com. All Rights Reserved.
            </p>
            <div className="flex gap-12">
              <TrendingUp className="w-5 h-5 text-slate-900" />
              <ShieldCheck className="w-5 h-5 text-slate-900" />
            </div>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={scrollToTop}
            className="fixed bottom-12 right-12 z-50 w-12 h-12 bg-accent-gold text-brand-900 flex items-center justify-center hover:bg-white transition-colors shadow-2xl"
          >
            <ArrowUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
