import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { createContext, useContext, useState } from 'react';
import { Layout } from './components/Layout';
import { Pipeline } from './pages/Pipeline';
import { Guard } from './pages/Guard';
import { Chat } from './pages/Chat';
import { Scripts } from './pages/Scripts';
import { SettingsPage } from './pages/SettingsPage';
import { MissionControl } from './pages/MissionControl';
import { Campaigns } from './pages/Campaigns';
import { Analytics } from './pages/Analytics';
import { ModuleStub } from './pages/ModuleStub';

type Mode = 'sales' | 'guard';

interface ModeContextType {
  mode: Mode;
  setMode: (mode: Mode) => void;
}

const ModeContext = createContext<ModeContextType>({ mode: 'sales', setMode: () => {} });

export function useMode() {
  return useContext(ModeContext);
}

function SalesOnly({ children }: { children: React.ReactNode }) {
  const { mode } = useMode();
  if (mode === 'guard') return <Navigate to="/guard" replace />;
  return <>{children}</>;
}

function App() {
  const [mode, setMode] = useState<Mode>('sales');

  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={mode === 'sales' ? <MissionControl /> : <Navigate to="/guard" />} />
            <Route
              path="/listen"
              element={
                <SalesOnly>
                  <ModuleStub
                    title="Listen"
                    description="Social intelligence — TrendPosts, keywords, tier caps. Pair with /social-listen and scripts/trendposts_append.py."
                  />
                </SalesOnly>
              }
            />
            <Route
              path="/target"
              element={
                <SalesOnly>
                  <ModuleStub
                    title="Target"
                    description="ICP, Apollo lists, Lead Score, Airtable pipeline — same lane as find-leads / enrich."
                  />
                </SalesOnly>
              }
            />
            <Route
              path="/publish"
              element={
                <SalesOnly>
                  <ModuleStub
                    title="Publish"
                    description="Multi-channel queue — Meta, X, Threads… Approved rows from PublishQueue."
                  />
                </SalesOnly>
              }
            />
            <Route
              path="/brand"
              element={
                <SalesOnly>
                  <ModuleStub
                    title="Brand kit"
                    description="Logo, voice, guidelines — BrandProfiles in Airtable; unlocks templates."
                  />
                </SalesOnly>
              }
            />
            <Route
              path="/affiliates"
              element={
                <SalesOnly>
                  <ModuleStub
                    title="Affiliates"
                    description="Viral Loops–class programs, referral links, RewardsQueue."
                  />
                </SalesOnly>
              }
            />
            <Route
              path="/briefings"
              element={
                <SalesOnly>
                  <ModuleStub
                    eyebrow="Growth Brain"
                    title="Briefings & optimizer"
                    description="Morning brief, OptimizationSuggestions, AgentRuns — approval-gated."
                  />
                </SalesOnly>
              }
            />
            <Route
              path="/campaigns"
              element={
                <SalesOnly>
                  <Campaigns />
                </SalesOnly>
              }
            />
            <Route
              path="/pipeline"
              element={
                <SalesOnly>
                  <Pipeline />
                </SalesOnly>
              }
            />
            <Route path="/deals" element={<Navigate to="/pipeline" replace />} />
            <Route
              path="/analytics"
              element={
                <SalesOnly>
                  <Analytics />
                </SalesOnly>
              }
            />
            <Route path="/guard" element={<Guard />} />
            <Route path="/chat" element={<Chat />} />
            <Route
              path="/scripts"
              element={
                <SalesOnly>
                  <Scripts />
                </SalesOnly>
              }
            />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ModeContext.Provider>
  );
}

export default App;
