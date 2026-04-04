$ErrorActionPreference = "Stop"
$env:CLOUDFLARE_ACCOUNT_ID="d6ec056b27a57bcf807a46b2e3379d60"
$env:CLOUDFLARE_API_TOKEN="cfat_wN7y18vLpx6WTrL77aKebbOCxEIzJlpkFPRK8iEd8fafad74"
$env:GH_TOKEN="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"
$env:CLOUDFLARE_PAGES_PROJECT_NAME="findmerates"
$env:CLOUDFLARE_PAGES_BRANCH="main"

Write-Host "Running Vite Build..."
npm run build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Deploying to Cloudflare Pages via Wrangler..."
npx wrangler pages deploy dist --project-name $env:CLOUDFLARE_PAGES_PROJECT_NAME --branch $env:CLOUDFLARE_PAGES_BRANCH

Write-Host "Force Pushing to Github repo 3000Studios/findmerates..."
gh auth setup-git
git remote set-url origin "https://${env:GH_TOKEN}@github.com/3000Studios/findmerates.git"
git push origin main --force
