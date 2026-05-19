// One-shot: push production env vars + secrets to Cloudflare Pages.
//
// Reads ALL values from one of:
//   1. Real process.env (highest priority)
//   2. ./.env.local in this project
//   3. C:\Workspaces\LOCAL_ENV.txt (master credential file)
//
// No secrets are hardcoded here — safe to commit.
//
// Usage:
//   CF_ACCOUNT_ID=... CF_TOKEN=... node scripts/set-cf-env.mjs
// (CF_ACCOUNT_ID and CF_TOKEN can also come from LOCAL_ENV.txt as
//  CLOUDFLARE_ACCOUNT_ID / CLOUDFLARE_API_TOKEN.)

import fs from 'node:fs';
import path from 'node:path';

function parseEnvFile(file) {
  const out = {};
  if (!fs.existsSync(file)) return out;
  const text = fs.readFileSync(file, 'utf8');
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq < 0) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (key && !(key in out)) out[key] = val;
  }
  return out;
}

const here = path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1');
const projectRoot = path.resolve(here, '..');
const envLocal = parseEnvFile(path.join(projectRoot, '.env.local'));
const masterEnv = parseEnvFile('C:\\Workspaces\\LOCAL_ENV.txt');

const get = (...keys) => {
  for (const k of keys) {
    if (process.env[k]) return process.env[k];
    if (envLocal[k]) return envLocal[k];
    if (masterEnv[k]) return masterEnv[k];
  }
  return '';
};

const ACCOUNT_ID = get('CF_ACCOUNT_ID', 'CLOUDFLARE_ACCOUNT_ID');
const TOKEN = get('CF_TOKEN', 'CLOUDFLARE_API_TOKEN');
const PROJECT = get('CF_PROJECT') || 'findmerates';
if (!ACCOUNT_ID || !TOKEN) {
  console.error('Missing CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_API_TOKEN (env, .env.local, or LOCAL_ENV.txt)');
  process.exit(1);
}

const plain = (v) => ({ type: 'plain_text', value: String(v ?? '') });
const secret = (v) => ({ type: 'secret_text', value: String(v ?? '') });

const vars = {
  VITE_API_BASE_URL: plain('https://findmerates.com'),
  VITE_ADSENSE_CLIENT_ID: plain(get('VITE_ADSENSE_CLIENT_ID', 'ADSENSE_CLIENT_ID')),
  VITE_ENABLE_ADS: plain(get('VITE_ENABLE_ADS') || 'TRUE'),
  VITE_STRIPE_BASIC_LINK: plain(get('VITE_STRIPE_BASIC_LINK')),
  VITE_STRIPE_PAYMENT_LINK: plain(get('VITE_STRIPE_PAYMENT_LINK')),
  VITE_STRIPE_6MONTH_LINK: plain(get('VITE_STRIPE_6MONTH_LINK')),
  VITE_FIREBASE_API_KEY: plain(get('VITE_FIREBASE_API_KEY')),
  VITE_FIREBASE_AUTH_DOMAIN: plain(get('VITE_FIREBASE_AUTH_DOMAIN')),
  VITE_FIREBASE_PROJECT_ID: plain(get('VITE_FIREBASE_PROJECT_ID')),
  VITE_FIREBASE_STORAGE_BUCKET: plain(get('VITE_FIREBASE_STORAGE_BUCKET')),
  VITE_FIREBASE_MESSAGING_SENDER_ID: plain(get('VITE_FIREBASE_MESSAGING_SENDER_ID')),
  VITE_GEMINI_API_KEY: plain(get('VITE_GEMINI_API_KEY', 'GEMINI_API_KEY')),
  VITE_GEMINI_MODEL: plain(get('VITE_GEMINI_MODEL') || 'gemini-2.0-flash-exp'),
  VITE_PEXELS_API_KEY: plain(get('VITE_PEXELS_API_KEY', 'PEXELS_API_KEY', 'PEXEL_API')),
  VITE_UNSPLASH_ACCESS_KEY: plain(get('VITE_UNSPLASH_ACCESS_KEY', 'UNSPLASH_ACCESS_KEY')),
  VITE_ADMIN_EMAILS: plain(get('VITE_ADMIN_EMAILS', 'ADMIN_EMAIL')),
  NODE_VERSION: plain('20'),
  GEMINI_API_KEY: secret(get('GEMINI_API_KEY')),
  PEXELS_API_KEY: secret(get('PEXELS_API_KEY', 'PEXEL_API')),
  UNSPLASH_ACCESS_KEY: secret(get('UNSPLASH_ACCESS_KEY')),
  CRON_SECRET: secret(get('CRON_SECRET', 'ADMIN_ACCESS_TOKEN')),
  JWT_SECRET: secret(get('JWT_SECRET')),
  OPENAI_API_KEY: secret(get('OPENAI_API_KEY')),
  ADMIN_EMAIL: secret(get('ADMIN_EMAIL')),
  VITE_OPS_KEY: secret(get('VITE_OPS_KEY', 'ADMIN_ACCESS_TOKEN')),
};

const missing = Object.entries(vars).filter(([, v]) => !v.value).map(([k]) => k);
if (missing.length) {
  console.warn(`Warning: ${missing.length} keys resolved to empty: ${missing.join(', ')}`);
}

const body = {
  deployment_configs: {
    production: { env_vars: vars },
    preview: { env_vars: vars },
  },
};

const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT}`;
const res = await fetch(url, {
  method: 'PATCH',
  headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});
const text = await res.text();
let parsed;
try { parsed = JSON.parse(text); } catch { parsed = text; }
if (!res.ok || (parsed && parsed.success === false)) {
  console.error('FAIL', res.status, JSON.stringify(parsed?.errors || parsed, null, 2));
  process.exit(1);
}
const keys = Object.keys(vars);
console.log(`OK — set ${keys.length} env vars on project "${PROJECT}" (production + preview).`);
console.log('Keys:', keys.join(', '));
