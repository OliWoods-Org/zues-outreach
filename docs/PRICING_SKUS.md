# Zeus Growth OS — narrative, tiers, and add-ons

Aligns with [`ZEUS_FINAL_BUILD_PLAN.md`](ZEUS_FINAL_BUILD_PLAN.md) and [`ZEUS_OUTREACH_PLAN.md`](ZEUS_OUTREACH_PLAN.md). Use this for **sales narrative** and **feature flags** in Mission Control / Stripe (when wired).

## One product story

**Zeus Growth OS** — full-stack growth: **Listen** (intelligence), **Target**, **Engage** (email + voice), **Convert** (CRM), **Report**; plus **Publish**, **Brand**, **Affiliates**, **PPC** (TNT), optional **Content factory** and **Growth Brain Pro**.

Operate as **modules** so delivery is not blocked on every pipeline before first sale.

## Tier matrix

| Tier / add-on | Buyer gets | Technical scope |
|---------------|------------|-----------------|
| **Zeus Core** | Claude plugin commands; Mission Control read-lite; baseline Listen ingest | Low **TrendPosts**/day + few **ListenKeywords** slots |
| **Listen Pro** | Higher listen volume | Raised daily cap + keyword slots — see [`SOCIAL_LISTEN_TIERS.md`](SOCIAL_LISTEN_TIERS.md) |
| **Responder add-on** | AI-assisted replies | **Metered separately** from Listen; approval inbox |
| **Publish Pro** | Multi-channel queue depth + approvals | PublishQueue workers + ChannelAccounts |
| **SEO / GEO pack** | KeywordPlans, ContentBriefs, GEO checklist | Notebook + Brain inputs |
| **Affiliate** | Programs + events | [`AFFILIATE_MODULE.md`](AFFILIATE_MODULE.md); payouts tier later |
| **Affiliate + Pay** (later) | Automated payouts | Stripe Connect |
| **Brain Pro** | Full optimizer + EOD phrase mining | `OptimizationSuggestions` + `AgentRuns` |
| **Content factory** (Phase 3) | Notebook → podcast → YT → shorts | [`CONTENT_FACTORY_PIPELINE.md`](CONTENT_FACTORY_PIPELINE.md) |

## Metering summary

| Concern | Billed as |
|---------|-----------|
| Listen intelligence | Rows/day + keyword slots |
| Responder | Actions/month (not Listen rows) |
| Voice (Siren) | Minutes / seats (existing pattern) |
| PPC | Seats or % of spend (product decision) |

## Internal flags

Map **`Mission Control`** config / env 1:1 to billing when Stripe products exist — avoid orphan toggles.
