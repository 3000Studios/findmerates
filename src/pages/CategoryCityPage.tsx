import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowRight, MapPin, ShieldCheck, TrendingUp } from "lucide-react";
import RateCard from "../components/RateCard";
import MortgageCalculator from "../components/MortgageCalculator";
import { playUiSound } from "../lib/sound";

export default function CategoryCityPage() {
  const { category, city } = useParams();
  
  const cityName = city ? city.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : "Your City";
  const categoryName = category === "mortgage" ? "Mortgage" : category === "cd" ? "CD" : "Loan";

  // Mock data for programmatic page
  const mockRates = [
    {
      id: "1",
      provider: "National Bank",
      rate: 0.0625,
      apr: 0.0635,
      term: "30 Year Fixed",
      category: category || "mortgage",
      ctaUrl: "#",
      details: ["No origination fee", "Local " + cityName + " discounts"],
      lastUpdated: new Date().toISOString()
    },
    {
      id: "2",
      provider: cityName + " Credit Union",
      rate: 0.0610,
      apr: 0.0620,
      term: "30 Year Fixed",
      category: category || "mortgage",
      ctaUrl: "#",
      details: ["Member exclusive", "Fast " + cityName + " closing"],
      lastUpdated: new Date().toISOString()
    }
  ];

  return (
    <div className="pb-20">
      <section className="bg-brand-900 pt-32 pb-20 text-white">
        <div className="section-shell">
          <div className="flex items-center gap-2 text-brand-300 mb-6">
            <MapPin className="h-4 w-4" />
            <span className="text-sm font-semibold uppercase tracking-widest">{cityName} Local Market</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold max-w-4xl leading-tight">
            Best {categoryName} Rates in <span className="text-accent-gold">{cityName}</span> for {new Date().getFullYear()}
          </h1>
          <p className="mt-6 text-xl text-brand-100 max-w-2xl">
            We analyzed 15+ lenders in {cityName} to find the best {categoryName.toLowerCase()} deals for your profile.
          </p>
        </div>
      </section>

      <section className="section-shell -mt-10">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-brand-700" />
                Live {cityName} Benchmarks
              </h2>
              <span className="text-xs text-slate-500 font-medium">Updated hourly</span>
            </div>
            
            {mockRates.map(rate => (
              <RateCard key={rate.id} result={rate as any} />
            ))}

            <div className="card p-8 bg-brand-50 border-brand-100 mt-12">
              <h3 className="text-xl font-bold text-brand-900 mb-4">Why compare rates in {cityName}?</h3>
              <p className="text-slate-700 leading-relaxed mb-6">
                Lenders often have regional pricing models. A bank in {cityName} might offer a lower margin than a national competitor to gain local market share. Our AI scans these local variances to ensure you don't overpay.
              </p>
              <Link 
                to="/pro" 
                className="button-primary"
                onMouseEnter={() => playUiSound("hover")}
              >
                Get {cityName} Rate Alerts <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-24">
              <MortgageCalculator />
              <div className="mt-6 card p-6 bg-slate-900 text-white">
                <ShieldCheck className="h-8 w-8 text-accent-gold mb-4" />
                <h4 className="font-bold mb-2">Local Security Guarantee</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  All lenders listed for {cityName} are FDIC/NCUA insured and verified by FindMeRates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
