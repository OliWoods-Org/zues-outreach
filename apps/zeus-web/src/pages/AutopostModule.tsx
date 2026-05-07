import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Edit2,
  Loader2,
  Plus,
  Radio,
  Send,
  Shield,
  Trash2,
  X,
} from 'lucide-react';

type Platform = 'X' | 'LinkedIn' | 'Meta' | 'Threads';
type PostStatus = 'queued' | 'approved' | 'live' | 'failed';

interface AutoPost {
  id: string;
  content: string;
  platform: Platform;
  scheduledFor: string;
  status: PostStatus;
  complianceCheck: 'pass' | 'review' | 'fail';
  engagementHint?: string;
}

const posts: AutoPost[] = [
  {
    id: 'ap1',
    content: '💡 Cold outreach tip: The best subject lines are questions, not pitches. "Quick question about [company]?" gets 2x more opens. Here\'s why…',
    platform: 'X',
    scheduledFor: 'Today 2:00 PM',
    status: 'approved',
    complianceCheck: 'pass',
    engagementHint: 'High predicted engagement based on past thread performance',
  },
  {
    id: 'ap2',
    content: 'We\'re seeing a shift in B2B buying: deals close 40% faster when the first touch is a phone call, not an email. What\'s your sequence order?',
    platform: 'LinkedIn',
    scheduledFor: 'Today 4:00 PM',
    status: 'queued',
    complianceCheck: 'pass',
  },
  {
    id: 'ap3',
    content: 'AI voice + human oversight = our model. Zeus agents dial, but your team reviews every conversation before the next step. No black boxes.',
    platform: 'Meta',
    scheduledFor: 'Tomorrow 9:00 AM',
    status: 'queued',
    complianceCheck: 'review',
    engagementHint: 'Compliance review flagged "AI" mention — may need FTC disclosure',
  },
  {
    id: 'ap4',
    content: 'Thread: The anatomy of a 40% open-rate subject line. (Data from 2.4M sends last quarter) 🧵',
    platform: 'Threads',
    scheduledFor: 'Tomorrow 11:00 AM',
    status: 'queued',
    complianceCheck: 'pass',
  },
  {
    id: 'ap5',
    content: 'We\'re guaranteed to book more meetings or you don\'t pay. No exceptions.',
    platform: 'LinkedIn',
    scheduledFor: 'Thu 10:00 AM',
    status: 'queued',
    complianceCheck: 'fail',
    engagementHint: 'FTC: "guaranteed" claims require substantiation',
  },
];

const platformMeta: Record<Platform, { icon: string; color: string; cls: string }> = {
  X: { icon: '𝕏', color: '#e2e8f0', cls: 'border-zinc-600/40 bg-zinc-800/40' },
  LinkedIn: { icon: 'in', color: '#60a5fa', cls: 'border-blue-600/30 bg-blue-900/20' },
  Meta: { icon: 'f', color: '#818cf8', cls: 'border-indigo-600/30 bg-indigo-900/20' },
  Threads: { icon: '@', color: '#a1a1aa', cls: 'border-zinc-600/40 bg-zinc-800/40' },
};

const statusMeta: Record<PostStatus, { label: string; icon: typeof Clock; cls: string }> = {
  queued: { label: 'In Queue', icon: Clock, cls: 'text-zinc-400' },
  approved: { label: 'Approved', icon: CheckCircle2, cls: 'text-emerald-400' },
  live: { label: 'Live', icon: Radio, cls: 'text-teal-400' },
  failed: { label: 'Failed', icon: X, cls: 'text-red-400' },
};

const complianceMeta = {
  pass: { label: 'Cleared', cls: 'text-emerald-400', icon: Shield },
  review: { label: 'Review', cls: 'text-amber-400', icon: AlertTriangle },
  fail: { label: 'Block', cls: 'text-red-400', icon: AlertTriangle },
};

const kpis = [
  { label: 'In Queue', value: '4', hint: '2 need approval', accent: '#a78bfa' },
  { label: 'Posted Today', value: '2', hint: 'Across 2 platforms', accent: '#22d3ee' },
  { label: 'Compliance Pass', value: '73%', hint: '3 of 5 cleared', accent: '#10b981' },
  { label: 'Avg Eng Rate', value: '4.1%', hint: 'Rolling 30d', accent: '#f59e0b' },
];

const platformFilters: (Platform | 'All')[] = ['All', 'X', 'LinkedIn', 'Meta', 'Threads'];

