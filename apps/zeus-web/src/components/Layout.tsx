import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useMode } from '../App';
import { AppHeader } from './AppHeader';
import { AmbientBackdrop } from './AmbientBackdrop';
import { CrossGridOverlay } from './CrossGridOverlay';

const salesNav = [
  { path: '/', label: 'Mission Control' },
  { path: '/listen', label: 'Listen' },
  { path: '/target', label: 'Target' },
  { path: '/campaigns', label: 'Campaigns' },
  { path: '/pipeline', label: 'Pipeline' },
  { path: '/analytics', label: 'Analytics' },
  { path: '/publish', label: 'Publish' },
  { path: '/brand', label: 'Brand kit' },
  { path: '/affiliates', label: 'Affiliates' },
  { path: '/scripts', label: 'Script Library' },
  { path: '/briefings', label: 'Briefings' },
  { path: '/chat', label: 'Chat' },
  { path: '/settings', label: 'Settings' },
];

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

function NavLinks({
  nav,
  isSales,
  onNavigate,
}: {
  nav: typeof salesNav;
  isSales: boolean;
  onNavigate?: () => void;
}) {
  const location = useLocation();
  return (
    <ul className="space-y-0.5">
      {nav.map(item => {
        const active = location.pathname === item.path;
        return (
          <li key={item.path}>
            <Link
              to={item.path}
              onClick={onNavigate}
              className={`block px-3 py-2.5 rounded-lg text-[13px] transition-all duration-150 ${
                active
                  ? isSales
                    ? 'bg-brand-blue/12 text-brand-blue font-medium border border-brand-blue/25'
                    : 'bg-rose-500/15 text-rose-300 font-medium border border-rose-500/20'
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
  const nav = isSales ? salesNav : guardNav;
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

  const pageTitle =
    [...salesNav, ...guardNav].find(n => n.path === location.pathname)?.label ??
    (location.pathname.startsWith('/scripts') ? 'Script Library' : 'Zeus');

  return (
    <>
      <AmbientBackdrop />
      <CrossGridOverlay />
      <div className="relative z-10 flex min-h-screen w-full railway-app-shell">
      {/* Mobile overlay */}
      {mobileNavOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black/65 z-40 lg:hidden backdrop-blur-sm"
          aria-label="Close menu"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 flex-shrink-0 flex flex-col min-h-screen
          border-r border-white/[0.09]
          bg-[#0a0a0c]/92 backdrop-blur-xl
          shadow-[4px_0_40px_rgba(0,0,0,0.6),inset_0_0_0_1px_rgba(79,142,247,0.07),inset_-1px_0_0_rgba(212,168,85,0.06)]
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
                isSales
                  ? 'btn-primary-railway !rounded-md text-white'
                  : 'text-zinc-500 hover:text-zinc-300'
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
          <NavLinks nav={nav} isSales={isSales} onNavigate={() => setMobileNavOpen(false)} />
        </nav>

        <div className="px-4 pb-6 pt-2 border-t border-white/[0.06]">
          <p className="text-[10px] uppercase tracking-[1.5px] text-zinc-600 mb-3 px-2">Agents</p>
          <div className="space-y-2">
            {agents.map(agent => (
              <div key={agent.name} className="flex items-center gap-2.5 px-2">
                <div className="w-2 h-2 rounded-full flex-shrink-0 ring-2 ring-black/50" style={{ backgroundColor: agent.color }} />
                <span className="text-xs text-zinc-500">{agent.name}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <div className="relative z-10 flex-1 flex flex-col min-h-screen min-w-0 lg:ml-0 bg-gradient-to-br from-zinc-950/75 via-[#08080a]/40 to-brand-navy/10 lg:rounded-tl-3xl lg:border-l lg:border-t border-white/[0.06]">
        <AppHeader pageTitle={pageTitle} onMenuClick={() => setMobileNavOpen(true)} />
        <main className="flex-1 px-4 md:px-8 py-6 md:py-8 overflow-y-auto">{children}</main>
      </div>
    </div>
    </>
  );
}
