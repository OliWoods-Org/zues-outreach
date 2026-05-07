import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Edit2,
  Plus,
  Send,
  Shield,
  Trash2,
  X,
} from 'lucide-react';

type Channel = 'Meta' | 'X' | 'LinkedIn' | 'Threads';
type ApprovalStatus = 'pending' | 'approved' | 'rejected';

interface PublishItem {
  id: string;
  content: string;
  channel: Channel;
  scheduledFor: string;
  status: ApprovalStatus;
  complianceFlag: boolean;
  author: string;
}

const queue: PublishItem[] = [
  {
    id: 'p1',
    content: 'Excited to share our latest case study: how Acme doubled their MQL volume in 90 days using Zeus AI sequences. Link in bio 👇',
    channel: 'LinkedIn',
    scheduledFor: 'Today 3:00 PM',
    status: 'pending',
    complianceFlag: false,
    author: 'Zeus AI',
  },
  {
    id: 'p2',
    content:
      "Speed-to-lead or speed-to-lose. Our voice agent responds to inbound leads in under 60 seconds. What's your current response time?",
    channel: 'X',
    scheduledFor: 'Today 4:30 PM',
    status: 'approved',
    complianceFlag: false,
    author: 'Zeus AI',
  },
  {
    id: 'p3',
    content: '🔥 New integration: Zeus + Instantly. Your cold emails just got an AI backbone. Sign up for early access.',
    channel: 'Meta',
    scheduledFor: 'Tomorrow 9:00 AM',
    status: 'pending',
    complianceFlag: true,
    author: 'Zeus AI',
  },
  {
    id: 'p4',
    content: 'What if your CRM updated itself? Zeus syncs every dial, connect, and meeting back to HubSpot — zero manual entry.',
    channel: 'LinkedIn',
    scheduledFor: 'Tomorrow 11:00 AM',
    status: 'pending',
    complianceFlag: false,
    author: 'Zeus AI',
  },
  {
    id: 'p5',
    content: 'Thread: 5 cold email subject lines that generated 40%+ open rates last month (with data) 🧵',
    channel: 'Threads',
    scheduledFor: 'Thu 10:00 AM',
    status: 'approved',
    complianceFlag: false,
    author: 'Zeus AI',
  },
];

const channelMeta: Record<Channel, { icon: string; color: string }> = {
  Meta: { icon: '𝑓', color: 'text-blue-400' },
  X: { icon: '𝕏', color: 'text-zinc-300' },
  LinkedIn: { icon: 'in', color: 'text-blue-500' },
  Threads: { icon: '@', color: 'text-zinc-300' },
};

const statusMeta: Record<ApprovalStatus, { label: string; cls: string; icon: typeof CheckCircle2 }> = {
  pending: { label: 'Pending', cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: Clock },
  approved: { label: 'Approved', cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: CheckCircle2 },
  rejected: { label: 'Rejected', cls: 'bg-red-500/10 text-red-400 border-red-500/20', icon: X },
};

const channelFilters: (Channel | 'All')[] = ['All', 'Meta', 'X', 'LinkedIn', 'Threads'];

const kpis = [
  { label: 'Queued', value: '12', hint: 'Awaiting approval', accent: '#a78bfa' },
  { label: 'Scheduled 48h', value: '5', hint: 'Approved + timed', accent: '#22d3ee' },
  { label: 'Published Today', value: '3', hint: 'Live across channels', accent: '#10b981' },
  { label: 'Channels', value: '4', hint: 'Meta · X · LinkedIn · Threads', accent: '#f59e0b' },
];

