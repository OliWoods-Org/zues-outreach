/**
 * PPC agents aligned with TNT-PPC-agent-team (FastAPI) + Zeus Airtable keys.
 * `agentKey` matches `PPCAgentRuns.Agent key` in docs/TNT_MISSION_CONTROL_AIRTABLE_BASE.md.
 * Wire these to `GET /agents/...` when TNT base URL is configured.
 */
export type TntPpcAgent = {
  id: string;
  agentKey: string;
  label: string;
  blurb: string;
};

export const tntPpcAgents: TntPpcAgent[] = [
  {
    id: 'anomaly-detection',
    agentKey: 'anomaly_detection',
    label: 'Anomaly detection',
    blurb: 'Flags spend, CTR, and conversion anomalies vs baseline — inherited from TNT Adam suite.',
  },
  {
    id: 'budget-pacing',
    agentKey: 'budget_pacing',
    label: 'Budget pacing',
    blurb: 'Daily / intraday burn vs plan; pacing recommendations before end-of-day.',
  },
  {
    id: 'search-terms',
    agentKey: 'search_term_mining',
    label: 'Search terms',
    blurb: 'Mines search term reports for negatives and expansion candidates.',
  },
  {
    id: 'keyword-expansion',
    agentKey: 'keyword_expansion',
    label: 'Keyword expansion',
    blurb: 'Suggests high-intent keywords from converting queries and competitors.',
  },
  {
    id: 'creative-health',
    agentKey: 'creative_fatigue',
    label: 'Creative health',
    blurb: 'Ad strength, RSA fatigue, and rotation signals across asset groups.',
  },
  {
    id: 'geo-device',
    agentKey: 'geo_device_split',
    label: 'Geo & device',
    blurb: 'Breakouts by geo and device; bid adjustment hints where data allows.',
  },
];

export const tntApiDocsHint =
  'Local TNT API: uvicorn + Swagger at /docs (see zues-outreach docs/TNT_LOCAL_PREVIEW.md).';
