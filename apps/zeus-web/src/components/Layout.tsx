import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useMode } from '../App';
import { AppHeader } from './AppHeader';
import { AmbientBackdrop } from './AmbientBackdrop';
import { CrossGridOverlay } from './CrossGridOverlay';
import { tntPpcAgents } from '../data/tntPpcAgents';

export type NavLane = 'growth' | 'voice' | 'ppc' | 'social';

export type SalesNavItem = {
  path: string;
  label: string;
  lane: NavLane;
  /** Highlight when pathname is this path or a child `/path/...` (e.g. PPC dashboard). */
  activePrefix?: boolean;
};

export const salesNavGroups: { heading: string; items: SalesNavItem[] }[] = [
  { heading: 'Mission', items: [{ path: '/', label: 'Mission Control', lane: 'voice' }] },
  {
    heading: 'Growth OS',
    items: [
      { path: '/listen', label: 'Listen', lane: 'growth' },
      { path: '/target', label: 'Target', lane: 'growth' },
      { path: '/engage', label: 'Engage', lane: 'growth' },
      { path: '/convert', label: 'Convert', lane: 'growth' },
      { path: '/report', label: 'Report', lane: 'growth' },
      { path: '/publish', label: 'Publish', lane: 'growth' },
      { path: '/influencers', label: 'Influencers', lane: 'growth' },
      { path: '/brand', label: 'Brand kit', lane: 'growth' },
      { path: '/brand/wizard', label: 'Brand wizard', lane: 'growth' },
      { path: '/affiliates', label: 'Affiliates', lane: 'growth' },
      { path: '/marketplace', label: 'Marketplace', lane: 'growth' },
      { path: '/briefings', label: 'Briefings', lane: 'growth' },
    ],
  },
  {
    heading: 'PPC — TNT',
    items: [
      { path: '/ppc', label: 'PPC dashboard', lane: 'ppc', activePrefix: true },
      ...tntPpcAgents.map(a => ({
        path: `/ppc/${a.id}`,
        label: a.label,
        lane: 'ppc' as const,
      })),
    ],
  },
  {
    heading: 'Social',
    items: [
      { path: '/social/activity', label: 'Activity', lane: 'social' },
      { path: '/social/autopost', label: 'Autopost', lane: 'social' },
      { path: '/social/replies', label: 'Comment AI', lane: 'social' },
    ],
  },
  {
    heading: 'Voice & outbound',
    items: [
      { path: '/campaigns', label: 'Campaigns', lane: 'voice' },
      { path: '/pipeline', label: 'Pipeline', lane: 'voice' },
      { path: '/analytics', label: 'Analytics', lane: 'voice' },
      { path: '/scripts', label: 'Script Library', lane: 'voice' },
      { path: '/chat', label: 'Chat', lane: 'voice' },
      { path: '/settings', label: 'Settings', lane: 'voice' },
    ],
  },
];

export const flatSalesNav = salesNavGroups.flatMap(g => g.items);

const guardNav = [
  { path: '/guard', label: 'Dashboard' },
  { path: '/chat', label: 'Chat' },
  { path: '/settings', label: 'Settings' },
];

const agents = [
  { name: 'Aria', color: '#4F8EF7' },
  { name: 'Nova', color: '#60a5fa' },
  { name: 'Rex', color: '#fb7185' },
  { name: 'Kai', color: '#34d399' },
];

function navActive(pathname: string, item: SalesNavItem): boolean {
  if (item.activePrefix) {
    return pathname === item.path || pathname.startsWith(`${item.path}/`);
  }
  return pathname === item.path;
}

function laneActiveClasses(lane: NavLane): string {
  switch (lane) {
    case 'growth':
      return 'bg-teal-500/10 text-teal-100 font-medium border border-teal-400/35 shadow-[0_0_22px_-10px_rgba(45,212,191,0.45)]';
    case 'ppc':
      return 'bg-amber-500/12 text-amber-100 font-medium border border-amber-400/30 shadow-[0_0_22px_-12px_rgba(245,158,11,0.35)]';
    case 'social':
      return 'bg-rose-500/12 text-rose-100 font-medium border border-rose-400/28 shadow-[0_0_22px_-12px_rgba(244,63,94,0.25)]';
    case 'voice':
    default:
      return 'bg-brand-blue/12 text-brand-blue font-medium border border-brand-blue/25';
  }
}

function laneIdleClasses(lane: NavLane): string {
  switch (lane) {
    case 'growth':
      return 'text-zinc-500 hover:text-teal-200/90 hover:bg-teal-500/5 border border-transparent';
    case 'ppc':
      return 'text-zinc-500 hover:text-amber-200/90 hover:bg-amber-500/5 border border-transparent';
    case 'social':
      return 'text-zinc-500 hover:text-rose-200/90 hover:bg-rose-500/5 border border-transparent';
    case 'voice':
    default:
      return 'text-zinc-500 hover:text-white hover:bg-white/[0.05]';
  }
}

function laneDot(lane: NavLane) {
  if (lane === 'growth') {
    return (
      <span
        className="w-1 h-1 rounded-full bg-teal-400/80 shadow-[0_0_8px_rgba(45,212,191,0.8)] flex-shrink-0"
        aria-hidden
      />
    );
  }
  if (lane === 'ppc') {
    return (
      <span
        className="w-1 h-1 rounded-full bg-amber-400/85 shadow-[0_0_8px_rgba(245,158,11,0.65)] flex-shrink-0"
        aria-hidden
      />
    );
  }
  if (lane === 'social') {
    return (
      <span
        className="w-1 h-1 rounded-full bg-rose-400/85 shadow-[0_0_8px_rgba(244,63,94,0.55)] flex-shrink-0"
        aria-hidden
      />
    );
  }
  return null;
}

