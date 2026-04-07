#!/usr/bin/env pwsh

# FindMeRates Wrangler Deployment Script
# This script builds and deploys the application using Wrangler

Write-Host "Starting FindMeRates deployment with Wrangler..." -ForegroundColor Green

# Check if Wrangler is installed
try {
    $wranglerVersion = wrangler --version
    Write-Host "Wrangler version: $wranglerVersion" -ForegroundColor Cyan
} catch {
    Write-Error "Wrangler is not installed. Please run: npm install -g wrangler"
    exit 1
}

# Clean previous build
Write-Host "Cleaning previous build..." -ForegroundColor Yellow
npm run clean

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

# Build the application
Write-Host "Building application..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Error "Build failed!"
    exit 1
}

# Check if dist directory exists
if (-not (Test-Path "dist")) {
    Write-Error "Build output directory 'dist' not found!"
    exit 1
}

Write-Host "Build completed successfully!" -ForegroundColor Green

# Deploy to Cloudflare Workers
Write-Host "Deploying to Cloudflare Workers..." -ForegroundColor Yellow

# Check if we're deploying to staging
if ($args -contains "--staging") {
    Write-Host "Deploying to staging environment..." -ForegroundColor Cyan
    wrangler deploy --env staging
} else {
    Write-Host "Deploying to production environment..." -ForegroundColor Cyan
    wrangler deploy
}

if ($LASTEXITCODE -ne 0) {
    Write-Error "Deployment failed!"
    exit 1
}

Write-Host "Deployment completed successfully!" -ForegroundColor Green
Write-Host "Your application is now live on Cloudflare Workers!" -ForegroundColor Green

# Show deployment info
Write-Host "Deployment information:" -ForegroundColor Cyan
wrangler whoami
