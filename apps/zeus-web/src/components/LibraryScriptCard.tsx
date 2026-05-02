import { useState } from 'react';
import { Star } from 'lucide-react';
import type { IncludedScript, MarketplaceScript, PremiumScript } from '../data/scriptLibrary';
import {
  MARKETPLACE_CREATOR_SHARE_PERCENT,
  MARKETPLACE_PLATFORM_FEE_PERCENT,
} from '../constants/marketplace';

const categoryColors: Record<string, string> = {
  'Cold Call': 'bg-[rgba(59,130,246,0.12)] text-blue-400',
  Discovery: 'bg-[rgba(139,92,246,0.12)] text-purple-400',
  Objection: 'bg-[rgba(249,115,22,0.12)] text-orange-400',
  Closing: 'bg-[rgba(16,185,129,0.12)] text-emerald-400',
  Voicemail: 'bg-[rgba(244,63,94,0.12)] text-rose-400',
  'Follow-up': 'bg-[rgba(34,211,238,0.12)] text-cyan-400',
};

type AnyScript = IncludedScript | PremiumScript | MarketplaceScript;

export function LibraryScriptCard({
  script,
  saved,
  onSaveToggle,
}: {
  script: AnyScript;
  saved?: boolean;
  onSaveToggle?: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="siren-card p-5 hover:bg-[rgba(255,255,255,0.02)] transition-all duration-150 relative">
      {onSaveToggle && (
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            onSaveToggle(script.id);
          }}
          className={`absolute top-4 right-12 z-10 p-1.5 rounded-lg transition-colors ${
            saved ? 'text-amber-400 hover:bg-amber-500/10' : 'text-[#555] hover:text-[#888] hover:bg-white/5'
          }`}
          aria-label={saved ? 'Remove from saved' : 'Save script'}
        >
          <Star className={`w-4 h-4 ${saved ? 'fill-amber-400 text-amber-400' : ''}`} />
        </button>
      )}
      <div
        className="flex items-start justify-between gap-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
        role="button"
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setExpanded(!expanded);
          }
        }}
        aria-expanded={expanded}
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-medium text-white">{script.title}</h3>
            <span
              className={`text-[11px] px-2.5 py-0.5 rounded-full ${categoryColors[script.category] ?? 'bg-[rgba(255,255,255,0.08)] text-[#ccc]'}`}
            >
              {script.category}
            </span>
            {script.kind === 'premium' && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 font-medium">
                Premium
              </span>
            )}
            {script.kind === 'marketplace' && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-blue/15 text-brand-blue font-medium">
                Marketplace
              </span>
            )}
          </div>
          <p className="text-[#555] text-xs mt-1.5">{script.description}</p>
          <p className="text-[11px] text-zinc-600 mt-2 leading-relaxed border-l-2 border-brand-blue/35 pl-3">
            {script.principle}
          </p>
        </div>
        <svg
          className={`w-4 h-4 text-[#555] transition-transform duration-150 flex-shrink-0 mt-1 ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {script.kind === 'premium' && (
        <div className="mt-4 flex flex-wrap gap-3 items-center">
          <div className="flex flex-wrap gap-2">
            {script.metrics.map(m => (
              <div
                key={m.label}
                className="bg-[rgba(255,255,255,0.03)] rounded-lg px-3 py-2 border border-[rgba(255,255,255,0.05)]"
              >
                <p className="text-[10px] text-[#555] uppercase tracking-wide">{m.label}</p>
                <p className="text-sm font-semibold text-white">{m.value}</p>
                {m.detail && <p className="text-[10px] text-[#666] mt-0.5">{m.detail}</p>}
              </div>
            ))}
          </div>
          {script.sampleCalls != null && (
            <p className="text-[10px] text-[#555]">Sample: {script.sampleCalls.toLocaleString()} calls (cohort)</p>
          )}
          <button
            type="button"
            className="ml-auto text-xs font-medium px-4 py-2 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-colors"
            onClick={e => e.stopPropagation()}
          >
            Unlock — ${script.priceUsd}
          </button>
        </div>
      )}

      {script.kind === 'marketplace' && (
        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
          <span className="text-[#888]">
            by <span className="text-white">{script.authorName}</span>
            {script.verifiedSeller && (
              <span className="ml-1.5 text-emerald-400" title="Verified seller">
                ✓
              </span>
            )}
          </span>
          <span className="text-amber-400/90">
            ★ {script.rating.toFixed(1)} <span className="text-[#555]">({script.reviewCount})</span>
          </span>
          <span className="text-[#555]">{script.purchases.toLocaleString()} sales</span>
          <span className="text-[10px] text-[#555] ml-auto">
            Seller earns {MARKETPLACE_CREATOR_SHARE_PERCENT}% · Zeus {MARKETPLACE_PLATFORM_FEE_PERCENT}%
          </span>
          <button
            type="button"
            className="text-xs font-medium px-4 py-2 rounded-lg bg-brand-blue/20 text-brand-blue hover:bg-brand-blue/30 transition-colors"
            onClick={e => e.stopPropagation()}
          >
            Buy — ${script.priceUsd}
          </button>
        </div>
      )}

      {expanded && (
        <div className="mt-4 space-y-4 border-t border-[rgba(255,255,255,0.03)] pt-4">
          <div>
            <p className="text-[11px] text-[#888] uppercase tracking-wider mb-2">Variables</p>
            <div className="flex flex-wrap gap-1.5">
              {script.variables.map(v => (
                <span
                  key={v}
                  className="text-[11px] px-2 py-1 rounded-md bg-[rgba(59,130,246,0.1)] text-blue-300 font-mono"
                >
                  [{v}]
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            {script.lines.map((line, i) => (
              <div
                key={i}
                className="bg-[rgba(255,255,255,0.02)] rounded-lg p-3 text-sm text-[#ccc] border-l-2 border-brand-blue/70 leading-relaxed"
              >
                {line}
              </div>
            ))}
          </div>
          <div className="pt-2">
            <p className="text-[11px] text-[#888] uppercase tracking-wider mb-2">Delivery tips</p>
            <ul className="space-y-1.5">
              {script.tips.map((tip, i) => (
                <li key={i} className="text-xs text-[#888] flex items-start gap-2">
                  <span className="text-brand-blue mt-0.5">—</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
          {script.kind === 'included' && (
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                className="text-xs font-medium px-4 py-2 rounded-lg bg-brand-blue/15 text-brand-blue hover:bg-brand-blue/25 transition-colors"
                onClick={e => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(script.lines.join('\n'));
                }}
              >
                Copy script
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
