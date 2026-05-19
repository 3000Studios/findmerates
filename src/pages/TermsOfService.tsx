import React from 'react';
import { Link } from 'react-router-dom';

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12">
        <h1 className="text-4xl font-display font-bold text-slate-900 mb-2">Terms of Service</h1>
        <p className="text-slate-400 text-sm mb-8">Last updated: May 18, 2026</p>
        <div className="prose prose-slate max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-bold">1. Nature of the Service</h2>
            <p>
              FindMeRates.com is an independent rate-comparison and financial-information publisher. We
              are not a bank, lender, mortgage broker, insurance producer, registered investment adviser,
              or licensed financial advisor. All rate data, calculators, and educational content are
              provided for informational purposes only and do not constitute personalized financial, tax,
              accounting, or legal advice. Confirm any rate, fee, or product term directly with the
              lender before applying.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold">2. Subscriptions, Billing &amp; Refunds (FindMeRates Pro)</h2>
            <p>
              Optional paid subscriptions (such as FindMeRates Pro) are billed in advance on a recurring
              basis through Stripe, PayPal, or another authorized payment processor. You may cancel at
              any time from your account dashboard; cancellation takes effect at the end of the current
              billing period.
            </p>
            <p>
              <strong>Refund policy.</strong> If you are dissatisfied with a paid subscription, contact{" "}
              <a className="text-brand-700 underline" href="mailto:hello@findmerates.com">hello@findmerates.com</a>{" "}
              within fourteen (14) days of your initial charge and we will issue a full refund for that
              charge. Refunds outside this window are evaluated on a case-by-case basis. Nothing in this
              section limits any non-waivable refund or cancellation rights you have under applicable
              state or federal consumer-protection law (including, where applicable, California Civil
              Code §§ 1689.5–1689.14 and similar statutes).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold">3. Disclaimer of Warranties</h2>
            <p>
              FindMeRates.com is provided on an "as is" and "as available" basis. To the maximum extent
              permitted by applicable law, we disclaim all warranties, express or implied, including
              warranties of merchantability, fitness for a particular purpose, accuracy, and
              non-infringement. We do not guarantee that any rate displayed is the rate you will be
              offered by a lender.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold">4. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable law, FindMeRates.com and its operators,
              affiliates, and contributors shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages arising from your use of the site. Our total aggregate
              liability for any direct damages is limited to the greater of (a) the amount you paid to
              FindMeRates.com in the twelve (12) months preceding the event giving rise to the claim or
              (b) one hundred U.S. dollars (US$100).
            </p>
            <p>
              Nothing in these Terms excludes or limits liability that cannot lawfully be excluded or
              limited under applicable law (for example, liability for gross negligence, willful
              misconduct, fraud, or for death or personal injury caused by negligence in jurisdictions
              where such limitation is prohibited).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold">5. Acceptable Use</h2>
            <p>
              You agree not to misuse the site, attempt unauthorized access, scrape non-public data,
              interfere with the operation of the service, or use the service to violate any law. We may
              suspend or terminate access for any violation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold">6. Third-Party Links &amp; Lender Offers</h2>
            <p>
              FindMeRates.com displays links to lender, bank, and financial-product websites. We do not
              control and are not responsible for the content, products, or services on third-party
              sites. Some links are affiliate links — see our{" "}
              <Link className="text-brand-700 underline" to="/affiliate-disclosure">Affiliate Disclosure</Link>{" "}
              and <Link className="text-brand-700 underline" to="/how-we-make-money">How We Make Money</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold">7. Governing Law &amp; Disputes</h2>
            <p>
              These Terms are governed by the laws of the State of Georgia, United States, without regard
              to its conflict-of-laws rules. Disputes will be brought in the state or federal courts
              located in Cobb County, Georgia, except that you retain any non-waivable right to bring
              claims in your home jurisdiction under applicable consumer-protection law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold">8. Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time. Material changes will be reflected by updating
              the "Last updated" date above. Continued use of the service after a change constitutes
              acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold">9. Contact</h2>
            <p>
              Questions about these Terms? Email{" "}
              <a className="text-brand-700 underline" href="mailto:hello@findmerates.com">hello@findmerates.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
