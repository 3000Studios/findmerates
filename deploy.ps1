$ErrorActionPreference = "Stop"

# Safe deploy helper (no secrets in repo, no force push).
# - Build locally
# - Deploy via Wrangler (requires CLOUDFLARE_API_TOKEN in env)
# - Push `main` (optional) to trigger GitHub Actions deploy

function Import-GlobalEnv {
  $globalEnvPath = "C:\Users\Servi\.config\env\global.env"
  if (-not (Test-Path $globalEnvPath)) { return }

  Get-Content $globalEnvPath | ForEach-Object {
    $line = $_.Trim()
    if (-not $line) { return }
    if ($line.StartsWith("#")) { return }

    $parts = $line.Split("=", 2)
    if ($parts.Count -lt 2) { return }

    $key = $parts[0].Trim()
    $value = $parts[1].Trim()
    if (-not $key) { return }

    Set-Item -Path ("Env:" + $key) -Value $value
  }
}

Import-GlobalEnv

Write-Host "Building..."
npm run build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Deploying to Cloudflare Pages (Wrangler)..."
npx wrangler pages deploy dist --project-name findmerates --branch main
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Pushing to origin/main..."
git push origin main

Write-Host "Done."
