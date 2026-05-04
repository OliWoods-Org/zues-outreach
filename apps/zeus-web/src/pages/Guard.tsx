import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MessageSquareText } from 'lucide-react';
import { calls, guardStats, personas } from '../data/calls';
import { trackZeus } from '../lib/analytics';
import { useMode } from '../App';

const stats = [
  { label: 'Intercepted', value: guardStats.callsIntercepted.toString(), accent: '#ef4444' },
  { label: 'Hours Saved', value: `${guardStats.hoursSaved}h`, accent: '#10b981' },
  { label: 'Scam Calls', value: guardStats.scamsBlocked.toString(), accent: '#f59e0b' },
  { label: 'Telemarketer', value: guardStats.telemarketersDeflected.toString(), accent: '#8b5cf6' },
];

const statusStyles: Record<string, string> = {
  blocked: 'bg-[rgba(239,68,68,0.12)] text-red-400',
  intercepted: 'bg-[rgba(249,115,22,0.12)] text-orange-400',
  whitelisted: 'bg-[rgba(16,185,129,0.12)] text-emerald-400',
};

const personaColors: Record<string, string> = {
  'Confused Grandma': 'bg-[rgba(245,158,11,0.12)] text-amber-400',
  'Hold Music Bot': 'bg-[rgba(139,92,246,0.12)] text-purple-400',
  'Survey Enthusiast': 'bg-[rgba(16,185,129,0.12)] text-emerald-400',
  'Tech Support Reverse': 'bg-[rgba(59,130,246,0.12)] text-blue-400',
  'Interested Buyer': 'bg-[rgba(239,68,68,0.12)] text-red-400',
};

export function Guard() {
  const [sensitivity, setSensitivity] = useState(75);
  const { setMode } = useMode();
  const navigate = useNavigate();

  const openDefenseChat = () => {
    trackZeus('guard_open_defense_chat', {});
    setMode('guard');
    navigate(`/chat?q=${encodeURIComponent('Show call stats for this week')}`);
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-red-400/90 mb-2">Defense</p>
        <h2 className="text-2xl font-semibold text-white tracking-tight">Guard Dashboard</h2>
        <p className="text-sm text-[#888] mt-2">AI-powered call interception and scam defense</p>
      </div>

      <section
        className="relative overflow-hidden rounded-2xl border border-rose-400/25 bg-gradient-to-br from-rose-950/35 via-[#0c080c]/90 to-[#060608] p-5 sm:p-6"
        aria-labelledby="guard-defense-assistant-heading"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex gap-3 min-w-0">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-rose-400/35 bg-rose-500/10 text-rose-200">
              <MessageSquareText className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-rose-400/90 mb-1">
                Zeus assistant
              </p>
              <h3 id="guard-defense-assistant-heading" className="text-lg font-semibold text-white tracking-tight">
                Defense assistant
              </h3>
              <p className="text-sm text-zinc-500 mt-1.5 max-w-xl leading-relaxed">
                Ask for whitelist changes, persona stats, and intercepted-call summaries — same chat as Mission
                Control, Guard-brained.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={openDefenseChat}
            className="inline-flex shrink-0 items-center justify-center gap-2 min-h-11 px-4 py-2.5 rounded-xl border border-rose-400/40 bg-rose-950/40 text-sm font-semibold text-rose-100 hover:bg-rose-900/50 hover:border-rose-400/55 transition-colors whitespace-nowrap self-start sm:self-center"
          >
            Open Defense assistant
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
        </div>
      </section>

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

      {/* Sensitivity Slider */}
      <div className="siren-card p-5 glass-panel">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs text-[#888] tracking-wide uppercase">Guard Sensitivity</h3>
          <span className="text-sm font-mono text-siren-red">{sensitivity}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={sensitivity}
          onChange={e => setSensitivity(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-[11px] text-[#555] mt-2">
          <span>Permissive</span>
          <span>Balanced</span>
          <span>Aggressive</span>
        </div>
      </div>

      {/* Personas */}
      <div className="siren-card p-5 glass-panel">
        <h3 className="text-xs text-[#888] tracking-wide uppercase mb-4">AI Personas</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {personas.map(persona => (
            <div
              key={persona.id}
              className="bg-[rgba(255,255,255,0.02)] rounded-lg p-4 text-center hover:bg-[rgba(255,255,255,0.04)] transition-all duration-150 cursor-pointer border border-[rgba(255,255,255,0.03)]"
            >
              <div
                className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-xs font-semibold text-white"
                style={{ backgroundColor: persona.color }}
              >
                {persona.name.charAt(0)}
              </div>
              <p className="text-xs font-medium text-white">{persona.name}</p>
              <p className="text-[11px] text-[#555] mt-1 line-clamp-2">{persona.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Call Log */}
      <div>
        <h3 className="text-xs text-[#888] mb-4 tracking-wide uppercase">Call Log</h3>
        <div className="siren-card overflow-hidden glass-panel">
          {/* Header */}
          <div className="grid grid-cols-[1fr_140px_140px_80px_100px] gap-4 px-5 py-3 border-b border-[rgba(255,255,255,0.06)] text-[11px] text-[#555] uppercase tracking-wider min-w-[560px]">
            <span>Phone / Caller</span>
            <span>Persona</span>
            <span>Type</span>
            <span>Duration</span>
            <span>Time</span>
          </div>
          <div className="overflow-x-auto">
          {/* Rows */}
          {calls.map((call, i) => (
            <div
              key={call.id}
              className={`grid grid-cols-[1fr_140px_140px_80px_100px] gap-4 px-5 py-3 items-center transition-colors duration-150 hover:bg-[rgba(255,255,255,0.02)] min-w-[560px] ${
                i < calls.length - 1 ? 'border-b border-[rgba(255,255,255,0.05)]' : ''
              }`}
            >
              <div>
                <span className="text-sm text-white block">{call.caller}</span>
                <span className="text-[11px] text-[#555]">{call.number}</span>
              </div>
              <span>
                <span className={`text-[11px] px-2.5 py-1 rounded-full ${personaColors[call.persona] || 'bg-[rgba(255,255,255,0.06)] text-[#888]'}`}>
                  {call.persona}
                </span>
              </span>
              <span>
                <span className={`text-[11px] px-2.5 py-1 rounded-full ${statusStyles[call.status]}`}>
                  {call.status}
                </span>
              </span>
              <span className="text-xs text-[#888] font-mono">{call.duration}</span>
              <span className="text-xs text-[#555]">{call.time}</span>
            </div>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
}
