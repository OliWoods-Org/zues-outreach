import { Link } from 'react-router-dom';
import { ArrowUpRight, TrendingUp } from 'lucide-react';
import { funnelSnapshot, weeklyKpis } from '../data/operations';
import { pipelineStats } from '../data/deals';

const CHART_W = 320;
const CHART_H = 96;
const PAD = { t: 8, r: 4, b: 20, l: 4 };

function ConnectRateAreaChart() {
  const values = weeklyKpis.connectRatePct;
  const min = Math.min(...values) - 0.5;
  const max = Math.max(...values) + 0.5;
  const range = max - min || 1;
  const innerW = CHART_W - PAD.l - PAD.r;
  const innerH = CHART_H - PAD.t - PAD.b;
  const step = innerW / (values.length - 1);

  const points = values.map((v, i) => {
    const x = PAD.l + i * step;
    const y = PAD.t + innerH - ((v - min) / range) * innerH;
    return { x, y };
  });

  const lineD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const areaD = `${lineD} L ${(PAD.l + innerW).toFixed(1)} ${(PAD.t + innerH).toFixed(1)} L ${PAD.l.toFixed(1)} ${(PAD.t + innerH).toFixed(1)} Z`;

  const last = values[values.length - 1]!;
  const prev = values[values.length - 2] ?? last;
  const delta = last - prev;

  return (
    <div className="zeus-surface p-4 md:p-5 flex flex-col min-h-[180px] sm:min-h-[200px] min-w-0">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between mb-1">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.14em] text-teal-500/80">Connect rate</p>
          <p className="text-xl sm:text-2xl font-semibold text-white tabular-nums mt-0.5">
            {last.toFixed(1)}
            <span className="text-sm font-medium text-zinc-500 ml-1">%</span>
          </p>
        </div>
        <span
          className={`text-[11px] font-medium tabular-nums px-2 py-1 rounded-md shrink-0 self-start sm:self-auto ${
            delta >= 0 ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
          }`}
        >
          {delta >= 0 ? '+' : ''}
          {delta.toFixed(1)} vs prior day
        </span>
      </div>
      <p className="text-[11px] text-zinc-600 mb-3">Rolling 7-day outbound dial → conversation quality</p>
      <div className="flex-1 min-h-[96px] sm:min-h-[112px] min-w-0">
        <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} className="w-full h-[88px] sm:h-[112px] overflow-visible" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="mc-area-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(45, 212, 191, 0.35)" />
              <stop offset="100%" stopColor="rgba(45, 212, 191, 0)" />
            </linearGradient>
            <linearGradient id="mc-line-stroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#14b8a6" />
              <stop offset="45%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#d4a855" />
            </linearGradient>
          </defs>
          <path d={areaD} fill="url(#mc-area-fill)" />
          <path d={lineD} fill="none" stroke="url(#mc-line-stroke)" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={i === points.length - 1 ? 4 : 2.5}
              fill="#0a0a0c"
              stroke="#2dd4bf"
              strokeWidth={i === points.length - 1 ? 2 : 1.5}
            />
          ))}
        </svg>
        <div className="flex justify-between text-[9px] text-zinc-600 font-medium mt-1 px-0.5">
          {weeklyKpis.days.map(d => (
            <span key={d}>{d}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function MeetingsBarChart() {
  const values = weeklyKpis.meetingsBooked;
  const max = Math.max(...values, 1);
  const barW = 28;
  const gap = (320 - values.length * barW) / (values.length + 1);

  return (
    <div className="zeus-surface p-4 md:p-5 flex flex-col min-h-[180px] sm:min-h-[200px] min-w-0">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between mb-1">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.14em] text-teal-500/80">Meetings booked</p>
          <p className="text-xl sm:text-2xl font-semibold text-white tabular-nums mt-0.5">
            {values.reduce((a, b) => a + b, 0)}
            <span className="text-sm font-medium text-zinc-500 ml-1">this week</span>
          </p>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-brand-gold bg-brand-gold/10 px-2 py-1 rounded-md shrink-0 self-start">
          <TrendingUp className="w-3 h-3 shrink-0" />
          +18% WoW
        </span>
      </div>
      <p className="text-[11px] text-zinc-600 mb-3">Qualified meetings attributed to voice outreach</p>
      <div className="flex-1 flex items-end min-h-[104px] sm:min-h-[120px] min-w-0 overflow-x-auto sm:overflow-x-visible [-webkit-overflow-scrolling:touch]">
        <svg viewBox="0 0 320 120" className="w-full min-w-[260px] sm:min-w-0 h-[100px] sm:h-[120px]" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="mc-bar-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(212, 168, 85, 0.95)" />
              <stop offset="100%" stopColor="rgba(79, 142, 247, 0.35)" />
            </linearGradient>
          </defs>
          {values.map((v, i) => {
            const h = (v / max) * 88;
            const x = gap + i * (barW + gap);
            const y = 100 - h;
            return (
              <g key={i}>
                <rect x={x} y={y} width={barW} height={h} rx="6" fill="url(#mc-bar-fill)" opacity={0.85 + (i / values.length) * 0.15} />
                <text x={x + barW / 2} y={108} textAnchor="middle" fill="#71717a" fontSize={9} fontWeight={500}>
                  {weeklyKpis.days[i]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function ConversionFunnelChart() {
  const { dials, connects, qualified, meetings, connectRate, meetingRate } = funnelSnapshot;
  const stages = [
    { label: 'Dials', value: dials, widthPct: 100, color: 'rgba(255,255,255,0.12)' },
    { label: 'Connects', value: connects, widthPct: (connects / dials) * 100, sub: `${connectRate}% rate`, color: 'rgba(79, 142, 247, 0.35)' },
    { label: 'Qualified', value: qualified, widthPct: (qualified / dials) * 100, sub: 'Post-connect', color: 'rgba(79, 142, 247, 0.5)' },
    { label: 'Meetings', value: meetings, widthPct: (meetings / dials) * 100, sub: `${meetingRate}% of connects`, color: 'rgba(212, 168, 85, 0.55)' },
  ];

  return (
    <div className="zeus-surface p-4 md:p-5 flex flex-col min-h-[180px] sm:min-h-[200px] min-w-0">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between mb-1">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.14em] text-teal-500/75">Conversion funnel</p>
          <p className="text-xl sm:text-2xl font-semibold text-white tabular-nums mt-0.5">
            {meetingRate}%
            <span className="text-sm font-medium text-zinc-500 ml-1">meet / connect</span>
          </p>
        </div>
        <span className="text-[11px] font-medium text-zinc-400 tabular-nums shrink-0">Win {pipelineStats.winRate}%</span>
      </div>
      <p className="text-[11px] text-zinc-600 mb-4">Stage-throughput · workspace rolling window</p>
      <div className="space-y-2.5 flex-1">
        {stages.map((s, i) => (
          <div key={s.label}>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-zinc-400">{s.label}</span>
              <span className="text-white font-medium tabular-nums">{s.value.toLocaleString()}</span>
            </div>
            <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.max(s.widthPct, 2)}%`,
                  backgroundColor: s.color,
                  boxShadow: i === stages.length - 1 ? '0 0 16px rgba(212, 168, 85, 0.25)' : undefined,
                }}
              />
            </div>
            {s.sub && <p className="text-[10px] text-zinc-600 mt-0.5">{s.sub}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

export function MissionKpiCharts() {
  return (
    <section className="space-y-3 min-w-0" aria-label="Key performance indicators">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-2">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.18em] text-brand-blue">Execution lane</p>
          <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight">Voice conversion & dial throughput</h2>
          <p className="text-[11px] text-zinc-600 mt-1 max-w-lg">
            Dial metrics stay on teal surge surfaces — separate from Growth OS pulse above.
          </p>
        </div>
        <Link
          to="/analytics"
          className="inline-flex items-center justify-center gap-1 min-h-10 shrink-0 text-xs font-medium text-brand-blue hover:text-sky-300 transition-colors px-2 -mx-2 rounded-lg sm:min-h-0 sm:px-0 sm:mx-0"
        >
          View analytics
          <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 min-w-0">
        <ConnectRateAreaChart />
        <MeetingsBarChart />
        <ConversionFunnelChart />
      </div>
    </section>
  );
}
