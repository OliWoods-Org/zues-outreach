import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { funnelSnapshot } from '../data/operations';

export function Analytics() {
  const stages = [
    { label: 'Dials', value: funnelSnapshot.dials, pct: 100 },
    { label: 'Connects', value: funnelSnapshot.connects, pct: funnelSnapshot.connectRate },
    { label: 'Qualified', value: funnelSnapshot.qualified, pct: (funnelSnapshot.qualified / funnelSnapshot.connects) * 100 },
    {
      label: 'Meetings',
      value: funnelSnapshot.meetings,
      pct: (funnelSnapshot.meetings / funnelSnapshot.qualified) * 100,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-white">Analytics</h2>
        <p className="text-sm text-[#555] mt-1">
          Voice funnel and conversion — tune scripts and campaigns against the same cohort windows.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="siren-card p-5">
          <p className="text-[11px] text-[#555] uppercase tracking-wider mb-1">Connect rate</p>
          <p className="text-3xl font-semibold text-white">{funnelSnapshot.connectRate}%</p>
          <p className="text-xs text-[#555] mt-1">Connects ÷ dials (rolling 7d)</p>
        </div>
        <div className="siren-card p-5">
          <p className="text-[11px] text-[#555] uppercase tracking-wider mb-1">Qualification rate</p>
          <p className="text-3xl font-semibold text-white">{funnelSnapshot.qualRate}%</p>
          <p className="text-xs text-[#555] mt-1">Qualified ÷ connects</p>
        </div>
        <div className="siren-card p-5 border border-emerald-500/15">
          <div className="flex items-center gap-2 text-emerald-400 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-[11px] uppercase tracking-wider">Meeting rate</span>
          </div>
          <p className="text-3xl font-semibold text-white">{funnelSnapshot.meetingRate}%</p>
          <p className="text-xs text-[#555] mt-1">Meetings ÷ qualified</p>
        </div>
      </div>

      <div className="siren-card p-6">
        <h3 className="text-xs text-[#888] tracking-wide uppercase mb-6">Funnel volume</h3>
        <div className="space-y-4">
          {stages.map((s, i) => (
            <div key={s.label}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-[#888]">{s.label}</span>
                <span className="text-white tabular-nums font-medium">{s.value.toLocaleString()}</span>
              </div>
              <div className="h-2 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-siren-blue/80 to-brand-blue/75"
                  style={{ width: `${Math.min(100, i === 0 ? 100 : (s.value / stages[0].value) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          to="/scripts"
          className="inline-flex items-center gap-2 text-sm text-siren-blue hover:text-blue-300"
        >
          Improve scripts in library <ArrowRight className="w-4 h-4" />
        </Link>
        <Link to="/campaigns" className="inline-flex items-center gap-2 text-sm text-[#888] hover:text-white">
          Back to campaigns <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
