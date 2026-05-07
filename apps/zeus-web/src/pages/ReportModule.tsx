import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart2,
  Download,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { funnelSnapshot, campaigns, weeklyKpis } from '../data/operations';
import { pipelineStats } from '../data/deals';

const dateRanges = ['7d', '14d', '30d', '90d'] as const;
type DateRange = typeof dateRanges[number];

const kpis = [
  { label: 'Connect Rate', value: `${funnelSnapshot.connectRate}%`, delta: '+2.3%', up: true, accent: '#22d3ee', detail: 'Connects ÷ dials (rolling 7d)' },
  { label: 'Meetings Booked', value: funnelSnapshot.meetings.toString(), delta: '+11%', up: true, accent: '#a78bfa', detail: 'vs prior period' },
  { label: 'Win Rate', value: `${pipelineStats.winRate}%`, delta: '-1.2%', up: false, accent: '#f59e0b', detail: 'Closed won ÷ total' },
  { label: 'Pipeline Value', value: `$${(pipelineStats.totalValue / 1000).toFixed(0)}K`, delta: '+$48K', up: true, accent: '#10b981', detail: `${pipelineStats.totalDeals} active deals` },
];

const funnelStages = [
  { label: 'Dials', value: funnelSnapshot.dials },
  { label: 'Connects', value: funnelSnapshot.connects },
  { label: 'Qualified', value: funnelSnapshot.qualified },
  { label: 'Meetings', value: funnelSnapshot.meetings },
];

const socialKpis = [
  { platform: 'X / Twitter', posts: 14, impressions: '42.8K', engagement: '3.4%', icon: '𝕏' },
  { platform: 'LinkedIn', posts: 8, impressions: '18.3K', engagement: '5.1%', icon: 'in' },
  { platform: 'Threads', posts: 6, impressions: '9.2K', engagement: '2.8%', icon: '🧵' },
];

