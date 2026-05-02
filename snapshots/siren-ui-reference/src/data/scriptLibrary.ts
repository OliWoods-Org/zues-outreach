/**
 * Script library: included (free), premium (Siren Pro), marketplace (peer).
 * Copy patterns follow permission-with-context, reason-for-calling, short time-box asks
 * (avoid leading with “bad time?” per common outbound benchmarks — lead with relevance).
 */

export type ScriptCategory =
  | 'Cold Call'
  | 'Discovery'
  | 'Objection'
  | 'Closing'
  | 'Voicemail'
  | 'Follow-up';

export interface IncludedScript {
  kind: 'included';
  id: string;
  title: string;
  category: ScriptCategory;
  description: string;
  /** Why this works — ties to high-performing outbound patterns */
  principle: string;
  lines: string[];
  tips: string[];
  variables: string[];
}

export interface PremiumScript {
  kind: 'premium';
  id: string;
  title: string;
  category: ScriptCategory;
  description: string;
  principle: string;
  lines: string[];
  tips: string[];
  variables: string[];
  priceUsd: number;
  /** Self-reported / cohort benchmarks — not a guarantee */
  metrics: {
    label: string;
    value: string;
    detail?: string;
  }[];
  sampleCalls?: number;
}

export interface MarketplaceScript {
  kind: 'marketplace';
  id: string;
  title: string;
  category: ScriptCategory;
  description: string;
  principle: string;
  lines: string[];
  tips: string[];
  variables: string[];
  authorName: string;
  authorId: string;
  priceUsd: number;
  rating: number;
  reviewCount: number;
  purchases: number;
  verifiedSeller: boolean;
}

export const includedScripts: IncludedScript[] = [
  {
    kind: 'included',
    id: 'inc-permission-context',
    title: 'Permission + context (27 seconds)',
    category: 'Cold Call',
    description: 'Own the cold call, name why them/why now, then ask for a tiny time slice.',
    principle:
      'Permission works when earned with context — not “did I catch you at a bad time?” Lead with one relevance cue, then time-box (e.g. 27s).',
    variables: ['Name', 'You', 'Company', 'Specific trigger in 8–12 words'],
    lines: [
      'Hi [Name] — [You] from [Company].',
      'I know this is out of the blue. The reason I’m calling: [specific trigger in 8–12 words].',
      'Can I take 27 seconds to say why I thought of you — then you can tell me if it’s worth a longer chat?',
    ],
    tips: [
      'Pause after the ask; let them answer.',
      'If no trigger, swap line 2 for a peer problem: “Teams like yours often hit X — is that on your radar?”',
      'Keep total opener under 20 seconds of talk time.',
    ],
  },
  {
    kind: 'included',
    id: 'inc-reason-for-call',
    title: 'Reason-for-calling (trigger-led)',
    category: 'Cold Call',
    description: 'Answer “why me?” immediately — best when you have intent or news.',
    principle:
      'Phrasing like “the reason I’m calling is…” helps clarity; pair with one observed fact about their world.',
    variables: ['Name', 'You', 'Company', 'Trigger', 'Peer segment'],
    lines: [
      'Hi [Name], [You] from [Company].',
      'The reason I’m calling: [Trigger — hire, stack change, initiative, content].',
      'We work with [peer segment] on [outcome]. Worth ninety seconds to see if that maps to what you’re doing?',
    ],
    tips: [
      'One trigger beats ten features.',
      'Ask for 90 seconds or a calendar compare — not “a few minutes” vague.',
    ],
  },
  {
    kind: 'included',
    id: 'inc-not-interested-bridge',
    title: '“Not interested” — ten-second bridge',
    category: 'Objection',
    description: 'Stay in the conversation without arguing; earn the next sentence.',
    principle: 'Acknowledge + micro-commitment (“10 seconds”) + problem statement.',
    variables: ['You'],
    lines: [
      'Totally fair — you don’t know what we do yet.',
      'Can I take 10 seconds to name the problem we fix — then you can hang up?',
      'If it’s not relevant, I’ll get out of your way.',
    ],
    tips: ['Smile in your voice; slower pace.', 'After bridge, one sentence problem — not product.'],
  },
  {
    kind: 'included',
    id: 'inc-voicemail-hook',
    title: 'Voicemail (under 25 seconds)',
    category: 'Voicemail',
    description: 'Name, company, one outcome, callback — no feature dump.',
    principle: 'Voicemail wins on clarity + callback number + one peer proof.',
    variables: ['Name', 'You', 'Company', 'Outcome', 'Phone'],
    lines: [
      'Hi [Name], [You] from [Company].',
      'We help [peer outcome in six words]. Saw [trigger] and wanted to connect.',
      'Callback [Phone]. If this misses you, I’ll try once more Thursday — no spam.',
    ],
    tips: [
      'Repeat callback number once.',
      'End with a specific day, not “I’ll keep trying.”',
    ],
  },
  {
    kind: 'included',
    id: 'inc-gatekeeper',
    title: 'Gatekeeper — two lines',
    category: 'Cold Call',
    description: 'Respect + clarity; goal is transfer or intel.',
    principle: 'Sound like an internal colleague; avoid “decision maker” language.',
    variables: ['You', 'Company', 'Target role', 'Reason'],
    lines: [
      'Hi — [You] from [Company]. I’m trying to reach whoever owns [area] for [reason].',
      'Could you point me to the right person or tell me the best way to get on their calendar?',
    ],
    tips: ['Thank them by name if given.', 'If blocked: ask for email domain pattern or best channel.'],
  },
  {
    kind: 'included',
    id: 'inc-demo-followup',
    title: 'Post-demo silence — short follow-up',
    category: 'Follow-up',
    description: 'Reference their words from the demo; one ask.',
    principle: 'Playback their language + single next step beats generic check-in.',
    variables: ['Name', 'Their phrase', 'Next step'],
    lines: [
      'Hi [Name] — circling back from our demo.',
      'You mentioned [Their phrase]. That’s exactly where we help.',
      'Does [Next step — 15m working session / ROI pass / security summary] still make sense this week?',
    ],
    tips: ['Send calendar hold in same breath if they say yes.', 'No “just checking in.”'],
  },
  {
    kind: 'included',
    id: 'inc-peer-problem',
    title: 'Peer problem opening',
    category: 'Discovery',
    description: 'Validate pain fast before you pitch.',
    principle: '“Teams like yours” + pain + question — invites story, not pitch.',
    variables: ['Role', 'Pain', 'Name'],
    lines: [
      'Hi [Name], [You] from [Company].',
      'I talk to [Role]s every week — the headache I hear most is [Pain].',
      'Is that showing up for you, or are you in a different situation?',
    ],
    tips: ['Pick one pain, not five.', 'If no: pivot to “what would you fix first?”'],
  },
  {
    kind: 'included',
    id: 'inc-book-meeting-soft',
    title: 'Book meeting — soft calendar ask',
    category: 'Closing',
    description: 'Low-friction compare instead of ambush slot.',
    principle: 'Offer window + optional expertise — lets them opt in.',
    variables: ['Name'],
    lines: [
      'Based on what you shared, a short working session would save you back-and-forth.',
      'Are mornings or afternoons easier — or should I send two slots and you pick?',
    ],
    tips: ['If stalls: “15 minutes with our solutions engineer — worth it?”', 'Never fake scarcity.'],
  },
];

