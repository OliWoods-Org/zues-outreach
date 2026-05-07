import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Edit2,
  MessageCircle,
  RefreshCcw,
  Send,
  ThumbsDown,
  ThumbsUp,
  X,
} from 'lucide-react';

type Platform = 'X' | 'LinkedIn' | 'Reddit' | 'Threads';
type Sentiment = 'positive' | 'neutral' | 'negative';
type ReplyStatus = 'pending' | 'approved' | 'sent' | 'dismissed';

interface CommentItem {
  id: string;
  platform: Platform;
  author: string;
  handle: string;
  comment: string;
  sentiment: Sentiment;
  draftReply: string;
  status: ReplyStatus;
  postContext: string;
  receivedAt: string;
}

const comments: CommentItem[] = [
  {
    id: 'r1',
    platform: 'X',
    author: 'Jordan Kim',
    handle: '@jordankim_vc',
    comment: 'How does Zeus compare to Outreach? Curious about the voice component specifically.',
    sentiment: 'positive',
    draftReply: 'Great question! Zeus is purpose-built for AI-first outbound — voice agents + email in one workflow. Outreach is solid for manual SDR teams. The biggest diff: our voice agents are fully async and routed by ICP scoring. Happy to show you a demo — DM me?',
    status: 'pending',
    postContext: 'Our post about AI vs human SDRs',
    receivedAt: '4m ago',
  },
  {
    id: 'r2',
    platform: 'LinkedIn',
    author: 'Sarah Okonkwo',
    handle: 'sarah-okonkwo',
    comment: 'This is exactly what our RevOps team has been looking for. Does it integrate with Salesforce?',
    sentiment: 'positive',
    draftReply: 'Hi Sarah — yes! We have a native Salesforce sync (bidirectional on deals + contacts). HubSpot is also live. What does your current stack look like? Happy to map it out for your team.',
    status: 'pending',
    postContext: 'LinkedIn post on CRM sync launch',
    receivedAt: '12m ago',
  },
  {
    id: 'r3',
    platform: 'Reddit',
    author: 'u/skeptical_ops',
    handle: 'u/skeptical_ops',
    comment: 'Sounds like another AI hype product. What\'s the actual ROI? Show me the data.',
    sentiment: 'negative',
    draftReply: 'Fair ask — here\'s the data: our median customer sees a 2.8x lift in meetings-booked/rep within 60 days. Happy to share the full case study breakdown with methodology. What\'s your current outbound setup?',
    status: 'pending',
    postContext: 'r/sales discussion thread',
    receivedAt: '28m ago',
  },
  {
    id: 'r4',
    platform: 'Threads',
    author: 'Maria Reyes',
    handle: '@mariareyes.mkt',
    comment: 'Love this! Been following Zeus for a while. When\'s the self-serve launch?',
    sentiment: 'positive',
    draftReply: 'Hi Maria — self-serve is launching in Q3! Drop your email at zeushq.ai/waitlist and you\'ll get early access + a 30-day extended trial. Thanks for following along 🙌',
    status: 'approved',
    postContext: 'Threads post about product roadmap',
    receivedAt: '1h ago',
  },
  {
    id: 'r5',
    platform: 'X',
    author: 'Tom Ellis',
    handle: '@tellis_saas',
    comment: 'Interesting. We tried Instantly + a voice tool separately and it was a mess. How\'s the unified stack different?',
    sentiment: 'neutral',
    draftReply: 'The chaos of stitching tools is real — we\'ve been there. Zeus treats email + voice as one sequence: lead scores in Airtable, Instantly fires the email, then voice fires at step 2 if no reply. No manual handoffs. Want to see the workflow?',
    status: 'pending',
    postContext: 'Tweet about email + voice integration',
    receivedAt: '2h ago',
  },
];

const platformMeta: Record<Platform, { icon: string; color: string }> = {
  X: { icon: '𝕏', color: '#e2e8f0' },
  LinkedIn: { icon: 'in', color: '#60a5fa' },
  Reddit: { icon: '🟠', color: '#f97316' },
  Threads: { icon: '@', color: '#a1a1aa' },
};

const sentimentMeta: Record<Sentiment, { label: string; cls: string; icon: typeof ThumbsUp }> = {
  positive: { label: 'Positive', cls: 'text-emerald-400', icon: ThumbsUp },
  neutral: { label: 'Neutral', cls: 'text-zinc-400', icon: MessageCircle },
  negative: { label: 'Negative', cls: 'text-red-400', icon: ThumbsDown },
};