export function AutopostModule() {
  const [platformFilter, setPlatformFilter] = useState<Platform | 'All'>('All');
  const [items, setItems] = useState<AutoPost[]>(posts);

  const filtered = items.filter(i => platformFilter === 'All' || i.platform === platformFilter);

  const approve = (id: string) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'approved' } : i));
  const remove = (id: string) => setItems(prev => prev.filter(i => i.id !== id));

  return (
    <div className="space-y-6 max-w-7xl w-full min-w-0">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-teal-500/20 zeus-mesh-hero px-4 py-6 sm:px-6 md:px-8 md:py-7">
        <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 opacity-25 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.5),transparent_70%)]" />
        <div className="relative flex items-start gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-teal-400/30 bg-teal-500/10 text-teal-200">
            <Radio className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-400/90">Social</p>
            <h1 className="text-2xl md:text-3xl font-semibold text-white mt-1 tracking-tight">Autopost</h1>
            <p className="text-zinc-400 text-sm mt-1.5 leading-relaxed max-w-2xl">
              Approval-gated post queue for X, LinkedIn, Meta, and Threads. Compliance gates before anything goes live.
            </p>
          </div>
          <button className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-teal-500/30 bg-teal-500/10 px-3 py-1.5 text-xs text-teal-300 hover:bg-teal-500/20 transition-colors">
            <Plus className="w-3.5 h-3.5" /> Draft Post
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
        <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.06] flex-wrap">
          <span className="text-xs text-zinc-500 uppercase tracking-wider mr-2">Platform:</span>
          {platformFilters.map(pf => (
            <button
              key={pf}
              onClick={() => setPlatformFilter(pf)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                platformFilter === pf
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                  : 'bg-white/[0.03] text-zinc-500 border border-white/[0.06] hover:text-zinc-300'
              }`}
            >
              {pf}
            </button>
          ))}
        </div>

        <div className="divide-y divide-white/[0.04]">
          {filtered.map(post => {
            const pm = platformMeta[post.platform];
            const sm = statusMeta[post.status];
            const StatusIcon = sm.icon;
            const cm = complianceMeta[post.complianceCheck];
            const ComplianceIcon = cm.icon;

            return (
              <div
                key={post.id}
                className={`px-5 py-4 hover:bg-white/[0.02] transition-colors ${
                  post.complianceCheck === 'fail' ? 'border-l-2 border-red-500/40' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Platform */}
                  <span
                    className={`flex-shrink-0 w-9 h-9 rounded-lg border flex items-center justify-center text-sm font-bold ${pm.cls}`}
                    style={{ color: pm.color }}
                  >
                    {pm.icon}
                  </span>

                  <div className="flex-1 min-w-0">
                    {/* Meta row */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold ${sm.cls}`}>
                        <StatusIcon className="w-3 h-3" />
                        {sm.label}
                      </span>
                      <span className="text-[11px] text-zinc-600 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {post.scheduledFor}
                      </span>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold ml-auto ${cm.cls}`}>
                        <ComplianceIcon className="w-3 h-3" />
                        {cm.label}
                      </span>
                    </div>

                    {/* Content */}
                    <p className="text-sm text-zinc-200 leading-relaxed line-clamp-2">{post.content}</p>

                    {/* Hint */}
                    {post.engagementHint && (
                      <p
                        className={`text-[11px] mt-1.5 ${
                          post.complianceCheck === 'fail'
                            ? 'text-red-400'
                            : post.complianceCheck === 'review'
                            ? 'text-amber-400'
                            : 'text-teal-500'
                        }`}
                      >
                        {post.engagementHint}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-3">
                      <button className="text-zinc-600 hover:text-zinc-400 transition-colors">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => remove(post.id)}
                        className="text-zinc-600 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {post.status === 'queued' && post.complianceCheck !== 'fail' && (
                        <button
                          onClick={() => approve(post.id)}
                          className="ml-auto inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1 rounded-md transition-colors"
                        >
                          <CheckCircle2 className="w-3 h-3" /> Approve & Schedule
                        </button>
                      )}

                      {post.complianceCheck === 'fail' && (
                        <span className="ml-auto text-[11px] text-red-400 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Edit required before posting
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="py-12 text-center text-zinc-600 text-sm">
              Nothing queued for {platformFilter}.
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap gap-4">
        <Link to="/social/replies" className="inline-flex items-center gap-1.5 text-sm text-teal-400 hover:text-teal-300">
          Comment AI inbox <ArrowRight className="w-4 h-4" />
        </Link>
        <Link to="/publish" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white">
          Full publish queue <ArrowRight className="w-4 h-4" />
        </Link>
        <Link to="/social/activity" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white">
          Social activity <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
