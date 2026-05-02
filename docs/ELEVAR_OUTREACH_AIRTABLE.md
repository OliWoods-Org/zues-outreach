# Elevar Outreach — Airtable base setup

Use this spec when creating or aligning the **Elevar Outreach** base in the **Zeus Outreach** workspace so it matches Zeus planning (`docs/ZEUS_OUTREACH_PLAN.md`) and the CSV sync script (`scripts/airtable-push-leads.py`).

---

## 1. Base & scope

| Item | Value |
|------|--------|
| **Workspace** | Zeus Outreach (`wsp…` — human reference only; API uses base ID) |
| **Base name** | **Elevar Outreach** |
| **Products covered** | Elevar Health, Elevar iOS |
| **Purpose** | US B2B partnerships for hormone / weight telehealth — clinics, pharmacies, selected wellness creators (separate messaging track). |

**Isolation:** PAT used for Zeus scripts should include **this base only** for Elevar pipelines (or least privilege). Set `AIRTABLE_BASE_ID` to this base’s `app…` ID.

---

## 2. Primary table: `Leads`

Create one table named **`Leads`** (matches default `AIRTABLE_TABLE`).

### Fields (create in this order)

| # | Field name | Type | Required | Notes |
|---|------------|------|----------|--------|
| 1 | **Email** | Email | Yes | **Upsert merge key** — must be unique per row for sync script |
| 2 | **First Name** | Single line text | No | |
| 3 | **Last Name** | Single line text | No | |
| 4 | **Company** | Single line text | No | |
| 5 | **Title** | Single line text | No | |
| 6 | **Phone** | Phone or text | No | |
| 7 | **LinkedIn** | URL | No | |
| 8 | **Source** | Single line text | No | e.g. Apollo, referral, web |
| 9 | **Campaign** | Single line text | No | Default from env: `Elevar Master Outreach` |
| 10 | **Segment** | Single select | No | Options: `Clinic`, `Pharmacy`, `Creator`, `Other` |
| 11 | **Lead Score** | Number (integer 0–100) | No | Optional; map CSV `lead_score` |
| 12 | **Status** | Single select | No | e.g. New, Contacted, Qualified, Meeting, Nurture, Closed |
| 13 | **Notes** | Long text | No | |

**Single select options — Segment**

- Clinic  
- Pharmacy  
- Creator  
- Other  

**Single select options — Status** (suggested starter)

- New  
- Contacted  
- Qualified  
- Meeting scheduled  
- Nurture  
- Closed – won  
- Closed – lost  

Adjust labels to match your process; if you rename fields, set `AIRTABLE_FIELD_MAP` in env.

---

## 3. Recommended views

| View name | Filter / sort |
|-----------|----------------|
| **All leads** | Default grid, sorted by Last modified |
| **Pipeline – Clinic** | Segment = Clinic |
| **Pipeline – Pharmacy** | Segment = Pharmacy |
| **Creators** | Segment = Creator |
| **This campaign** | Campaign = `Elevar Master Outreach` |
| **Hot** | Lead Score ≥ 70 (when populated) |

---

## 4. Environment (`~/.elevare-env`)

```bash
# Elevar Outreach base only (from https://airtable.com/api for this base)
export AIRTABLE_PAT="pat_..."          # scoped to this base if possible
export AIRTABLE_BASE_ID="app..."
export AIRTABLE_TABLE="Leads"
export AIRTABLE_CAMPAIGN="Elevar Master Outreach"

# Optional: typo protection (same value as AIRTABLE_BASE_ID)
# export AIRTABLE_LOCK_TO_BASE_ID="$AIRTABLE_BASE_ID"

# Optional: block other bases from accidental use
# export AIRTABLE_FORBIDDEN_BASE_IDS="appOtherBase1,appOtherBase2"
```

---

## 5. CSV → Airtable column mapping (script defaults)

| CSV column | Airtable field |
|------------|----------------|
| `email` | Email |
| `first_name` | First Name |
| `last_name` | Last Name |
| `company` | Company |
| `title` | Title |
| `phone` | Phone |
| `linkedin` | LinkedIn |
| `source` | Source |
| `segment` | Segment |
| `lead_score` | Lead Score |
| `notes` | Notes |
| `status` | Status |

**Campaign** is set automatically unless `AIRTABLE_SKIP_CAMPAIGN=1`.

**Segment:** values must match an option exactly (`Clinic`, `Pharmacy`, `Creator`, `Other`).

---

## 6. Verification

```bash
source ~/.elevare-env
python3 scripts/airtable-push-leads.py path/to/sample.csv --dry-run
```

Then run without `--dry-run` to write. Expect merge on **Email** only.

---

## 7. Apollo pilot (first ~100 multi-segment leads)

From repo root, with **`APOLLO_API_KEY`** set (master key with `mixed_people/api_search` + `people/bulk_match`):

```bash
source ~/.elevare-env
python3 scripts/elevar_apollo_pilot.py --limit 100 --out data/elevar-pilot-100.csv
```

- **Search** is free; **bulk_match** uses enrichment credits.
- Mix: ~40 **Clinic**, ~35 **Pharmacy**, ~25 **Creator** (US). Adjust queries in `scripts/elevar_apollo_pilot.py` if results are thin.
- `--search-only` — IDs only, no credits.
- Then push to Airtable: `python3 scripts/airtable-push-leads.py data/elevar-pilot-100.csv --dry-run` → sync.

---

## 8. Handoff to Zeus dashboard / other agents

- **Base ID + table name** live in env — Zeus Mission Control can read the same vars or duplicate display config.  
- **Campaign** tag keeps Elevar rows distinguishable from other programs in analytics.  
- **Segment** drives routing (clinic vs pharmacy vs creator sequences).
