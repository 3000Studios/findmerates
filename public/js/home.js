const paths = { mortgage: '/rates/mortgage', savings: '/rates/savings', auto: '/rates/auto_loan', personal: '/rates/personal_loan' };
const goalButtons = [...document.querySelectorAll('.goal')];
const goalResult = document.querySelector('#goal-result');
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');

const routeTitles = {
  '/rates/mortgage': ['Mortgage comparison', 'Compare rate structure, APR, fees, and loan term before you contact a lender.'],
  '/rates/savings': ['Savings account comparison', 'Compare APY, access to funds, account fees, and balance requirements.'],
  '/rates/cd': ['CD comparison', 'Compare APY, term length, minimum deposit, and early-withdrawal rules.'],
  '/rates/auto_loan': ['Auto loan comparison', 'Compare APR, term, total cost, and estimated payment before you apply.'],
  '/rates/personal_loan': ['Personal loan comparison', 'Compare APR, origination fees, repayment term, and total cost.'],
  '/calculators': ['Financial calculators', 'Use the mortgage estimator to explore a payment before you request any quote.'],
  '/guide': ['Money decision guides', 'Plain-language guides for comparing major borrowing and savings choices.'],
  '/methodology': ['Our methodology', 'We explain the criteria used for educational comparisons and clearly label paid placements.'],
  '/how-we-make-money': ['How we make money', 'FindMeRates may earn compensation from partner offers. That does not change the educational information we provide.'],
  '/how-it-works': ['How FindMeRates works', 'Choose a goal, compare the factors that matter, then decide whether to contact a provider.']
};

if (routeTitles[window.location.pathname]) {
  const [title, description] = routeTitles[window.location.pathname];
  document.title = `${title} | FindMeRates`;
  document.querySelector('#main').innerHTML = `<section class="route-page"><div class="shell"><p class="eyebrow">FINDMERATES GUIDE</p><h1>${title}</h1><p class="intro">${description}</p><div class="hero-actions"><a class="button primary" href="/calculators">Use the calculator</a><a class="text-cta" href="/">Return to your money move map →</a></div><section class="route-checklist"><h2>What to compare</h2><ul><li>Rate or APY together with APR when borrowing</li><li>Fees, terms, eligibility, and access to funds</li><li>Written offer details from more than one provider</li></ul></section></div></section>`;
}

goalButtons.forEach((button) => {
  button.addEventListener('click', () => {
    goalButtons.forEach((item) => item.classList.toggle('active', item === button));
    const href = paths[button.dataset.goal];
    goalResult.innerHTML = `Ready to compare? <a href="${href}">Open your ${button.textContent.trim().split('\n')[0].toLowerCase()} path →</a>`;
  });
});

menu?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
});

document.querySelector('#mortgage-calculator')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const price = Number(form.get('price')) || 0;
  const downPercent = Number(form.get('down')) || 0;
  const annualRate = Number(form.get('rate')) || 0;
  const years = Number(form.get('term')) || 30;
  const principal = price * (1 - downPercent / 100);
  const months = years * 12;
  const monthlyRate = annualRate / 1200;
  const payment = monthlyRate ? principal * (monthlyRate * (1 + monthlyRate) ** months) / ((1 + monthlyRate) ** months - 1) : principal / months;
  const output = document.querySelector('#payment-result');
  output.textContent = `Estimated principal & interest: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(payment)} per month. Taxes, insurance, fees, and eligibility are not included.`;
});
