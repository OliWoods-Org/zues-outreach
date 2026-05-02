# Intelligence loop — briefings, optimizer, audit

Per [`ZEUS_OUTREACH_PLAN.md`](ZEUS_OUTREACH_PLAN.md) §12.

## Loop

1. **Morning brief** — leads delta, Listen spikes, PPC anomalies (from `MetricsSnapshots` / TNT health).
2. **Weekly / monthly optimizer** — **`OptimizationSuggestions`** batch; human approve/reject.
3. **Audit** — **`AgentRuns`** + suggestion status history; no silent auto-apply for paid/regulated tiers.

## Tables

- **`OptimizationSuggestions`** — Proposed → Approved → Rejected → Applied  
- **`AgentRuns`** — job logs for Brain batches  
- **`MetricsSnapshots`** — periodic KPI JSON per Product  

## Zeus Web

**`/briefings`** — surfaces brief + queue (wire to views when Airtable connected).

## Tie-in to Growth Brain

See [`GROWTH_BRAIN_OPTIMIZER.md`](GROWTH_BRAIN_OPTIMIZER.md).
