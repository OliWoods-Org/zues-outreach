import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  BookOpen,
  Gauge,
  Megaphone,
  Phone,
  Radio,
  Shield,
  Sparkles,
  X,
} from 'lucide-react';
import { MissionKpiCharts } from '../components/MissionKpiCharts';
import { pipelineStats } from '../data/deals';
import { MARKETPLACE_CREATOR_SHARE_PERCENT } from '../constants/marketplace';
import {
  activeCalls,
  activityFeed,
  campaigns,
  numberHealth,
  usage,
  workspace,
} from '../data/operations';

const quickStats = [
  { label: 'Open pipeline', value: `$${(pipelineStats.totalValue / 1000).toFixed(0)}K`, href: '/pipeline', hint: 'Deals' },
  { label: 'Win rate', value: `${pipelineStats.winRate}%`, href: '/pipeline', hint: 'Trend' },
  { label: 'Active deals', value: String(pipelineStats.totalDeals), href: '/pipeline', hint: 'CRM' },
];

const checklistItems = [
  { id: 'c1', label: 'Connect CRM or webhook', done: false, href: '/settings' },
  { id: 'c2', label: 'Assign agents to a campaign', done: true, href: '/campaigns' },
  { id: 'c3', label: 'Pick a script from the library', done: false, href: '/scripts' },
  { id: 'c4', label: 'Run a test call', done: false, href: '/chat' },
];

export function MissionControl() {
  const [onboardingDismissed, setOnboardingDismissed] = useState(
    () => localStorage.getItem('siren-onboarding-dismiss') === '1'
  );
  const pct = Math.min(100, Math.round((usage.voiceMinutesUsed / usage.voiceMinutesIncluded) * 100));
  const liveCampaigns = campaigns.filter(c => c.status === 'live').length;

  const dismissOnboarding = () => {
    localStorage.setItem('siren-onboarding-dismiss', '1');
    setOnboardingDismissed(true);
  };

  return (
    <div className="space-y-8 max-w-7xl">
      <MissionKpiCharts />

      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-brand-blue mb-2">Operations</p>
          <h2 className="text-2xl font-semibold text-white tracking-tight">Mission Control</h2>
          <p className="text-sm text-zinc-500 mt-2 max-w-xl leading-relaxed">
            Live snapshot for {workspace.name} — campaigns, voice usage, active calls, and script marketplace in one
            place.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/campaigns"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg btn-primary-railway text-sm font-semibold"
          >
            <Megaphone className="w-4 h-4" />
            Campaigns
          </Link>
          <Link
            to="/scripts"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/[0.06] text-white text-sm font-medium hover:bg-white/[0.1] border border-white/[0.1]"
          >
            <BookOpen className="w-4 h-4" />
            Script library
          </Link>
        </div>
      </div>

      {!onboardingDismissed && (
        <div className="relative siren-card p-5 border border-brand-blue/25 bg-brand-blue/[0.06]">
          <button
            type="button"
            onClick={dismissOnboarding}
            className="absolute top-3 right-3 p-1.5 rounded-lg text-zinc-600 hover:text-white hover:bg-white/5"
            aria-label="Dismiss onboarding"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 text-brand-blue mb-3">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Get to first live call</span>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {checklistItems.map(item => (
              <li key={item.id}>
                <Link
                  to={item.href}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                    item.done
                      ? 'border-emerald-500/25 bg-emerald-500/5 text-emerald-300/90'
                      : 'border-[rgba(255,255,255,0.06)] hover:border-brand-blue/30 hover:bg-white/[0.02]'
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

      {/* Usage + plan */}
      <div className="siren-card p-5 glass-panel">
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
          <Link to="/settings" className="text-xs text-brand-blue hover:text-sky-300 whitespace-nowrap">
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
        {quickStats.map(s => (
          <Link
            key={s.label}
            to={s.href}
            className="siren-card p-5 hover:bg-[rgba(255,255,255,0.03)] transition-colors block group glass-panel"
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
          <Link to="/chat" className="inline-flex items-center gap-1 text-xs text-brand-blue mt-4 hover:text-sky-300">
            Open transcripts <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="siren-card p-6 glass-panel">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs text-zinc-500 tracking-wide uppercase flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-blue" />
              Recent activity
            </h3>
            <Link to="/analytics" className="text-[11px] text-brand-blue hover:text-sky-300">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 siren-card p-6 glass-panel">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs text-zinc-500 tracking-wide uppercase flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-brand-blue" />
              Campaigns
            </h3>
            <Link to="/campaigns" className="text-xs text-brand-blue hover:text-sky-300">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/scripts"
          className="siren-card p-6 glass-panel hover:border-brand-blue/30 transition-colors group block"
        >
          <BookOpen className="w-8 h-8 text-brand-blue/90 mb-3" />
          <h3 className="text-sm font-medium text-white mb-2">Script library</h3>
          <p className="text-sm text-zinc-500 leading-relaxed mb-4">
            Included templates, premium benchmarks, peer marketplace — personalize variables per call.
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
            Switch sidebar to Guard for interception, personas, and scam defense dashboards.
          </p>
          <span className="text-sm text-red-400 group-hover:text-red-300 inline-flex items-center gap-1">
            Open Guard <ArrowRight className="w-4 h-4" />
          </span>
        </Link>
      </div>
    </div>
  );
}
