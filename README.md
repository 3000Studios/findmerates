<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# FindMeRates

Compare mortgage rates, CD rates & loan options with AI-powered insights.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in `.env.local` to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy

The application is deployed using **Wrangler** (Cloudflare Workers).

### Prerequisites
- Node.js
- Wrangler CLI (`npm install -g wrangler`)
- Cloudflare account

### Deployment Commands

**Local Development:**
```bash
npm run dev              # Local development with Express server
npm run dev:wrangler     # Local development with Wrangler
```

**Build and Deploy:**
```bash
npm run build           # Build the application
npm run deploy          # Deploy to production
npm run deploy:staging  # Deploy to staging environment
```

**Automated Deployment:**
```bash
./deploy-wrangler.ps1   # PowerShell deployment script
./deploy-wrangler.ps1 --staging  # Deploy to staging
```

## Features

- Rate comparison across multiple categories
- AI-powered financial insights
- Real-time rate data
- Interactive calculators
- AdSense integration
