/**
 * FindMeRates static site generator
 * - SEO meta + JSON-LD per page
 * - AdSense slots (front-loaded)
 * - Partner offers / affiliate CTAs
 * - Guides, rate hubs, calculators, money engine pages
 */
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "dist");

const site = JSON.parse(await readFile(join(root, "content/site.json"), "utf8"));
const offersData = JSON.parse(await readFile(join(root, "content/offers.json"), "utf8"));
const guides = JSON.parse(await readFile(join(root, "content/guides.json"), "utf8"));
const media = JSON.parse(await readFile(join(root, "content/media.json"), "utf8"));

const RATE_PAGES = [
  {
    slug: "mortgage",
    title: "Mortgage rates & comparison guide",
    h1: "Mortgage rates",
    category: "mortgage",
    intro:
      "Compare fixed vs adjustable structures, APR, points, and fees. Use our estimator, then explore partner options.",
    bullets: [
      "Compare APR and lender fees—not sticker rate alone",
      "Factor taxes, insurance, HOA, and PMI into affordability",
      "Shop multiple lenders within a short window",
      "Lock strategy depends on how soon you close",
    ],
    calc: "mortgage",
  },
  {
    slug: "savings",
    title: "High-yield savings rates guide",
    h1: "Savings accounts",
    category: "savings",
    intro: "Compare APY, fees, minimums, and access. Park emergency cash where it earns without locking it up.",
    bullets: [
      "Prioritize APY + no monthly fee",
      "Confirm FDIC or NCUA insurance",
      "Watch transfer limits and minimums",
      "Keep 3–6 months expenses liquid",
    ],
    calc: "savings",
  },
  {
    slug: "cd",
    title: "CD rates comparison guide",
    h1: "Certificates of deposit",
    category: "cd",
    intro: "Lock a rate for a set term. Compare APY, early-withdrawal penalties, and ladder strategies.",
    bullets: [
      "Match term to when you need the cash",
      "Early-withdrawal penalties can erase gains",
      "Consider a CD ladder for flexibility",
      "Compare brokered vs bank CDs carefully",
    ],
    calc: "cd",
  },
  {
    slug: "auto-loan",
    title: "Auto loan rates & shopping guide",
    h1: "Auto loans",
    category: "auto",
    intro: "Shop financing before the dealership. Compare APR, term, total interest, and refinance options.",
    bullets: [
      "Get pre-approved to set a rate benchmark",
      "Shorter terms cost less interest overall",
      "Decline add-ons you do not need",
      "Refi if your credit or market rates improve",
    ],
    calc: "auto",
  },
  {
    slug: "personal-loan",
    title: "Personal loan rates & uses",
    h1: "Personal loans",
    category: "personal",
    intro: "Unsecured loans for consolidation or planned expenses. Compare APR, fees, and total repayment cost.",
    bullets: [
      "Watch origination fees",
      "Lower monthly payment can mean more total interest",
      "Best for fixed goals—not ongoing spending",
      "Check prepayment rules",
    ],
    calc: "personal",
  },
  {
    slug: "credit-cards",
    title: "Credit card comparison hub",
    h1: "Credit cards",
    category: "credit-cards",
    intro: "Cash back, travel, and balance transfer cards. Only chase rewards if you pay in full monthly.",
    bullets: [
      "Compare APR, annual fee, and bonus value",
      "Interest wipes out rewards if you carry a balance",
      "Match categories to your real spending",
      "Read foreign transaction and late fees",
    ],
    calc: null,
  },
  {
    slug: "heloc",
    title: "HELOC & home equity guide",
    h1: "HELOC & home equity",
    category: "heloc",
    intro: "Borrow against equity for renovations or consolidation. Variable rates and your home as collateral.",
    bullets: [
      "Understand draw vs repayment periods",
      "Variable rates can rise",
      "Your home secures the line",
      "Compare fees, floors, and caps",
    ],
    calc: "heloc",
  },
  {
    slug: "student-loans",
    title: "Student loan & refinance guide",
    h1: "Student loans",
    category: "student",
    intro: "Federal vs private differences matter. Refinance only when benefits outweigh lost protections.",
    bullets: [
      "Federal loans offer unique protections",
      "Refi can lower rate with strong credit",
      "Compare total interest, not only payment",
      "Cosigners affect approval and APR",
    ],
    calc: null,
  },
  {
    slug: "insurance",
    title: "Insurance comparison hub",
    h1: "Insurance",
    category: "insurance",
    intro: "Shop auto and home coverage yearly. Match deductibles and liability limits before chasing the lowest price.",
    bullets: [
      "Re-quote at least annually",
      "Bundle only when it truly saves",
      "Raise deductibles only if you can afford them",
      "Document discounts (safe driver, security devices)",
    ],
    calc: null,
  },
  {
    slug: "business-loans",
    title: "Small business loan options",
    h1: "Business loans",
    category: "business",
    intro: "Working capital and growth financing. Compare cost of capital, collateral, and repayment flexibility.",
    bullets: [
      "Match product to use of funds",
      "Understand personal guarantees",
      "Compare APR, fees, and factor rates carefully",
      "Forecast cash flow before borrowing",
    ],
    calc: null,
  },
  {
    slug: "checking",
    title: "Checking accounts & bank bonuses",
    h1: "Checking accounts",
    category: "checking",
    intro: "Bank switch bonuses can pay—if you meet direct-deposit and activity rules.",
    bullets: [
      "Read bonus terms and timelines",
      "Watch monthly fees and overdraft policies",
      "ATM networks matter day to day",
      "Link savings for overdraft protection thoughtfully",
    ],
    calc: null,
  },
  {
    slug: "investing",
    title: "Brokerage & investing comparison",
    h1: "Investing accounts",
    category: "investing",
    intro: "Compare brokers on fees, tools, and account types—not flashy promos alone.",
    bullets: [
      "Expense ratios compound over decades",
      "Prefer low-cost index foundations",
      "Emergency fund first, then invest",
      "Taxable vs IRA/401(k) placement matters",
    ],
    calc: null,
  },
];

