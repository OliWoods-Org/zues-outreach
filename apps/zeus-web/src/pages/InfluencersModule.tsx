import { Link } from 'react-router-dom';
import { Mail, Star, Users } from 'lucide-react';

const creators = [
  { handle: '@healthcreator', platform: 'IG', niche: 'Men’s wellness', rating: 4.8, status: 'Contacted' },
  { handle: '@biohacker_x', platform: 'X', niche: 'Longevity', rating: 4.5, status: 'Negotiating' },
];

export function InfluencersModule() {
  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-400/90">Growth OS</p>
        <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight mt-1">Influencers & UGC</h1>
        <p className="text-sm text-zinc-500 mt-2 max-w-2xl">
          <strong className="text-zinc-400">Creators</strong>, RateCards, OutreachSequences, OutreachLog — see{' '}
          <code className="text-zinc-500 text-[13px]">docs/AIRTABLE_ZEUS_SCHEMA.md</code> § Influencers.
        </p>
      </div>

      <div className="rounded-2xl border border-white/[0.08] overflow-hidden">
        <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr] gap-2 px-4 py-2.5 text-[10px] uppercase tracking-wider text-zinc-600 bg-black/30 border-b border-white/[0.06]">
          <span>Creator</span>
          <span>Platform</span>
          <span>Niche</span>
          <span className="text-right">Status</span>
        </div>
        <ul>
          {creators.map(c => (
            <li
              key={c.handle}
              className="grid grid-cols-1 sm:grid-cols-[1.2fr_1fr_1fr_1fr] gap-2 px-4 py-3 border-b border-white/[0.04] text-sm items-center"
            >
              <span className="text-white font-medium flex items-center gap-2">
                <Users className="w-4 h-4 text-zinc-600" />
                {c.handle}
              </span>
              <span className="text-zinc-400">{c.platform}</span>
              <span className="text-zinc-500">{c.niche}</span>
              <span className="flex items-center justify-between sm:justify-end gap-2">
                <span className="inline-flex items-center gap-0.5 text-amber-400/90 text-xs">
                  <Star className="w-3.5 h-3.5" /> {c.rating}
                </span>
                <span className="text-[11px] text-teal-400/90">{c.status}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center gap-2 text-[13px] text-zinc-500">
        <Mail className="w-4 h-4" />
        Outreach sequences unlock after <strong className="text-zinc-400">Brand wizard</strong> completes.
      </div>

      <Link to="/publish" className="text-sm text-teal-400 hover:text-teal-300">
        Publish queue →
      </Link>
    </div>
  );
}
