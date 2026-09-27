/**
 * FindMeRates site runtime — nav, calculators, offer tracking, newsletter, daily money pulse
 */
(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  // Mobile nav
  const menu = $(".menu-toggle");
  const nav = $("#site-nav");
  menu?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menu.setAttribute("aria-expanded", String(open));
  });

  // Money format
  const money = (n) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n || 0);

  const money2 = (n) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(n || 0);

  function amortize(principal, annualRate, months) {
    if (principal <= 0 || months <= 0) return 0;
    const r = annualRate / 100 / 12;
    if (!r) return principal / months;
    return (principal * (r * (1 + r) ** months)) / ((1 + r) ** months - 1);
  }

  // Calculators
  $$(".js-calc").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const type = form.dataset.calc;
      const out = form.querySelector(".calc-out") || form.querySelector("output");
      if (!out) return;

      if (type === "mortgage") {
        const price = Number(fd.get("price")) || 0;
        const down = Number(fd.get("down")) || 0;
        const rate = Number(fd.get("rate")) || 0;
        const years = Number(fd.get("term")) || 30;
        const principal = price * (1 - down / 100);
        const payment = amortize(principal, rate, years * 12);
        const total = payment * years * 12;
        out.textContent = `Est. P&I ${money(payment)}/mo · Principal ${money(principal)} · Total P&I ~${money(total)} (taxes/insurance not included).`;
      } else if (type === "loan") {
        const principal = Number(fd.get("principal")) || 0;
        const rate = Number(fd.get("rate")) || 0;
        const months = Number(fd.get("months")) || 60;
        const payment = amortize(principal, rate, months);
        const total = payment * months;
        const interest = Math.max(0, total - principal);
        out.textContent = `Est. payment ${money2(payment)}/mo · Total paid ~${money(total)} · Est. interest ~${money(interest)}.`;
      } else if (type === "savings") {
        const principal = Number(fd.get("principal")) || 0;
        const apy = Number(fd.get("apy")) || 0;
        const years = Number(fd.get("years")) || 1;
        const monthly = Number(fd.get("monthly")) || 0;
        const r = apy / 100 / 12;
        const n = years * 12;
        let bal = principal;
        for (let i = 0; i < n; i++) {
          bal = bal * (1 + r) + monthly;
        }
        const contrib = principal + monthly * n;
        out.textContent = `Est. balance ${money(bal)} after ${years}y · Contributions ~${money(contrib)} · Growth ~${money(bal - contrib)} (APY compounded monthly, estimate).`;
      }

      try {
        window.dispatchEvent(
          new CustomEvent("fmr_calc", { detail: { type } })
        );
      } catch (_) {
        /* ignore */
      }
    });
  });

  // Offer click tracking (local analytics — wire to GA later)
  $$("[data-track='offer_click']").forEach((a) => {
    a.addEventListener("click", () => {
      const id = a.getAttribute("data-offer") || "unknown";
      try {
        const key = "fmr_offer_clicks";
        const prev = JSON.parse(localStorage.getItem(key) || "{}");
        prev[id] = (prev[id] || 0) + 1;
        prev._total = (prev._total || 0) + 1;
        prev._last = new Date().toISOString();
        localStorage.setItem(key, JSON.stringify(prev));
      } catch (_) {
        /* ignore */
      }
    });
  });

  // Newsletter capture: ESP-wired forms (data-esp) post natively; demo handler only for unwired forms.
  $$(".js-newsletter").forEach((form) => {
    if (form.hasAttribute("data-esp")) return;
    form.addEventListener("submit", (e) => {
      // Allow GET navigation to /newsletter with email prefilled when on home
      if (form.method && form.method.toLowerCase() === "get" && form.action.includes("newsletter")) {
        return;
      }
      e.preventDefault();
      const fd = new FormData(form);
      const email = String(fd.get("email") || "").trim();
      if (!email) return;
      try {
        const list = JSON.parse(localStorage.getItem("fmr_newsletter") || "[]");
        if (!list.includes(email)) list.push(email);
        localStorage.setItem("fmr_newsletter", JSON.stringify(list));
      } catch (_) {
        /* ignore */
      }
      const note = form.querySelector("[data-success]");
      if (note) note.hidden = false;
      form.reset();
    });
  });

  // Prefill newsletter from query
  const params = new URLSearchParams(location.search);
  const qEmail = params.get("email");
  if (qEmail) {
    $$('input[name="email"]').forEach((input) => {
      if (!input.value) input.value = qEmail;
    });
  }

  // Auto-highlight a random high-intent offer every 12s (keeps money modules lively)
  const cards = $$(".offer-card");
  if (cards.length > 1) {
    setInterval(() => {
      cards.forEach((c) => c.classList.remove("is-pulse"));
      const pick = cards[Math.floor(Math.random() * cards.length)];
      pick.classList.add("is-pulse");
      pick.style.boxShadow = "0 0 0 3px rgba(19,88,239,0.25), 0 16px 40px rgba(10,42,102,0.12)";
      setTimeout(() => {
        pick.style.boxShadow = "";
        pick.classList.remove("is-pulse");
      }, 2400);
    }, 12000);
  }

  // Push additional adsbygoogle if containers exist without init
  try {
    $$("ins.adsbygoogle").forEach((el) => {
      if (!el.getAttribute("data-adsbygoogle-status")) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    });
  } catch (_) {
    /* Adblock or unloaded script */
  }

  // Mark body when ads likely blocked so affiliate CTAs stay front-and-center
  window.setTimeout(() => {
    const slots = $$(".ad-slot ins.adsbygoogle");
    const empty = slots.filter((el) => !el.getAttribute("data-adsbygoogle-status") && el.clientHeight < 20);
    if (empty.length && empty.length === slots.length) {
      document.body.classList.add("ads-likely-blocked");
    }
  }, 2500);
})();
