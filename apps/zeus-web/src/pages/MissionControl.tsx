import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  BookOpen,
  Ear,
  Gauge,
  LayoutGrid,
  Megaphone,
  Phone,
  Radio,
  Shield,
  Sparkles,
  X,
} from 'lucide-react';
import { MissionKpiCharts } from '../components/MissionKpiCharts';
import { ZeusGrowthPulse } from '../components/ZeusGrowthPulse';
import { ZeusIntelFeed } from '../components/ZeusIntelFeed';
import { ZeusMissionHero } from '../components/ZeusMissionHero';
import { MissionControlAssistant } from '../components/MissionControlAssistant';
import { pipelineStats } from '../data/deals';
import { MARKETPLACE_CREATOR_SHARE_PERCENT } from '../constants/marketplace';
import {
  activeCalls,
  activityFeed,
  campaigns,
  numberHealth,
  usage,
  workspace,
  zeusSignals,
} from '../data/operations';

const quickStats = [
  { label: 'Open pipeline', value: `$${(pipelineStats.totalValue / 1000).toFixed(0)}K`, href: '/pipeline', hint: 'Deals' },
  { label: 'Win rate', value: `${pipelineStats.winRate}%`, href: '/pipeline', hint: 'Trend' },
  { label: 'ICP accounts', value: '128', href: '/target', hint: 'Target' },
];

