# Social publish layer — workers, queue, MAMA autoposter

## Pattern

1. **PublishQueue** (Airtable) — rows: Draft → Pending approval → **Approved** → worker claims.
2. **Worker** — polls Approved + `Scheduled at <= now`; calls channel adapter; writes **PublishLog**; updates status Published/Failed.
3. **OAuth** — **ChannelAccounts** stores **token reference** (vault ID), never raw secrets in Airtable.

## MAMA X autoposter

**Locate** the existing MAMA X autoposter implementation in the **MAMA** repo (historical name OLIBOT) and treat it as **reference** for:

- auth / token refresh
- post payload shape
- rate-limit handling

Generalize to **`post(job)`** interface: `{ channel, body, media_urls, product_id }` → adapter (Meta, X, Threads, …).

## Channel rollout

**Phase 1:** Meta + X (policy + API stability).  
**Phase 2:** Threads, LinkedIn, Reddit, TikTok per API readiness.

## Approval defaults

**Approve-before-post** on by default for health/finance; configurable per Product in BrandProfiles / policy table.

## Related

- [`AIRTABLE_ZEUS_SCHEMA.md`](AIRTABLE_ZEUS_SCHEMA.md) — PublishQueue, PublishLog, ChannelAccounts  
- [`ZEUS_FINAL_BUILD_PLAN.md`](ZEUS_FINAL_BUILD_PLAN.md) Track D
