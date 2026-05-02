import { useState } from 'react';
import { calls, guardStats, personas } from '../data/calls';

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

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-red-400/90 mb-2">Defense</p>
        <h2 className="text-2xl font-semibold text-white tracking-tight">Guard Dashboard</h2>
        <p className="text-sm text-[#888] mt-2">AI-powered call interception and scam defense</p>
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
