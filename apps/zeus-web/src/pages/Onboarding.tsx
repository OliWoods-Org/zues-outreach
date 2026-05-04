/**
 * Zeus Airtable Onboarding Wizard — 4 steps
 * Step 1: Connect Airtable (PAT + base selection)
 * Step 2: Import first leads (Apollo / CSV / skip)
 * Step 3: Configure social listening
 * Step 4: Launch Mission Control
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check,
  ChevronRight,
  Database,
  Ear,
  Loader2,
  Rocket,
  Search,
  Upload,
  X,
} from 'lucide-react';
import { airtableOnboardingApi, type AirtableBase } from '../lib/api/airtable';
import { ph } from '../lib/posthog';

// ─── Types ──────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3 | 4;

interface OnboardingState {
  // Step 1
  pat: string;
  bases: AirtableBase[];
  selectedBase: string;
  baseSetup: { baseId: string; tableId: string } | null;
  // Step 2
  leadSource: 'apollo' | 'csv' | 'skip';
  apolloKey: string;
  leadsCount: number;
  // Step 3
  platforms: string[];
  keywords: string[];
  newKeyword: string;
  dailyCap: number;
}

const INITIAL: OnboardingState = {
  pat: '',
  bases: [],
  selectedBase: '',
  baseSetup: null,
  leadSource: 'skip',
  apolloKey: '',
  leadsCount: 0,
  platforms: ['reddit'],
  keywords: [],
  newKeyword: '',
  dailyCap: 50,
};

// ─── Stepper header ─────────────────────────────────────────────────────────

const STEPS = [
  { label: 'Connect Airtable', icon: Database },
  { label: 'Import leads', icon: Search },
  { label: 'Social listening', icon: Ear },
  { label: 'Launch', icon: Rocket },
];

function StepHeader({ current }: { current: Step }) {
  return (
    <div className="flex items-center gap-0 mb-10">
      {STEPS.map((s, i) => {
        const step = (i + 1) as Step;
        const done = step < current;
        const active = step === current;
        const Icon = s.icon;
        return (
          <div key={s.label} className="flex items-center flex-1 min-w-0">
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${
                  done
                    ? 'bg-teal-500/20 border-teal-500/40 text-teal-300'
                    : active
                    ? 'bg-violet-500/20 border-violet-500/40 text-violet-300'
                    : 'bg-white/[0.04] border-white/[0.08] text-zinc-600'
                }`}
              >
                {done ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </div>
              <span
                className={`text-[10px] font-medium tracking-wide whitespace-nowrap hidden sm:block ${
                  active ? 'text-white' : done ? 'text-teal-400/80' : 'text-zinc-600'
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-px flex-1 mx-2 ${done ? 'bg-teal-500/30' : 'bg-white/[0.06]'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Step 1: Connect Airtable ────────────────────────────────────────────────

function Step1({
  state,
  setState,
  onNext,
}: {
  state: OnboardingState;
  setState: React.Dispatch<React.SetStateAction<OnboardingState>>;
  onNext: () => void;
}) {
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settingUp, setSettingUp] = useState(false);

  const validate = async () => {
    if (!state.pat.trim()) return;
    setValidating(true);
    setError(null);
    try {
      const result = await airtableOnboardingApi.validate(state.pat.trim());
      if (!result.valid) throw new Error(result.error ?? 'Invalid PAT');
      setState(s => ({ ...s, bases: result.bases }));
      ph('airtable_pat_validated', { base_count: result.bases.length });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setValidating(false);
    }
  };

  const setupBase = async () => {
    setSettingUp(true);
    try {
      const result = await airtableOnboardingApi.createBase(
        state.pat,
        'Zeus Outreach',
        state.selectedBase || undefined,
      );
      setState(s => ({ ...s, baseSetup: result }));
      ph('airtable_connected', { base_name: state.selectedBase || 'new', product: 'zeus' });
      onNext();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSettingUp(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">Connect your Airtable</h2>
        <p className="text-sm text-zinc-500">
          Zeus syncs leads, campaigns, and social data to Airtable. You'll need a Personal Access Token.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-xs text-zinc-400 font-medium">Airtable Personal Access Token</label>
        <div className="flex gap-2">
          <input
            type="password"
            value={state.pat}
            onChange={e => setState(s => ({ ...s, pat: e.target.value, bases: [], selectedBase: '' }))}
            placeholder="pat_xxxxxxxxxxxxxxxxxx"
            className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-teal-500/40"
          />
          <button
            type="button"
            onClick={() => void validate()}
            disabled={validating || !state.pat.trim()}
            className="px-4 py-2.5 rounded-lg bg-teal-500/15 border border-teal-500/30 text-teal-300 text-sm font-medium hover:bg-teal-500/25 disabled:opacity-50 transition-colors whitespace-nowrap"
          >
            {validating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Validate'}
          </button>
        </div>
        <p className="text-[11px] text-zinc-600">
          Get your PAT at airtable.com/create/tokens — needs: data.records:read, data.records:write, schema.bases:read, schema.bases:write
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          <X className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {state.bases.length > 0 && (
        <div className="space-y-3">
          <label className="text-xs text-zinc-400 font-medium">Select a base (or we'll create one)</label>
          <div className="grid gap-2">
            <label className="flex items-center gap-3 p-3 rounded-lg border border-white/[0.06] hover:border-violet-400/25 cursor-pointer transition-colors">
              <input
                type="radio"
                name="base"
                value=""
                checked={state.selectedBase === ''}
                onChange={() => setState(s => ({ ...s, selectedBase: '' }))}
                className="accent-violet-400"
              />
              <span className="text-sm text-white">Create new "Zeus Outreach" base</span>
            </label>
            {state.bases.map(base => (
              <label
                key={base.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-white/[0.06] hover:border-violet-400/25 cursor-pointer transition-colors"
              >
                <input
                  type="radio"
                  name="base"
                  value={base.id}
                  checked={state.selectedBase === base.id}
                  onChange={() => setState(s => ({ ...s, selectedBase: base.id }))}
                  className="accent-violet-400"
                />
                <span className="text-sm text-white">{base.name}</span>
                <span className="text-[11px] text-zinc-600">{base.tables.join(', ')}</span>
              </label>
            ))}
          </div>

          <button
            type="button"
            onClick={() => void setupBase()}
            disabled={settingUp}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-violet-500/15 border border-violet-500/30 text-violet-300 text-sm font-semibold hover:bg-violet-500/25 disabled:opacity-50 transition-colors"
          >
            {settingUp ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {settingUp ? 'Setting up…' : state.selectedBase ? 'Use this base' : 'Create base + Leads table'}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Step 2: Import leads ────────────────────────────────────────────────────

function Step2({
  state,
  setState,
  onNext,
}: {
  state: OnboardingState;
  setState: React.Dispatch<React.SetStateAction<OnboardingState>>;
  onNext: () => void;
}) {
  const [previewing, setPreviewing] = useState(false);
  const [pushing, setPushing] = useState(false);
  const [preview, setPreview] = useState<{ name: string; company: string; title: string }[]>([]);

  const previewApollo = async () => {
    if (!state.apolloKey.trim()) return;
    setPreviewing(true);
    try {
      const result = await airtableOnboardingApi.previewApolloLeads(state.apolloKey, 'decision maker SaaS', 10);
      setPreview(result.leads);
      setState(s => ({ ...s, leadsCount: result.total }));
    } finally {
      setPreviewing(false);
    }
  };

  const importLeads = async () => {
    if (!state.baseSetup || !preview.length) return;
    setPushing(true);
    try {
      const result = await airtableOnboardingApi.pushLeads(state.pat, state.baseSetup.baseId, preview);
      ph('first_leads_imported', { count: result.pushed, source: 'apollo' });
      onNext();
    } finally {
      setPushing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">Import your first leads</h2>
        <p className="text-sm text-zinc-500">Seed your pipeline with 10 leads to get started. You can import more later.</p>
      </div>

      <div className="grid gap-3">
        {/* Apollo option */}
        <label
          className={`p-4 rounded-xl border cursor-pointer transition-colors ${
            state.leadSource === 'apollo'
              ? 'border-teal-500/40 bg-teal-500/5'
              : 'border-white/[0.06] hover:border-white/[0.12]'
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <input
              type="radio"
              name="leadsource"
              value="apollo"
              checked={state.leadSource === 'apollo'}
              onChange={() => setState(s => ({ ...s, leadSource: 'apollo' }))}
              className="accent-teal-400"
            />
            <span className="text-sm font-medium text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-teal-400" />
              Apollo.io search
            </span>
          </div>
          {state.leadSource === 'apollo' && (
            <div className="space-y-2 ml-5">
              <input
                type="password"
                value={state.apolloKey}
                onChange={e => setState(s => ({ ...s, apolloKey: e.target.value }))}
                placeholder="Apollo API key"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-teal-500/40"
              />
              <button
                type="button"
                onClick={() => void previewApollo()}
                disabled={previewing || !state.apolloKey.trim()}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-medium hover:bg-teal-500/25 disabled:opacity-50"
              >
                {previewing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}
                Preview 10 leads
              </button>
              {preview.length > 0 && (
                <ul className="space-y-1 mt-2">
                  {preview.map((l, i) => (
                    <li key={i} className="text-xs text-zinc-400">
                      <span className="text-white">{l.name}</span> · {l.title} @ {l.company}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </label>

        {/* CSV option */}
        <label
          className={`p-4 rounded-xl border cursor-pointer transition-colors ${
            state.leadSource === 'csv'
              ? 'border-violet-500/40 bg-violet-500/5'
              : 'border-white/[0.06] hover:border-white/[0.12]'
          }`}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="leadsource"
              value="csv"
              checked={state.leadSource === 'csv'}
              onChange={() => setState(s => ({ ...s, leadSource: 'csv' }))}
              className="accent-violet-400"
            />
            <span className="text-sm font-medium text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-violet-400" />
              Upload CSV
            </span>
            <span className="text-xs text-zinc-600">(coming soon)</span>
          </div>
        </label>

        {/* Skip option */}
        <label
          className={`p-4 rounded-xl border cursor-pointer transition-colors ${
            state.leadSource === 'skip'
              ? 'border-zinc-600/40 bg-zinc-800/30'
              : 'border-white/[0.06] hover:border-white/[0.12]'
          }`}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="leadsource"
              value="skip"
              checked={state.leadSource === 'skip'}
              onChange={() => setState(s => ({ ...s, leadSource: 'skip' }))}
              className="accent-zinc-400"
            />
            <span className="text-sm font-medium text-zinc-400">Skip for now — I'll add leads manually</span>
          </div>
        </label>
      </div>

      <button
        type="button"
        onClick={
          state.leadSource === 'apollo' && preview.length > 0
            ? () => void importLeads()
            : onNext
        }
        disabled={pushing}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-300 text-sm font-semibold hover:bg-teal-500/25 disabled:opacity-50 transition-colors"
      >
        {pushing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
        {pushing
          ? 'Importing…'
          : state.leadSource === 'apollo' && preview.length > 0
          ? `Import ${preview.length} leads & continue`
          : 'Continue'}
      </button>
    </div>
  );
}

// ─── Step 3: Social listening ────────────────────────────────────────────────

const PLATFORMS = [
  { id: 'reddit', label: 'Reddit', color: 'text-orange-400' },
  { id: 'twitter', label: 'X/Twitter', color: 'text-sky-400' },
  { id: 'hackernews', label: 'Hacker News', color: 'text-amber-400' },
  { id: 'github', label: 'GitHub', color: 'text-purple-400' },
];

function Step3({
  state,
  setState,
  onNext,
}: {
  state: OnboardingState;
  setState: React.Dispatch<React.SetStateAction<OnboardingState>>;
  onNext: () => void;
}) {
  const togglePlatform = (id: string) => {
    setState(s => ({
      ...s,
      platforms: s.platforms.includes(id) ? s.platforms.filter(p => p !== id) : [...s.platforms, id],
    }));
  };

  const addKeyword = () => {
    if (!state.newKeyword.trim() || state.keywords.includes(state.newKeyword.trim())) return;
    setState(s => ({ ...s, keywords: [...s.keywords, s.newKeyword.trim()], newKeyword: '' }));
  };

  const removeKeyword = (kw: string) => {
    setState(s => ({ ...s, keywords: s.keywords.filter(k => k !== kw) }));
  };

  const handleNext = () => {
    ph('social_listen_configured', { platforms: state.platforms.join(','), keyword_count: state.keywords.length });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">Configure social listening</h2>
        <p className="text-sm text-zinc-500">
          Zeus will monitor these platforms for mentions, buying signals, and competitive intel.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-xs text-zinc-400 font-medium">Platforms to monitor</label>
        <div className="grid grid-cols-2 gap-2">
          {PLATFORMS.map(p => (
            <button
              key={p.id}
              type="button"
              onClick={() => togglePlatform(p.id)}
              className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-colors ${
                state.platforms.includes(p.id)
                  ? 'border-teal-500/30 bg-teal-500/10 text-teal-300'
                  : 'border-white/[0.06] text-zinc-500 hover:border-white/[0.12]'
              }`}
            >
              {state.platforms.includes(p.id) && <Check className="w-3.5 h-3.5" />}
              <span className={state.platforms.includes(p.id) ? '' : p.color}>{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs text-zinc-400 font-medium">
          Seed keywords <span className="text-zinc-600">(3–5 to start)</span>
        </label>
        <div className="flex gap-2">
          <input
            value={state.newKeyword}
            onChange={e => setState(s => ({ ...s, newKeyword: e.target.value }))}
            onKeyDown={e => { if (e.key === 'Enter') addKeyword(); }}
            placeholder="e.g. AI outreach, sales automation"
            className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-teal-500/40"
          />
          <button
            type="button"
            onClick={addKeyword}
            className="px-3 py-2 rounded-lg bg-teal-500/15 border border-teal-500/30 text-teal-300 text-sm hover:bg-teal-500/25 transition-colors"
          >
            Add
          </button>
        </div>
        {state.keywords.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {state.keywords.map(kw => (
              <span
                key={kw}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border border-teal-500/25 bg-teal-500/10 text-teal-300"
              >
                {kw}
                <button type="button" onClick={() => removeKeyword(kw)} className="text-teal-600 hover:text-teal-300">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-xs text-zinc-400 font-medium">Daily post cap</label>
        <div className="flex gap-3">
          {[50, 200, 500].map(cap => (
            <button
              key={cap}
              type="button"
              onClick={() => setState(s => ({ ...s, dailyCap: cap }))}
              className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                state.dailyCap === cap
                  ? 'border-teal-500/30 bg-teal-500/10 text-teal-300'
                  : 'border-white/[0.06] text-zinc-500 hover:border-white/[0.12]'
              }`}
            >
              {cap}/day
              {cap === 50 && <span className="block text-[10px] text-zinc-600">Free</span>}
              {cap === 200 && <span className="block text-[10px] text-zinc-600">Starter</span>}
              {cap === 500 && <span className="block text-[10px] text-zinc-600">Pro</span>}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handleNext}
        disabled={state.platforms.length === 0}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-300 text-sm font-semibold hover:bg-teal-500/25 disabled:opacity-50 transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
        Activate listening & continue
      </button>
    </div>
  );
}

// ─── Step 4: Launch ──────────────────────────────────────────────────────────

function Step4({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    ph('onboarding_completed');
  }, []);

  return (
    <div className="space-y-8 text-center">
      <div className="w-20 h-20 rounded-full bg-teal-500/15 border border-teal-500/30 flex items-center justify-center mx-auto">
        <Rocket className="w-10 h-10 text-teal-300" />
      </div>
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">Zeus is ready</h2>
        <p className="text-sm text-zinc-500 max-w-sm mx-auto leading-relaxed">
          Your Airtable base is connected, leads are loading, and social listening is live. Mission Control awaits.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
        <div className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-4">
          <Database className="w-5 h-5 text-teal-400 mb-2" />
          <p className="text-xs font-medium text-white">Airtable</p>
          <p className="text-[11px] text-zinc-500 mt-0.5">Leads table ready</p>
        </div>
        <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
          <Search className="w-5 h-5 text-violet-400 mb-2" />
          <p className="text-xs font-medium text-white">Leads</p>
          <p className="text-[11px] text-zinc-500 mt-0.5">Pipeline seeded</p>
        </div>
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <Ear className="w-5 h-5 text-emerald-400 mb-2" />
          <p className="text-xs font-medium text-white">Listen</p>
          <p className="text-[11px] text-zinc-500 mt-0.5">Monitoring active</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onDone}
        className="inline-flex items-center gap-2 px-8 py-3 rounded-xl zeus-cta-surge text-sm font-semibold"
      >
        <Rocket className="w-4 h-4" />
        Open Mission Control
      </button>
    </div>
  );
}

// ─── Main wizard ─────────────────────────────────────────────────────────────

export function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [state, setState] = useState<OnboardingState>(INITIAL);

  const next = () => setStep(s => Math.min(4, s + 1) as Step);
  const done = () => {
    localStorage.setItem('zeus-onboarding-dismiss', '1');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <div className="mb-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-400/90">Zeus Growth OS</p>
          <h1 className="text-3xl font-semibold text-white tracking-tight mt-1">Setup</h1>
        </div>

        <StepHeader current={step} />

        <div className="rounded-2xl border border-white/[0.07] bg-black/30 p-6 md:p-8">
          {step === 1 && <Step1 state={state} setState={setState} onNext={next} />}
          {step === 2 && <Step2 state={state} setState={setState} onNext={next} />}
          {step === 3 && <Step3 state={state} setState={setState} onNext={next} />}
          {step === 4 && <Step4 onDone={done} />}
        </div>
      </div>
    </div>
  );
}
