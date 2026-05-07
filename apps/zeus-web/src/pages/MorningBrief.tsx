/**
 * Zeus Morning Brief — unified daily intelligence digest.
 *
 * Pulls from every running Zeus service and compiles them into a single
 * 7am command-center view. Nano Banana competitor workflow = one section.
 *
 * Sections:
 *   1. Eckleberg UX — score delta, top issue
 *   2. PPC — spend, ROAS, top/worst ad
 *   3. Relay inbox — open tickets, flagged items
 *   4. Social listening — trending keywords, sentiment, top post
 *   5. Competitor intel — Nano Banana creative angles + hooks
 *   6. Content calendar — today's posts, pending approvals
 *   7. Pipeline — new leads, follow-ups due
 *   8. PR — submissions live, coverage hits
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RELAY_DEMO_CONVERSATIONS, relayBriefStatsFromConversations } from '../api/relay';
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  BookOpen,
  Calendar,
  ChevronDown,
  ChevronUp,
  Ear,
  Eye,
  Gauge,
  Inbox,
  Lightbulb,
  Megaphone,
  Newspaper,
  RefreshCw,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { ph } from '../lib/posthog';

// ─── Types ───────────────────────────────────────────────────────────────────

interface BriefSection<T> {
  status: 'loading' | 'ok' | 'warn' | 'error' | 'empty';
  data: T | null;
}

interface EcklebergData {
  score: number;
  prevScore: number;
  topIssue: string;
  product: string;
  lastRun: string;
}

interface PpcData {
  spend: number;
  roas: number;
  roasDelta: number;
  topAd: string;
  worstAd: string;
  impressions: number;
}

interface RelayData {
  openTickets: number;
  avgResponseTime: string;
  flagged: number;
  resolvedToday: number;
}

interface SocialData {
  topKeyword: string;
  topPost: { platform: string; text: string; score: number };
  sentimentShift: number; // -100 to 100
  newMentions: number;
  risingSignal: string;
}

interface CompetitorData {
  competitor: string;
  topAngle: string;
  topHook: string;
  imageConceptSummary: string;
  analyzedAt: string;
}

interface CalendarData {
  todayCount: number;
  pendingApprovals: number;
  nextPost: { platform: string; time: string; preview: string } | null;
}

interface PipelineData {
  newLeads: number;
  followUpsDue: number;
  dealsMovedStage: number;
  hotLead: string | null;
}

interface PrData {
  submissionsLive: number;
  coverageHits: number;
  latestHit: string | null;
  nextSubmission: string | null;
}

interface MorningBriefData {
  generatedAt: string;
  eckleberg: BriefSection<EcklebergData>;
  ppc: BriefSection<PpcData>;
  relay: BriefSection<RelayData>;
  social: BriefSection<SocialData>;
  competitor: BriefSection<CompetitorData>;
  calendar: BriefSection<CalendarData>;
  pipeline: BriefSection<PipelineData>;
  pr: BriefSection<PrData>;
}

// ─── Mock data (replace with MAMA API calls) ─────────────────────────────────

function buildMockBrief(): MorningBriefData {
  return {
    generatedAt: new Date().toISOString(),
    eckleberg: {
      status: 'ok',
      data: {
        score: 7.4,
        prevScore: 6.8,
        topIssue: 'Price reveal hidden until final checkout step',
        product: 'LuxuryTravels',
        lastRun: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      },
    },
    ppc: {
      status: 'warn',
      data: {
        spend: 1240,
        roas: 2.8,
        roasDelta: -0.4,
        topAd: '"Book direct, save 22%" — 4.1% CTR',
        worstAd: '"Exclusive rates" — 0.8% CTR, paused',
        impressions: 48200,
      },
    },
    relay: {
      status: 'ok',
      data: relayBriefStatsFromConversations(RELAY_DEMO_CONVERSATIONS),
    },
    social: {
      status: 'ok',
      data: {
        topKeyword: 'AI outreach tool',
        topPost: {
          platform: 'reddit',
          text: '"We cut our SDR team by 50% using AI outreach — here\'s the stack"',
          score: 94,
        },
        sentimentShift: +18,
        newMentions: 34,
        risingSignal: '"cold email is dead" — 340% spike on HN in 48h',
      },
    },
    competitor: {
      status: 'ok',
      data: {
        competitor: 'apollo.io',
        topAngle: 'Authority + Social Proof — "Used by 100k sales teams"',
        topHook: '"Your SDR makes $90k. This makes 500 calls a day for $99/mo."',
        imageConceptSummary: '3 concepts: dashboard screenshot, ROI calculator, before/after team size',
        analyzedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      },
    },
    calendar: {
      status: 'ok',
      data: {
        todayCount: 4,
        pendingApprovals: 2,
        nextPost: {
          platform: 'LinkedIn',
          time: '10:00 AM',
          preview: '"3 signals that a prospect is ready to buy (most reps miss #2)"',
        },
      },
    },
    pipeline: {
      status: 'ok',
      data: {
        newLeads: 14,
        followUpsDue: 7,
        dealsMovedStage: 3,
        hotLead: 'Sarah Chen — VP Sales, Acme Corp — opened email 4x',
      },
    },
    pr: {
      status: 'ok',
      data: {
        submissionsLive: 3,
        coverageHits: 1,
        latestHit: 'Indie Hackers — "AI outreach tool hitting $10k MRR in 60 days"',
        nextSubmission: 'Product Hunt launch — scheduled 2026-05-07',
      },
    },
  };
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SectionShell({
  icon: Icon,
  title,
  href,
  status,
  accent = 'teal',
  children,
  defaultOpen = true,
}: {
  icon: React.ElementType;
  title: string;
  href: string;
  status: BriefSection<unknown>['status'];
  accent?: 'teal' | 'violet' | 'amber' | 'blue' | 'emerald' | 'rose';
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  const accentMap = {
    teal: 'text-teal-400 border-teal-500/20 bg-teal-500/5',
    violet: 'text-violet-400 border-violet-500/20 bg-violet-500/5',
    amber: 'text-amber-400 border-amber-500/20 bg-amber-500/5',
    blue: 'text-sky-400 border-sky-500/20 bg-sky-500/5',
    emerald: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
    rose: 'text-rose-400 border-rose-500/20 bg-rose-500/5',
  };

  const statusDot =
    status === 'ok' ? 'bg-emerald-400' :
    status === 'warn' ? 'bg-amber-400' :
    status === 'error' ? 'bg-red-400' :
    status === 'loading' ? 'bg-zinc-500 animate-pulse' :
    'bg-zinc-700';

  return (
    <div className={`rounded-2xl border ${accentMap[accent]} overflow-hidden`}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className={`w-4 h-4 ${accentMap[accent].split(' ')[0]}`} />
          <span className="text-sm font-medium text-white">{title}</span>
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusDot}`} />
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={href}
            onClick={e => e.stopPropagation()}
            className={`text-[11px] ${accentMap[accent].split(' ')[0]} hover:opacity-80 inline-flex items-center gap-0.5`}
          >
            Open <ArrowUpRight className="w-3 h-3" />
          </Link>
          {open ? <ChevronUp className="w-3.5 h-3.5 text-zinc-600" /> : <ChevronDown className="w-3.5 h-3.5 text-zinc-600" />}
        </div>
      </button>
      {open && <div className="px-5 pb-5 space-y-3">{children}</div>}
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase text-zinc-600 tracking-wider">{label}</p>
      <p className="text-lg font-semibold text-white tabular-nums">{value}</p>
      {sub && <p className="text-[11px] text-zinc-500">{sub}</p>}
    </div>
  );
}

function Delta({ value }: { value: number }) {
  const pos = value >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${pos ? 'text-emerald-400' : 'text-red-400'}`}>
      {pos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {pos ? '+' : ''}{value.toFixed(1)}
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function MorningBrief() {
  const [brief, setBrief] = useState<MorningBriefData | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = () => {
    setRefreshing(true);
    // In production: fetch from MAMA /api/morning-brief
    setTimeout(() => {
      setBrief(buildMockBrief());
      setRefreshing(false);
    }, 800);
  };

  useEffect(() => {
    ph('morning_brief_viewed');
    load();
  }, []);

  const ek = brief?.eckleberg;
  const ppc = brief?.ppc;
  const relay = brief?.relay;
  const social = brief?.social;
  const comp = brief?.competitor;
  const cal = brief?.calendar;
  const pipe = brief?.pipeline;
  const pr = brief?.pr;

  return (
    <div className="w-full max-w-3xl min-w-0 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-400/90">Zeus Growth OS</p>
          <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight mt-1">Morning Brief</h1>
          <p className="text-sm text-zinc-500 mt-1.5">
            {brief
              ? `Generated ${new Date(brief.generatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · All services`
              : 'Loading…'}
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.05] border border-white/[0.08] text-xs text-zinc-400 hover:text-white hover:bg-white/[0.08] disabled:opacity-50 transition-colors mt-1"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Quick pulse — top-line numbers */}
      {brief && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'UX score', value: ek?.data?.score.toFixed(1) ?? '…', accent: 'text-violet-400' },
            { label: 'New leads', value: pipe?.data?.newLeads ?? '…', accent: 'text-teal-400' },
            { label: 'PPC ROAS', value: ppc?.data ? `${ppc.data.roas}×` : '…', accent: 'text-amber-400' },
            { label: 'Social mentions', value: social?.data?.newMentions ?? '…', accent: 'text-sky-400' },
          ].map(s => (
            <div key={s.label} className="siren-card p-4 glass-panel">
              <p className="text-[10px] uppercase text-zinc-600 tracking-wider mb-1">{s.label}</p>
              <p className={`text-2xl font-semibold tabular-nums ${s.accent}`}>{String(s.value)}</p>
            </div>
          ))}
        </div>
      )}

      {!brief && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="rounded-2xl border border-white/[0.06] h-20 animate-pulse bg-white/[0.02]" />
          ))}
        </div>
      )}

      {brief && (
        <div className="space-y-3">

          {/* 1. Eckleberg UX */}
          <SectionShell icon={Eye} title="Eckleberg — UX Health" href="/eckleberg" status={ek?.status ?? 'loading'} accent="violet">
            {ek?.data && (
              <>
                <div className="flex items-end gap-4">
                  <Stat label="UX Score" value={ek.data.score.toFixed(1)} />
                  <div className="mb-1"><Delta value={ek.data.score - ek.data.prevScore} /></div>
                </div>
                <p className="text-sm text-zinc-300">
                  <span className="text-zinc-600">Top issue: </span>
                  {ek.data.topIssue}
                </p>
                <p className="text-[11px] text-zinc-600">
                  {ek.data.product} · Last run {new Date(ek.data.lastRun).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </>
            )}
          </SectionShell>

          {/* 2. PPC */}
          <SectionShell icon={BarChart3} title="PPC Performance" href="/ppc" status={ppc?.status ?? 'loading'} accent="amber">
            {ppc?.data && (
              <>
                <div className="grid grid-cols-3 gap-4">
                  <Stat label="Spend today" value={`$${ppc.data.spend.toLocaleString()}`} />
                  <div>
                    <Stat label="ROAS" value={`${ppc.data.roas}×`} />
                    <Delta value={ppc.data.roasDelta} />
                  </div>
                  <Stat label="Impressions" value={ppc.data.impressions.toLocaleString()} />
                </div>
                <div className="space-y-1 pt-1">
                  <p className="text-xs text-zinc-400"><span className="text-emerald-400">↑ Top:</span> {ppc.data.topAd}</p>
                  <p className="text-xs text-zinc-400"><span className="text-red-400">↓ Worst:</span> {ppc.data.worstAd}</p>
                </div>
              </>
            )}
          </SectionShell>

          {/* 3. Relay inbox */}
          <SectionShell icon={Inbox} title="Relay — Unified Inbox" href="/relay" status={relay?.status ?? 'loading'} accent="blue">
            {relay?.data && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Stat label="Open tickets" value={relay.data.openTickets} />
                <Stat label="Avg response" value={relay.data.avgResponseTime} />
                <Stat label="Flagged" value={relay.data.flagged} sub={relay.data.flagged > 0 ? 'needs attention' : 'all clear'} />
                <Stat label="Resolved today" value={relay.data.resolvedToday} />
              </div>
            )}
          </SectionShell>

          {/* 4. Social listening */}
          <SectionShell icon={Ear} title="Social Listening" href="/listen" status={social?.status ?? 'loading'} accent="teal">
            {social?.data && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <Stat label="New mentions" value={social.data.newMentions} />
                  <div>
                    <p className="text-[10px] uppercase text-zinc-600 tracking-wider">Sentiment shift</p>
                    <Delta value={social.data.sentimentShift} />
                  </div>
                </div>
                <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-3">
                  <p className="text-[10px] uppercase text-zinc-600 mb-1">Top post · {social.data.topPost.platform} · ↑{social.data.topPost.score}</p>
                  <p className="text-sm text-zinc-300 italic">"{social.data.topPost.text}"</p>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <p className="text-xs text-amber-300">Rising signal: {social.data.risingSignal}</p>
                </div>
              </div>
            )}
          </SectionShell>

          {/* 5. Competitor intel (Nano Banana) */}
          <SectionShell icon={Lightbulb} title="Competitor Intel" href="/content-studio" status={comp?.status ?? 'loading'} accent="violet" defaultOpen={false}>
            {comp?.data && (
              <div className="space-y-3">
                <p className="text-[11px] text-zinc-600">Analyzed: {comp.data.competitor} · {new Date(comp.data.analyzedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <div className="space-y-2">
                  <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-3">
                    <p className="text-[10px] uppercase text-zinc-600 mb-1">Top angle</p>
                    <p className="text-sm text-zinc-300">{comp.data.topAngle}</p>
                  </div>
                  <div className="rounded-lg bg-violet-500/5 border border-violet-500/15 p-3">
                    <p className="text-[10px] uppercase text-violet-500/80 mb-1">Top hook to adapt</p>
                    <p className="text-sm text-zinc-200 italic">"{comp.data.topHook}"</p>
                  </div>
                  <p className="text-[11px] text-zinc-600">Image concepts: {comp.data.imageConceptSummary}</p>
                </div>
                <Link to="/content-studio" className="inline-flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300">
                  Generate adapted content <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </SectionShell>

          {/* 6. Content calendar */}
          <SectionShell icon={Calendar} title="Content Calendar — Today" href="/calendar" status={cal?.status ?? 'loading'} accent="rose">
            {cal?.data && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <Stat label="Posts today" value={cal.data.todayCount} />
                  <Stat label="Pending approval" value={cal.data.pendingApprovals} sub={cal.data.pendingApprovals > 0 ? 'needs review' : ''} />
                </div>
                {cal.data.nextPost && (
                  <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-3">
                    <p className="text-[10px] uppercase text-zinc-600 mb-1">Next up · {cal.data.nextPost.platform} · {cal.data.nextPost.time}</p>
                    <p className="text-sm text-zinc-300 italic">"{cal.data.nextPost.preview}"</p>
                  </div>
                )}
              </div>
            )}
          </SectionShell>

          {/* 7. Pipeline */}
          <SectionShell icon={Users} title="Pipeline" href="/pipeline" status={pipe?.status ?? 'loading'} accent="emerald">
            {pipe?.data && (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <Stat label="New leads" value={pipe.data.newLeads} />
                  <Stat label="Follow-ups due" value={pipe.data.followUpsDue} />
                  <Stat label="Deals moved" value={pipe.data.dealsMovedStage} />
                </div>
                {pipe.data.hotLead && (
                  <div className="flex items-start gap-2">
                    <Activity className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-emerald-300">{pipe.data.hotLead}</p>
                  </div>
                )}
              </div>
            )}
          </SectionShell>

          {/* 8. PR */}
          <SectionShell icon={Newspaper} title="PR & Press" href="/pr" status={pr?.status ?? 'loading'} accent="amber" defaultOpen={false}>
            {pr?.data && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <Stat label="Live submissions" value={pr.data.submissionsLive} />
                  <Stat label="Coverage hits" value={pr.data.coverageHits} />
                </div>
                {pr.data.latestHit && (
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-amber-300">{pr.data.latestHit}</p>
                  </div>
                )}
                {pr.data.nextSubmission && (
                  <p className="text-[11px] text-zinc-600">Next: {pr.data.nextSubmission}</p>
                )}
              </div>
            )}
          </SectionShell>

        </div>
      )}

      {/* Send to Slack CTA */}
      {brief && (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-zinc-500" />
              Scheduled delivery
            </p>
            <p className="text-xs text-zinc-500 mt-0.5">This brief auto-sends to #mama-asana at 7:00 AM daily.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              ph('morning_brief_sent_to_slack');
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-500/15 border border-teal-500/25 text-teal-300 text-sm font-medium hover:bg-teal-500/25 transition-colors whitespace-nowrap"
          >
            <Megaphone className="w-4 h-4" />
            Send now
          </button>
        </div>
      )}
    </div>
  );
}
