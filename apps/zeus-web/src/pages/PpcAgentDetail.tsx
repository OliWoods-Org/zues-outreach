import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { tntPpcAgents } from '../data/tntPpcAgents';
import { ModuleStub } from './ModuleStub';

export function PpcAgentDetail() {
  const { agentId } = useParams<{ agentId: string }>();
  const agent = tntPpcAgents.find(a => a.id === agentId);

  if (!agent) {
    return (
      <div className="max-w-xl">
        <p className="text-sm text-zinc-500 mb-4">Unknown PPC agent.</p>
        <Link to="/ppc" className="text-sm text-amber-400 hover:text-amber-300">
          ← PPC dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <Link
        to="/ppc"
        className="inline-flex items-center gap-1.5 text-[13px] text-amber-400/90 hover:text-amber-300"
      >
        <ArrowLeft className="w-4 h-4" />
        PPC dashboard
      </Link>
      <ModuleStub
        eyebrow={`TNT · ${agent.agentKey}`}
        title={agent.label}
        description={`${agent.blurb} Trigger runs via TNT FastAPI when Google Ads env is configured; Zeus will show live status from PPCAgentRuns rows.`}
      />
    </div>
  );
}
