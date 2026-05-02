import { useCallback, useEffect, useRef, useState } from 'react';
import { Send, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useMode } from '../App';
import { growthCoachPrompts } from '../data/growthCoachPrompts';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
}

const guardSuggestions = [
  'Show call stats for this week',
  'Add +1 (555) 123-4567 to whitelist',
  'Which persona wasted the most scammer time?',
  'Generate a report of blocked numbers',
];

const SALES_WELCOME =
  "Hey — I'm your Growth coach (outbound, email, objections, pipeline). Defense assistant is separate: switch the Sales / Guard toggle for spam defense and personas.";
const GUARD_WELCOME =
  "I'm your Defense assistant — Guard desk for whitelist, personas, and intercepted calls. For sales copy and pipeline help, switch back to Sales (Growth coach).";

export function Chat() {
  const { mode, setMode } = useMode();
  const isSales = mode === 'sales';
  const [searchParams, setSearchParams] = useSearchParams();
  const seededFromUrl = useRef(false);
  const skipModeReset = useRef(false);
  const skipInitialModeReset = useRef(true);

  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: 'assistant', content: isSales ? SALES_WELCOME : GUARD_WELCOME },
  ]);
  const [input, setInput] = useState('');
  const [assistBanner, setAssistBanner] = useState<string | null>(null);

  const accentColor = isSales ? '#a78bfa' : '#fb7185';

  const handleSend = useCallback(
    (text?: string) => {
      const msg = text || input;
      if (!msg.trim()) return;

      const userMsg: Message = { id: Date.now(), role: 'user', content: msg };
      const botMsg: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: isSales
          ? `Great question about "${msg}". Here's what I'd suggest:\n\n1. Lead with value, not features\n2. Reference a specific pain point from your discovery call\n3. Keep it under 3 paragraphs\n4. End with a clear, low-friction CTA\n\nWant me to draft something specific?`
          : `Looking into "${msg}" for you.\n\nBased on your current Guard configuration:\n- 47 calls intercepted this period\n- Average engagement time: 4m 32s per scammer\n- Top performing persona: Confused Grandma (avg 7m waste)\n\nAnything else you'd like to know?`,
      };

      setMessages(prev => [...prev, userMsg, botMsg]);
      setInput('');
    },
    [input, isSales]
  );

  /** Reset thread when Sales/Guard changes (sidebar or “Wrong assistant?”); skip first paint (initializer already matches). */
  useEffect(() => {
    if (skipInitialModeReset.current) {
      skipInitialModeReset.current = false;
      return;
    }
    if (skipModeReset.current) {
      skipModeReset.current = false;
      return;
    }
    setMessages([{ id: Date.now(), role: 'assistant', content: isSales ? SALES_WELCOME : GUARD_WELCOME }]);
    setInput('');
    seededFromUrl.current = false;
  }, [mode, isSales]);

  useEffect(() => {
    if (!isSales || seededFromUrl.current) return;
    const raw = searchParams.get('q');
    if (!raw) return;
    seededFromUrl.current = true;
    const decoded = decodeURIComponent(raw);
    setSearchParams(
      p => {
        const next = new URLSearchParams(p);
        next.delete('q');
        return next;
      },
      { replace: true }
    );
    skipModeReset.current = true;
    setMessages([{ id: Date.now(), role: 'assistant', content: SALES_WELCOME }]);
    queueMicrotask(() => handleSend(decoded));
  }, [isSales, searchParams, setSearchParams, handleSend]);

  const switchToDefenseAssistant = () => {
    setAssistBanner(
      'Switched to Guard. You are now on the Defense assistant (whitelist, personas, intercepted-call stats). The Sales / Guard toggle in the sidebar matches this.'
    );
    setMode('guard');
  };

  const switchToGrowthCoach = () => {
    setAssistBanner(
      'Switched to Sales. You are now on the Growth coach (outbound copy, objections, pipeline). Use Guard when you need spam defense instead.'
    );
    setMode('sales');
  };

  return (
    <div className="flex flex-col min-h-[min(70vh,720px)] max-w-4xl w-full min-w-0">
      <div className="mb-5">
        <p className="text-[11px] uppercase tracking-[0.18em] text-[#555] mb-2">
          {isSales ? 'Growth · outbound' : 'Guard · defense'}
        </p>
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          {isSales ? 'Growth coach' : 'Defense assistant'}
        </h2>
        <p className="text-sm text-[#888] mt-2">
          {isSales
            ? 'Same chat surface as Mission Control — coaching for sequences, objections, and pipeline.'
            : 'Guard-only workspace: stats, whitelist, personas — not outbound sales coaching.'}
        </p>

        <div className="mt-4 rounded-xl border border-white/[0.07] bg-[rgba(8,10,14,0.65)] px-3 py-3">
          <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-600 mb-2">Wrong assistant?</p>
          <p className="text-xs text-zinc-500 leading-relaxed mb-3">
            {isSales ? (
              <>
                Need spam defense, whitelist, or persona stats instead? You want{' '}
                <span className="text-zinc-400">Defense assistant</span> in Guard mode — same page, different brains.
              </>
            ) : (
              <>
                Need cold email, objections, or pipeline help instead? You want{' '}
                <span className="text-zinc-400">Growth coach</span> in Sales mode.
              </>
            )}
          </p>
          {isSales ? (
            <button
              type="button"
              onClick={switchToDefenseAssistant}
              className="text-left text-xs font-medium text-rose-300/95 hover:text-rose-200 underline decoration-rose-400/40 underline-offset-2 hover:decoration-rose-300"
            >
              Switch to Defense assistant (Guard mode) →
            </button>
          ) : (
            <button
              type="button"
              onClick={switchToGrowthCoach}
              className="text-left text-xs font-medium text-teal-300/95 hover:text-teal-200 underline decoration-teal-400/35 underline-offset-2 hover:decoration-teal-300"
            >
              Switch to Growth coach (Sales mode) →
            </button>
          )}
        </div>

        {assistBanner && (
          <div
            className="mt-3 flex items-start gap-2 rounded-lg border border-teal-500/20 bg-teal-950/30 px-3 py-2.5 text-xs text-teal-100/95"
            role="status"
          >
            <span className="flex-1 leading-relaxed">{assistBanner}</span>
            <button
              type="button"
              onClick={() => setAssistBanner(null)}
              className="shrink-0 p-1 rounded-md text-teal-400/80 hover:text-white hover:bg-white/10"
              aria-label="Dismiss notice"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-6 min-h-0">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'assistant' && (
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-semibold text-white"
                style={{ backgroundColor: accentColor }}
              >
                Z
              </div>
            )}
            <div
              className={`max-w-lg rounded-xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                msg.role === 'user'
                  ? 'bg-[#12121c] text-white border border-[rgba(255,255,255,0.06)]'
                  : 'glass-panel text-[#ccc]'
              }`}
            >
              {msg.content}
            </div>
            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-full bg-[rgba(255,255,255,0.06)] flex items-center justify-center flex-shrink-0 text-[11px] font-medium text-[#888]">
                Y
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 mb-6">
          {isSales
            ? growthCoachPrompts.map(({ label, prompt }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => handleSend(prompt)}
                  className="siren-card px-4 py-3 text-sm text-[#888] hover:text-white hover:bg-[rgba(255,255,255,0.03)] transition-all duration-150 text-left min-h-[44px]"
                >
                  {label}
                </button>
              ))
            : guardSuggestions.map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSend(prompt)}
                  className="siren-card px-4 py-3 text-sm text-[#888] hover:text-white hover:bg-[rgba(255,255,255,0.03)] transition-all duration-150 text-left min-h-[44px]"
                >
                  {prompt}
                </button>
              ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder={isSales ? 'Ask Growth coach…' : 'Ask Defense assistant…'}
          className="flex-1 bg-[#0a0a1a] border border-[rgba(255,255,255,0.03)] rounded-lg px-4 py-3 text-sm text-white placeholder-[#555] focus:outline-none focus:border-[rgba(255,255,255,0.08)] transition-colors min-h-11"
        />
        <button
          type="button"
          onClick={() => handleSend()}
          className="px-4 rounded-lg transition-all duration-150 hover:opacity-80 text-white min-h-11 min-w-11 inline-flex items-center justify-center"
          style={{ backgroundColor: accentColor }}
          aria-label="Send message"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
