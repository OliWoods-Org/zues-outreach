/**
 * MAMA Marketplace — Zeus addon definitions.
 * Each addon can be in trial, active, or locked state per workspace.
 * Pricing + trial config lives here; payment processed via Stripe on MAMA side.
 */

export type AddonStatus = 'locked' | 'trial' | 'active';

export interface MarketplaceAddon {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;           // USD / month
  priceLabel: string;      // display string
  trialDays: number;
  category: 'intelligence' | 'growth' | 'social' | 'testing';
  icon: string;            // emoji
  accentColor: string;
  features: string[];
  poweredBy: string[];     // e.g. ['Firecrawl', 'Airtable', 'MAMA']
  docsUrl?: string;
}

export const MARKETPLACE_ADDONS: MarketplaceAddon[] = [
  {
    id: 'competitor-intel',
    name: 'Competitor Intel',
    tagline: 'Weekly traffic snapshots on every rival — no API key needed.',
    description:
      'Automatically scrapes SimilarWeb public data for your configured competitors on a weekly schedule. Results sync to a private Airtable base and surface in your Zeus Intelligence dashboard. Track traffic rank, monthly visits, bounce rate, top countries, and source split over time.',
    price: 29,
    priceLabel: '$29 / mo',
    trialDays: 14,
    category: 'intelligence',
    icon: '🔭',
    accentColor: '#6366f1',
    features: [
      'Auto-scrape up to 20 competitor domains',
      'Weekly SimilarWeb traffic snapshots',
      'Private Airtable base — your data, your schema',
      'Trend charts: rank, visits, bounce over time',
      'LuxuryTravels & CoFounder competitor packs pre-loaded',
      'Add custom domains anytime',
    ],
    poweredBy: ['Firecrawl', 'Airtable', 'MAMA Cron'],
  },
  {
    id: 'eckleberg-ux',
    name: 'Eckleberg UX Testing',
    tagline: 'AI persona sessions that watch your product so you don\'t have to.',
    description:
      'Runs 10 AI-driven user personas through your product on a schedule. Each persona screenshots every step, Claude Haiku observes friction in real-time, and a 5-perspective LLM council synthesizes a UX score, issue matrix, and exec summary. Compare runs over time.',
    price: 49,
    priceLabel: '$49 / mo',
    trialDays: 7,
    category: 'testing',
    icon: '👁',
    accentColor: '#f59e0b',
    features: [
      '10 demographic AI personas per run',
      'Playwright headless sessions with screenshots',
      'Claude Haiku per-step observation',
      '5-perspective LLM council synthesis',
      'UX score 0–10 + issue priority matrix',
      'Scheduled weekly runs + Slack alerts',
    ],
    poweredBy: ['Playwright', 'Claude Haiku', 'Claude Sonnet', 'MAMA Cron'],
  },
  {
    id: 'social-feed',
    name: 'Social Feed Monitor',
    tagline: 'Every mention of your product, with one-click reply.',
    description:
      'Monitors Reddit, X, HN, GitHub, and YouTube for mentions of your product keywords. Surfaces them in a unified feed with sentiment scoring. Queue auto-drafted replies or respond manually from the drawer.',
    price: 19,
    priceLabel: '$19 / mo',
    trialDays: 14,
    category: 'social',
    icon: '📡',
    accentColor: '#f43f5e',
    features: [
      'Reddit, X, HN, GitHub, YouTube monitoring',
      'Sentiment scoring per mention',
      'Auto-response drafting via MAMA agent',
      'Reply drawer with edit + send',
      'Keyword + platform filters',
      'Daily digest email',
    ],
    poweredBy: ['MAMA SocialListener', 'Claude Haiku', 'Airtable'],
  },
];

/** Simulated per-workspace addon state — replace with Supabase/API call in prod */
export const MOCK_WORKSPACE_ADDONS: Record<string, AddonStatus> = {
  'competitor-intel': 'trial',
  'eckleberg-ux': 'locked',
  'social-feed': 'active',
};

export function getAddon(id: string) {
  return MARKETPLACE_ADDONS.find(a => a.id === id);
}
