# Airtable schema reference — Zeus Growth OS

Use **one base per commercial product line** (see [`ZEUS_OUTREACH_PLAN.md`](ZEUS_OUTREACH_PLAN.md)). This doc lists **recommended tables and fields** so Mission Control, workers, and the Claude plugin stay aligned. Adjust names to match your bases; keep **merge keys** and **link fields** consistent across repos.

**Existing Elevar lead schema:** [`ELEVAR_OUTREACH_AIRTABLE.md`](ELEVAR_OUTREACH_AIRTABLE.md).

**TNT / Mission Control telemetry (optional base):** [`TNT_MISSION_CONTROL_AIRTABLE_BASE.md`](TNT_MISSION_CONTROL_AIRTABLE_BASE.md).

---

## Core hierarchy

| Table | Purpose | Key fields |
|-------|---------|------------|
| **Companies** | Optional parent org | Name, Domain |
| **Products** | Sellable SKU / brand line | Name, Company (link), Active |
| **Projects** | Campaign or initiative under Product | Name, Product (link), Start date, Status |

---

## Brand (onboarding gate)

| Field | Type | Notes |
|-------|------|--------|
| Name | Single line | |
| Product | Link → Products | Required |
| Voice summary | Long text | For LLM system context |
| Taboos | Long text | Compliance |
| Logo attachment | Attachment | |
| Primary color / Secondary | Single line or hex | |
| Guidelines doc URL | URL | Generated PDF/Docs |
| Onboarding completed | Checkbox | Unlocks templates |

Table name: **BrandProfiles**.

---

## Leads / outreach

Follow **`Leads`** pattern from Elevar doc: **Email** as upsert key; link **Product** or **Campaign** as needed.

---

## Social listen (intelligence — separate from responder)

### ListenKeywords

| Field | Type | Notes |
|-------|------|--------|
| Keyword / phrase | Single line | |
| Product | Link → Products | Scope |
| Platform | Single select | Reddit, X, Threads, All, … |
| Tier slot | Number | If metering keyword count |
| Active | Checkbox | |

### TrendPosts / SocialListenLog

| Field | Type | Notes |
|-------|------|--------|
| **Dedupe Key** | Single line | **Upsert merge field** for [`scripts/trendposts_append.py`](../scripts/trendposts_append.py): `{platform}\|{external_post_id}` |
| External post ID | Single line | Platform-native id |
| Platform | Single select | |
| Author handle | Single line | |
| Post URL | URL | |
| Text | Long text | Truncate very long posts in UI |
| Captured at | Date/time | |
| Product | Link → Products | |
| Keywords matched | Link → ListenKeywords | Optional multi |
| Sentiment / tags | Multiple select | Optional |
| Raw JSON | Long text | Optional debug |

**Tier:** daily row insert cap enforced in worker — not in Airtable alone.

---

## Publish queue

### PublishQueue

| Field | Type | Notes |
|-------|------|--------|
| Title | Single line | |
| Body | Long text | Caption |
| Media URLs | Long text or attachment | |
| Product | Link → Products | |
| Channel | Single select | Instagram, Facebook, X, Threads, Reddit, TikTok |
| Scheduled at | Date/time | |
| Status | Single select | Draft, Pending approval, Approved, Publishing, Published, Failed |
| Approved by | Email or collaborator | |

### PublishLog

| Field | Type | Notes |
|-------|------|--------|
| PublishQueue link | Link → PublishQueue | |
| Platform post ID | Single line | |
| Response JSON | Long text | Errors |
| Published at | Date/time | |

### ChannelAccounts (OAuth scope)

| Field | Type | Notes |
|-------|------|--------|
| Product | Link → Products | |
| Platform | Single select | |
| Account label | Single line | |
| Token reference | Single line | **Never store raw tokens in Airtable** — store vault ID / secret name |

---

## Influencers / UGC

| Table | Fields (minimal) |
|-------|------------------|
| **Creators** | Handle, Platform, Niche, Audience size, Rating (number), Product (link), Notes |
| **RateCards** | Creator (link), Deliverable type, Price, Currency |
| **OutreachSequences** | Name, Channel, Template body (long text), Product (link) |
| **OutreachLog** | Creator (link), Sequence (link), Sent at, Status, Reply snippet |

---

## Affiliate (Viral Loops–class)

| Table | Fields (minimal) |
|-------|------------------|
| **AffiliatePrograms** | Name, Product (link), Commission type, Rate, Active, Legal URL |
| **Partners** | Name, Email, Payout method, Status, Program (link) |
| **ReferralLinks** | Partner (link), Code, URL, UTM defaults |
| **ReferralEvents** | Link, Event type (signup/trial/paid), Occurred at, Value |
| **RewardsQueue** | Partner (link), Amount, Status (pending/paid/hold), Paid at |

---

## SEO / Notebook (Brain inputs — optional tables)

| Table | Purpose |
|-------|---------|
| **ResearchPlans** | Notebook / SEO themes; Product link; Status |
| **ContentBriefs** | Generated outlines; links to PublishQueue rows |

_Add when Brain Pro SKU is sold; minimal fields avoid schema creep._

---

## Listen tier config (optional helper)

| Field | Type | Notes |
|-------|------|-------|
| Product | Link → Products | |
| Daily TrendPosts cap | Number | Worker reads this or env override |
| Keyword slots | Number | Max active ListenKeywords |
| Tier name | Single select | Core, Listen Pro, Enterprise |

_Alternatively encode caps in env per deployment — doc in [`SOCIAL_LISTEN_TIERS.md`](SOCIAL_LISTEN_TIERS.md)._

---

## Growth Brain & optimization

### PhrasePerformance

| Field | Type | Notes |
|-------|------|--------|
| Phrase | Single line | |
| Product | Link → Products | |
| Source | Single select | Reply, Ad, Social, Email | |
| Impressions / Conversions | Number | As available |
| Period | Single line | e.g. `2026-05-01 week` |
| Score | Number | Internal ranking |

### OptimizationSuggestions

| Field | Type | Notes |
|-------|------|--------|
| Type | Single select | PPC, SEO, Hook, Persona, Budget |
| Title | Single line | |
| Detail | Long text | |
| Product | Link → Products | |
| Confidence | Number | 0–1 optional |
| Status | Single select | Proposed, Approved, Rejected, Applied |
| Created at | Date/time | |

### AgentRuns

| Field | Type | Notes |
|-------|------|--------|
| Job name | Single line | |
| Input summary | Long text | |
| Output summary | Long text | |
| Product | Link → Products | |
| Started at / Finished at | Date/time | |

### MetricsSnapshots

| Field | Type | Notes |
|-------|------|--------|
| Product | Link → Products | |
| Period start / end | Date | |
| Payload | Long text | JSON: PPC + social + email KPIs |

---

## Indexes / views to create

- **Leads:** by Stage, by Product, “New today”
- **TrendPosts:** last 7 days by Product
- **PublishQueue:** Approved + Scheduled asc
- **OptimizationSuggestions:** Proposed only
- **ReferralEvents:** last 30 days

---

## PAT scope

Create **one Personal Access Token per base** (or workspace policy you approve). Never use an “all bases” token for production Zeus automation — see [`commands/airtable-sync.md`](../commands/airtable-sync.md).
