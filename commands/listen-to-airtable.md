---
name: listen-to-airtable
description: Pipeline — social listen results → daily cap → Airtable TrendPosts (dedupe by Dedupe Key)
argument-hint: "[keywords or CSV path]"
allowed-tools:
  - Read
  - Bash
---

# Listen → Airtable (`TrendPosts`)

**Listen** (intelligence) is separate from **AI responder**. This flow logs posts for analytics and Growth Brain — see [`ZEUS_OUTREACH_PLAN.md`](../docs/ZEUS_OUTREACH_PLAN.md) §16.

## Steps

1. **Keywords** — Maintain `ListenKeywords` in Airtable (or env) per product; tier caps limit volume (`ZEUS_LISTEN_TIER`, daily caps in worker config — future).

2. **Capture** — Run `/social-listen` (Reddit/X) or your worker; normalize rows to CSV with:
   - `platform`, `external_post_id`, `post_url`, `text`, `author_handle`, `captured_at` (ISO)

3. **Dedupe** — Script builds **`Dedupe Key`** = `platform|external_post_id` and upserts into **`TrendPosts`**:
   ```bash
   export AIRTABLE_TABLE_TRENDPOSTS="TrendPosts"
   export AIRTABLE_MERGE_FIELD_TREND="Dedupe Key"
   python3 scripts/trendposts_append.py listen-batch.csv --dry-run
   python3 scripts/trendposts_append.py listen-batch.csv
   ```

4. **Schema** — Table must include merge field + columns per [`AIRTABLE_ZEUS_SCHEMA.md`](../docs/AIRTABLE_ZEUS_SCHEMA.md); add **`Dedupe Key`** (single line) if not present.

## Related

- [`scripts/trendposts_append.py`](../scripts/trendposts_append.py)
- [`docs/TNT_MISSION_CONTROL_AIRTABLE_BASE.md`](../docs/TNT_MISSION_CONTROL_AIRTABLE_BASE.md) (ops telemetry)
