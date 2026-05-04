#!/usr/bin/env python3
"""
Run an Apify Google Maps (or similar) actor synchronously and export dataset rows to CSV.

You must subscribe to the actor in Apify and set its ID. No default actor — avoids surprise billing.

Env:
  APIFY_TOKEN          Required (https://console.apify.com → Integrations → API token)
  APIFY_MAPS_ACTOR_ID  e.g. lead.gen.labs~google-maps-business-lead-and-business-website-scraper

Input JSON for the actor can be:
  - APIFY_MAPS_INPUT_JSON='{"searchStringsArray":["compounding pharmacy"],"locationQuery":"Texas, USA","maxCrawledPlacesPerSearch":30}'
  - or --input-file path/to.json

Output columns aligned with other Zeus lead CSVs (email often empty until website crawl).
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


def main() -> int:
    parser = argparse.ArgumentParser(description="Apify actor sync run → CSV")
    parser.add_argument("--out", default="data/apify-maps-leads.csv")
    parser.add_argument("--segment", default="Clinic")
    parser.add_argument("--input-file", help="JSON file passed as actor input")
    args = parser.parse_args()

    token = (env("APIFY_TOKEN") or "").strip()
    actor = (env("APIFY_MAPS_ACTOR_ID") or "").strip()
    if not token or not actor:
        print("Set APIFY_TOKEN and APIFY_MAPS_ACTOR_ID.", file=sys.stderr)
        return 1

    if args.input_file:
        with open(args.input_file, encoding="utf-8") as f:
            input_body = json.load(f)
    else:
        raw = env("APIFY_MAPS_INPUT_JSON")
        if not raw:
            print(
                "Provide --input-file or set APIFY_MAPS_INPUT_JSON with actor-specific fields.",
                file=sys.stderr,
            )
            return 1
        input_body = json.loads(raw)

    qs = urllib.parse.urlencode({"token": token})
    actor_path = urllib.parse.quote(actor, safe="~")
    url = f"https://api.apify.com/v2/acts/{actor_path}/run-sync-get-dataset-items?{qs}"
    data = json.dumps(input_body).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=600) as resp:
            items = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        print(e.read().decode("utf-8", errors="replace")[:800], file=sys.stderr)
        return 1

    if not isinstance(items, list):
        print("Unexpected response (expected list of items).", file=sys.stderr)
        return 1

    campaign = env("AIRTABLE_CAMPAIGN", "Elevar Master Outreach") or "Elevar Master Outreach"
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
        "notes",
    ]

    with open(args.out, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
        w.writeheader()
        for item in items:
            if not isinstance(item, dict):
                continue
            website = item.get("website") or item.get("url") or ""
            addr = item.get("address") or ""
            row = {
                "email": item.get("email") or "",
                "first_name": "",
                "last_name": "",
                "company": item.get("title") or item.get("name") or "",
                "title": "",
                "phone": item.get("phone") or item.get("phoneNumber") or "",
                "website": website,
                "linkedin": "",
                "segment": args.segment,
                "lead_source": "Apify Maps actor",
                "campaign": campaign,
                "address": addr if isinstance(addr, str) else str(addr),
                "city": item.get("city") or "",
                "state": item.get("state") or "",
                "notes": json.dumps({k: item[k] for k in item if k not in ("title", "name", "phone")})[
                    :5000
                ],
            }
            w.writerow(row)

    print(f"Wrote {len(items)} rows to {args.out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
