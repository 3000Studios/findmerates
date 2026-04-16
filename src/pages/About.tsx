import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Users, Shield, Award, BarChart2, Globe } from 'lucide-react';

export default function About() {
return (
  <div className="min-h-screen bg-white">
    {/* Hero */}
    <section className="bg-gradient-to-br from-slate-900 to-brand-900 text-white py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">About FindMeRates.com</h1>
        <p className="text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
          We help everyday Americans compare financial rates from hundreds of lenders — so you can make smarter money decisions without the guesswork.
        </p>
      </div>
    </section>

    {/* Mission */}
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-6">
          FindMeRates.com was built on a simple belief: everyone deserves access to transparent, up-to-date financial rate information. Whether you're shopping for a mortgage, comparing CD rates for your savings, or looking for the best auto loan, we aggregate data from across the market so you can compare in one place.
        </p>
        <p className="text-lg text-slate-600 leading-relaxed mb-6">
          Too many Americans overpay on loans or leave money on the table with low-yield savings accounts simply because they don't have easy access to rate comparisons. We're changing that.
        </p>
        <p className="text-lg text-slate-600 leading-relaxed">
          Our platform combines real-time rate data, AI-powered analysis, and plain-English guides to give you the full picture — not just a number.
        </p>
      </div>
    </section>

    {/* Stats */}
    <section className="bg-slate-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">By the Numbers</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {[
            { icon: BarChart2, stat: '500+', label: 'Lenders Tracked' },
            { icon: Users, stat: '50,000+', label: 'Monthly Visitors' },
            { icon: TrendingUp, stat: '4', label: 'Rate Categories' },
            { icon: Globe, stat: 'Daily', label: 'Rate Updates' },
            { icon: Shield, stat: '100%', label: 'Free to Use' },
            { icon: Award, stat: '2024', label: 'Founded' },
          ].map(({ icon: Icon, stat, label }) => (
            <div key={label} className="text-center">
              <Icon className="w-8 h-8 text-brand-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-slate-900 mb-1">{stat}</div>
              <div className="text-slate-500 text-sm">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* What We Cover */}
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 mb-8">What We Cover</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              title: 'Mortgage Rates',
              desc: 'Compare 30-year fixed, 15-year fixed, ARM rates, FHA loans, VA loans, and jumbo mortgages from banks, credit unions, and online lenders nationwide.'
            },
            {
              title: 'CD Rates',
              desc: 'Find the highest-yielding certificates of deposit across 3-month, 6-month, 1-year, 2-year, and 5-year terms. We track both traditional banks and high-yield online banks.'
            },
            {
              title: 'Auto Loan Rates',
              desc: 'Compare new and used car loan rates for all credit profiles. We cover dealership financing, bank loans, credit union rates, and online lenders.'
            },
            {
              title: 'Personal Loan Rates',
              desc: 'From debt consolidation to home improvement, compare personal loan rates and terms from top lenders with no impact to your credit score.'
            },
          ].map(({ title, desc }) => (
            <div key={title} className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
              <p className="text-slate-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* How We Make Money */}
    <section className="bg-slate-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 mb-6">How We Make Money</h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-4">
          FindMeRates.com is free to use. We earn revenue through advertising (including Google AdSense) and referral partnerships with financial institutions. When you click through to a lender and apply, we may receive a referral fee.
        </p>
        <p className="text-lg text-slate-600 leading-relaxed">
          This never affects the rates we show you. Our comparisons are based on publicly available rate data, and we do not accept payment to rank lenders higher in our results. Our goal is always to show you the most accurate, up-to-date information available.
        </p>
      </div>
    </section>

    {/* Team */}
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 mb-6">Who We Are</h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-6">
          FindMeRates.com is built and maintained by a small team of developers and financial enthusiasts based in the United States. We're not a bank, a lender, or a financial advisor — we're a technology company that believes better information leads to better financial decisions.
        </p>
        <p className="text-lg text-slate-600 leading-relaxed">
          Have a question, a correction, or want to partner with us? We'd love to hear from you.
        </p>
        <p className="text-sm text-slate-500 leading-relaxed mt-4">
          Contact: hello@findmerates.com
        </p>
        <div className="mt-8">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-700 transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </section>

    {/* Disclaimer */}
    <section className="bg-slate-900 text-slate-400 py-10 px-4">
      <div className="max-w-4xl mx-auto text-sm leading-relaxed">
        <p>
          <strong className="text-slate-300">Disclaimer:</strong> FindMeRates.com is an independent rate comparison website. We are not a lender, bank, or financial advisor. Rates shown are for informational purposes only and may not reflect current offers. Always verify rates directly with the lender before making any financial decision. See our <Link to="/privacy" className="text-brand-400 hover:underline">Privacy Policy</Link> and <Link to="/terms" className="text-brand-400 hover:underline">Terms of Service</Link> for more information.
        </p>
      </div>
    </section>
  </div>
);
}
