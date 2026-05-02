import { Link } from 'react-router-dom';
import { ArrowUpRight, Brain, Globe2, Link2, Radio } from 'lucide-react';
import type { ZeusSignal } from '../data/operations';

const sourceMeta: Record<
  ZeusSignal['source'],
  { label: string; icon: typeof Radio; href: string; ring: string }
> = {
  listen: {
    label: 'Listen',
    icon: Radio,
    href: '/listen',
    ring: 'border-teal-500/30 bg-teal-500/[0.07]',
  },
  brain: {
    label: 'Brain',
    icon: Brain,
    href: '/briefings',
    ring: 'border-violet-500/30 bg-violet-500/[0.07]',
  },
  geo: {
    label: 'GEO',
    icon: Globe2,
    href: '/brand',
    ring: 'border-cyan-500/25 bg-cyan-500/[0.06]',
  },
  affiliate: {
    label: 'Affiliate',
    icon: Link2,
    href: '/affiliates',
    ring: 'border-amber-500/25 bg-amber-500/[0.06]',
  },
};

export function ZeusIntelFeed({ signals }: { signals: ZeusSignal[] }) {
  return (
    <div className="rounded-2xl border border-violet-500/15 bg-gradient-to-b from-violet-950/25 to-transparent p-5 md:p-6 shadow-[inset_0_1px_0_0_rgba(167,139,250,0.12)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-violet-300/80">Zeus intelligence</p>
          <h3 className="text-sm font-semibold text-white mt-0.5">Cross-lane signals</h3>
        </div>
        <Link
          to="/briefings"
          className="inline-flex items-center gap-1 text-[11px] font-medium text-violet-300 hover:text-violet-200"
        >
          Briefings
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      <ul className="space-y-2.5">
        {signals.map(z => {
          const meta = sourceMeta[z.source];
          const Icon = meta.icon;
          return (
            <li key={z.id}>
              <Link
                to={meta.href}
                className={`flex gap-3 p-3 rounded-xl border transition-colors hover:bg-white/[0.03] ${meta.ring}`}
              >
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-black/30 border border-white/[0.06]">
                  <Icon className="w-4 h-4 text-white/85" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{meta.label}</span>
                    <span className="text-[10px] text-zinc-600">{z.time}</span>
                  </div>
                  <p className="text-sm text-white font-medium leading-snug truncate">{z.title}</p>
                  <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">{z.detail}</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
