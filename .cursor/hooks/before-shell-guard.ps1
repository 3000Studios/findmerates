param()

$inputJson = [Console]::In.ReadToEnd()
if ([string]::IsNullOrWhiteSpace($inputJson)) {
  Write-Output '{ "permission": "allow" }'
  exit 0
}

try {
  $payload = $inputJson | ConvertFrom-Json
  $command = [string]$payload.command

  if ($command -match "wrangler pages deploy dist" -and $command -notmatch "--project-name findmerates") {
    Write-Output '{ "permission": "ask", "user_message": "Deploy command is missing --project-name findmerates. Continue anyway?", "agent_message": "Use Cloudflare Pages project findmerates for production safety." }'
    exit 0
  }

  if ($command -match "wrangler pages deploy dist" -and $command -notmatch "--branch main") {
    Write-Output '{ "permission": "ask", "user_message": "Deploy command is missing --branch main. Continue anyway?", "agent_message": "Use branch main when deploying production build." }'
    exit 0
  }

  Write-Output '{ "permission": "allow" }'
  exit 0
} catch {
  Write-Output '{ "permission": "allow" }'
  exit 0
}
