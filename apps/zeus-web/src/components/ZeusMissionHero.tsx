import { Link } from 'react-router-dom';
import { ArrowRight, Bolt, Ear, PenLine, Target } from 'lucide-react';

/**
 * Zeus-only command strip: mesh hero + surge CTAs (distinct from Siren’s flat ops header).
 */
export function ZeusMissionHero() {
  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-teal-500/20 zeus-mesh-hero shadow-[0_0_0_1px_rgba(34,211,238,0.08),0_12px_48px_rgba(0,0,0,0.55)] min-w-0"
      aria-label="Zeus command"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.9)_0.5px,transparent_0.5px)] bg-[length:24px_24px]" />
      <div className="relative px-4 py-5 sm:px-5 sm:py-6 md:px-8 md:py-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 sm:gap-6">
        <div className="max-w-xl space-y-3 min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/25 bg-teal-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-teal-200/90">
            <Bolt className="w-3.5 h-3.5 text-zeus-surge shrink-0" aria-hidden />
            Unified stack
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white tracking-tight leading-tight">
            One surface for listen, publish, and pipeline — without switching products.
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Zeus routes intelligence into execution: social listen → ICP → outbound → brand & GEO — Mission Control is the
            spine, not a dial-only CRM.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 w-full lg:w-auto lg:justify-end lg:max-w-md shrink-0">
          <Link
            to="/listen"
            className="inline-flex items-center justify-center gap-2 min-h-10 px-4 py-3 rounded-xl zeus-cta-surge text-sm font-semibold shadow-lg w-full sm:w-auto"
          >
            <Ear className="w-4 h-4 opacity-90" />
            Open Listen
            <ArrowRight className="w-4 h-4 opacity-80" />
          </Link>
          <Link
            to="/target"
            className="inline-flex items-center justify-center gap-2 min-h-10 px-4 py-3 rounded-xl border border-violet-400/25 bg-violet-500/[0.07] text-sm font-medium text-violet-100 hover:bg-violet-500/12 transition-colors w-full sm:w-auto"
          >
            <Target className="w-4 h-4 text-violet-300" />
            Target ICP
          </Link>
          <Link
            to="/publish"
            className="inline-flex items-center justify-center gap-2 min-h-10 px-4 py-3 rounded-xl border border-amber-400/20 bg-amber-500/[0.06] text-sm font-medium text-amber-100/95 hover:bg-amber-500/10 transition-colors w-full sm:w-auto"
          >
            <PenLine className="w-4 h-4 text-amber-400/90" />
            Publish queue
          </Link>
        </div>
      </div>
    </section>
  );
}
