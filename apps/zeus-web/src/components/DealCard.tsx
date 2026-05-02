import { Deal } from '../data/deals';
import { DollarSign, Clock, ArrowRight } from 'lucide-react';

const stageColors: Record<string, string> = {
  Lead: 'bg-gray-600',
  Qualified: 'bg-blue-600',
  Proposal: 'bg-yellow-600',
  Negotiation: 'bg-purple-600',
  Closed: 'bg-green-600',
};

export function DealCard({ deal }: { deal: Deal }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-siren-blue/50 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-white font-semibold">{deal.company}</h3>
          <p className="text-zinc-400 text-sm">{deal.contact}</p>
        </div>
        <span className={`${stageColors[deal.stage]} text-white text-xs px-2 py-1 rounded-full`}>
          {deal.stage}
        </span>
      </div>
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1 text-green-400">
          <DollarSign size={14} />
          <span>${deal.value.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1 text-zinc-400">
          <Clock size={14} />
          <span>{deal.lastActivity}</span>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1 text-xs text-siren-blue">
        <ArrowRight size={12} />
        <span>{deal.nextStep}</span>
      </div>
    </div>
  );
}
