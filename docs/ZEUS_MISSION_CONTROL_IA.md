# Zeus Mission Control — information architecture (TNT fork + extensions)

**Strategy:** Fork/copy **TNT** (PPC agents, FastAPI **`/docs`**) into **Zeus Web** — preserve PPC surfaces; extend navigation for Growth OS modules. Plugin repo **[zues-outreach](../)** stays **execution-only**.

## Core buyer pillars (lanes)

```mermaid
flowchart LR
  L[Listen]
  T[Target]
  E[Engage]
  C[Convert]
  R[Report]
  L --> T --> E --> C --> R
```

| Lane | Zeus routes (examples) | Backend |
|------|--------------------------|---------|
| **Listen** | `/listen` | TrendPosts, ListenKeywords, tier caps |
| **Target** | `/target` | Apollo, Leads, scoring |
| **Engage** | `/engage`, `/campaigns`, `/chat` | Instantly, Siren voice |
| **Convert** | `/convert`, `/pipeline` | HubSpot, Airtable stages |
| **Report** | `/report`, `/analytics`, `/briefings` | KPIs, Brain |

## Zeus extensions (beyond vanilla TNT)

| Module | Routes | Notes |
|--------|--------|------|
| **Publish** | `/publish`, `/social/autopost` | PublishQueue / workers |
| **Social tracker** | `/social/activity`, `/social/replies` | Autopost + Comment AI |
| **Brand** | `/brand`, `/brand/wizard` | BrandProfiles onboarding |
| **Influencers** | `/influencers` | Creators, OutreachLog |
| **Affiliate** | `/affiliates` | §15 tables |
| **PPC — TNT** | `/ppc`, `/ppc/:agent` | Adam PPC agents |
| **Marketplace** | `/marketplace` | MAMA + CF listings |
| **Briefings / Brain** | `/briefings` | OptimizationSuggestions |

## TNT linkage

- **API:** MAMA-hosted FastAPI (see **`docs/TNT_LOCAL_PREVIEW.md`**).
- **Telemetry:** **`PPCAgentRuns`** in Airtable (`docs/TNT_MISSION_CONTROL_AIRTABLE_BASE.md`).

This IA should stay aligned with **`apps/zeus-web`** sidebar groups.
