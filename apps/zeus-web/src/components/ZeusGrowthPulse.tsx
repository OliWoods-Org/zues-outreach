import { Link } from 'react-router-dom';
import { Activity, Database, Globe, Megaphone } from 'lucide-react';
import { growthOsPulse } from '../data/operations';

function GeoRing({ score }: { score: number }) {
  const r = 36;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  return (
    <div className="flex items-center gap-3">
      <svg width="72" height="72" viewBox="0 0 88 88" className="flex-shrink-0 -rotate-90">
        <defs>
          <linearGradient id="geo-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        <circle cx="44" cy="44" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        <circle
          cx="44"
          cy="44"
          r={r}
          fill="none"
          stroke="url(#geo-ring)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <div>
        <p className="text-2xl font-semibold text-white tabular-nums leading-none">{score}</p>
        <p className="text-[10px] uppercase tracking-wider text-violet-300/80 mt-1">GEO readiness</p>
      </div>
    </div>
  );
}

/**
 * Growth OS metrics — teal / violet / amber lane (visually separate from voice KPI charts).
 */
export function ZeusGrowthPulse() {
  const g = growthOsPulse;
  return (
    <section className="space-y-3 min-w-0" aria-label="Growth OS pulse">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-teal-400/90">Growth OS</p>
          <h2 className="text-lg font-semibold text-white tracking-tight">Pulse · intelligence → action</h2>
        </div>
        <p className="text-[11px] text-zinc-500 max-w-sm">
          Mock telemetry — wire to Airtable + workers per <code className="text-zinc-400">docs/AIRTABLE_ZEUS_SCHEMA.md</code>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        <Link
          to="/listen"
          className="group zeus-surface-muted zeus-tile-accent-teal p-4 md:p-5 flex flex-col min-h-[140px] hover:border-teal-400/30 transition-colors min-w-0"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-teal-300/90">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-40" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-400" />
              </span>
              Listen
            </span>
            <Activity className="w-4 h-4 text-teal-400/70 group-hover:text-teal-300 transition-colors" />
          </div>
          <p className="text-3xl font-semibold text-white tabular-nums">{g.listenMentions24h}</p>
          <p className="text-[11px] text-zinc-500 mt-1">mentions · 24h</p>
          <p className="text-xs text-amber-300/90 mt-auto pt-3 border-t border-white/[0.06]">
            {g.listenTierBreaches} tier cap alerts
          </p>
        </Link>

        <Link
          to="/publish"
          className="group zeus-surface-muted zeus-tile-accent-amber p-4 md:p-5 flex flex-col min-h-[140px] hover:border-amber-400/25 transition-colors min-w-0"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-300/85">Publish</span>
            <Megaphone className="w-4 h-4 text-amber-400/70" />
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 items-baseline">
            <div className="min-w-0">
              <p className="text-3xl font-semibold text-white tabular-nums">{g.publishQueued}</p>
              <p className="text-[11px] text-zinc-500">queued</p>
            </div>
            <div className="text-zinc-600 hidden xs:inline">·</div>
            <div className="min-w-0">
              <p className="text-xl font-semibold text-zinc-200 tabular-nums">{g.publishScheduled48h}</p>
              <p className="text-[11px] text-zinc-500">in 48h</p>
            </div>
          </div>
          <p className="text-[11px] text-zinc-500 mt-auto pt-3">Approved rows → channels</p>
        </Link>

        <Link
          to="/brand"
          className="group zeus-surface-muted zeus-tile-accent-violet p-4 md:p-5 flex flex-col justify-between min-h-[140px] hover:border-violet-400/25 transition-colors min-w-0"
        >
          <div className="flex items-center justify-between w-full mb-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-violet-300/90">Brand & GEO</span>
            <Globe className="w-4 h-4 text-violet-400/70" />
          </div>
          <GeoRing score={g.geoReadinessScore} />
          <p className="text-[11px] text-zinc-500 mt-2">Snippets, schema, positioning</p>
        </Link>

        <div className="zeus-surface-muted p-4 md:p-5 flex flex-col min-h-[140px] border border-white/[0.06] min-w-0">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Pipeline brain</span>
            <Database className="w-4 h-4 text-cyan-400/70" />
          </div>
          <p className="text-sm text-white font-medium">Airtable synced</p>
          <p className="text-2xl font-semibold text-teal-300/95 tabular-nums mt-1">{g.airtableLastSyncLabel}</p>
          <p className="text-[11px] text-zinc-500 mt-auto pt-3">
            {g.affiliateActiveLinks} affiliate links live ·{' '}
            <Link to="/affiliates" className="text-teal-400/90 hover:text-teal-300 py-2 inline-block align-middle">
              Affiliates
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
