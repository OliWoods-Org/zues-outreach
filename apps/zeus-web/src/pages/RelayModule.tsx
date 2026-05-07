import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Code2,
  Copy,
  Globe,
  Mail,
  MessageSquare,
  Pause,
  Play,
  Plus,
  Smartphone,
  Zap,
} from 'lucide-react';
import {
  type Conversation,
  type ConvStatus,
  type Platform,
  type ProactiveRule,
  type Workflow,
  RELAY_SNAPSHOT_DEMO,
  RELAY_WORKFLOW_TEMPLATES,
  fetchRelayModuleSnapshot,
} from '../api/relay';

type RelayTab = 'conversations' | 'workflows' | 'proactive';

// ============================================================================
// Sub-components
// ============================================================================

const kpis = [
  { label: 'AI Resolution Rate', value: '72.3%', hint: 'vs 58% industry avg', accent: '#f59e0b' },
  { label: 'Active Conversations', value: '12', hint: 'Live right now', accent: '#22d3ee' },
  { label: 'This Month Saved', value: '$415', hint: 'vs Intercom Fin', accent: '#10b981' },
  { label: 'Avg Response Time', value: '1.4 min', hint: 'AI-first routing', accent: '#a78bfa' },
];

const convStatusMeta: Record<ConvStatus, { label: string; cls: string; icon: typeof CheckCircle2 }> = {
  resolved: { label: 'Resolved', cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: CheckCircle2 },
  open: { label: 'Open', cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: Clock },
  handoff: { label: 'Handoff', cls: 'bg-violet-500/10 text-violet-400 border-violet-500/20', icon: ArrowRight },
};

const platformMeta: Record<Platform, { icon: typeof Globe; label: string }> = {
  web: { icon: Globe, label: 'Web' },
  email: { icon: Mail, label: 'Email' },
  sms: { icon: Smartphone, label: 'SMS' },
};

function ConversionBadge({ rate }: { rate: number }) {
  const cls =
    rate >= 20
      ? 'text-emerald-400'
      : rate >= 10
        ? 'text-amber-400'
        : 'text-red-400';
  return <span className={`text-sm font-semibold ${cls}`}>{rate}%</span>;
}

// ============================================================================
// Tab content
// ============================================================================

