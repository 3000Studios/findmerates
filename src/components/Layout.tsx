import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronUp, LogIn, LogOut, Menu, Search, ShieldCheck, X } from "lucide-react";
import AdSenseSlot from "./AdSenseSlot";
import { AD_CLIENT, AD_SLOTS } from "../lib/ad-config";
import { playUiSound } from "../lib/sound";
import { auth } from "../lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import BrandLogo from "./BrandLogo";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16);
      setShowTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  const navLinks = useMemo(
    () => [
      { to: "/rates/mortgage", label: "Mortgage" },
      { to: "/rates/cd", label: "CD" },
      { to: "/rates/auto_loan", label: "Auto" },
      { to: "/rates/personal_loan", label: "Personal" },
      { to: "/calculators", label: "Calculators" },
      { to: "/pro", label: "Pro" },
    ],
    [],
  );

  const isLegalPage = [
    "/privacy",
    "/terms",
    "/cookies",
    "/disclaimer",
    "/how-we-make-money",
    "/affiliate-disclosure",
    "/editorial-policy",
    "/methodology",
  ].includes(location.pathname);

  const showsAdvertiserBanner =
    location.pathname === "/" || location.pathname.startsWith("/rates") || location.pathname.startsWith("/pro");

  const submitSearch = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    window.location.href = `/rates/search?q=${encodeURIComponent(trimmed)}`;
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign-out failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {!isLegalPage && (
        <div className="border-b border-white/60 bg-white/70">
          <div className="section-shell py-3">
            <AdSenseSlot
              adClient={AD_CLIENT}
              adSlot={AD_SLOTS.topBanner.slotId}
              format="horizontal"
              minHeight={90}
              className="w-full"
            />
          </div>
        </div>
      )}

      <header
        className={`sticky top-0 z-40 border-b backdrop-blur-xl transition-all duration-300 ${
          scrolled ? "border-white/70 bg-white/90 shadow-[0_10px_30px_rgba(15,23,42,0.08)]" : "border-transparent bg-white/70"
        }`}
      >
        <div className="section-shell">
          <div className="flex min-h-16 items-center justify-between gap-4 py-2">
            <Link to="/" className="flex items-center gap-3 text-slate-950">
              <BrandLogo variant="crest" />
              <span className="text-lg font-semibold tracking-tight">
                <span className="brand-wordmark">FindMeRates</span>
                <span className="text-slate-500">.com</span>
              </span>
            </Link>

            <div className="hidden w-full max-w-xl items-center rounded-full border border-slate-200 bg-white px-3 py-2 lg:flex">
              <Search className="ml-1 h-4 w-4 text-slate-400" />
              <input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitSearch(searchValue)}
                placeholder="Search rates or lenders"
                className="ml-3 w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
              <button onClick={() => submitSearch(searchValue)} className="button-primary !px-4 !py-2 text-xs">
                Search
              </button>
            </div>

            <nav className="hidden items-center gap-1 lg:flex">
              {navLinks.map(({ to, label }) => {
                const active = location.pathname.startsWith(to);
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      active ? "bg-brand-50 text-brand-900" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden items-center gap-3 lg:flex">
              <Link
                to="/pro"
                className="button-primary"
                onMouseEnter={() => playUiSound("hover")}
                onClickCapture={() => playUiSound("click")}
              >
                Go Pro
              </Link>
              {user ? (
                <button className="button-secondary" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              ) : (
                <Link to="/signup" className="button-secondary">
                  <LogIn className="h-4 w-4" />
                  Sign in
                </Link>
              )}
            </div>

            <button
              className="rounded-full border border-slate-200 bg-white p-2 text-slate-900 lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-slate-200 bg-white lg:hidden">
            <div className="section-shell space-y-3 py-4">
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitSearch(searchValue)}
                  placeholder="Search rates"
                  className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
              {navLinks.map(({ to, label }) => (
                <Link key={to} to={to} className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100">
                  {label}
                </Link>
              ))}
              {user ? (
                <button className="button-secondary w-full" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              ) : (
                <Link to="/signup" className="button-secondary w-full">
                  <LogIn className="h-4 w-4" />
                  Sign in
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {showsAdvertiserBanner && (
        <div className="border-b border-amber-200/70 bg-amber-50/95 text-amber-900">
          <div className="section-shell py-2 text-xs leading-5">
            <strong>Advertiser disclosure:</strong> FindMeRates.com may be compensated by lenders when you click partner offers.{" "}
            <Link to="/how-we-make-money" className="underline">
              How we make money
            </Link>
            .
          </div>
        </div>
      )}

      <main className="flex-grow pb-20 md:pb-0">{children}</main>

      {!isLegalPage && (
        <div className="border-t border-white/60 bg-white/70">
          <div className="section-shell py-4">
            <AdSenseSlot
              adClient={AD_CLIENT}
              adSlot={AD_SLOTS.footer.slotId}
              format="horizontal"
              minHeight={90}
              className="w-full"
            />
          </div>
        </div>
      )}

      <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
        <div className="section-shell py-12">
          <div className="grid gap-10 md:grid-cols-4">
            <div className="md:col-span-1">
              <Link to="/" className="mb-4 flex items-center gap-3 text-white">
                <BrandLogo variant="crest" className="bg-white/10 shadow-none" />
                <span className="text-lg font-semibold">
                  <span className="brand-wordmark">FindMeRates</span>
                  <span className="text-slate-400">.com</span>
                </span>
              </Link>
              <p className="text-sm leading-6 text-slate-400">
                Rate comparisons, sponsored offers, lead capture, and Pro upsells for borrowers and savers.
              </p>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold text-white">Money pages</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/rates/mortgage" className="hover:text-white">Mortgage</Link></li>
                <li><Link to="/rates/cd" className="hover:text-white">CD</Link></li>
                <li><Link to="/rates/auto_loan" className="hover:text-white">Auto</Link></li>
                <li><Link to="/rates/personal_loan" className="hover:text-white">Personal</Link></li>
                <li><Link to="/pro" className="hover:text-white">Pro</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold text-white">Tools</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/calculators" className="hover:text-white">Calculators</Link></li>
                <li><Link to="/stories" className="hover:text-white">Stories</Link></li>
                <li><Link to="/guide" className="hover:text-white">Guide</Link></li>
                <li><Link to="/signup" className="hover:text-white">Sign in</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold text-white">Trust</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/how-we-make-money" className="hover:text-white">How We Make Money</Link></li>
                <li><Link to="/affiliate-disclosure" className="hover:text-white">Affiliate Disclosure</Link></li>
                <li><Link to="/methodology" className="hover:text-white">Methodology</Link></li>
                <li><Link to="/privacy" className="hover:text-white">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t border-white/10 pt-6 text-xs text-slate-500">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                <span>© {new Date().getFullYear()} FindMeRates.com. Not a bank, lender, or financial advisor.</span>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link to="/terms" className="hover:text-white">Terms</Link>
                <Link to="/cookies" className="hover:text-white">Cookies</Link>
                <Link to="/disclaimer" className="hover:text-white">Disclaimer</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {!isLegalPage && (
        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/70 bg-white/95 backdrop-blur-xl md:hidden">
          <div className="section-shell py-1">
            <AdSenseSlot
              adClient={AD_CLIENT}
              adSlot={AD_SLOTS.mobileSticky.slotId}
              format="auto"
              minHeight={50}
              className="w-full"
            />
          </div>
        </div>
      )}

      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-20 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-brand-900 text-white shadow-xl shadow-brand-900/20 transition-transform hover:-translate-y-0.5 md:bottom-6"
          aria-label="Back to top"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
