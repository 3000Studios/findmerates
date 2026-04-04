---
name: findmerates-adsense-coding
description: "Best practices for coding FindMeRates: an AdSense-driven financial rate finder website. Enables coding guidance for React/TypeScript components, Gemini AI integration, Firebase backend, rate calculations, and ad placement optimization."
applyTo: "**"
---

# FindMeRates AdSense-Driven Financial Rate Finder

## Project Overview

- **Type**: React (v19) + TypeScript + Vite financial rate discovery platform
- **Monetization**: Google AdSense with optimized ad placement
- **AI**: Google Gemini API for financial advisory chatbot
- **Backend**: Firebase (Firestore, Auth, Hosting)
- **Styling**: Tailwind CSS v4 + Lucide React icons
- **Key Features**: Rate comparisons, mortgage calculator, predictive briefing, pro tier

## Tech Stack
- **Frontend**: React 19, TypeScript, Vite 6, React Router 7
- **Styling**: Tailwind CSS 4, Motion (animations), clsx/tailwind-merge
- **AI/Chat**: Google Generative AI (Gemini), @google/genai SDK
- **Backend**: Firebase (Firestore), express.js (Node.js server)
- **Data Viz**: D3.js, Recharts
- **Build**: TSX, Node 22+

## Core Architecture

### Pages Structure
```
/pages
  Home.tsx          - Landing page with hero, benefits, CTA
  Rates.tsx         - Rate cards, category filters, search
  Calculators.tsx   - Mortgage calculator, loan estimator
  Dashboard.tsx     - User analytics, saved rates
  Guide.tsx         - Educational content, blog-style articles
  Pro.tsx           - Premium features, subscription tier
  Legal.tsx         - Terms, privacy, disclaimers
```

### Components Patterns
- **ErrorBoundary.tsx**: Graceful error handling, prevents white screens
- **GeminiChat.tsx**: Floating rate assistant with streaming responses
- **MortgageCalculator.tsx**: Input validation, real-time calculations
- **RateCard.tsx**: Reusable rate display with comparison toggle
- **Layout.tsx**: Top nav, footer, ad injection points
- **PredictiveBriefing.tsx**: AI-generated market insights

## AdSense Integration Best Practices

### Ad Placement Strategy
1. **Header/Nav Ad** (300x250 Medium Rect): Above fold, non-intrusive
2. **Sidebar Ad** (300x600 Half Page): Right column on desktop
3. **Mid-Content Ad** (between rate cards): After 3-4 rate cards
4. **Footer Ad** (728x90 Leaderboard): Below content
5. **Floating Ad** (320x50 Mobile Banner): Mobile only, sticky footer

### Implementation Guidelines
- Use AdSense placement components in `Layout.tsx` with responsive visibility
- **Never** place ads inside financial calculators or critical user interactions
- Maintain min 2px padding around ads for user experience
- Lazy load ad scripts to prevent blocking page render
- Track ad performance separately from core analytics
- Ensure ad frequency is ≤2-3 per screen height to avoid user friction
- Always test on mobile—ads must NOT obstruct rate cards or CTAs

### Ad Content Policy Compliance
- Do NOT mix ads with real-time financial data (separate visually)
- Disallow ads on "Pro" premium features
- Block ads in /legal pages
- Exclude ad networks that might promote competing financial services
- Use AdSense filters to block irrelevant categories

## Gemini AI Integration

### System Prompt Pattern
When initializing Gemini chat, use role-based system instruction:
```typescript
systemInstruction: "You are a financial rate expert for FindMeRates.com. Help users understand mortgage rates, CD rates, and loan options. Be professional, accurate, and helpful. Do not provide specific legal or investment advice, but explain concepts and trends."
```

### Conversation Context
- Include user's saved rates in chat context for personalized advice
- Reference dashboard data to provide tailored recommendations
- Stream responses for better UX (use response.stream() if available)
- Cache system instruction to reduce token usage

### Rate Data Integration
- Pass live rate data from Firestore to Gemini for accurate comparisons
- If user asks "What rates are available?", fetch from db before responding
- Always cite current market conditions, not hallucinated rates

## React Component Best Practices

### Form & Input Validation
- Use React 19's enhanced features for form state
- Validate mortgage/rate inputs client-side before submission
- Display clear error messages for invalid loan amounts
- Prevent XSS by escaping rate provider names

### State Management
- Use `useState` for local UI state (currently no Redux/Zustand)
- Use context for global auth state (Firebase)
- Lift rate filtering state to parent component for inter-page consistency

### TypeScript Patterns
```typescript
// Rate card type system
interface RateOffer {
  id: string;
  provider: string;
  type: 'mortgage' | 'cd' | 'savings' | 'loan';
  rate: number;
  term?: number;
  apy?: number;
  updatedAt: Date;
}

// Component props
interface RateCardProps {
  offer: RateOffer;
  onCompare: (id: string) => void;
  isSelected: boolean;
}
```

### Performance Optimization
- Lazy load rate data with pagination (100 rates per page max)
- Memoize expensive calculations (mortgage interest math)
- Use React.memo() for RateCard components to prevent re-renders
- Debounce rate filter searches

## Firebase Integration

### Firestore Collections
- `rates/` - Rate offers (collection sorted by updatedAt)
- `users/` - User profiles (if logged in)
- `conversions/` - Rate click/application tracking
- `featureUsage/` - Track calculator usage for analytics

