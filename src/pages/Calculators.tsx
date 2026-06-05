import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calculator, Home, RefreshCw, Wallet, CreditCard, ShieldCheck, ChevronRight } from 'lucide-react';
import AdSenseSlot from '../components/AdSenseSlot';
import { AD_CLIENT, AD_SLOTS } from '../lib/ad-config';
import FinanceVideoStrip from '../components/FinanceVideoStrip';
import HeroVideo from '../components/HeroVideo';
import MortgageCalculator from '../components/MortgageCalculator';
import CDCalculator from '../components/calculators/CDCalculator';
import RefinanceCalculator from '../components/calculators/RefinanceCalculator';
import AffordabilityCalculator from '../components/calculators/AffordabilityCalculator';
import InsuranceEstimator from '../components/calculators/InsuranceEstimator';

const CALCS = [
  { type: 'mortgage',      icon: Home,           title: 'Mortgage Calculator',    desc: 'Estimate monthly principal and interest payments.' },
  { type: 'refinance',     icon: RefreshCw,      title: 'Refinance Calculator',   desc: 'See how much you could save by refinancing.' },
  { type: 'cd',            icon: Wallet,         title: 'CD Calculator',          desc: 'Calculate future value of a certificate of deposit.' },
  { type: 'affordability', icon: CreditCard,     title: 'Loan Affordability',     desc: 'Find out how much home you can actually afford.' },
  { type: 'insurance',     icon: ShieldCheck,    title: 'Insurance Estimator',    desc: 'Get a rough monthly homeowners insurance estimate.' },
];

function CalcNav({ active }: { active: string }) {
  return (
    <nav className="space-y-2">
      <h3 className="font-display font-bold text-slate-900 mb-4 text-sm uppercase tracking-widest">Calculators</h3>
      {CALCS.map((c) => (
        <Link
          key={c.type}
          to={`/calculators/${c.type}`}
          className={`flex items-center gap-3 p-4 rounded-xl border transition-all group ${
            active === c.type
              ? 'border-brand-600 bg-brand-50 text-brand-800'
              : 'border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:bg-brand-50'
          }`}
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
            active === c.type ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-brand-100 group-hover:text-brand-600'
          }`}>
            <c.icon className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm">{c.title}</p>
            <p className="text-xs text-slate-500 truncate">{c.desc}</p>
          </div>
          <ChevronRight className="w-4 h-4 shrink-0 text-slate-300 group-hover:text-brand-500 ml-auto" />
        </Link>
      ))}

      <div className="bg-brand-900 rounded-2xl p-6 text-white mt-6">
        <h4 className="font-display font-bold mb-2">Need a pro opinion?</h4>
        <p className="text-brand-200 text-xs mb-4">Our AI assistant can analyze your specific financial scenario in detail.</p>
        <Link to="/pro" className="block w-full py-3 bg-brand-500 hover:bg-brand-400 rounded-lg font-semibold transition-colors text-center text-sm">
          Ask AI Assistant
        </Link>
      </div>
    </nav>
  );
}

export default function Calculators() {
  const { type } = useParams<{ type?: string }>();
  const navigate = useNavigate();

  const activeType = type || 'mortgage';
  const activeCalc = CALCS.find((c) => c.type === activeType);

  React.useEffect(() => {
    const t = activeCalc?.title ?? 'Financial Calculators';
    document.title = `${t} — Free Tools | FindMeRates.com`;
  }, [activeType, activeCalc]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="relative mb-12 overflow-hidden rounded-4xl border border-white/10 bg-brand-900 px-6 py-14 text-center">
        <HeroVideo
          query="calculator finance desk"
          fallbackQuery="financial planning calculator desk"
          posterOnly
          overlayClassName="bg-gradient-to-b from-brand-900/85 via-brand-900/75 to-brand-900/95"
        />
        <div className="relative z-10">
          <h1 className="text-4xl font-display font-bold text-white mb-4 md:text-5xl">Financial Calculators</h1>
          <p className="text-white/75 max-w-2xl mx-auto">
            Free tools to help you make informed financial decisions. All updated with current market data.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {CALCS.map((c) => (
              <button
                key={c.type}
                type="button"
                onClick={() => navigate(`/calculators/${c.type}`)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeType === c.type
                    ? 'bg-white text-brand-900'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                {c.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <FinanceVideoStrip variant="calculator" />

          {activeType === 'mortgage' && <MortgageCalculator />}
          {activeType === 'cd' && <CDCalculator />}
          {activeType === 'refinance' && <RefinanceCalculator />}
          {activeType === 'affordability' && <AffordabilityCalculator />}
          {activeType === 'insurance' && <InsuranceEstimator />}

          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <AdSenseSlot
              adClient={AD_CLIENT}
              adSlot={AD_SLOTS.calculatorAfter.slotId}
              format={AD_SLOTS.calculatorAfter.format}
              minHeight={250}
              className="w-full"
            />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-8">
            <h3 className="text-xl font-display font-bold text-slate-900 mb-6">Why use our calculators?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-bold text-slate-800 mb-2">Accurate math</h4>
                <p className="text-sm text-slate-500">Industry-standard formulas and real-time interest rates — no guesswork.</p>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 mb-2">No data stored</h4>
                <p className="text-sm text-slate-500">Your financial inputs stay in your browser. Nothing is saved unless you choose to.</p>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 mb-2">Live next steps</h4>
                <p className="text-sm text-slate-500">Every calculator links directly to live rate comparisons and partner offers.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <CalcNav active={activeType} />

          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <AdSenseSlot
              adClient={AD_CLIENT}
              adSlot={AD_SLOTS.sidebar.slotId}
              format="auto"
              minHeight={300}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
