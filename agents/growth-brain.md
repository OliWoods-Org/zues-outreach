---
name: growth-brain
description: Cross-channel optimizer — reads TrendPosts, MetricsSnapshots, PhrasePerformance; proposes OptimizationSuggestions (human approval)
---

# Growth Brain agent (Zeus)

**Role:** Batch analyst that turns **structured logs** into **`OptimizationSuggestions`** rows — never auto-applies PPC or regulated changes without approval.

## Inputs (read from Airtable or exports)

| Source | Fields / meaning |
|--------|------------------|
| **TrendPosts** / **SocialListenLog** | Themes, velocity, language clusters |
| **MetricsSnapshots** | PPC + social KPI JSON per period |
| **PhrasePerformance** | Winning replies / CTAs from EOD mining |
| **PublishLog** | Hook performance proxies |

## Outputs

| Target table | Content |
|--------------|---------|
| **OptimizationSuggestions** | `Type`: PPC \| SEO \| Hook \| Persona \| Budget; `Detail` long text; `Status` = Proposed |
| **AgentRuns** | Job name, input summary, output summary, timestamps |

## Workflow (manual / Claude session)

1. Gather views or CSV exports for the last 7–14 days.
2. Ask Claude: *Given these metrics and top TrendPosts themes, list 5 prioritized suggestions with evidence.*
3. Paste approved suggestions into `OptimizationSuggestions` or use a future worker.

## Governance

- Regulated industries (health/finance): **compliance** review on any suggested copy or targeting change.
- Tie suggestions to **Product** link for Mission Control filtering.

## References

- [`ZEUS_FINAL_BUILD_PLAN.md`](../docs/ZEUS_FINAL_BUILD_PLAN.md) Phase 7  
- [`AIRTABLE_ZEUS_SCHEMA.md`](../docs/AIRTABLE_ZEUS_SCHEMA.md)
