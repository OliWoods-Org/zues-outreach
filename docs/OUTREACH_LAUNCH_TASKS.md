# Zeus + Airtable — start outreach (Elevar + other products)

**Purpose:** Checklist to go from “planned” to **live outbound** per product line in the **Zeus Outreach** workspace. Pair with [`CLAUDE_2PM_TASKS.md`](CLAUDE_2PM_TASKS.md) for a daily afternoon execution block.

**Canonical repo path:** `docs/OUTREACH_LAUNCH_TASKS.md`  
**Desktop copy (quick access):** `/Users/woods/Desktop/ZEUS_OUTREACH_LAUNCH_TASKS.md` — keep in sync when this file changes.

---

## Phase 0 — Workspace & secrets (once)

- [ ] **Workspace:** Airtable **Zeus Outreach** — confirm bases only for outreach (no algo/scoring bleed).
- [ ] **Env file:** `source ~/.zeus-env` (or `~/.elevare-env`) in every terminal / Claude session that runs scripts.
- [ ] **Never commit:** PATs, Apollo, Instantly, RapidAPI, Hunter keys — password manager only.

| Integration | Env vars (see [`.env.example`](../.env.example)) | Used for |
|-------------|---------------------------------------------------|----------|
| Airtable | `AIRTABLE_PAT`, `AIRTABLE_BASE_ID`, `AIRTABLE_TABLE`, optional `AIRTABLE_LOCK_TO_BASE_ID` | Upsert leads per base |
| Apollo | `APOLLO_API_KEY` | `/find-leads`, `elevar_apollo_pilot.py` |
| Instantly | `INSTANTLY_API_KEY` | `/send-campaign` |
| RapidAPI Maps | `RAPIDAPI_KEY`, host/path | `rapidapi_maps_leads.py` |
| Hunter gap-fill | `HUNTER_API_KEY` | `enrich_hunter_gap.py` |
| HubSpot (optional) | `HUBSPOT_API_KEY` | `/crm-sync` |

---

## Phase 1 — Elevar (pilot vertical)

**Spec:** [`ELEVAR_OUTREACH_AIRTABLE.md`](ELEVAR_OUTREACH_AIRTABLE.md)  
**Low-budget stack:** [`LOW_BUDGET_LEAD_STACK.md`](LOW_BUDGET_LEAD_STACK.md)

### Airtable

- [ ] Base **Elevar Outreach** exists; primary table **`Leads`**.
- [ ] Fields: **Email** (unique), **First/Last Name**, **Company**, **Title**, **Phone**, **LinkedIn**, **Website**, **Source**, **Campaign**, **Segment** (Clinic / Pharmacy / Creator / Other), **Lead Score**, **Status**, **Notes** — per spec.
- [ ] PAT scoped to **this base**; `AIRTABLE_BASE_ID` = this base’s `app…` in `~/.zeus-env`.
- [ ] Optional: `AIRTABLE_LOCK_TO_BASE_ID` = same as `AIRTABLE_BASE_ID`.

### Data in

- [ ] **Apollo path:** `python3 scripts/elevar_apollo_pilot.py --limit 100 --out data/elevar-pilot-100.csv` (needs credits on bulk_match).
- [ ] **Maps path (local):** `python3 scripts/rapidapi_maps_leads.py …` (subscribe to a RapidAPI listing first).
- [ ] **Hunter gap:** `python3 scripts/enrich_hunter_gap.py …` when `website` present but email empty.
- [ ] **Dry run:** `python3 scripts/airtable-push-leads.py <csv> --dry-run` then run without `--dry-run`.

### Message + send

- [ ] Instantly: template/sequence for **Elevar Master Outreach** (or `AIRTABLE_CAMPAIGN` value); connect to same ICP as plugin templates in `templates/`.
- [ ] Compliance: no clinical claims in cold copy; creator segment reviewed separately.

---

## Phase 2 — Other product lines (same pattern, one base each)

For each base below: create **Leads** (or mirror schema in [`AIRTABLE_ZEUS_SCHEMA.md`](AIRTABLE_ZEUS_SCHEMA.md)), set **`Campaign`** tag per product, **Segment** or **Track** as needed, dedicated **`AIRTABLE_BASE_ID`** only when running that product’s sync (or separate PAT per base).

**Portfolio reference:** [`ZEUS_OUTREACH_PLAN.md`](ZEUS_OUTREACH_PLAN.md) §1.

| Order | Base name | Products covered | Start outreach when |
|-------|-----------|------------------|----------------------|
| 1 | **LuxuryTravels Outreach** | LuxuryTravels, LT iOS, LT MCP | [ ] Schema ready · [ ] First 25 leads · [ ] Campaign tag |
| 2 | **Siren Outreach** | Siren AI, iOS, Sales Team, Voice Demo | [ ] Voice disposition fields if needed · [ ] Same |
| 3 | **Grail Outreach** | Grail Intelligence, iOS | [ ] Same |
| 4 | **Paper St Outreach** | Paper St., iOS | [ ] Same |
| 5 | **MAMA Outreach** | MAMA SaaS, iOS, Memory iOS, LLM Council (feature) | [ ] **One** MAMA base · [ ] Track field if MCP folded in |
| 6 | **CoFounder Outreach** | CoFounder, iOS | [ ] Same |
| 7 | **TuneStars / Corvo / VRFD** | Per plan | [ ] Lower priority — stub bases OK |
| 8 | **GoodBot / Film Studio** | After GoodBot vs 411 decision | [ ] Single narrative |
| 9 | **Castello** + **P/ART** | Two bases; shared lead pool rules | [ ] Routing field / automation |
| 10 | **DOM CRE Outreach** | If actively selling CRE dash | [ ] After scope doc |
| 11 | **OliWoods Foundation Outreach** | Impact projects via **Project** field | [ ] When foundation campaigns start |

**Zeus commands:** `/find-leads`, `/maps-leads`, `/enrich-leads`, `/airtable-sync`, `/send-campaign` — swap **criteria** and **base env** per product.

---

## Phase 3 — Ops rhythm (weekly)

- [ ] **Monday:** Export pipeline views per base; refresh Apollo/Maps pulls where empty.
- [ ] **Mid-week:** `/social-listen` / TrendPosts pattern per [`SOCIAL_LISTEN_TIERS.md`](SOCIAL_LISTEN_TIERS.md) if live.
- [ ] **Friday:** Score fills + status hygiene in Airtable; note blockers in [`CLAUDE_TASKS.md`](CLAUDE_TASKS.md).

---

## Phase 4 — Still external / blocked in-repo

See [`TASKS_REMAINING_EXTERNAL.md`](TASKS_REMAINING_EXTERNAL.md) and **Track D–G** in [`CLAUDE_TASKS.md`](CLAUDE_TASKS.md) (workers, publish, Growth Brain).

---

## Quick command reference

```bash
source ~/.zeus-env
python3 scripts/elevar_apollo_pilot.py --limit 100 --out data/elevar-pilot-100.csv
python3 scripts/airtable-push-leads.py data/elevar-pilot-100.csv --dry-run
./scripts/pipeline_low_budget.sh   # after setting RUN_* flags — see script header
```

**Desktop + 2pm touchpoint:** [`CLAUDE_2PM_TASKS.md`](CLAUDE_2PM_TASKS.md)
