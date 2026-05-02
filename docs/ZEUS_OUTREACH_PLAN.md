# Zeus Outreach & Growth Stack — Planning (consolidated)

**Execution roadmap (phased build, acceptance criteria):** [`ZEUS_FINAL_BUILD_PLAN.md`](ZEUS_FINAL_BUILD_PLAN.md) — use that document to **ship**; this file is strategy + portfolio detail.

This document continues the portfolio / Airtable / dashboard planning from Codex, with your corrections applied: **one MAMA outreach**, **LLM Council as MAMA feature (not its own base)**, **GoodBot vs 411 Films review**, **Castello vs P/ART** sharing scraped leads, **DOM CRE + dashboard inventory**, and **Zeus as a bundled growth offering**.

---

## 1. Airtable bases (Zeus Outreach workspace)

### Principle

- **One base per commercial product line** (or clearly separated brand) you actively sell.
- **Do not** split iOS, MCP, or demo Netlify apps into separate bases — they stay as channels inside the product base.
- **Foundation / impact**: **one** base with a required **Project** field (not 40+ bases).

### Commercial bases (revised from Codex + your notes)

| Base | Covers | Priority | Notes |
|------|--------|----------|--------|
| **LuxuryTravels Outreach** | LuxuryTravels, LT iOS, LT MCP, Margaux/Felix backend | High | |
| **Elevar Outreach** | Elevar Health, Elevar iOS | Done | Lead sync / Campaign — setup spec: [`docs/ELEVAR_OUTREACH_AIRTABLE.md`](ELEVAR_OUTREACH_AIRTABLE.md) |
| **Siren Outreach** | Siren AI, Siren iOS, Siren Sales Team, Voice Demo | High | Voice dispositions live here or mirror Master |
| **Grail Outreach** | Grail Intelligence, Grail iOS | High | |
| **Paper St Outreach** | Paper St., Paper St iOS | High | |
| **MAMA Outreach** | MAMA SaaS, MAMA iOS, MAMA Memory iOS, **LLM Council** (feature, not separate base) | High | Single umbrella for MAMA product + council |
| **MAMA MCP Marketplace Outreach** | Marketplace / 50 MCP packages | Medium–High | Only if you sell distribution separately from core MAMA SaaS; else fold into **MAMA Outreach** with a **Track** field |
| **CoFounder Outreach** | CoFounder, CoFounder iOS | High | |
| **GoodBot / Film Studio Outreach** | GoodBot Film Studio, GoodBot POC; relationship to **411** TBD | Medium | **Task:** clarify whether 411 is “dashboard slice” of GoodBot — one narrative, one base |
| **TuneStars Outreach** | TuneStars AI, TuneStars iOS, AI Caddie | Medium | AI Caddie stays under TuneStars per Codex rule |
| **Corvo Outreach** | Corvo, Corvo iOS | Medium | |
| **VRFD Outreach** | VRFD, VRFD Deck | Medium | |
| **Castello Outreach** | Castello | Medium | **Shared scraped leads** with P/ART via shared table export or Zeus “lead pool” |
| **P/ART Outreach** | P/ART Collection | Medium | Same lead pool as Castello; **separate** messaging/pipeline |
| **DOM CRE Outreach** | DOM CRE Dashboard (MAMA commercial real estate dashboard) | As needed | **Task:** document what DOM CRE is + owner; add base if actively partnering |

### Foundation

| Base | Purpose |
|------|--------|
| **OliWoods Foundation Outreach** | Required **Project** field: MAMA AI Clinic, Mental Health, Access to Justice, Climate, Rx Access, Safe Harbor, etc. |

### Optional / devrel (keep out of core until needed)

- **LLM Council**: inside **MAMA Outreach**, not a standalone base.
- **Humanitarian Council / MAMA AGI**: tags or projects under MAMA or Foundation, not new bases by default.

---

## 2. Dashboard inventory (MAMA + ops)

These are **product/dashboard surfaces**, not necessarily each its own Airtable base. Prefer **one internal map** (this section) + **Zeus “Growth OS”** (section 4) as the sellable shell.

