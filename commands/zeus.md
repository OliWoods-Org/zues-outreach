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

## Build tracks (where work happens)

1. **Mission Control** — fork **TNT** (PPC agents), Zeus IA — see **ZEUS_FINAL_BUILD_PLAN.md §3–4**.
2. **Workers** — publish queue, daily listen ingest, EOD phrase mining, Growth Brain batch — **§4 Phase 4–7**.
3. **This plugin** — extend scripts/env only when Airtable schema is stable.

## Quick prompts by topic

- **Plan status:** Open `docs/ZEUS_FINAL_BUILD_PLAN.md` and summarize current phase and exit gates.
- **Schema:** Align new fields with `docs/AIRTABLE_ZEUS_SCHEMA.md` before changing `scripts/airtable-push-leads.py`.
- **Listen vs reply:** Listening = **TrendPosts** + analytics; responder = separate approval-gated product — see `ZEUS_OUTREACH_PLAN.md` §16.
