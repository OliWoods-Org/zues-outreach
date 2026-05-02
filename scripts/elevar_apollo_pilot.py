#!/usr/bin/env python3
"""
Elevar pilot: fetch ~N leads across Segment types (Clinic, Pharmacy, Creator) via Apollo,
dedupe, bulk-enrich, write CSV + summary stats.

Requires:
  export APOLLO_API_KEY="..."   # Master API key with mixed_people/api_search + people/bulk_match

Search is free; bulk_match consumes enrichment credits per Apollo plan.

Usage:
  python3 scripts/elevar_apollo_pilot.py
  python3 scripts/elevar_apollo_pilot.py --limit 100 --out data/elevar-pilot-100.csv
  python3 scripts/elevar_apollo_pilot.py --search-only          # no enrichment (no credits)
"""

from __future__ import annotations

import argparse
import csv
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from typing import Any

APOLLO_BASE = "https://api.apollo.io/api/v1"

# Rough split for 100 total — adjust as needed
DEFAULT_SHARES = (
    ("Clinic", 40),
    ("Pharmacy", 35),
    ("Creator", 25),
)

SEARCH_PROFILES: dict[str, dict[str, Any]] = {
    "Clinic": {
        "organization_locations": ["United States"],
        "organization_num_employees_ranges": ["1,10", "11,50", "51,200"],
        "person_titles": [
            "Medical Director",
            "Owner",
            "Practice Manager",
            "Chief Medical Officer",
            "Physician",
        ],
        "person_seniorities": ["owner", "founder", "c_suite", "vp", "head", "director", "manager"],
        "q_keywords": "wellness clinic hormone testosterone TRT",
        "include_similar_titles": True,
    },
    "Pharmacy": {
        "organization_locations": ["United States"],
        "organization_num_employees_ranges": ["1,10", "11,50", "51,500"],
        "person_titles": [
            "Owner",
            "Pharmacist",
            "Pharmacy Manager",
            "President",
            "Director",
        ],
        "person_seniorities": ["owner", "founder", "c_suite", "vp", "head", "director", "manager"],
        "q_keywords": "compounding pharmacy specialty pharmacy",
        "include_similar_titles": True,
    },
    "Creator": {
        "organization_locations": ["United States"],
        "organization_num_employees_ranges": ["1,10", "11,50"],
        "person_titles": [
            "Founder",
            "Content Creator",
            "Owner",
            "Brand Partnerships",
            "Marketing Director",
        ],
        "person_seniorities": ["owner", "founder", "c_suite", "vp", "head", "director", "manager"],
        "q_keywords": "wellness fitness health creator influencer",
        "include_similar_titles": True,
    },
}


def apollo_headers(api_key: str) -> dict[str, str]:
    return {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        "Accept": "application/json",
        "X-Api-Key": api_key,
    }


def api_post(path: str, api_key: str, body: dict[str, Any]) -> dict[str, Any]:
    url = f"{APOLLO_BASE}{path}"
    data = json.dumps(body).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=apollo_headers(api_key), method="POST")
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            raw = resp.read().decode("utf-8")
            return json.loads(raw) if raw else {}
    except urllib.error.HTTPError as e:
        err = e.read().decode("utf-8", errors="replace")
        try:
            parsed = json.loads(err)
        except json.JSONDecodeError:
            parsed = {"raw": err}
        raise RuntimeError(f"HTTP {e.code}: {parsed}") from None


def search_people(api_key: str, segment: str, per_page: int, page: int = 1) -> dict[str, Any]:
    profile = SEARCH_PROFILES[segment].copy()
    profile["page"] = page
    profile["per_page"] = min(per_page, 100)
    return api_post("/mixed_people/api_search", api_key, profile)


