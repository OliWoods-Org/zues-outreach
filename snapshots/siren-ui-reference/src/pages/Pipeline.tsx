import { deals, pipelineStats } from '../data/deals';
import { PipelineBar } from '../components/PipelineBar';

const stageColors: Record<string, string> = {
  Lead: 'bg-zinc-700 text-zinc-300',
  Qualified: 'bg-[rgba(59,130,246,0.15)] text-siren-blue',
  Proposal: 'bg-[rgba(139,92,246,0.15)] text-purple-400',
  Negotiation: 'bg-[rgba(249,115,22,0.15)] text-orange-400',
  Closed: 'bg-[rgba(16,185,129,0.15)] text-emerald-400',
};

const stats = [
  { label: 'Deals', value: pipelineStats.totalDeals.toString(), accent: '#a78bfa' },
  { label: 'Pipeline Value', value: `$${(pipelineStats.totalValue / 1000).toFixed(0)}K`, accent: '#10b981' },
  { label: 'Win Rate', value: `${pipelineStats.winRate}%`, accent: '#f59e0b' },
  { label: 'Avg Deal', value: `$${(pipelineStats.avgDealSize / 1000).toFixed(1)}K`, accent: '#8b5cf6' },
];

export function Pipeline() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-siren-blue mb-2">Revenue</p>
        <h2 className="text-2xl font-semibold text-white tracking-tight">Sales Pipeline</h2>
        <p className="text-sm text-[#888] mt-2">Track and manage your active deals</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map(stat => (
          <div key={stat.label} className="siren-card p-5 relative overflow-hidden glass-panel">
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ backgroundColor: stat.accent }}
            />
            <p className="text-xs text-[#888] mb-2">{stat.label}</p>
            <p className="text-2xl font-semibold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Pipeline Bar */}
        <div className="siren-card p-5 glass-panel">
        <h3 className="text-xs text-[#888] mb-4 tracking-wide uppercase">Stage Distribution</h3>
        <PipelineBar />
      </div>

      {/* Deal List */}
      <div>
        <h3 className="text-xs text-[#888] mb-4 tracking-wide uppercase">Active Deals</h3>
        <div className="siren-card overflow-hidden glass-panel">
          {/* Header */}
          <div className="grid grid-cols-[1fr_140px_100px_100px_120px] gap-4 px-5 py-3 border-b border-[rgba(255,255,255,0.06)] text-[11px] text-[#555] uppercase tracking-wider min-w-[640px]">
            <span>Company</span>
            <span>Contact</span>
            <span>Stage</span>
            <span>Value</span>
            <span>Last Activity</span>
          </div>
          <div className="overflow-x-auto">
          {/* Rows */}
          {deals.map((deal, i) => (
            <div
              key={deal.id}
              className={`grid grid-cols-[1fr_140px_100px_100px_120px] gap-4 px-5 py-3.5 items-center transition-colors duration-150 hover:bg-[rgba(255,255,255,0.02)] min-w-[640px] ${
                i < deals.length - 1 ? 'border-b border-[rgba(255,255,255,0.05)]' : ''
              }`}
            >
              <span className="text-sm text-white font-medium">{deal.company}</span>
              <span className="text-sm text-[#888]">{deal.contact}</span>
              <span>
                <span className={`text-[11px] px-2.5 py-1 rounded-full ${stageColors[deal.stage]}`}>
                  {deal.stage}
                </span>
              </span>
              <span className="text-sm text-white">${deal.value.toLocaleString()}</span>
              <span className="text-xs text-[#555]">{deal.lastActivity}</span>
            </div>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
}
