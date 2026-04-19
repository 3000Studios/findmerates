$ErrorActionPreference = "Stop"

# Safe deploy helper (no secrets in repo, no force push).
# - Build locally
# - Deploy via Wrangler (requires CLOUDFLARE_API_TOKEN in env)
# - Push `main` (optional) to trigger GitHub Actions deploy

Write-Host "Building..."
npm run build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Deploying to Cloudflare Pages (Wrangler)..."
npx wrangler pages deploy dist --project-name findmerates --branch main
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Pushing to origin/main..."
git push origin main

Write-Host "Done."

