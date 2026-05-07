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
import { TargetModule } from './pages/TargetModule';
import { EngageModule } from './pages/EngageModule';
import { ConvertModule } from './pages/ConvertModule';
import { ReportModule } from './pages/ReportModule';
import { PublishModule } from './pages/PublishModule';
import { BrandModule } from './pages/BrandModule';
import { MarketplaceModule } from './pages/MarketplaceModule';
import { AutopostModule } from './pages/AutopostModule';
import { RepliesModule } from './pages/RepliesModule';
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
import { CompetitorIntel } from './pages/CompetitorIntel';
import { RelayModule } from './pages/RelayModule';

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
                  <TargetModule />
                </SalesOnly>
              }
            />
            <Route
              path="/engage"
              element={
                <SalesOnly>
                  <EngageModule />
                </SalesOnly>
              }
            />
            <Route
              path="/convert"
              element={
                <SalesOnly>
                  <ConvertModule />
                </SalesOnly>
              }
            />
            <Route
              path="/report"
              element={
                <SalesOnly>
                  <ReportModule />
                </SalesOnly>
              }
            />
            <Route
              path="/publish"
              element={
                <SalesOnly>
                  <PublishModule />
                </SalesOnly>
              }
            />
            <Route
              path="/brand"
              element={
                <SalesOnly>
                  <BrandModule />
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
                  <MarketplaceModule />
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
                  <AutopostModule />
                </SalesOnly>
              }
            />
            <Route
              path="/social/replies"
              element={
                <SalesOnly>
                  <RepliesModule />
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
              path="/competitors"
              element={
                <SalesOnly>
                  <CompetitorIntel />
                </SalesOnly>
              }
            />
            <Route
              path="/content-studio"
              element={
                <SalesOnly>
                  <ContentStudio />
                </SalesOnly>
              }
            />
            <Route
              path="/relay"
              element={
                <SalesOnly>
                  <RelayModule />
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