| Working name | Notes | Action |
|--------------|--------|--------|
| **TNT PPC / growth marketing dashboard** | **Well built** — includes **PPC agents** and paid growth workflows | **Source template** for Zeus (see §8): fork/copy, don’t throw away |
| **Zeus Mission Control** | **Greenfield product shell today** — no dedicated Zeus dash yet | **New dashboard repo/surface** built by copying TNT + extending IA |
| **Basin Oil Dashboard** | | Confirm owner + whether outreach base needed |
| **Parcel Dashboard** | | Same |
| **411 AI Film dashboard** | Likely **GoodBot** family | Merge narrative with GoodBot base once 411 vs GoodBot is decided |
| **DOM CRE Dashboard** | MAMA stack, commercial real estate | **Task:** document scope; **DOM CRE Outreach** base if selling/partnering separately |

**Task backlog**

1. **GoodBot vs 411**: product truth — one product with multiple dashboards vs two lines; align **one** outreach story.
2. **DOM CRE + “other dashboards”**: inventory all MAMA dashboards in Notion or a single index page; decide which get **partner motion** vs **internal only**.
3. **Zeus dashboard**: **copy/fork TNT codebase** (keep PPC agents), then rename/theme and add Zeus-only modules (§8–§12) — not “rename TNT in place” only.
4. **MAMA X autoposter**: locate existing implementation (MAMA codebase / separate repo); generalize into multi-channel posting layer (§9).

---

## 3. Zeus as the bundled marketing package (recommended angle)

### Positioning

**Zeus** = full-stack **growth + outbound**: lead discovery, enrichment, scoring, sequences (email), **Siren** voice, CRM/Airtable tracking, **social listening** (Reddit / X / Threads) with optional AI-assisted reply, **content** (MAMA agent teams: research → drafts → approvals), and **PR** workflows where MAMA agent teams apply — sold as **one operating system**, not seven tools.

### Best route (recommended)

| Layer | Recommendation |
|--------|------------------|
| **Buyer-facing story** | One **Zeus Growth OS** (or “OliWoods Growth Stack”) narrative: phases **Listen → Target → Engage → Convert → Report**. |
| **Control plane** | **Zeus Mission Control** app: **copy/fork the TNT dashboard** (includes **PPC agents**), then extend with Listen/Publish/Influencers/Brand/Briefings (§8). TNT remains the proven base; Zeus is the sellable fork. |
| **Data plane** | **Airtable**: stay **per product line** for prospect lists and partner-specific pipelines (legal + clarity). Add a **Shared lead pool** base or **synced table** only where you explicitly share leads (Castello ↔ P/ART). |
| **Don’t** | One giant Airtable base for *all* products — reporting becomes painful and permissions blur. |

### MAMA’s role

- MAMA holds **agent teams** (PR, content, notebook LLM workflows, future podcast factory).
- **Social listening** and **auto AI responder** are **two separate services** that **connect** in the Listen lane:
  - **Social listen (intelligence):** capture trending posts, keywords, and audience signals — used for **real-time analytics**, **who to build for**, and **daily logs to Airtable** (see §16). This is **not** the same product surface as reply automation.
  - **AI responder:** optional layer that drafts/sends replies; **approval gates** and compliance rules apply per brand.
- Same **Zeus UX** can show both; billing can split **listen volume** vs **responder actions**.

### Podcast → YouTube → shorts pipeline (your vision)

Map as **optional Zeus add-on** modules:

1. **Notebook / research agents** — topics from keywords, SEO, trending.
2. **Audio / avatar** — long-form episode generation.
3. **YouTube long-form** — publish layer.
4. **Clip agents** — hooks, shorts, multi-channel posting.

**Governance:** brand voice guide, legal/compliance review gate before auto-post; human approval for health/finance clients.

---

## 4. One “marketing products” outreach base vs many

**Recommendation:** Keep **per-product** Airtable outreach bases (table above) for **pipeline hygiene**, and add **one** internal or partner-facing base only if you need a **master agency roster** (vendors, affiliates, media partners) — not a replacement for Elevar/Siren bases.

- **Sell Zeus as one package**; **operate** with **segmented bases** + shared lead pool where agreed (Castello/P/ART).
- **Affiliate / referral programs** (§15) can use dedicated tables in the same product base or a small **Affiliate** sync — avoid duplicating **Lead** identities across bases without rules.

---

## 5. Castello + P/ART lead sharing

- **Two bases**, **two** messaging playbooks.
- **Shared leads:** duplicate allowed if CRM hygiene requires it; better: **third “Lead pool” table** (or base) with **Product fit** / **Routing** fields, or automation that copies qualified rows into Castello vs P/ART with status.

---

## 6. Next implementation steps (checklist)

