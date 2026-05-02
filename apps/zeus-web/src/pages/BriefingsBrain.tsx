import { Link } from 'react-router-dom';
import { Brain, Calendar, Sparkles, Sun } from 'lucide-react';

const suggestions = [
  { id: 's1', type: 'PPC', title: 'Raise branded campaign bid cap +8% Tue–Thu', status: 'Proposed' },
  { id: 's2', type: 'SEO', title: 'Add FAQ schema to pricing — GEO snippet gap', status: 'Proposed' },
  { id: 's3', type: 'Hook', title: 'Reuse hook variant B on X (winner last week)', status: 'Approved' },
];

export function BriefingsBrain() {
  return (
    <div className="max-w-5xl space-y-8">
      <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-950/35 to-transparent p-6 md:p-8">
        <div className="flex items-start gap-3 mb-4">
          <Sun className="w-6 h-6 text-amber-400 flex-shrink-0" />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-300/90">Morning brief</p>
            <p className="text-white font-medium mt-1">Leads +47 vs yesterday · Listen spike on “telehealth testosterone” · PPC pacing OK</p>
            <p className="text-xs text-zinc-500 mt-2">
              Mock summary — wire to Airtable **`MetricsSnapshots`** + **`TrendPosts`** per{' '}
              <code className="text-zinc-400 text-[11px]">docs/INTELLIGENCE_LOOP.md</code>.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 text-[11px] text-zinc-500">
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Weekly optimizer run · configurable cron
          </span>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-violet-400" />
          <h2 className="text-lg font-semibold text-white">Growth Brain — suggestions</h2>
        </div>
        <p className="text-sm text-zinc-500 mb-4">
          Approval-gated outputs to **`OptimizationSuggestions`**; jobs logged in **`AgentRuns`**. See{' '}
          <code className="text-zinc-400 text-[13px]">docs/GROWTH_BRAIN_OPTIMIZER.md</code>.
        </p>
        <ul className="space-y-2">
          {suggestions.map(s => (
            <li
              key={s.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3"
            >
              <div>
                <span className="text-[10px] uppercase tracking-wider text-zinc-600">{s.type}</span>
                <p className="text-sm text-white font-medium">{s.title}</p>
              </div>
              <span
                className={`text-[10px] uppercase px-2 py-0.5 rounded border ${
                  s.status === 'Approved'
                    ? 'border-emerald-500/30 text-emerald-400'
                    : 'border-amber-500/25 text-amber-200'
                }`}
              >
                {s.status}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-teal-500/15 bg-teal-950/10 p-4 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
        <p className="text-[13px] text-zinc-500 leading-relaxed">
          Persona hypotheses + hook library refresh ship after **`PhrasePerformance`** volume — see plan §17.
        </p>
      </div>

      <p className="text-[11px] text-zinc-600">
        <Link to="/" className="text-teal-400/90 hover:text-teal-300">
          ← Mission Control
        </Link>
      </p>
    </div>
  );
}
