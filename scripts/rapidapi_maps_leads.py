#!/usr/bin/env python3
"""
Fetch local business leads via a RapidAPI-hosted Google Maps–style API (stdlib only).

Default host matches FlyBy-style listings (override per your subscription).
See docs/LOW_BUDGET_LEAD_STACK.md.

Env:
  RAPIDAPI_KEY           Required.
  RAPIDAPI_MAPS_HOST     e.g. google-maps-extractor2.p.rapidapi.com
  RAPIDAPI_MAPS_PATH     default /locate_and_search

Example:
  export RAPIDAPI_KEY="..."
  export RAPIDAPI_MAPS_HOST="google-maps-extractor2.p.rapidapi.com"
  python3 scripts/rapidapi_maps_leads.py --query "compounding pharmacy" --country US --limit 50 --segment Pharmacy \\
    --out data/maps-pharmacy.csv
"""

from __future__ import annotations

import argparse
import csv
import json
import os
import sys
import urllib.parse
import urllib.request
from typing import Any


def env(name: str, default: str | None = None) -> str | None:
    v = os.environ.get(name)
    return v if v not in (None, "") else default


def extract_list(payload: Any) -> list[dict[str, Any]]:
    if isinstance(payload, list):
        return [x for x in payload if isinstance(x, dict)]
    if not isinstance(payload, dict):
        return []
    for key in ("data", "businesses", "results", "items", "records", "places"):
        v = payload.get(key)
        if isinstance(v, list):
            return [x for x in v if isinstance(x, dict)]
    # nested data.businesses etc.
    inner = payload.get("data")
    if isinstance(inner, dict):
        for key in ("businesses", "results", "items"):
            v = inner.get(key)
            if isinstance(v, list):
                return [x for x in v if isinstance(x, dict)]
    return []


def flatten_business(b: dict[str, Any]) -> dict[str, str]:
    """Map heterogeneous API shapes to our CSV columns."""
    name = (
        b.get("title")
        or b.get("name")
        or b.get("business_name")
        or b.get("displayName")
        or ""
    )
    phone = (
        b.get("phone")
        or b.get("formatted_phone_number")
        or b.get("nationalPhoneNumber")
        or ""
    )
    website = b.get("website") or b.get("websiteUri") or b.get("url") or ""
    if isinstance(website, dict):
        website = website.get("uri") or website.get("url") or ""
    addr = b.get("address") or b.get("formatted_address") or ""
    if isinstance(addr, dict):
        addr = addr.get("formatted_address") or addr.get("streetAddress") or json.dumps(addr)
    city = b.get("city") or ""
    state = b.get("state") or b.get("administrative_area_level_1") or ""
    rating = b.get("rating") or b.get("aggregateRating") or ""
    if isinstance(rating, dict):
        rating = rating.get("ratingValue") or ""
    maps_link = b.get("url") or b.get("maps_url") or b.get("google_maps_url") or ""
    place_id = b.get("place_id") or b.get("placeId") or b.get("id") or ""
    return {
        "company": str(name).strip(),
        "phone": str(phone).strip(),
        "website": str(website).strip(),
        "address": str(addr).strip(),
        "city": str(city).strip(),
        "state": str(state).strip(),
        "rating": str(rating).strip(),
        "maps_url": str(maps_link).strip(),
        "place_id": str(place_id).strip(),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="RapidAPI Maps-style lead export → CSV")
    parser.add_argument("--query", required=True, help="Maps search query")
    parser.add_argument("--country", default="US")
    parser.add_argument("--limit", type=int, default=50, help="Cap rows written")
    parser.add_argument("--segment", default="Clinic", help="Written to Segment column")
    parser.add_argument("--out", default="data/maps-leads.csv")
    parser.add_argument("--dry-run", action="store_true", help="Print parsed count only")
    args = parser.parse_args()

    api_key = env("RAPIDAPI_KEY", "").strip() if env("RAPIDAPI_KEY") else ""
    host = env("RAPIDAPI_MAPS_HOST", "google-maps-extractor2.p.rapidapi.com")
    path = env("RAPIDAPI_MAPS_PATH", "/locate_and_search")

    if not api_key and not args.dry_run:
        print("Set RAPIDAPI_KEY (and optionally RAPIDAPI_MAPS_HOST / RAPIDAPI_MAPS_PATH).", file=sys.stderr)
        return 1

    params = {
        "query": args.query,
        "country": args.country,
        "limit": str(min(args.limit, 100)),
    }
    # Some APIs use language / zoom — allow override via env JSON
    extra = env("RAPIDAPI_MAPS_PARAMS_JSON")
    if extra:
        try:
            params.update(json.loads(extra))
        except json.JSONDecodeError:
            print("Invalid RAPIDAPI_MAPS_PARAMS_JSON", file=sys.stderr)
            return 1

    qs = urllib.parse.urlencode(params)
    url = f"https://{host}{path}?{qs}"

    if args.dry_run:
        print(f"Would GET {url[:120]}...")
        return 0

    req = urllib.request.Request(
        url,
        headers={
            "X-RapidAPI-Key": api_key,
            "X-RapidAPI-Host": host,
            "Accept": "application/json",
        },
        method="GET",
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            raw = resp.read().decode("utf-8")
            payload = json.loads(raw) if raw else {}
    except urllib.error.HTTPError as e:
        print(f"HTTP {e.code}: {e.read().decode('utf-8', errors='replace')[:500]}", file=sys.stderr)
        return 1

    rows_raw = extract_list(payload)
    rows: list[dict[str, str]] = []
    for b in rows_raw[: args.limit]:
        flat = flatten_business(b)
        flat["email"] = ""
        flat["first_name"] = ""
        flat["last_name"] = ""
        flat["title"] = ""
        flat["linkedin"] = ""
        flat["segment"] = args.segment
        flat["lead_source"] = "RapidAPI Maps"
        flat["campaign"] = env("AIRTABLE_CAMPAIGN", "Elevar Master Outreach") or "Elevar Master Outreach"
        flat["notes"] = ""
        rows.append(flat)

    os.makedirs(os.path.dirname(os.path.abspath(args.out)) or ".", exist_ok=True)
    fieldnames = [
        "email",
        "first_name",
        "last_name",
        "company",
        "title",
        "phone",
        "website",
        "linkedin",
        "segment",
        "lead_source",
        "campaign",
        "address",
        "city",
        "state",
        "rating",
        "maps_url",
        "place_id",
        "notes",
    ]
    with open(args.out, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
        w.writeheader()
        for r in rows:
            w.writerow(r)

    print(f"Wrote {len(rows)} rows to {args.out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
