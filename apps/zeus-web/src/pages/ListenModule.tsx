import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Ear, Gauge, Plus, RefreshCw, Radio, X, ExternalLink } from 'lucide-react';
import { socialApi, type ListenStatus, type TrendPost, type ListenKeyword } from '../lib/api/social';
import { ph } from '../lib/posthog';

const PLATFORM_COLORS: Record<string, string> = {
  reddit: 'text-orange-400',
  twitter: 'text-sky-400',
  hackernews: 'text-amber-400',
  github: 'text-purple-400',
};

const PLATFORM_LABELS: Record<string, string> = {
  reddit: 'Reddit',
  twitter: 'X/Twitter',
  hackernews: 'HN',
  github: 'GitHub',
};

function useFetch<T>(fetcher: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await fetcher());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { void load(); }, [load]);
  return { data, loading, error, reload: load };
}

export function ListenModule() {
  const { data: status, loading: statusLoading } = useFetch(() => socialApi.status());
  const { data: posts, loading: postsLoading, reload: reloadPosts } = useFetch(() => socialApi.feed(50));
  const { data: keywords, loading: kwLoading, reload: reloadKw } = useFetch(() => socialApi.keywords());

  const [newKw, setNewKw] = useState('');
  const [newPlatform, setNewPlatform] = useState('reddit');
  const [scanning, setScanning] = useState(false);

  const triggerScan = async () => {
    setScanning(true);
    try {
      await socialApi.triggerScan();
      ph('manual_scan_triggered', { product: 'zeus' });
      setTimeout(() => { void reloadPosts(); setScanning(false); }, 3000);
    } catch {
      setScanning(false);
    }
  };

  const addKeyword = async () => {
    if (!newKw.trim()) return;
    await socialApi.addKeyword(newKw.trim(), newPlatform);
    setNewKw('');
    void reloadKw();
  };

  const removeKeyword = async (id: string) => {
    await socialApi.removeKeyword(id);
    void reloadKw();
  };

  const cap = status?.dailyCap ?? 500;
  const used = status?.postsToday ?? 0;
  const pct = Math.min(100, Math.round((used / cap) * 100));
  const activeKw = keywords?.filter(k => k.active).length ?? (kwLoading ? '…' : 0);

  return (
    <div className="w-full max-w-5xl min-w-0 space-y-8">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-400/90">Growth OS · Listen</p>
        <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight mt-1">Listen</h1>
        <p className="text-sm text-zinc-500 mt-2 leading-relaxed">
          Social intelligence — TrendPosts from Reddit, X, HackerNews, GitHub. Separate from Comment AI (responder).
        </p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border border-white/[0.08] bg-black/30 p-4">
          <Gauge className="w-5 h-5 text-teal-400 mb-2" />
          <p className="text-[10px] uppercase text-zinc-500">Posts today / cap</p>
          <p className="text-2xl font-semibold text-white mt-1">
            {statusLoading ? '…' : used}
            <span className="text-sm text-zinc-600 ml-1">/ {cap}</span>
          </p>
          <div className="mt-2 h-1.5 rounded-full bg-white/[0.06]">
            <div className="h-full rounded-full bg-teal-500/70" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-black/30 p-4">
          <Ear className="w-5 h-5 text-teal-400 mb-2" />
          <p className="text-[10px] uppercase text-zinc-500">Active keywords</p>
          <p className="text-2xl font-semibold text-white mt-1">{kwLoading ? '…' : activeKw}</p>
          <p className="text-[11px] text-zinc-600 mt-1">Monitoring ListenKeywords</p>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-black/30 p-4">
          <Radio className="w-5 h-5 text-emerald-400 mb-2" />
          <p className="text-[10px] uppercase text-zinc-500">Listener status</p>
          <p className="text-sm font-medium mt-1">
            {statusLoading ? (
              <span className="text-zinc-500">Checking…</span>
            ) : status?.running ? (
              <span className="text-emerald-400">Running</span>
            ) : (
              <span className="text-zinc-500">Idle</span>
            )}
          </p>
          {status?.lastScanAt && (
            <p className="text-[11px] text-zinc-600 mt-1">
              Last scan: {new Date(status.lastScanAt).toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 items-center">
        <button
          type="button"
          onClick={() => void triggerScan()}
          disabled={scanning}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-500/15 border border-teal-500/30 text-teal-300 text-sm font-medium hover:bg-teal-500/25 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${scanning ? 'animate-spin' : ''}`} />
          {scanning ? 'Scanning…' : 'Scan now'}
        </button>
        <Link to="/social/activity" className="text-sm text-zinc-400 hover:text-white inline-flex items-center gap-1">
          Activity tracker <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {/* Keyword manager */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-4">
        <h2 className="text-sm font-medium text-white">Keywords</h2>
        <div className="flex gap-2">
          <input
            value={newKw}
            onChange={e => setNewKw(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') void addKeyword(); }}
            placeholder="e.g. AI outreach tool"
            className="flex-1 min-w-0 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-teal-500/40"
          />
          <select
            value={newPlatform}
            onChange={e => setNewPlatform(e.target.value)}
            className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-2 py-2 text-sm text-zinc-300 focus:outline-none"
          >
            <option value="reddit">Reddit</option>
            <option value="twitter">X</option>
            <option value="hackernews">HN</option>
            <option value="github">GitHub</option>
          </select>
          <button
            type="button"
            onClick={() => void addKeyword()}
            className="p-2 rounded-lg bg-teal-500/15 border border-teal-500/30 text-teal-300 hover:bg-teal-500/25 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {kwLoading ? (
          <p className="text-sm text-zinc-600">Loading keywords…</p>
        ) : keywords?.length ? (
          <div className="flex flex-wrap gap-2">
            {keywords.map(kw => (
              <span
                key={kw.id}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${
                  kw.active ? 'border-teal-500/25 bg-teal-500/10 text-teal-300' : 'border-white/[0.06] text-zinc-500'
                }`}
              >
                <span className={PLATFORM_COLORS[kw.platform] ?? 'text-zinc-400'}>
                  {PLATFORM_LABELS[kw.platform] ?? kw.platform}
                </span>
                · {kw.keyword}
                <button
                  type="button"
                  onClick={() => void removeKeyword(kw.id)}
                  className="text-zinc-600 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-600">No keywords yet — add one above.</p>
        )}
      </div>

      {/* TrendPosts feed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-white">TrendPosts</h2>
          {postsLoading && <span className="text-xs text-zinc-600">Loading…</span>}
        </div>

        {posts?.length === 0 && !postsLoading && (
          <div className="rounded-xl border border-white/[0.06] p-8 text-center text-sm text-zinc-600">
            No posts yet — trigger a scan or add keywords to start listening.
          </div>
        )}

        {posts?.map(post => <TrendPostCard key={post.id} post={post} />)}
      </div>
    </div>
  );
}

function TrendPostCard({ post }: { post: TrendPost }) {
  const color = PLATFORM_COLORS[post.platform] ?? 'text-zinc-400';
  const label = PLATFORM_LABELS[post.platform] ?? post.platform;

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-4 space-y-2 hover:border-white/[0.12] transition-colors">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`text-[10px] font-semibold uppercase tracking-wider ${color}`}>{label}</span>
          <span className="text-[10px] text-zinc-600">·</span>
          <span className="text-[10px] text-zinc-500 truncate">{post.keyword}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[10px] text-zinc-600">{new Date(post.capturedAt).toLocaleDateString()}</span>
          <span className="text-[10px] font-mono text-teal-400/80">↑{post.score}</span>
          {post.url && (
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-600 hover:text-white"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
      <p className="text-sm text-white font-medium leading-snug">{post.title}</p>
      {post.text && (
        <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">{post.text}</p>
      )}
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-zinc-600">@{post.author}</span>
        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
          post.status === 'new' ? 'border-teal-500/25 text-teal-400 bg-teal-500/10' :
          post.status === 'responded' ? 'border-emerald-500/25 text-emerald-400 bg-emerald-500/10' :
          'border-white/[0.06] text-zinc-600'
        }`}>
          {post.status}
        </span>
      </div>
    </div>
  );
}
