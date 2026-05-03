#!/usr/bin/env python3
"""
Fill missing emails using Hunter.io domain search when `website` or derivable domain exists.

Does not guess personal emails without domain — keeps spend predictable.

Env:
  HUNTER_API_KEY  https://hunter.io/api-keys

Usage:
  python3 scripts/enrich_hunter_gap.py data/maps-leads.csv --out data/maps-leads-enriched.csv

Rate: ~2 req/s default sleep (Hunter free tier friendly).
"""

from __future__ import annotations

import argparse
import csv
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from typing import Any


def env(name: str) -> str | None:
    v = os.environ.get(name)
    return v if v else None


DOMAIN_RE = re.compile(r"([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}")


def domain_from_url(url: str) -> str | None:
    if not url or not url.strip():
        return None
    u = url.strip()
    if not u.startswith(("http://", "https://")):
        u = "https://" + u
    try:
        from urllib.parse import urlparse

        netloc = urlparse(u).netloc.lower()
        if netloc.startswith("www."):
            netloc = netloc[4:]
        return netloc or None
    except Exception:
        m = DOMAIN_RE.search(url)
        return m.group(0).lower() if m else None


def hunter_domain_search(api_key: str, domain: str, limit: int = 5) -> list[dict[str, Any]]:
    qs = urllib.parse.urlencode(
        {"domain": domain, "api_key": api_key, "limit": limit}
    )
    url = f"https://api.hunter.io/v2/domain-search?{qs}"
    req = urllib.request.Request(url, method="GET")
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        raise RuntimeError(e.read().decode("utf-8", errors="replace")[:400]) from None
    emails = (data.get("data") or {}).get("emails") or []
    return emails if isinstance(emails, list) else []


def pick_best_email(emails: list[dict[str, Any]]) -> tuple[str, str]:
    """Return (email, confidence/score note)."""
    if not emails:
        return "", ""
    best = None
    best_score = -1.0
    for e in emails:
        if not isinstance(e, dict):
            continue
        val = e.get("value") or e.get("email")
        if not val:
            continue
        conf = e.get("confidence")
        try:
            score = float(conf) if conf is not None else 0.0
        except (TypeError, ValueError):
            score = 0.0
        if e.get("first_name") or e.get("last_name"):
            score += 5
        if score > best_score:
            best_score = score
            best = val
    if best:
        return best, str(int(best_score))
    first = emails[0]
    return (first.get("value") or first.get("email") or "", "first")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("csv_path")
    parser.add_argument("--out", default="")
    parser.add_argument("--sleep", type=float, default=0.55)
    parser.add_argument("--limit-per-domain", type=int, default=5)
    args = parser.parse_args()

    api_key = (env("HUNTER_API_KEY") or "").strip()
    if not api_key:
        print("Set HUNTER_API_KEY.", file=sys.stderr)
        return 1

    out_path = args.out or args.csv_path.replace(".csv", "-hunter.csv")

    rows: list[dict[str, str]] = []
    with open(args.csv_path, newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        fieldnames = list(reader.fieldnames or [])
        for row in reader:
            rows.append(dict(row))

    if "email" not in fieldnames:
        fieldnames.append("email")
    if "hunter_note" not in fieldnames:
        fieldnames.append("hunter_note")

    filled = 0
    skipped_has_email = 0
    skipped_no_domain = 0
    errors = 0

    for row in rows:
        existing = (row.get("email") or "").strip()
        if existing:
            skipped_has_email += 1
            row.setdefault("hunter_note", "")
            continue
        dom = domain_from_url(row.get("website") or "")
        if not dom:
            skipped_no_domain += 1
            row.setdefault("hunter_note", "no_domain")
            continue
        try:
            emails = hunter_domain_search(api_key, dom, args.limit_per_domain)
            email, note = pick_best_email(emails)
            if email:
                row["email"] = email
                row["hunter_note"] = f"hunter_domain:{note}"
                filled += 1
            else:
                row.setdefault("hunter_note", "hunter_empty")
        except RuntimeError as e:
            row.setdefault("hunter_note", f"error:{str(e)[:80]}")
            errors += 1
        time.sleep(args.sleep)

    with open(out_path, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
        w.writeheader()
        for row in rows:
            w.writerow({k: row.get(k, "") for k in fieldnames})

    print(f"Output: {out_path}")
    print(f"Filled emails: {filled} | skipped (had email): {skipped_has_email} | no domain: {skipped_no_domain} | errors: {errors}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
