import { Link } from 'react-router-dom';
import { Pause, Play, Plus, Radio, Timer } from 'lucide-react';
import { campaigns } from '../data/operations';

const statusStyle: Record<string, string> = {
  live: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  paused: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  scheduled: 'bg-siren-blue/15 text-siren-blue border-siren-blue/25',
};

export function Campaigns() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Campaigns</h2>
          <p className="text-sm text-[#555] mt-1">
            Outbound programs, agents, and dial health. Pause or schedule without losing reporting history.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg btn-primary-railway text-sm font-semibold"
        >
          <Plus className="w-4 h-4" />
          New campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="siren-card p-5 border border-[rgba(59,130,246,0.12)]">
          <div className="flex items-center gap-2 text-siren-blue mb-2">
            <Radio className="w-4 h-4" />
            <span className="text-[11px] uppercase tracking-wider">Live now</span>
          </div>
          <p className="text-3xl font-semibold text-white">{campaigns.filter(c => c.status === 'live').length}</p>
          <p className="text-xs text-[#555] mt-1">Campaigns actively dialing</p>
        </div>
        <div className="siren-card p-5">
          <div className="flex items-center gap-2 text-[#888] mb-2">
            <Timer className="w-4 h-4" />
            <span className="text-[11px] uppercase tracking-wider">Paused / scheduled</span>
          </div>
          <p className="text-3xl font-semibold text-white">{campaigns.filter(c => c.status !== 'live').length}</p>
          <p className="text-xs text-[#555] mt-1">Queued or operator-held</p>
        </div>
        <Link
          to="/analytics"
          className="siren-card p-5 hover:bg-white/[0.02] transition-colors block group border border-transparent hover:border-[rgba(59,130,246,0.2)]"
        >
          <p className="text-[11px] uppercase tracking-wider text-[#555] mb-2">Funnel</p>
          <p className="text-sm text-siren-blue group-hover:text-blue-300">View analytics →</p>
          <p className="text-xs text-[#555] mt-2">Connect → qualify → meeting rates</p>
        </Link>
      </div>

      <div className="siren-card overflow-hidden">
        <div className="grid grid-cols-[1fr_100px_80px_80px_90px_90px_100px] gap-3 px-4 py-3 border-b border-[rgba(255,255,255,0.06)] text-[11px] text-[#555] uppercase tracking-wider min-w-[720px]">
          <span>Campaign</span>
          <span>Status</span>
          <span>Agent</span>
          <span>Dials</span>
          <span>Connects</span>
          <span>Meetings</span>
          <span className="text-right">Actions</span>
        </div>
        <div className="overflow-x-auto">
          {campaigns.map((c, i) => (
            <div
              key={c.id}
              className={`grid grid-cols-[1fr_100px_80px_80px_90px_90px_100px] gap-3 px-4 py-3.5 items-center min-w-[720px] text-sm hover:bg-white/[0.02] ${
                i < campaigns.length - 1 ? 'border-b border-[rgba(255,255,255,0.04)]' : ''
              }`}
            >
              <div>
                <span className="text-white font-medium block">{c.name}</span>
                {c.nextBatch && <span className="text-[11px] text-[#555]">Next: {c.nextBatch}</span>}
              </div>
              <span className={`text-[11px] px-2 py-1 rounded-md border w-fit capitalize ${statusStyle[c.status]}`}>{c.status}</span>
              <span className="text-[#888]">{c.agent}</span>
              <span className="text-white tabular-nums">{c.dialsToday.toLocaleString()}</span>
              <span className="text-white tabular-nums">{c.connects.toLocaleString()}</span>
              <span className="text-emerald-400/90 tabular-nums">{c.meetingsBooked}</span>
              <div className="flex justify-end gap-1">
                {c.status === 'live' ? (
                  <button
                    type="button"
                    className="p-2 rounded-lg text-amber-400 hover:bg-amber-500/10"
                    title="Pause"
                    aria-label="Pause campaign"
                  >
                    <Pause className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="p-2 rounded-lg text-emerald-400 hover:bg-emerald-500/10"
                    title="Resume"
                    aria-label="Resume campaign"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
