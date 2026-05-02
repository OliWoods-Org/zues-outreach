# Growth Brain — cross-channel optimizer (ML flywheel v1)

Canonical product detail: [`ZEUS_OUTREACH_PLAN.md`](ZEUS_OUTREACH_PLAN.md) §17. This doc is the **implementation contract** for workers + Mission Control.

## Inputs (structured)

| Source | Feeds Brain |
|--------|----------------|
| **Social listen** | Trend clusters, language, topics (`TrendPosts`) |
| **PPC / TNT** | Creative × keyword × geo (via `MetricsSnapshots` or Google Ads export) |
| **SEO / Notebook LLM** | `ResearchPlans`, content briefs |
| **Short-form / Publish** | Hook performance from `PublishLog` + platform metrics |
| **EOD reply review** | **PhrasePerformance** — converting phrases, objections, CTAs |

## Outputs (approval-gated)

Written to **`OptimizationSuggestions`** (`Type`: PPC, SEO, Hook, Persona, Budget); **`AgentRuns`** logs each batch job.

| Output | Destination |
|--------|-------------|
| PPC suggestions | Mission Control approve/reject → optional export to TNT |
| SEO / calendar ranks | Notebook briefs ranked by Brain score |
| Hook library refresh | Tagged winners → creative templates |
| Persona hypotheses | Demographics / ICP shifts with evidence links |

## Tech stance

Start with **LLM + rules + embeddings** on tabular logs; add **classical ML** when **`MetricsSnapshots`** + **`AgentRuns`** depth justifies it.

## Zeus Web

**Briefings** (`/briefings`) surfaces morning brief + suggestion queue (stub → Airtable reads).
