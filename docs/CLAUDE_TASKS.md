# Claude / Claude Code — task list to finish Zeus

Use this as a **work queue**. Order matters within each track; parallel tracks are labeled. Full gates and acceptance criteria live in [`ZEUS_FINAL_BUILD_PLAN.md`](ZEUS_FINAL_BUILD_PLAN.md).

**Instructions for Claude:** Pick one section at a time; after each task, leave a short note in git commit / PR description of what remains.

---

## Phase 0 — Decisions & inventory (human + docs)

- [ ] **0.1** Record decision: MAMA MCP Marketplace = separate base vs **Track** field in MAMA Outreach → update [`ZEUS_OUTREACH_PLAN.md`](ZEUS_OUTREACH_PLAN.md) or Notion.
- [ ] **0.2** Resolve GoodBot vs 411 → one narrative; align outreach base naming.
- [ ] **0.3** Find **MAMA X autoposter** — document repo path, auth, API usage in [`ZEUS_FINAL_BUILD_PLAN.md`](ZEUS_FINAL_BUILD_PLAN.md) appendix or new `docs/MAMA_AUTOPOSTER.md` (or state “not found — greenfield”).
- [ ] **0.4** DOM CRE: internal-only vs partner motion → outreach base yes/no.
- [ ] **0.5** Create **Mission Control** repo (fork TNT); pick deployment (Vercel/Railway/etc.) + staging URL.

---

## Track A — Mission Control dashboard (separate repo — fork TNT)

- [ ] **A.1** Fork TNT → new repo; CI green; `.env.example` for ads/Airtable.
- [ ] **A.2** Verify **PPC agents** + ads reporting parity with current TNT (checklist QA).
- [ ] **A.3** Add Zeus nav placeholders: Listen, Target, Engage, Convert, Report, Publish, Brand, Affiliates, Briefings (stub pages OK).
- [ ] **A.4** Read-only **Leads** summary from one Airtable base (PAT server-side).
- [ ] **A.5** Publish queue UI: bind to `PublishQueue` when Track D exists.
- [ ] **A.6** Brand wizard shell → writes `BrandProfiles` fields.
- [ ] **A.7** Morning brief view → pulls views / snapshots when Track F exists.

---

## Track B — Airtable (manual setup + doc verification)

- [ ] **B.1** In **one pilot base** (e.g. Elevar Outreach): add **Companies / Products / Projects** minimally linked.
- [ ] **B.2** Create **BrandProfiles** per [`AIRTABLE_ZEUS_SCHEMA.md`](AIRTABLE_ZEUS_SCHEMA.md); link to Product.
- [ ] **B.3** Stub empty tables: **TrendPosts**, **ListenKeywords**, **PublishQueue**, **PublishLog**, **OptimizationSuggestions**, **AgentRuns** (correct field types).
- [ ] **B.4** Create views: new leads today, TrendPosts last 7d, PublishQueue approved+scheduled, OptimizationSuggestions proposed-only.
- [ ] **B.5** New PAT **scoped to that base only**; document in password manager — never commit.

---

## Track C — This repo (`zues-outreach` execution layer)

- [ ] **C.1** Smoke-test all slash commands after plugin rename: `/find-leads`, `/airtable-sync`, `/social-listen`, etc.
- [ ] **C.2** Add **`scripts/trendposts_append.py`** (or extend existing): read structured JSON/CSV from listen output → POST to Airtable **TrendPosts** with dedupe key `(platform, external_post_id)` — env: `AIRTABLE_TABLE_TRENDPOSTS`, field map optional.
- [ ] **C.3** Document **`commands/listen-to-airtable.md`** (or extend `social-listen.md`): pipeline from keywords → daily cap → TrendPosts table.
- [ ] **C.4** Align **`airtable-push-leads.py`** with any new Elevar fields — regression `--dry-run` on sample CSV.
- [ ] **C.5** Optional: **`agents/growth-brain.md`** stub describing inputs (TrendPosts, MetricsSnapshots) and output (`OptimizationSuggestions` rows) for human approval — no automation required yet.

---

## Track D — Social publish workers (new repo or MAMA)

- [ ] **D.1** Implement OAuth/token storage (vault); never raw tokens in Airtable — reference IDs only.
- [ ] **D.2** Worker: poll **PublishQueue** status `Approved` → post to **Meta + X** v1.
- [ ] **D.3** Write **PublishLog** + update queue row status Published/Failed.
- [ ] **D.4** Add Threads / Reddit / TikTok adapters per API readiness; document blockers.

---

## Track E — Listen ingest (workers + tiers)

- [ ] **E.1** Cron job: ingest listen results → **TrendPosts** under daily **tier cap** (config/env).
- [ ] **E.2** Enforce **ListenKeywords** slot limits per SKU.
- [ ] **E.3** Dashboard charts (Mission Control): mentions/day — even table-first v1.

---

## Track F — Growth Brain

- [ ] **F.1** Batch job: pull TrendPosts + PPC export + PhrasePerformance inputs → LLM/rules → **`OptimizationSuggestions`** rows (status Proposed).
- [ ] **F.2** Log each run in **AgentRuns**.
- [ ] **F.3** Mission Control: approve/reject suggestions; optional “applied” tracking.

---

## Track G — Affiliate (Viral Loops–class)

- [ ] **G.1** Create **AffiliatePrograms**, **Partners**, **ReferralLinks**, **ReferralEvents**, **RewardsQueue** per schema doc.
- [ ] **G.2** Enrollment UI + link generator in Mission Control.
- [ ] **G.3** Attribution v1 (UTM + first-touch row); tests.
- [ ] **G.4** Later: Stripe Connect / payouts — separate milestone.

---

## Track H — Polish & GTM

- [ ] **H.1** Pricing page draft aligned with SKUs in [`ZEUS_FINAL_BUILD_PLAN.md`](ZEUS_FINAL_BUILD_PLAN.md) §5.
- [ ] **H.2** Pick **3–5** items from [`ZEUS_OUTREACH_PLAN.md`](ZEUS_OUTREACH_PLAN.md) §18 for v2 roadmap.
- [ ] **H.3** Record Loom or screenshots: Elevar path `/find-leads` → `/airtable-sync` → Airtable row.

---

## Quick “next session” starter for Claude (this repo only)

If you only have **`zues-outreach`** open, do in order: **C.1 → C.2 → C.3 → C.4**. Anything requiring TNT fork or workers needs the other repos checked out.
