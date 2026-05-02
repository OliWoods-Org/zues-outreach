import { useCallback, useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
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

export function Chat() {
  const { mode } = useMode();
  const isSales = mode === 'sales';
  const [searchParams, setSearchParams] = useSearchParams();
  const seededFromUrl = useRef(false);

  const salesWelcome =
    "Hey — I'm your Growth coach (outbound, email, objections, pipeline). Defense assistant is separate: switch the Sales / Guard toggle for spam defense and personas.";
  const guardWelcome =
    "I'm your Defense assistant — Guard desk for whitelist, personas, and intercepted calls. For sales copy and pipeline help, switch back to Sales (Growth coach).";

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: isSales ? salesWelcome : guardWelcome,
    },
  ]);
  const [input, setInput] = useState('');

  const suggestions = isSales
    ? growthCoachPrompts.map(p => p.prompt)
    : guardSuggestions;
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
    queueMicrotask(() => handleSend(decoded));
  }, [isSales, searchParams, setSearchParams, handleSend]);

  return (
    <div className="flex flex-col min-h-[min(70vh,720px)] max-w-4xl w-full min-w-0">
      <div className="mb-6">
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
