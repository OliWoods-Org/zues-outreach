import { Link } from 'react-router-dom';
import { Ear, Gauge } from 'lucide-react';

export function ListenModule() {
  return (
    <div className="w-full max-w-4xl min-w-0 space-y-8">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-400/90">Growth OS · Listen</p>
        <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight mt-1">Listen</h1>
        <p className="text-sm text-zinc-500 mt-2 leading-relaxed">
          Intelligence lane — TrendPosts, ListenKeywords, tier caps. Separate SKU from Comment AI (responder).
          Reference: <code className="text-teal-300/80 text-[13px]">docs/SOCIAL_LISTEN_TIERS.md</code>.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border border-white/[0.08] bg-black/30 p-4">
          <Gauge className="w-5 h-5 text-teal-400 mb-2" />
          <p className="text-[10px] uppercase text-zinc-500">Daily cap (mock)</p>
          <p className="text-2xl font-semibold text-white mt-1">200</p>
          <p className="text-[11px] text-zinc-600 mt-1">TrendPosts / day · Listen Pro</p>
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-black/30 p-4">
          <Ear className="w-5 h-5 text-teal-400 mb-2" />
          <p className="text-[10px] uppercase text-zinc-500">Keyword slots</p>
          <p className="text-2xl font-semibold text-white mt-1">25</p>
          <p className="text-[11px] text-zinc-600 mt-1">Active ListenKeywords</p>
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-black/30 p-4">
          <p className="text-[10px] uppercase text-zinc-500">Responder</p>
          <p className="text-sm text-zinc-400 mt-2 leading-snug">Not counted here — see Social → Comment AI</p>
        </div>
      </div>

      <div className="rounded-2xl border border-teal-500/15 p-5 text-sm text-zinc-500">
        Plugin: <code className="text-teal-300/90">/social-listen</code> · Worker:{' '}
        <code className="text-zinc-400">scripts/trendposts_append.py</code>
      </div>

      <Link to="/social/activity" className="text-sm text-teal-400 hover:text-teal-300">
        Open Social activity tracker →
      </Link>
    </div>
  );
}
