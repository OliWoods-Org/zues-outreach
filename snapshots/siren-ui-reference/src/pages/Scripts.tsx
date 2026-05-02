import { useCallback, useEffect, useMemo, useState } from 'react';
import { Bookmark, Search } from 'lucide-react';
import { LibraryScriptCard } from '../components/LibraryScriptCard';
import {
  includedScripts,
  premiumScripts,
  marketplaceScripts,
  metricsDisclaimer,
  type MarketplaceScript,
} from '../data/scriptLibrary';
import {
  MARKETPLACE_CREATOR_SHARE_PERCENT,
  MARKETPLACE_PLATFORM_FEE_PERCENT,
} from '../constants/marketplace';

type TabId = 'included' | 'premium' | 'marketplace' | 'sell';

const tabs: { id: TabId; label: string }[] = [
  { id: 'included', label: 'Included' },
  { id: 'premium', label: 'Premium' },
  { id: 'marketplace', label: 'Marketplace' },
  { id: 'sell', label: 'Sell' },
];

const categories = ['All', 'Cold Call', 'Discovery', 'Objection', 'Closing', 'Voicemail', 'Follow-up'] as const;

type MarketplaceSort = 'popular' | 'rating' | 'price_low' | 'price_high';

const STORAGE_SAVED = 'siren-saved-scripts';

function loadSaved(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_SAVED);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function matchesSearch(
  q: string,
  fields: { title: string; description: string; principle: string }
): boolean {
  if (!q.trim()) return true;
  const s = q.toLowerCase();
  return (
    fields.title.toLowerCase().includes(s) ||
    fields.description.toLowerCase().includes(s) ||
    fields.principle.toLowerCase().includes(s)
  );
}

function sortMarketplace(list: MarketplaceScript[], sort: MarketplaceSort): MarketplaceScript[] {
  const copy = [...list];
  switch (sort) {
    case 'rating':
      return copy.sort((a, b) => b.rating - a.rating);
    case 'price_low':
      return copy.sort((a, b) => a.priceUsd - b.priceUsd);
    case 'price_high':
      return copy.sort((a, b) => b.priceUsd - a.priceUsd);
    case 'popular':
    default:
      return copy.sort((a, b) => b.purchases - a.purchases);
  }
}

