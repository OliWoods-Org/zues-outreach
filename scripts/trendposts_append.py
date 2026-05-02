#!/usr/bin/env python3
"""
Append or upsert social listen rows into Airtable TrendPosts (or SocialListenLog).

Dedupe: single merge field **Dedupe Key** = "{platform}|{external_post_id}" (normalized).

Env:
  AIRTABLE_PAT, AIRTABLE_BASE_ID
  AIRTABLE_TABLE_TRENDPOSTS   (default: TrendPosts)
  AIRTABLE_MERGE_FIELD_TREND  (default: Dedupe Key)

Input CSV columns (case-insensitive; spaces ok):
  platform, external_post_id, post_url, text, author_handle, captured_at
Optional: product (single line — must match linked record id if using link field; omit if not used)

See docs/AIRTABLE_ZEUS_SCHEMA.md — add field **Dedupe Key** (single line) as merge target.

Usage:
  python3 scripts/trendposts_append.py sample-trendposts.csv --dry-run
  python3 scripts/trendposts_append.py trendposts.csv
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


def norm(s: str) -> str:
    return s.strip().lstrip("\ufeff").lower().replace(" ", "_")


def airtable_patch(
    base_id: str,
    table: str,
    pat: str,
    records_fields: list[dict[str, Any]],
    merge_field: str,
) -> tuple[int, int, int]:
    """Returns created, updated, failed_batches."""
    table_enc = urllib.parse.quote(table, safe="")
    api_root = f"https://api.airtable.com/v0/{base_id}/{table_enc}"
    created = updated = failed = 0
    for i in range(0, len(records_fields), 10):
        batch = records_fields[i : i + 10]
        payload: dict[str, Any] = {
            "records": [{"fields": f} for f in batch],
            "performUpsert": {"fieldsToMergeOn": [merge_field]},
        }
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            api_root,
            data=data,
            headers={
                "Authorization": f"Bearer {pat}",
                "Content-Type": "application/json",
            },
            method="PATCH",
        )
        try:
            with urllib.request.urlopen(req, timeout=120) as resp:
                raw = resp.read().decode("utf-8")
                out = json.loads(raw) if raw else {}
            cr = out.get("createdRecords") or []
            ur = out.get("updatedRecords") or []
            created += len(cr)
            updated += len(ur)
        except urllib.error.HTTPError as e:
            err = e.read().decode("utf-8", errors="replace")
            print(f"HTTP {e.code}: {err}", file=sys.stderr)
            failed += 1
    return created, updated, failed


def row_to_fields(row: dict[str, str], merge_field_name: str) -> dict[str, Any]:
    r = {norm(k): (v or "").strip() for k, v in row.items()}
    platform = r.get("platform", "")
    ext_id = r.get("external_post_id", "")
    if not platform or not ext_id:
        raise ValueError("need platform and external_post_id")
    dedupe = f"{platform.lower()}|{ext_id}"
    fields: dict[str, Any] = {
        merge_field_name: dedupe,
        "Platform": platform,
        "External post ID": ext_id,
    }
    if r.get("post_url"):
        fields["Post URL"] = r["post_url"]
    if r.get("text"):
        fields["Text"] = r["text"]
    if r.get("author_handle"):
        fields["Author handle"] = r["author_handle"]
    if r.get("captured_at"):
        fields["Captured at"] = r["captured_at"]
    return fields


def main() -> int:
    ap = argparse.ArgumentParser(description="TrendPosts CSV → Airtable upsert")
    ap.add_argument("csv_path", help="CSV with platform, external_post_id, ...")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    merge_field = env("AIRTABLE_MERGE_FIELD_TREND", "Dedupe Key")
    table = env("AIRTABLE_TABLE_TRENDPOSTS", "TrendPosts")
    pat = env("AIRTABLE_PAT")
    base_id = env("AIRTABLE_BASE_ID")

    rows_out: list[dict[str, Any]] = []
    bad = 0
    with open(args.csv_path, newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        if not reader.fieldnames:
            print("No CSV header", file=sys.stderr)
            return 1
        for i, row in enumerate(reader, start=2):
            try:
                rows_out.append(row_to_fields(row, merge_field))
            except ValueError as e:
                print(f"Row {i}: {e}", file=sys.stderr)
                bad += 1

    if not rows_out:
        print("No valid rows.", file=sys.stderr)
        return 1

    print(f"Prepared {len(rows_out)} row(s), skipped {bad}. Table={table!r} merge={merge_field!r}")
    if args.dry_run:
        print(json.dumps(rows_out[:5], indent=2))
        return 0

    if not pat or not base_id:
        print("Set AIRTABLE_PAT and AIRTABLE_BASE_ID", file=sys.stderr)
        return 1

    c, u, failed = airtable_patch(base_id, table, pat, rows_out, merge_field)
    print(f"Created: {c}  Updated: {u}  Failed batches: {failed}")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
