import React, { useState } from 'react';
import { LogIn } from 'lucide-react';

export default function RateGuidedFlow() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    loanType: '',
    creditTier: '',
    zip: ''
  });

  const nextStep = (key: string, val: string) => {
    setAnswers(prev => ({ ...prev, [key]: val }));
    setStep(s => s + 1);
  };

  const submitToD1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep(4);
    
    // In a real implementation, this would hit a Cloudflare Worker connected to D1
    // fetch('/api/leads', { method: 'POST', body: JSON.stringify(answers) })
    console.log("Saving lead to D1:", answers);
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
          <h3 className="text-lg font-medium text-white mb-4">Where are you located?</h3>
          <form onSubmit={submitToD1} className="flex gap-4">
            <input 
              type="text" 
              maxLength={5}
              placeholder="Enter ZIP Code"
              required
              value={answers.zip}
              onChange={(e) => setAnswers(prev => ({ ...prev, zip: e.target.value }))}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-emerald-500"
            />
            <button type="submit" className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-xl transition-colors">
              See Rates
            </button>
          </form>
        </div>
      )}

      {step === 4 && (
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 animate-in fade-in zoom-in-95 duration-500">
          <div className="filter blur-md opacity-50 select-none">
            <h3 className="text-xl font-bold text-white mb-4">Your Top Matches</h3>
            <div className="space-y-4">
              <div className="h-16 bg-white/10 rounded-lg"></div>
              <div className="h-16 bg-white/10 rounded-lg"></div>
              <div className="h-16 bg-white/10 rounded-lg"></div>
            </div>
          </div>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/40 backdrop-blur-sm">
            <div className="w-16 h-16 mb-4 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center">
              <LogIn className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Rates Unlocked</h3>
            <p className="text-slate-300 mb-6 max-w-sm">
              We've found 3 exact matches for your profile. Unlock your personalized rates with your 3000Studios ID.
            </p>
            <a 
              href="https://referrals.live/login" 
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-900 font-bold shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:scale-105 transition-transform"
            >
              Sign In with 3000Studios
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
