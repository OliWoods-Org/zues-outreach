import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  ExternalLink,
  Lock,
  Package,
  Play,
  Sparkles,
  Star,
  Zap,
} from 'lucide-react';
import { MARKETPLACE_ADDONS, MOCK_WORKSPACE_ADDONS, type AddonStatus } from '../data/marketplace';

const statusConfig: Record<AddonStatus, { label: string; cls: string; action: string; actionCls: string }> = {
  active: {
    label: 'Active',
    cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    action: 'Manage',
    actionCls: 'border-emerald-500/30 text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20',
  },
  trial: {
    label: 'Trial',
    cls: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    action: 'Upgrade',
    actionCls: 'border-teal-500/30 text-teal-300 bg-teal-500/10 hover:bg-teal-500/20',
  },
  locked: {
    label: 'Locked',
    cls: 'bg-zinc-700/50 text-zinc-400 border-zinc-700/30',
    action: 'Unlock',
    actionCls: 'border-violet-500/30 text-violet-300 bg-violet-500/10 hover:bg-violet-500/20',
  },
};

const categoryFilters = ['All', 'intelligence', 'growth', 'social', 'testing'] as const;

const integrations = [
  { name: 'Apollo.io', status: 'connected', icon: '🚀', description: 'Lead enrichment + sequences' },
  { name: 'Instantly', status: 'connected', icon: '⚡', description: 'Cold email infrastructure' },
  { name: 'HubSpot', status: 'connected', icon: '🟠', description: 'CRM sync (Deals + Contacts)' },
  { name: 'Airtable', status: 'connected', icon: '🗂', description: 'ICP lists + pipeline schema' },
  { name: 'Clay', status: 'disconnected', icon: '🏺', description: 'Advanced enrichment' },
  { name: 'Calendly', status: 'connected', icon: '📅', description: 'Meeting booking' },
];

export function MarketplaceModule() {
  const [activeCategory, setActiveCategory] = useState<typeof categoryFilters[number]>('All');

  const filtered = MARKETPLACE_ADDONS.filter(
    a => activeCategory === 'All' || a.category === activeCategory,
  );

  return (
    <div className="space-y-6 max-w-7xl w-full min-w-0">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-violet-500/20 zeus-mesh-hero px-4 py-6 sm:px-6 md:px-8 md:py-7">
        <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 opacity-25 bg-[radial-gradient(circle_at_center,rgba(167,139,250,0.5),transparent_70%)]" />
        <div className="relative flex items-start gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/30 bg-violet-500/10 text-violet-200">
            <Package className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-400/90">Ecosystem</p>
            <h1 className="text-2xl md:text-3xl font-semibold text-white mt-1 tracking-tight">Marketplace</h1>
            <p className="text-zinc-400 text-sm mt-1.5 leading-relaxed max-w-2xl">
              MAMA and CoFounder addons, skills, and integrations — install in one click, billed through your plan.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[11px] text-zinc-500">
              {Object.values(MOCK_WORKSPACE_ADDONS).filter(s => s === 'active').length} active ·{' '}
              {Object.values(MOCK_WORKSPACE_ADDONS).filter(s => s === 'trial').length} trial
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Available Addons', value: MARKETPLACE_ADDONS.length.toString(), accent: '#a78bfa' },
          { label: 'Active', value: Object.values(MOCK_WORKSPACE_ADDONS).filter(s => s === 'active').length.toString(), accent: '#10b981' },
          { label: 'In Trial', value: Object.values(MOCK_WORKSPACE_ADDONS).filter(s => s === 'trial').length.toString(), accent: '#22d3ee' },
          { label: 'Integrations', value: integrations.filter(i => i.status === 'connected').length.toString(), accent: '#f59e0b' },
        ].map(k => (
          <div key={k.label} className="siren-card p-4 relative overflow-hidden glass-panel">
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ backgroundColor: k.accent }} />
            <p className="text-[11px] text-zinc-500 uppercase tracking-wider mb-1.5">{k.label}</p>
            <p className="text-2xl font-semibold text-white">{k.value}</p>
          </div>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {categoryFilters.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
              activeCategory === cat
                ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                : 'bg-white/[0.03] text-zinc-500 border border-white/[0.07] hover:text-zinc-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Addon cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(addon => {
          const addonStatus = MOCK_WORKSPACE_ADDONS[addon.id] ?? 'locked';
          const sc = statusConfig[addonStatus];
          return (
            <div
              key={addon.id}
              className="siren-card glass-panel p-6 flex flex-col hover:border-violet-500/25 transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{addon.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-white">{addon.name}</p>
                    <span
                      className={`text-[10px] font-semibold border px-1.5 py-0.5 rounded-full ${sc.cls}`}
                    >
                      {sc.label}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">{addon.priceLabel}</p>
                  {addon.trialDays > 0 && addonStatus === 'locked' && (
                    <p className="text-[10px] text-zinc-600">{addon.trialDays}d free trial</p>
                  )}
                </div>
              </div>

              {/* Tagline */}
              <p className="text-sm text-zinc-400 leading-relaxed mb-4 flex-1">{addon.tagline}</p>

              {/* Features */}
              <ul className="space-y-1.5 mb-5">
                {addon.features.slice(0, 3).map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-[11px] text-zinc-500">
                    <Check className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              {/* Powered by */}
              <div className="flex items-center gap-1.5 flex-wrap mb-4">
                {addon.poweredBy.map(p => (
                  <span
                    key={p}
                    className="text-[10px] text-zinc-600 border border-white/[0.07] bg-white/[0.03] px-1.5 py-0.5 rounded"
                  >
                    {p}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <button
                className={`w-full py-2 rounded-lg border text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${sc.actionCls}`}
              >
                {addonStatus === 'locked' ? (
                  <>
                    <Zap className="w-3.5 h-3.5" /> {sc.action} — Start Trial
                  </>
                ) : addonStatus === 'trial' ? (
                  <>
                    <Star className="w-3.5 h-3.5" /> {sc.action} to Pro
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" /> {sc.action} Settings
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Connected integrations */}
      <div className="siren-card glass-panel overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06]">
          <h3 className="text-xs text-zinc-500 uppercase tracking-wider">Connected Integrations</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.05]">
          {integrations.map(int => (
            <div
              key={int.name}
              className="flex items-center gap-3 px-5 py-4 hover:bg-white/[0.02] transition-colors"
            >
              <span className="text-xl flex-shrink-0">{int.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{int.name}</p>
                <p className="text-[11px] text-zinc-500 truncate">{int.description}</p>
              </div>
              <span
                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                  int.status === 'connected'
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-zinc-700/50 text-zinc-500'
                }`}
              >
                {int.status === 'connected' ? '● Connected' : 'Setup'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap gap-4">
        <Link to="/settings" className="inline-flex items-center gap-1.5 text-sm text-violet-400 hover:text-violet-300">
          Integration settings <ArrowRight className="w-4 h-4" />
        </Link>
        <a href="#" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white">
          CoFounder Marketplace <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
