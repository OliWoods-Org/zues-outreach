import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  ExternalLink,
  RefreshCcw,
  TrendingUp,
  Users,
} from 'lucide-react';
import { deals, pipelineStats } from '../data/deals';

const kpis = [
  { label: 'HubSpot Contacts', value: '1,240', hint: '↑ 28 synced today', accent: '#f97316' },
  { label: 'Meetings Booked', value: '22', hint: 'This week', accent: '#22d3ee' },
  { label: 'Avg Stage Velocity', value: '4.2d', hint: 'Lead → close', accent: '#a78bfa' },
  { label: 'Pipeline Value', value: `$${(pipelineStats.totalValue / 1000).toFixed(0)}K`, hint: `${pipelineStats.totalDeals} active deals`, accent: '#10b981' },
];

const stageGroups = [
  { stage: 'Lead', color: 'bg-zinc-600', textColor: 'text-zinc-300', accent: 'rgba(113,113,122,0.3)' },
  { stage: 'Qualified', color: 'bg-blue-500', textColor: 'text-blue-300', accent: 'rgba(59,130,246,0.2)' },
  { stage: 'Proposal', color: 'bg-violet-500', textColor: 'text-violet-300', accent: 'rgba(139,92,246,0.2)' },
  { stage: 'Negotiation', color: 'bg-amber-500', textColor: 'text-amber-300', accent: 'rgba(245,158,11,0.2)' },
  { stage: 'Closed', color: 'bg-emerald-500', textColor: 'text-emerald-300', accent: 'rgba(16,185,129,0.2)' },
];

const syncLog = [
  { event: 'Contact synced', detail: 'Sarah Chen → HubSpot', time: '1m ago', type: 'sync' },
  { event: 'Deal updated', detail: 'Apex Industries → Negotiation', time: '8m ago', type: 'deal' },
  { event: 'Meeting booked', detail: 'Contour AI · Calendly', time: '22m ago', type: 'meeting' },
  { event: 'Contact synced', detail: 'James Wright → HubSpot', time: '1h ago', type: 'sync' },
  { event: 'Stage moved', detail: 'DataFlow Inc → Closed', time: '2h ago', type: 'deal' },
];

export function ConvertModule() {
  return (
    <div className="space-y-6 max-w-7xl w-full min-w-0">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 zeus-mesh-hero px-4 py-6 sm:px-6 md:px-8 md:py-7">
        <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 opacity-25 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.5),transparent_70%)]" />
        <div className="relative flex items-start gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-500/10 text-amber-200">
            <TrendingUp className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-400/90">CRM Sync</p>
            <h1 className="text-2xl md:text-3xl font-semibold text-white mt-1 tracking-tight">Convert</h1>
            <p className="text-zinc-400 text-sm mt-1.5 leading-relaxed max-w-2xl">
              HubSpot sync, meetings booked, pipeline stages — every engaged lead moves to revenue here.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300 hover:bg-white/10 transition-colors">
              <RefreshCcw className="w-3 h-3" /> Sync HubSpot
            </button>
            <a
              href="#"
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs text-amber-300 hover:bg-amber-500/20 transition-colors"
            >
              <ExternalLink className="w-3 h-3" /> Open HubSpot
            </a>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Pipeline board (compact) */}
        <div className="lg:col-span-2 siren-card glass-panel overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
            <h3 className="text-xs text-zinc-500 uppercase tracking-wider">Active Deals by Stage</h3>
            <Link to="/pipeline" className="text-[11px] text-zinc-600 hover:text-teal-400 flex items-center gap-1">
              Full pipeline <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {stageGroups.map(sg => {
            const stageDeals = deals.filter(d => d.stage === sg.stage);
            if (stageDeals.length === 0) return null;
            return (
              <div key={sg.stage} className="border-b border-white/[0.04] last:border-none">
                <div
                  className="flex items-center justify-between px-5 py-2"
                  style={{ backgroundColor: sg.accent }}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${sg.color}`} />
                    <span className={`text-[11px] font-semibold uppercase tracking-wider ${sg.textColor}`}>
                      {sg.stage}
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-500">
                    ${stageDeals.reduce((s, d) => s + d.value, 0).toLocaleString()}
                  </span>
                </div>
                {stageDeals.map(deal => (
                  <div
                    key={deal.id}
                    className="grid grid-cols-[1fr_100px_100px] gap-4 px-5 py-2.5 hover:bg-white/[0.025] transition-colors items-center"
                  >
                    <div>
                      <p className="text-sm text-white truncate">{deal.company}</p>
                      <p className="text-[11px] text-zinc-500 truncate">{deal.contact}</p>
                    </div>
                    <span className="text-sm font-medium text-white">${(deal.value / 1000).toFixed(0)}K</span>
                    <span className="text-[11px] text-zinc-500 truncate">{deal.lastActivity}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* Sync log + meeting feed */}
        <div className="flex flex-col gap-4">
          {/* HubSpot sync status */}
          <div className="siren-card glass-panel p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-zinc-500 uppercase tracking-wider">HubSpot Sync</span>
              <span className="ml-auto text-[11px] text-emerald-400 font-medium">Connected</span>
            </div>
            <div className="space-y-1.5">
              {[
                { label: 'Contacts synced', value: '1,240' },
                { label: 'Deals in HubSpot', value: '23' },
                { label: 'Last sync', value: '1m ago' },
                { label: 'Next auto-sync', value: '5m' },
              ].map(row => (
                <div key={row.label} className="flex justify-between text-xs">
                  <span className="text-zinc-600">{row.label}</span>
                  <span className="text-zinc-300 font-medium tabular-nums">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div className="siren-card glass-panel p-5 flex-1">
            <h3 className="text-xs text-zinc-500 uppercase tracking-wider mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {syncLog.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex-shrink-0">
                    {item.type === 'meeting' ? (
                      <Calendar className="w-3.5 h-3.5 text-teal-400" />
                    ) : item.type === 'deal' ? (
                      <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <RefreshCcw className="w-3.5 h-3.5 text-violet-400" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[12px] text-white">{item.event}</p>
                    <p className="text-[11px] text-zinc-500 truncate">{item.detail}</p>
                  </div>
                  <span className="text-[10px] text-zinc-600 flex-shrink-0 ml-auto">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap gap-4">
        <Link to="/report" className="inline-flex items-center gap-1.5 text-sm text-amber-400 hover:text-amber-300">
          View KPI Report <ArrowRight className="w-4 h-4" />
        </Link>
        <Link to="/pipeline" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white">
          Full Pipeline view <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
