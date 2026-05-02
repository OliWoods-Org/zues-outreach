#!/usr/bin/env python3
"""
Push lead rows from a CSV into an Airtable table for Elevar / Elevare outreach.

Uses Airtable REST API v0 with PATCH + performUpsert on Email (dedupe by email).

Required env:
  AIRTABLE_PAT          Personal access token (https://airtable.com/create/tokens)
  AIRTABLE_BASE_ID      Base ID (starts with app...)
  AIRTABLE_TABLE        Table name or table ID (e.g. Leads or tbl...)

Optional env:
  AIRTABLE_CAMPAIGN     Value written to the "Campaign" field (default: Elevar Master Outreach)
  AIRTABLE_MERGE_FIELD  Field name to merge on for upsert (default: Email)
  AIRTABLE_LOCK_TO_BASE_ID  If set, must match AIRTABLE_BASE_ID (fail-safe against wrong base)
  AIRTABLE_FORBIDDEN_BASE_IDS  Comma-separated base IDs; script refuses if AIRTABLE_BASE_ID matches any
"""

from __future__ import annotations

import argparse
import csv
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from typing import Any


def env(name: str, default: str | None = None) -> str | None:
    v = os.environ.get(name)
    return v if v not in (None, "") else default


def normalize_header(h: str) -> str:
    return h.strip().lstrip("\ufeff").lower().replace(" ", "_")


# CSV column (normalized) -> default Airtable field label
DEFAULT_MAP: dict[str, str] = {
    "email": "Email",
    "first_name": "First Name",
    "first name": "First Name",
    "lastname": "Last Name",
    "last_name": "Last Name",
    "last name": "Last Name",
    "company": "Company",
    "organization": "Company",
    "title": "Title",
    "job_title": "Title",
    "phone": "Phone",
    "linkedin": "LinkedIn",
    "linkedin_url": "LinkedIn",
    "source": "Source",
    "lead_source": "Source",
    "notes": "Notes",
    "status": "Status",
    "segment": "Segment",
    "lead_score": "Lead Score",
    "score": "Lead Score",
}


def row_to_fields(
    row: dict[str, str],
    merge_field: str,
    campaign: str | None,
    custom_map: dict[str, str],
) -> dict[str, Any]:
    """Build Airtable fields dict from one CSV row."""
    norm_row = {normalize_header(k): (v or "").strip() for k, v in row.items()}
    fields: dict[str, Any] = {}

    for key, val in norm_row.items():
        if not val:
            continue
        label = custom_map.get(key) or DEFAULT_MAP.get(key)
        if label:
            if label == "Lead Score":
                try:
                    fields[label] = int(float(val))
                except (ValueError, TypeError):
                    fields[label] = val
            else:
                fields[label] = val

    # Explicit email keys
    if "Email" not in fields:
        for ek in ("email", "e-mail", "work_email"):
            if ek in norm_row and norm_row[ek]:
                fields["Email"] = norm_row[ek]
                break

    if not fields.get("Email"):
        raise ValueError("Row missing email (need email column or Email)")

    if campaign and env("AIRTABLE_SKIP_CAMPAIGN") != "1":
        fields.setdefault("Campaign", campaign)

    # Do not send merge field empty
    if merge_field not in fields or not fields[merge_field]:
        raise ValueError(f"Merge field {merge_field!r} empty after mapping")

    return fields


def parse_field_overrides() -> dict[str, str]:
    """
    Optional env AIRTABLE_FIELD_MAP as JSON object:
    {"first_name": "First Name", "company": "Organization Name"}
    Keys are normalized CSV headers (lowercase, underscores).
    """
    raw = env("AIRTABLE_FIELD_MAP")
    if not raw:
        return {}
    try:
        data = json.loads(raw)
        if not isinstance(data, dict):
            return {}
        return {normalize_header(str(k)): str(v) for k, v in data.items()}
    except json.JSONDecodeError:
        print("Warning: AIRTABLE_FIELD_MAP is not valid JSON; ignoring.", file=sys.stderr)
        return {}


def airtable_request(
    method: str,
    url: str,
    token: str,
    body: dict[str, Any] | None,
) -> tuple[int, dict[str, Any]]:
    data = None
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }
    if body is not None:
        data = json.dumps(body).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            raw = resp.read().decode("utf-8")
            return resp.status, json.loads(raw) if raw else {}
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8", errors="replace")
        try:
            parsed = json.loads(err_body)
        except json.JSONDecodeError:
            parsed = {"error": err_body}
        raise RuntimeError(f"HTTP {e.code}: {parsed}") from None


