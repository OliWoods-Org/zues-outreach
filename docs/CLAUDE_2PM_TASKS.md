# Claude — 2pm tasks (afternoon execution block)

**Use this for a fixed daily/weekly slot** (e.g. **2:00 PM**) to advance **outreach + Zeus execution** without re-planning from scratch.

**Master checklist (start outreach, all products):** [`OUTREACH_LAUNCH_TASKS.md`](OUTREACH_LAUNCH_TASKS.md)  
**Full engineering backlog:** [`CLAUDE_TASKS.md`](CLAUDE_TASKS.md)  
**Desktop shortcut:** `/Users/woods/Desktop/ZEUS_OUTREACH_LAUNCH_TASKS.md` (mirror of outreach launch tasks)

**Zeus Web UI — Midjourney / mood art (canonical in repo):** [`ZEUS_UI_MIDJOURNEY_REFERENCE.md`](ZEUS_UI_MIDJOURNEY_REFERENCE.md) — backgrounds, glass refs, grid overlays; align with `apps/zeus-web` tokens.

---

## Every 2pm session (15–30 min)

1. **Environment**
   - [ ] `source ~/.zeus-env` (or `~/.elevare-env`).
   - [ ] Confirm which **product** you’re touching today (Elevar vs another base → correct `AIRTABLE_BASE_ID` if switching).

2. **Pipeline health**
   - [ ] Open **Elevar Outreach** (or today’s base) in Airtable → **Leads** view “This campaign” / **New** rows.
   - [ ] Count: new leads since last session; any rows stuck without **Email** or **Status**.

3. **One concrete advance** (pick one)
   - [ ] **Ingest:** Run `elevar_apollo_pilot`, `rapidapi_maps_leads`, or import CSV → `airtable-push-leads.py --dry-run` then sync.
   - [ ] **Enrich:** `enrich_hunter_gap.py` on a file that has **website** but missing email.
   - [ ] **Send:** Campaign step in Instantly or `/send-campaign` prep (template + list path).
   - [ ] **Next product:** Duplicate Phase 1 checklist from [`OUTREACH_LAUNCH_TASKS.md`](OUTREACH_LAUNCH_TASKS.md) for **LuxuryTravels** / **Siren** / etc.

4. **Log**
   - [ ] One line in git commit, Notion, or **CLAUDE_TASKS** track note: what moved, what’s blocked.

---

## Elevar-specific 2pm micro-checklist

- [ ] `AIRTABLE_CAMPAIGN` consistent (**Elevar Master Outreach** unless overridden).
- [ ] **Segment** populated (Clinic / Pharmacy / Creator / Other) for routing.
- [ ] No accidental **base ID** (confirm URL / env matches **Elevar Outreach** only for Elevar runs).

---

## When to read other docs

| Situation | Doc |
|-----------|-----|
| Field names / table setup | [`ELEVAR_OUTREACH_AIRTABLE.md`](ELEVAR_OUTREACH_AIRTABLE.md) |
| Maps + Apollo + Hunter cost discipline | [`LOW_BUDGET_LEAD_STACK.md`](LOW_BUDGET_LEAD_STACK.md) |
| Keys you can’t set in code | [`TASKS_REMAINING_EXTERNAL.md`](TASKS_REMAINING_EXTERNAL.md) |
| Mission Control / workers / publish | [`ZEUS_FINAL_BUILD_PLAN.md`](ZEUS_FINAL_BUILD_PLAN.md) |
| Zeus Web visual refresh (MJ prompts, textures) | [`ZEUS_UI_MIDJOURNEY_REFERENCE.md`](ZEUS_UI_MIDJOURNEY_REFERENCE.md) |

---

## Sync rule

When **`OUTREACH_LAUNCH_TASKS.md`** changes materially, update **`/Users/woods/Desktop/ZEUS_OUTREACH_LAUNCH_TASKS.md`** so the desktop copy stays the operator source of truth outside the repo.
