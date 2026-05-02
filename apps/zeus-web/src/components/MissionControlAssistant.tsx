import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquareText } from 'lucide-react';
import { growthCoachPrompts } from '../data/growthCoachPrompts';

/**
 * Prominent entry to Growth coach — avoids burying chat under Voice & outbound only.
 * Copy clarifies Guard vs Growth: different assistants for different modes.
 */
export function MissionControlAssistant() {
  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-teal-400/20 bg-gradient-to-br from-teal-950/40 via-[#0a1018]/90 to-[#06080c] shadow-[inset_0_1px_0_0_rgba(45,212,191,0.12)] min-w-0"
      aria-labelledby="zeus-assistant-heading"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-teal-500/10 blur-3xl" aria-hidden />
      <div className="relative p-4 sm:p-5 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
          <div className="flex gap-3 min-w-0">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-teal-400/35 bg-teal-500/10 text-teal-200">
              <MessageSquareText className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-teal-400/90 mb-1">
                Zeus assistant
              </p>
              <h2 id="zeus-assistant-heading" className="text-lg sm:text-xl font-semibold text-white tracking-tight">
                Growth coach
              </h2>
              <p className="text-sm text-zinc-500 mt-1.5 leading-relaxed max-w-xl">
                Ask for outreach copy, objections, and pipeline help. This is your{' '}
                <strong className="text-zinc-400 font-medium">sales & growth</strong> assistant — not spam defense.
                Switch the top bar to <strong className="text-rose-300/90 font-medium">Guard</strong> for a separate{' '}
                <strong className="text-zinc-400 font-medium">Defense assistant</strong> (whitelist, personas, junk calls).
              </p>
            </div>
          </div>
          <Link
            to="/chat"
            className="inline-flex shrink-0 items-center justify-center gap-2 min-h-11 px-4 py-2.5 rounded-xl zeus-cta-surge text-sm font-semibold whitespace-nowrap self-start sm:self-center"
          >
            Open full chat
            <ArrowRight className="w-4 h-4 shrink-0" />
          </Link>
        </div>

        <p className="text-[11px] uppercase tracking-wider text-zinc-600 mb-2">Try a prompt</p>
        <div className="flex flex-wrap gap-2">
          {growthCoachPrompts.map(({ label, prompt }) => (
            <Link
              key={label}
              to={`/chat?q=${encodeURIComponent(prompt)}`}
              className="inline-flex items-center rounded-lg border border-white/[0.08] bg-black/30 px-3 py-2.5 text-left text-sm text-zinc-300 hover:border-teal-400/35 hover:bg-teal-500/[0.06] hover:text-white transition-colors min-h-[44px]"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
