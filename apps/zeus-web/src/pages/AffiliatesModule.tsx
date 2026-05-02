import { Link } from 'react-router-dom';
import { ArrowUpRight, Gift, Link2, Users, Wallet } from 'lucide-react';

const programs = [
  { id: 'p1', name: 'Elevar partner', rate: '18%', status: 'live', partners: 12 },
  { id: 'p2', name: 'Ambassador Q2', rate: '12% + bonus', status: 'live', partners: 6 },
];

const rewardsQueue = [
  { id: 'r1', partner: 'Jordan K.', amount: '$240.00', status: 'pending' as const },
  { id: 'r2', partner: 'StackForge LLC', amount: '$89.50', status: 'paid' as const },
  { id: 'r3', partner: 'Priya N.', amount: '$120.00', status: 'hold' as const },
];

const statusStyle = {
  pending: 'bg-amber-500/15 text-amber-200 border-amber-500/25',
  paid: 'bg-emerald-500/12 text-emerald-300 border-emerald-500/20',
  hold: 'bg-zinc-700/50 text-zinc-400 border-zinc-600/30',
};

export function AffiliatesModule() {
  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-400/90">Growth OS</p>
        <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight mt-1">Affiliates</h1>
        <p className="text-sm text-zinc-500 mt-2 max-w-2xl leading-relaxed">
          Viral Loops–class programs — <code className="text-teal-300/80 text-[13px]">AffiliatePrograms</code>, partners,
          links, <code className="text-teal-300/80 text-[13px]">ReferralEvents</code>,{' '}
          <code className="text-teal-300/80 text-[13px]">RewardsQueue</code>. Wire Stripe Connect or manual payouts per{' '}
          <code className="text-zinc-500 text-[13px]">docs/AFFILIATE_MODULE.md</code>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {programs.map(p => (
          <div
            key={p.id}
            className="rounded-xl border border-white/[0.08] bg-[rgba(12,14,18,0.9)] p-5 shadow-[inset_4px_0_0_0_rgba(45,212,191,0.5)]"
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <Gift className="w-5 h-5 text-teal-400/90" />
              <span className="text-[10px] uppercase tracking-wider text-emerald-400/90">{p.status}</span>
            </div>
            <h2 className="text-lg font-semibold text-white">{p.name}</h2>
            <p className="text-sm text-zinc-500 mt-1">Commission · {p.rate}</p>
            <p className="text-xs text-zinc-600 mt-3">{p.partners} active partners</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-violet-500/15 bg-violet-950/15 p-5 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-violet-400" />
            <h2 className="text-sm font-semibold text-white">Rewards queue</h2>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-zinc-500">Mock · Airtable RewardsQueue</span>
        </div>
        <ul className="space-y-2">
          {rewardsQueue.map(r => (
            <li
              key={r.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/[0.06] bg-black/20 px-3 py-2.5 text-sm"
            >
              <span className="text-white">{r.partner}</span>
              <span className="text-zinc-300 font-mono tabular-nums">{r.amount}</span>
              <span
                className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded border ${statusStyle[r.status]}`}
              >
                {r.status}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap gap-4 text-[13px] text-zinc-500">
        <span className="inline-flex items-center gap-1.5">
          <Users className="w-4 h-4 text-zinc-600" /> Partners table
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Link2 className="w-4 h-4 text-zinc-600" /> ReferralLinks + UTM
        </span>
        <Link to="/settings" className="inline-flex items-center gap-1 text-teal-400/90 hover:text-teal-300">
          Payout settings <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
