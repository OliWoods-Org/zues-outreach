/** Mock ops data — replace with API for production */

export const workspace = {
  id: 'ws_acme',
  name: 'Acme Growth',
  plan: 'Pro' as const,
  seatsUsed: 6,
  seatsIncluded: 10,
};

export const usage = {
  voiceMinutesUsed: 842,
  voiceMinutesIncluded: 2000,
  billingPeriodEnd: 'May 12, 2026',
  currency: 'USD',
};

export type CampaignStatus = 'live' | 'paused' | 'scheduled';

export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  agent: string;
  dialsToday: number;
  connects: number;
  meetingsBooked: number;
  nextBatch?: string;
}

export const campaigns: Campaign[] = [
  {
    id: 'cmp_1',
    name: 'Q2 outbound — Mid-market SaaS',
    status: 'live',
    agent: 'Aria',
    dialsToday: 1840,
    connects: 312,
    meetingsBooked: 14,
  },
  {
    id: 'cmp_2',
    name: 'Speed-to-lead inbound',
    status: 'live',
    agent: 'Nova',
    dialsToday: 420,
    connects: 198,
    meetingsBooked: 22,
  },
  {
    id: 'cmp_3',
    name: 'Win-back dormant pipeline',
    status: 'paused',
    agent: 'Rex',
    dialsToday: 0,
    connects: 0,
    meetingsBooked: 0,
    nextBatch: 'Mon 9:00 AM local',
  },
  {
    id: 'cmp_4',
    name: 'Partner referral follow-up',
    status: 'scheduled',
    agent: 'Kai',
    dialsToday: 0,
    connects: 0,
    meetingsBooked: 0,
    nextBatch: 'Tomorrow 8:00 AM',
  },
];

export interface ActiveCall {
  id: string;
  prospect: string;
  company: string;
  agent: string;
  duration: string;
  stage: 'opening' | 'discovery' | 'close';
}

export const activeCalls: ActiveCall[] = [
  { id: 'call_1', prospect: 'Jordan Smith', company: 'Northwind Labs', agent: 'Aria', duration: '2:14', stage: 'discovery' },
  { id: 'call_2', prospect: 'Priya N.', company: 'StackForge', agent: 'Nova', duration: '0:42', stage: 'opening' },
];

export interface ActivityItem {
  id: string;
  type: 'call' | 'meeting' | 'script' | 'campaign';
  title: string;
  detail: string;
  time: string;
}

export const activityFeed: ActivityItem[] = [
  { id: 'a1', type: 'meeting', title: 'Meeting booked', detail: 'Contour AI · Nova · inbound form', time: '4m ago' },
  { id: 'a2', type: 'call', title: 'Qualified connect', detail: 'Jordan Smith · Northwind · Aria', time: '12m ago' },
  { id: 'a3', type: 'script', title: 'Marketplace purchase', detail: 'SaaS SDR — speed-to-lead · $19', time: '1h ago' },
  { id: 'a4', type: 'campaign', title: 'Campaign paused', detail: 'Win-back dormant pipeline · operator', time: '3h ago' },
];

/** Zeus-only unified intelligence lane — Listen / Brain / GEO / affiliates */
export type ZeusSignalSource = 'listen' | 'brain' | 'geo' | 'affiliate';

export interface ZeusSignal {
  id: string;
  source: ZeusSignalSource;
  title: string;
  detail: string;
  time: string;
}

export const zeusSignals: ZeusSignal[] = [
  { id: 'z1', source: 'listen', title: 'Trend spike · telehealth', detail: 'r/longevity + X · 3 posts above tier cap', time: '2m ago' },
  { id: 'z2', source: 'brain', title: 'Brief draft ready', detail: 'Weekly growth summary + 2 OptimizationSuggestions', time: '18m ago' },
  { id: 'z3', source: 'geo', title: 'Snippet gap · pricing page', detail: 'Add FAQ schema + “telehealth men” bridge phrase', time: '42m ago' },
  { id: 'z4', source: 'affiliate', title: 'Partner link CTR +12%', detail: 'Ambassador pack B vs control — promote B', time: '3h ago' },
];

export interface NumberHealth {
  id: string;
  label: string;
  status: 'healthy' | 'warn' | 'cooldown';
  detail: string;
}

export const numberHealth: NumberHealth[] = [
  { id: 'n1', label: '+1 (415) 555-0142', status: 'healthy', detail: 'Deliverability OK' },
  { id: 'n2', label: '+1 (628) 555-0199', status: 'warn', detail: 'High volume — rotate' },
  { id: 'n3', label: '+1 (510) 555-0104', status: 'cooldown', detail: 'Carrier cooldown 2h' },
];

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
}

export const headerNotifications: NotificationItem[] = [
  { id: 'n1', title: 'Meeting booked', body: 'Contour AI qualified via Nova inbound.', time: '4m ago', unread: true },
  { id: 'n2', title: 'Usage at 42%', body: '842 / 2000 voice minutes this period.', time: '2h ago', unread: true },
  { id: 'n3', title: 'Campaign needs review', body: 'Win-back paused by compliance rule.', time: 'Yesterday', unread: false },
];

export const funnelSnapshot = {
  dials: 12840,
  connects: 2190,
  qualified: 612,
  meetings: 94,
  connectRate: 17.1,
  qualRate: 28.0,
  meetingRate: 15.4,
};

/** Last 7 days — mock series for Mission Control charts */
export const weeklyKpis = {
  days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const,
  connectRatePct: [14.2, 15.1, 14.8, 16.4, 17.1, 15.9, 17.2],
  meetingsBooked: [11, 14, 12, 18, 22, 14, 19],
};

/** Zeus Growth OS lane — not dial-centric; feeds Mission Control pulse tiles */
export const growthOsPulse = {
  listenMentions24h: 47,
  listenTierBreaches: 3,
  publishQueued: 12,
  publishScheduled48h: 5,
  geoReadinessScore: 72,
  airtableLastSyncLabel: '2m ago',
  affiliateActiveLinks: 14,
};
