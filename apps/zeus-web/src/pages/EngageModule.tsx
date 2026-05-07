import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Mail,
  Mic,
  Pause,
  Play,
  Plus,
  Send,
  Zap,
} from 'lucide-react';

interface EmailSequence {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'draft';
  leads: number;
  openRate: number;
  replyRate: number;
  step: number;
  totalSteps: number;
  agent: string;
  nextSendAt?: string;
}

const sequences: EmailSequence[] = [
  {
    id: 'seq1',
    name: 'Q2 ICP Outbound — Telehealth',
    status: 'active',
    leads: 142,
    openRate: 31.4,
    replyRate: 7.2,
    step: 2,
    totalSteps: 5,
    agent: 'Apollo',
    nextSendAt: 'Today 2:00 PM',
  },
  {
    id: 'seq2',
    name: 'Speed-to-Lead Inbound',
    status: 'active',
    leads: 38,
    openRate: 48.9,
    replyRate: 14.1,
    step: 1,
    totalSteps: 3,
    agent: 'Instantly',
    nextSendAt: 'Triggered on form',
  },
  {
    id: 'seq3',
    name: 'Win-back 90-day dormant',
    status: 'paused',
    leads: 86,
    openRate: 22.7,
    replyRate: 3.4,
    step: 3,
    totalSteps: 4,
    agent: 'Apollo',
    nextSendAt: 'Paused',
  },
  {
    id: 'seq4',
    name: 'Partner Co-Sell Intro',
    status: 'draft',
    leads: 0,
    openRate: 0,
    replyRate: 0,
    step: 0,
    totalSteps: 3,
    agent: 'Apollo',
  },
];

const voiceCampaigns = [
  { id: 'vc1', name: 'Inbound Speed Dial — Aria', status: 'live', dialsToday: 420, connects: 198, meetings: 22 },
  { id: 'vc2', name: 'Mid-Market Outbound — Nova', status: 'live', dialsToday: 1840, connects: 312, meetings: 14 },
  { id: 'vc3', name: 'Re-engagement — Rex', status: 'paused', dialsToday: 0, connects: 0, meetings: 0 },
];

const kpis = [
  { label: 'Active Sequences', value: '4', hint: '2 live right now', accent: '#a78bfa' },
  { label: 'Emails Sent Today', value: '847', hint: '+12% vs yesterday', accent: '#22d3ee' },
  { label: 'Open Rate', value: '28.4%', hint: 'Rolling 7d avg', accent: '#10b981' },
  { label: 'Reply Rate', value: '6.2%', hint: 'Instantly + Apollo', accent: '#f59e0b' },
];

const statusMeta: Record<EmailSequence['status'], { label: string; cls: string }> = {
  active: { label: 'Active', cls: 'bg-emerald-500/10 text-emerald-400' },
  paused: { label: 'Paused', cls: 'bg-amber-500/10 text-amber-400' },
  draft: { label: 'Draft', cls: 'bg-zinc-700/60 text-zinc-400' },
};

