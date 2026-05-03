/**
 * Zeus — Competitor Intel
 * MAMA Marketplace addon: competitor-intel
 * Shows traffic snapshots sourced from the Eckleberg competitor-intel worker (Airtable).
 * Gated by addon status: trial/active = full access; locked = upgrade wall.
 */

import { useState } from 'react';
import { MARKETPLACE_ADDONS, MOCK_WORKSPACE_ADDONS } from '../data/marketplace';

type Product = 'lt' | 'cf';
type Metric = 'rank' | 'visits' | 'bounce';

interface CompetitorRow {
  id: string;
  name: string;
  domain: string;
  product: Product;
  category: string;
  globalRank: number | null;
  monthlyVisits: string;
  bounceRate: string;
  pagesPerVisit: string;
  avgDuration: string;
  trafficSplit: { direct: string; search: string; social: string; referral: string };
  topCountry: string;
  trend: 'up' | 'down' | 'flat';
  lastScraped: string;
}

const MOCK_DATA: CompetitorRow[] = [
  {
    id: 'fora',
    name: 'Fora Travel',
    domain: 'foratravel.com',
    product: 'lt',
    category: 'Luxury travel agency',
    globalRank: 184200,
    monthlyVisits: '410K',
    bounceRate: '48.2%',
    pagesPerVisit: '3.8',
    avgDuration: '2:54',
    trafficSplit: { direct: '38%', search: '44%', social: '9%', referral: '9%' },
    topCountry: 'United States',
    trend: 'up',
    lastScraped: '2h ago',
  },
  {
    id: 'embark',
    name: 'Embark Beyond',
    domain: 'embarkbeyond.com',
    product: 'lt',
    category: 'Luxury travel',
    globalRank: 892400,
    monthlyVisits: '89K',
    bounceRate: '61.4%',
    pagesPerVisit: '2.1',
    avgDuration: '1:42',
    trafficSplit: { direct: '52%', search: '31%', social: '11%', referral: '6%' },
    topCountry: 'United States',
    trend: 'flat',
    lastScraped: '2h ago',
  },
  {
    id: 'indagare',
    name: 'Indagare',
    domain: 'indagare.com',
    product: 'lt',
    category: 'Luxury travel club',
    globalRank: 620300,
    monthlyVisits: '142K',
    bounceRate: '55.7%',
    pagesPerVisit: '2.9',
    avgDuration: '2:18',
    trafficSplit: { direct: '44%', search: '39%', social: '8%', referral: '9%' },
    topCountry: 'United States',
    trend: 'down',
    lastScraped: '2h ago',
  },
  {
    id: 'devin',
    name: 'Devin AI',
    domain: 'devin.ai',
    product: 'cf',
    category: 'AI software engineer',
    globalRank: 28400,
    monthlyVisits: '3.2M',
    bounceRate: '42.1%',
    pagesPerVisit: '4.6',
    avgDuration: '3:47',
    trafficSplit: { direct: '29%', search: '51%', social: '14%', referral: '6%' },
    topCountry: 'United States',
    trend: 'up',
    lastScraped: '2h ago',
  },
  {
    id: 'bolt',
    name: 'Bolt.new',
    domain: 'bolt.new',
    product: 'cf',
    category: 'AI app builder',
    globalRank: 4200,
    monthlyVisits: '18.4M',
    bounceRate: '38.6%',
    pagesPerVisit: '5.9',
    avgDuration: '5:12',
    trafficSplit: { direct: '24%', search: '55%', social: '16%', referral: '5%' },
    topCountry: 'United States',
    trend: 'up',
    lastScraped: '2h ago',
  },
  {
    id: 'lovable',
    name: 'Lovable',
    domain: 'lovable.dev',
    product: 'cf',
    category: 'AI app builder',
    globalRank: 8100,
    monthlyVisits: '9.8M',
    bounceRate: '40.3%',
    pagesPerVisit: '5.1',
    avgDuration: '4:38',
    trafficSplit: { direct: '22%', search: '58%', social: '13%', referral: '7%' },
    topCountry: 'United States',
    trend: 'up',
    lastScraped: '2h ago',
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function TrendBadge({ trend }: { trend: 'up' | 'down' | 'flat' }) {
  if (trend === 'up')
    return <span className="text-emerald-400 text-xs">↑</span>;
  if (trend === 'down')
    return <span className="text-rose-400 text-xs">↓</span>;
  return <span className="text-zinc-600 text-xs">—</span>;
}

function SourceBar({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  const pct = parseFloat(value) || 0;
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-zinc-600 w-14 flex-shrink-0">{label}</span>
      <div className="flex-1 h-1 bg-white/[0.04] rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-[10px] text-zinc-500 w-8 text-right">{value}</span>
    </div>
  );
}

function CompetitorCard({ row }: { row: CompetitorRow }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-[#0a0a14] rounded-lg border border-white/[0.04] overflow-hidden">
      <div
        className="flex items-center gap-4 p-4 cursor-pointer hover:bg-white/[0.01] transition-all"
        onClick={() => setExpanded(e => !e)}
      >
        {/* Name + domain */}
        <div className="min-w-[160px]">
          <p className="text-[13px] text-white font-medium flex items-center gap-1.5">
            {row.name} <TrendBadge trend={row.trend} />
          </p>
          <p className="text-[11px] text-zinc-600 mt-0.5">{row.domain}</p>
        </div>

        {/* Global rank */}
        <div className="min-w-[90px]">
          <p className="text-[11px] text-zinc-600 mb-0.5">Global rank</p>
          <p className="text-sm font-mono text-zinc-300">
            #{row.globalRank?.toLocaleString() ?? '—'}
          </p>
        </div>

        {/* Monthly visits */}
        <div className="min-w-[90px]">
          <p className="text-[11px] text-zinc-600 mb-0.5">Monthly visits</p>
          <p className="text-sm font-semibold text-white">{row.monthlyVisits}</p>
        </div>

        {/* Bounce */}
        <div className="min-w-[80px]">
          <p className="text-[11px] text-zinc-600 mb-0.5">Bounce</p>
          <p className="text-sm text-zinc-300">{row.bounceRate}</p>
        </div>

        {/* Pages / visit */}
        <div className="min-w-[80px]">
          <p className="text-[11px] text-zinc-600 mb-0.5">Pages/visit</p>
          <p className="text-sm text-zinc-300">{row.pagesPerVisit}</p>
        </div>

        {/* Avg duration */}
        <div className="min-w-[80px]">
          <p className="text-[11px] text-zinc-600 mb-0.5">Avg duration</p>
          <p className="text-sm text-zinc-300">{row.avgDuration}</p>
        </div>

        {/* Top country */}
        <div className="min-w-[120px]">
          <p className="text-[11px] text-zinc-600 mb-0.5">Top country</p>
          <p className="text-sm text-zinc-300">{row.topCountry}</p>
        </div>

        {/* Scraped */}
        <div className="ml-auto text-[10px] text-zinc-700">{row.lastScraped}</div>

        <span className="text-zinc-700 text-xs ml-2">{expanded ? '▲' : '▼'}</span>
      </div>

      {expanded && (
        <div className="border-t border-white/[0.04] px-4 py-4">
          <p className="text-[10px] uppercase tracking-wider text-zinc-700 mb-3">Traffic sources</p>
          <div className="space-y-2 max-w-xs">
            <SourceBar label="Direct" value={row.trafficSplit.direct} color="#60a5fa" />
            <SourceBar label="Search" value={row.trafficSplit.search} color="#34d399" />
            <SourceBar label="Social" value={row.trafficSplit.social} color="#f59e0b" />
            <SourceBar label="Referral" value={row.trafficSplit.referral} color="#a78bfa" />
          </div>
        </div>
      )}
    </div>
  );
}

function UpgradeWall({ addon }: { addon: (typeof MARKETPLACE_ADDONS)[number] }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div
        className="text-5xl mb-5 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto"
        style={{ backgroundColor: `${addon.accentColor}18`, border: `1px solid ${addon.accentColor}30` }}
      >
        {addon.icon}
      </div>
      <h2 className="text-xl font-semibold text-white mb-2">{addon.name}</h2>
      <p className="text-sm text-zinc-500 max-w-md mb-2">{addon.description}</p>
      <p className="text-xs text-zinc-600 mb-8">
        {addon.trialDays}-day free trial · then {addon.priceLabel}
      </p>

      <div className="grid grid-cols-2 gap-2 max-w-sm mb-8 text-left">
        {addon.features.map(f => (
          <div key={f} className="flex items-start gap-2">
            <span className="text-emerald-400 text-xs mt-0.5 flex-shrink-0">✓</span>
            <span className="text-[12px] text-zinc-400">{f}</span>
          </div>
        ))}
      </div>

      <button
        className="px-8 py-2.5 rounded-lg text-sm font-semibold text-white transition-all"
        style={{
          background: `linear-gradient(135deg, ${addon.accentColor}, ${addon.accentColor}bb)`,
          boxShadow: `0 4px 24px ${addon.accentColor}40`,
        }}
      >
        Start {addon.trialDays}-day free trial
      </button>

      <p className="text-[10px] text-zinc-700 mt-3">
        Powered by {addon.poweredBy.join(' · ')}
      </p>
    </div>
  );
}

function TrialBanner({ daysLeft }: { daysLeft: number }) {
  return (
    <div className="mb-6 px-4 py-3 rounded-lg bg-indigo-500/8 border border-indigo-400/20 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-indigo-400 text-sm">🔭</span>
        <span className="text-sm text-indigo-300 font-medium">
          Free trial — {daysLeft} days remaining
        </span>
        <span className="text-xs text-zinc-500">· then $29/mo</span>
      </div>
      <button className="text-xs px-3 py-1 rounded border border-indigo-400/30 text-indigo-400 hover:bg-indigo-400/10 transition-all">
        Upgrade now
      </button>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export function CompetitorIntel() {
  const addon = MARKETPLACE_ADDONS.find(a => a.id === 'competitor-intel')!;
  const status = MOCK_WORKSPACE_ADDONS['competitor-intel'];
  const [product, setProduct] = useState<'all' | Product>('all');
  const [sortBy, setSortBy] = useState<Metric>('rank');

  if (status === 'locked') {
    return <UpgradeWall addon={addon} />;
  }

  const filtered = MOCK_DATA
    .filter(r => product === 'all' || r.product === product)
    .sort((a, b) => {
      if (sortBy === 'rank') return (a.globalRank ?? 999999999) - (b.globalRank ?? 999999999);
      if (sortBy === 'visits') {
        const parse = (v: string) =>
          v.includes('M') ? parseFloat(v) * 1e6 : v.includes('K') ? parseFloat(v) * 1e3 : parseFloat(v);
        return parse(b.monthlyVisits) - parse(a.monthlyVisits);
      }
      return parseFloat(a.bounceRate) - parseFloat(b.bounceRate);
    });

  const SELECT =
    'bg-white/[0.03] border border-white/[0.07] rounded-md text-[12px] text-zinc-400 px-3 py-1.5 focus:outline-none focus:border-indigo-400/40 cursor-pointer hover:text-white transition-all';

  return (
    <div>
      {status === 'trial' && <TrialBanner daysLeft={11} />}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Competitors tracked', value: MOCK_DATA.length, color: '#6366f1' },
          { label: 'Avg global rank', value: '#' + Math.round(MOCK_DATA.filter(r => r.globalRank).reduce((s, r) => s + r.globalRank!, 0) / MOCK_DATA.filter(r => r.globalRank).length).toLocaleString(), color: '#f59e0b' },
          { label: 'Last scraped', value: '2h ago', color: '#34d399' },
          { label: 'Next scrape', value: 'Sun 9 AM', color: '#60a5fa' },
        ].map(s => (
          <div
            key={s.label}
            className="bg-[#0a0a14] rounded-lg border border-white/[0.04] p-4"
            style={{ borderTop: `1px solid ${s.color}30` }}
          >
            <p className="text-[11px] text-zinc-600 mb-2 uppercase tracking-wider">{s.label}</p>
            <p className="text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5">
        <select value={product} onChange={e => setProduct(e.target.value as 'all' | Product)} className={SELECT}>
          <option value="all">All products</option>
          <option value="lt">LuxuryTravels</option>
          <option value="cf">CoFounder</option>
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value as Metric)} className={SELECT}>
          <option value="rank">Sort: Global rank</option>
          <option value="visits">Sort: Monthly visits</option>
          <option value="bounce">Sort: Bounce rate</option>
        </select>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[10px] text-zinc-700 uppercase tracking-wider">Powered by</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-white/[0.03] text-zinc-600 border border-white/[0.06]">
            Firecrawl → Airtable
          </span>
        </div>
      </div>

      {/* Table header */}
      <div className="flex items-center gap-4 px-4 mb-2 text-[10px] uppercase tracking-wider text-zinc-700">
        <span className="min-w-[160px]">Competitor</span>
        <span className="min-w-[90px]">Global rank</span>
        <span className="min-w-[90px]">Monthly visits</span>
        <span className="min-w-[80px]">Bounce</span>
        <span className="min-w-[80px]">Pages/visit</span>
        <span className="min-w-[80px]">Avg duration</span>
        <span className="min-w-[120px]">Top country</span>
      </div>

      {/* Rows */}
      <div className="space-y-2">
        {filtered.map(row => (
          <CompetitorCard key={row.id} row={row} />
        ))}
      </div>

      {/* Add competitor */}
      <div className="mt-6 flex items-center gap-3">
        <input
          type="text"
          placeholder="Add competitor domain (e.g. competitor.com)"
          className="flex-1 bg-white/[0.02] border border-white/[0.06] rounded-lg text-[13px] text-white px-4 py-2.5 placeholder:text-zinc-700 focus:outline-none focus:border-indigo-400/30"
        />
        <button className="px-5 py-2.5 rounded-lg text-[13px] text-white border border-indigo-400/30 bg-indigo-500/8 hover:bg-indigo-500/15 transition-all">
          + Add
        </button>
      </div>
      <p className="text-[10px] text-zinc-700 mt-2">
        Scrapes SimilarWeb public data — no API key required. Up to 20 domains on this plan.
      </p>
    </div>
  );
}
