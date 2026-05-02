# Phase 3 — Content factory (notebook → podcast → YouTube → shorts)

Optional **Growth Factory** add-on per [`ZEUS_OUTREACH_PLAN.md`](ZEUS_OUTREACH_PLAN.md) §3, §14.

## Pipeline

```mermaid
flowchart LR
  NB[Notebook research]
  PC[Podcast audio]
  YT[YouTube long]
  CL[Clips + shorts]
  NB --> PC --> YT --> CL
```

## Stages

1. **Research / topics** — SEO + Listen keywords → notebook LLM output.
2. **Audio / avatar** — long-form episode generation (governance: brand voice doc).
3. **YouTube publish** — PublishQueue lane “YouTube”.
4. **Clip agents** — hooks, shorts, multi-channel post via **PublishQueue**.

## Gates

- **Legal/compliance** review before auto-post for health/finance.
- **Human approval** at major transitions (episode → publish, clip batch).

## Mission Control

Status-only v1: queues per stage + **Blockers** field per Project; full automation is phased.

## Related

- [`ZEUS_OUTREACH_PLAN.md`](ZEUS_OUTREACH_PLAN.md) podcast → shorts vision  
- [`AIRTABLE_ZEUS_SCHEMA.md`](AIRTABLE_ZEUS_SCHEMA.md) PublishQueue, Creators