def chunks(xs: list[Any], n: int) -> list[list[Any]]:
    return [xs[i : i + n] for i in range(0, len(xs), n)]


def validate_base_isolation(base_id: str) -> int:
    """
    Extra guards when multiple Airtable bases exist (e.g. scoring vs outreach).
    Token should still be scoped to the outreach base only in Airtable's UI.
    """
    lock = env("AIRTABLE_LOCK_TO_BASE_ID")
    if lock and lock.strip() != base_id.strip():
        print(
            "Error: AIRTABLE_BASE_ID does not match AIRTABLE_LOCK_TO_BASE_ID — "
            "refusing to run (wrong base).",
            file=sys.stderr,
        )
        return 1
    forbidden_raw = env("AIRTABLE_FORBIDDEN_BASE_IDS")
    if forbidden_raw:
        forbidden = {x.strip() for x in forbidden_raw.split(",") if x.strip()}
        if base_id.strip() in forbidden:
            print(
                "Error: AIRTABLE_BASE_ID is listed in AIRTABLE_FORBIDDEN_BASE_IDS — refusing.",
                file=sys.stderr,
            )
            return 1
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="CSV leads -> Airtable (upsert by email)")
    parser.add_argument("csv_path", help="Path to CSV (must include email column)")
    parser.add_argument("--dry-run", action="store_true", help="Parse only; no API calls")
    parser.add_argument(
        "--create-only",
        action="store_true",
        help="POST create instead of upsert (may duplicate if email exists)",
    )
    args = parser.parse_args()

    pat = env("AIRTABLE_PAT")
    base_id = env("AIRTABLE_BASE_ID")
    table = env("AIRTABLE_TABLE")
    campaign = env("AIRTABLE_CAMPAIGN", "Elevar Master Outreach")
    merge_field = env("AIRTABLE_MERGE_FIELD", "Email")

    if not args.dry_run:
        if not pat or not base_id or not table:
            print(
                "Error: set AIRTABLE_PAT, AIRTABLE_BASE_ID, and AIRTABLE_TABLE "
                "(see .env.example)",
                file=sys.stderr,
            )
            return 1

    if base_id:
        rc = validate_base_isolation(base_id)
        if rc != 0:
            return rc

    custom_map = parse_field_overrides()

    records_fields: list[dict[str, Any]] = []
    errors = 0

    with open(args.csv_path, newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        if not reader.fieldnames:
            print("Error: CSV has no header row.", file=sys.stderr)
            return 1

        for i, row in enumerate(reader, start=2):
            try:
                fields = row_to_fields(row, merge_field, campaign, custom_map)
                records_fields.append(fields)
            except ValueError as e:
                print(f"Row {i}: skip — {e}", file=sys.stderr)
                errors += 1

    if not records_fields:
        print("No valid rows to sync.", file=sys.stderr)
        return 1

    print(f"Prepared {len(records_fields)} row(s) ({errors} skipped). Campaign: {campaign!r}")
    if base_id and table:
        print(
            f"Airtable target (only this base/table is used): base={base_id} table={table!r}",
            file=sys.stderr,
        )

    if args.dry_run:
        print(json.dumps(records_fields[:3], indent=2))
        if len(records_fields) > 3:
            print(f"... and {len(records_fields) - 3} more")
        return 0

    table_enc = urllib.parse.quote(table, safe="")
    api_root = f"https://api.airtable.com/v0/{base_id}/{table_enc}"

    created = 0
    updated = 0
    batch_failed = 0

    for batch in chunks(records_fields, 10):
        payload: dict[str, Any] = {
            "records": [{"fields": fld} for fld in batch],
        }
        if not args.create_only:
            payload["performUpsert"] = {"fieldsToMergeOn": [merge_field]}

        try:
            if args.create_only:
                _, data = airtable_request("POST", api_root, pat, payload)
            else:
                _, data = airtable_request("PATCH", api_root, pat, payload)
            cr = data.get("createdRecords") or []
            ur = data.get("updatedRecords") or []
            created += len(cr)
            updated += len(ur)
            if not cr and not ur and data.get("records"):
                # Older responses may only return "records"
                created += len(data["records"])
        except RuntimeError as e:
            print(f"Batch error: {e}", file=sys.stderr)
            batch_failed += 1

    print("\nAirtable sync complete")
    print(f"  Created (new): {created}")
    if not args.create_only:
        print(f"  Updated (merge): {updated}")
    if batch_failed:
        print(f"  Failed batches: {batch_failed}", file=sys.stderr)
        return 1

    return 0


if __name__ == "__main__":
    sys.exit(main())