export function Scripts() {
  const [tab, setTab] = useState<TabId>('included');
  const [filter, setFilter] = useState<(typeof categories)[number]>('All');
  const [search, setSearch] = useState('');
  const [savedOnly, setSavedOnly] = useState(false);
  const [marketSort, setMarketSort] = useState<MarketplaceSort>('popular');
  const [savedIds, setSavedIds] = useState<string[]>(loadSaved);

  useEffect(() => {
    localStorage.setItem(STORAGE_SAVED, JSON.stringify(savedIds));
  }, [savedIds]);

  const toggleSave = useCallback((id: string) => {
    setSavedIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  }, []);

  const filteredIncluded = useMemo(() => {
    let list =
      filter === 'All' ? includedScripts : includedScripts.filter(s => s.category === filter);
    list = list.filter(s => matchesSearch(search, s));
    if (savedOnly) list = list.filter(s => savedIds.includes(s.id));
    return list;
  }, [filter, search, savedOnly, savedIds]);

  const filteredPremium = useMemo(() => {
    let list = filter === 'All' ? premiumScripts : premiumScripts.filter(s => s.category === filter);
    list = list.filter(s => matchesSearch(search, s));
    if (savedOnly) list = list.filter(s => savedIds.includes(s.id));
    return list;
  }, [filter, search, savedOnly, savedIds]);

  const filteredMarketplace = useMemo(() => {
    let list =
      filter === 'All' ? marketplaceScripts : marketplaceScripts.filter(s => s.category === filter);
    list = list.filter(s => matchesSearch(search, s));
    if (savedOnly) list = list.filter(s => savedIds.includes(s.id));
    return sortMarketplace(list, marketSort);
  }, [filter, search, savedOnly, savedIds, marketSort]);

  const showSaveStars = tab !== 'sell';

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-siren-blue mb-2">Library</p>
        <h2 className="text-2xl font-semibold text-white tracking-tight">Script Library</h2>
        <p className="text-sm text-[#888] mt-2 leading-relaxed">
          Minimal talk tracks with variables — personalize per prospect. Premium lists benchmarks; marketplace pays
          creators {MARKETPLACE_CREATOR_SHARE_PERCENT}% ({MARKETPLACE_PLATFORM_FEE_PERCENT}% platform).
        </p>
      </div>

      <div className="siren-card p-4 md:p-5 border border-[rgba(59,130,246,0.14)] glass-panel">
        <h3 className="text-xs text-siren-blue tracking-wide uppercase mb-3">Why these scripts work</h3>
        <ul className="text-sm text-[#888] space-y-2 leading-relaxed">
          <li>
            <span className="text-white/90">Earn permission with context</span> — lead with relevance, then a short
            time-box (e.g. 27 seconds).
          </li>
          <li>
            <span className="text-white/90">Reason-for-calling</span> — answer “why me?” in the first 15–30 seconds.
          </li>
          <li>
            <span className="text-white/90">One ask</span> — earn the next slice of conversation before the full pitch.
          </li>
          <li>
            <span className="text-white/90">Measure stages</span> — connect → hold → meeting; tune one layer at a time.
          </li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" aria-hidden />
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search scripts…"
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-sm text-white placeholder-[#555] focus:outline-none focus:border-siren-blue/50"
          />
        </div>
        {tab !== 'sell' && (
          <button
            type="button"
            onClick={() => setSavedOnly(s => !s)}
            className={`inline-flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium border transition-colors ${
              savedOnly
                ? 'border-amber-500/40 bg-amber-500/10 text-amber-400'
                : 'border-[rgba(255,255,255,0.08)] text-[#888] hover:text-white'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${savedOnly ? 'fill-amber-400 text-amber-400' : ''}`} />
            Saved only
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 border-b border-[rgba(255,255,255,0.06)] pb-3">
        {tabs.map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
              tab === t.id
                ? 'btn-primary-railway !rounded-lg text-white shadow-lg shadow-brand-blue/30'
                : 'bg-[#0a0a0c] text-[#888] hover:text-white border border-[rgba(255,255,255,0.06)]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'marketplace' && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-[#555] uppercase tracking-wider">Sort</span>
          {(
            [
              ['popular', 'Popular'],
              ['rating', 'Rating'],
              ['price_low', 'Price ↑'],
              ['price_high', 'Price ↓'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setMarketSort(key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                marketSort === key ? 'bg-white/10 text-white' : 'text-[#888] hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {tab !== 'sell' && (
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 ${
                filter === cat ? 'bg-white/12 text-white' : 'bg-[#0a0a1a] text-[#888] border border-[rgba(255,255,255,0.05)] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {tab === 'included' && (
        <div className="space-y-3">
          {filteredIncluded.length === 0 ? (
            <EmptyScripts />
          ) : (
            filteredIncluded.map(script => (
              <LibraryScriptCard
                key={script.id}
                script={script}
                saved={savedIds.includes(script.id)}
                onSaveToggle={showSaveStars ? toggleSave : undefined}
              />
            ))
          )}
        </div>
      )}

      {tab === 'premium' && (
        <div className="space-y-4">
          <p className="text-[11px] text-[#555] leading-relaxed max-w-3xl">{metricsDisclaimer}</p>
          <div className="space-y-3">
            {filteredPremium.length === 0 ? (
              <EmptyScripts />
            ) : (
              filteredPremium.map(script => (
                <LibraryScriptCard
                  key={script.id}
                  script={script}
                  saved={savedIds.includes(script.id)}
                  onSaveToggle={showSaveStars ? toggleSave : undefined}
                />
              ))
            )}
          </div>
        </div>
      )}

      {tab === 'marketplace' && (
        <div className="space-y-3">
          {filteredMarketplace.length === 0 ? (
            <EmptyScripts />
          ) : (
            filteredMarketplace.map(script => (
              <LibraryScriptCard
                key={script.id}
                script={script}
                saved={savedIds.includes(script.id)}
                onSaveToggle={showSaveStars ? toggleSave : undefined}
              />
            ))
          )}
        </div>
      )}

      {tab === 'sell' && <SellScriptPanel />}
    </div>
  );
}

function EmptyScripts() {
  return (
    <div className="siren-card p-12 text-center glass-panel border-dashed border-[rgba(255,255,255,0.12)]">
      <p className="text-sm text-[#888]">No scripts match filters. Try clearing search or saved-only.</p>
    </div>
  );
}

function SellScriptPanel() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('19');
  const [body, setBody] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="max-w-xl space-y-6">
      <div className="siren-card p-6 glass-panel">
        <h3 className="text-sm font-medium text-white mb-2">List a script on the marketplace</h3>
        <p className="text-sm text-[#888] leading-relaxed mb-4">
          Siren is the dedicated venue for voice-sales scripts inside agent workflows — buyers discover you here. On each
          sale you receive <span className="text-white">{MARKETPLACE_CREATOR_SHARE_PERCENT}%</span> after processing.
          Siren retains {MARKETPLACE_PLATFORM_FEE_PERCENT}% for distribution, compliance review, and payments.
        </p>
        <ul className="text-xs text-[#555] space-y-1.5 list-disc list-inside mb-6">
          <li>No spam or misleading metrics — scripts may be audited.</li>
          <li>Buyers receive updates for 12 months unless otherwise noted.</li>
          <li>Payouts via Stripe Connect (enable in Settings).</li>
        </ul>

        <div className="space-y-4">
          <div>
            <label className="text-[11px] text-[#555] block mb-1.5">Title</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Healthcare SDR — gatekeeper script"
              className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-siren-blue/50"
            />
          </div>
          <div>
            <label className="text-[11px] text-[#555] block mb-1.5">Price (USD)</label>
            <input
              value={price}
              onChange={e => setPrice(e.target.value)}
              type="number"
              min={5}
              className="w-full max-w-xs bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-siren-blue/50"
            />
          </div>
          <div>
            <label className="text-[11px] text-[#555] block mb-1.5">Script + tips (plain text)</label>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              rows={8}
              placeholder="Lines, variables in [brackets], and delivery notes..."
              className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-siren-blue/50 font-mono"
            />
          </div>
          <button
            type="button"
            disabled={!title.trim() || !body.trim()}
            onClick={() => setSubmitted(true)}
            className="text-sm font-semibold px-5 py-2.5 rounded-lg btn-primary-railway disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
          >
            Submit for review
          </button>
          {submitted && (
            <p className="text-xs text-emerald-400">
              Thanks — review queue (demo). Connect payouts in Settings → Marketplace to go live.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
