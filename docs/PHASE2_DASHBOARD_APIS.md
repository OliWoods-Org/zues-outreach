# Phase 2 — dashboard integrations (API contract sketch)

**Goal:** Mission Control reads/writes **Airtable views** and status endpoints without hammering Google Ads on every page load.

## Read paths (server-side recommended)

| Surface | Source | Notes |
|---------|--------|--------|
| Leads summary | Airtable **Leads** view “New today” | PAT server-side |
| Publish queue | **PublishQueue** — Approved + Scheduled | Worker status mirrored |
| Social alerts | **TrendPosts** last 7d | Cached |
| PPC snapshots | **MetricsSnapshots** or nightly TNT sync | Not live Google Ads in browser |
| Brain queue | **OptimizationSuggestions** — Proposed | |

## Write paths (guarded)

| Action | Target |
|--------|--------|
| Approve post | PublishQueue status |
| Approve suggestion | OptimizationSuggestions |
| Log affiliate event | ReferralEvents (webhook) |

## Auth

- **BFF or edge functions** hold PATs and Google Ads refresh tokens — **never** expose to Vite client.

## Phase gate

Ship **read-only** Mission Control first; then **approval** mutations with audit log.
