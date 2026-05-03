---
name: maps-leads
description: Pull local business leads via RapidAPI Maps-style API or Apify actor → CSV for Elevar
argument-hint: "[options] use MAPS_QUERY / pipeline env vars — see docs/LOW_BUDGET_LEAD_STACK.md"
allowed-tools:
  - Bash
  - Read
---

# Maps leads (RapidAPI / Apify)

Low-budget **local** density (clinics, pharmacies, med spas) complementary to Apollo B2B titles.

## RapidAPI (default integration)

1. Subscribe to a Maps extractor on **RapidAPI**; set `RAPIDAPI_KEY`, confirm `RAPIDAPI_MAPS_HOST` + path match the listing.
2. Run:

```bash
source ~/.zeus-env
python3 scripts/rapidapi_maps_leads.py --query "compounding pharmacy" --country US --limit 50 --segment Pharmacy --out data/maps-pharm.csv
```

3. Optional gap-fill emails from domains:

```bash
python3 scripts/enrich_hunter_gap.py data/maps-pharm.csv --out data/maps-pharm-enriched.csv
```

4. Airtable:

```bash
python3 scripts/airtable-push-leads.py data/maps-pharm-enriched.csv --dry-run
```

## Apify actor

Set `APIFY_TOKEN`, `APIFY_MAPS_ACTOR_ID`, and `APIFY_MAPS_INPUT_JSON` (actor-specific). Run:

```bash
python3 scripts/apify_maps_run.py --segment Clinic --out data/apify-maps.csv
```

## Full pipeline

See `scripts/pipeline_low_budget.sh` and env toggles `RUN_RAPIDAPI_MAPS`, `RUN_APOLLO_PILOT`, `RUN_HUNTER_GAP`, `RUN_AIRTABLE_PUSH`.

Remaining human/vendor tasks: `docs/TASKS_REMAINING_EXTERNAL.md`.
