# TNT / Zeus Mission Control — Airtable base (dashboard telemetry)

The **TNT-PPC-agent-team** repo ([GitHub: `TNT-PPC-agent-team`](https://github.com/OliWoods-Org/TNT-PPC-agent-team)) exposes a **FastAPI** surface (`src/api/server.py`) — the operational “dashboard” is **Swagger UI** at `/docs` plus JSON endpoints, not a separate React SPA in that repo.

This doc defines an optional **Airtable base** (or **tables inside your pilot Zeus base**) to **mirror** PPC agent runs, health, and snapshots so **Zeus Mission Control** and **Growth Brain** can read structured rows without hitting Google Ads on every page load.

---

## Base naming

| Option | When |
|--------|------|
| **Standalone base:** `Zeus Mission Control (TNT)` | Clear isolation; PAT scoped to this base only for worker sync |
| **Same base as product:** add tables below next to `Leads` | Fewer PATs; good for Elevar-only ops |

---

## Tables (minimal v1)

### 1. `PPCAgentRuns`

| Field | Type | Notes |
|-------|------|--------|
| Run ID | Single line text | UUID from worker |
| Agent key | Single select | anomaly_detection, budget_pacing, … |
| Account ID | Single line | Google Ads customer id |
| Started at | Date/time | |
| Finished at | Date/time | |
| Status | Single select | success, failed, skipped |
| Summary | Long text | Short outcome |
| Payload JSON | Long text | Optional raw excerpt |
| Product | Link → Products | If multi-brand |

### 2. `MetricsSnapshots`

Same as [`AIRTABLE_ZEUS_SCHEMA.md`](AIRTABLE_ZEUS_SCHEMA.md) — link **Product**, period, JSON KPI blob.

### 3. `MissionControlHealth`

| Field | Type | Notes |
|-------|------|--------|
| Checked at | Date/time | |
| API base URL | URL | e.g. `http://127.0.0.1:8000` |
| Health status | Single select | ok, degraded, down |
| Last error | Long text | |

Workers (later) call TNT `GET /health` and append a row nightly.

---

## PAT & env

- Prefer a PAT that can access **only** this base (or only Zeus Ops tables).
- Never store Google Ads secrets in Airtable — keep refresh tokens in vault/env.

---

## Links

- Local API preview: [`TNT_LOCAL_PREVIEW.md`](TNT_LOCAL_PREVIEW.md)
- Final build plan: [`ZEUS_FINAL_BUILD_PLAN.md`](ZEUS_FINAL_BUILD_PLAN.md)
