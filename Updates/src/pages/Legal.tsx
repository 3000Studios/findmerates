import React from 'react';
import { useParams } from 'react-router-dom';

export default function Legal() {
  const { type } = useParams<{ type: string }>();
  
  const content = {
    privacy: {
      title: 'Privacy Policy',
      updated: 'April 4, 2026',
      body: `At FindMeRates.com, we take your privacy seriously. This policy explains how we collect, use, and protect your personal information.
      
      ### 1. Information We Collect
      We collect information you provide directly to us, such as when you create an account, save a search, or set a rate alert. This may include your name, email address, and financial preferences.
      
      ### 2. How We Use Your Information
      We use your information to provide personalized rate comparisons, send alerts, and improve our services. We do not sell your personal data to third parties.
      
      ### 3. Cookies and Tracking
      We use cookies to enhance your experience and for AdSense monetization. You can manage your cookie preferences in your browser settings.`
    },
    terms: {
      title: 'Terms of Service',
      updated: 'April 4, 2026',
      body: `By using FindMeRates.com, you agree to these terms.
      
      ### 1. Use of Service
      Our service is for informational purposes only. We are not a lender and do not provide financial advice.
      
      ### 2. Accuracy of Information
      While we strive for accuracy, rates can change rapidly. Always verify rates with the provider before making financial decisions.`
    },
    cookies: {
      title: 'Cookie Policy',
      updated: 'April 4, 2026',
      body: `We use cookies to make our site work and to show you relevant ads.
      
      ### 1. Necessary Cookies
      These are required for the site to function, such as authentication.
      
      ### 2. Analytics Cookies
      We use these to understand how users interact with our site.
      
      ### 3. Advertising Cookies
      These are used by Google AdSense to show you personalized ads based on your interests.`
    }
  };

  const page = content[type as keyof typeof content] || content.privacy;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12">
        <h1 className="text-4xl font-display font-bold text-slate-900 mb-2">{page.title}</h1>
        <p className="text-slate-400 text-sm mb-8">Last updated: {page.updated}</p>
        <div className="prose prose-slate max-w-none">
          {page.body.split('\n').map((line, i) => (
            <p key={i} className="mb-4 text-slate-600 leading-relaxed">{line}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
