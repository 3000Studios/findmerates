import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { RateResult, RateCategory } from '../types';
import RateCard from '../components/RateCard';
import { Filter, ChevronDown, SlidersHorizontal, Info } from 'lucide-react';

export default function Rates() {
  const { category } = useParams<{ category: string }>();
  const [searchParams] = useSearchParams();
  const [rates, setRates] = useState<RateResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const query = searchParams.get('q');

  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/rates?category=${category || 'mortgage'}&q=${query || ''}`);
        const data = await response.json();
        setRates(data.results);
      } catch (err) {
        setError('Failed to load rates. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, [category, query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 capitalize mb-2">
            {query ? `Search Results for "${query}"` : `${category?.replace('_', ' ')} Rates`}
          </h1>
          <p className="text-slate-500">Showing top results based on your criteria.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-grow md:flex-grow-0 inline-flex items-center justify-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </button>
          <button className="flex-grow md:flex-grow-0 inline-flex items-center justify-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
            <SlidersHorizontal className="w-4 h-4 mr-2" /> Sort: Best Rate
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters - Desktop */}
        <div className="hidden lg:block space-y-8">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-display font-bold text-slate-900 mb-4">Refine Search</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Credit Score</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm">
                  <option>Excellent (740+)</option>
                  <option>Good (670-739)</option>
                  <option>Fair (580-669)</option>
                  <option>Poor (Below 580)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Loan Amount</label>
                <input type="text" placeholder="$300,000" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>
          </div>

          <div className="bg-brand-900 rounded-xl p-6 text-white">
            <h3 className="font-display font-bold mb-2">Get Rate Alerts</h3>
            <p className="text-brand-200 text-sm mb-4">Be the first to know when rates drop below your target.</p>
            <button className="w-full py-2 bg-brand-500 hover:bg-brand-400 rounded-lg font-semibold transition-colors">Set Alert</button>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-6">
          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-48 bg-slate-100 animate-pulse rounded-xl border border-slate-200" />
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-100 text-red-700 p-6 rounded-xl text-center">
              {error}
            </div>
          ) : rates.length > 0 ? (
            <>
              {rates.map(rate => (
                <RateCard key={rate.id} result={rate} />
              ))}
              
              {/* Ad Slot in middle of results */}
              <div className="ad-slot">Advertisement - Sponsored Rates</div>
              
              {rates.map(rate => (
                <RateCard key={`extra-${rate.id}`} result={rate} />
              ))}
            </>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
              <p className="text-slate-500">No rates found matching your criteria.</p>
            </div>
          )}
          
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-8">
            <div className="flex items-start gap-4">
              <Info className="w-6 h-6 text-brand-600 flex-shrink-0" />
              <div>
                <h3 className="font-display font-bold text-slate-900 mb-2">Our Methodology</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  We collect data from over 1,000 financial institutions daily. Rates shown are based on a 740+ credit score and 20% down payment for mortgages. Your actual rate may vary based on your personal financial profile.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
