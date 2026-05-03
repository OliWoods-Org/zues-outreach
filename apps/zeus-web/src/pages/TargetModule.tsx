import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Download,
  Filter,
  RefreshCcw,
  Search,
  Star,
  Target,
  TrendingUp,
  Upload,
  Zap,
} from 'lucide-react';

interface Lead {
  id: string;
  company: string;
  contact: string;
  title: string;
  score: number;
  source: 'Apollo' | 'Airtable' | 'Clay' | 'Manual';
  industry: string;
  status: 'new' | 'enriched' | 'contacted' | 'qualified';
  lastSeen: string;
}

const leads: Lead[] = [
  { id: 'l1', company: 'Apex Health Systems', contact: 'Sarah Chen', title: 'VP Growth', score: 94, source: 'Apollo', industry: 'Healthcare', status: 'enriched', lastSeen: '2m ago' },
  { id: 'l2', company: 'BlueStar Telehealth', contact: 'Mike Torres', title: 'CMO', score: 88, source: 'Apollo', industry: 'Telehealth', status: 'new', lastSeen: '8m ago' },
  { id: 'l3', company: 'Cascade Wellness', contact: 'Lisa Park', title: 'Director Marketing', score: 76, source: 'Airtable', industry: 'Wellness', status: 'contacted', lastSeen: '1h ago' },
  { id: 'l4', company: 'DataPoint Medical', contact: 'James Wright', title: 'CEO', score: 91, source: 'Clay', industry: 'MedTech', status: 'qualified', lastSeen: '3h ago' },
  { id: 'l5', company: 'Echo Bio Labs', contact: 'Anna Kim', title: 'Head of Revenue', score: 65, source: 'Apollo', industry: 'BioTech', status: 'new', lastSeen: '5h ago' },
  { id: 'l6', company: 'Frontier Longevity', contact: 'David Lee', title: 'VP Sales', score: 82, source: 'Manual', industry: 'Longevity', status: 'enriched', lastSeen: '1d ago' },
  { id: 'l7', company: 'GridMed Solutions', contact: 'Rachel Adams', title: 'CRO', score: 79, source: 'Apollo', industry: 'Healthcare IT', status: 'new', lastSeen: '1d ago' },
];

const icpFilters = ['All', 'Healthcare', 'Telehealth', 'MedTech', 'Wellness', 'Longevity'];

const kpis = [
  { label: 'ICP Accounts', value: '128', hint: '+12 this week', accent: '#22d3ee' },
  { label: 'New Leads Today', value: '34', hint: 'Apollo sync live', accent: '#a78bfa' },
  { label: 'Enriched', value: '89%', hint: 'Clay + Apollo', accent: '#10b981' },
  { label: 'Last Sync', value: '2m ago', hint: 'Airtable', accent: '#f59e0b' },
];

const statusMeta: Record<Lead['status'], { label: string; cls: string }> = {
  new: { label: 'New', cls: 'bg-zinc-700/60 text-zinc-300' },
  enriched: { label: 'Enriched', cls: 'bg-teal-500/10 text-teal-300' },
  contacted: { label: 'Contacted', cls: 'bg-violet-500/10 text-violet-300' },
  qualified: { label: 'Qualified', cls: 'bg-emerald-500/10 text-emerald-300' },
};

function ScorePip({ score }: { score: number }) {
  const color = score >= 85 ? 'text-emerald-400' : score >= 70 ? 'text-amber-400' : 'text-zinc-400';
  return (
    <span className={`tabular-nums font-semibold ${color}`}>
      {score}
    </span>
  );
}

