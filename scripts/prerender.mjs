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
    body: `<p>Use our free calculators to estimate monthly payments, total interest paid, and CD earnings before you apply for a loan or open an account. Includes our <a href="/calculators/mortgage">mortgage payment calculator</a>.</p>`,
  },
  {
    path: "/calculators/mortgage",
    title: "Free Mortgage Payment Calculator | FindMeRates.com",
    description: "Estimate your monthly mortgage payment, total interest paid, and amortization schedule with our free mortgage calculator.",
    h1: "Mortgage Payment Calculator",
    body: `<p>Enter your home price, down payment, interest rate, and loan term to estimate your monthly principal &amp; interest payment. Then <a href="/rates/mortgage">compare today's mortgage rates</a> from top lenders.</p>`,
  },
  {
    path: "/about",
    title: "About FindMeRates.com — Independent Rate Comparison Publisher",
    description: "FindMeRates.com is an independent U.S. financial rate comparison site covering mortgages, CDs, auto loans, personal loans, and savings accounts.",
    h1: "About FindMeRates.com",
    body: `<p>FindMeRates.com is an independent rate-comparison publisher. We aggregate publicly available rate data and lender offers across mortgages, CDs, auto loans, personal loans, savings, and refinance products. We are not a bank, lender, or licensed financial advisor.</p>`,
  },
  {
    path: "/contact",
    title: "Contact FindMeRates.com",
    description: "Get in touch with the FindMeRates.com editorial team.",
    h1: "Contact Us",
    body: `<p>Email: hello@findmerates.com — for editorial corrections, partnership inquiries, or general questions.</p>`,
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
    body: `<p>This page explains what information FindMeRates.com collects, how we use it, and your rights. Full policy text loads below.</p>`,
  },
  {
    path: "/terms",
    title: "Terms of Service | FindMeRates.com",
    description: "Terms that govern your use of FindMeRates.com.",
    h1: "Terms of Service",
    body: `<p>Your use of FindMeRates.com is subject to the terms below.</p>`,
  },
  {
    path: "/disclaimer",
    title: "Disclaimer | FindMeRates.com",
    description: "Important disclaimers regarding rate data, financial information, and use of FindMeRates.com.",
    h1: "Disclaimer",
    body: `<p>FindMeRates.com is not a bank, lender, or financial advisor. Rates shown are informational only.</p>`,
  },
  {
    path: "/cookies",
    title: "Cookie Policy | FindMeRates.com",
    description: "How FindMeRates.com uses cookies and similar technologies.",
    h1: "Cookie Policy",
    body: `<p>This page explains the cookies we use and how to manage your preferences.</p>`,
  },
  {
    path: "/guide",
    title: "Rate Guides & Financial Education | FindMeRates.com",
    description: "Plain-English guides on mortgage, CD, auto loan, and personal loan rates.",
    h1: "Rate Guides",
    body: `<p>Explore plain-English guides covering how rates work, when to lock, how credit scores affect APR, and more.</p>`,
  },
  {
    path: "/stories",
    title: "Financial Rate News & Market Briefings | FindMeRates.com",
    description: "Latest financial rate news, Federal Reserve briefings, and market updates affecting mortgage, CD, and loan rates.",
    h1: "Rate News & Market Briefings",
    body: `<p>Track the latest news on interest rates, Federal Reserve policy, and lender announcements.</p>`,
  },
  {
    path: "/pro",
    title: "FindMeRates Pro — Rate Alerts & Pro Tools",
    description: "Upgrade to FindMeRates Pro for rate-drop alerts, deeper scenarios, and pro-only calculators.",
    h1: "FindMeRates Pro",
    body: `<p>FindMeRates Pro adds rate-drop alerts, scenario tools, and ad-light browsing for $9.99 / month or $39.99 for 6 months paid in full.</p>`,
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