- [ ] Confirm **MAMA MCP Marketplace**: separate base vs **MAMA Outreach** + **Track** field.
- [ ] Resolve **GoodBot vs 411**; update **GoodBot / Film Studio Outreach** copy.
- [ ] **Zeus dashboard:** fork/copy **TNT** (keep PPC agents), define Zeus IA + rename/theme — see §8 and §14.
- [ ] Document **DOM CRE** + full dashboard list; add **DOM CRE Outreach** if selling.
- [ ] Wire **Elevar** env to **Elevar Outreach** base only (`AIRTABLE_BASE_ID`, scoped PAT).
- [ ] Foundation: create **OliWoods Foundation Outreach** + **Project** picklist.
- [ ] Additional Zeus build items: §14 (social queue, MAMA autoposter inventory, Airtable schemas, branding wizard, briefings, optimizer).
- [ ] **Affiliate module** (§15); **social listen tiers** + daily Airtable logs (§16); **Growth Brain** inputs/outputs (§17); review **§18** backlog for v2 picks.

---

## 7. Codex / OpenAI usage note

“Upgrade to Pro / usage limit” is an **OpenAI account billing** issue — switch model in Codex settings or upgrade plan; it does not live in this repo.

---

## 8. Zeus dashboard: copy TNT, then extend (PPC agents included)

**Situation:** There is **no Zeus-specific dashboard** yet; **TNT** already includes **PPC agents** and solid paid-media UX.

**Recommended build path**

1. **Fork or duplicate the TNT dashboard codebase** into a **Zeus** app (new repo or monorepo package — team preference).
2. **Preserve** routing, auth patterns, and the **PPC / ads agent** surfaces as-is for v1 parity.
3. **Layer Zeus IA** on top: **Listen → Target → Engage → Convert → Report**, plus **Publish** (scheduled social), **Influencers / UGC**, **Brand kit**, **Briefings & optimizer** (§11–§12).
4. **Thin app layer:** dashboard reads/writes **Airtable** (and existing ad/email APIs); avoid encoding pipeline business rules only in React — see §13.

**Why copy vs “rename TNT”:** you ship a **dedicated Zeus product** without breaking TNT customers; shared components can be extracted later.

---

## 9. Multi-channel social publishing (scoped per Product / Project / Company)

**Goal:** OAuth + scheduling + optional AI-assisted captions, **scoped** so each row ties to **Product**, **Project**, or **Company** (pick one primary scope field + linked records).

**Channels (target):** Instagram, Facebook, X, Threads, Reddit, TikTok — ship in waves (Meta + X first is typical; TikTok/Reddit have different policy/API constraints).

**Pattern**

- **Airtable:** `SocialAccounts` (tokens/refs per scope), `PublishQueue` (status, channel, scheduled time, asset refs, approval flag), `PublishLog` (results, errors).
- **Workers:** small job runners (or Zapier/Make only for early MVP) dequeue approved rows and call platform APIs.
- **Discovery:** Find and document the **MAMA X autoposter** — reuse auth + posting patterns; extend channel adapters behind one internal interface (`post(job)`).

**Governance:** default **draft → approve → publish** for regulated brands; optional auto-post for low-risk internal accounts.

---

## 10. UGC / influencer outreach (Airtable-first)

Per **product** (or project), maintain relational tables instead of hardcoding lists:

| Table (conceptual) | Purpose |
|--------------------|--------|
| **Creators** | Handle, platform, niche, audience size, **rating** (internal score), fit tags |
| **RateCards** | Deliverable type, price band, notes — linked to Creators or Campaigns |
| **OutreachSequences** | Pre-written email/DM templates with merge fields (`{{product}}`, `{{brand_voice_summary}}`) |
| **OutreachLog** | Sent, opened, reply, stage — for reporting |

**UX:** Zeus dashboard surfaces filters (by product, rating, price); “send” triggers Instantly/DM workflow using **Brand kit** copy (§11).

---

## 11. Branding-first onboarding (starts the stack)

**Principle:** **BRANDING setup is step zero** — everything else (posts, outreach, “AI-assisted content”, briefings) pulls from a single **Brand Profile**.

**Flow**

1. **AI chat onboarding** — questions on audience, tone, taboos, proof points.
2. **Logo upload** + optional **colors/fonts** extraction or manual tokens.
3. **Automated brand guidelines doc** — generated summary stored in Airtable (`BrandProfiles`) and/or linked Google Doc/PDF.
4. Unlock **templates**: email sequences, social snippets, influencer outreach variants tagged **Approved voice**.