export const premiumScripts: PremiumScript[] = [
  {
    kind: 'premium',
    id: 'prem-abm-exec',
    title: 'ABM — executive opener (multi-stakeholder)',
    category: 'Cold Call',
    description: 'For enterprise when three threads matter: initiative, risk, budget.',
    principle: 'Named relevance + risk hook + optional exec sponsor language.',
    variables: ['Name', 'You', 'Company', 'Initiative', 'Risk', 'Peer'],
    lines: [
      'Hi [Name], [You] from [Company].',
      'We’re working with [Peer] on [Initiative] — the part that usually stalls is [Risk].',
      'If that’s on your plate, I’d suggest a 15-minute alignment with you and [optional role] — sound reasonable?',
    ],
    tips: ['Send one-pager after verbal yes.', 'If EA screens: use gatekeeper script first.'],
    priceUsd: 49,
    sampleCalls: 4200,
    metrics: [
      { label: 'Meeting rate (cohort)', value: '11.2%', detail: 'Similar ICP, outbound 2025–26' },
      { label: 'Connect → 2m+', value: '38%', detail: 'Stayed past discovery' },
      { label: 'Avg. talk time', value: '3m 12s', detail: 'When booked' },
    ],
  },
  {
    kind: 'premium',
    id: 'prem-competition-takeout',
    title: 'Competitive displacement — calm compare',
    category: 'Objection',
    description: 'When they love incumbent; you probe gaps.',
    principle: 'Never trash competitor — gap + proof + pilot.',
    variables: ['Name', 'Incumbent', 'Gap', 'Proof'],
    lines: [
      'Makes sense you’re on [Incumbent] — lots of teams are.',
      'Where we usually add value is [Gap] — [Proof] saw [metric] in 90 days.',
      'Open to a side-by-side on your workflow, not a pitch deck?',
    ],
    tips: ['Ask what they’d change about current setup first.', 'PilotLanguage: time-boxed proof.'],
    priceUsd: 39,
    sampleCalls: 3100,
    metrics: [
      { label: 'Pilot accept rate', value: '9.4%', detail: 'When incumbent named' },
      { label: 'Win in competitive deals', value: '34%', detail: 'Where pilot ran' },
    ],
  },
  {
    kind: 'premium',
    id: 'prem-security-intro',
    title: 'Security / procurement intro',
    category: 'Discovery',
    description: 'First call with IT or compliance — speak their language.',
    principle: 'Controls first, features second — shorten legal cycle.',
    variables: ['Name', 'Framework', 'Artifact'],
    lines: [
      'Hi [Name], [You] from [Company].',
      'We map to [Framework] and ship [Artifact] day one so legal isn’t the bottleneck.',
      'If useful, I’ll walk the controls page in 10 minutes — Tuesday or Wednesday?',
    ],
    tips: ['Offer SOC2/DPAs in follow-up email.', 'Never oversell “certified” without evidence.'],
    priceUsd: 59,
    sampleCalls: 1800,
    metrics: [
      { label: 'Sec review cycle', value: '−22%', detail: 'Vs. baseline in cohort' },
      { label: 'Technical win rate', value: '41%', detail: 'When security joined call 1' },
    ],
  },
];

