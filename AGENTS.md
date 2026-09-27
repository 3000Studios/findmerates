# AGENTS.md — 3000Studios Project Rules

Project: findmerates.com
Firebase app: findmerates-com
Deployment target: Cloudflare DNS Only
Primary gap from audit: Needs full scaffolding setup

Rules:
- Do not expose secrets.
- Read variable names only from C:\Users\Servi\.config\env\global.env.
- Never commit .env files, API keys, service accounts, tokens, cookies, or private keys.
- Cloudflare is the public deployment platform.
- Firebase is used for Auth/Firestore only where useful.
- Firebase Storage is not enabled on Spark; use Cloudflare/static asset fallback until approved.
- Run lint/typecheck/build/security scans before final changes.
- Keep UI mobile-first, accessible, fast, SEO-ready, and AdSense-review-ready.
- Every code change must be committed, pushed, and followed by a production audit deploy on the existing Cloudflare Pages project.
- Owner standing authorization: deploy validated production changes to the canonical Cloudflare Pages project without requesting per-change approval. Always verify the live site afterward and report the result.