function ConversationsTab({ conversations }: { conversations: Conversation[] }) {
  const open = conversations.filter(c => c.status === 'open').length;
  const resolved = conversations.filter(c => c.status === 'resolved').length;

  return (
    <div className="space-y-4">
      {/* Stats bar */}
      <div className="flex items-center gap-4 px-1">
        <span className="text-[11px] text-zinc-500">
          <span className="text-amber-400 font-semibold">{open}</span> open
        </span>
        <span className="text-zinc-700">·</span>
        <span className="text-[11px] text-zinc-500">
          <span className="text-emerald-400 font-semibold">{resolved}</span> resolved today
        </span>
        <span className="text-zinc-700">·</span>
        <span className="text-[11px] text-zinc-500">
          <span className="text-violet-400 font-semibold">847</span> total this month
        </span>
      </div>

      <div className="siren-card glass-panel divide-y divide-white/[0.04] overflow-hidden">
        {conversations.map(conv => {
          const sm = convStatusMeta[conv.status];
          const StatusIcon = sm.icon;
          const pm = platformMeta[conv.platform];
          const PlatformIcon = pm.icon;
          return (
            <div key={conv.id} className="px-5 py-4 hover:bg-white/[0.02] transition-colors cursor-pointer">
              <div className="flex items-start gap-3">
                {/* Platform icon */}
                <span className="flex-shrink-0 w-8 h-8 rounded-lg border border-white/10 bg-white/[0.04] flex items-center justify-center text-zinc-400">
                  <PlatformIcon className="w-3.5 h-3.5" />
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[11px] font-semibold text-zinc-200">{conv.customer}</span>
                    <span className="text-zinc-700">·</span>
                    <span className="text-[10px] text-zinc-600">{conv.time}</span>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed truncate">{conv.snippet}</p>
                  <div className="mt-2">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold border px-2 py-0.5 rounded-full ${sm.cls}`}>
                      <StatusIcon className="w-3 h-3" />
                      {sm.label}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WorkflowsTab({ workflows: initial }: { workflows: Workflow[] }) {
  const [workflows, setWorkflows] = useState<Workflow[]>(initial);

  useEffect(() => {
    setWorkflows(initial);
  }, [initial]);

  const toggle = (id: string) =>
    setWorkflows(prev =>
      prev.map(w => w.id === id ? { ...w, status: w.status === 'active' ? 'paused' : 'active' } : w)
    );

  return (
    <div className="space-y-4">
      {workflows.map(wf => (
        <div
          key={wf.id}
          className="siren-card glass-panel p-5 hover:border-violet-500/25 transition-colors"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <span
                className={`flex-shrink-0 w-2 h-2 rounded-full ${
                  wf.status === 'active' ? 'bg-emerald-400' : 'bg-zinc-600'
                }`}
              />
              <div className="min-w-0">
                <p className="text-sm font-medium text-white">{wf.name}</p>
                <p className="text-[11px] text-zinc-600 mt-0.5">
                  {wf.triggerCount.toLocaleString()} triggered · {wf.resolutionRate}% resolved
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  wf.status === 'active'
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-amber-500/10 text-amber-400'
                }`}
              >
                {wf.status === 'active' ? 'Active' : 'Paused'}
              </span>
              <button
                onClick={() => toggle(wf.id)}
                className="flex items-center justify-center w-8 h-8 rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
                aria-label={wf.status === 'active' ? 'Pause workflow' : 'Activate workflow'}
              >
                {wf.status === 'active' ? (
                  <Pause className="w-3.5 h-3.5 text-zinc-400" />
                ) : (
                  <Play className="w-3.5 h-3.5 text-zinc-400" />
                )}
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Create from template */}
      <div className="siren-card glass-panel p-5">
        <p className="text-[11px] text-zinc-500 uppercase tracking-wider mb-3">Create from template</p>
        <div className="flex flex-wrap gap-2">
          {RELAY_WORKFLOW_TEMPLATES.map(tpl => (
            <button
              key={tpl}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-violet-500/20 bg-violet-500/5 text-[11px] text-violet-300 hover:bg-violet-500/15 transition-colors"
            >
              <Plus className="w-3 h-3" />
              {tpl}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProactiveTab({ rules }: { rules: ProactiveRule[] }) {
  const totalSent = rules.reduce((s, r) => s + r.messagesSent, 0);
  const avgOpen = rules.length ? rules.reduce((s, r) => s + r.openRate, 0) / rules.length : 0;
  const avgConv = rules.length ? rules.reduce((s, r) => s + r.conversionRate, 0) / rules.length : 0;

  return (
    <div className="space-y-4">
      {/* Aggregate */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Messages Sent', value: totalSent },
          { label: 'Avg Open Rate', value: `${avgOpen.toFixed(1)}%` },
          { label: 'Avg Conversion', value: `${avgConv.toFixed(1)}%` },
        ].map(s => (
          <div key={s.label} className="siren-card glass-panel p-4 text-center">
            <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1">{s.label}</p>
            <p className="text-xl font-semibold text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Rules */}
      {rules.map(rule => (
        <div key={rule.name} className="siren-card glass-panel p-5 hover:border-violet-500/25 transition-colors">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white mb-3">{rule.name}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-wider">Sent</p>
                  <p className="text-sm font-semibold text-white">{rule.messagesSent}</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-wider">Open</p>
                  <p className="text-sm font-semibold text-zinc-300">{rule.openRate}%</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-wider">Response</p>
                  <p className="text-sm font-semibold text-zinc-300">{rule.responseRate}%</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-wider">Conversion</p>
                  <ConversionBadge rate={rule.conversionRate} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button className="w-full py-3 rounded-xl border border-dashed border-white/10 text-sm text-zinc-600 hover:text-zinc-400 hover:border-white/20 transition-colors flex items-center justify-center gap-2">
        <Plus className="w-4 h-4" /> Add Proactive Rule
      </button>
    </div>
  );
}

// ============================================================================
// Main component
// ============================================================================

export function RelayModule() {
  const [tab, setTab] = useState<RelayTab>('conversations');
  const [widgetOpen, setWidgetOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const { data, isPending } = useQuery({
    queryKey: ['relay', 'module'],
    queryFn: fetchRelayModuleSnapshot,
  });

  const snapshot = data ?? RELAY_SNAPSHOT_DEMO;

  const handleCopy = () => {
    navigator.clipboard.writeText(snapshot.widgetSnippet).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const tabs: { key: RelayTab; label: string; icon: typeof MessageSquare }[] = [
    { key: 'conversations', label: 'Conversations', icon: MessageSquare },
    { key: 'workflows', label: 'Workflows', icon: Zap },
    { key: 'proactive', label: 'Proactive', icon: ArrowRight },
  ];

  if (isPending && !data) {
    return (
      <div className="max-w-7xl w-full min-w-0 space-y-4">
        <div className="h-36 rounded-2xl border border-white/[0.06] bg-white/[0.02] animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 rounded-xl border border-white/[0.06] bg-white/[0.02] animate-pulse" />
          ))}
        </div>
        <p className="text-sm text-zinc-500">Loading Relay…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl w-full min-w-0">
      {/* ── Hero ── */}
      <div className="relative overflow-hidden rounded-2xl border border-violet-500/20 zeus-mesh-hero px-4 py-6 sm:px-6 md:px-8 md:py-7">
        <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 opacity-30 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.6),transparent_70%)]" />
        <div className="relative flex items-start gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/30 bg-violet-500/10 text-violet-200">
            <MessageSquare className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-400/90">Customer Comms</p>
            <h1 className="text-2xl md:text-3xl font-semibold text-white mt-1 tracking-tight">Relay</h1>
            <p className="text-zinc-400 text-sm mt-1.5 leading-relaxed max-w-2xl">
              AI resolution engine — $0.50/resolution. Intercom costs $0.99.
            </p>
          </div>
          <button
            onClick={handleCopy}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-xs text-violet-300 hover:bg-violet-500/20 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            {copied ? 'Copied!' : 'Copy Widget Code'}
          </button>
        </div>
      </div>

      {/* ── KPI Tiles ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {snapshot.kpis.map(k => (
          <div key={k.label} className="siren-card p-5 relative overflow-hidden glass-panel">
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ backgroundColor: k.accent }} />
            <p className="text-[11px] text-zinc-500 uppercase tracking-wider mb-2">{k.label}</p>
            <p className="text-2xl font-semibold text-white">{k.value}</p>
            <p className="text-[11px] text-zinc-600 mt-1">{k.hint}</p>
          </div>
        ))}
      </div>

      {/* ── Tab navigation ── */}
      <div className="flex items-center gap-1 border-b border-white/[0.07]">
        {tabs.map(({ key, label, icon: Icon }) => (
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

      {/* ── Tab content ── */}
      {tab === 'conversations' && <ConversationsTab conversations={snapshot.conversations} />}
      {tab === 'workflows' && <WorkflowsTab workflows={snapshot.workflows} />}
      {tab === 'proactive' && <ProactiveTab rules={snapshot.proactive} />}

      {/* ── Widget section (collapsible) ── */}
      <div className="siren-card glass-panel overflow-hidden">
        <button
          onClick={() => setWidgetOpen(v => !v)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors"
        >
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-medium text-white">Embeddable Widget</span>
            <span className="text-[10px] text-zinc-600 ml-1">— drop-in chat bubble for your site</span>
          </div>
          {widgetOpen ? (
            <ChevronUp className="w-4 h-4 text-zinc-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-zinc-500" />
          )}
        </button>

        {widgetOpen && (
          <div className="px-5 pb-5 space-y-4 border-t border-white/[0.06]">
            {/* Code block */}
            <div className="mt-4 relative rounded-xl bg-zinc-900/80 border border-white/[0.08] p-4 overflow-x-auto">
              <code className="text-sm font-mono text-violet-300 whitespace-nowrap">
                {snapshot.widgetSnippet}
              </code>
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-violet-500/15 border border-violet-500/25 text-[11px] text-violet-300 hover:bg-violet-500/25 transition-colors"
              >
                <Copy className="w-3 h-3" />
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5">
              {[
                'Live chat bubble (bottom-right, customizable)',
                'AI greeting + suggested topics',
                'Offline email capture',
                'Typing indicators + read receipts',
                'Conversations flow into Unified Inbox',
                'Mobile responsive',
              ].map(feat => (
                <div key={feat} className="flex items-center gap-2 text-[12px] text-zinc-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400/70 flex-shrink-0" />
                  {feat}
                </div>
              ))}
            </div>

            <p className="text-[11px] text-zinc-600">
              Add the snippet before <code className="text-zinc-400">&lt;/body&gt;</code> on any page. Replace{' '}
              <code className="text-zinc-400">relay_YOUR_TOKEN</code> with your workspace token from Settings.
            </p>
          </div>
        )}
      </div>

      {/* ── Billing comparison ── */}
      <div className="rounded-2xl border border-violet-500/15 bg-violet-950/10 p-5 md:p-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-400/80 mb-3">Billing Comparison</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <p className="text-[11px] text-emerald-400/80 mb-1">MAMA Relay</p>
            <p className="text-2xl font-semibold text-white">$0.50</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">per resolution</p>
          </div>
          <div className="rounded-xl border border-red-500/15 bg-red-500/5 p-4">
            <p className="text-[11px] text-red-400/80 mb-1">Intercom Fin</p>
            <p className="text-2xl font-semibold text-white">$0.99</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">per resolution</p>
          </div>
          <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
            <p className="text-[11px] text-violet-400/80 mb-1">Savings this month</p>
            <p className="text-2xl font-semibold text-emerald-300">$415</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">on 847 resolutions</p>
          </div>
        </div>
        <p className="text-[11px] text-zinc-600 mt-4">
          $49/mo base · $0.50/resolution · Unified inbox, workflows, widget, and proactive outreach included.{' '}
          <span className="text-zinc-500">Intercom: $39/seat/mo + $0.99/resolution + add-on fees.</span>
        </p>
      </div>
    </div>
  );
}