export function TargetModule() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = leads.filter(l => {
    const matchIndustry = activeFilter === 'All' || l.industry === activeFilter;
    const matchSearch =
      !searchQuery ||
      l.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.contact.toLowerCase().includes(searchQuery.toLowerCase());
    return matchIndustry && matchSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl w-full min-w-0">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-teal-500/20 zeus-mesh-hero px-4 py-6 sm:px-6 md:px-8 md:py-7">
        <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 opacity-25 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.5),transparent_70%)]" />
        <div className="relative flex items-start gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-teal-400/30 bg-teal-500/10 text-teal-200">
            <Target className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-400/90">ICP Engine</p>
            <h1 className="text-2xl md:text-3xl font-semibold text-white mt-1 tracking-tight">Target</h1>
            <p className="text-zinc-400 text-sm mt-1.5 leading-relaxed max-w-2xl">
              ICP definitions, Apollo lists, lead scoring, and Airtable pipeline — the top of every revenue funnel.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300 hover:bg-white/10 transition-colors">
              <RefreshCcw className="w-3 h-3" /> Sync Apollo
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-teal-500/30 bg-teal-500/10 px-3 py-1.5 text-xs text-teal-300 hover:bg-teal-500/20 transition-colors">
              <Upload className="w-3 h-3" /> Push to Airtable
            </button>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {kpis.map(k => (
          <div key={k.label} className="siren-card p-5 relative overflow-hidden glass-panel">
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ backgroundColor: k.accent }} />
            <p className="text-[11px] text-zinc-500 uppercase tracking-wider mb-2">{k.label}</p>
            <p className="text-2xl font-semibold text-white">{k.value}</p>
            <p className="text-[11px] text-zinc-600 mt-1">{k.hint}</p>
          </div>
        ))}
      </div>

      {/* ICP Profiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { name: 'Growth-Stage B2B SaaS', accounts: 48, avgScore: 87, icon: '🚀' },
          { name: 'Telehealth / MedTech', accounts: 34, avgScore: 91, icon: '🏥' },
          { name: 'Longevity & Wellness', accounts: 46, avgScore: 78, icon: '⚡' },
        ].map(profile => (
          <div
            key={profile.name}
            className="rounded-xl border border-white/[0.07] bg-[rgba(12,14,22,0.85)] p-4 hover:border-teal-500/25 transition-colors cursor-pointer shadow-[inset_4px_0_0_0_rgba(34,211,238,0.3)]"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg">{profile.icon}</span>
              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                Avg {profile.avgScore}
              </span>
            </div>
            <p className="text-sm font-medium text-white">{profile.name}</p>
            <p className="text-[11px] text-zinc-500 mt-1">{profile.accounts} accounts</p>
          </div>
        ))}
      </div>

      {/* Lead Table */}
      <div className="siren-card glass-panel overflow-hidden">
        {/* Table Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Search className="w-4 h-4 text-zinc-500 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search leads…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-600 outline-none min-w-0"
            />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <Filter className="w-3.5 h-3.5 text-zinc-500" />
            {icpFilters.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  activeFilter === f
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                    : 'bg-white/[0.03] text-zinc-500 border border-white/[0.06] hover:text-zinc-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <button className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors ml-auto flex-shrink-0">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>

        {/* Header Row */}
        <div className="grid grid-cols-[1fr_160px_80px_100px_100px_100px] gap-4 px-5 py-3 border-b border-white/[0.06] text-[11px] text-zinc-600 uppercase tracking-wider min-w-[700px]">
          <span>Company / Contact</span>
          <span>Title</span>
          <span>Score</span>
          <span>Source</span>
          <span>Status</span>
          <span>Seen</span>
        </div>

        {/* Rows */}
        <div className="min-w-[700px] overflow-x-auto">
          {filtered.map(lead => (
            <div
              key={lead.id}
              className="grid grid-cols-[1fr_160px_80px_100px_100px_100px] gap-4 px-5 py-3.5 border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors items-center group"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{lead.company}</p>
                <p className="text-[11px] text-zinc-500 truncate">{lead.contact}</p>
              </div>
              <span className="text-[12px] text-zinc-400 truncate">{lead.title}</span>
              <span>
                <ScorePip score={lead.score} />
              </span>
              <span className="text-[11px] text-zinc-500">{lead.source}</span>
              <span>
                <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusMeta[lead.status].cls}`}>
                  {statusMeta[lead.status].label}
                </span>
              </span>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-zinc-600">{lead.lastSeen}</span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-700 group-hover:text-teal-400 transition-colors opacity-0 group-hover:opacity-100" />
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="px-5 py-10 text-center text-zinc-600 text-sm">No leads match your filters.</div>
          )}
        </div>
      </div>

      {/* Footer links */}
      <div className="flex flex-wrap gap-4">
        <Link to="/engage" className="inline-flex items-center gap-1.5 text-sm text-teal-400 hover:text-teal-300">
          Send to Engage sequences <ArrowRight className="w-4 h-4" />
        </Link>
        <Link to="/pipeline" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white">
          View Pipeline <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
