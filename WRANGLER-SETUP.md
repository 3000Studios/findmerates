# Wrangler Setup Guide for FindMeRates

## Prerequisites
- Node.js installed
- Cloudflare account
- Wrangler CLI installed (`npm install -g wrangler`)

## Step 1: Authenticate with Cloudflare

### Option A: Browser Authentication (Recommended)
```bash
wrangler auth
```
This will open a browser window for you to log into your Cloudflare account.

### Option B: API Token Authentication
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
2. Create a new API token with the following permissions:
   - Account: Cloudflare Workers:Edit
   - Zone: Zone:Read (if you need zone access)
   - Account Resources: Include your account ID
3. Set the token as an environment variable:
```bash
$env:CLOUDFLARE_API_TOKEN="your-api-token-here"
```

## Step 2: Configure Your Worker

The `wrangler.toml` file is already configured with:
- Worker name: `findmerates`
- Compatibility date: `2024-01-01`
- Build configuration pointing to the `dist` directory

## Step 3: Set Environment Variables

Create a `.dev.vars` file for local development:
```bash
# .dev.vars
VITE_ADSENSE_CLIENT_ID="your-adsense-client-id"
VITE_ENABLE_ADS="TRUE"
GEMINI_API_KEY="your-gemini-api-key"
```

For production, set secrets via Wrangler:
```bash
wrangler secret put VITE_ADSENSE_CLIENT_ID
wrangler secret put VITE_ENABLE_ADS
wrangler secret put GEMINI_API_KEY
```

## Step 4: Local Development

Test locally with Wrangler:
```bash
npm run dev:wrangler
```

Or use the traditional Express server:
```bash
npm run dev
```

## Step 5: Deploy

### Deploy to Staging
```bash
npm run deploy:staging
```

### Deploy to Production
```bash
npm run deploy
```

### Use the PowerShell Script
```bash
./deploy-wrangler.ps1
```

## Troubleshooting

### Network Issues
If you encounter network connectivity issues:
1. Check your internet connection
2. Disable VPN temporarily
3. Check firewall settings
4. Try using a different network

### Authentication Issues
If authentication fails:
1. Clear existing credentials: `wrangler auth logout`
2. Re-authenticate: `wrangler auth`
3. Verify your API token permissions

### Build Issues
If the build fails:
1. Clean previous builds: `npm run clean`
2. Reinstall dependencies: `npm install`
3. Check for TypeScript errors: `npm run lint`

## Project Structure

```
findmerates.com/
  src/
    worker.js              # Cloudflare Worker entry point
    App.tsx                # Main React application
    components/            # React components
    pages/                 # Page components
  dist/                   # Build output
  wrangler.toml           # Wrangler configuration
  package.json           # Dependencies and scripts
  deploy-wrangler.ps1    # Deployment script
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| VITE_ADSENSE_CLIENT_ID | Google AdSense client ID | Yes |
| VITE_ENABLE_ADS | Enable/disable ads | Yes |
| GEMINI_API_KEY | Google Gemini API key | Yes |

## Deployment URLs

After deployment, your application will be available at:
- Production: `https://findmerates.your-subdomain.workers.dev`
- Staging: `https://findmerates-staging.your-subdomain.workers.dev`

You can also set up a custom domain in the Cloudflare Dashboard.
