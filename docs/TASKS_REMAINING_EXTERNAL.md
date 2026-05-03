# Tasks we cannot finish inside this repo (human / vendor / other apps)

These stay **outside** `zues-outreach` until someone does them. Built pieces live in `scripts/` + [`LOW_BUDGET_LEAD_STACK.md`](LOW_BUDGET_LEAD_STACK.md).

---

## Keys & subscriptions (you)

- [ ] **RapidAPI:** Subscribe to the exact Maps API you want; copy **X-RapidAPI-Key** and confirm **host** + **path** (`RAPIDAPI_MAPS_HOST`, `RAPIDAPI_MAPS_PATH`). Adjust [`rapidapi_maps_leads.py`](../scripts/rapidapi_maps_leads.py) params if the listing uses different query keys.
- [ ] **Apify:** Pick one Maps actor; set `APIFY_MAPS_ACTOR_ID` + valid `APIFY_MAPS_INPUT_JSON` for that actor’s schema.
- [ ] **Apollo:** Add `APOLLO_API_KEY` (master key with `api_search` + `bulk_match` scopes).
- [ ] **Hunter.io:** `HUNTER_API_KEY` for domain-search gap fill (optional).
- [ ] **Email verification:** Neverbounce / ZeroBounce API for bulk validation before Instantly — **not implemented** (paid vendor).

---

## Compliance & quality (you / counsel)

- [ ] **Creator outreach:** Legal/compliance review for health claims + FTC endorsement rules before automated sequences.
- [ ] **GDPR / state privacy:** Confirm Hunter + Apollo usage for EU/CA contacts if you expand geography.

---

## Product lines not automated here

- [ ] **SparkToro / manual creator lists** — import CSV manually; no API script in repo.
- [ ] **State pharmacy/medical board scraping** — custom parsers per state; long-tail project.
- [ ] **LinkedIn profile APIs** (Scrapin, Proxycurl, etc.) — add separate script when you pick one vendor.

---

## Mission Control & workers (other repos / infra)

Already tracked in [`CLAUDE_TASKS.md`](CLAUDE_TASKS.md) — highlights:

- [ ] Mission Control fork deployment + env wiring (`ZEUS_FINAL_BUILD_PLAN.md`).
- [ ] Publish workers (OAuth, Meta/X adapters).
- [ ] Listen ingest cron → TrendPosts caps.
- [ ] Growth Brain batch → OptimizationSuggestions.

---

## Quick verify after keys exist

```bash
source ~/.zeus-env
python3 scripts/rapidapi_maps_leads.py --query "compounding pharmacy" --country US --limit 20 --segment Pharmacy --dry-run
python3 scripts/elevar_apollo_pilot.py --limit 5 --search-only --out data/smoke.csv
python3 scripts/enrich_hunter_gap.py data/sample-leads-dryrun.csv --out /tmp/h.csv   # needs websites/domains
```