export const marketplaceScripts: MarketplaceScript[] = [
  {
    kind: 'marketplace',
    id: 'mkt-saas-sdr',
    title: 'SaaS SDR — speed-to-lead call',
    category: 'Cold Call',
    description: 'Form-fill inbound in under 60 seconds; booking-first.',
    principle: 'Confirm intent source + one qualification + calendar.',
    variables: ['Name', 'Source', 'You', 'Company'],
    lines: [
      'Hi [Name], [You] from [Company] — you just [Source — downloaded / requested / trial].',
      'Quick two questions so we don’t waste your time: are you evaluating for Q this quarter or later?',
      'If this quarter, I can hold a 15m slot with our AE — Monday 10 or Tuesday 3?',
    ],
    tips: ['Mirror their form answers.', 'If later: offer nurture + one helpful asset.'],
    authorName: 'Jordan Lee',
    authorId: 'usr_jordan',
    priceUsd: 19,
    rating: 4.8,
    reviewCount: 126,
    purchases: 890,
    verifiedSeller: true,
  },
  {
    kind: 'marketplace',
    id: 'mkt-agency-retainer',
    title: 'Agency — retainer expansion',
    category: 'Closing',
    description: 'Upsell existing client on broader scope without sounding greedy.',
    principle: 'Outcome recap + scope gap + single proposal ask.',
    variables: ['Name', 'Outcome', 'Gap'],
    lines: [
      '[Name], last quarter we moved the needle on [Outcome].',
      'The next lever I see is [Gap] — we’ve packaged that as a fixed add-on so there’s no scope creep.',
      'Want me to send a one-page scope + price, or walk it live for 10 minutes?',
    ],
    tips: ['Use their KPIs from reporting.', 'Anchor to fixed package to reduce negotiation fatigue.'],
    authorName: 'Sam Rivera',
    authorId: 'usr_sam',
    priceUsd: 24,
    rating: 4.9,
    reviewCount: 54,
    purchases: 412,
    verifiedSeller: true,
  },
  {
    kind: 'marketplace',
    id: 'mkt-real-estate',
    title: 'Local services — warm intro call',
    category: 'Cold Call',
    description: 'Territory + neighbor proof — not enterprise but converts.',
    principle: 'Hyper-local credibility + non-pushy ask.',
    variables: ['Name', 'Neighborhood', 'Job'],
    lines: [
      'Hi [Name], [You] with [Company] — we’ve done a lot of [Job] in [Neighborhood].',
      'I’m not looking to sell on this call — just see if a quick estimate would help your timeline.',
      'If helpful I’ll grab your email and send two times that work on site.',
    ],
    tips: ['Name one street or landmark for trust.', 'Respect DNC and local calling rules.'],
    authorName: 'Taylor Morgan',
    authorId: 'usr_taylor',
    priceUsd: 12,
    rating: 4.6,
    reviewCount: 203,
    purchases: 1205,
    verifiedSeller: false,
  },
];

export const metricsDisclaimer =
  'Benchmarks are aggregated, anonymized cohort stats on similar playbooks — not a promise of your results. Voice, list quality, and offer drive outcomes.';
