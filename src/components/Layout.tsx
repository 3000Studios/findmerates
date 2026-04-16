import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronUp, Menu, Search, ShieldCheck, TrendingUp, X } from "lucide-react";
import AdSenseSlot from "./AdSenseSlot";
import { AD_CLIENT, AD_SLOTS } from "../lib/ad-config";
import { playUiSound } from "../lib/sound";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [showPromo, setShowPromo] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      setShowTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setShowPromo(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowPromo(true), 15000);
    return () => window.clearTimeout(timer);
  }, []);

  const navLinks = [
    { to: "/rates/mortgage", label: "Mortgages" },
    { to: "/rates/cd", label: "CD Rates" },
    { to: "/rates/auto", label: "Auto Loans" },
    { to: "/calculators", label: "Calculators" },
    { to: "/stories", label: "News" },
    { to: "/guide", label: "Guides" },
  ];

  const isLegalPage = ["/privacy", "/terms", "/cookies", "/disclaimer"].includes(
    location.pathname,
  );

  const submitSearch = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    window.location.href = `/rates/search?q=${encodeURIComponent(trimmed)}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {!isLegalPage && (
        <div className="border-b border-white/60 bg-white/55">
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
        className={`sticky top-0 z-40 border-b transition-all duration-300 ${
          scrolled ? "border-white/70 bg-white/85 shadow-lg backdrop-blur-xl" : "border-transparent bg-white/55 backdrop-blur-xl"
        }`}
      >
        <div className="section-shell">
          <div className="flex min-h-16 items-center justify-between gap-4 py-2">
            <Link to="/" className="flex items-center gap-3 text-slate-950">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-900 text-white shadow-lg shadow-brand-900/15">
                <TrendingUp className="h-5 w-5" />
              </span>
              <span className="text-lg font-semibold tracking-tight">FindMeRates</span>
            </Link>

            <div className="hidden w-full max-w-xl items-center rounded-full border border-slate-200 bg-white/85 px-3 py-2 shadow-sm lg:flex">
              <Search className="ml-1 h-4 w-4 text-slate-400" />
              <input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitSearch(searchValue)}
                placeholder="Search mortgages, CDs, auto loans, or a lender"
                className="ml-3 w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
              <button
                onClick={() => submitSearch(searchValue)}
                className="button-primary !px-4 !py-2 text-xs"
                onMouseEnter={() => playUiSound("hover")}
                onClickCapture={() => playUiSound("click")}
              >
                Search
              </button>
            </div>

            <nav className="hidden items-center gap-1 xl:flex">
              {navLinks.map(({ to, label }) => {
                const active = location.pathname.startsWith(to);
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "bg-brand-900 text-white"
                        : "text-slate-600 hover:bg-white hover:text-slate-950"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden items-center gap-3 lg:flex">
              <Link to="/pro" className="button-primary" onMouseEnter={() => playUiSound("hover")}>
                Go Pro
              </Link>
            </div>

              <button
                className="rounded-full border border-slate-200 bg-white/80 p-2 text-slate-700 md:hidden"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
                onMouseEnter={() => playUiSound("hover")}
                onClickCapture={() => playUiSound("click")}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-white/60 bg-white/90 md:hidden">
            <div className="section-shell space-y-3 py-4">
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitSearch(searchValue)}
                  placeholder="Search rates"
                  className="w-full bg-transparent text-sm focus:outline-none"
                />
              </div>
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  {label}
                </Link>
              ))}
              <Link to="/pro" className="button-primary w-full" onMouseEnter={() => playUiSound("hover")}>
                Go Pro
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">{children}</main>

      {!isLegalPage && (
        <div className="border-t border-white/60 bg-white/55">
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

      <footer className="border-t border-white/70 bg-brand-900 text-slate-300">
        <div className="section-shell py-14">
          <div className="grid gap-10 md:grid-cols-4">
            <div className="md:col-span-1">
              <Link to="/" className="mb-4 flex items-center gap-3 text-white">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
                  <TrendingUp className="h-5 w-5" />
                </span>
                <span className="text-lg font-semibold">FindMeRates</span>
              </Link>
              <p className="text-sm leading-6 text-slate-400">
                Clean comparisons for mortgages, CDs, auto loans, and personal loans.
              </p>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold text-white">Rates</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/rates/mortgage" className="hover:text-white">Mortgage Rates</Link></li>
                <li><Link to="/rates/cd" className="hover:text-white">CD Rates</Link></li>
                <li><Link to="/rates/auto" className="hover:text-white">Auto Loan Rates</Link></li>
                <li><Link to="/rates/personal" className="hover:text-white">Personal Loan Rates</Link></li>
                <li><Link to="/calculators" className="hover:text-white">Calculators</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold text-white">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/stories" className="hover:text-white">Financial News</Link></li>
                <li><Link to="/guide" className="hover:text-white">Rate Guides</Link></li>
                <li><Link to="/pro" className="hover:text-white">Pro Access</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold text-white">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="hover:text-white">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link to="/cookies" className="hover:text-white">Cookie Policy</Link></li>
                <li><Link to="/disclaimer" className="hover:text-white">Disclaimer</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-10 border-t border-white/10 pt-6 text-xs text-slate-500">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                <span>© {new Date().getFullYear()} FindMeRates.com. All rights reserved.</span>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link to="/privacy" className="hover:text-white">Privacy</Link>
                <Link to="/terms" className="hover:text-white">Terms</Link>
                <Link to="/disclaimer" className="hover:text-white">Disclaimer</Link>
                <Link to="/contact" className="hover:text-white">Contact</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {!isLegalPage && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-xl border-t border-white/70 md:hidden">
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

      {showPromo && !isLegalPage && (
        <div className="fixed inset-x-0 bottom-4 z-40 px-4 md:bottom-6">
          <div className="section-shell">
            <div className="card mx-auto max-w-3xl border-brand-200 bg-white/95 px-5 py-4 shadow-2xl">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="section-kicker">Pro perks</p>
                  <p className="mt-2 text-base text-slate-950">
                    Pro is now <strong>$9.99/mo</strong> or <strong>$39.99 for 6 months paid in full</strong>.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link to="/pro" className="button-primary" onMouseEnter={() => playUiSound("hover")}>
                    See subscription
                  </Link>
                  <button
                    onClick={() => setShowPromo(false)}
                    className="button-secondary"
                    onMouseEnter={() => playUiSound("hover")}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
