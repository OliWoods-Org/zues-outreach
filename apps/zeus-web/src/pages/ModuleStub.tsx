import { Link } from 'react-router-dom';
import { ArrowRight, Bolt, PlugZap } from 'lucide-react';

/** Placeholder for Zeus lanes — visual language distinct from generic siren-card stubs */
export function ModuleStub({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description: string;
}) {
  return (
    <div className="w-full max-w-4xl min-w-0 mx-auto space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-violet-500/20 zeus-mesh-hero px-4 py-6 sm:px-6 md:px-8 md:py-7">
        <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 opacity-30 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.4),transparent_70%)]" />
        <div className="relative flex items-start gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-teal-400/30 bg-teal-500/10 text-teal-200">
            <Bolt className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-400/90">{eyebrow ?? 'Zeus module'}</p>
            <h1 className="text-2xl md:text-3xl font-semibold text-white mt-1 tracking-tight">{title}</h1>
            <p className="text-zinc-400 text-sm mt-2 leading-relaxed max-w-2xl">{description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { step: '1', label: 'Schema', detail: 'Airtable tables per docs/AIRTABLE_ZEUS_SCHEMA.md' },
          { step: '2', label: 'Workers', detail: 'Plugin commands + scripts in zues-outreach' },
          { step: '3', label: 'Surface', detail: 'Replace this stub with live tables & actions' },
        ].map(s => (
          <div
            key={s.step}
            className="rounded-xl border border-white/[0.08] bg-[rgba(12,14,22,0.85)] px-4 py-3 shadow-[inset_4px_0_0_0_rgba(167,139,250,0.45)]"
          >
            <p className="text-[10px] text-violet-300/90 font-semibold uppercase tracking-wider">Step {s.step}</p>
            <p className="text-sm text-white font-medium mt-1">{s.label}</p>
            <p className="text-[11px] text-zinc-500 mt-1 leading-snug">{s.detail}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-teal-500/15 bg-teal-950/[0.15] px-4 py-5 sm:px-6 md:p-7">
        <div className="flex items-center gap-2 text-teal-300/90 mb-3">
          <PlugZap className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">Integration stub</span>
        </div>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Connect <code className="text-teal-300/90 text-[13px]">zues-outreach</code> plugin, Airtable bases, and optional
          TNT FastAPI per <code className="text-zinc-500 text-[13px]">docs/TNT_LOCAL_PREVIEW.md</code>. This page uses Zeus
          mesh + violet step rails — not the default glass card.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-300 hover:text-teal-200"
          >
            Back to Mission Control
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
