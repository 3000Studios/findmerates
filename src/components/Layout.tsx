import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TrendingUp, ShieldCheck, Menu, X, ChevronUp, ExternalLink } from 'lucide-react';
import AdSenseSlot from './AdSenseSlot';
import { AD_CLIENT, AD_SLOTS } from '../lib/ad-config';

export default function Layout({ children }: { children: React.ReactNode }) {
const [mobileOpen, setMobileOpen] = useState(false);
const [scrolled, setScrolled] = useState(false);
const [showTop, setShowTop] = useState(false);
const location = useLocation();

useEffect(() => {
  const onScroll = () => {
    setScrolled(window.scrollY > 20);
    setShowTop(window.scrollY > 500);
  };
  window.addEventListener('scroll', onScroll);
  return () => window.removeEventListener('scroll', onScroll);
}, []);

useEffect(() => {
  setMobileOpen(false);
  window.scrollTo(0, 0);
}, [location.pathname]);

const navLinks = [
  { to: '/rates/mortgage', label: 'Mortgages' },
  { to: '/rates/cd', label: 'CD Rates' },
  { to: '/rates/auto', label: 'Auto Loans' },
  { to: '/calculators', label: 'Calculators' },
  { to: '/stories', label: 'News' },
  { to: '/guide', label: 'Guides' },
];

const isLegalPage = ['/privacy', '/terms', '/cookies'].includes(location.pathname);

return (
  <div className="min-h-screen flex flex-col bg-white">
    {/* AdSense Script */}
    <script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5800977493749262"
      crossOrigin="anonymous"
    />

    {/* Top Banner Ad - high visibility */}
    {!isLegalPage && (
      <div className="w-full bg-slate-50 border-b border-slate-200 flex justify-center py-2 min-h-[90px]">
        <AdSenseSlot
          adClient={AD_CLIENT}
          adSlot={AD_SLOTS.topBanner.slotId}
          format="horizontal"
          minHeight={90}
          className="w-full max-w-7xl"
        />
      </div>
    )}

    {/* Header */}
    <header className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur shadow-sm border-b border-slate-100' : 'bg-white border-b border-slate-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-brand-700">
            <TrendingUp className="w-6 h-6 text-brand-600" />
            <span>FindMeRates</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname.startsWith(to)
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:text-brand-700 hover:bg-slate-50'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/pro"
              className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-700 transition-colors"
            >
              Go Pro
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-1">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {label}
            </Link>
          ))}
          <Link to="/pro" className="block mt-3 bg-brand-600 text-white text-center px-4 py-2 rounded-lg text-sm font-semibold">
            Go Pro
          </Link>
        </div>
      )}
    </header>

    {/* Main */}
    <main className="flex-grow">
      {children}
    </main>

    {/* Pre-footer AdSense */}
    {!isLegalPage && (
      <div className="w-full bg-slate-50 border-t border-slate-200 flex justify-center py-4 min-h-[100px]">
        <AdSenseSlot
          adClient={AD_CLIENT}
          adSlot={AD_SLOTS.footer.slotId}
          format="horizontal"
          minHeight={90}
          className="w-full max-w-7xl"
        />
      </div>
    )}

    {/* Footer */}
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-white font-bold text-lg mb-3">
              <TrendingUp className="w-5 h-5 text-brand-400" />
              FindMeRates
            </Link>
            <p className="text-sm leading-relaxed text-slate-500">
              Free rate comparison for mortgages, CDs, auto loans, and personal loans. Updated daily.
            </p>
          </div>

          {/* Rates */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Rates</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/rates/mortgage" className="hover:text-white transition-colors">Mortgage Rates</Link></li>
              <li><Link to="/rates/cd" className="hover:text-white transition-colors">CD Rates</Link></li>
              <li><Link to="/rates/auto" className="hover:text-white transition-colors">Auto Loan Rates</Link></li>
              <li><Link to="/rates/personal" className="hover:text-white transition-colors">Personal Loan Rates</Link></li>
              <li><Link to="/calculators" className="hover:text-white transition-colors">Calculators</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/stories" className="hover:text-white transition-colors">Financial News</Link></li>
              <li><Link to="/guide" className="hover:text-white transition-colors">Rate Guides</Link></li>
              <li><Link to="/pro" className="hover:text-white transition-colors">Pro Access</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Affiliate Disclosure */}
        <div className="border-t border-slate-800 pt-8 mb-6">
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-500">Advertiser Disclosure:</strong> FindMeRates.com is an independent, advertising-supported comparison service. We may receive compensation when you click on links to products from our partners. This compensation may impact how and where products appear on this site. FindMeRates.com does not include all financial companies or all available financial offers. Rates shown are for informational purposes only. Always verify current rates with the lender before making any financial decision.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-slate-500" />
            <span>© {new Date().getFullYear()} FindMeRates.com. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-slate-400 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-slate-400 transition-colors">Terms</Link>
            <Link to="/contact" className="hover:text-slate-400 transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>

    {/* Mobile sticky bottom ad */}
    {!isLegalPage && (
      <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-white border-t border-slate-200 flex justify-center py-1 min-h-[60px]">
        <AdSenseSlot
          adClient={AD_CLIENT}
          adSlot={AD_SLOTS.mobileSticky.slotId}
          format="auto"
          minHeight={50}
          className="w-full"
        />
      </div>
    )}

    {/* Back to top */}
    {showTop && (
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-20 right-6 z-40 bg-brand-600 text-white w-10 h-10 rounded-full shadow-lg flex items-center justify-center hover:bg-brand-700 transition-colors md:bottom-6"
        aria-label="Back to top"
      >
        <ChevronUp className="w-5 h-5" />
      </button>
    )}
  </div>
);
}