const ARTICLES = [
  {
    slug: "current-rate-environment",
    title: "How to read today's rate environment",
    excerpt: "What Fed moves, inflation, and credit spreads mean for borrowers and savers.",
    body: [
      "Rate shopping is easier when you understand the backdrop. Central bank policy, inflation data, and credit risk all influence what lenders charge and what banks pay depositors.",
      "Borrowers should compare APR and total cost—not headlines. Savers should re-check high-yield savings and CD offers when policy shifts, because deposit APYs can reprice quickly.",
      "Use our calculators to model payments, then open category hubs for partner options when you are ready to act.",
    ],
  },
  {
    slug: "soft-pull-vs-hard-pull",
    title: "Soft pull vs hard pull credit checks",
    excerpt: "Know which quote paths may affect your score.",
    body: [
      "A soft pull typically does not affect your credit score and is common for pre-qualifications and many marketing offers.",
      "A hard pull can temporarily impact scores and usually happens when you formally apply. Mortgage and auto shopping windows often group inquiries.",
      "When in doubt, ask the provider which pull they use before you authorize a full application.",
    ],
  },
  {
    slug: "negotiate-loan-offer",
    title: "How to negotiate a loan offer",
    excerpt: "Use competing quotes to improve pricing and fees.",
    body: [
      "Lenders compete. A written offer from one bank can help another match rate, reduce points, or waive fees.",
      "Negotiate more than rate: origination fees, rate-lock extensions, appraisal credits, and closing timelines all have dollar value.",
      "Never sign until you understand the Closing Disclosure or final truth-in-lending figures.",
    ],
  },
  {
    slug: "avoid-predatory-lending",
    title: "Red flags for predatory lending",
    excerpt: "Pressure tactics, hidden fees, and products that trap borrowers.",
    body: [
      "Be wary of guaranteed approval claims, pressure to sign immediately, or products that refinance you into higher long-term cost.",
      "Read fee schedules. Extremely high APR, large prepayment penalties, or unclear variable-rate terms deserve a second opinion.",
      "If an offer seems confusing, pause and compare with another reputable provider.",
    ],
  },
  {
    slug: "build-wealth-stack",
    title: "The simple personal finance stack",
    excerpt: "Emergency fund → high-interest debt → retirement match → invest.",
    body: [
      "Most households benefit from a boring sequence: stabilize cash, kill expensive debt, capture employer retirement matches, then invest long-term.",
      "Rate tools help at every step—HYSA for cash, personal loans or cards for debt strategy, and brokers for investing once foundations are solid.",
      "Consistency beats complexity. Automate transfers on payday.",
    ],
  },
];

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function allOffers() {
  return offersData.categories.flatMap((c) =>
    c.offers.map((o) => ({ ...o, categoryId: c.id, categoryLabel: c.label, intent: c.intent }))
  );
}

function offersForCategory(catId, limit = 6) {
  const cat = offersData.categories.find((c) => c.id === catId);
  if (!cat) {
    return allOffers()
      .sort((a, b) => b.priority - a.priority)
      .slice(0, limit);
  }
  return [...cat.offers].sort((a, b) => b.priority - a.priority).slice(0, limit);
}

