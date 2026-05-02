import { Link } from 'react-router-dom';
import { ArrowUpRight, Cpu, ExternalLink } from 'lucide-react';
import { tntApiDocsHint, tntPpcAgents } from '../data/tntPpcAgents';

export function PpcDashboard() {
  return (
    <div className="max-w-5xl space-y-8">
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-950/40 to-transparent px-6 py-7 md:px-8">
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-400/90">TNT — Adam PPC</p>
            <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight mt-1">PPC agents</h1>
            <p className="text-sm text-zinc-400 mt-2 max-w-xl leading-relaxed">
              Surfaces match the TNT FastAPI agent lanes. Runs mirror to Airtable{' '}
              <code className="text-amber-200/80 text-[13px]">PPCAgentRuns</code> per Mission Control telemetry doc.
            </p>
          </div>
          <a
            href="http://127.0.0.1:8765/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-amber-400/25 bg-amber-500/10 px-4 py-2.5 text-sm font-medium text-amber-100 hover:bg-amber-500/15 transition-colors"
          >
            <ExternalLink className="w-4 h-4 opacity-90" />
            Open TNT /docs
          </a>
        </div>
        <p className="relative text-[11px] text-zinc-500 mt-4 border-t border-white/[0.06] pt-4">{tntApiDocsHint}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {tntPpcAgents.map(a => (
          <Link
            key={a.id}
            to={`/ppc/${a.id}`}
            className="group rounded-xl border border-white/[0.08] bg-[rgba(12,10,8,0.85)] p-4 shadow-[inset_4px_0_0_0_rgba(245,158,11,0.45)] hover:border-amber-400/25 hover:bg-amber-500/[0.04] transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 text-amber-400/90">
                <Cpu className="w-4 h-4 flex-shrink-0" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">{a.agentKey}</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-amber-400 transition-colors" />
            </div>
            <h2 className="text-base font-semibold text-white mt-2">{a.label}</h2>
            <p className="text-[13px] text-zinc-500 mt-1 leading-snug">{a.blurb}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
