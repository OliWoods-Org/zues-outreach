import { Link } from 'react-router-dom';
import { Check, Palette, Shield, Sparkles } from 'lucide-react';

const steps = [
  { id: 1, title: 'Voice & taboos', detail: 'Writes BrandProfiles voice summary + compliance taboos', icon: Shield },
  { id: 2, title: 'Visual ID', detail: 'Logo, primary/secondary colors → BrandProfiles', icon: Palette },
  { id: 3, title: 'Unlock templates', detail: 'Checkbox completes onboarding — Publish + email shells enabled', icon: Sparkles },
];

export function BrandWizard() {
  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-400/90">Brand</p>
        <h1 className="text-2xl font-semibold text-white tracking-tight mt-1">Brand wizard</h1>
        <p className="text-sm text-zinc-500 mt-2">
          Onboarding gate per <code className="text-zinc-400 text-[13px]">docs/BRAND_WIZARD.md</code> — forms write{' '}
          <strong className="text-zinc-300">BrandProfiles</strong> in Airtable (stub UI).
        </p>
      </div>

      <ol className="space-y-4">
        {steps.map((s, i) => (
          <li
            key={s.id}
            className="flex gap-4 rounded-xl border border-white/[0.08] bg-[rgba(15,12,8,0.85)] p-4 shadow-[inset_4px_0_0_0_rgba(245,158,11,0.45)]"
          >
            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-300 text-sm font-semibold">
              {s.id}
            </span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <s.icon className="w-4 h-4 text-amber-400/90" />
                <h2 className="text-base font-medium text-white">{s.title}</h2>
              </div>
              <p className="text-[13px] text-zinc-500 mt-1">{s.detail}</p>
            </div>
            {i < steps.length - 1 ? (
              <span className="text-zinc-700 text-xs self-center hidden sm:block">→</span>
            ) : (
              <Check className="w-5 h-5 text-emerald-400/80 self-center" />
            )}
          </li>
        ))}
      </ol>

      <p className="text-[13px] text-zinc-600">
        <Link to="/brand" className="text-amber-400/90 hover:text-amber-300">
          ← Brand kit overview
        </Link>
      </p>
    </div>
  );
}
