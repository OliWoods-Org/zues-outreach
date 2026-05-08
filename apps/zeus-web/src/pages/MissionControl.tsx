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
import { MissionFirstVisitCoach } from '../components/MissionFirstVisitCoach';
import { Chat } from './Chat';
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
    <div className="flex flex-col xl:flex-row xl:items-start gap-6 xl:gap-8 w-full max-w-[1800px] mx-auto min-w-0">
      {/* Primary chat surface — top on mobile, center column on xl */}
      <section
        className="order-1 xl:order-2 flex-1 min-w-0 min-h-0 flex flex-col"
        aria-label="Growth coach"
      >
        <div className="rounded-2xl border border-teal-500/20 bg-[rgba(6,10,16,0.72)] backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(45,212,191,0.08)] p-4 sm:p-6 md:p-8 flex-1 min-h-[min(72vh,780px)] relative">
          <MissionFirstVisitCoach />
          <Chat variant="mission" />
        </div>
      </section>

      {/* Telemetry & shortcuts — below chat on mobile, left sidebar on xl */}
      <aside
        className="order-2 xl:order-1 w-full xl:w-[min(100%,380px)] shrink-0 space-y-4 xl:max-h-[calc(100vh-5rem)] xl:overflow-y-auto xl:overscroll-contain xl:pr-1 pb-4 xl:sticky xl:top-16"
        aria-label="Mission widgets and shortcuts"
      >
        <ZeusMissionHero />

        <div className="flex flex-col gap-3">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.2em] text-teal-500/80 mb-1">Command center</p>
            <h2 className="text-lg font-semibold text-white tracking-tight">Shortcuts</h2>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
              {workspace.name} — telemetry & outbound lanes. Chat stays center.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Link
              to="/listen"
              className="inline-flex items-center justify-center gap-2 min-h-10 px-3 py-2 rounded-xl zeus-cta-surge text-xs font-semibold"
            >
              <Ear className="w-4 h-4 shrink-0" />
              Listen
            </Link>
            <Link
              to="/campaigns"
              className="inline-flex items-center justify-center gap-2 min-h-10 px-3 py-2 rounded-lg btn-primary-railway text-xs font-semibold"
            >
              <Megaphone className="w-4 h-4 shrink-0" />
              Campaigns
            </Link>
            <Link
              to="/scripts"
              className="inline-flex items-center justify-center gap-2 min-h-10 px-3 py-2 rounded-lg bg-white/[0.06] text-white text-xs font-medium hover:bg-white/[0.1] border border-white/[0.1]"
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              Scripts
            </Link>
          </div>
        </div>

        <ZeusGrowthPulse />

        <MissionKpiCharts />

        {!onboardingDismissed && (
          <div className="relative rounded-xl border border-violet-500/20 bg-gradient-to-br from-violet-950/30 to-transparent p-4 shadow-[inset_0_1px_0_0_rgba(167,139,250,0.15)]">
            <button
              type="button"
              onClick={dismissOnboarding}
              className="absolute top-2 right-2 min-h-9 min-w-9 inline-flex items-center justify-center rounded-lg text-zinc-600 hover:text-white hover:bg-white/5"
              aria-label="Dismiss onboarding"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 text-violet-300 mb-2">
              <Sparkles className="w-4 h-4" />
              <span className="text-[10px] font-medium uppercase tracking-wider">Launch checklist</span>
            </div>
            <ul className="space-y-2">
              {checklistItems.map(item => (
                <li key={item.id}>
                  <Link
                    to={item.href}
                    className={`flex items-center gap-2 min-h-9 px-2 py-2 rounded-lg border text-xs transition-colors ${
                      item.done
                        ? 'border-emerald-500/25 bg-emerald-500/5 text-emerald-300/90'
                        : 'border-[rgba(255,255,255,0.06)] hover:border-violet-400/35 hover:bg-violet-500/[0.04]'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center text-[9px] flex-shrink-0 ${
                        item.done ? 'border-emerald-400 bg-emerald-500/20' : 'border-zinc-600'
                      }`}
                    >
                      {item.done ? '✓' : ''}
                    </span>
                    <span className="text-zinc-300">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="zeus-surface p-4">
          <div className="flex flex-col gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-brand-blue shrink-0" />
              <div>
                <p className="text-xs font-medium text-white">Voice usage</p>
                <p className="text-[11px] text-zinc-600">
                  {usage.voiceMinutesUsed.toLocaleString()} / {usage.voiceMinutesIncluded.toLocaleString()} min · resets{' '}
                  {usage.billingPeriodEnd}
                </p>
              </div>
            </div>
            <Link to="/settings" className="text-[11px] text-brand-blue hover:text-sky-300">
              Billing & limits →
            </Link>
          </div>
          <div className="h-2 rounded-full bg-[rgba(255,255,255,0.08)] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-navy via-brand-blue to-emerald-400/90 transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-[10px] text-zinc-600 mt-2">
            {workspace.plan} plan · {workspace.seatsUsed}/{workspace.seatsIncluded} seats
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {quickStats.map((s, i) => (
            <Link
              key={s.label}
              to={s.href}
              className={`siren-card p-4 hover:bg-[rgba(255,255,255,0.03)] transition-colors block group glass-panel ${
                i === 2 ? 'zeus-tile-accent-violet' : 'zeus-tile-accent-teal'
              }`}
            >
              <p className="text-[10px] text-zinc-500 mb-0.5">{s.label}</p>
              <p className="text-2xl font-semibold text-white group-hover:text-sky-300 transition-colors">{s.value}</p>
              <p className="text-[10px] text-brand-blue mt-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                {s.hint} <ArrowRight className="w-3 h-3" />
              </p>
            </Link>
          ))}
        </div>

        <ZeusIntelFeed signals={zeusSignals} />

        <div className="siren-card p-4 glass-panel border border-white/[0.07]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[10px] text-zinc-500 tracking-wide uppercase flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-blue" />
              CRM activity
            </h3>
            <Link to="/analytics" className="text-[10px] text-brand-blue hover:text-sky-300">
              Analytics
            </Link>
          </div>
          <ul className="space-y-2">
            {activityFeed.map(a => (
              <li key={a.id} className="text-xs border-b border-[rgba(255,255,255,0.04)] pb-2 last:border-0">
                <span className="text-white">{a.title}</span>
                <span className="text-zinc-500 block text-[11px] mt-0.5">{a.detail}</span>
                <span className="text-[10px] text-zinc-600">{a.time}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="siren-card p-4 glass-panel">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[10px] text-zinc-500 tracking-wide uppercase flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400" />
              Active calls
            </h3>
            <span className="text-[10px] text-emerald-400/90">{activeCalls.length} live</span>
          </div>
          <ul className="space-y-2">
            {activeCalls.map(call => (
              <li
                key={call.id}
                className="flex items-center justify-between gap-2 py-1.5 border-b border-[rgba(255,255,255,0.04)] last:border-0"
              >
                <div className="min-w-0">
                  <p className="text-xs text-white font-medium truncate">{call.prospect}</p>
                  <p className="text-[10px] text-zinc-600 truncate">
                    {call.company} · {call.agent}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-[10px] font-mono text-zinc-500">{call.duration}</span>
                  <span className="block text-[9px] text-brand-blue capitalize">{call.stage}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-teal-500/15 bg-teal-950/10 p-4">
          <p className="text-[9px] uppercase tracking-[0.18em] text-teal-400/80 mb-1">Execution lane</p>
          <h3 className="text-sm font-semibold text-white mb-1">Dial studio</h3>
          <p className="text-xs text-zinc-500 leading-relaxed mb-3">
            Voice metrics, scripts, pipeline — outbound lane beside Growth OS Listen / Publish.
          </p>
          <div className="flex flex-col gap-2">
            <Link to="/pipeline" className="text-xs font-medium text-zinc-400 hover:text-white inline-flex items-center min-h-9">
              Pipeline →
            </Link>
          </div>
        </div>

        <div className="siren-card p-4 glass-panel">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[10px] text-zinc-500 tracking-wide uppercase flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-brand-blue" />
              Campaigns
            </h3>
            <Link to="/campaigns" className="text-[10px] text-brand-blue hover:text-sky-300">
              Manage
            </Link>
          </div>
          <p className="text-xs text-zinc-500 mb-2">
            <span className="text-white font-medium">{liveCampaigns}</span> live · sellers earn{' '}
            {MARKETPLACE_CREATOR_SHARE_PERCENT}% on marketplace scripts.
          </p>
          <div className="space-y-1.5">
            {campaigns.slice(0, 3).map(c => (
              <div
                key={c.id}
                className="flex items-center justify-between gap-2 py-1.5 px-2 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)]"
              >
                <span className="text-xs text-white truncate">{c.name}</span>
                <span
                  className={`text-[9px] uppercase px-1.5 py-0.5 rounded ${
                    c.status === 'live' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-zinc-800/80 text-zinc-500'
                  }`}
                >
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="siren-card p-4 glass-panel">
          <h3 className="text-[10px] text-zinc-500 tracking-wide uppercase mb-3 flex items-center gap-2">
            <Phone className="w-4 h-4 text-amber-400" />
            Number health
          </h3>
          <ul className="space-y-2">
            {numberHealth.map(n => (
              <li key={n.id} className="text-[11px]">
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
          <p className="text-[10px] text-zinc-600 mt-3">Rotate pools to protect deliverability.</p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <Link
            to="/listen"
            className="zeus-surface-muted zeus-tile-accent-teal p-4 hover:border-teal-400/30 transition-colors group block rounded-xl"
          >
            <LayoutGrid className="w-6 h-6 text-teal-400/90 mb-2" />
            <h3 className="text-xs font-medium text-white mb-1">Growth modules</h3>
            <p className="text-[11px] text-zinc-500 leading-relaxed mb-2">
              Listen, Target, Publish, Brand — teal / violet / amber lanes.
            </p>
            <span className="text-xs text-teal-300 group-hover:text-teal-200 inline-flex items-center gap-1">
              Explore <ArrowRight className="w-3 h-3" />
            </span>
          </Link>
          <Link
            to="/scripts"
            className="siren-card p-4 glass-panel hover:border-brand-blue/30 transition-colors group block"
          >
            <BookOpen className="w-6 h-6 text-brand-blue/90 mb-2" />
            <h3 className="text-xs font-medium text-white mb-1">Script library</h3>
            <p className="text-[11px] text-zinc-500 leading-relaxed mb-2">Templates & marketplace.</p>
            <span className="text-xs text-brand-blue group-hover:text-sky-300 inline-flex items-center gap-1">
              Browse <ArrowRight className="w-3 h-3" />
            </span>
          </Link>
          <Link
            to="/guard"
            className="siren-card p-4 glass-panel hover:border-red-500/25 transition-colors group border-red-500/10 block"
          >
            <Shield className="w-6 h-6 text-red-400/80 mb-2" />
            <h3 className="text-xs font-medium text-white mb-1">Guard mode</h3>
            <p className="text-[11px] text-zinc-500 leading-relaxed mb-2">Defense dashboards & personas.</p>
            <span className="text-xs text-red-400 group-hover:text-red-300 inline-flex items-center gap-1">
              Open Guard <ArrowRight className="w-3 h-3" />
            </span>
          </Link>
        </div>
      </aside>
    </div>
  );
}
