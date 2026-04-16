# Sets GitHub repository secrets via `gh secret set`.
# Put real values in your shell environment or a private, gitignored file — never commit secrets.
#
# Example (PowerShell):
#   $env:CLOUDFLARE_API_TOKEN = "your_token"
#   $env:CLOUDFLARE_ACCOUNT_ID = "your_account_id"
#   .\set-secrets.ps1

$ErrorActionPreference = "Stop"
$repo = "3000Studios/findmerates"

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  throw "GitHub CLI (gh) is required."
}
gh auth status | Out-Null

$map = @{
  "CLOUDFLARE_API_TOKEN"   = $env:CLOUDFLARE_API_TOKEN
  "CLOUDFLARE_ACCOUNT_ID"  = $env:CLOUDFLARE_ACCOUNT_ID
  "VITE_API_BASE_URL"      = $env:VITE_API_BASE_URL
  "VITE_ADSENSE_CLIENT_ID" = $env:VITE_ADSENSE_CLIENT_ID
  "VITE_ENABLE_ADS"        = $env:VITE_ENABLE_ADS
  "VITE_CLARITY_PROJECT_ID"= $env:VITE_CLARITY_PROJECT_ID
  "NODE_ENV"               = $env:NODE_ENV
  "GH_TOKEN"               = $env:GH_TOKEN
}

foreach ($key in $map.Keys) {
  $val = $map[$key]
  if ([string]::IsNullOrWhiteSpace($val)) { continue }
  Write-Host "Setting secret $key..."
  $val | gh secret set $key -R $repo
}
Write-Host "Done (skipped any empty env vars). Repo: $repo"