This replaces ad-hoc “AI slop” with **constrained generation**: models must cite `BrandProfiles` + approval queues.

---

## 12. Intelligence loop: briefings, strategy, self-optimization, logging

**Daily**

- **Morning brief:** new leads/opportunities (from Airtable views), **why they matter** (LLM rationale on structured fields), overnight social/PPC deltas, inbox-style **responses to approve**.

**Weekly / monthly**

- **Strategy planning** assistant: reads goals + metrics snapshots from Airtable (`MetricsSnapshots` / exports from ads APIs).
- **Optimizer agent:** proposes budget shifts, keyword/theme tweaks, posting windows — writes to **`OptimizationSuggestions`** (pending approval), never silent auto-change for paid/regulated clients without explicit rule.

**Self-optimizing loop + logging**

- Append-only **`AgentRuns`** or **`DecisionLog`**: what was suggested, what was approved, outcomes — feeds the next optimization pass.
- **ML / Growth Brain (expanded in §17):** learns from **social listen logs**, **PPC**, **SEO / Notebook LLM plans**, **short-form hooks**, and **end-of-day review of replies/conversions** — see §17 for cross-channel adaptation and demographic planning.

**Note:** Social **listening** feeds the Brain with **trend and audience** signal; **responder** outcomes feed **phrase/conversion** signal — separate pipelines, one optimizer (§16–§17).

---

## 13. Airtable as relational system of record (avoid “everything in code”)

**Philosophy:** Use Airtable for **entities, relationships, approvals, and history**; the Zeus app is **presentation + automation triggers**.

**Core linked objects (per Zeus workspace or per product base)**

- `Companies` / `Products` / `Projects` (hierarchy as you prefer)
- `BrandProfiles` → linked to Products
- `ChannelAccounts` → scoped to Product/Project + platform
- `Leads` / `Contacts` (existing outreach tables)
- `PublishQueue`, `PublishLog`
- `Creators`, `Campaigns`, `OutreachSequences`, `OutreachLog`
- `OptimizationSuggestions`, `AgentRuns`, `MetricsSnapshots`
- **`SocialListenLog` / `TrendPosts`** — daily ingested posts/trends (tier-limited; §16)
- **`ListenKeywords`** — tracked terms per product; addon expands daily caps
- **`AffiliatePrograms`, `Referrals`, `Rewards`** — Viral Loops–style tracking (§15)
- **`PhrasePerformance`** — winning hooks/phrases mined from EOD reply/revenue logs (§17)

**Code owns:** auth, secure token exchange, rendering, webhooks, background workers. **Airtable owns:** funnel definitions, scoring fields, tags, most automation — keeps Zeus maintainable as SKUs multiply.

---

## 14. Updated implementation checklist (additions)

- [ ] **Fork/copy TNT → Zeus dashboard**; preserve **PPC agents**.
- [ ] **Inventory MAMA X autoposter**; design multi-channel adapter + Airtable queue.
- [ ] **Schema pass:** BrandProfiles, PublishQueue, Creators/Outreach tables per product base (or shared Zeus ops base — decide).
- [ ] **Branding wizard** v1: chat → logo → guidelines doc → template unlock.
- [ ] **Morning brief** v1: scheduled job reading Airtable + ads/email summaries.
- [ ] **Optimizer suggestions** v1: writes to `OptimizationSuggestions`; human approve.
- [ ] **Logging:** `AgentRuns` / decision audit for loop quality.
- [ ] **§15–§18:** Affiliate/referral module; social-listen tiers; Growth Brain; prioritize ideas backlog.

---

## 15. Viral Loops–style affiliate / referral (Zeus add-on)

**Position:** Referral marketing as a **first-class Zeus module** — customers/accelerators promote products with **trackable links**, **reward tiers**, and **leaderboards**, similar in spirit to **Viral Loops–class** referral platforms but **inside** Growth OS (single login, same Brand/Product scope).

**Airtable-shaped concepts**

| Concept | Purpose |
|---------|---------|
| **AffiliatePrograms** | Per product; commission model (% / flat / milestone), cookie/window rules (stored as fields + legal text link) |
| **Partners / Ambassadors** | Person + payout method + status |
| **ReferralLinks** | Unique codes/URLs, UTM defaults, Product link |
| **ReferralEvents** | Signup, trial, paid — source row for attribution |
| **RewardsQueue** | Approved payouts, holds for fraud review |

**Zeus dashboard:** enroll partners, copy assets from **Brand kit**, see performance vs **Listen** and **PPC** (same Mission Control).