### Firestore Rules
```
match /rates/{document=**} {
  allow read: if request.auth != null || true;
  allow write: if request.auth.uid == request.resource.data.userId;
}
```

### Real-Time Data Sync
- Use `onSnapshot()` for live rate updates
- Implement pagination cursors to avoid large downloads
- Cache query results client-side with 5-minute TTL

## Rate Calculation Logic

### Mortgage Calculator Formula
```
Monthly Payment = P * [r(1+r)^n] / [(1+r)^n - 1]
  where: P = principal, r = monthly rate, n = number of payments
```

### APY Calculation
```
APY = (1 + APR/n)^n - 1
  where: n = compounding periods per year (12 for monthly)
```

### Validation Rules
- Loan amount: $10,000 - $1,000,000
- Interest rate: 0.1% - 12% (adjust per product)
- Loan term: 5 - 40 years
- Down payment: 0% - 50%

## Layout & Responsive Design

### Breakpoints (Tailwind)
- Mobile: 320px - 640px (sm)
- Tablet: 641px - 1024px (lg)
- Desktop: 1025px+

### Mobile Optimization
- Stack rate cards vertically
- Full-width calculators on mobile
- Bottom-sheet chat interface (currently fixed bottom-6)
- Pinch-zoom disabled for rate tables
- Touch targets ≥48x48px

## Styling & Theming

### CSS Pattern
- Use Tailwind utility classes + Motion for animations
- Define brand colors once (look for `bg-brand-600` pattern)
- Use consistent spacing scale (gap-2, gap-4, gap-6)
- Apply `font-display` for headings, `font-sans` for body

### Dark Mode (Future)
- If adding dark mode, use Tailwind `dark:` prefix consistently
- Test contrast ratios (WCAG AA minimum 4.5:1)

## Code Quality & Workflow

### Linting & Type Checking
```bash
npm run lint          # TypeScript strict mode
npm run build         # Vite optimized bundle
npm run dev           # Local dev server with HMR
npm run preview       # Preview production build
```

### File Structure Conventions
- Component files: `PascalCase.tsx`
- Pages: `PascalCase.tsx` in `/pages`
- Utilities: `camelCase.ts` in `/lib`
- Types shared: define in `types.ts`
- Keep component files ≤300 lines (split if larger)

### Import Organization
```typescript
// External libraries
import React from 'react';
import { useRouter } from 'react-router-dom';

// Internal components
import Layout from '../components/Layout';

// Utils & types
import { cn } from '../lib/utils';
import type { RateOffer } from '../types';
```

## Security & Privacy

### Sensitive Data
- **Never** store API keys in code (use environment variables)
- `GEMINI_API_KEY` loaded from `.env.local`
- Firebase config is public, Auth keys are restricted
- User rate selections stored in localStorage (not PII)

### XSS Prevention
- Sanitize rate provider names before display
- Use react-markdown safely (with allowed tags list)
- Escape user input in chat component

### HTTPS & Data Protection
- Enforce HTTPS in production (Firebase Hosting does this)
- Firestore rules enforce auth for sensitive data
- Clear cache on logout (localStorage.clear())

## AdSense & Analytics Integration

### Tracking Events
- Track rate clicks: `{rateId, providerId, timestamp}`
- Track calculator usage: `{type, inputs, result}`
- Track ad impressions/clicks separately
- No PII in analytics (no user emails in events)

### Revenue Optimization
1. **A/B Test Ad Placements**: Track CTR for each position
2. **Content Relevance**: Higher relevance = higher AdSense CPM
3. **Traffic Quality**: Block bots, invalid traffic
4. **Page Speed**: Faster pages = higher ad rates (aim for <2s load)

## Common Development Patterns

### Adding a New Rate Type
1. Add type to `RateOffer` union: `'mortgage' | 'cd' | 'savings' | 'loan' | 'newType'`
2. Create `/pages/[NewType].tsx` page
3. Add route in `App.tsx`
4. Add card in `Layout.tsx` nav
5. Create Firestore collection `rates/newType/*`

### Updating Gemini Prompt
- Edit system instruction in `GeminiChat.tsx`
- Test responses locally with edge cases
- Monitor token usage in logs
- Regenerate if adding new rate types

### Debugging Production Issues
1. Check Firebase rules in console (Firestore rules tab)
2. Enable request logging in GeminiChat
3. Verify AdSense script loads (check Network tab)
4. Monitor Error Boundary logs in console
5. Check .env.local for API key validity

## Performance Targets

- **First Contentful Paint (FCP)**: <1.5s
- **Largest Contentful Paint (LCP)**: <2.5s
- **Cumulative Layout Shift (CLS)**: <0.1
- **Time to Interactive (TTI)**: <3.5s
- **Bundle Size**: <200KB (gzipped)

## Deployment & CI/CD

### Build Command
```bash
npm run build          # Creates /dist with optimized assets
```

### Environment Variables
- `.env.local` for secrets (Git-ignored)
- `GEMINI_API_KEY` required for chat
- Firebase config is public
- Build script in `deploy-and-push.ps1`

### Pre-Deploy Checklist
- [ ] No console errors or warnings
- [ ] Mobile responsive tested
- [ ] AdSense code present and valid
- [ ] Firestore rules finalized
- [ ] Rate data populated in production

## When to Reach Out

Use this instruction set to guide:
- Component architecture decisions
- Rate calculation implementations
- Gemini API prompt refinement
- Ad placement & UX balance
- Firebase data modeling
- Performance optimizations
- Mobile responsiveness issues
