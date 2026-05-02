---
name: zeus
description: Zeus Growth OS — index of docs, build plan, and execution-layer commands for multi-product outreach
argument-hint: "[topic e.g. plan, schema, airtable, listen]"
allowed-tools:
  - Read
  - Glob
---

# Zeus Growth OS — command index

Use this slash command as a **navigation hub**. Implementation lives across repos: **Mission Control** (fork TNT dashboard), **Airtable** (per-product bases), and **this plugin** (Claude Code execution layer).

## Canonical docs (read these first)

| Doc | What it is |
|-----|------------|
| [`docs/CLAUDE_TASKS.md`](../docs/CLAUDE_TASKS.md) | **Task list for Claude** — what to do next, by track |
| [`docs/ZEUS_MISSION_CONTROL_IA.md`](../docs/ZEUS_MISSION_CONTROL_IA.md) | **Mission Control IA** — TNT fork + lanes (Listen→Report) + Zeus extensions |
| [`docs/PRICING_SKUS.md`](../docs/PRICING_SKUS.md) | **Narrative + tiers** — Core, Listen, Responder, Publish, Affiliate, Brain, Content factory |
| [`docs/AFFILIATE_MODULE.md`](../docs/AFFILIATE_MODULE.md) | Affiliate / referral + RewardsQueue |
| [`docs/SOCIAL_LISTEN_TIERS.md`](../docs/SOCIAL_LISTEN_TIERS.md) | Listen caps vs responder; metering |
| [`docs/GROWTH_BRAIN_OPTIMIZER.md`](../docs/GROWTH_BRAIN_OPTIMIZER.md) | Growth Brain inputs/outputs, AgentRuns |
| [`docs/SOCIAL_PUBLISH_WORKERS.md`](../docs/SOCIAL_PUBLISH_WORKERS.md) | Publish queue workers + MAMA autoposter reference |
| [`docs/BRAND_WIZARD.md`](../docs/BRAND_WIZARD.md) | Brand onboarding gate |
| [`docs/INTELLIGENCE_LOOP.md`](../docs/INTELLIGENCE_LOOP.md) | Briefings + optimizer loop |
| [`docs/AIRTABLE_SEGMENTATION.md`](../docs/AIRTABLE_SEGMENTATION.md) | Per-product bases + PATs |
| [`docs/BACKLOG_DECISIONS.md`](../docs/BACKLOG_DECISIONS.md) | Open decisions (MCP base, GoodBot vs 411, DOM CRE) |
| [`docs/PHASE2_DASHBOARD_APIS.md`](../docs/PHASE2_DASHBOARD_APIS.md) | Phase 2 dashboard API sketch |
| [`docs/CONTENT_FACTORY_PIPELINE.md`](../docs/CONTENT_FACTORY_PIPELINE.md) | Phase 3 notebook → shorts pipeline |
| [`docs/V2_BACKLOG_PICKS.md`](../docs/V2_BACKLOG_PICKS.md) | **v2 picks** from ZEUS_OUTREACH_PLAN §18 |
| [`docs/BUILD_PARALLEL_AGENTS.md`](../docs/BUILD_PARALLEL_AGENTS.md) | 5 build streams (TNT base, listen→Airtable, Brain, SEO, pricing) |
| [`docs/TNT_MISSION_CONTROL_AIRTABLE_BASE.md`](../docs/TNT_MISSION_CONTROL_AIRTABLE_BASE.md) | TNT Airtable telemetry spec |
| [`docs/TNT_LOCAL_PREVIEW.md`](../docs/TNT_LOCAL_PREVIEW.md) | TNT FastAPI `/docs` local run |
| [`docs/SEO_GEO_MODULE.md`](../docs/SEO_GEO_MODULE.md) | SEO / GEO + backlinks plan |
| [`docs/ZEUS_FINAL_BUILD_PLAN.md`](../docs/ZEUS_FINAL_BUILD_PLAN.md) | **Master execution plan** — phased gates, tracks, acceptance criteria |
| [`docs/ZEUS_OUTREACH_PLAN.md`](../docs/ZEUS_OUTREACH_PLAN.md) | Portfolio bases, Listen vs responder, affiliate, Growth Brain, §18 ideas |
| [`docs/AIRTABLE_ZEUS_SCHEMA.md`](../docs/AIRTABLE_ZEUS_SCHEMA.md) | Table/field reference for Zeus tables |
| [`docs/ELEVAR_OUTREACH_AIRTABLE.md`](../docs/ELEVAR_OUTREACH_AIRTABLE.md) | Elevar `Leads` schema (first vertical) |

## Execution-layer commands (this repo)

| Command | Use |
|---------|-----|
| `/find-leads` | Apollo prospecting |
| `/enrich-leads` | Enrichment |
| `/send-campaign` | Instantly email |
| `/ads-report` | Google Ads metrics |
| `/social-listen` | Reddit/X listening — feeds **intelligence** track (`TrendPosts` via future worker; see build plan Phase 5) |
| `/crm-sync` | HubSpot |
| `/airtable-sync` | Upsert leads to Airtable — **Email** merge key |
| `/listen-to-airtable` | Doc: listen → **TrendPosts** via `trendposts_append.py` |

## Build tracks (where work happens)

1. **Mission Control** — fork **TNT** (PPC agents), Zeus IA — see **ZEUS_FINAL_BUILD_PLAN.md §3–4**.
2. **Workers** — publish queue, daily listen ingest, EOD phrase mining, Growth Brain batch — **§4 Phase 4–7**.
3. **This plugin** — extend scripts/env only when Airtable schema is stable.

## Quick prompts by topic

- **Plan status:** Open `docs/ZEUS_FINAL_BUILD_PLAN.md` and summarize current phase and exit gates.
- **Schema:** Align new fields with `docs/AIRTABLE_ZEUS_SCHEMA.md` before changing `scripts/airtable-push-leads.py`.
- **Listen vs reply:** Listening = **TrendPosts** + analytics; responder = separate approval-gated product — see `ZEUS_OUTREACH_PLAN.md` §16.