function SalesNavGrouped({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation();
  return (
    <div className="space-y-5">
      {salesNavGroups.map(group => (
        <div key={group.heading}>
          <p className="text-[9px] uppercase tracking-[0.16em] text-zinc-600 mb-2 px-2 font-medium">{group.heading}</p>
          <ul className="space-y-0.5">
            {group.items.map(item => {
              const active = navActive(location.pathname, item);
              const showDot = item.lane === 'growth' || item.lane === 'ppc' || item.lane === 'social';
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={onNavigate}
                    className={`block px-3 py-2.5 rounded-lg text-[13px] transition-all duration-150 ${
                      active ? laneActiveClasses(item.lane) : laneIdleClasses(item.lane)
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {showDot ? laneDot(item.lane) : null}
                      <span className="truncate">{item.label}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

function GuardNavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation();
  return (
    <ul className="space-y-0.5">
      {guardNav.map(item => {
        const active = location.pathname === item.path;
        return (
          <li key={item.path}>
            <Link
              to={item.path}
              onClick={onNavigate}
              className={`block px-3 py-2.5 rounded-lg text-[13px] transition-all duration-150 ${
                active
                  ? 'bg-rose-500/15 text-rose-300 font-medium border border-rose-500/20'
                  : 'text-zinc-500 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { mode, setMode } = useMode();
  const isSales = mode === 'sales';
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileNavOpen]);

  const dynamicSalesTitle = (() => {
    const p = location.pathname;
    if (p.startsWith('/ppc/')) {
      const slug = p.replace(/^\/ppc\//, '');
      const agent = tntPpcAgents.find(a => a.id === slug);
      return agent?.label;
    }
    return undefined;
  })();

  const pageTitle =
    [...flatSalesNav, ...guardNav].find(n => n.path === location.pathname)?.label ??
    dynamicSalesTitle ??
    ({
      '/social/activity': 'Social activity',
      '/social/autopost': 'Autopost',
      '/social/replies': 'Comment AI',
    }[location.pathname]) ??
    (location.pathname.startsWith('/scripts') ? 'Script Library' : 'Zeus');

  return (
    <>
      <AmbientBackdrop />
      <CrossGridOverlay />
      <div className="relative z-10 flex min-h-screen w-full railway-app-shell">
        {mobileNavOpen && (
          <button
            type="button"
            className="fixed inset-0 bg-black/65 z-40 lg:hidden backdrop-blur-sm"
            aria-label="Close menu"
            onClick={() => setMobileNavOpen(false)}
          />
        )}

        <aside
          className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 flex-shrink-0 flex flex-col min-h-screen
          border-r border-white/[0.09]
          bg-[#0a0a0c]/92 backdrop-blur-xl
          shadow-[4px_0_40px_rgba(0,0,0,0.6),inset_0_0_0_1px_rgba(45,212,191,0.06),inset_-1px_0_0_rgba(212,168,85,0.06)]
          transition-transform duration-200 ease-out
          ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        >
          <div className="px-6 pt-7 pb-1">
            <Link to="/" className="block group" onClick={() => setMobileNavOpen(false)}>
              <h1 className="text-xl font-bold tracking-tight logo-gradient">Zeus</h1>
              <p className="text-[11px] text-zinc-500 mt-1 tracking-wide">Growth OS</p>
            </Link>
          </div>

          <div className="px-4 py-5">
            <div className="flex rounded-lg p-0.5 border border-white/10 bg-black/40 shadow-inner">
              <button
                type="button"
                onClick={() => setMode('sales')}
                className={`flex-1 py-2 text-xs font-semibold tracking-wide rounded-md transition-all duration-150 ${
                  isSales ? 'zeus-cta-surge !rounded-md text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Sales
              </button>
              <button
                type="button"
                onClick={() => setMode('guard')}
                className={`flex-1 py-2 text-xs font-semibold tracking-wide rounded-md transition-all duration-150 ${
                  !isSales
                    ? 'text-white bg-gradient-to-r from-rose-600 to-rose-500 shadow-[0_2px_16px_rgba(244,63,94,0.35)]'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Guard
              </button>
            </div>
          </div>

          <nav className="flex-1 px-3 overflow-y-auto">
            {isSales ? (
              <SalesNavGrouped onNavigate={() => setMobileNavOpen(false)} />
            ) : (
              <GuardNavLinks onNavigate={() => setMobileNavOpen(false)} />
            )}
          </nav>

          <div className="px-4 pb-6 pt-2 border-t border-white/[0.06]">
            <p className="text-[10px] uppercase tracking-[1.5px] text-zinc-600 mb-3 px-2">Agents</p>
            <div className="space-y-2">
              {agents.map(agent => (
                <div key={agent.name} className="flex items-center gap-2.5 px-2">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0 ring-2 ring-black/50"
                    style={{ backgroundColor: agent.color }}
                  />
                  <span className="text-xs text-zinc-500">{agent.name}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <div className="relative z-10 flex-1 flex flex-col min-h-screen min-w-0 lg:ml-0 bg-gradient-to-br from-zinc-950/80 via-[#06080c]/50 to-teal-950/15 lg:rounded-tl-3xl lg:border-l lg:border-t border-white/[0.06]">
          <AppHeader pageTitle={pageTitle} onMenuClick={() => setMobileNavOpen(true)} />
          <main className="flex-1 px-4 md:px-8 py-6 md:py-8 overflow-y-auto">{children}</main>
        </div>
      </div>
    </>
  );
}
