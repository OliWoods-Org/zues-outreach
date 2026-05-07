/**
 * Relay unified inbox — demo snapshot + optional GET from VITE_ZEUS_RELAY_API_URL/module.
 */

export type ConvStatus = 'open' | 'resolved' | 'handoff';
export type Platform = 'web' | 'email' | 'sms';
export type WorkflowStatus = 'active' | 'paused';

export interface Conversation {
  id: string;
  customer: string;
  snippet: string;
  platform: Platform;
  status: ConvStatus;
  time: string;
}

export interface Workflow {
  id: string;
  name: string;
  status: WorkflowStatus;
  triggerCount: number;
  resolutionRate: number;
}

export interface ProactiveRule {
  name: string;
  messagesSent: number;
  openRate: number;
  responseRate: number;
  conversionRate: number;
}

export interface RelayKpiTile {
  label: string;
  value: string;
  hint: string;
  accent: string;
}

export interface RelayModuleSnapshot {
  conversations: Conversation[];
  workflows: Workflow[];
  proactive: ProactiveRule[];
  kpis: RelayKpiTile[];
  widgetSnippet: string;
}

/** Aligns with MorningBrief `RelayData` shape for summary cards. */
export interface RelayBriefStats {
  openTickets: number;
  avgResponseTime: string;
  flagged: number;
  resolvedToday: number;
}

export const RELAY_WORKFLOW_TEMPLATES = [
  'after-hours',
  'vip-fast-lane',
  'angry-customer',
  'faq-deflection',
  'onboarding',
  'billing-issue',
] as const;

export const RELAY_WIDGET_SNIPPET =
  '<script src="https://relay.mama.ai/widget.js" data-token="relay_YOUR_TOKEN"></script>';

export const RELAY_DEMO_CONVERSATIONS: Conversation[] = [
  {
    id: 'cv-001',
    customer: 'Sarah K.',
    snippet: "Hi, I can't access my account after the password reset. It keeps saying...",
    platform: 'web',
    status: 'resolved',
    time: '2m ago',
  },
  {
    id: 'cv-002',
    customer: 'Marcus T.',
    snippet: 'What are the differences between your Pro and Business plans?',
    platform: 'web',
    status: 'open',
    time: '5m ago',
  },
  {
    id: 'cv-003',
    customer: 'billing@acmecorp.com',
    snippet: "I was charged twice for the same invoice. My reference number is INV-2024-...",
    platform: 'email',
    status: 'handoff',
    time: '12m ago',
  },
  {
    id: 'cv-004',
    customer: '+1 555-0192',
    snippet: 'Need help setting up the API integration for our CRM',
    platform: 'sms',
    status: 'open',
    time: '18m ago',
  },
  {
    id: 'cv-005',
    customer: 'Jordan M.',
    snippet: 'My trial expires tomorrow — can I get an extension?',
    platform: 'web',
    status: 'resolved',
    time: '34m ago',
  },
  {
    id: 'cv-006',
    customer: 'hello@startupxyz.io',
    snippet: 'Looking to understand volume pricing for 500+ seats',
    platform: 'email',
    status: 'resolved',
    time: '1h ago',
  },
];

export const RELAY_DEMO_WORKFLOWS: Workflow[] = [
  { id: 'wf-001', name: 'After Hours', status: 'active', triggerCount: 234, resolutionRate: 65.2 },
  { id: 'wf-002', name: 'VIP Fast Lane', status: 'active', triggerCount: 47, resolutionRate: 91.5 },
  { id: 'wf-003', name: 'FAQ Deflection', status: 'active', triggerCount: 389, resolutionRate: 78.4 },
  { id: 'wf-004', name: 'Angry Customer', status: 'active', triggerCount: 23, resolutionRate: 43.5 },
  { id: 'wf-005', name: 'Billing Issue', status: 'paused', triggerCount: 56, resolutionRate: 67.9 },
];

export const RELAY_DEMO_PROACTIVE: ProactiveRule[] = [
  { name: 'Inactive User Re-engagement', messagesSent: 34, openRate: 62.3, responseRate: 28.1, conversionRate: 12.5 },
  { name: 'Pricing Page Interest', messagesSent: 18, openRate: 78.9, responseRate: 44.2, conversionRate: 22.1 },
  { name: 'Trial Expiring', messagesSent: 23, openRate: 85.2, responseRate: 51.3, conversionRate: 31.8 },
  { name: 'Cart Abandoned', messagesSent: 14, openRate: 71.4, responseRate: 35.7, conversionRate: 14.3 },
];

function buildKpis(conversations: Conversation[]): RelayKpiTile[] {
  const open = conversations.filter(c => c.status === 'open').length;
  return [
    { label: 'AI Resolution Rate', value: '72.3%', hint: 'vs 58% industry avg', accent: '#f59e0b' },
    { label: 'Active Conversations', value: String(open), hint: 'Live right now', accent: '#22d3ee' },
    { label: 'This Month Saved', value: '$415', hint: 'vs Intercom Fin', accent: '#10b981' },
    { label: 'Avg Response Time', value: '1.4 min', hint: 'AI-first routing', accent: '#a78bfa' },
  ];
}

export function buildRelaySnapshot(
  conversations: Conversation[],
  workflows: Workflow[],
  proactive: ProactiveRule[],
  widgetSnippet: string = RELAY_WIDGET_SNIPPET
): RelayModuleSnapshot {
  return {
    conversations,
    workflows,
    proactive,
    kpis: buildKpis(conversations),
    widgetSnippet,
  };
}

export const RELAY_SNAPSHOT_DEMO: RelayModuleSnapshot = buildRelaySnapshot(
  RELAY_DEMO_CONVERSATIONS,
  RELAY_DEMO_WORKFLOWS,
  RELAY_DEMO_PROACTIVE
);

export function relayBriefStatsFromConversations(conversations: Conversation[]): RelayBriefStats {
  return {
    openTickets: conversations.filter(c => c.status === 'open').length,
    avgResponseTime: '1.4 min',
    flagged: conversations.filter(c => c.status === 'handoff').length,
    resolvedToday: conversations.filter(c => c.status === 'resolved').length,
  };
}

function coerceSnapshot(raw: unknown): RelayModuleSnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  if (!Array.isArray(o.conversations) || !Array.isArray(o.workflows) || !Array.isArray(o.proactive)) return null;
  const widgetSnippet = typeof o.widgetSnippet === 'string' ? o.widgetSnippet : RELAY_WIDGET_SNIPPET;
  const conv = o.conversations as Conversation[];
  const wf = o.workflows as Workflow[];
  const pr = o.proactive as ProactiveRule[];
  return buildRelaySnapshot(conv, wf, pr, widgetSnippet);
}

/** GET `{base}/module` → JSON matching RelayModuleSnapshot; fallback to demo on error or missing env. */
export async function fetchRelayModuleSnapshot(): Promise<RelayModuleSnapshot> {
  const base = typeof import.meta.env.VITE_ZEUS_RELAY_API_URL === 'string' ? import.meta.env.VITE_ZEUS_RELAY_API_URL.trim() : '';
  if (!base) return RELAY_SNAPSHOT_DEMO;
  try {
    const url = `${base.replace(/\/$/, '')}/module`;
    const res = await fetch(url, { credentials: 'omit' });
    if (!res.ok) return RELAY_SNAPSHOT_DEMO;
    const json = await res.json();
    const coerced = coerceSnapshot(json);
    return coerced ?? RELAY_SNAPSHOT_DEMO;
  } catch {
    return RELAY_SNAPSHOT_DEMO;
  }
}
