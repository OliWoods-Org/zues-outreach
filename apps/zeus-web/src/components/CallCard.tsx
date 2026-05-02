import { Call } from '../data/calls';
import { Phone, Shield, Clock } from 'lucide-react';

const statusStyles: Record<string, string> = {
  blocked: 'bg-red-900/30 text-red-400 border-red-800',
  intercepted: 'bg-yellow-900/30 text-yellow-400 border-yellow-800',
  whitelisted: 'bg-green-900/30 text-green-400 border-green-800',
};

export function CallCard({ call }: { call: Call }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-siren-red/50 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Phone size={16} className="text-siren-red" />
          <div>
            <h3 className="text-white font-semibold text-sm">{call.caller}</h3>
            <p className="text-zinc-500 text-xs">{call.number}</p>
          </div>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full border ${statusStyles[call.status]}`}>
          {call.status}
        </span>
      </div>
      <div className="flex items-center gap-4 text-xs text-zinc-400 mt-3">
        <span className="bg-zinc-800 px-2 py-0.5 rounded">{call.type}</span>
        <div className="flex items-center gap-1">
          <Shield size={12} />
          <span>{call.persona}</span>
        </div>
        <div className="flex items-center gap-1 ml-auto">
          <Clock size={12} />
          <span>{call.duration}</span>
        </div>
      </div>
      <p className="text-zinc-500 text-xs mt-2">{call.time}</p>
    </div>
  );
}