export function EngageModule() {
  const [tab, setTab] = useState<'email' | 'voice'>('email');

  return (
    <div className="space-y-6 max-w-7xl w-full min-w-0">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-violet-500/20 zeus-mesh-hero px-4 py-6 sm:px-6 md:px-8 md:py-7">
        <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 opacity-25 bg-[radial-gradient(circle_at_center,rgba(167,139,250,0.5),transparent_70%)]" />
        <div className="relative flex items-start gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/30 bg-violet-500/10 text-violet-200">
            <Send className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-400/90">Sequences</p>
            <h1 className="text-2xl md:text-3xl font-semibold text-white mt-1 tracking-tight">Engage</h1>
            <p className="text-zinc-400 text-sm mt-1.5 leading-relaxed max-w-2xl">
              Email sequences via Instantly + Apollo, and Siren voice campaigns — all routed from your ICP lists.
            </p>
          </div>
          <button className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-xs text-violet-300 hover:bg-violet-500/20 transition-colors">
            <Plus className="w-3.5 h-3.5" /> New Sequence
          </button>
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

      {/* Tab switcher */}
      <div className="flex items-center gap-1 border-b border-white/[0.07]">
        {([
          { key: 'email', label: 'Email Sequences', icon: Mail },
          { key: 'voice', label: 'Voice Campaigns', icon: Mic },
        ] as const).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === key
                ? 'border-violet-500 text-white'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {tab === 'email' && (
        <div className="space-y-3">
          {sequences.map(seq => (
            <div
              key={seq.id}
              className="siren-card glass-panel p-5 hover:border-violet-500/25 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusMeta[seq.status].cls}`}>
                      {statusMeta[seq.status].label}
                    </span>
                    <span className="text-[11px] text-zinc-600">{seq.agent}</span>
                  </div>
                  <p className="text-sm font-medium text-white mt-1.5">{seq.name}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <div className="flex gap-0.5">
                      {Array.from({ length: seq.totalSteps }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-1.5 w-8 rounded-full ${i < seq.step ? 'bg-violet-500' : 'bg-white/10'}`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-zinc-600 ml-1">Step {seq.step}/{seq.totalSteps}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-right flex-shrink-0">
                  <div className="hidden sm:block">
                    <p className="text-[10px] text-zinc-600 uppercase tracking-wider">Leads</p>
                    <p className="text-sm font-semibold text-white">{seq.leads}</p>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-[10px] text-zinc-600 uppercase tracking-wider">Open</p>
                    <p className="text-sm font-semibold text-white">{seq.openRate > 0 ? `${seq.openRate}%` : '—'}</p>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-[10px] text-zinc-600 uppercase tracking-wider">Reply</p>
                    <p className="text-sm font-semibold text-white">{seq.replyRate > 0 ? `${seq.replyRate}%` : '—'}</p>
                  </div>
                  <button className="flex items-center justify-center w-8 h-8 rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-colors">
                    {seq.status === 'active' ? (
                      <Pause className="w-3.5 h-3.5 text-zinc-400" />
                    ) : (
                      <Play className="w-3.5 h-3.5 text-zinc-400" />
                    )}
                  </button>
                </div>
              </div>
              {seq.nextSendAt && (
                <p className="text-[11px] text-zinc-600 mt-2.5 pt-2.5 border-t border-white/[0.04]">
                  Next send: <span className="text-zinc-500">{seq.nextSendAt}</span>
                </p>
              )}
            </div>
          ))}

          <button className="w-full py-3 rounded-xl border border-dashed border-white/10 text-sm text-zinc-600 hover:text-zinc-400 hover:border-white/20 transition-colors flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Add Email Sequence
          </button>
        </div>
      )}

      {tab === 'voice' && (
        <div className="space-y-3">
          {voiceCampaigns.map(vc => (
            <div key={vc.id} className="siren-card glass-panel p-5 hover:border-violet-500/25 transition-colors">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-violet-400/20 bg-violet-500/10">
                    <Mic className="w-4 h-4 text-violet-300" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{vc.name}</p>
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                        vc.status === 'live'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-amber-500/10 text-amber-400'
                      }`}
                    >
                      {vc.status === 'live' ? '● Live' : 'Paused'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-5 text-right flex-shrink-0">
                  {[
                    { label: 'Dials', value: vc.dialsToday },
                    { label: 'Connects', value: vc.connects },
                    { label: 'Meetings', value: vc.meetings },
                  ].map(stat => (
                    <div key={stat.label} className="hidden sm:block">
                      <p className="text-[10px] text-zinc-600 uppercase tracking-wider">{stat.label}</p>
                      <p className="text-sm font-semibold text-white">{stat.value.toLocaleString()}</p>
                    </div>
                  ))}
                  <button className="flex items-center justify-center w-8 h-8 rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-colors">
                    {vc.status === 'live' ? (
                      <Pause className="w-3.5 h-3.5 text-zinc-400" />
                    ) : (
                      <Play className="w-3.5 h-3.5 text-zinc-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
          <Link
            to="/campaigns"
            className="w-full py-3 rounded-xl border border-dashed border-white/10 text-sm text-zinc-600 hover:text-zinc-400 hover:border-white/20 transition-colors flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4" /> Manage in Campaigns →
          </Link>
        </div>
      )}

      {/* Footer */}
      <div className="flex flex-wrap gap-4">
        <Link to="/convert" className="inline-flex items-center gap-1.5 text-sm text-violet-400 hover:text-violet-300">
          View Convert (CRM) <ArrowRight className="w-4 h-4" />
        </Link>
        <Link to="/target" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white">
          Back to Target <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
