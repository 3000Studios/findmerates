import React from 'react';

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12">
        <h1 className="text-4xl font-display font-bold text-slate-900 mb-2">Terms of Service</h1>
        <p className="text-slate-400 text-sm mb-8">Last updated: April 27, 2026</p>
        <div className="prose prose-slate max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-bold">1. Service Nature</h2>
            <p>FindMeRates.com is provided for informational purposes only. We are not a bank, lender, broker, or financial advisor. All data is provided "as-is" with no guarantee of accuracy.</p>
          </section>

          <section className="p-6 bg-red-50 border border-red-100 rounded-xl">
            <h2 className="text-xl font-bold text-red-900">2. NO REFUND POLICY</h2>
            <p className="font-bold">ALL SALES ARE FINAL. NO REFUNDS. Once a payment or subscription is processed, it is non-refundable and non-reversible under any circumstances.</p>
          </section>

          <section className="p-6 bg-slate-50 border border-slate-100 rounded-xl">
            <h2 className="text-xl font-bold">3. COMPLETE LIABILITY WAIVER</h2>
            <p className="font-bold italic text-slate-700">TO THE MAXIMUM EXTENT PERMITTED BY LAW, FINDMERATES.COM AND ITS OPERATORS SHALL NOT BE HELD LIABLE FOR ANY LOSSES, DAMAGES, LEGAL ISSUES, OR DISPUTES ARISING FROM THE USE OF THIS PLATFORM. USER ASSUMES 100% OF THE RISK. WE CANNOT BE HELD LIABLE FOR ANYTHING.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold">4. Acceptable Use</h2>
            <p>You agree not to misuse the site, attempt unauthorized access, scrape protected areas, or interfere with the operation of the service. Any violation results in immediate termination.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
