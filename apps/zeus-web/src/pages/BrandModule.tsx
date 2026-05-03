import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  Copy,
  Download,
  ExternalLink,
  Palette,
  Pen,
  Sparkles,
  Type,
} from 'lucide-react';

const brandProfile = {
  name: 'Acme Growth',
  tagline: 'Revenue at the speed of AI.',
  tone: 'Confident, direct, human — never salesy.',
  primaryColor: '#22d3ee',
  secondaryColor: '#a78bfa',
  accentColor: '#10b981',
  fontHeading: 'Inter (600)',
  fontBody: 'Inter (400)',
  logoUrl: null,
};

const colors = [
  { name: 'Primary', hex: '#22d3ee', label: 'Teal 400', use: 'CTAs, headlines, links' },
  { name: 'Secondary', hex: '#a78bfa', label: 'Violet 400', use: 'Accents, badges, tags' },
  { name: 'Accent', hex: '#10b981', label: 'Emerald 500', use: 'Success, wins, growth' },
  { name: 'Warning', hex: '#f59e0b', label: 'Amber 400', use: 'Alerts, paused states' },
  { name: 'Surface', hex: '#0c0e16', label: 'Zinc 950', use: 'Cards, backgrounds' },
  { name: 'Border', hex: 'rgba(255,255,255,0.08)', label: 'White 8%', use: 'Dividers, card edges' },
];

const voiceRules = [
  { rule: 'Lead with outcomes, not features', example: '"Book 3x more meetings" not "our AI dials"' },
  { rule: 'First-person plural — "we", never "our product"', example: '"We move fast so you don\'t have to"' },
  { rule: 'Short sentences win', example: 'Keep subject lines under 7 words. Paragraphs under 3 lines.' },
  { rule: 'Specificity beats hyperbole', example: '"40% open rate" not "incredible results"' },
  { rule: 'Never overpromise on AI autonomy', example: '"AI-assisted" not "fully autonomous"' },
];

const assets = [
  { name: 'Logo (SVG)', type: 'svg', size: '4 KB' },
  { name: 'Logo (PNG 2x)', type: 'png', size: '48 KB' },
  { name: 'Social Banner (1200×630)', type: 'png', size: '84 KB' },
  { name: 'Email Header', type: 'html', size: '2 KB' },
  { name: 'Brand Guidelines PDF', type: 'pdf', size: '2.1 MB' },
];

export function BrandModule() {
  return (
    <div className="space-y-6 max-w-7xl w-full min-w-0">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 zeus-mesh-hero px-4 py-6 sm:px-6 md:px-8 md:py-7">
        <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 opacity-25 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.5),transparent_70%)]" />
        <div className="relative flex items-start gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-500/10 text-amber-200">
            <Palette className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-400/90">Brand System</p>
            <h1 className="text-2xl md:text-3xl font-semibold text-white mt-1 tracking-tight">Brand Kit</h1>
            <p className="text-zinc-400 text-sm mt-1.5 leading-relaxed max-w-2xl">
              Logo, voice, colors, and asset library — everything that makes {brandProfile.name} identifiable and consistent.
            </p>
          </div>
          <Link
            to="/brand/wizard"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs text-amber-300 hover:bg-amber-500/20 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" /> Brand Wizard
          </Link>
        </div>
      </div>

      {/* Brand identity card */}
      <div className="siren-card glass-panel p-6">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1">Active Brand Profile</p>
            <h2 className="text-xl font-semibold text-white">{brandProfile.name}</h2>
            <p className="text-sm text-zinc-400 mt-1 italic">"{brandProfile.tagline}"</p>
          </div>
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300 hover:bg-white/10 transition-colors">
            <Pen className="w-3 h-3" /> Edit
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-2">Brand Voice</p>
            <p className="text-sm text-zinc-300 leading-relaxed">{brandProfile.tone}</p>
          </div>
          <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-2">Typography</p>
            <div className="space-y-1">
              <p className="text-sm text-zinc-300">Heading: <span className="text-white font-medium">{brandProfile.fontHeading}</span></p>
              <p className="text-sm text-zinc-300">Body: <span className="text-white font-medium">{brandProfile.fontBody}</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Color palette */}
      <div className="siren-card glass-panel p-6">
        <h3 className="text-xs text-zinc-500 uppercase tracking-wider mb-5">Color Palette</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {colors.map(c => (
            <div key={c.name} className="group cursor-pointer">
              <div
                className="h-14 rounded-lg mb-2 border border-white/10 transition-transform group-hover:scale-105"
                style={{ backgroundColor: c.hex }}
              />
              <p className="text-[11px] font-medium text-zinc-300">{c.name}</p>
              <p className="text-[10px] text-zinc-600 font-mono">{c.hex}</p>
              <p className="text-[10px] text-zinc-600 mt-0.5">{c.use}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Voice rules */}
      <div className="siren-card glass-panel p-6">
        <div className="flex items-center gap-2 mb-5">
          <Type className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs text-zinc-500 uppercase tracking-wider">Voice & Tone Rules</h3>
        </div>
        <div className="space-y-3">
          {voiceRules.map((r, i) => (
            <div
              key={i}
              className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3 shadow-[inset_4px_0_0_0_rgba(251,191,36,0.3)]"
            >
              <div className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">{r.rule}</p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">e.g. {r.example}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Asset library */}
      <div className="siren-card glass-panel overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <h3 className="text-xs text-zinc-500 uppercase tracking-wider">Asset Library</h3>
          <button className="text-[11px] text-zinc-600 hover:text-teal-400 transition-colors flex items-center gap-1">
            <Download className="w-3 h-3" /> Download all
          </button>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {assets.map(asset => (
            <div
              key={asset.name}
              className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono font-semibold uppercase text-zinc-500 bg-white/[0.05] border border-white/[0.07] px-1.5 py-0.5 rounded">
                  {asset.type}
                </span>
                <span className="text-sm text-zinc-200">{asset.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-zinc-600">{asset.size}</span>
                <button className="text-zinc-600 hover:text-teal-400 transition-colors">
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap gap-4">
        <Link
          to="/brand/wizard"
          className="inline-flex items-center gap-1.5 text-sm text-amber-400 hover:text-amber-300"
        >
          Rebuild brand with wizard <ArrowRight className="w-4 h-4" />
        </Link>
        <Link to="/publish" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white">
          Apply to publish queue <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
