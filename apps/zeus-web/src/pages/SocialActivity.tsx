import { Bot, CalendarClock, MessageSquareReply } from 'lucide-react';

/** Unified tracker: autopost jobs + AI comment replies (mock rows until wired to Airtable / workers). */
const rows = [
  {
    id: '1',
    type: 'autopost' as const,
    channel: 'X / Elevar',
    summary: 'Queued thread — approved in PublishQueue',
    status: 'scheduled',
    when: 'Today 14:30',
  },
  {
    id: '2',
    type: 'reply' as const,
    channel: 'IG comment',
    summary: 'Draft reply pending approval — brand voice: Elevar',
    status: 'needs_review',
    when: '2m ago',
  },
  {
    id: '3',
    type: 'autopost' as const,
    channel: 'LinkedIn',
    summary: 'Posted — GEO snippet variant B',
    status: 'published',
    when: 'Yesterday',
  },
  {
    id: '4',
    type: 'reply' as const,
    channel: 'X mention',
    summary: 'Auto-reply sent (tier: responder SKU)',
    status: 'sent',
    when: '3h ago',
  },
];

const statusStyle: Record<string, string> = {
  scheduled: 'bg-sky-500/15 text-sky-300 border-sky-500/25',
  needs_review: 'bg-amber-500/15 text-amber-200 border-amber-500/25',
  published: 'bg-emerald-500/12 text-emerald-300 border-emerald-500/20',
  sent: 'bg-emerald-500/12 text-emerald-300 border-emerald-500/20',
};

export function SocialActivity() {
  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-400/90">Social — tracker</p>
        <h1 className="text-2xl font-semibold text-white tracking-tight mt-1">Activity</h1>
        <p className="text-sm text-zinc-500 mt-2 max-w-2xl leading-relaxed">
          One ledger for <strong className="text-zinc-300">autopost</strong> jobs and{' '}
          <strong className="text-zinc-300">AI comment / mention replies</strong> — wire to PublishQueue, responder
          actions, and approval gates (health/finance brands).
        </p>
      </div>

      <div className="rounded-2xl border border-rose-500/15 overflow-hidden shadow-[inset_0_1px_0_0_rgba(244,63,94,0.12)]">
        <div className="grid grid-cols-[1fr_2fr_1fr_1fr] gap-3 px-4 py-3 text-[10px] uppercase tracking-wider text-zinc-500 border-b border-white/[0.06] bg-rose-950/20">
          <span>Type</span>
          <span>Summary</span>
          <span>Channel</span>
          <span className="text-right">When / status</span>
        </div>
        <ul>
          {rows.map(r => (
            <li
              key={r.id}
              className="grid grid-cols-1 sm:grid-cols-[1fr_2fr_1fr_1fr] gap-2 sm:gap-3 px-4 py-3 border-b border-white/[0.04] last:border-0 items-start sm:items-center text-sm"
            >
              <div className="flex items-center gap-2">
                {r.type === 'autopost' ? (
                  <CalendarClock className="w-4 h-4 text-sky-400/90 flex-shrink-0" />
                ) : (
                  <MessageSquareReply className="w-4 h-4 text-rose-400/90 flex-shrink-0" />
                )}
                <span className="text-zinc-300 capitalize">{r.type === 'autopost' ? 'Autopost' : 'Reply AI'}</span>
              </div>
              <p className="text-white/95">{r.summary}</p>
              <span className="text-zinc-500 text-[13px]">{r.channel}</span>
              <div className="flex flex-col items-start sm:items-end gap-1">
                <span className="text-[11px] text-zinc-500">{r.when}</span>
                <span
                  className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded border ${statusStyle[r.status] ?? 'bg-zinc-800 text-zinc-400'}`}
                >
                  {r.status.replace('_', ' ')}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-[13px] text-zinc-500">
        <Bot className="w-5 h-5 text-rose-400/80 flex-shrink-0 mt-0.5" />
        <p>
          Mock data — connect Zeus workers + <code className="text-zinc-400">MAMA_AUTOPOSTER</code> patterns from{' '}
          <code className="text-zinc-400">docs/ZEUS_OUTREACH_PLAN.md</code> when pipelines exist.
        </p>
      </div>
    </div>
  );
}