export function ReportModule() {
  const [range, setRange] = useState<DateRange>('7d');

  return (
    <div className="space-y-6 max-w-7xl w-full min-w-0">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-teal-500/20 zeus-mesh-hero px-4 py-6 sm:px-6 md:px-8 md:py-7">
        <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 opacity-25 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.5),transparent_70%)]" />
        <div className="relative flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-teal-400/30 bg-teal-500/10 text-teal-200">
              <BarChart2 className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-400/90">KPI Lens</p>
              <h1 className="text-2xl md:text-3xl font-semibold text-white mt-1 tracking-tight">Report</h1>
              <p className="text-zinc-400 text-sm mt-1.5 leading-relaxed max-w-2xl">
                Unified campaign, voice, and social metrics — one lens to optimize across every channel.
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
            {dateRanges.map(r => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  range === r
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                    : 'bg-white/[0.04] text-zinc-500 border border-white/[0.07] hover:text-zinc-300'
                }`}
              >
                {r}
              </button>
            ))}
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300 hover:bg-white/10 transition-colors ml-1">
              <Download className="w-3 h-3" /> Export
            </button>
          </div>
        </div>
      </div>

      {/* KPI tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {kpis.map(k => (
          <div key={k.label} className="siren-card p-5 relative overflow-hidden glass-panel">
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ backgroundColor: k.accent }} />
            <p className="text-[11px] text-zinc-500 uppercase tracking-wider mb-2">{k.label}</p>
            <p className="text-2xl font-semibold text-white">{k.value}</p>
            <div className="flex items-center gap-1 mt-1">
              {k.up ? (
                <TrendingUp className="w-3 h-3 text-emerald-400" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-400" />
              )}
              <span className={`text-[11px] font-medium ${k.up ? 'text-emerald-400' : 'text-red-400'}`}>
                {k.delta}
              </span>
              <span className="text-[11px] text-zinc-600">{k.detail}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Funnel visualization */}
        <div className="lg:col-span-2 siren-card glass-panel p-6">
          <h3 className="text-xs text-zinc-500 uppercase tracking-wider mb-6">Funnel Volume — {range}</h3>
          <div className="space-y-4">
            {funnelStages.map((stage, i) => {
              const pct = i === 0 ? 100 : (stage.value / funnelStages[0].value) * 100;
              return (
                <div key={stage.label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-zinc-500">{stage.label}</span>
                    <span className="text-white tabular-nums font-medium">{stage.value.toLocaleString()}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-teal-500/80 to-teal-400/60"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  {i < funnelStages.length - 1 && (
                    <p className="text-[10px] text-zinc-600 mt-1 text-right">
                      {((funnelStages[i + 1].value / stage.value) * 100).toFixed(1)}% →
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly trend mini-chart */}
        <div className="lg:col-span-3 siren-card glass-panel p-6">
          <h3 className="text-xs text-zinc-500 uppercase tracking-wider mb-6">Weekly Meetings Booked</h3>
          <div className="flex items-end gap-2 h-28">
            {weeklyKpis.days.map((day, i) => {
              const val = weeklyKpis.meetingsBooked[i];
              const max = Math.max(...weeklyKpis.meetingsBooked);
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-1 group">
                  <span className="text-[10px] text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity">{val}</span>
                  <div
                    className="w-full rounded-t-sm bg-gradient-to-t from-teal-600/60 to-teal-400/40 hover:from-teal-500/80 hover:to-teal-300/60 transition-colors cursor-default"
                    style={{ height: `${(val / max) * 100}%` }}
                  />
                  <span className="text-[9px] text-zinc-600">{day}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Campaign performance table */}
      <div className="siren-card glass-panel overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06]">
          <h3 className="text-xs text-zinc-500 uppercase tracking-wider">Campaign Performance</h3>
        </div>
        <div className="min-w-[600px] overflow-x-auto">
          <div className="grid grid-cols-[1fr_80px_100px_100px_100px_100px] gap-4 px-5 py-3 border-b border-white/[0.06] text-[11px] text-zinc-600 uppercase tracking-wider">
            <span>Campaign</span>
            <span>Status</span>
            <span>Dials</span>
            <span>Connects</span>
            <span>Meetings</span>
            <span>Rate</span>
          </div>
          {campaigns.map(c => (
            <div
              key={c.id}
              className="grid grid-cols-[1fr_80px_100px_100px_100px_100px] gap-4 px-5 py-3.5 border-b border-white/[0.04] hover:bg-white/[0.025] items-center transition-colors"
            >
              <span className="text-sm text-white truncate">{c.name}</span>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full w-fit ${
                  c.status === 'live'
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : c.status === 'paused'
                    ? 'bg-amber-500/10 text-amber-400'
                    : 'bg-zinc-700/60 text-zinc-400'
                }`}
              >
                {c.status}
              </span>
              <span className="text-sm text-white tabular-nums">{c.dialsToday.toLocaleString()}</span>
              <span className="text-sm text-white tabular-nums">{c.connects.toLocaleString()}</span>
              <span className="text-sm text-white tabular-nums">{c.meetingsBooked}</span>
              <span className="text-sm text-zinc-400 tabular-nums">
                {c.dialsToday > 0 ? `${((c.meetingsBooked / c.dialsToday) * 100).toFixed(1)}%` : '—'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Social metrics */}
      <div className="siren-card glass-panel p-6">
        <h3 className="text-xs text-zinc-500 uppercase tracking-wider mb-5">Social Reach — {range}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {socialKpis.map(s => (
            <div key={s.platform} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg font-bold text-white">{s.icon}</span>
                <span className="text-sm text-zinc-300">{s.platform}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Posts', value: s.posts },
                  { label: 'Impressions', value: s.impressions },
                  { label: 'Eng Rate', value: s.engagement },
                ].map(m => (
                  <div key={m.label}>
                    <p className="text-[10px] text-zinc-600 uppercase tracking-wider">{m.label}</p>
                    <p className="text-sm font-semibold text-white">{m.value}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap gap-4">
        <Link to="/analytics" className="inline-flex items-center gap-1.5 text-sm text-teal-400 hover:text-teal-300">
          Deep analytics <ArrowRight className="w-4 h-4" />
        </Link>
        <Link to="/briefings" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white">
          AI briefings <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