function daySeed() {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

// Build date stamp — honest "reviewed on" date rendered into pages.
const BUILD_DATE = daySeed();

// Every partner offer click goes through /out/<offer-id> (a 302 in _redirects).
// Why: one swap point for affiliate URLs (set "affHref" in content/offers.json),
// plus click attribution in Cloudflare analytics. Raw href stays as fallback.
function offerTarget(o) {
  return o.affHref && String(o.affHref).trim() ? String(o.affHref).trim() : o.href;
}
function offerOutUrl(o) {
  return `/out/${o.id}`;
}

// Share row for article pages (guides + learn). Plain outbound share
// intents — no JS, no third-party widgets, no tracking pixels.
function shareRow(path, title) {
  const url = encodeURIComponent(`${site.domain}${path}`);
  const text = encodeURIComponent(title);
  return `
      <section class="share-row" aria-label="Share this page">
        <h2>Share this guide</h2>
        <p>
          <a href="https://twitter.com/intent/tweet?url=${url}&text=${text}" target="_blank" rel="noopener">Post to X</a>
          <a href="https://www.facebook.com/sharer/sharer.php?u=${url}" target="_blank" rel="noopener">Share on Facebook</a>
          <a href="https://www.linkedin.com/sharing/share-offsite/?url=${url}" target="_blank" rel="noopener">Share on LinkedIn</a>
          <a href="mailto:?subject=${text}&body=${url}">Share by email</a>
        </p>
      </section>`;
}

// Newsletter form: posts to the ESP endpoint in site.json when configured,
// otherwise falls back to the in-browser demo save (see docs/ESP_SETUP.md).
function newsletterForm({ stacked = false, idPrefix = "nl" } = {}) {
  const nl = site.newsletter || {};
  const endpoint = String(nl.endpoint || "").trim();
  const field = esc(nl.emailField || "email");
  if (endpoint) {
    return `<form class="newsletter-form${stacked ? " stacked" : ""}" data-esp="1" action="${esc(endpoint)}" method="post" target="_blank" rel="noopener">
      <label${stacked ? "" : ` class="sr-only" for="${idPrefix}-email"`}>${stacked ? "Email" : ""}<input id="${idPrefix}-email" name="${field}" type="email" required placeholder="you@email.com" autocomplete="email"${stacked ? "" : ""}></label>
      ${stacked ? `<label class="check"><input type="checkbox" name="consent" required> I agree to receive emails and accept the <a href="/privacy-policy">privacy policy</a>.</label>` : ""}
      <button class="button primary" type="submit">Subscribe</button>
    </form>`;
  }
  if (stacked) {
    return `<form class="newsletter-form js-newsletter stacked" action="#" method="post">
        <label>Email<input name="email" type="email" required placeholder="you@email.com" autocomplete="email"></label>
        <label class="check"><input type="checkbox" name="consent" required> I agree to receive emails and accept the <a href="/privacy-policy">privacy policy</a>.</label>
        <button class="button primary" type="submit">Subscribe</button>
        <p class="form-note" hidden data-success>Thanks—you're on the list (demo save in this browser).</p>
      </form>`;
  }
  return `<form class="newsletter-form js-newsletter" action="/newsletter" method="get">
      <label class="sr-only" for="${idPrefix}-email">Email</label>
      <input id="${idPrefix}-email" name="email" type="email" required placeholder="you@email.com" autocomplete="email">
      <button class="button primary" type="submit">Subscribe</button>
    </form>`;
}

function rotateOffers(list, n = 6) {
  const seed = [...daySeed()].reduce((h, ch) => (h * 33 + ch.charCodeAt(0)) >>> 0, 7);
  if (!list.length) return [];
  const start = seed % list.length;
  const rot = [...list.slice(start), ...list.slice(0, start)];
  return rot.slice(0, n);
}

function adSlot(slot = "top") {
  // Auto ads fill these labeled regions (page-level ads enabled in <head>).
  // Manual unit push still runs for denser inventory when approved.
  return `
  <aside class="ad-slot ad-slot-${slot}" aria-label="Advertisement" data-ad-region="${esc(slot)}">
    <div class="ad-label">Advertisement · supports free tools</div>
    <ins class="adsbygoogle"
      style="display:block;min-height:100px"
      data-ad-client="${esc(site.adsenseClient)}"
      data-ad-format="auto"
      data-full-width-responsive="true"></ins>
    <script>(window.adsbygoogle = window.adsbygoogle || []).push({});</script>
    <div class="ad-fallback">
      <p>While ads load, explore a partner offer:</p>
      <a class="button ghost offer-cta" href="/offers" data-track="offer_click" data-offer="ad_fallback_${esc(slot)}">Browse today's deals →</a>
    </div>
  </aside>`;
}

function imgFor(key, alt = "", cls = "media-img") {
  const src = media.images[key] || media.images.hero || "/images/hero.svg";
  return `<img class="${cls}" src="${esc(src)}" alt="${esc(alt || key)}" width="1200" height="675" loading="lazy" decoding="async">`;
}

function videosFor(category, limit = 3) {
  const list = media.videos.filter(
    (v) => !category || (v.categories || []).includes(category) || v.topic === category
  );
  const pool = list.length ? list : media.videos;
  return pool.slice(0, limit);
}

function videoEmbed(v, compact = false) {
  const ratio = compact ? "video-frame compact" : "video-frame";
  return `
  <figure class="video-card">
    <div class="${ratio}">
      <iframe
        title="${esc(v.title)}"
        src="https://www.youtube.com/embed/${esc(v.id)}?rel=0&modestbranding=1&playsinline=1"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
        loading="lazy"
        referrerpolicy="strict-origin-when-cross-origin"></iframe>
    </div>
    <figcaption>
      <strong>${esc(v.title)}</strong>
      <span>${esc(v.blurb)}</span>
      <a class="text-cta" href="https://www.youtube.com/watch?v=${esc(v.id)}" target="_blank" rel="noopener noreferrer">Watch on YouTube →</a>
    </figcaption>
  </figure>`;
}

function videoGrid(list) {
  if (!list?.length) return "";
  return `<div class="video-grid">${list.map((v) => videoEmbed(v)).join("")}</div>`;
}

function offerCards(list) {
  if (!list.length) return "";
  return `<div class="offer-grid">${list
    .map((o) => {
      const imgKey = o.categoryId || "deals";
      const img = media.images[imgKey] || media.images.deals;
      return `
    <article class="offer-card" data-offer-id="${esc(o.id)}" data-category="${esc(o.categoryId || "")}">
      ${o.badge ? `<span class="offer-badge">${esc(o.badge)}</span>` : ""}
      <div class="offer-thumb"><img src="${esc(img)}" alt="" width="400" height="225" loading="lazy"></div>
      <h3>${esc(o.title)}</h3>
      <p>${esc(o.blurb)}</p>
      <a class="button primary offer-cta" href="${esc(offerOutUrl(o))}" target="_blank" rel="noopener sponsored nofollow" data-track="offer_click" data-offer="${esc(o.id)}">${esc(o.cta)} →</a>
      <p class="offer-meta">Partner offer · may earn commission · Ad / affiliate</p>
    </article>`;
    })
    .join("")}</div>`;
}

function monetizeBar() {
  return `
  <div class="monetize-bar" role="region" aria-label="Featured partner deals">
    <div class="shell monetize-bar-inner">
      <span class="monetize-pulse" aria-hidden="true"></span>
      <p><strong>Make your next money move</strong> — compare partner offers &amp; keep free tools running.</p>
      <a class="button primary" href="/offers" data-track="offer_click" data-offer="sticky_bar">Today's deals</a>
      <a class="button ghost light" href="/earn">How we earn</a>
    </div>
  </div>`;
}

function navHtml(active = "") {
  const links = [
    ["/", "Home"],
    ["/rates/mortgage", "Mortgages"],
    ["/rates/savings", "Savings"],
    ["/rates/credit-cards", "Cards"],
    ["/calculators", "Calculators"],
    ["/guides", "Guides"],
    ["/videos", "Videos"],
    ["/offers", "Deals"],
    ["/earn", "Earn"],
  ];
  return links
    .map(([href, label]) => {
      const isActive =
        active === href || (href !== "/" && active.startsWith(href.replace(/\/$/, "")));
      return `<a href="${href}"${isActive ? ' aria-current="page"' : ""}>${label}</a>`;
    })
    .join("");
}

function footerHtml() {
  return `
<footer class="site-footer">
  <div class="shell footer-grid">
    <div>
      <p class="footer-brand">${esc(site.name)}</p>
      <p class="disclosure"><strong>Advertiser disclosure:</strong> ${esc(offersData.disclosure)} <a href="/how-we-make-money">How we make money</a></p>
    </div>
    <nav aria-label="Footer">
      <a href="/about">About</a>
      <a href="/how-it-works">How it works</a>
      <a href="/methodology">Methodology</a>
      <a href="/guides">Guides</a>
      <a href="/offers">All offers</a>
      <a href="/earn">Money engine</a>
      <a href="/newsletter">Newsletter</a>
      <a href="/contact">Contact</a>
      <a href="/privacy-policy">Privacy</a>
      <a href="/terms">Terms</a>
      <a href="/ads.txt">ads.txt</a>
    </nav>
    <small>© ${new Date().getFullYear()} ${esc(site.name)}. Educational information only—not financial, tax, or legal advice. Not a lender.</small>
  </div>
</footer>`;
}

function jsonLd(obj) {
  return `<script type="application/ld+json">${JSON.stringify(obj)}</script>`;
}

function layout({
  path,
  title,
  description,
  canonical,
  body,
  activeNav = path,
  extraHead = "",
  schemas = [],
}) {
  const url = canonical || `${site.domain}${path === "/" ? "/" : path}`;
  const fullTitle = title.includes(site.name) ? title : `${title} | ${site.name}`;
  const schemaTags = schemas.map(jsonLd).join("\n");
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(fullTitle)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="theme-color" content="${esc(site.themeColor)}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="${esc(url)}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${esc(site.name)}">
  <meta property="og:title" content="${esc(fullTitle)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${esc(url)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(fullTitle)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="google-adsense-account" content="${esc(site.adsenseClient)}">
  <link rel="stylesheet" href="/site.css">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${esc(site.adsenseClient)}" crossorigin="anonymous"></script>
  <script>
    // Page-level / auto ads — runs sitewide when the AdSense account is approved
    (window.adsbygoogle = window.adsbygoogle || []).push({
      google_ad_client: "${esc(site.adsenseClient)}",
      enable_page_level_ads: true,
      overlays: { bottom: true }
    });
  </script>
  ${extraHead}
  ${schemaTags}
  ${jsonLd({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.domain,
    potentialAction: {
      "@type": "SearchAction",
      target: `${site.domain}/guides?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  })}
  ${jsonLd({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.domain,
    description: site.description,
  })}
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <!-- Front-of-page ad band -->
  <div class="ad-top-band">
    <div class="shell">${adSlot("top")}</div>
  </div>
  <header class="site-header">
    <div class="shell nav-shell">
      <a class="wordmark" href="/" aria-label="${esc(site.name)} home"><span class="mark" aria-hidden="true">F</span><span>FindMe<span>Rates</span></span></a>
      <button class="menu-toggle" type="button" aria-controls="site-nav" aria-expanded="false">Menu</button>
      <nav id="site-nav" aria-label="Primary">${navHtml(activeNav)}</nav>
      <a class="sign-in" href="/offers">Today's deals</a>
    </div>
  </header>
  <main id="main">${body}</main>
  ${adSlot("bottom")}
  ${monetizeBar()}
  ${footerHtml()}
  <script src="/js/site.js" defer></script>
</body>
</html>`;
}

async function writePage(relPath, html) {
  const file =
    relPath.endsWith(".html") || relPath.endsWith(".xml") || relPath.endsWith(".txt")
      ? join(out, relPath)
      : join(out, relPath, "index.html");
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html, "utf8");
}

function calcBlock(type) {
  const common = `<p class="calc-note">Estimates only—not a quote, approval, or offer. Taxes, insurance, and fees may not be included.</p>`;
  if (type === "mortgage" || type === "heloc") {
    return `<form class="calculator js-calc" data-calc="mortgage" id="calc-mortgage">
      <p class="eyebrow">CALCULATOR</p>
      <h2>Payment estimator</h2>
      <label>Amount / price<input name="price" type="number" min="0" step="1000" value="400000" inputmode="decimal"></label>
      <div class="calc-row">
        <label>Down payment %<input name="down" type="number" min="0" max="100" value="20" inputmode="decimal"></label>
        <label>Term (years)<select name="term"><option value="30">30</option><option value="20">20</option><option value="15">15</option><option value="10">10</option></select></label>
      </div>
      <label>Interest rate %<input name="rate" type="number" min="0" step="0.01" value="6.5" inputmode="decimal"></label>
      <button class="button primary" type="submit">Calculate</button>
      <output class="calc-out" name="result">Run the calculator to see an estimate.</output>
      ${common}
    </form>`;
  }
  if (type === "auto" || type === "personal") {
    return `<form class="calculator js-calc" data-calc="loan" id="calc-loan">
      <p class="eyebrow">CALCULATOR</p>
      <h2>Loan payment estimator</h2>
      <label>Loan amount<input name="principal" type="number" min="0" step="100" value="25000" inputmode="decimal"></label>
      <div class="calc-row">
        <label>APR %<input name="rate" type="number" min="0" step="0.01" value="8.5" inputmode="decimal"></label>
        <label>Term (months)<input name="months" type="number" min="1" value="60" inputmode="numeric"></label>
      </div>
      <button class="button primary" type="submit">Calculate</button>
      <output class="calc-out" name="result">Run the calculator to see an estimate.</output>
      ${common}
    </form>`;
  }
  if (type === "savings" || type === "cd") {
    return `<form class="calculator js-calc" data-calc="savings" id="calc-savings">
      <p class="eyebrow">CALCULATOR</p>
      <h2>Savings growth estimator</h2>
      <label>Starting balance<input name="principal" type="number" min="0" step="100" value="10000" inputmode="decimal"></label>
      <div class="calc-row">
        <label>APY %<input name="apy" type="number" min="0" step="0.01" value="4.5" inputmode="decimal"></label>
        <label>Years<input name="years" type="number" min="1" value="3" inputmode="numeric"></label>
      </div>
      <label>Monthly contribution<input name="monthly" type="number" min="0" step="10" value="200" inputmode="decimal"></label>
      <button class="button primary" type="submit">Calculate</button>
      <output class="calc-out" name="result">Run the calculator to see an estimate.</output>
      ${common}
    </form>`;
  }
  return "";
}

// —— Build pages ——
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await cp(join(root, "public"), out, { recursive: true });

const urls = [];

// HOME
const featured = rotateOffers(allOffers().sort((a, b) => b.priority - a.priority), 8);
const homeBody = `
<section class="hero">
  <div class="shell hero-layout">
    <div class="hero-copy">
      <p class="eyebrow">U.S. RATE SHOPPERS · REVIEWED ${esc(BUILD_DATE)} · ADS + OFFERS LIVE</p>
      <h1>Your next money move,<em> mapped—and monetized with transparency.</em></h1>
      <p class="intro">${esc(site.description)} Free tools, videos, guides, calculators, partner offers, and AdSense—stacked so this site can earn while it helps you compare.</p>
      <div class="hero-actions">
        <a class="button primary" href="#money-map">Start comparing</a>
        <a class="button ghost" href="/offers">See today's deals</a>
        <a class="text-cta" href="/videos">Watch money videos →</a>
      </div>
    </div>
    <div class="hero-media">
      ${imgFor("hero", "FindMeRates money map visual", "media-img hero-img")}
      <div class="map-visual" aria-hidden="true">
        <div class="map-path"></div>
        <span class="pin pin-home">Home</span>
        <span class="pin pin-save">Save</span>
        <span class="pin pin-car">Auto</span>
        <span class="pin pin-loan">Loan</span>
      </div>
    </div>
    <aside class="trust-list">
      <div><b>Ads up front</b><span>AdSense auto + display units on every page.</span></div>
      <div><b>Partner offers</b><span>Affiliate CTAs on hubs, guides, and home.</span></div>
      <div><b>Video + guides</b><span>SEO content that keeps traffic (and ads) flowing.</span></div>
    </aside>
  </div>
</section>

${adSlot("after-hero")}

<section class="shell media-showcase">
  <div class="section-head">
    <div>
      <p class="eyebrow">VISUAL HUBS</p>
      <h2>Browse by picture — every path is monetized</h2>
      <p>Tap a category image for guides, videos, calculators, ads, and partner deals.</p>
    </div>
    <a class="text-cta" href="/offers">All deals →</a>
  </div>
  <div class="photo-grid">
    ${RATE_PAGES.map(
      (r) => `
      <a class="photo-card" href="/rates/${r.slug}">
        ${imgFor(r.category === "credit-cards" ? "credit-cards" : r.category, r.h1, "media-img")}
        <span class="photo-label"><b>${esc(r.h1)}</b><em>Compare · Learn · Earn</em></span>
      </a>`
    ).join("")}
  </div>
</section>

<section class="shell video-showcase" id="videos-home">
  <div class="section-head">
    <div>
      <p class="eyebrow">WATCH &amp; LEARN</p>
      <h2>Money videos (then act on a deal)</h2>
      <p>Educational embeds to grow time-on-site and ad inventory — paired with offers below.</p>
    </div>
    <a class="text-cta" href="/videos">All videos →</a>
  </div>
  ${videoGrid(media.videos.slice(0, 3))}
  <div class="center-cta" style="margin-top:1rem">
    <a class="button primary" href="/offers" data-track="offer_click" data-offer="after_videos_home">Shop partner offers after watching →</a>
  </div>
</section>

${adSlot("after-videos")}

<section class="shell money-strip" id="todays-money">
  <div class="section-head">
    <div>
      <p class="eyebrow">AUTO MONEY ENGINE · ${esc(daySeed())}</p>
      <h2>Today's featured ways to save (and help us earn)</h2>
      <p>Offers rotate daily by priority and category so high-intent paths stay visible. Always compare terms yourself.</p>
    </div>
    <a class="text-cta" href="/offers">All offers →</a>
  </div>
  ${offerCards(featured)}
</section>

<section class="shell move-section" id="money-map">
  <div class="move-grid">
    <div class="move-map">
      <div class="section-top">
        <h2>Your money move map</h2>
        <p>Pick a goal—we'll route you to guides, calculators, and partner options.</p>
      </div>
      <div class="goal-options" role="list">
        <a class="goal" href="/rates/mortgage"><b>Buy or refi a home</b><span>Mortgages & HELOC</span></a>
        <a class="goal" href="/rates/savings"><b>Grow cash</b><span>HYSA & CDs</span></a>
        <a class="goal" href="/rates/auto-loan"><b>Finance a car</b><span>Auto loans & refi</span></a>
        <a class="goal" href="/rates/personal-loan"><b>Big expense</b><span>Personal loans</span></a>
        <a class="goal" href="/rates/credit-cards"><b>Earn rewards</b><span>Credit cards</span></a>
        <a class="goal" href="/rates/insurance"><b>Cut insurance</b><span>Auto & home quotes</span></a>
        <a class="goal" href="/rates/student-loans"><b>Student debt</b><span>Refi options</span></a>
        <a class="goal" href="/calculators"><b>Run numbers</b><span>Free calculators</span></a>
      </div>
    </div>
    ${calcBlock("mortgage")}
  </div>
</section>

${adSlot("mid")}

<section class="shell hubs-section">
  <div class="section-head"><h2>Rate & product hubs</h2><a href="/rates/mortgage" class="text-cta">Browse all →</a></div>
  <div class="hub-grid">
    ${RATE_PAGES.map(
      (r) => `<a class="hub-card" href="/rates/${r.slug}"><b>${esc(r.h1)}</b><span>${esc(r.intro.slice(0, 110))}…</span></a>`
    ).join("")}
  </div>
</section>

<section class="shell guide-strip">
  <div class="section-head"><h2>Guides that convert curiosity into action</h2><a href="/guides" class="text-cta">All guides →</a></div>
  <div class="guide-grid">
    ${guides
      .slice(0, 8)
      .map(
        (g) =>
          `<a href="/guides/${g.slug}"><b>${esc(g.title)}</b><span>${esc(g.excerpt)}</span><em>${g.readMinutes} min read</em></a>`
      )
      .join("")}
  </div>
</section>

<section class="shell revenue-modules">
  <div class="section-head">
    <h2>Every monetization channel on this site</h2>
    <p>We stack multiple revenue methods so free tools stay free.</p>
  </div>
  <div class="module-grid">
    <article><h3>Google AdSense</h3><p>Display ads at the top of every page, mid-content, and footer. Auto ads enabled for inventory fill.</p></article>
    <article><h3>Affiliate / partner offers</h3><p>Mortgage, banking, cards, loans, insurance, and more—with disclosure and sponsored links.</p></article>
    <article><h3>High-intent hubs</h3><p>SEO pages for each product type funnel readers to calculators + offers.</p></article>
    <article><h3>Lead & newsletter capture</h3><p>Email list for rate alerts and future sponsored placements.</p></article>
    <article><h3>Daily offer rotation</h3><p>Featured deals reshuffle automatically each UTC day.</p></article>
    <article><h3>Content SEO engine</h3><p>Guides, FAQs, and articles with schema markup for search discovery.</p></article>
  </div>
  <p class="center-cta"><a class="button primary" href="/earn">Open the full money engine →</a></p>
</section>

<section class="shell newsletter-cta" id="newsletter">
  <div class="newsletter-card">
    <div>
      <p class="eyebrow">FREE RATE ALERTS</p>
      <h2>Get rate moves & deal roundups</h2>
      <p>Educational emails. Unsubscribe anytime. We may include partner offers.</p>
    </div>
    ${newsletterForm({ idPrefix: "email-home" })}
  </div>
</section>
`;

await writePage("/", layout({
  path: "/",
  title: `${site.name} | ${site.tagline}`,
  description: site.description,
  body: homeBody,
  schemas: [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: site.name,
      description: site.description,
      url: site.domain + "/",
    },
  ],
}));
urls.push("/");

// RATE PAGES
for (const r of RATE_PAGES) {
  const path = `/rates/${r.slug}`;
  const offs = offersForCategory(r.category, 6);
  const relatedGuides = guides.filter((g) => g.category === r.category || g.category === "education").slice(0, 4);
  const catVideos = videosFor(r.category, 2);
  const body = `
  <article class="route-page">
    <div class="shell">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> / <span>Rates</span> / <span>${esc(r.h1)}</span></nav>
      <div class="page-hero-media">
        ${imgFor(r.category === "credit-cards" ? "credit-cards" : r.category, r.h1, "media-img page-hero-img")}
        <div>
          <p class="eyebrow">COMPARE · ${esc(r.category.toUpperCase())} · MONETIZED HUB</p>
          <h1>${esc(r.h1)}</h1>
          <p class="intro">${esc(r.intro)}</p>
          <p class="muted reviewed-stamp">Content reviewed ${esc(BUILD_DATE)} · Educational only, not financial advice.</p>
          <div class="hero-actions">
            <a class="button primary" href="#partner-offers" data-track="offer_click" data-offer="hub_top_${esc(r.slug)}">See partner offers</a>
            <a class="button ghost" href="/videos">Watch videos</a>
          </div>
        </div>
      </div>
      ${adSlot("inline")}
      <div class="split-2">
        <div>
          <h2>What to compare</h2>
          <ul class="check-list">${r.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
          <h2 id="partner-offers">Partner options</h2>
          <p class="muted">${esc(offersData.disclosure)}</p>
          ${offerCards(offs)}
          ${adSlot("mid-hub")}
          <h2>Watch &amp; learn</h2>
          ${videoGrid(catVideos)}
        </div>
        <div>
          ${r.calc ? calcBlock(r.calc) : `<div class="calculator"><p class="eyebrow">NEXT STEP</p><h2>Explore deals</h2><p>Jump to today's highest-priority offers in this category.</p><a class="button primary" href="/offers#${esc(r.category)}">View ${esc(r.h1)} deals</a></div>`}
          ${adSlot("sidebar")}
          <div class="calculator" style="margin-top:1rem">
            <p class="eyebrow">MORE WAYS WE EARN</p>
            <h2>Stack every channel</h2>
            <ul class="check-list">
              <li>AdSense on this page</li>
              <li>Affiliate / partner CTAs above</li>
              <li>Video watch time → more ad impressions</li>
              <li>Guide links → SEO flywheel</li>
            </ul>
            <a class="button primary" href="/earn">Open money engine</a>
          </div>
        </div>
      </div>
      ${
        relatedGuides.length
          ? `<section class="related"><h2>Related guides</h2><div class="guide-grid">${relatedGuides
              .map((g) => `<a href="/guides/${g.slug}"><b>${esc(g.title)}</b><span>${esc(g.excerpt)}</span></a>`)
              .join("")}</div></section>`
          : ""
      }
    </div>
  </article>`;
  await writePage(path, layout({
    path,
    title: r.title,
    description: r.intro,
    body,
    activeNav: path,
    schemas: [
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: r.title,
        description: r.intro,
        url: site.domain + path,
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.domain + "/" },
          { "@type": "ListItem", position: 2, name: r.h1, item: site.domain + path },
        ],
      },
    ],
  }));
  urls.push(path);
}

// GUIDES INDEX + ARTICLES
const guidesIndexBody = `
<section class="route-page"><div class="shell">
  <p class="eyebrow">LEARN</p>
  <h1>Guides & education</h1>
  <p class="intro">Plain-language explainers designed for real decisions—and structured for search engines.</p>
  ${adSlot("inline")}
  <div class="guide-grid large">
    ${guides
      .map(
        (g) =>
          `<a href="/guides/${g.slug}"><b>${esc(g.title)}</b><span>${esc(g.excerpt)}</span><em>${g.readMinutes} min · ${esc(g.category)}</em></a>`
      )
      .join("")}
    ${ARTICLES.map(
      (a) =>
        `<a href="/learn/${a.slug}"><b>${esc(a.title)}</b><span>${esc(a.excerpt)}</span><em>Article</em></a>`
    ).join("")}
  </div>
</div></section>`;
await writePage("/guides", layout({
  path: "/guides",
  title: "Guides & education",
  description: "Plain-language personal finance guides for mortgages, savings, loans, credit cards, and more.",
  body: guidesIndexBody,
}));
urls.push("/guides");

for (const g of guides) {
  const path = `/guides/${g.slug}`;
  const offs = offersForCategory(g.category, 3);
  const faqSchema =
    g.faqs && g.faqs.length
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: g.faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;
  const body = `
  <article class="route-page article">
    <div class="shell narrow">
      <nav class="crumbs"><a href="/">Home</a> / <a href="/guides">Guides</a> / <span>${esc(g.title)}</span></nav>
      ${imgFor(g.category === "credit-cards" ? "credit-cards" : g.category, g.title, "media-img article-img")}
      <p class="eyebrow">${esc(g.category)} · ${g.readMinutes} MIN</p>
      <h1>${esc(g.title)}</h1>
      <p class="intro">${esc(g.excerpt)}</p>
      ${adSlot("inline")}
      ${videoGrid(videosFor(g.category, 1))}
      ${g.sections
        .map((s) => `<section><h2>${esc(s.h)}</h2><p>${esc(s.p)}</p></section>`)
        .join("")}
      ${
        g.faqs?.length
          ? `<section><h2>FAQ</h2>${g.faqs
              .map((f) => `<details class="faq"><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`)
              .join("")}</section>`
          : ""
      }
      <section>
        <h2>Related offers</h2>
        <p class="muted">We may earn a commission from partner links.</p>
        ${offerCards(offs)}
      </section>
      ${shareRow(path, g.title)}
      ${adSlot("article-bottom")}
    </div>
  </article>`;
  await writePage(path, layout({
    path,
    title: g.title,
    description: g.excerpt,
    body,
    activeNav: "/guides",
    schemas: [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: g.title,
        description: g.excerpt,
        dateModified: new Date().toISOString().slice(0, 10),
        author: { "@type": "Organization", name: site.name },
        keywords: (g.keywords || []).join(", "),
      },
      ...(faqSchema ? [faqSchema] : []),
    ],
  }));
  urls.push(path);
}

for (const a of ARTICLES) {
  const path = `/learn/${a.slug}`;
  const body = `
  <article class="route-page article"><div class="shell narrow">
    <p class="eyebrow">LEARN</p>
    <h1>${esc(a.title)}</h1>
    <p class="intro">${esc(a.excerpt)}</p>
    ${adSlot("inline")}
    ${a.body.map((p) => `<p>${esc(p)}</p>`).join("")}
    <p><a class="button primary" href="/offers">Browse partner offers</a></p>
    ${shareRow(path, a.title)}
  </div></article>`;
  await writePage(path, layout({
    path,
    title: a.title,
    description: a.excerpt,
    body,
    schemas: [{ "@context": "https://schema.org", "@type": "Article", headline: a.title, description: a.excerpt }],
  }));
  urls.push(path);
}

// VIDEOS PAGE
const videosBody = `
<section class="route-page"><div class="shell">
  <div class="page-hero-media">
    ${imgFor("video", "FindMeRates videos", "media-img page-hero-img")}
    <div>
      <p class="eyebrow">VIDEO LIBRARY · AD SUPPORTED</p>
      <h1>Money videos to watch (then act)</h1>
      <p class="intro">Educational videos increase time-on-site and ad impressions. After you watch, use partner offers and calculators—both help fund free tools.</p>
      <a class="button primary" href="/offers" data-track="offer_click" data-offer="videos_hero">Browse deals →</a>
    </div>
  </div>
  ${adSlot("inline")}
  ${videoGrid(media.videos)}
  ${adSlot("mid")}
  <section class="related">
    <h2>Monetized next steps</h2>
    ${offerCards(rotateOffers(allOffers(), 6))}
  </section>
</div></section>`;
await writePage(
  "/videos",
  layout({
    path: "/videos",
    title: "Money videos & explainers",
    description: "Watch personal finance videos on rates, credit, banking, and mortgages—then compare partner offers on FindMeRates.",
    body: videosBody,
    schemas: [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Money videos",
        description: "Educational finance video library",
      },
    ],
  })
);
urls.push("/videos");

// CALCULATORS
const calcBody = `
<section class="route-page"><div class="shell">
  <h1>Free financial calculators</h1>
  <p class="intro">Estimate payments and growth before you talk to a lender or bank. Then compare partner options.</p>
  ${adSlot("inline")}
  <div class="calc-grid">
    ${calcBlock("mortgage")}
    ${calcBlock("auto")}
    ${calcBlock("savings")}
  </div>
  <section class="related">
    <h2>After you calculate</h2>
    ${offerCards(rotateOffers(allOffers(), 4))}
  </section>
</div></section>`;
await writePage("/calculators", layout({
  path: "/calculators",
  title: "Free financial calculators",
  description: "Mortgage, loan, and savings calculators—free estimates to plan your next money move.",
  body: calcBody,
}));
urls.push("/calculators");

// OFFERS
const offersBody = `
<section class="route-page"><div class="shell">
  <h1>All partner deals & offers</h1>
  <p class="intro">${esc(offersData.disclosure)}</p>
  ${adSlot("inline")}
  ${offersData.categories
    .map(
      (c) => `
    <section id="${esc(c.id)}" class="offer-category">
      <h2>${esc(c.label)} <small class="intent intent-${esc(c.intent)}">${esc(c.intent)} intent</small></h2>
      ${offerCards(c.offers.map((o) => ({ ...o, categoryId: c.id })))}
    </section>`
    )
    .join("")}
</div></section>`;
await writePage("/offers", layout({
  path: "/offers",
  title: "Partner deals & offers",
  description: "Browse mortgage, banking, credit card, loan, and insurance partner offers on FindMeRates.",
  body: offersBody,
}));
urls.push("/offers");

// EARN / MONEY ENGINE
const earnBody = `
<section class="route-page"><div class="shell">
  <p class="eyebrow">AUTO MONEY ENGINE</p>
  <h1>How FindMeRates makes money—automatically</h1>
  <p class="intro">This page documents every revenue path we run so the site can stay free for shoppers while compounding monetization over time.</p>
  ${adSlot("inline")}
  <div class="module-grid">
    <article><h3>1. Google AdSense (always on)</h3><p>Top-of-page, mid-content, sidebar, and bottom slots. Auto ads fill inventory. Client: ${esc(site.adsenseClient)}.</p></article>
    <article><h3>2. Affiliate / CPA partner links</h3><p>High-intent categories: mortgages, HYSA, CDs, auto, personal loans, cards, insurance, HELOC, student, business, checking bonuses, brokerages.</p></article>
    <article><h3>3. Daily featured rotation</h3><p>Homepage and category features reshuffle by UTC date seed so fresh offers stay in front without manual edits.</p></article>
    <article><h3>4. SEO content flywheel</h3><p>Guides, FAQs, and learn articles with schema markup attract organic traffic that converts to ads + offers.</p></article>
    <article><h3>5. Newsletter list</h3><p>Email capture for rate alerts and sponsored placements as the list grows.</p></article>
    <article><h3>6. Lead intent paths</h3><p>Calculators and goal maps push users toward partner applications when they are ready.</p></article>
    <article><h3>7. Comparison hubs</h3><p>Each product hub is a landing page optimized for commercial keywords + on-page offers.</p></article>
    <article><h3>8. Transparency SEO</h3><p>How-we-make-money, methodology, and disclosure pages build trust for users and ad review.</p></article>
  </div>
  <h2>Live offer inventory (${allOffers().length} offers)</h2>
  ${offerCards(allOffers().sort((a, b) => b.priority - a.priority))}
  <h2>Auto improvements built into the generator</h2>
  <ul class="check-list">
    <li>New guides/offers in <code>content/</code> auto-publish on build</li>
    <li>Sitemap & canonical URLs regenerate every deploy</li>
    <li>JSON-LD Article, FAQ, Breadcrumb, Organization, WebSite</li>
    <li>AdSense client injected on every page head + slots</li>
    <li>Sponsored rel attributes on partner CTAs</li>
  </ul>
  <p class="center-cta"><a class="button primary" href="/offers">Convert traffic →</a> <a class="button ghost" href="/newsletter">Grow the list →</a></p>
</div></section>`;
await writePage("/earn", layout({
  path: "/earn",
  title: "Money engine — how we earn",
  description: "Every automated monetization channel on FindMeRates: AdSense, affiliates, SEO, newsletter, and more.",
  body: earnBody,
}));
urls.push("/earn");

// STATIC CONTENT PAGES
const staticPages = [
  {
    path: "/how-we-make-money",
    title: "How we make money",
    description: "Transparent disclosure of FindMeRates advertising and partner compensation.",
    body: `<section class="route-page"><div class="shell narrow"><h1>How we make money</h1>
      <p>${esc(offersData.disclosure)}</p>
      <h2>Advertising</h2><p>We display Google AdSense ads. Ad placement is labeled. Ads help pay for hosting, tools, and content.</p>
      <h2>Partner compensation</h2><p>When you click certain offers or complete an application with a partner, we may earn a commission. That may affect ranking/placement of offers.</p>
      <h2>What compensation does not change</h2><p>Educational explanations, calculator math, and methodology descriptions are written to inform—not to hide costs.</p>
      <h2>Your job as a shopper</h2><p>Always compare APR, fees, eligibility, and written terms yourself. We are not a lender, broker, or fiduciary.</p>
      ${adSlot("inline")}</div></section>`,
  },
  {
    path: "/methodology",
    title: "Methodology",
    description: "How FindMeRates structures comparisons and labels paid placements.",
    body: `<section class="route-page"><div class="shell narrow"><h1>Methodology</h1>
      <p>We organize products by consumer goal (buy a home, grow cash, finance a car, etc.). Within each hub we highlight factors shoppers should compare: APR/APY, fees, term, access, and eligibility.</p>
      <p>Paid placements are labeled as partner offers. Editorial checklist content is separate from sponsored CTAs.</p>
      <p>Calculators use standard amortization and compound-interest formulas for estimates only.</p>
      ${adSlot("inline")}</div></section>`,
  },
  {
    path: "/how-it-works",
    title: "How it works",
    description: "Choose a goal, calculate, compare, then act with eyes open.",
    body: `<section class="route-page"><div class="shell narrow"><h1>How FindMeRates works</h1>
      <ol class="steps-ol">
        <li><b>Pick a goal</b> on the money map.</li>
        <li><b>Run a calculator</b> to frame payments or growth.</li>
        <li><b>Read a guide</b> for trade-offs in plain English.</li>
        <li><b>Review partner offers</b> if you want to shop providers—know we may earn.</li>
      </ol>
      <a class="button primary" href="/">Start on the map</a>
      ${adSlot("inline")}</div></section>`,
  },
  {
    path: "/about",
    title: "About FindMeRates",
    description: "About FindMeRates — tools and education for U.S. rate shoppers.",
    body: `<section class="route-page"><div class="shell narrow"><h1>About us</h1>
      <p>${esc(site.name)} helps people compare borrowing and savings decisions with calculators, guides, and clearly disclosed partner offers.</p>
      <p>We are not a bank, lender, or credit repair service. Information is educational.</p>
      <p>Contact: <a href="mailto:${esc(site.email)}">${esc(site.email)}</a></p>
      ${adSlot("inline")}</div></section>`,
  },
  {
    path: "/contact",
    title: "Contact",
    description: "Contact FindMeRates.",
    body: `<section class="route-page"><div class="shell narrow"><h1>Contact</h1>
      <p>Questions about the site, partnerships, or corrections:</p>
      <p><a class="button primary" href="mailto:${esc(site.email)}">${esc(site.email)}</a></p>
      <p>For loan or account support, contact the provider directly—we do not service loans.</p>
      ${adSlot("inline")}</div></section>`,
  },
  {
    path: "/newsletter",
    title: "Newsletter",
    description: "Subscribe to FindMeRates email updates.",
    body: `<section class="route-page"><div class="shell narrow"><h1>Rate alerts & deal roundups</h1>
      <p>Join the list for educational rate notes. We may include partner offers. Unsubscribe anytime.</p>
      ${newsletterForm({ stacked: true })}
      ${adSlot("inline")}</div></section>`,
  },
  {
    path: "/privacy-policy",
    title: "Privacy Policy",
    description: "Privacy policy for FindMeRates.",
    body: `<section class="route-page"><div class="shell narrow"><h1>Privacy Policy</h1>
      <p>Last updated: ${new Date().toISOString().slice(0, 10)}</p>
      <p>We use cookies and similar technologies for analytics and advertising (including Google AdSense). Partners may use cookies to personalize ads.</p>
      <p>Email addresses submitted for the newsletter are used to send updates and may be stored in analytics events locally until a backend is connected.</p>
      <p>Contact: <a href="mailto:${esc(site.email)}">${esc(site.email)}</a></p>
      <p>For Google ad personalization settings, visit Google's ad settings pages.</p>
      </div></section>`,
  },
  {
    path: "/terms",
    title: "Terms of Use",
    description: "Terms of use for FindMeRates.",
    body: `<section class="route-page"><div class="shell narrow"><h1>Terms of Use</h1>
      <p>Site content is for education only and is not financial, tax, or legal advice. We do not guarantee rates, approval, or availability.</p>
      <p>Partner offers are subject to provider terms. We may earn compensation from links and applications.</p>
      <p>Use the site at your own risk. We disclaim warranties to the fullest extent permitted by law.</p>
      </div></section>`,
  },
];

for (const p of staticPages) {
  await writePage(
    p.path,
    layout({
      path: p.path,
      title: p.title,
      description: p.description,
      body: p.body,
    })
  );
  urls.push(p.path);
}

// Legacy path aliases (redirects via meta + link)
const aliases = [
  ["/rates/auto_loan", "/rates/auto-loan"],
  ["/rates/personal_loan", "/rates/personal-loan"],
  ["/guide", "/guides"],
];
for (const [from, to] of aliases) {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${to}"><link rel="canonical" href="${site.domain}${to}"><title>Redirecting…</title></head><body><p><a href="${to}">Continue to ${to}</a></p></body></html>`;
  await writePage(from, html);
  urls.push(from);
}

// robots + sitemap
const robots = `User-agent: *
Allow: /
Sitemap: ${site.domain}/sitemap.xml
`;
await writeFile(join(out, "robots.txt"), robots, "utf8");

const uniqueUrls = [...new Set(urls)].filter((u) => !u.includes("_"));
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniqueUrls
  .map(
    (u) => `  <url><loc>${site.domain}${u === "/" ? "/" : u}</loc><lastmod>${BUILD_DATE}</lastmod><changefreq>daily</changefreq><priority>${u === "/" ? "1.0" : "0.7"}</priority></url>`
  )
  .join("\n")}
</urlset>
`;
await writeFile(join(out, "sitemap.xml"), sitemap, "utf8");

// Ensure ads.txt present
await writeFile(
  join(out, "ads.txt"),
  `google.com, pub-5800977493749262, DIRECT, f08c47fec0942fa0\n`,
  "utf8"
);

// redirects file for Pages — static aliases + /out/<offer-id> affiliate redirect layer.
// Set "affHref" on any offer in content/offers.json to route its clicks through
// your affiliate URL. Until then, /out/<id> 302s to the plain partner URL.
const offerRedirects = allOffers()
  .map((o) => `/out/${o.id} ${offerTarget(o)} 302`)
  .join("\n");
await writeFile(
  join(out, "_redirects"),
  `/rates/auto_loan /rates/auto-loan 301
/rates/personal_loan /rates/personal-loan 301
/guide /guides 301
/guide/* /guides/:splat 301
${offerRedirects}
`,
  "utf8"
);

console.log(`Built ${uniqueUrls.length} routes → ${out}`);
