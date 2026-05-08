import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Copy, Mic, Pencil, RefreshCw, Send, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useMode } from '../App';
import { growthCoachPrompts } from '../data/growthCoachPrompts';
import { trackZeus } from '../lib/analytics';
import { chatStrings } from '../i18n/chatStrings';
import { readDraft, writeDraft } from '../hooks/useSessionDraft';
import { ChatBreadcrumb } from '../components/chat/ChatBreadcrumb';
import { AssistantAnnouncer } from '../components/chat/AssistantAnnouncer';
import { TypingIndicator } from '../components/chat/TypingIndicator';
import { fetchChatCompletion } from '../api/chat';
import { buildDefenseAssistantStub } from '../lib/guardTelemetry';

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

type SendSource = 'composer' | 'chip' | 'regenerate' | 'url';

/** Large paste: cap inserted chunk and total composer length (client-side safety). */
const MAX_PASTE_CHUNK = 10_000;
const MAX_INPUT_LEN = 16_000;
const LARGE_PASTE_THRESHOLD = 600;

export function Chat({ variant = 'page' }: { variant?: 'page' | 'mission' }) {
  const { mode, setMode } = useMode();
  const isSales = mode === 'sales';
  const [searchParams, setSearchParams] = useSearchParams();
  const processedUrlSeeds = useRef(new Set<string>());
  const skipModeReset = useRef(false);
  const skipInitialModeReset = useRef(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: 'assistant', content: isSales ? SALES_WELCOME : GUARD_WELCOME },
  ]);
  const [input, setInput] = useState(() => readDraft(isSales ? 'sales' : 'guard'));
  const [assistBanner, setAssistBanner] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [announceText, setAnnounceText] = useState<string | null>(null);
  const [exportToast, setExportToast] = useState<string | null>(null);
  const [voiceToast, setVoiceToast] = useState<string | null>(null);
  const [pasteToast, setPasteToast] = useState<string | null>(null);
  const typingLock = useRef(false);
  const voiceRecRef = useRef<{ stop: () => void } | null>(null);

  const accentColor = isSales ? '#a78bfa' : '#fb7185';

  const threadTitle = useMemo(() => {
    const firstUser = messages.find(m => m.role === 'user');
    if (!firstUser) return chatStrings.threadUntitled;
    const t = firstUser.content.trim();
    return t.length > 42 ? `${t.slice(0, 39)}…` : t;
  }, [messages]);

  const assistantReply = useCallback(
    (userText: string) => {
      return isSales
        ? `Great question about "${userText}". Here's what I'd suggest:\n\n1. Lead with value, not features\n2. Reference a specific pain point from your discovery call\n3. Keep it under 3 paragraphs\n4. End with a clear, low-friction CTA\n\nWant me to draft something specific?`
        : buildDefenseAssistantStub(userText);
    },
    [isSales]
  );

  const handleSend = useCallback(
    (text?: string, source: SendSource = 'composer') => {
      const raw = (text ?? input).trim();
      if (!raw || typingLock.current) return;

      typingLock.current = true;
      const userMsg: Message = { id: Date.now(), role: 'user', content: raw };
      setMessages(prev => [...prev, userMsg]);
      if (source === 'composer') {
        setInput('');
        writeDraft(isSales ? 'sales' : 'guard', '');
      }

      trackZeus('prompt_send', {
        mode: isSales ? 'sales' : 'guard',
        source,
      });

      setIsTyping(true);
      setAnnounceText(null);

      const transcript = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content,
      }));

      void (async () => {
        await new Promise(r => window.setTimeout(r, 320));
        let body = assistantReply(raw);
        const api = await fetchChatCompletion({
          mode: isSales ? 'sales' : 'guard',
          messages: transcript,
        });
        if (api?.content) {
          body = api.content;
          trackZeus('assistant_reply_api', { mode: isSales ? 'sales' : 'guard' });
        } else {
          trackZeus('assistant_reply_stub', { mode: isSales ? 'sales' : 'guard' });
        }
        const botMsg: Message = { id: Date.now() + 1, role: 'assistant', content: body };
        setMessages(prev => [...prev, botMsg]);
        setIsTyping(false);
        typingLock.current = false;
        setAnnounceText(body.slice(0, 240));
      })();
    },
    [input, isSales, assistantReply, messages]
  );

  const handleSendRef = useRef(handleSend);
  useEffect(() => {
    handleSendRef.current = handleSend;
  }, [handleSend]);

  /** Reset thread when Sales/Guard changes; restore draft for target mode. */
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
    setInput(readDraft(isSales ? 'sales' : 'guard'));
    processedUrlSeeds.current.clear();
  }, [mode, isSales]);

  /** Persist composer draft (backlog: session memory). */
  useEffect(() => {
    writeDraft(isSales ? 'sales' : 'guard', input);
  }, [input, isSales]);

  /**
   * Deep link ?q= — seed composer send from URL.
   * - Depends on the actual `q` string so a **changed** `?q=` always runs (not a single boolean guard).
   * - Dedupes only duplicate effect runs for the **same** `q` (e.g. React Strict Mode) via a Set.
   * - When `q` is absent from the URL, clear the Set so a later link with the same text can seed again.
   * - `URLSearchParams.get('q')` is already decoded; do not decodeURIComponent again.
   */
  const qFromUrl = searchParams.get('q');
  useEffect(() => {
    if (!qFromUrl) {
      processedUrlSeeds.current.clear();
      return;
    }
    if (processedUrlSeeds.current.has(qFromUrl)) return;
    processedUrlSeeds.current.add(qFromUrl);

    setSearchParams(
      p => {
        const next = new URLSearchParams(p);
        next.delete('q');
        return next;
      },
      { replace: true }
    );
    skipModeReset.current = true;
    setMessages([
      { id: Date.now(), role: 'assistant', content: isSales ? SALES_WELCOME : GUARD_WELCOME },
    ]);
    queueMicrotask(() => handleSendRef.current(qFromUrl, 'url'));
  }, [isSales, qFromUrl, setSearchParams]);

  /** / focuses composer; Esc dismisses banner (backlog: shortcuts). */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (e.key === '/' && t && !['INPUT', 'TEXTAREA'].includes(t.tagName)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') setAssistBanner(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(
    () => () => {
      voiceRecRef.current?.stop();
      voiceRecRef.current = null;
    },
    []
  );

  const switchToDefenseAssistant = () => {
    trackZeus('wrong_assistant_switch', { to: 'guard' });
    setAssistBanner(
      'Switched to Guard. You are now on the Defense assistant (whitelist, personas, intercepted-call stats). The Sales / Guard toggle in the sidebar matches this.'
    );
    setMode('guard');
  };

  const switchToGrowthCoach = () => {
    trackZeus('wrong_assistant_switch', { to: 'sales' });
    setAssistBanner(
      'Switched to Sales. You are now on the Growth coach (outbound copy, objections, pipeline). Use Guard when you need spam defense instead.'
    );
    setMode('sales');
  };

  const exportTranscript = async () => {
    const lines = messages.map(m => `**${m.role}:** ${m.content}`);
    const md = `# Zeus transcript (${isSales ? 'Growth' : 'Guard'})\n\n${lines.join('\n\n')}\n`;
    try {
      await navigator.clipboard.writeText(md);
      trackZeus('transcript_export', {
        mode: isSales ? 'sales' : 'guard',
        messages: messages.length,
      });
      setExportToast(chatStrings.exportCopied);
      window.setTimeout(() => setExportToast(null), 3200);
    } catch {
      setExportToast('Could not copy — try a secure context (HTTPS).');
      window.setTimeout(() => setExportToast(null), 3200);
    }
  };

  const regenerate = () => {
    setMessages(prev => {
      if (prev.length < 3) return prev;
      const last = prev[prev.length - 1];
      const before = prev[prev.length - 2];
      if (last.role !== 'assistant' || before.role !== 'user') return prev;
      const userText = before.content;
      trackZeus('regenerate_last', { mode: isSales ? 'sales' : 'guard' });
      queueMicrotask(() => handleSendRef.current(userText, 'regenerate'));
      return prev.slice(0, -2);
    });
  };

  const editLastUser = useCallback(() => {
    if (isTyping || typingLock.current) return;
    setMessages(prev => {
      if (prev.length < 2) return prev;
      const last = prev[prev.length - 1];
      const before = prev[prev.length - 2];
      let userText: string | null = null;
      let next = prev;
      if (last.role === 'assistant' && before.role === 'user') {
        userText = before.content;
        next = prev.slice(0, -2);
      } else if (last.role === 'user') {
        userText = last.content;
        next = prev.slice(0, -1);
      }
      if (userText !== null) {
        const text = userText;
        queueMicrotask(() => {
          setInput(text);
          writeDraft(isSales ? 'sales' : 'guard', text);
        });
        trackZeus('chat_edit_last', { mode: isSales ? 'sales' : 'guard' });
        return next;
      }
      return prev;
    });
  }, [isSales, isTyping]);

  const startVoice = useCallback(() => {
    type RecCtor = new () => {
      lang: string;
      interimResults: boolean;
      continuous: boolean;
      start: () => void;
      stop: () => void;
      onresult: ((e: Event) => void) | null;
      onerror: ((e: Event) => void) | null;
      onend: (() => void) | null;
    };
    const w = window as unknown as { SpeechRecognition?: RecCtor; webkitSpeechRecognition?: RecCtor };
    const SR = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!SR) {
      setVoiceToast(chatStrings.voiceUnsupported);
      trackZeus('chat_voice_unsupported', {});
      window.setTimeout(() => setVoiceToast(null), 4200);
      return;
    }
    voiceRecRef.current?.stop();
    voiceRecRef.current = null;
    const rec = new SR();
    rec.lang = 'en-US';
    rec.interimResults = true;
    rec.continuous = false;
    rec.onresult = e => {
      const ev = e as unknown as {
        resultIndex: number;
        results: { length: number; [i: number]: { 0: { transcript: string } } };
      };
      let text = '';
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        text += ev.results[i][0].transcript;
      }
      const chunk = text.trim();
      if (!chunk) return;
      setInput(prev => (prev ? `${prev} ${chunk}`.trim() : chunk));
    };
    rec.onerror = () => {
      setVoiceToast('Voice input stopped');
      trackZeus('chat_voice_error', {});
      window.setTimeout(() => setVoiceToast(null), 3200);
    };
    rec.onend = () => {
      voiceRecRef.current = null;
    };
    rec.start();
    voiceRecRef.current = { stop: () => rec.stop() };
    trackZeus('chat_voice_start', { mode: isSales ? 'sales' : 'guard' });
  }, [isSales]);

  return (
    <div
      className={`flex flex-col min-h-[min(70vh,720px)] w-full min-w-0 ${variant === 'mission' ? 'max-w-none' : 'max-w-4xl'}`}
    >
      <AssistantAnnouncer text={announceText} />
      {(variant === 'page' || variant === 'mission') && <ChatBreadcrumb />}

      <div className="mb-5">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            {isSales ? chatStrings.growthEyebrow : chatStrings.guardEyebrow}
          </p>
          <span
            className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
              isSales
                ? 'border-violet-500/35 text-violet-300/95 bg-violet-950/40'
                : 'border-rose-500/35 text-rose-300/95 bg-rose-950/35'
            }`}
          >
            {isSales ? chatStrings.modeBadgeSales : chatStrings.modeBadgeGuard}
          </span>
        </div>
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          {isSales ? chatStrings.growthTitle : chatStrings.defenseTitle}
        </h2>
        <p className="text-sm text-zinc-400 mt-1.5 font-medium truncate" title={threadTitle}>
          {threadTitle}
        </p>
        <p className="text-sm text-zinc-400 mt-2">
          {isSales ? chatStrings.growthSubtitle : chatStrings.guardSubtitle}
        </p>
        <p className="text-[11px] text-zinc-500 mt-2">{chatStrings.sessionMemoryHint}</p>

        <div className="mt-4 rounded-xl border border-white/[0.07] bg-[rgba(8,10,14,0.65)] px-3 py-3">
          <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-500 mb-2">
            {chatStrings.wrongAssistantLabel}
          </p>
          <p className="text-xs text-zinc-400 leading-relaxed mb-3">
            {isSales ? chatStrings.salesWrongExplainer : chatStrings.guardWrongExplainer}
          </p>
          {isSales ? (
            <button
              type="button"
              onClick={switchToDefenseAssistant}
              className="text-left text-xs font-medium text-rose-300/95 hover:text-rose-200 underline decoration-rose-400/40 underline-offset-2 hover:decoration-rose-300"
            >
              {chatStrings.switchToDefense}
            </button>
          ) : (
            <button
              type="button"
              onClick={switchToGrowthCoach}
              className="text-left text-xs font-medium text-teal-300/95 hover:text-teal-200 underline decoration-teal-400/35 underline-offset-2 hover:decoration-teal-300"
            >
              {chatStrings.switchToGrowth}
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
              aria-label={chatStrings.dismissNotice}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div className="mt-3 flex flex-wrap gap-2 items-center">
          <button
            type="button"
            onClick={exportTranscript}
            className="inline-flex items-center gap-1.5 text-[11px] font-medium text-zinc-400 hover:text-white border border-white/[0.08] rounded-lg px-2.5 py-1.5 min-h-9"
          >
            <Copy className="w-3.5 h-3.5" />
            {chatStrings.exportTranscript}
          </button>
          <button
            type="button"
            onClick={regenerate}
            disabled={messages.length < 3 || isTyping}
            className="inline-flex items-center gap-1.5 text-[11px] font-medium text-zinc-400 hover:text-white border border-white/[0.08] rounded-lg px-2.5 py-1.5 min-h-9 disabled:opacity-40"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {chatStrings.regenerate}
          </button>
          <button
            type="button"
            onClick={editLastUser}
            disabled={messages.length < 2 || isTyping}
            className="inline-flex items-center gap-1.5 text-[11px] font-medium text-zinc-400 hover:text-white border border-white/[0.08] rounded-lg px-2.5 py-1.5 min-h-9 disabled:opacity-40"
          >
            <Pencil className="w-3.5 h-3.5" />
            {chatStrings.editLast}
          </button>
          {exportToast && (
            <span className="text-[11px] text-teal-400/95" role="status">
              {exportToast}
            </span>
          )}
          {voiceToast && (
            <span className="text-[11px] text-amber-400/95" role="alert">
              {voiceToast}
            </span>
          )}
          {pasteToast && (
            <span className="text-[11px] text-zinc-400/95" role="status">
              {pasteToast}
            </span>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-6 min-h-0">
        {messages.length === 1 && (
          <div className="flex justify-center py-2 mb-1" aria-hidden>
            <div
              className="h-12 w-12 rounded-full border border-white/[0.06] opacity-90"
              style={{
                background:
                  'radial-gradient(circle at 30% 30%, rgba(45,212,191,0.22), transparent 65%), radial-gradient(circle at 70% 70%, rgba(167,139,250,0.15), transparent 60%)',
              }}
            />
          </div>
        )}
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
                  : 'glass-panel text-zinc-300'
              }`}
            >
              {msg.content}
            </div>
            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-full bg-[rgba(255,255,255,0.06)] flex items-center justify-center flex-shrink-0 text-[11px] font-medium text-zinc-500">
                Y
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3 items-start">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-semibold text-white"
              style={{ backgroundColor: accentColor }}
            >
              Z
            </div>
            <div className="glass-panel rounded-xl px-4 py-2 text-sm text-zinc-500" aria-busy="true">
              <span className="sr-only">{chatStrings.typing}</span>
              <TypingIndicator />
            </div>
          </div>
        )}
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 mb-6">
          {isSales
            ? growthCoachPrompts.map(({ label, prompt }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    trackZeus('growth_prompt_chip', { label });
                    handleSend(prompt, 'chip');
                  }}
                  className="siren-card px-4 py-3 text-sm text-zinc-400 hover:text-white hover:bg-[rgba(255,255,255,0.03)] transition-all duration-150 text-left min-h-[44px]"
                >
                  {label}
                </button>
              ))
            : guardSuggestions.map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    trackZeus('guard_prompt_chip', { index: i });
                    handleSend(prompt, 'chip');
                  }}
                  className="siren-card px-4 py-3 text-sm text-zinc-400 hover:text-white hover:bg-[rgba(255,255,255,0.03)] transition-all duration-150 text-left min-h-[44px]"
                >
                  {prompt}
                </button>
              ))}
        </div>
      )}

      {/* Input */}
      <div className="flex flex-col gap-1.5">
        <p className="text-[10px] text-zinc-600">{chatStrings.hotkeyFocusHint}</p>
        <div className="flex gap-2 sm:gap-3 items-stretch">
          <button
            type="button"
            onClick={startVoice}
            disabled={isTyping}
            className="shrink-0 px-3 rounded-lg border border-white/[0.08] text-zinc-300 hover:text-white hover:bg-white/[0.05] min-h-11 inline-flex items-center justify-center disabled:opacity-40 transition-colors"
            aria-label={chatStrings.voiceInput}
            title={chatStrings.voiceInput}
          >
            <Mic className="w-4 h-4" />
          </button>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            onPaste={e => {
              const t = e.clipboardData?.getData('text/plain') ?? '';
              if (t.length <= LARGE_PASTE_THRESHOLD) return;
              e.preventDefault();
              const chunk = t.slice(0, MAX_PASTE_CHUNK);
              setInput(prev => {
                const merged = `${prev ? `${prev}\n\n` : ''}${chunk}`;
                return merged.length > MAX_INPUT_LEN ? merged.slice(0, MAX_INPUT_LEN) : merged;
              });
              setPasteToast(chatStrings.pasteLargeHint);
              window.setTimeout(() => setPasteToast(null), 3800);
              trackZeus('chat_paste_large', { len: chunk.length });
            }}
            placeholder={isSales ? chatStrings.placeholderGrowth : chatStrings.placeholderDefense}
            className="flex-1 min-w-0 bg-[#0a0a1a] border border-[rgba(255,255,255,0.03)] rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[rgba(255,255,255,0.08)] transition-colors min-h-11"
          />
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={isTyping}
            className="shrink-0 px-4 rounded-lg transition-all duration-150 hover:opacity-80 text-white min-h-11 min-w-11 inline-flex items-center justify-center disabled:opacity-40"
            style={{ backgroundColor: accentColor }}
            aria-label={chatStrings.sendLabel}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