**Pricing:** bundle **Starter** (limited partners/events); **Growth** unlocks webhooks + Stripe/payout automation when ready.

---

## 16. Social listening vs AI responder — products, Airtable logging, tiers

**Two connected products**

| Capability | Purpose | Feeds |
|------------|---------|--------|
| **Social listen (intelligence)** | **Find audience**, **real-time trending** analytics, **what to build** / **what to say** | Daily rows in **`TrendPosts` / `SocialListenLog`**, keyword snapshots; **ML Growth Brain** (§17) |
| **AI responder** | Draft/send/automation for engagement | Reply outcomes, approval logs; **phrase performance** mining |

**Operational rules**

- **Daily job:** ingest **limit** of posts/keywords per tier → append to Airtable (dedupe by post ID + date).
- **Starter tier:** low daily cap (e.g. N posts + K keywords); **add-on** increases **logged volume** and **keyword slots** (metered SaaS).
- **Analytics:** dashboard shows velocity (mentions/day), emerging themes, competitor spikes — tied to **Product / Project**.

**Pricing sketch:** base Zeus includes minimal listen; **Listen Pro** / **Listen Enterprise** = higher caps + historical retention + export.

---

## 17. ML / AI Growth Brain — cross-channel adaptation (plan detail)

**Inputs (structured + logs in Airtable / warehouse)**

- **Social listen:** trending topics, clusters, audience language (§16).
- **PPC:** creative × keyword × geo performance from TNT/Zeus ads connectors.
- **SEO / Notebook LLM:** planned themes from `ResearchPlans` or notebook outputs — Brain suggests **priority topics** and **angles** aligned to trending + conversion data.
- **Short-form:** which **hooks** and **first-frame patterns** correlate with saves/clicks (from publish logs + platform metrics).
- **End-of-day reply review:** mine **top converting phrases**, objection handlers, and **CTA variants** from tagged outcomes (`PhrasePerformance`).

**Outputs (always approval-gated for paid/sensitive)**

- **PPC:** bid/budget/creative **suggestions** (not silent auto-apply for regulated tiers).
- **SEO / content calendar:** next-week **Notebook LLM** briefs ranked by expected impact.
- **Short-form:** **hook library** refreshed nightly/weekly from winners.
- **Demographics / ICP:** refined **persona hypotheses** per product (“who is converting this week”) with **evidence links** back to rows.

**Tech stance:** start with **LLM + embeddings + rules** on **tabular + text logs**; graduate to **classic ML** (bandits, forecasting) when **MetricsSnapshots** + **AgentRuns** history is deep enough.

---

## 18. High-value features — backlog ideas (what else would move the needle)

Prioritize based on ICP; items below are **candidates** to fold into Zeus roadmap or packaging.

| Idea | Why it’s valuable |
|------|-------------------|
| **Competitive creative radar** | Auto-track competitor ads + social spikes; brief creative team with “what changed this week.” |
| **Landing page / LP experiment loop** | Tie PPC + SEO to **variant** rows in Airtable; Brain suggests copy blocks from winning phrases. |
| **Churn & winback triggers** | CRM signals → Zeus plays (email + Siren + retargeting lists). |
| **Community detection** | Graph-lite: who interacts with whom in Listen logs → micro-influencers and partnership targets. |
| **Event / webinar growth kit** | Registration pages, reminder sequences, clip-to-short from replay — one workflow. |
| **Sales enablement feed** | Daily “what prospects care about” from Listen + CRM for AEs. |
| **Review & reputation lane** | G2/App Store keywords in Listen; response templates + escalation. |
| **Partner co-marketing workspace** | Shared (permissioned) Brand kit + co-branded assets for affiliates (extends §15). |
| **Compliance copilot** | Industry packs (health/finance) auto-flag risky posts/replies before approve. |
| **Headless API + white-label** | Agencies resell Zeus Mission Control under their brand. |
| **“Creative fatigue” alerts** | When CTR/engagement drops vs baseline on a creative or hook cluster. |
| **Geo & language expansion scorer** | Which new markets/languages to test next from demand signals. |
| **Lead routing AI** | Score inbound to SDR vs nurture vs self-serve based on Listen + enrichment. |
| **Dark social estimation** | Survey + UTM discipline + branded search correlation as proxy when direct attribution fails. |

**Next step:** pick **3–5** from this list for a **v2 Zeus** narrative after Mission Control + Listen tiers + Growth Brain v1 ship.
