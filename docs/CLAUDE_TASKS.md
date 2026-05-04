# Claude / Claude Code — task list to finish Zeus

Use this as a **work queue**. Order matters within each track; parallel tracks are labeled. Full gates and acceptance criteria live in [`ZEUS_FINAL_BUILD_PLAN.md`](ZEUS_FINAL_BUILD_PLAN.md).

**Instructions for Claude:** Pick one section at a time; after each task, leave a short note in git commit / PR description of what remains.

---

## Outreach launch + 2pm execution (Elevar & all products)

| Doc | Purpose |
|-----|---------|
| [**`OUTREACH_LAUNCH_TASKS.md`**](OUTREACH_LAUNCH_TASKS.md) | **Start outbound** — Elevar first, then LuxuryTravels, Siren, MAMA, … — Airtable bases, env, scripts, weekly rhythm. |
| [**`CLAUDE_2PM_TASKS.md`**](CLAUDE_2PM_TASKS.md) | **Afternoon block** — repeatable 2pm checklist (env, pipeline health, one concrete advance, log). |
| **Desktop mirror** | `/Users/woods/Desktop/ZEUS_OUTREACH_LAUNCH_TASKS.md` — same checklist for outside-repo access; **sync from `OUTREACH_LAUNCH_TASKS.md` when it changes.** |

---


## Phase 0 — Decisions & inventory (human + docs)

- [ ] **0.1** Record decision: MAMA MCP Marketplace = separate base vs **Track** field in MAMA Outreach → update [`ZEUS_OUTREACH_PLAN.md`](ZEUS_OUTREACH_PLAN.md) or Notion.
- [ ] **0.2** Resolve GoodBot vs 411 → one narrative; align outreach base naming.
- [x] **0.3** Autoposter placeholder: [`MAMA_AUTOPOSTER.md`](MAMA_AUTOPOSTER.md) (greenfield / search other repos).
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
  - **TNT ops tables (optional second base):** [`TNT_MISSION_CONTROL_AIRTABLE_BASE.md`](TNT_MISSION_CONTROL_AIRTABLE_BASE.md) — `PPCAgentRuns`, `MissionControlHealth`, etc.
- [ ] **B.4** Create views: new leads today, TrendPosts last 7d, PublishQueue approved+scheduled, OptimizationSuggestions proposed-only.
- [ ] **B.5** New PAT **scoped to that base only**; document in password manager — never commit.

---

## Track C — This repo (`zues-outreach` execution layer)

- [ ] **C.1** Smoke-test all slash commands after plugin rename: `/find-leads`, `/airtable-sync`, `/social-listen`, `/maps-leads`, etc.
- [x] **C.2** **`scripts/trendposts_append.py`** — CSV → **TrendPosts** upsert on **Dedupe Key**; env `AIRTABLE_TABLE_TRENDPOSTS`, `AIRTABLE_MERGE_FIELD_TREND`.
- [x] **C.3** **`commands/listen-to-airtable.md`** — pipeline doc.
- [x] **C.4** Sample CSV regression: `data/sample-leads-dryrun.csv` + `--dry-run` (no schema change required).
- [x] **C.5** **`agents/growth-brain.md`** — inputs/outputs for `OptimizationSuggestions`.
- [x] **C.6** **`scripts/rapidapi_maps_leads.py`** + **`scripts/apify_maps_run.py`** — Maps lane (keys + actor choice are external).
- [x] **C.7** **`scripts/enrich_hunter_gap.py`** — Hunter domain gap-fill (needs `HUNTER_API_KEY`).
- [x] **C.8** **`scripts/pipeline_low_budget.sh`** — optional orchestration.
- [ ] **C.9** Wire **Neverbounce/ZeroBounce** batch verify before Instantly — API keys + script TBD.

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

- [x] **H.1** Draft: [`PRICING_SKUS.md`](PRICING_SKUS.md).
- [x] **H.2** Picks: [`ROADMAP_V2_PICKS.md`](ROADMAP_V2_PICKS.md).
- [ ] **H.3** Record Loom or screenshots: Elevar path `/find-leads` → `/airtable-sync` → Airtable row.

---

## Quick “next session” starter for Claude (this repo only)

If you only have **`zues-outreach`** open, do in order: **C.1 → C.2 → C.3 → C.4**. Anything requiring TNT fork or workers needs the other repos checked out.
