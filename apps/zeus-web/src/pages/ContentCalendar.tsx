import { useState } from 'react';
import { CalendarDays, List, Plus, ChevronDown, Send, Clock, CheckCircle2, FileEdit } from 'lucide-react';
import { ph } from '../lib/posthog';

// ─── Types ───────────────────────────────────────────────────────────────────

type Product = 'LuxuryTravels' | 'CoFounder' | 'Elevar' | 'Siren' | 'Eckleberg';
type Platform = 'X' | 'LinkedIn' | 'Instagram' | 'Reddit' | 'TikTok';
type Status = 'draft' | 'scheduled' | 'published' | 'needs_review';
type View = 'calendar' | 'list';

interface Post {
  id: string;
  product: Product;
  platform: Platform;
  content: string;
  date: string; // YYYY-MM-DD
  time: string;
  status: Status;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const PRODUCTS: Product[] = ['LuxuryTravels', 'CoFounder', 'Elevar', 'Siren', 'Eckleberg'];

const PLATFORM_COLORS: Record<Platform, string> = {
  X: 'bg-zinc-800 text-zinc-200 border-zinc-600/40',
  LinkedIn: 'bg-blue-950/60 text-blue-300 border-blue-600/30',
  Instagram: 'bg-pink-950/60 text-pink-300 border-pink-600/30',
  Reddit: 'bg-orange-950/60 text-orange-300 border-orange-600/30',
  TikTok: 'bg-zinc-900 text-white border-zinc-600/30',
};

const STATUS_CONFIG: Record<Status, { label: string; icon: React.ReactNode; color: string }> = {
  draft:        { label: 'Draft',        icon: <FileEdit size={11} />,     color: 'text-zinc-400 bg-zinc-800/60 border-zinc-600/30' },
  scheduled:    { label: 'Scheduled',    icon: <Clock size={11} />,        color: 'text-sky-300 bg-sky-950/60 border-sky-600/30' },
  published:    { label: 'Published',    icon: <CheckCircle2 size={11} />, color: 'text-emerald-300 bg-emerald-950/50 border-emerald-600/25' },
  needs_review: { label: 'Needs review', icon: <Send size={11} />,         color: 'text-amber-300 bg-amber-950/50 border-amber-600/25' },
};

const MOCK_POSTS: Post[] = [
  { id: '1', product: 'LuxuryTravels', platform: 'X', content: 'The Amalfi Coast isn\'t a destination — it\'s a state of mind. Book direct, no markup. ✦', date: '2026-05-05', time: '09:00', status: 'scheduled' },
  { id: '2', product: 'LuxuryTravels', platform: 'Instagram', content: 'Capri at golden hour. Suite upgrade included when you book direct through LT. Link in bio.', date: '2026-05-05', time: '18:00', status: 'needs_review' },
  { id: '3', product: 'CoFounder', platform: 'X', content: 'Spawned 200 agents in 4 minutes. Your competitors are still writing tickets. ⚡', date: '2026-05-06', time: '10:00', status: 'scheduled' },
  { id: '4', product: 'CoFounder', platform: 'LinkedIn', content: 'Why we built CoFounder: the average founder spends 60% of their week on work that an agent could do. We fixed that.', date: '2026-05-07', time: '08:30', status: 'draft' },
  { id: '5', product: 'Elevar', platform: 'Instagram', content: 'PT-141 protocol thread dropping Thursday. Follow for the full breakdown.', date: '2026-05-08', time: '12:00', status: 'draft' },
  { id: '6', product: 'LuxuryTravels', platform: 'Reddit', content: 'We built a luxury hotel booking platform that doesn\'t charge markup. AMA.', date: '2026-05-09', time: '14:00', status: 'scheduled' },
  { id: '7', product: 'Siren', platform: 'LinkedIn', content: 'Siren closed 3 deals last week while the sales team slept. AI Guard flagged 2 fraud attempts. This is the future of sales.', date: '2026-05-10', time: '09:00', status: 'published' },
  { id: '8', product: 'Eckleberg', platform: 'X', content: 'The eyes that never stop watching. Eckleberg runs 10 user personas on your product every Monday. Score drops = you know before your users do.', date: '2026-05-12', time: '11:00', status: 'draft' },
  { id: '9', product: 'CoFounder', platform: 'X', content: 'New: spawn a QA team of 20 agents with one command. They find bugs, write reports, open PRs. You review. Ship Friday.', date: '2026-05-12', time: '14:00', status: 'scheduled' },
  { id: '10', product: 'LuxuryTravels', platform: 'TikTok', content: '5 hotels that look impossible to afford (and how to book them direct for less than you think)', date: '2026-05-13', time: '16:00', status: 'needs_review' },
];

// ─── Week days for calendar ───────────────────────────────────────────────────

function getWeekDays(baseDate: Date): string[] {
  const days: string[] = [];
  const monday = new Date(baseDate);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// ─── Compose drawer ───────────────────────────────────────────────────────────

function ComposeDrawer({ product, onClose }: { product: Product; onClose: () => void }) {
  const [platform, setPlatform] = useState<Platform>('X');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('2026-05-12');
  const [time, setTime] = useState('09:00');

  function handleSchedule() {
    ph('calendar_post_scheduled', { product, platform, date });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-[440px] h-full bg-[#0a0a14] border-l border-white/[0.06] flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
          <div>
            <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-500">New post</p>
            <h3 className="text-sm font-semibold text-white mt-0.5">{product}</h3>
          </div>
          <button onClick={onClose} className="text-zinc-600 hover:text-zinc-400 transition-colors text-lg leading-none">×</button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Platform */}
          <div>
            <label className="text-[10px] uppercase tracking-wider text-zinc-500 block mb-2">Platform</label>
            <div className="flex flex-wrap gap-2">
              {(['X','LinkedIn','Instagram','Reddit','TikTok'] as Platform[]).map(p => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`text-[11px] px-3 py-1 rounded-full border transition-all ${
                    platform === p ? PLATFORM_COLORS[p] + ' ring-1 ring-white/10' : 'bg-transparent border-white/[0.06] text-zinc-500 hover:text-zinc-300'
                  }`}
                >{p}</button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="text-[10px] uppercase tracking-wider text-zinc-500 block mb-2">Content</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Write your post…"
              rows={5}
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-white/[0.12] resize-none transition-colors"
            />
            <p className="text-[11px] text-zinc-600 mt-1 text-right">{content.length} / 280</p>
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Date', value: date, setter: setDate, type: 'date' },
              { label: 'Time', value: time, setter: setTime, type: 'time' },
            ].map(f => (
              <div key={f.label}>
                <label className="text-[10px] uppercase tracking-wider text-zinc-500 block mb-2">{f.label}</label>
                <input
                  type={f.type}
                  value={f.value}
                  onChange={e => f.setter(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-white/[0.12] transition-colors"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-5 border-t border-white/[0.06] flex gap-3">
          <button
            onClick={handleSchedule}
            className="flex-1 py-2.5 rounded-xl bg-rose-500/90 hover:bg-rose-500 text-white text-sm font-medium transition-all"
          >Schedule</button>
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl border border-white/[0.08] text-zinc-400 text-sm hover:text-zinc-200 transition-all">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function ContentCalendar() {
  const [product, setProduct] = useState<Product>('LuxuryTravels');
  const [view, setView] = useState<View>('calendar');
  const [showCompose, setShowCompose] = useState(false);
  const [productOpen, setProductOpen] = useState(false);

  const filtered = MOCK_POSTS.filter(p => p.product === product);
  const weekDays = getWeekDays(new Date('2026-05-05'));

  const PRODUCT_COLORS: Record<Product, string> = {
    LuxuryTravels: '#f59e0b',
    CoFounder: '#a78bfa',
    Elevar: '#34d399',
    Siren: '#ef4444',
    Eckleberg: '#f59e0b',
  };
  const accent = PRODUCT_COLORS[product];

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-400/90">Content</p>
          <h1 className="text-2xl font-semibold text-white tracking-tight mt-1">Calendar</h1>
          <p className="text-sm text-zinc-500 mt-1">Schedule and publish across all your products and platforms.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex rounded-lg overflow-hidden border border-white/[0.06] bg-white/[0.02]">
            {(['calendar','list'] as View[]).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs transition-all ${view === v ? 'bg-white/[0.06] text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                {v === 'calendar' ? <CalendarDays size={12} /> : <List size={12} />}
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>

          {/* Product switcher */}
          <div className="relative">
            <button
              onClick={() => setProductOpen(o => !o)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] text-sm text-zinc-200 hover:bg-white/[0.05] transition-all"
            >
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }} />
              {product}
              <ChevronDown size={12} className="text-zinc-500" />
            </button>
            {productOpen && (
              <div className="absolute right-0 mt-1 w-48 rounded-xl border border-white/[0.08] bg-[#0e0e1a] shadow-xl z-10 overflow-hidden">
                {PRODUCTS.map(p => (
                  <button
                    key={p}
                    onClick={() => { setProduct(p); setProductOpen(false); ph('calendar_product_switched', { product: p }); }}
                    className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left transition-colors hover:bg-white/[0.04] ${product === p ? 'text-white' : 'text-zinc-400'}`}
                  >
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: PRODUCT_COLORS[p] }} />
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* New post */}
          <button
            onClick={() => setShowCompose(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium text-white transition-all border"
            style={{ backgroundColor: `${accent}18`, borderColor: `${accent}35`, color: accent }}
          >
            <Plus size={13} />
            New post
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Scheduled', value: filtered.filter(p => p.status === 'scheduled').length, color: '#60a5fa' },
          { label: 'Needs review', value: filtered.filter(p => p.status === 'needs_review').length, color: '#f59e0b' },
          { label: 'Drafts', value: filtered.filter(p => p.status === 'draft').length, color: '#71717a' },
          { label: 'Published', value: filtered.filter(p => p.status === 'published').length, color: '#34d399' },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1.5px]" style={{ backgroundColor: s.color }} />
            <p className="text-[11px] text-zinc-500 uppercase tracking-wide">{s.label}</p>
            <p className="text-2xl font-semibold text-white mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Calendar view */}
      {view === 'calendar' && (
        <div className="rounded-2xl border border-white/[0.06] overflow-hidden">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-white/[0.06]">
            {weekDays.map((day, i) => {
              const isToday = day === '2026-05-02';
              return (
                <div key={day} className={`px-3 py-3 text-center border-r border-white/[0.04] last:border-r-0 ${isToday ? 'bg-white/[0.03]' : ''}`}>
                  <p className="text-[10px] uppercase tracking-wider text-zinc-500">{DAY_LABELS[i]}</p>
                  <p className={`text-sm font-medium mt-0.5 ${isToday ? 'text-white' : 'text-zinc-400'}`}>
                    {new Date(day + 'T12:00:00').getDate()}
                  </p>
                </div>
              );
            })}
          </div>
          {/* Day columns */}
          <div className="grid grid-cols-7 min-h-[240px]">
            {weekDays.map((day) => {
              const dayPosts = filtered.filter(p => p.date === day);
              return (
                <div key={day} className="border-r border-white/[0.04] last:border-r-0 p-2 space-y-1.5">
                  {dayPosts.map(post => (
                    <div
                      key={post.id}
                      className="rounded-lg p-2 border text-[10px] cursor-pointer hover:brightness-110 transition-all"
                      style={{ borderColor: `${accent}25`, backgroundColor: `${accent}0a` }}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <span className={`px-1.5 py-0.5 rounded-full text-[9px] border ${PLATFORM_COLORS[post.platform]}`}>{post.platform}</span>
                      </div>
                      <p className="text-zinc-300 leading-tight line-clamp-2">{post.content}</p>
                      <p className="text-zinc-600 mt-1">{post.time}</p>
                    </div>
                  ))}
                  {dayPosts.length === 0 && (
                    <button
                      onClick={() => setShowCompose(true)}
                      className="w-full h-8 rounded-lg border border-dashed border-white/[0.04] text-zinc-700 text-[10px] hover:border-white/[0.1] hover:text-zinc-500 transition-all flex items-center justify-center"
                    >+</button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* List view */}
      {view === 'list' && (
        <div className="rounded-2xl border border-white/[0.06] overflow-hidden">
          <div className="grid grid-cols-[120px_60px_1fr_120px_100px] gap-4 px-5 py-3 border-b border-white/[0.06] text-[10px] uppercase tracking-wider text-zinc-600">
            <span>Date</span><span>Platform</span><span>Content</span><span>Time</span><span>Status</span>
          </div>
          {filtered.length === 0 && (
            <div className="px-5 py-12 text-center text-zinc-600 text-sm">No posts for {product} yet.</div>
          )}
          {filtered.map((post, i) => {
            const st = STATUS_CONFIG[post.status];
            return (
              <div key={post.id} className={`grid grid-cols-[120px_60px_1fr_120px_100px] gap-4 px-5 py-3.5 items-center hover:bg-white/[0.015] transition-colors ${i < filtered.length - 1 ? 'border-b border-white/[0.04]' : ''}`}>
                <span className="text-xs text-zinc-400">{post.date}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border text-center ${PLATFORM_COLORS[post.platform]}`}>{post.platform}</span>
                <p className="text-[13px] text-zinc-300 truncate">{post.content}</p>
                <span className="text-xs text-zinc-500">{post.time}</span>
                <span className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded-full border w-fit ${st.color}`}>
                  {st.icon}{st.label}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {showCompose && <ComposeDrawer product={product} onClose={() => setShowCompose(false)} />}
    </div>
  );
}
