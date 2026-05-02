import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Bell, ChevronDown, CircleHelp, Menu, PanelLeft, Sparkles, User } from 'lucide-react';
import { usage, workspace, headerNotifications } from '../data/operations';

type AppHeaderProps = {
  pageTitle: string;
  onMenuClick?: () => void;
};

export function AppHeader({ pageTitle, onMenuClick }: AppHeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function close(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
    }
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const pct = Math.min(100, Math.round((usage.voiceMinutesUsed / usage.voiceMinutesIncluded) * 100));
  const unread = headerNotifications.filter(n => n.unread).length;
  const usageTitle = `${usage.voiceMinutesUsed.toLocaleString()} / ${usage.voiceMinutesIncluded.toLocaleString()} min · resets ${usage.billingPeriodEnd} · ${pct}%`;

  return (
    <header className="relative min-h-14 flex-shrink-0 flex items-center justify-between gap-3 py-2 md:py-0 md:h-14 px-4 md:px-6 bg-zinc-950/50 backdrop-blur-md border-b border-transparent">
      {/* Gradient hairline — CoFounder blue + gold thread */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-blue/85 to-transparent opacity-95"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-[8%] right-[8%] h-[2px] blur-sm bg-gradient-to-r from-brand-navy/45 via-brand-blue/55 to-brand-gold/40"
        aria-hidden
      />
      <div className="flex flex-1 min-w-0 items-center gap-2 md:gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 -ml-1 flex-shrink-0 self-center"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex flex-col min-w-0 flex-1 sm:flex-initial md:max-w-[min(100%,16rem)] lg:max-w-none">
          <span className="text-[10px] uppercase tracking-wider text-zinc-600 hidden sm:block">Workspace</span>
          <button
            type="button"
            className="flex items-center gap-1 text-left text-sm font-medium text-white truncate min-w-0"
          >
            {workspace.name}
            <ChevronDown className="w-3.5 h-3.5 text-zinc-600 flex-shrink-0" />
          </button>
          <span className="md:hidden text-[11px] text-zinc-400 truncate leading-snug min-w-0" title={pageTitle}>
            {pageTitle}
          </span>
        </div>
        <span className="hidden md:inline-flex items-center gap-1.5 flex-shrink-0 text-[10px] uppercase tracking-wider px-2 py-1 rounded-md bg-brand-blue/12 text-brand-blue border border-brand-blue/22">
          <Sparkles className="w-3 h-3" />
          {workspace.plan}
        </span>
        <div className="hidden md:flex flex-1 min-w-0 items-center gap-2">
          <PanelLeft className="w-3.5 h-3.5 text-zinc-600 flex-shrink-0" />
          <h1 className="text-sm font-medium text-zinc-300 tracking-wide truncate min-w-0">{pageTitle}</h1>
        </div>
      </div>

      <div className="flex flex-shrink-0 items-center gap-1 sm:gap-2">
        <div
          className="hidden md:flex items-center gap-2 mr-1 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] max-w-[200px]"
          title={usageTitle}
        >
          <div className="flex-1 h-1.5 rounded-full bg-[rgba(255,255,255,0.08)] overflow-hidden min-w-[72px]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-navy via-brand-blue to-brand-gold"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-[10px] text-zinc-500 tabular-nums whitespace-nowrap">{pct}%</span>
        </div>

        <button
          type="button"
          className="md:hidden p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5"
          title={usageTitle}
          aria-label={`Voice usage · ${usageTitle}`}
        >
          <Activity className="w-5 h-5" />
        </button>

        <Link
          to="/chat"
          className="hidden sm:inline-flex p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5"
          title="Growth coach"
        >
          <CircleHelp className="w-5 h-5" />
        </Link>

        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotifOpen(o => !o)}
            className="relative p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5"
            aria-expanded={notifOpen}
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unread > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-blue ring-2 ring-zinc-950" />
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-1 w-[min(100vw-2rem,320px)] siren-card py-2 shadow-xl z-50 border border-[rgba(255,255,255,0.08)]">
              <p className="px-3 py-2 text-[10px] uppercase tracking-wider text-zinc-600">Notifications</p>
              <ul className="max-h-72 overflow-y-auto">
                {headerNotifications.map(n => (
                  <li
                    key={n.id}
                    className={`px-3 py-2.5 border-t border-[rgba(255,255,255,0.04)] hover:bg-white/[0.03] ${n.unread ? 'bg-brand-blue/[0.07]' : ''}`}
                  >
                    <p className="text-sm text-white font-medium">{n.title}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{n.body}</p>
                    <p className="text-[10px] text-zinc-600 mt-1">{n.time}</p>
                  </li>
                ))}
              </ul>
              <Link
                to="/settings"
                className="block text-center text-xs text-brand-blue py-2 border-t border-[rgba(255,255,255,0.06)] hover:bg-white/5"
                onClick={() => setNotifOpen(false)}
              >
                Notification settings
              </Link>
            </div>
          )}
        </div>

        <div className="relative" ref={userRef}>
          <button
            type="button"
            onClick={() => setUserOpen(o => !o)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-white/5"
            aria-expanded={userOpen}
          >
            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-navy via-brand-blue to-brand-gold flex items-center justify-center ring-2 ring-white/10">
              <User className="w-4 h-4 text-white" />
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-600 hidden sm:block" />
          </button>
          {userOpen && (
            <div className="absolute right-0 mt-1 w-48 siren-card py-1 z-50 border border-[rgba(255,255,255,0.08)]">
              <Link to="/settings" className="block px-3 py-2 text-sm text-white hover:bg-white/5" onClick={() => setUserOpen(false)}>
                Profile & settings
              </Link>
              <button type="button" className="w-full text-left px-3 py-2 text-sm text-zinc-500 hover:bg-white/5 hover:text-white">
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
