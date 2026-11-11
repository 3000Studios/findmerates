// scripts/prerender.mjs
// Static-HTML prerender for FindMeRates.com.
// Reads dist/index.html (produced by `vite build`) and emits per-route HTML
// snapshots with route-specific <title>, <meta>, <link rel=canonical>,
// JSON-LD schema, and crawlable <noscript> body content. The React app
// still hydrates on the client; this layer exists purely so Googlebot,
// Bingbot, and social scrapers see real content on first request.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const SHELL_PATH = path.join(DIST, "index.html");
const ORIGIN = "https://findmerates.com";

if (!fs.existsSync(SHELL_PATH)) {
  console.error("[prerender] dist/index.html not found. Run `vite build` first.");
  process.exit(1);
}

const shell = fs.readFileSync(SHELL_PATH, "utf8");
const today = new Date().toISOString().slice(0, 10);

/** @typedef {{ path:string, title:string, description:string, h1:string, body:string, jsonLd?:any }} Route */

const CATEGORY_BODIES = {
  mortgage: `
    <p>Compare today's mortgage rates from leading U.S. lenders. View 30-year fixed, 15-year fixed, ARM, FHA, VA, and jumbo loan offers side by side. Use our free mortgage calculator to estimate your monthly payment, total interest, and amortization schedule.</p>
    <h2>How we source mortgage rate data</h2>
    <p>National average rates are sourced from the Freddie Mac Primary Mortgage Market Survey and Federal Reserve Economic Data (FRED). Lender offers shown are publicly listed rates from partner institutions. See our <a href="/methodology">Methodology</a> for full sourcing details.</p>
    <h2>Top mortgage lenders we compare</h2>
    <ul>
      <li>Rocket Mortgage</li>
      <li>Better Mortgage</li>
      <li>SoFi Home Loans</li>
    </ul>
    <h2>Frequently asked questions</h2>
    <p><strong>How does FindMeRates make money on mortgage referrals?</strong> We may receive compensation from lenders when you click an offer and apply. This does not change the rate offered to you. See <a href="/how-we-make-money">How We Make Money</a>.</p>
    <p><strong>Are these the actual rates I will be offered?</strong> No. Personalized rates depend on your credit profile, income, loan amount, and lender criteria. Use these as a benchmark and confirm directly with the lender.</p>
  `,
  cd: `
    <p>Compare the best CD rates and APYs from FDIC-insured banks and credit unions. View 3-month, 6-month, 1-year, 2-year, and 5-year certificate of deposit offers in one place.</p>
    <h2>How we source CD rate data</h2>
    <p>National average CD APYs are sourced from the FDIC Weekly National Rates and Rate Caps report. Top-yield CD offers are pulled from publicly listed lender rate sheets. See our <a href="/methodology">Methodology</a>.</p>
    <h2>Top CD providers we compare</h2>
    <ul>
      <li>Marcus by Goldman Sachs</li>
      <li>Ally Bank</li>
      <li>Discover Bank</li>
    </ul>
  `,
  auto_loan: `
    <p>Compare today's auto loan rates for new and used vehicles. View offers from banks, credit unions, and online lenders across every credit tier.</p>
    <h2>How we source auto loan rate data</h2>
    <p>National average auto loan rates are sourced from the Federal Reserve G.19 Consumer Credit release and lender-reported rate sheets. See our <a href="/methodology">Methodology</a>.</p>
    <h2>Top auto loan partners we compare</h2>
    <ul>
      <li>LightStream</li>
      <li>Capital One Auto Navigator</li>
      <li>Auto Approve</li>
    </ul>
  `,
  personal_loan: `
    <p>Compare personal loan rates and APRs from leading U.S. lenders. View offers for debt consolidation, home improvement, medical expenses, and other unsecured loan purposes.</p>
    <h2>How we source personal loan rate data</h2>
    <p>National average APRs are sourced from the Federal Reserve G.19 Consumer Credit release. Lender offers shown are publicly listed rates from partner institutions. See our <a href="/methodology">Methodology</a>.</p>
    <h2>Top personal loan partners we compare</h2>
    <ul>
      <li>SoFi Personal Loans</li>
      <li>LightStream</li>
      <li>Discover Personal Loans</li>
    </ul>
  `,
  savings: `
    <p>Compare the best high-yield savings account rates from FDIC-insured online and traditional banks. View today's top APYs side by side.</p>
    <h2>How we source savings rate data</h2>
    <p>Rates are pulled from publicly listed lender rate sheets and the FDIC Weekly National Rates report. See our <a href="/methodology">Methodology</a>.</p>
  `,
  refinance: `
    <p>Compare today's refinance rates for mortgages and auto loans. View offers from leading U.S. lenders to see if refinancing could lower your monthly payment or total interest paid.</p>
    <h2>How we source refinance rate data</h2>
    <p>National average refinance rates are sourced from the Freddie Mac Primary Mortgage Market Survey and lender-published rate sheets. See our <a href="/methodology">Methodology</a> for full sourcing details.</p>
    <h2>When refinancing makes sense</h2>
    <p>Refinancing replaces your current loan with a new one. It can lower your monthly payment, shorten your term, or switch you from an adjustable rate to a fixed rate — but it also comes with closing costs, so the break-even point matters: divide the total cost of the refinance by the monthly savings to see how many months you need to keep the loan before it pays off. Run your own figures with our free <a href="/calculators/refinance">refinance calculator</a> before you apply, and compare the Loan Estimates lenders give you, not just the headline rate.</p>
    <h2>Top refinance partners we compare</h2>
    <ul>
      <li>Better Mortgage</li>
      <li>Rocket Mortgage</li>
      <li>SoFi Home Loans</li>
    </ul>
  `,
};

