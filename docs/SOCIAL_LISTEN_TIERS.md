# Social listen — tiers, caps, and responder (separate products)

Per [`ZEUS_OUTREACH_PLAN.md`](ZEUS_OUTREACH_PLAN.md) §16: **intelligence (Listen)** and **AI responder** are **separately billable**; the same Zeus UX can show both.

## Tables

- **`ListenKeywords`** — keyword slots per Product; **Tier slot** (number) for metering.
- **`TrendPosts` / SocialListenLog** — daily logs; **Dedupe Key** for upserts (`scripts/trendposts_append.py`).

## Tier model (example)

| SKU | TrendPosts / day (cap) | Keyword slots | Notes |
|-----|------------------------|---------------|--------|
| **Zeus Core** | 25 | 5 | Baseline intelligence |
| **Listen Pro** | 200 | 25 | Higher volume logging |
| **Listen Enterprise** | Custom | Custom | Sales-led |

**Worker enforcement:** cron/worker stops ingesting when cap hit; overflow can **queue for next day** or **soft-fail with alert** — product decision.

## Responder add-on (not the same as Listen)

| | Listen (intelligence) | Responder |
|--|------------------------|-----------|
| **Purpose** | Log trends, keywords, analytics | Draft/send replies |
| **Metering** | Rows/day, keyword slots | Actions/month or sends |
| **Airtable** | TrendPosts, ListenKeywords | Responder log / approval queue (separate table when built) |
| **Risk** | Lower (read-only) | Higher — approval gates for health/finance |

Dashboard **Listen** page = intelligence; **Social → Comment AI** = responder lane.

## Analytics

Mission Control charts **mentions/day** from TrendPosts; **not** mixed with reply send volume in v1 (separate cards).