export function MissionControl() {
  const [onboardingDismissed, setOnboardingDismissed] = useState(() => {
    if (localStorage.getItem('zeus-onboarding-dismiss') === '1') return true;
    if (localStorage.getItem('siren-onboarding-dismiss') === '1') return true;
    return false;
  });
  const pct = Math.min(100, Math.round((usage.voiceMinutesUsed / usage.voiceMinutesIncluded) * 100));
  const liveCampaigns = campaigns.filter(c => c.status === 'live').length;

  const dismissOnboarding = () => {
    localStorage.setItem('zeus-onboarding-dismiss', '1');
    setOnboardingDismissed(true);
  };

  const checklistItems = [
    { id: 'c1', label: 'Connect Airtable base & PAT', done: false, href: '/settings' },
    { id: 'c2', label: 'Run Listen → tiered TrendPosts', done: false, href: '/listen' },
    { id: 'c3', label: 'Approve first Publish row', done: false, href: '/publish' },
    { id: 'c4', label: 'Launch outbound campaign', done: true, href: '/campaigns' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl w-full min-w-0">
      <ZeusMissionHero />

      <MissionControlAssistant />

      <ZeusGrowthPulse />

      <MissionKpiCharts />

      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.2em] text-teal-500/80 mb-2">Command center</p>
          <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">Mission Control</h2>
          <p className="text-sm text-zinc-500 mt-2 max-w-xl leading-relaxed">
            {workspace.name} — Growth OS telemetry plus dial execution, marketplace, and Guard in one shell (not a
            voice-only CRM).
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 w-full lg:w-auto">
          <Link
            to="/listen"
            className="inline-flex items-center justify-center gap-2 min-h-10 px-4 py-2.5 rounded-xl zeus-cta-surge text-sm font-semibold shrink-0"
          >
            <Ear className="w-4 h-4 shrink-0" />
            Listen
          </Link>
          <Link
            to="/campaigns"
            className="inline-flex items-center justify-center gap-2 min-h-10 px-4 py-2.5 rounded-lg btn-primary-railway text-sm font-semibold shrink-0"
          >
            <Megaphone className="w-4 h-4 shrink-0" />
            Campaigns
          </Link>
          <Link
            to="/scripts"
            className="inline-flex items-center justify-center gap-2 min-h-10 px-4 py-2.5 rounded-lg bg-white/[0.06] text-white text-sm font-medium hover:bg-white/[0.1] border border-white/[0.1] shrink-0"
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            Scripts
          </Link>
        </div>
      </div>

      {!onboardingDismissed && (
        <div className="relative rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-950/30 to-transparent p-5 shadow-[inset_0_1px_0_0_rgba(167,139,250,0.15)]">
          <button
            type="button"
            onClick={dismissOnboarding}
            className="absolute top-2 right-2 sm:top-3 sm:right-3 min-h-10 min-w-10 inline-flex items-center justify-center rounded-lg text-zinc-600 hover:text-white hover:bg-white/5"
            aria-label="Dismiss onboarding"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 text-violet-300 mb-3">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Zeus launch checklist</span>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {checklistItems.map(item => (
              <li key={item.id}>
                <Link
                  to={item.href}
                  className={`flex items-center gap-3 min-h-10 p-3 rounded-lg border transition-colors ${
                    item.done
                      ? 'border-emerald-500/25 bg-emerald-500/5 text-emerald-300/90'
                      : 'border-[rgba(255,255,255,0.06)] hover:border-violet-400/35 hover:bg-violet-500/[0.04]'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] flex-shrink-0 ${
                      item.done ? 'border-emerald-400 bg-emerald-500/20' : 'border-zinc-600'
                    }`}
                  >
                    {item.done ? '✓' : ''}
                  </span>
                  <span className="text-sm text-[#ccc]">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Usage + plan — teal execution meter vs Growth pulse cards */}
      <div className="zeus-surface p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Gauge className="w-5 h-5 text-brand-blue" />
            <div>
              <p className="text-sm font-medium text-white">Voice usage</p>
              <p className="text-xs text-zinc-600">
                {usage.voiceMinutesUsed.toLocaleString()} / {usage.voiceMinutesIncluded.toLocaleString()} min · resets{' '}
                {usage.billingPeriodEnd}
              </p>
            </div>
          </div>
          <Link
            to="/settings"
            className="inline-flex items-center min-h-10 text-xs text-brand-blue hover:text-sky-300 whitespace-nowrap py-1 sm:py-0"
          >
            Billing & limits →
          </Link>
        </div>
        <div className="h-2.5 rounded-full bg-[rgba(255,255,255,0.08)] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-navy via-brand-blue to-emerald-400/90 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-[11px] text-zinc-600 mt-2">{workspace.plan} plan · {workspace.seatsUsed}/{workspace.seatsIncluded} seats</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickStats.map((s, i) => (
          <Link
            key={s.label}
            to={s.href}
            className={`siren-card p-5 hover:bg-[rgba(255,255,255,0.03)] transition-colors block group glass-panel ${
              i === 2 ? 'zeus-tile-accent-violet' : 'zeus-tile-accent-teal'
            }`}
          >
            <p className="text-xs text-zinc-500 mb-1">{s.label}</p>
            <p className="text-3xl font-semibold text-white group-hover:text-sky-300 transition-colors">{s.value}</p>
            <p className="text-[11px] text-brand-blue mt-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
              {s.hint} <ArrowRight className="w-3 h-3" />
            </p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ZeusIntelFeed signals={zeusSignals} />

        <div className="siren-card p-6 glass-panel border border-white/[0.07]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs text-zinc-500 tracking-wide uppercase flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-blue" />
              CRM activity
            </h3>
            <Link
              to="/analytics"
              className="inline-flex items-center justify-center min-h-10 px-1 text-[11px] text-brand-blue hover:text-sky-300 sm:min-h-0 sm:px-0"
            >
              Analytics
            </Link>
          </div>
          <ul className="space-y-3">
            {activityFeed.map(a => (
              <li key={a.id} className="text-sm border-b border-[rgba(255,255,255,0.04)] pb-3 last:border-0">
                <span className="text-white">{a.title}</span>
                <span className="text-zinc-500 block text-xs mt-0.5">{a.detail}</span>
                <span className="text-[10px] text-zinc-600">{a.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="siren-card p-6 glass-panel">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs text-zinc-500 tracking-wide uppercase flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400" />
              Active calls
            </h3>
            <span className="text-[11px] text-emerald-400/90">{activeCalls.length} live</span>
          </div>
          <ul className="space-y-3">
            {activeCalls.map(call => (
              <li
                key={call.id}
                className="flex items-center justify-between gap-3 py-2 border-b border-[rgba(255,255,255,0.04)] last:border-0"
              >
                <div className="min-w-0">
                  <p className="text-sm text-white font-medium truncate">{call.prospect}</p>
                  <p className="text-[11px] text-zinc-600 truncate">{call.company} · {call.agent}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-mono text-zinc-500">{call.duration}</span>
                  <span className="block text-[10px] text-brand-blue capitalize">{call.stage}</span>
                </div>
              </li>
            ))}
          </ul>
          <Link
            to="/chat"
            className="inline-flex items-center gap-1 min-h-10 text-xs text-brand-blue mt-4 hover:text-sky-300"
          >
            Open Growth coach <ArrowRight className="w-3 h-3 shrink-0" />
          </Link>
        </div>

        <div className="rounded-2xl border border-teal-500/15 bg-teal-950/10 p-6 md:p-7 flex flex-col justify-center">
          <p className="text-[10px] uppercase tracking-[0.18em] text-teal-400/80 mb-2">Execution lane</p>
          <h3 className="text-lg font-semibold text-white mb-2">Dial studio</h3>
          <p className="text-sm text-zinc-500 leading-relaxed mb-4">
            Voice metrics above stay on teal “surge” surfaces. Scripts, Growth coach, and carrier health round out outbound —
            distinct from Growth OS Listen / Publish lanes.
          </p>
          <div className="flex flex-col xs:flex-row xs:flex-wrap gap-2 xs:items-center">
            <Link
              to="/chat"
              className="text-xs font-medium text-teal-300 hover:text-teal-200 inline-flex items-center gap-1 min-h-10"
            >
              Growth coach <ArrowRight className="w-3 h-3 shrink-0" />
            </Link>
            <span className="hidden xs:inline text-zinc-700">·</span>
            <Link
              to="/pipeline"
              className="text-xs font-medium text-zinc-400 hover:text-white inline-flex items-center min-h-10"
            >
              Pipeline
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 siren-card p-6 glass-panel">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs text-zinc-500 tracking-wide uppercase flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-brand-blue" />
              Campaigns
            </h3>
            <Link
              to="/campaigns"
              className="inline-flex items-center justify-center min-h-10 px-1 text-xs text-brand-blue hover:text-sky-300 sm:min-h-0 sm:px-0"
            >
              Manage all
            </Link>
          </div>
          <p className="text-sm text-zinc-500 mb-4">
            <span className="text-white font-medium">{liveCampaigns}</span> live · sellers earn{' '}
            {MARKETPLACE_CREATOR_SHARE_PERCENT}% on marketplace scripts.
          </p>
          <div className="space-y-2">
            {campaigns.slice(0, 3).map(c => (
              <div
                key={c.id}
                className="flex items-center justify-between gap-2 py-2 px-3 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)]"
              >
                <span className="text-sm text-white truncate">{c.name}</span>
                <span
                  className={`text-[10px] uppercase px-2 py-0.5 rounded ${
                    c.status === 'live' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-zinc-800/80 text-zinc-500'
                  }`}
                >
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="siren-card p-6 glass-panel">
          <h3 className="text-xs text-zinc-500 tracking-wide uppercase mb-4 flex items-center gap-2">
            <Phone className="w-4 h-4 text-amber-400" />
            Number health
          </h3>
          <ul className="space-y-2">
            {numberHealth.map(n => (
              <li key={n.id} className="text-xs">
                <span className="text-white font-mono block truncate">{n.label}</span>
                <span
                  className={
                    n.status === 'healthy'
                      ? 'text-emerald-400/90'
                      : n.status === 'warn'
                        ? 'text-amber-400'
                        : 'text-red-400/90'
                  }
                >
                  {n.detail}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-[10px] text-zinc-600 mt-4">Rotate pools to protect deliverability on high-volume campaigns.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/listen"
          className="zeus-surface-muted zeus-tile-accent-teal p-6 hover:border-teal-400/30 transition-colors group block rounded-2xl"
        >
          <LayoutGrid className="w-8 h-8 text-teal-400/90 mb-3" />
          <h3 className="text-sm font-medium text-white mb-2">Growth modules</h3>
          <p className="text-sm text-zinc-500 leading-relaxed mb-4">
            Listen, Target, Publish, Brand, Affiliates, Briefings — each lane has its own UI pattern (teal / violet / amber).
          </p>
          <span className="text-sm text-teal-300 group-hover:text-teal-200 inline-flex items-center gap-1">
            Explore lanes <ArrowRight className="w-4 h-4" />
          </span>
        </Link>
        <Link
          to="/scripts"
          className="siren-card p-6 glass-panel hover:border-brand-blue/30 transition-colors group block"
        >
          <BookOpen className="w-8 h-8 text-brand-blue/90 mb-3" />
          <h3 className="text-sm font-medium text-white mb-2">Script library</h3>
          <p className="text-sm text-zinc-500 leading-relaxed mb-4">
            Templates, benchmarks, peer marketplace — personalize variables per dial.
          </p>
          <span className="text-sm text-brand-blue group-hover:text-sky-300 inline-flex items-center gap-1">
            Browse scripts <ArrowRight className="w-4 h-4" />
          </span>
        </Link>
        <Link
          to="/guard"
          className="siren-card p-6 glass-panel hover:border-red-500/25 transition-colors group border-red-500/10 block"
        >
          <Shield className="w-8 h-8 text-red-400/80 mb-3" />
          <h3 className="text-sm font-medium text-white mb-2">Guard mode</h3>
          <p className="text-sm text-zinc-500 leading-relaxed mb-4">
            Switch top bar to Guard for interception, personas, and defense dashboards.
          </p>
          <span className="text-sm text-red-400 group-hover:text-red-300 inline-flex items-center gap-1">
            Open Guard <ArrowRight className="w-4 h-4" />
          </span>
        </Link>
      </div>
    </div>
  );
}