def bulk_match(
    api_key: str,
    person_ids: list[str],
    *,
    waterfall_email: bool = True,
    reveal_personal_emails: bool = False,
) -> dict[str, Any]:
    details = [{"id": pid} for pid in person_ids]
    qs = urllib.parse.urlencode(
        {
            "run_waterfall_email": str(waterfall_email).lower(),
            "reveal_personal_emails": str(reveal_personal_emails).lower(),
        }
    )
    url_path = f"/people/bulk_match?{qs}"
    return api_post(url_path, api_key, {"details": details})


def chunks(xs: list[str], n: int) -> list[list[str]]:
    return [xs[i : i + n] for i in range(0, len(xs), n)]


def collect_targets(api_key: str, limit: int, shares: list[tuple[str, int]]) -> list[tuple[str, str]]:
    """Return list of (apollo_person_id, segment)."""
    collected: list[tuple[str, str]] = []
    seen: set[str] = set()
    per_seg: dict[str, int] = {seg: 0 for seg, _ in shares}

    for segment, quota in shares:
        page = 1
        while per_seg[segment] < quota and len(collected) < limit and page <= 6:
            need = min(quota - per_seg[segment], limit - len(collected))
            if need <= 0:
                break
            per_req = min(100, need + 25)
            try:
                data = search_people(api_key, segment, per_page=per_req, page=page)
            except RuntimeError as e:
                print(f"Search error [{segment}] page {page}: {e}", file=sys.stderr)
                break
            people = data.get("people") or []
            if not people:
                print(f"No results [{segment}] page {page}", file=sys.stderr)
                break
            for p in people:
                pid = p.get("id")
                if not pid or pid in seen:
                    continue
                seen.add(pid)
                collected.append((pid, segment))
                per_seg[segment] += 1
                if per_seg[segment] >= quota or len(collected) >= limit:
                    break
            page += 1
            time.sleep(0.35)

    return collected[:limit]


