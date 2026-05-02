import { deals } from '../data/deals';
import type { DealStage } from '../data/deals';

const stageConfig: { stage: DealStage; color: string; dot: string }[] = [
  { stage: 'Lead', color: 'bg-[#555]', dot: 'bg-[#555]' },
  { stage: 'Qualified', color: 'bg-siren-blue', dot: 'bg-siren-blue' },
  { stage: 'Proposal', color: 'bg-purple-500', dot: 'bg-purple-500' },
  { stage: 'Negotiation', color: 'bg-orange-500', dot: 'bg-orange-500' },
  { stage: 'Closed', color: 'bg-emerald-500', dot: 'bg-emerald-500' },
];

export function PipelineBar() {
  const total = deals.length;

  return (
    <div className="w-full">
      <div className="flex rounded-full overflow-hidden h-2 bg-[rgba(255,255,255,0.04)]">
        {stageConfig.map(({ stage, color }) => {
          const count = deals.filter(d => d.stage === stage).length;
          const pct = (count / total) * 100;
          if (count === 0) return null;
          return (
            <div
              key={stage}
              className={`${color} transition-all duration-300`}
              style={{ width: `${pct}%` }}
              title={`${stage}: ${count}`}
            />
          );
        })}
      </div>
      <div className="flex gap-5 mt-3">
        {stageConfig.map(({ stage, dot }) => {
          const count = deals.filter(d => d.stage === stage).length;
          return (
            <div key={stage} className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${dot}`} />
              <span className="text-[11px] text-[#555]">{stage} ({count})</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
