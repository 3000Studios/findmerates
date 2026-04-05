# GitHub Actions Secrets Setup for FindMeRates
# Run this script to push secrets to GitHub

# Ensure GH_TOKEN is set in your environment
if (-not $env:GH_TOKEN) {
    Write-Error "GH_TOKEN environment variable not set. Set it before running this script."
    exit 1
}

$repo = "3000Studios/findmerates"

# Secrets to push
$secrets = @{
    "VITE_ADSENSE_CLIENT_ID" = "ca-pub-5800977493749262"
    "VITE_ENABLE_ADS" = "TRUE"
    "GEMINI_API_KEY" = "AIzaSyCBGfV7VjEKmuYkKvzuALs20GFJVUTiIwk"
    "CLOUDFLARE_PAGES_PROJECT_NAME" = "findmerates"
    "CLOUDFLARE_PAGES_BRANCH" = "main"
}

Write-Host "Pushing secrets to $repo..." -ForegroundColor Green

foreach ($key in $secrets.Keys) {
    $val = $secrets[$key]
    Write-Host "Setting secret: $key" -ForegroundColor Cyan
    try {
        $val | gh secret set $key -R $repo
        Write-Host "Successfully set $key" -ForegroundColor Green
    } catch {
        Write-Error "Failed to set $key : $_"
    }
}

Write-Host "All secrets successfully pushed!" -ForegroundColor Green
Write-Host "Verify at: https://github.com/$repo/settings/secrets/actions"
