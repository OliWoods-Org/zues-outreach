---
name: airtable-sync
description: Push or upsert lead CSV rows into Airtable for Elevar Master Outreach (dedupe by email)
argument-hint: "[leads.csv] [options: --dry-run, --create-only]"
allowed-tools:
  - Bash
  - Read
  - Write
---

# Airtable Lead Sync (Elevar Master Outreach)

Sync a lead CSV into Airtable for **Elevar Master Outreach**. Records merge on **Email** by default (Airtable REST upsert) so re-imports update instead of duplicating.

## Separated bases (scoring / algo vs outreach)

Other projects may use **different Airtable bases**. To avoid touching them:

1. **Dedicated outreach base** — Use a base only for Elevar Master Outreach leads (or one clearly named base).
2. **Token scope** — When you create the PAT in Airtable, under **access**, add **only** that outreach base — not “All bases” or your scoring/algo bases unless you truly need them (prefer **not** for this integration).
3. **Env points at one base** — `AIRTABLE_BASE_ID` must be that base’s ID (`app...`). The sync script only calls `https://api.airtable.com/v0/{AIRTABLE_BASE_ID}/{AIRTABLE_TABLE}` — it never enumerates other bases.
4. **Optional fail-safes** in `~/.elevare-env`:
   - `AIRTABLE_LOCK_TO_BASE_ID` — set to the same value as `AIRTABLE_BASE_ID` so a typo in `AIRTABLE_BASE_ID` fails instead of hitting the wrong base.
   - `AIRTABLE_FORBIDDEN_BASE_IDS` — comma-separated `app...` IDs you **never** want this tool to use (e.g. scoring base); the script exits if `AIRTABLE_BASE_ID` matches one.

**Security:** Never paste PATs in chat, commits, or shared docs. If a token was exposed, **revoke it** in Airtable and create a new scoped token.

## One-time Airtable setup

Follow **`docs/ELEVAR_OUTREACH_AIRTABLE.md`** for the **Elevar Outreach** base (Zeus workspace): table **`Leads`**, **Segment** (Clinic / Pharmacy / Creator / Other), **Lead Score**, views, and env checklist.

Summary:

1. **Create a base** named **Elevar Outreach** (or align an existing base) with primary table **`Leads`**.
2. **Add fields** (names should match or use `AIRTABLE_FIELD_MAP` in env):
   - **Email** — email; used as the merge key (must be unique in the table for upsert).
   - **First Name**, **Last Name**, **Company**, **Title**, **Phone**, **LinkedIn**, **Source**, **Notes**, **Status** — optional but recommended.
   - **Segment**, **Lead Score** — optional; CSV columns `segment`, `lead_score`.
   - **Campaign** — single line text; the script sets this to `Elevar Master Outreach` by default (override with `AIRTABLE_CAMPAIGN`).
3. **Token**: [Airtable](https://airtable.com/create/tokens) → create a personal access token with `data.records:read` and `data.records:write` for the base.
4. **Base ID**: open [Airtable API](https://airtable.com/api) for your base and copy the Base ID (`app...`).
5. **Env** in `~/.elevare-env` (see repo `.env.example`):
   - `AIRTABLE_PAT`
   - `AIRTABLE_BASE_ID`
   - `AIRTABLE_TABLE` — table name (e.g. `Leads`) or table ID (`tbl...`).
   - Optional: `AIRTABLE_CAMPAIGN` (default: `Elevar Master Outreach`), `AIRTABLE_MERGE_FIELD` (default: `Email`).

## Instructions

1. **Confirm environment**:
   ```bash
   if [ -z "$AIRTABLE_PAT" ] || [ -z "$AIRTABLE_BASE_ID" ] || [ -z "$AIRTABLE_TABLE" ]; then
     echo "Error: Set AIRTABLE_PAT, AIRTABLE_BASE_ID, and AIRTABLE_TABLE in ~/.elevare-env"
     exit 1
   fi
   source ~/.elevare-env 2>/dev/null || true
   ```

2. **Validate CSV**:
   - Required: a column for email (`email`, `Email`, or `work_email`).
   - Optional: `first_name`, `last_name`, `company`, `title`, `phone`, `linkedin`, `source`, `notes`, `status` (common aliases are mapped automatically).

3. **Dry run** (prints first records, no API calls):
   ```bash
   python3 "$(dirname "$0")/../scripts/airtable-push-leads.py" "$PATH_TO_CSV" --dry-run
   ```
   If the plugin runs from a different cwd, use the repo path, e.g.:
   `python3 ~/.claude/plugins/elevare-plugin/scripts/airtable-push-leads.py leads.csv --dry-run`

4. **Sync (upsert by email)**:
   ```bash
   python3 /path/to/zues-outreach/scripts/airtable-push-leads.py /path/to/leads.csv
   ```

5. **Create-only** (no merge; use only if you want raw duplicate risk):
   ```bash
   python3 /path/to/zues-outreach/scripts/airtable-push-leads.py /path/to/leads.csv --create-only
   ```

6. **Output** a short summary for the user:
   - Rows prepared / skipped
   - Created vs updated counts (when the API returns `createdRecords` / `updatedRecords`)
   - Link: `https://airtable.com/${AIRTABLE_BASE_ID}` (optional)

## CSV → Airtable field mapping

| CSV column (typical) | Airtable field |
|----------------------|----------------|
| email | Email |
| first_name | First Name |
| last_name | Last Name |
| company | Company |
| title / job_title | Title |
| phone | Phone |
| linkedin / linkedin_url | LinkedIn |
| source / lead_source | Source |
| notes | Notes |
| status | Status |
| segment | Segment |
| lead_score / score | Lead Score |

Override with env `AIRTABLE_FIELD_MAP` (JSON), e.g.:
`export AIRTABLE_FIELD_MAP='{"company":"Organization","title":"Role"}'`

## Workflow with `/find-leads`

1. Run `/find-leads` with ICP criteria → save CSV.
2. Optionally `/enrich-leads` on that CSV.
3. Run `/airtable-sync path/to/leads.csv` (this command) → leads appear in Airtable under **Elevar Master Outreach**.

## Error handling

- **401 / Invalid token**: Regenerate PAT and scopes.
- **403**: Token missing base access.
- **422 / UNKNOWN_FIELD_NAME**: Add the field in Airtable or fix `AIRTABLE_FIELD_MAP`.
- **Upsert creates duplicates**: Ensure merge field name matches exactly (e.g. `Email`) and is unique; avoid `--create-only` unless intended.