const statusMeta: Record<ReplyStatus, { cls: string }> = {
  pending: { cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  approved: { cls: 'bg-teal-500/10 text-teal-400 border-teal-500/20' },
  sent: { cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  dismissed: { cls: 'bg-zinc-700/50 text-zinc-500 border-zinc-700/30' },
};

const kpis = [
  { label: 'Pending Replies', value: '4', hint: 'Awaiting approval', accent: '#f59e0b' },
  { label: 'Sent Today', value: '12', hint: 'Across all platforms', accent: '#22d3ee' },
  { label: 'Positive Sentiment', value: '68%', hint: 'Of incoming comments', accent: '#10b981' },
  { label: 'Avg Response Time', value: '18m', hint: 'From mention to reply', accent: '#a78bfa' },
];

const platformFilters: (Platform | 'All')[] = ['All', 'X', 'LinkedIn', 'Reddit', 'Threads'];

export function RepliesModule() {
  const [platformFilter, setPlatformFilter] = useState<Platform | 'All'>('All');
  const [items, setItems] = useState<CommentItem[]>(comments);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingReply, setEditingReply] = useState<Record<string, string>>({});

  const filtered = items.filter(i =>
    (platformFilter === 'All' || i.platform === platformFilter) && i.status !== 'dismissed',
  );

  const approve = (id: string) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'approved' } : i));
  const send = (id: string) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'sent' } : i));
  const dismiss = (id: string) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'dismissed' } : i));

  const pendingCount = items.filter(i => i.status === 'pending').length;

  return (
    <div className="space-y-6 max-w-7xl w-full min-w-0">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-violet-500/20 zeus-mesh-hero px-4 py-6 sm:px-6 md:px-8 md:py-7">
        <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 opacity-25 bg-[radial-gradient(circle_at_center,rgba(167,139,250,0.5),transparent_70%)]" />
        <div className="relative flex items-start gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/30 bg-violet-500/10 text-violet-200">
            <MessageCircle className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-400/90">Social</p>
            <h1 className="text-2xl md:text-3xl font-semibold text-white mt-1 tracking-tight">Comment AI</h1>
            <p className="text-zinc-400 text-sm mt-1.5 leading-relaxed max-w-2xl">
              AI-drafted replies to comments and mentions. Review, edit, approve — or dismiss. Every reply tracked for outcomes.
            </p>
          </div>
          {pendingCount > 0 && (
            <span className="hidden sm:flex items-center justify-center w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 text-xs font-semibold border border-amber-500/30">
              {pendingCount}
            </span>
          )}
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

      {/* Comment inbox */}
      <div className="siren-card glass-panel overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.06] flex-wrap">
          {platformFilters.map(pf => (
            <button
              key={pf}
              onClick={() => setPlatformFilter(pf)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                platformFilter === pf
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                  : 'bg-white/[0.03] text-zinc-500 border border-white/[0.06] hover:text-zinc-300'
              }`}
            >
              {pf}
            </button>
          ))}
          <button className="ml-auto text-[11px] text-zinc-600 hover:text-zinc-400 flex items-center gap-1 transition-colors">
            <RefreshCcw className="w-3 h-3" /> Refresh
          </button>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {filtered.map(item => {
            const pm = platformMeta[item.platform];
            const sm = sentimentMeta[item.sentiment];
            const SentimentIcon = sm.icon;
            const isExpanded = expandedId === item.id;
            const currentReply = editingReply[item.id] ?? item.draftReply;

            return (
              <div key={item.id} className="hover:bg-white/[0.015] transition-colors">
                {/* Comment row */}
                <div
                  className="px-5 py-4 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar placeholder */}
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 border border-white/10 flex items-center justify-center text-xs font-semibold text-zinc-400">
                      {item.author[0]}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-sm font-medium text-white">{item.author}</span>
                        <span className="text-[11px] text-zinc-600">{item.handle}</span>
                        <span className="text-[10px] font-bold ml-0.5" style={{ color: pm.color }}>
                          {pm.icon}
                        </span>
                        <span className={`flex items-center gap-0.5 text-[10px] ${sm.cls}`}>
                          <SentimentIcon className="w-3 h-3" />
                          {sm.label}
                        </span>
                        <span
                          className={`text-[10px] font-semibold border px-1.5 py-0.5 rounded-full ml-auto ${statusMeta[item.status].cls}`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <p className="text-sm text-zinc-300 leading-relaxed">{item.comment}</p>

                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] text-zinc-600">{item.receivedAt}</span>
                        <span className="text-zinc-700">·</span>
                        <span className="text-[10px] text-zinc-600 italic truncate">{item.postContext}</span>
                        <ChevronRight
                          className={`w-3.5 h-3.5 text-zinc-600 ml-auto transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded reply drawer */}
                {isExpanded && (
                  <div className="px-5 pb-4 border-t border-white/[0.04] pt-4 bg-white/[0.01]">
                    <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-2">AI Draft Reply</p>
                    <textarea
                      value={currentReply}
                      onChange={e => setEditingReply(prev => ({ ...prev, [item.id]: e.target.value }))}
                      rows={4}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-violet-500/40 resize-none"
                    />
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      <button
                        onClick={() => dismiss(item.id)}
                        className="inline-flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-400 border border-white/[0.07] bg-white/[0.03] px-2.5 py-1.5 rounded-md transition-colors"
                      >
                        <X className="w-3 h-3" /> Dismiss
                      </button>
                      {item.status === 'pending' && (
                        <button
                          onClick={() => approve(item.id)}
                          className="inline-flex items-center gap-1 text-[11px] text-teal-400 hover:text-teal-300 border border-teal-500/20 bg-teal-500/5 px-2.5 py-1.5 rounded-md transition-colors"
                        >
                          <CheckCircle2 className="w-3 h-3" /> Approve Draft
                        </button>
                      )}
                      {(item.status === 'approved' || item.status === 'pending') && (
                        <button
                          onClick={() => send(item.id)}
                          className="ml-auto inline-flex items-center gap-1.5 text-[11px] text-violet-300 hover:text-violet-200 border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 rounded-md transition-colors font-medium"
                        >
                          <Send className="w-3 h-3" /> Send Reply
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="py-12 text-center text-zinc-600 text-sm">
              All caught up — no pending replies for {platformFilter}.
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap gap-4">
        <Link to="/social/autopost" className="inline-flex items-center gap-1.5 text-sm text-violet-400 hover:text-violet-300">
          Autopost queue <ArrowRight className="w-4 h-4" />
        </Link>
        <Link to="/social/activity" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white">
          Social activity <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