def flatten_match(m: dict[str, Any]) -> dict[str, Any]:
    org = m.get("organization") or {}
    company = ""
    org_phone = None
    if isinstance(org, dict):
        company = org.get("name") or ""
        pp = org.get("primary_phone")
        org_phone = pp.get("number") if isinstance(pp, dict) else org.get("sanitized_phone") or org.get("phone")
    if not company:
        for job in m.get("employment_history") or []:
            if job.get("current") and job.get("organization_name"):
                company = job.get("organization_name") or ""
                break
    phone = None
    pns = m.get("phone_numbers")
    if isinstance(pns, list) and pns:
        phone = pns[0].get("raw_number") if isinstance(pns[0], dict) else None
    if not phone:
        phone = m.get("mobile_phone") or m.get("direct_phone") or org_phone
    return {
        "apollo_id": m.get("id"),
        "email": m.get("email") or "",
        "first_name": m.get("first_name") or "",
        "last_name": m.get("last_name") or "",
        "title": m.get("title") or "",
        "company": company,
        "phone": phone or "",
        "linkedin_url": m.get("linkedin_url") or "",
        "city": m.get("city") or "",
        "state": m.get("state") or "",
        "email_status": m.get("email_status") or "",
        "headline": m.get("headline") or "",
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Elevar Apollo pilot: multi-segment search + enrich")
    parser.add_argument("--limit", type=int, default=100, help="Total leads (deduped)")
    parser.add_argument(
        "--out",
        default="data/elevar-pilot-100.csv",
        help="Output CSV path",
    )
    parser.add_argument("--search-only", action="store_true", help="Skip bulk_match (no credits)")
    parser.add_argument(
        "--reveal-personal-email",
        action="store_true",
        help="Pass reveal_personal_emails=true (may cost more)",
    )
    args = parser.parse_args()

    api_key = os.environ.get("APOLLO_API_KEY", "").strip()
    if not api_key:
        print(
            "Missing APOLLO_API_KEY. Add to ~/.elevare-env:\n"
            '  export APOLLO_API_KEY="your_master_key"\n'
            "Apollo.io → Settings → API → create a key with api_search + bulk_match access.",
            file=sys.stderr,
        )
        return 1

    def split_limit(n: int) -> list[tuple[str, int]]:
        props = [("Clinic", 0.40), ("Pharmacy", 0.35), ("Creator", 0.25)]
        counts = [int(n * p) for _, p in props]
        i = 0
        while sum(counts) < n:
            counts[i % 3] += 1
            i += 1
        j = 2
        while sum(counts) > n and j >= 0:
            if counts[j] > 0:
                counts[j] -= 1
            j -= 1
        return [(props[k][0], counts[k]) for k in range(3)]

    shares = split_limit(args.limit)

    print(f"Target limit={args.limit}, per-segment quotas: {shares}")

    pairs = collect_targets(api_key, args.limit, shares)
    print(f"Collected {len(pairs)} unique Apollo person IDs.")

    rows_out: list[dict[str, Any]] = []

    if args.search_only:
        print("search-only: IDs only (no enrichment credits). Re-run without --search-only to enrich.")
        for pid, seg in pairs:
            rows_out.append(
                {
                    "segment": seg,
                    "apollo_person_id": pid,
                    "email": "",
                    "first_name": "",
                    "last_name": "",
                    "company": "",
                    "title": "",
                    "phone": "",
                    "linkedin_url": "",
                    "city": "",
                    "state": "",
                    "email_status": "",
                    "headline": "",
                    "lead_source": "Apollo api_search",
                    "campaign": "Elevar Master Outreach",
                }
            )
    else:
        ids = [p[0] for p in pairs]
        seg_map = {p[0]: p[1] for p in pairs}
        all_matches: list[dict[str, Any]] = []
        for batch in chunks(ids, 10):
            try:
                data = bulk_match(
                    api_key,
                    batch,
                    waterfall_email=True,
                    reveal_personal_emails=args.reveal_personal_email,
                )
            except RuntimeError as e:
                print(f"bulk_match error: {e}", file=sys.stderr)
                time.sleep(2)
                continue
            matches = data.get("matches") or []
            all_matches.extend(matches)
            print(f"  enriched batch: {len(matches)}/{len(batch)} matches")
            time.sleep(0.65)

        for m in all_matches:
            flat = flatten_match(m)
            pid = flat.get("apollo_id")
            flat["segment"] = seg_map.get(pid, "Other")
            flat["lead_source"] = "Apollo pilot"
            flat["campaign"] = "Elevar Master Outreach"
            rows_out.append(flat)

    os.makedirs(os.path.dirname(os.path.abspath(args.out)) or ".", exist_ok=True)
    fieldnames = [
        "segment",
        "email",
        "first_name",
        "last_name",
        "company",
        "title",
        "phone",
        "linkedin_url",
        "city",
        "state",
        "email_status",
        "lead_source",
        "campaign",
        "apollo_person_id",
        "headline",
    ]
    with open(args.out, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
        w.writeheader()
        for row in rows_out:
            w.writerow({k: row.get(k, "") for k in fieldnames})

    # Summary
    def pct(n: int, d: int) -> str:
        return f"{100 * n / d:.0f}%" if d else "n/a"

    n = len(rows_out)
    with_email = sum(1 for r in rows_out if (r.get("email") or "").strip())
    with_phone = sum(1 for r in rows_out if (r.get("phone") or "").strip())
    with_li = sum(1 for r in rows_out if (r.get("linkedin_url") or "").strip())

    by_seg: dict[str, int] = {}
    for r in rows_out:
        by_seg[r.get("segment", "?")] = by_seg.get(r.get("segment", "?"), 0) + 1

    print("\n=== Pilot summary ===")
    print(f"Output: {args.out}")
    print(f"Rows: {n}")
    print(f"With email: {with_email} ({pct(with_email, n)})")
    print(f"With phone: {with_phone} ({pct(with_phone, n)})")
    print(f"With LinkedIn URL: {with_li} ({pct(with_li, n)})")
    print("By segment:", json.dumps(by_seg, indent=2))

    return 0


if __name__ == "__main__":
    sys.exit(main())
