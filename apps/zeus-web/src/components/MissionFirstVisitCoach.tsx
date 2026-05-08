import { useState } from 'react';
import { MessageSquareText, Sparkles, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { trackZeus } from '../lib/analytics';

const STORAGE_KEY = 'zeus-mission-chat-coach-dismiss';

/**
 * One-time spotlight for Mission Control chat-first layout (backlog #1).
 */
export function MissionFirstVisitCoach() {
  const [open, setOpen] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) !== '1';
    } catch {
      return true;
    }
  });

  if (!open) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
    setOpen(false);
    trackZeus('mission_chat_coach_dismiss', {});
  };

  return (
    <div
      className="pointer-events-none absolute inset-x-3 top-3 z-10 flex justify-center sm:justify-end sm:pr-2"
      aria-live="polite"
    >
      <div className="pointer-events-auto max-w-md rounded-xl border border-teal-400/35 bg-[rgba(6,14,18,0.92)] backdrop-blur-md px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.55)]">
        <div className="flex gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-teal-400/30 bg-teal-500/15 text-teal-200">
            <Sparkles className="h-4 w-4" aria-hidden />
          </span>
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-teal-400/90 mb-1">
              Growth coach lives here
            </p>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Ask for outreach copy and objections in this panel. Telemetry and shortcuts stay in the{' '}
              <strong className="text-zinc-200 font-medium">left column</strong>. Full-screen chat anytime from{' '}
              <Link to="/chat" className="text-teal-300 hover:text-teal-200 underline underline-offset-2">
                Growth coach
              </Link>{' '}
              in the sidebar.
            </p>
            <div className="mt-3 flex flex-wrap gap-2 items-center">
              <button
                type="button"
                onClick={dismiss}
                className="inline-flex items-center gap-1.5 rounded-lg bg-teal-500/20 border border-teal-400/35 px-3 py-1.5 text-xs font-medium text-teal-100 hover:bg-teal-500/30 transition-colors"
              >
                <MessageSquareText className="w-3.5 h-3.5" aria-hidden />
                Got it
              </button>
              <button
                type="button"
                onClick={dismiss}
                className="inline-flex items-center justify-center min-h-9 min-w-9 rounded-lg text-zinc-500 hover:text-white hover:bg-white/10"
                aria-label="Dismiss tip"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
