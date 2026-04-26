import React, { useState } from 'react';
import { LogIn } from 'lucide-react';

export default function RateGuidedFlow() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    loanType: '',
    creditTier: '',
    zip: '',
    email: '',
    phone: ''
  });

  const nextStep = (key: string, val: string) => {
    setAnswers(prev => ({ ...prev, [key]: val }));
    setStep(s => s + 1);
  };

  const submitToD1 = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers)
      });
      if (response.ok) {
        setStep(4);
      }
    } catch (err) {
      console.error("Lead capture failed:", err);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto rounded-3xl border border-white/20 bg-black/60 p-8 shadow-2xl backdrop-blur-xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Find Your True Rate</h2>
        <div className="flex gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-2 flex-1 rounded-full ${step >= i ? 'bg-emerald-500' : 'bg-white/10'}`} />
          ))}
        </div>
      </div>

      {step === 1 && (
        <div className="animate-in fade-in slide-in-from-right-8 duration-500">
          <h3 className="text-lg font-medium text-white mb-4">What type of rate are you looking for?</h3>
          <div className="grid grid-cols-2 gap-4">
            {['Mortgage', 'Auto Loan', 'Personal Loan', 'CD Rate'].map(type => (
              <button 
                key={type}
                onClick={() => nextStep('loanType', type)}
                className="p-4 rounded-xl border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-white font-medium transition-all"
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="animate-in fade-in slide-in-from-right-8 duration-500">
          <h3 className="text-lg font-medium text-white mb-4">What's your estimated credit score?</h3>
          <div className="grid grid-cols-1 gap-3">
            {[
              { label: 'Excellent (720-850)', val: 'excellent' },
              { label: 'Good (690-719)', val: 'good' },
              { label: 'Fair (630-689)', val: 'fair' },
              { label: 'Poor (300-629)', val: 'poor' }
            ].map(tier => (
              <button 
                key={tier.val}
                onClick={() => nextStep('creditTier', tier.val)}
                className="p-4 text-left rounded-xl border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-white font-medium transition-all"
              >
                {tier.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="animate-in fade-in slide-in-from-right-8 duration-500">
          <h3 className="text-lg font-medium text-white mb-4">Unlock Your Verified Rates</h3>
          <form onSubmit={submitToD1} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="text" 
                maxLength={5}
                placeholder="ZIP Code"
                required
                value={answers.zip}
                onChange={(e) => setAnswers(prev => ({ ...prev, zip: e.target.value }))}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-emerald-500"
              />
              <input 
                type="tel" 
                placeholder="Phone Number"
                required
                value={answers.phone}
                onChange={(e) => setAnswers(prev => ({ ...prev, phone: e.target.value }))}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <input 
              type="email" 
              placeholder="Email Address"
              required
              value={answers.email}
              onChange={(e) => setAnswers(prev => ({ ...prev, email: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-emerald-500"
            />
            <button type="submit" className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20">
              Show My Rates
            </button>
          </form>
        </div>
      )}

      {step === 4 && (
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 animate-in fade-in zoom-in-95 duration-500">
          <div className="filter blur-md opacity-50 select-none">
            <h3 className="text-xl font-bold text-white mb-4">Your Top Matches</h3>
            <div className="space-y-4">
              <div className="h-16 bg-gradient-to-r from-emerald-500/20 to-transparent rounded-lg flex items-center px-4">
                <div className="w-12 h-8 bg-white/10 rounded"></div>
                <div className="ml-4 h-4 w-24 bg-white/10 rounded"></div>
              </div>
              <div className="h-16 bg-gradient-to-r from-teal-500/20 to-transparent rounded-lg flex items-center px-4">
                <div className="w-12 h-8 bg-white/10 rounded"></div>
                <div className="ml-4 h-4 w-24 bg-white/10 rounded"></div>
              </div>
            </div>
          </div>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/60 backdrop-blur-md">
            <h3 className="text-2xl font-bold text-white mb-2">Verification Sent</h3>
            <p className="text-slate-300 mb-6 max-w-sm text-sm">
              We have sent a verification code to <strong>{answers.email}</strong>. Please check your inbox to view your personalized rates.
            </p>
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono">
              STATUS: AWAITING_VERIFICATION
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
