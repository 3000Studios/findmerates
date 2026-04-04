import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import Layout from '../components/Layout';
import AdSenseSlot from '../components/AdSenseSlot';
import { AD_CLIENT, AD_SLOTS } from '../lib/ad-config';
import { cn } from '../lib/utils';

// Mock news data - in production, this would come from an API
interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'mortgage' | 'cd' | 'savings' | 'market' | 'economy';
  publishDate: Date;
  readTime: number;
  featured: boolean;
  imageUrl?: string;
  tags: string[];
}

// Generate mock news data relevant to financial rates
const generateMockNews = (): NewsItem[] => {
  const categories: NewsItem['category'][] = ['mortgage', 'cd', 'savings', 'market', 'economy'];
  const titles = [
    'Federal Reserve Signals Potential Rate Cuts in Q3',
    'Mortgage Rates Hit 6-Month Low Amid Economic Slowdown',
    'CD Rates Surge as Banks Compete for Deposits',
    'High-Yield Savings Accounts Offer Best Returns in Years',
    'Inflation Data Could Impact Future Rate Decisions',
    'Housing Market Shows Signs of Cooling',
    'Banking Sector Profits Rise on Higher Interest Margins',
    'Credit Union Offers Competitive CD Rates',
    'Stock Market Volatility Affects Bond Yields',
    'Economic Indicators Point to Stable Rate Environment',
    'Mortgage Lenders Adjust Rates Based on Market Conditions',
    'Savings Account APYs Reach Record Highs',
    'Federal Reserve Meeting Minutes Released',
    'Housing Starts Decline as Mortgage Rates Rise',
    'Bank Deposit Growth Accelerates with Higher Rates'
  ];

  return titles.map((title, index) => ({
    id: `news-${index + 1}`,
    title,
    summary: `${title}. Latest updates on financial rates and market conditions affecting mortgages, CDs, and savings accounts.`,
    content: `Detailed analysis of ${title.toLowerCase()}. This comprehensive report covers the latest developments in financial markets and their impact on interest rates, mortgage rates, CD rates, and savings account yields. Market experts weigh in on future trends and what consumers can expect in the coming months.`,
    category: categories[index % categories.length],
    publishDate: new Date(Date.now() - (index * 3600000)), // Each news item 1 hour apart
    readTime: Math.floor(Math.random() * 5) + 2, // 2-6 minutes
    featured: index < 3,
    tags: ['rates', 'market', 'finance', categories[index % categories.length]],
  }));
};

const mockNews = generateMockNews();

export default function News() {
  const [news, setNews] = useState<NewsItem[]>(mockNews);
  const [selectedCategory, setSelectedCategory] = useState<NewsItem['category'] | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  const filteredNews = news
    .filter(item => selectedCategory === 'all' || item.category === selectedCategory)
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return b.publishDate.getTime() - a.publishDate.getTime();
      }
      return a.publishDate.getTime() - b.publishDate.getTime();
    });

  const featuredNews = filteredNews.filter(item => item.featured);
  const regularNews = filteredNews.filter(item => !item.featured);

  const getCategoryColor = (category: NewsItem['category']) => {
    const colors = {
      mortgage: 'bg-blue-100 text-blue-800',
      cd: 'bg-green-100 text-green-800',
      savings: 'bg-purple-100 text-purple-800',
      market: 'bg-orange-100 text-orange-800',
      economy: 'bg-red-100 text-red-800',
    };
    return colors[category];
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50">
        {/* Header with Ad */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">News on Rates</h1>
                <p className="text-slate-600 mt-2">Latest financial news and market insights affecting your rates</p>
              </div>
              <AdSenseSlot
                adClient={AD_CLIENT}
                adSlot={AD_SLOTS.ratesAboveFold.slotId}
                format={AD_SLOTS.ratesAboveFold.format}
                className="w-full lg:w-80"
                minHeight={90}
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {(['all', 'mortgage', 'cd', 'savings', 'market', 'economy'] as const).map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={cn(
                      'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                      selectedCategory === category
                        ? 'bg-brand-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    )}
                  >
                    {category === 'all' ? 'All News' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
                  className="text-sm border border-slate-300 rounded px-2 py-1"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Featured News */}
              {featuredNews.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-brand-600" />
                    Featured Stories
                  </h2>
                  <div className="space-y-6">
                    {featuredNews.map((item) => (
                      <article key={item.id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getCategoryColor(item.category))}>
                                {item.category.toUpperCase()}
                              </span>
                              <span className="text-slate-500 text-sm flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {item.readTime} min read
                              </span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                            <p className="text-slate-600 mb-4">{item.summary}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-slate-500">{formatDate(item.publishDate)}</span>
                              <button className="text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
                                Read More <ArrowRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {/* Regular News */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-brand-600" />
                  Latest Updates
                </h2>
                <div className="space-y-6">
                  {regularNews.map((item, index) => (
                    <article key={item.id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getCategoryColor(item.category))}>
                              {item.category.toUpperCase()}
                            </span>
                            <span className="text-slate-500 text-sm flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {item.readTime} min read
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                          <p className="text-slate-600 mb-4">{item.summary}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-500">{formatDate(item.publishDate)}</span>
                            <button className="text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
                              Read More <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Ad after every 3 articles */}
                      {(index + 1) % 3 === 0 && (
                        <div className="mt-6 pt-6 border-t border-slate-200">
                          <AdSenseSlot
                            adClient={AD_CLIENT}
                            adSlot={AD_SLOTS.midContent.slotId}
                            format={AD_SLOTS.midContent.format}
                            minHeight={250}
                          />
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Sidebar Ad */}
              <AdSenseSlot
                adClient={AD_CLIENT}
                adSlot={AD_SLOTS.sidebar.slotId}
                format={AD_SLOTS.sidebar.format}
                minHeight={600}
                sticky={true}
              />

              {/* Categories */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  {(['mortgage', 'cd', 'savings', 'market', 'economy'] as const).map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={cn(
                        'w-full text-left px-3 py-2 rounded text-sm transition-colors',
                        selectedCategory === category
                          ? 'bg-brand-50 text-brand-700 font-medium'
                          : 'text-slate-600 hover:bg-slate-50'
                      )}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)} Rates
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer Ad */}
              <AdSenseSlot
                adClient={AD_CLIENT}
                adSlot={AD_SLOTS.footer.slotId}
                format={AD_SLOTS.footer.format}
                minHeight={90}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}