const CATEGORY_LABEL = {
  mortgage: "Mortgage",
  cd: "CD",
  auto_loan: "Auto Loan",
  personal_loan: "Personal Loan",
  savings: "Savings",
  refinance: "Refinance",
};

function categoryRoute(slug) {
  const label = CATEGORY_LABEL[slug];
  return {
    path: `/rates/${slug}`,
    title: `Today's ${label} Rates — Compare Offers from Top Lenders | FindMeRates.com`,
    description: `Compare today's ${label.toLowerCase()} rates from leading U.S. lenders. Free comparison tools and rate guides. Updated ${today}.`,
    h1: `Today's ${label} Rates`,
    body: CATEGORY_BODIES[slug] || "",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": `Today's ${label} Rates`,
      "url": `${ORIGIN}/rates/${slug}`,
      "description": `Compare today's ${label.toLowerCase()} rates from leading U.S. lenders.`,
      "publisher": { "@type": "Organization", "name": "FindMeRates.com", "url": ORIGIN },
      "isPartOf": { "@type": "WebSite", "name": "FindMeRates.com", "url": ORIGIN }
    }
  };
}

const ROUTES = [
  {
    path: "/",
    title: "FindMeRates.com — Compare Today's Best Mortgage, CD & Loan Rates",
    description: "Compare today's mortgage rates, CD APYs, auto loan rates, and personal loan APRs from leading U.S. lenders. Free calculators and daily updates.",
    h1: "Compare Today's Best Financial Rates",
    body: `
      <p>FindMeRates.com aggregates publicly available rate data and lender offers so U.S. consumers can compare mortgages, CDs, auto loans, personal loans, savings accounts, and refinance offers in one place.</p>
      <h2>Browse rate categories</h2>
      <ul>
        <li><a href="/rates/mortgage">Mortgage Rates</a></li>
        <li><a href="/rates/cd">CD Rates</a></li>
        <li><a href="/rates/auto_loan">Auto Loan Rates</a></li>
        <li><a href="/rates/personal_loan">Personal Loan Rates</a></li>
        <li><a href="/rates/savings">Savings Rates</a></li>
        <li><a href="/rates/refinance">Refinance Rates</a></li>
      </ul>
      <h2>Free calculators</h2>
      <p><a href="/calculators/mortgage">Mortgage calculator</a> · <a href="/calculators">Auto, personal loan, CD calculators</a></p>
      <h2>Editorial &amp; revenue disclosures</h2>
      <p>FindMeRates may be compensated by lenders when you click partner offers. Read our <a href="/how-we-make-money">How We Make Money</a>, <a href="/affiliate-disclosure">Affiliate Disclosure</a>, <a href="/editorial-policy">Editorial Policy</a>, and <a href="/methodology">Methodology</a>.</p>
    `,
  },
  categoryRoute("mortgage"),
  categoryRoute("cd"),
  categoryRoute("auto_loan"),
  categoryRoute("personal_loan"),
  categoryRoute("savings"),
  categoryRoute("refinance"),
  {
    path: "/calculators",
    title: "Free Financial Calculators — Mortgage, CD, Auto, Personal Loan | FindMeRates.com",
    description: "Free mortgage, CD, auto loan, and personal loan calculators. Estimate payments, interest, and earnings before you apply.",
    h1: "Free Financial Calculators",
    body: `
      <p>Use our free calculators to estimate monthly payments, total interest paid, and CD earnings before you apply for a loan or open an account. Includes our <a href="/calculators/mortgage">mortgage payment calculator</a>.</p>
      <h2>The calculator set</h2>
      <ul>
        <li><a href="/calculators/mortgage">Mortgage payment calculator</a> — monthly principal and interest, total interest, and amortization for a home loan.</li>
        <li><a href="/calculators/cd">CD calculator</a> — what a certificate of deposit earns at a given APY and term.</li>
        <li><a href="/calculators/refinance">Refinance calculator</a> — monthly and lifetime savings from refinancing, including the break-even point on closing costs.</li>
        <li><a href="/calculators/affordability">Affordability calculator</a> — how much home your income and debts can support.</li>
        <li><a href="/calculators/insurance">Homeowners insurance estimator</a> — a planning estimate for insuring a home.</li>
      </ul>
      <p>Every calculator is free and runs entirely in your browser — we do not ask for an account and we do not store the figures you enter. Results are estimates for planning, not quotes; see our <a href="/disclaimer">Disclaimer</a> for what they do and do not include. When you are ready, compare live offers on the matching rate page, starting with <a href="/rates/mortgage">today's mortgage rates</a>.</p>
    `,
  },
  {
    path: "/calculators/mortgage",
    title: "Free Mortgage Payment Calculator | FindMeRates.com",
    description: "Estimate your monthly mortgage payment, total interest paid, and amortization schedule with our free mortgage calculator.",
    h1: "Mortgage Payment Calculator",
    body: `<p>Enter your home price, down payment, interest rate, and loan term to estimate your monthly principal &amp; interest payment. Then <a href="/rates/mortgage">compare today's mortgage rates</a> from top lenders.</p>`,
  },
  {
    path: "/calculators/cd",
    title: "Free CD Calculator — Certificate of Deposit Earnings | FindMeRates.com",
    description: "Calculate the future value of a certificate of deposit: enter your deposit, term, and APY to see interest earned and the effective APY at maturity.",
    h1: "CD Calculator",
    body: `<p>Enter your initial deposit, CD term, and APY to calculate the interest your certificate of deposit will earn, its value at maturity, and the effective APY after compounding. Then <a href="/rates/cd">compare today's CD rates</a> from FDIC-insured banks and credit unions.</p>
    <p>CDs pay a fixed rate for a fixed term, so the only inputs that matter are how much you deposit, how long you leave it, and the APY. Longer terms usually carry higher APYs, but withdrawing before maturity typically costs an early-withdrawal penalty — check the terms before you open an account.</p>`,
  },
  {
    path: "/calculators/refinance",
    title: "Free Refinance Calculator — Monthly & Lifetime Savings | FindMeRates.com",
    description: "See how much you could save by refinancing: compare your current loan payment with a new loan to estimate monthly savings and lifetime savings.",
    h1: "Refinance Calculator",
    body: `<p>Enter your current loan details and the terms of a replacement loan to compare your old payment with the new payment and estimate your monthly savings and lifetime savings from refinancing. Then <a href="/rates/refinance">compare today's refinance rates</a> from leading lenders.</p>
    <p>Refinancing replaces your existing loan with a new one, ideally at a lower rate or a term that better fits your budget. The calculator shows the payment difference; remember to weigh it against closing costs on the new loan to find your break-even point.</p>`,
  },
  {
    path: "/calculators/affordability",
    title: "Free Loan Affordability Calculator — How Much Home Can You Afford? | FindMeRates.com",
    description: "Find out how much home you can actually afford: enter your income, debts, and loan term to estimate your maximum home price and loan amount using DTI ratio guidelines.",
    h1: "Loan Affordability Calculator",
    body: `<p>Enter your income, monthly debts, down payment, and loan term to estimate the maximum home price and loan amount you can afford. The calculator uses your debt-to-income (DTI) ratio — the share of your gross income that goes to debt payments — which is the same guideline lenders apply when they pre-approve a mortgage. Then <a href="/rates/mortgage">compare today's mortgage rates</a> to see what your payment would look like.</p>
    <p>Lenders generally look for a housing ratio and a total DTI within conventional limits; a lower DTI usually means a wider choice of loan programs and better pricing. Treat the result as a planning estimate, not a pre-approval.</p>`,
  },
  {
    path: "/calculators/insurance",
    title: "Free Homeowners Insurance Estimator | FindMeRates.com",
    description: "Get a rough monthly homeowners insurance estimate based on your state, coverage level, and state risk factors, with a typical range for comparison.",
    h1: "Insurance Estimator",
    body: `<p>Select your state and coverage level to get a rough estimate of your annual homeowners insurance premium, adjusted for state risk factors, along with a typical range so you can compare quotes in context. Homeowners insurance is usually required by mortgage lenders and is commonly billed as part of your monthly escrow payment alongside your mortgage.</p>
    <p>Your actual premium depends on the home's replacement cost, age and construction, claims history, deductible, and local risks such as storms or wildfire. Use this estimator to sanity-check quotes, then compare offers from licensed insurers in your state.</p>`,
  },
  {
    path: "/about",
    title: "About FindMeRates.com — Independent Rate Comparison Publisher",
    description: "FindMeRates.com is an independent U.S. financial rate comparison site covering mortgages, CDs, auto loans, personal loans, and savings accounts.",
    h1: "About FindMeRates.com",
    body: `
      <p>FindMeRates.com is an independent rate-comparison publisher. We aggregate publicly available rate data and lender offers across mortgages, CDs, auto loans, personal loans, savings, and refinance products. We are not a bank, lender, or licensed financial advisor.</p>
      <h2>What we publish</h2>
      <p>Our category pages track current rates for 30-year and 15-year fixed mortgages, adjustable-rate mortgages, FHA and VA loans, certificates of deposit from 3 months to 5 years, new and used auto loans, unsecured personal loans, high-yield savings accounts, and mortgage refinance offers. Each category page shows a national benchmark rate sourced from public data — the Freddie Mac Primary Mortgage Market Survey, the FDIC Weekly National Rates report, and the Federal Reserve G.19 Consumer Credit release — alongside offers from partner lenders and banks. See our <a href="/methodology">Methodology</a> for exactly how each figure is sourced and updated.</p>
      <h2>Tools, guides, and news</h2>
      <p>Beyond rate tables, we publish free <a href="/calculators">financial calculators</a> for mortgage payments, CD earnings, refinance savings, affordability, and homeowners insurance estimates; plain-English <a href="/guide">rate guides</a> explaining how rates are set and how credit scores affect the APR you are offered; and <a href="/stories">market briefings</a> that track Federal Reserve policy and lender announcements as they move rates.</p>
      <h2>How we stay independent</h2>
      <p>FindMeRates.com is free for consumers. We earn revenue from display advertising and from referral partnerships with some of the lenders listed on the site. Compensation never changes the rate a lender offers you and never influences our editorial assessments. The full details are in <a href="/how-we-make-money">How We Make Money</a>, our <a href="/affiliate-disclosure">Affiliate Disclosure</a>, and our <a href="/editorial-policy">Editorial Policy</a>.</p>
    `,
  },
  {
    path: "/contact",
    title: "Contact FindMeRates.com",
    description: "Get in touch with the FindMeRates.com editorial team.",
    h1: "Contact Us",
    body: `
      <p>Email: <strong>hello@findmerates.com</strong> — for editorial corrections, partnership inquiries, or general questions about FindMeRates.com.</p>
      <h2>Editorial corrections</h2>
      <p>Found a rate, figure, or fact on the site that looks wrong? Email us with the page URL and what you believe is incorrect. Material corrections are verified against our primary sources (Freddie Mac PMMS, FDIC, and Federal Reserve releases) and noted at the bottom of the affected page, as described in our <a href="/editorial-policy">Editorial Policy</a>.</p>
      <h2>Partnership inquiries</h2>
      <p>Lenders, banks, and credit unions interested in listing offers on FindMeRates.com can reach the partnerships team at the same address. Listing relationships are disclosed under our <a href="/affiliate-disclosure">Affiliate Disclosure</a>, and partners cannot pay to influence editorial assessments.</p>
      <h2>Questions about a loan or account</h2>
      <p>FindMeRates.com is a comparison publisher, not a lender or bank. We cannot quote you a personalized rate, take an application, or service an existing loan or account. For questions about an offer, an application, or an account, contact the lender or bank directly — every offer on our category pages links to the institution that provides it.</p>
      <h2>Privacy questions</h2>
      <p>For questions about what data we collect and how it is used, see our <a href="/privacy">Privacy Policy</a> or email us at the address above.</p>
    `,
  },
  {
    path: "/how-we-make-money",
    title: "How We Make Money | FindMeRates.com",
    description: "FindMeRates.com earns revenue through advertising and lender referral partnerships. Learn how this works and how it affects what you see.",
    h1: "How We Make Money",
    body: `
      <p>FindMeRates.com is free for consumers to use. We earn revenue in three ways:</p>
      <ol>
        <li><strong>Display advertising.</strong> We display ads served by Google AdSense (publisher ID ca-pub-5800977493749262) on most pages.</li>
        <li><strong>Affiliate and referral partnerships.</strong> When you click a partner offer and complete an action (such as submitting a quote request or opening an account), the lender may pay us a referral fee.</li>
        <li><strong>Optional consumer subscriptions.</strong> Our Pro tier provides additional alerts and tools for a recurring fee.</li>
      </ol>
      <p>Compensation may influence which offers appear and where, but it does not influence the rate offered to you by the lender, and it does not change our editorial assessments. Read our <a href="/editorial-policy">Editorial Policy</a> and <a href="/affiliate-disclosure">Affiliate Disclosure</a> for more.</p>
    `,
  },
  {
    path: "/affiliate-disclosure",
    title: "Affiliate Disclosure | FindMeRates.com",
    description: "Full FTC-compliant disclosure of FindMeRates.com's affiliate and referral relationships with financial partners.",
    h1: "Affiliate Disclosure",
    body: `
      <p><strong>Advertiser Disclosure:</strong> FindMeRates.com may receive compensation from companies whose offers appear on this site. This compensation may impact which offers are listed and where they appear, including the order in which they appear on category and comparison pages. Compensation does not influence the rate or terms a lender ultimately offers you, and it does not influence our editorial ratings, reviews, or recommendations.</p>
      <p>FindMeRates.com does not include every lender or every offer available in the marketplace. Some products linked on this site are provided by partners who compensate us; others are not. We aim to label sponsored placements clearly.</p>
      <p>This disclosure is provided in accordance with the Federal Trade Commission's <em>Guides Concerning the Use of Endorsements and Testimonials in Advertising</em>.</p>
    `,
  },
  {
    path: "/editorial-policy",
    title: "Editorial Policy | FindMeRates.com",
    description: "How FindMeRates.com creates, reviews, and updates rate data and financial content.",
    h1: "Editorial Policy",
    body: `
      <p>FindMeRates.com publishes rate comparisons, calculators, and explanatory financial content for U.S. consumers. Our editorial principles:</p>
      <ul>
        <li><strong>Independence.</strong> Editorial recommendations are made independently of advertising and affiliate relationships. Partners cannot pay to influence editorial assessment.</li>
        <li><strong>Sourcing.</strong> Rate data is sourced from publicly available references including the Freddie Mac Primary Mortgage Market Survey, the FDIC Weekly National Rates report, and the Federal Reserve G.19 Consumer Credit release, supplemented by lender-published rate sheets.</li>
        <li><strong>Updates.</strong> Category rate pages are reviewed at least weekly. Each page displays the date it was last reviewed.</li>
        <li><strong>Corrections.</strong> Email hello@findmerates.com to report a factual error. Material corrections are noted at the bottom of the affected page.</li>
        <li><strong>Not advice.</strong> Content on FindMeRates.com is informational and is not personalized financial, tax, or legal advice. Consult a licensed professional for advice specific to your situation.</li>
      </ul>
    `,
  },
  {
    path: "/methodology",
    title: "Rate Methodology | FindMeRates.com",
    description: "How FindMeRates.com sources, verifies, and displays mortgage, CD, auto loan, personal loan, and savings rate data.",
    h1: "Rate Methodology",
    body: `
      <p>The following sources are used to compile rate data across FindMeRates.com:</p>
      <ul>
        <li><strong>Mortgage rates:</strong> Freddie Mac Primary Mortgage Market Survey (PMMS), updated weekly; FRED series MORTGAGE30US and MORTGAGE15US; lender-published rate sheets.</li>
        <li><strong>CD &amp; savings rates:</strong> FDIC Weekly National Rates and Rate Caps report; published rate sheets from FDIC-insured banks and NCUA-insured credit unions.</li>
        <li><strong>Auto loan rates:</strong> Federal Reserve G.19 Consumer Credit release; lender-published rate sheets.</li>
        <li><strong>Personal loan rates:</strong> Federal Reserve G.19 Consumer Credit release; lender-published APR ranges.</li>
      </ul>
      <p><strong>Rate disclaimer:</strong> Rates displayed are for informational purposes only and may not reflect the rate ultimately offered to you. Your actual rate depends on your credit profile, loan amount, term, lender criteria, and current market conditions. Always confirm the rate directly with the lender before applying.</p>
    `,
  },
  {
    path: "/privacy",
    title: "Privacy Policy | FindMeRates.com",
    description: "How FindMeRates.com collects, uses, and protects your personal information.",
    h1: "Privacy Policy",
    body: `<p>This page explains what information FindMeRates.com collects, how we use it, and your rights. Full policy text loads below.</p><p>Advertising &amp; cookies: Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this and other websites. Google's use of advertising cookies (including the DoubleClick cookie) enables it and its partners to serve ads based on your visits to this and other sites. You can opt out of personalized advertising at <a href="https://www.google.com/settings/ads">www.google.com/settings/ads</a> and opt out of some third-party vendors' cookies at <a href="https://www.aboutads.info">www.aboutads.info</a>.</p>`,
  },
  {
    path: "/privacy-policy",
    title: "Privacy Policy | FindMeRates.com",
    description: "How FindMeRates.com collects, uses, and protects your personal information.",
    h1: "Privacy Policy",
    body: `<p>This page explains what information FindMeRates.com collects, how we use it, and your rights. Full policy text loads below.</p><p>Advertising &amp; cookies: Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this and other websites. Google's use of advertising cookies (including the DoubleClick cookie) enables it and its partners to serve ads based on your visits to this and other sites. You can opt out of personalized advertising at <a href="https://www.google.com/settings/ads">www.google.com/settings/ads</a> and opt out of some third-party vendors' cookies at <a href="https://www.aboutads.info">www.aboutads.info</a>.</p>`,
  },
  {
    path: "/terms",
    title: "Terms of Service | FindMeRates.com",
    description: "Terms that govern your use of FindMeRates.com.",
    h1: "Terms of Service",
    body: `
      <p>Your use of FindMeRates.com is subject to the terms below. By accessing or using the site, you agree to them.</p>
      <h2>What FindMeRates.com is</h2>
      <p>FindMeRates.com is an independent rate-comparison and financial-education publisher. We are not a bank, lender, credit union, mortgage broker, or licensed financial advisor, and nothing on this site is an offer to lend, a loan approval, or personalized financial advice. Rate figures are compiled from public sources and lender-published rate sheets as described in our <a href="/methodology">Methodology</a>; the rate you are ultimately offered depends on your credit profile, income, loan amount, term, and the lender's criteria, and is set solely by the lender.</p>
      <h2>Third-party offers and links</h2>
      <p>Category and calculator pages link to third-party lenders, banks, and insurers. When you leave FindMeRates.com, that institution's own terms and privacy policy govern your application and any account you open. We may be compensated by partners when you click an offer, as disclosed in <a href="/how-we-make-money">How We Make Money</a> and our <a href="/affiliate-disclosure">Affiliate Disclosure</a>; compensation does not change the rate or terms a lender offers you.</p>
      <h2>Acceptable use</h2>
      <p>You agree to use the site for personal, non-commercial comparison and education, not to scrape rate data in bulk, misrepresent your identity, or interfere with the site's operation. Content is provided "as is" without warranties of accuracy or availability; rate data is reviewed on the cadence described in our <a href="/editorial-policy">Editorial Policy</a>, but market rates change daily and a displayed figure may lag the market.</p>
    `,
  },
  {
    path: "/disclaimer",
    title: "Disclaimer | FindMeRates.com",
    description: "Important disclaimers regarding rate data, financial information, and use of FindMeRates.com.",
    h1: "Disclaimer",
    body: `
      <p>FindMeRates.com is not a bank, lender, or financial advisor. Rates shown are informational only and are not a quote, an offer, or a guarantee of any rate or term.</p>
      <h2>Rates are benchmarks, not quotes</h2>
      <p>National benchmark rates come from the Freddie Mac Primary Mortgage Market Survey, the FDIC Weekly National Rates and Rate Caps report, and the Federal Reserve G.19 Consumer Credit release. Partner offers are the rates those institutions publish publicly. Your actual APR will depend on your credit score, income, debts, loan-to-value ratio, loan amount, and term, and can differ materially from any figure shown here. Always confirm the rate, fees, and terms directly with the lender before applying, and compare the Loan Estimate or account disclosures the lender is required to give you.</p>
      <h2>Calculator results are estimates</h2>
      <p>Our <a href="/calculators">calculators</a> produce estimates for planning purposes. A mortgage payment estimate, for example, may exclude property taxes, homeowners insurance, mortgage insurance, and HOA dues unless you add them, and a CD earnings estimate assumes the APY stays fixed for the full term. Do not make a borrowing or deposit decision based solely on a calculator result.</p>
      <h2>Not professional advice</h2>
      <p>Guides, briefings, and comparisons on this site are general education. They are not tailored financial, tax, or legal advice. Consult a licensed financial advisor, tax professional, or attorney for advice about your specific situation. See our <a href="/editorial-policy">Editorial Policy</a> for how content is produced and corrected.</p>
    `,
  },
  {
    path: "/cookies",
    title: "Cookie Policy | FindMeRates.com",
    description: "How FindMeRates.com uses cookies and similar technologies.",
    h1: "Cookie Policy",
    body: `
      <p>This page explains the cookies and similar technologies FindMeRates.com uses, why we use them, and how to manage your preferences.</p>
      <h2>Advertising cookies</h2>
      <p>Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this and other websites. Google's use of advertising cookies (including the DoubleClick cookie) enables it and its partners to serve ads based on your visits to this and other sites. You can opt out of personalized advertising at <a href="https://www.google.com/settings/ads">www.google.com/settings/ads</a> and opt out of some third-party vendors' use of cookies at <a href="https://www.aboutads.info">www.aboutads.info</a>.</p>
      <h2>Essential and analytics cookies</h2>
      <p>We use essential cookies to keep the site functional and secure, and analytics cookies to understand which pages and calculators readers use so we can improve them. Analytics data is aggregated and is not used to identify individual visitors for lending decisions — we never see or store your credit report, income documents, or bank credentials.</p>
      <h2>Managing cookies</h2>
      <p>Most browsers let you block or delete cookies in their settings. Blocking advertising cookies will not remove ads from the site, but the ads will no longer be personalized. For the full picture of what we collect and why, read our <a href="/privacy">Privacy Policy</a>.</p>
    `,
  },
  {
    path: "/guide",
    title: "Rate Guides & Financial Education | FindMeRates.com",
    description: "Plain-English guides on mortgage, CD, auto loan, and personal loan rates.",
    h1: "Rate Guides",
    body: `
      <p>Explore plain-English guides covering how rates work, when to lock, how credit scores affect APR, and more.</p>
      <h2>What the guides cover</h2>
      <ul>
        <li><strong>Mortgages:</strong> how lenders price 30-year and 15-year fixed rates, what a rate lock is and when to use one, points and lender credits, and how FHA, VA, and jumbo loans differ from conventional loans.</li>
        <li><strong>CDs and savings:</strong> how APY is calculated, laddering CDs across maturities, early-withdrawal penalties, and what FDIC and NCUA insurance actually covers.</li>
        <li><strong>Auto and personal loans:</strong> how credit tiers map to APR, dealer financing versus a pre-approval from your own bank or credit union, origination fees, and what refinancing a loan can and cannot save you.</li>
        <li><strong>Credit and borrowing:</strong> how your credit score, debt-to-income ratio, and loan-to-value ratio move the offers you receive, and the order in which to fix them before you apply.</li>
      </ul>
      <h2>How to use a guide</h2>
      <p>Each guide is written against the same public data behind our rate tables — the Freddie Mac PMMS, FDIC national rates, and Federal Reserve releases described in our <a href="/methodology">Methodology</a> — and links to the matching category page and <a href="/calculators">calculator</a> so you can run your own numbers. Guides are education, not personalized advice; see our <a href="/disclaimer">Disclaimer</a>.</p>
    `,
  },
  {
    path: "/stories",
    title: "Financial Rate News & Market Briefings | FindMeRates.com",
    description: "Latest financial rate news, Federal Reserve briefings, and market updates affecting mortgage, CD, and loan rates.",
    h1: "Rate News & Market Briefings",
    body: `
      <p>Track the latest news on interest rates, Federal Reserve policy, and lender announcements.</p>
      <h2>What we brief</h2>
      <p>Our briefings follow the events that actually move the rates on this site: Federal Open Market Committee decisions and the Fed's published projections, the weekly Freddie Mac Primary Mortgage Market Survey, the FDIC's weekly national rate averages, Treasury yield moves that mortgage pricing follows, and material rate changes announced by the lenders and banks listed in our comparisons.</p>
      <h2>How a briefing connects to the tables</h2>
      <p>When a briefing reports a benchmark move, the corresponding category page — <a href="/rates/mortgage">mortgage</a>, <a href="/rates/cd">CD</a>, <a href="/rates/auto_loan">auto loan</a>, <a href="/rates/personal_loan">personal loan</a>, <a href="/rates/savings">savings</a>, or <a href="/rates/refinance">refinance</a> — is reviewed on the cadence in our <a href="/editorial-policy">Editorial Policy</a> and stamped with its last-reviewed date. Briefings explain the "why" behind a rate change; they are reporting and education, not a recommendation to lock, float, buy, or refinance. See our <a href="/disclaimer">Disclaimer</a>.</p>
    `,
  },
  {
    path: "/pro",
    title: "FindMeRates Pro — Rate Alerts & Pro Tools",
    description: "Upgrade to FindMeRates Pro for rate-drop alerts, deeper scenarios, and pro-only calculators.",
    h1: "FindMeRates Pro",
    body: `
      <p>FindMeRates Pro adds rate-drop alerts, scenario tools, and ad-light browsing for $9.99 / month or $39.99 for 6 months paid in full.</p>
      <h2>What Pro includes</h2>
      <ul>
        <li><strong>Rate-drop alerts:</strong> tell us the category and the target rate you are waiting for, and we email you when the published benchmark or a tracked partner offer reaches it.</li>
        <li><strong>Deeper scenarios:</strong> extended calculator scenarios that compare loan structures side by side — term, points, and down-payment combinations — beyond the free <a href="/calculators">calculators</a>.</li>
        <li><strong>Ad-light browsing:</strong> a reduced-ad reading experience across rate tables, guides, and briefings.</li>
      </ul>
      <h2>What stays free</h2>
      <p>Every rate table, benchmark figure, guide, briefing, and standard calculator on FindMeRates.com is free and does not require an account. Pro is an optional add-on for readers who want alerts and deeper scenarios; it does not change the rates shown, the order of offers, or our editorial assessments, which are governed by our <a href="/editorial-policy">Editorial Policy</a>. Revenue from Pro is one of the ways the site is funded — see <a href="/how-we-make-money">How We Make Money</a>.</p>
    `,
  },
];

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function buildHtml(route) {
  const canonical = `${ORIGIN}${route.path === "/" ? "/" : route.path}`;
  const title = escapeHtml(route.title);
  const description = escapeHtml(route.description);

  // Replace <title>
  let html = shell.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);
  // Replace meta description
  html = html.replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${description}" />`);
  // Replace canonical
  html = html.replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${canonical}" />`);
  // Replace og:url
  html = html.replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${canonical}" />`);
  // Replace og:title
  html = html.replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${title}" />`);
  // Replace og:description
  html = html.replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${description}" />`);
  // Replace twitter:title / description
  html = html.replace(/<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${title}" />`);
  html = html.replace(/<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${description}" />`);

  // Inject per-route JSON-LD before </head>
  if (route.jsonLd) {
    const ld = `<script type="application/ld+json">${JSON.stringify(route.jsonLd)}</script>\n  </head>`;
    html = html.replace("</head>", ld);
  }

  // Inject crawlable route-specific body content inside #root. React hydrates
  // over this on the client. Pre-hydration, Googlebot/Bingbot/social scrapers
  // see real HTML — fixing the indexability problem.
  const prerenderBlock = `<div id="prerender-seo" style="position:absolute;left:-99999px;top:0;width:1px;height:1px;overflow:hidden" aria-hidden="true">
    <header><a href="/">FindMeRates.com</a>
      <nav>
        <a href="/rates/mortgage">Mortgage Rates</a>
        <a href="/rates/cd">CD Rates</a>
        <a href="/rates/auto_loan">Auto Loan Rates</a>
        <a href="/rates/personal_loan">Personal Loan Rates</a>
        <a href="/rates/savings">Savings Rates</a>
        <a href="/rates/refinance">Refinance Rates</a>
        <a href="/calculators">Calculators</a>
        <a href="/guide">Guides</a>
        <a href="/stories">News</a>
      </nav>
    </header>
    <main>
      <h1>${escapeHtml(route.h1)}</h1>
      <p><em>Last reviewed: ${today}</em></p>
      ${route.body}
      <p><strong>Advertiser Disclosure:</strong> FindMeRates.com may be compensated by lenders when you click partner offers. This affects which offers appear but does not influence editorial assessment. <a href="/how-we-make-money">How we make money</a>.</p>
    </main>
    <footer>
      <a href="/about">About</a> · <a href="/contact">Contact</a> · <a href="/privacy">Privacy</a> · <a href="/terms">Terms</a> · <a href="/disclaimer">Disclaimer</a> · <a href="/cookies">Cookies</a> · <a href="/how-we-make-money">How We Make Money</a> · <a href="/affiliate-disclosure">Affiliate Disclosure</a> · <a href="/editorial-policy">Editorial Policy</a> · <a href="/methodology">Methodology</a>
    </footer>
  </div>`;

  // Build a route-specific <noscript> block as well so no-JS clients also see
  // page-relevant content (the dist shell <noscript> is the homepage version).
  const noscriptBlock = `<noscript>
      <header style="padding:24px;font-family:system-ui,sans-serif">
        <a href="/" style="font-weight:700;font-size:20px;color:#0f172a;text-decoration:none">FindMeRates.com</a>
        <nav style="margin-top:12px">
          <a href="/rates/mortgage" style="margin-right:12px">Mortgage Rates</a>
          <a href="/rates/cd" style="margin-right:12px">CD Rates</a>
          <a href="/rates/auto_loan" style="margin-right:12px">Auto Loan Rates</a>
          <a href="/rates/personal_loan" style="margin-right:12px">Personal Loan Rates</a>
          <a href="/calculators">Calculators</a>
        </nav>
      </header>
      <main style="padding:24px;max-width:780px;margin:0 auto;font-family:system-ui,sans-serif;line-height:1.6;color:#1f2937">
        <h1>${escapeHtml(route.h1)}</h1>
        <p><em>Last reviewed: ${today}</em></p>
        ${route.body}
        <p style="margin-top:24px;padding:12px;background:#fffbeb;border:1px solid #fde68a;border-radius:8px;font-size:14px"><strong>Advertiser Disclosure:</strong> FindMeRates.com may be compensated by lenders when you click partner offers. This affects which offers appear but does not influence editorial assessment. <a href="/how-we-make-money">How we make money</a>.</p>
        <footer style="margin-top:32px;border-top:1px solid #e5e7eb;padding-top:16px;font-size:14px;color:#6b7280">
          <a href="/about">About</a> · <a href="/contact">Contact</a> · <a href="/privacy">Privacy</a> · <a href="/terms">Terms</a> · <a href="/disclaimer">Disclaimer</a> · <a href="/how-we-make-money">How We Make Money</a> · <a href="/affiliate-disclosure">Affiliate Disclosure</a> · <a href="/editorial-policy">Editorial Policy</a> · <a href="/methodology">Methodology</a>
        </footer>
      </main>
    </noscript>`;

  // Replace the entire <noscript>...</noscript> with the route-specific version.
  html = html.replace(/<noscript>[\s\S]*?<\/noscript>/, noscriptBlock);

  // Inject the SEO prerender block BEFORE #root (siblings, not children) so
  // React's hydration into #root is not disrupted by mismatched server HTML.
  // The block is visually hidden but fully readable by crawlers.
  html = html.replace(/<div id="root">/, `${prerenderBlock}\n  <div id="root">`);

  return html;
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

let count = 0;
for (const route of ROUTES) {
  const html = buildHtml(route);
  const targetDir = route.path === "/" ? DIST : path.join(DIST, route.path.replace(/^\//, ""));
  ensureDir(targetDir);
  const target = path.join(targetDir, "index.html");
  fs.writeFileSync(target, html, "utf8");
  count++;
  console.log(`[prerender] ${route.path} -> ${path.relative(ROOT, target)}`);
}

console.log(`[prerender] wrote ${count} static HTML snapshots`);

// 404 page (soft-404 fix, 2026-10-27): emitted from the same shell so the
// React app boots and its catch-all route renders the NotFound page, while
// Cloudflare Pages serves this file with a genuine 404 status for every
// unmatched path. There is deliberately NO "/* /index.html 200" catch-all
// in _redirects — that rule was the soft-404 defect.
{
  const title404 = "Page Not Found | FindMeRates.com";
  const desc404 = "The page you requested could not be found on FindMeRates.com. Compare today's mortgage, CD, auto loan, personal loan and savings rates, or use our free calculators.";
  let html404 = shell.replace(/<title>[\s\S]*?<\/title>/, `<title>${title404}</title>`);
  html404 = html404.replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${desc404}" />`);
  // A 404 page must not canonicalize anywhere; swap the canonical for noindex.
  html404 = html404.replace(/<link rel="canonical"[^>]*>/, `<meta name="robots" content="noindex" />`);
  html404 = html404.replace(/<meta property="og:url"[^>]*>/, "");
  html404 = html404.replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${title404}" />`);
  html404 = html404.replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${desc404}" />`);
  html404 = html404.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, "");
  const block404 = `<div id="prerender-seo" style="position:absolute;left:-99999px;top:0;width:1px;height:1px;overflow:hidden" aria-hidden="true">
    <main>
      <h1>Page not found</h1>
      <p>The page you requested does not exist on FindMeRates.com. It may have been moved, or the address may be mistyped.</p>
      <p><a href="/">Compare today's rates</a> · <a href="/rates/mortgage">Mortgage Rates</a> · <a href="/calculators">Calculators</a> · <a href="/stories">Market News</a> · <a href="/about">About</a> · <a href="/contact">Contact</a></p>
    </main>
  </div>`;
  const noscript404 = `<noscript>
      <main style="padding:24px;max-width:780px;margin:0 auto;font-family:system-ui,sans-serif;line-height:1.6;color:#1f2937">
        <h1>Page not found</h1>
        <p>The page you requested does not exist on FindMeRates.com. It may have been moved, or the address may be mistyped.</p>
        <p><a href="/">Compare today's rates</a> · <a href="/rates/mortgage">Mortgage Rates</a> · <a href="/calculators">Calculators</a> · <a href="/stories">Market News</a> · <a href="/about">About</a> · <a href="/contact">Contact</a></p>
      </main>
    </noscript>`;
  html404 = html404.replace(/<noscript>[\s\S]*?<\/noscript>/, noscript404);
  html404 = html404.replace(/<div id="root">/, `${block404}\n  <div id="root">`);
  fs.writeFileSync(path.join(DIST, "404.html"), html404, "utf8");
  console.log(`[prerender] 404 -> ${path.relative(ROOT, path.join(DIST, "404.html"))}`);
}
