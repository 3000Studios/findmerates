import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { Search, Menu, X, User as UserIcon, Bell, ChevronDown, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
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

  const navLinks = [
    { name: 'Mortgages', href: '/rates/mortgage' },
    { name: 'CD Rates', href: '/rates/cd' },
    { name: 'Auto Loans', href: '/rates/auto_loan' },
    { name: 'Calculators', href: '/calculators' },
    { name: 'Pro', href: '/pro', highlight: true },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-display font-bold">F</div>
                <span className="text-xl font-display font-bold tracking-tight text-slate-900">FindMeRates<span className="text-brand-600">.com</span></span>
              </Link>
              
              <div className="hidden md:flex items-center gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-brand-600",
                      link.highlight ? "text-brand-600 font-semibold" : "text-slate-600",
                      location.pathname === link.href && "text-brand-600"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <Link to="/dashboard" className="p-2 text-slate-500 hover:text-brand-600 transition-colors">
                    <Bell className="w-5 h-5" />
                  </Link>
                  <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
                    <img src={user.photoURL || ''} alt="" className="w-8 h-8 rounded-full border border-slate-200" />
                    <button onClick={handleLogout} className="text-sm font-medium text-slate-600 hover:text-brand-600">Sign Out</button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleLogin}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-brand-600 hover:bg-brand-700 transition-colors shadow-sm"
                >
                  Sign In
                </button>
              )}
            </div>

            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600">
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-600"
              >
                {link.name}
              </Link>
            ))}
            {!user && (
              <button
                onClick={handleLogin}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-brand-600 hover:bg-slate-50"
              >
                Sign In
              </button>
            )}
          </div>
        )}
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-white font-display font-semibold mb-4">Rates</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/rates/mortgage" className="hover:text-white transition-colors">Mortgage Rates</Link></li>
                <li><Link to="/rates/cd" className="hover:text-white transition-colors">CD Rates</Link></li>
                <li><Link to="/rates/auto_loan" className="hover:text-white transition-colors">Auto Loan Rates</Link></li>
                <li><Link to="/rates/personal_loan" className="hover:text-white transition-colors">Personal Loans</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-display font-semibold mb-4">Tools</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/calculators/mortgage" className="hover:text-white transition-colors">Mortgage Calculator</Link></li>
                <li><Link to="/calculators/refinance" className="hover:text-white transition-colors">Refinance Calculator</Link></li>
                <li><Link to="/calculators/cd" className="hover:text-white transition-colors">CD Calculator</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-display font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/editorial" className="hover:text-white transition-colors">Editorial Policy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-display font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
            <p>© 2026 FindMeRates.com. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> SECURE DATA</span>
              <span>NMLS #123456</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