export function PublishModule() {
  const [activeChannel, setActiveChannel] = useState<Channel | 'All'>('All');
  const [items, setItems] = useState<PublishItem[]>(queue);

  const filtered = items.filter(i => activeChannel === 'All' || i.channel === activeChannel);

  const approve = (id: string) => setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'approved' } : i));
  const reject = (id: string) => setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'rejected' } : i));
  const remove = (id: string) => setItems(prev => prev.filter(i => i.id !== id));

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
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-400/90">Content Queue</p>
            <h1 className="text-2xl md:text-3xl font-semibold text-white mt-1 tracking-tight">Publish</h1>
            <p className="text-zinc-400 text-sm mt-1.5 leading-relaxed max-w-2xl">
              Approval-gated multi-channel queue — Meta, X, LinkedIn, Threads. Review, approve, or reject before anything goes live.
            </p>
          </div>
          <button className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-xs text-violet-300 hover:bg-violet-500/20 transition-colors">
            <Plus className="w-3.5 h-3.5" /> Queue Content
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

      {/* Queue */}
      <div className="siren-card glass-panel overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.06] flex-wrap">
          <span className="text-xs text-zinc-500 uppercase tracking-wider mr-2">Filter:</span>
          {channelFilters.map(ch => (
            <button
              key={ch}
              onClick={() => setActiveChannel(ch)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                activeChannel === ch
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                  : 'bg-white/[0.03] text-zinc-500 border border-white/[0.06] hover:text-zinc-300'
              }`}
            >
              {ch}
            </button>
          ))}
          <span className="ml-auto text-[11px] text-zinc-600">
            {filtered.filter(i => i.status === 'pending').length} pending
          </span>
        </div>

        {/* Items */}
        <div className="divide-y divide-white/[0.04]">
          {filtered.map(item => {
            const sm = statusMeta[item.status];
            const StatusIcon = sm.icon;
            const ch = channelMeta[item.channel];
            return (
              <div key={item.id} className="px-5 py-4 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-start gap-3">
                  {/* Channel badge */}
                  <span className={`flex-shrink-0 w-8 h-8 rounded-lg border border-white/10 bg-white/[0.04] flex items-center justify-center text-sm font-bold ${ch.color}`}>
                    {ch.icon}
                  </span>

                  <div className="flex-1 min-w-0">
                    {/* Top row */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-[11px] font-semibold text-zinc-300">{item.channel}</span>
                      <span className="text-zinc-700">·</span>
                      <span className="text-[11px] text-zinc-500">{item.scheduledFor}</span>
                      {item.complianceFlag && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-full">
                          <Shield className="w-3 h-3" /> Review
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <p className="text-sm text-zinc-200 leading-relaxed line-clamp-2">{item.content}</p>

                    {/* Bottom row */}
                    <div className="flex items-center gap-3 mt-3">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-semibold border px-2 py-0.5 rounded-full ${sm.cls}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {sm.label}
                      </span>
                      <span className="text-[11px] text-zinc-600">{item.author}</span>

                      {item.status === 'pending' && (
                        <div className="flex items-center gap-2 ml-auto">
                          <button
                            onClick={() => reject(item.id)}
                            className="inline-flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 border border-red-500/20 bg-red-500/5 px-2.5 py-1 rounded-md transition-colors"
                          >
                            <X className="w-3 h-3" /> Reject
                          </button>
                          <button
                            onClick={() => approve(item.id)}
                            className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1 rounded-md transition-colors"
                          >
                            <CheckCircle2 className="w-3 h-3" /> Approve
                          </button>
                        </div>
                      )}

                      {item.status !== 'pending' && (
                        <div className="flex items-center gap-2 ml-auto">
                          <button className="text-zinc-600 hover:text-zinc-400 transition-colors">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => remove(item.id)}
                            className="text-zinc-600 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="py-12 text-center text-zinc-600 text-sm">
              Nothing in the queue for {activeChannel}.
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap gap-4">
        <Link to="/calendar" className="inline-flex items-center gap-1.5 text-sm text-violet-400 hover:text-violet-300">
          Content calendar <ArrowRight className="w-4 h-4" />
        </Link>
        <Link to="/social/autopost" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white">
          Autopost queue <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
