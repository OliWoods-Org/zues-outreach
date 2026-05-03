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
import { AffiliatesModule } from './pages/AffiliatesModule';
import { BriefingsBrain } from './pages/BriefingsBrain';
import { BrandWizard } from './pages/BrandWizard';
import { InfluencersModule } from './pages/InfluencersModule';
import { ListenModule } from './pages/ListenModule';
import { PpcDashboard } from './pages/PpcDashboard';
import { PpcAgentDetail } from './pages/PpcAgentDetail';
import { SocialActivity } from './pages/SocialActivity';
import { ContentCalendar } from './pages/ContentCalendar';
import { Onboarding } from './pages/Onboarding';
import { ContentStudio } from './pages/ContentStudio';
import { MorningBrief } from './pages/MorningBrief';

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
                  <ListenModule />
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
              path="/engage"
              element={
                <SalesOnly>
                  <ModuleStub
                    title="Engage"
                    description="Email sequences (Instantly) + Siren voice — plugin agents and campaigns. Pairs with Voice → Campaigns & Chat."
                  />
                </SalesOnly>
              }
            />
            <Route
              path="/convert"
              element={
                <SalesOnly>
                  <ModuleStub
                    title="Convert"
                    description="CRM + pipeline — HubSpot sync, meetings booked, stages in Airtable Leads. Links to Pipeline."
                  />
                </SalesOnly>
              }
            />
            <Route
              path="/report"
              element={
                <SalesOnly>
                  <ModuleStub
                    title="Report"
                    description="Unified KPI lens — campaign + social + optional content metrics; deep links to Analytics & Briefings."
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
              path="/brand/wizard"
              element={
                <SalesOnly>
                  <BrandWizard />
                </SalesOnly>
              }
            />
            <Route
              path="/influencers"
              element={
                <SalesOnly>
                  <InfluencersModule />
                </SalesOnly>
              }
            />
            <Route
              path="/affiliates"
              element={
                <SalesOnly>
                  <AffiliatesModule />
                </SalesOnly>
              }
            />
            <Route
              path="/briefings"
              element={
                <SalesOnly>
                  <BriefingsBrain />
                </SalesOnly>
              }
            />
            <Route
              path="/marketplace"
              element={
                <SalesOnly>
                  <ModuleStub
                    eyebrow="Ecosystem"
                    title="Marketplace"
                    description="Connects to MAMA and CoFounder (CF) marketplaces — agents, skills, and listing discovery in one place. Wire OAuth, catalog sync, and install actions here (no credentials in the client)."
                  />
                </SalesOnly>
              }
            />
            <Route
              path="/ppc"
              element={
                <SalesOnly>
                  <PpcDashboard />
                </SalesOnly>
              }
            />
            <Route
              path="/ppc/:agentId"
              element={
                <SalesOnly>
                  <PpcAgentDetail />
                </SalesOnly>
              }
            />
            <Route
              path="/social/activity"
              element={
                <SalesOnly>
                  <SocialActivity />
                </SalesOnly>
              }
            />
            <Route
              path="/social/autopost"
              element={
                <SalesOnly>
                  <ModuleStub
                    eyebrow="Social"
                    title="Autopost"
                    description="Approval-gated queue for Meta, X, Threads, LinkedIn… — rows from PublishQueue; workers dequeue per docs/ZEUS_FINAL_BUILD_PLAN.md Track D. Legal/compliance gates before live post for regulated brands."
                  />
                </SalesOnly>
              }
            />
            <Route
              path="/social/replies"
              element={
                <SalesOnly>
                  <ModuleStub
                    eyebrow="Social"
                    title="Comment AI"
                    description="Draft/suggested replies to comments and mentions; separately metered from Listen intelligence per Zeus plan. Wire responder SKU, approval inbox, and audit log — track outcomes in Social → Activity."
                  />
                </SalesOnly>
              }
            />
            <Route
              path="/calendar"
              element={
                <SalesOnly>
                  <ContentCalendar />
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
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/morning-brief" element={<SalesOnly><MorningBrief /></SalesOnly>} />
            <Route
              path="/content-studio"
              element={
                <SalesOnly>
                  <ContentStudio />
                </SalesOnly>
              }
            />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ModeContext.Provider>
  );
}

export default App;
