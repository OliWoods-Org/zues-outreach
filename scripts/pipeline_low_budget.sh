#!/usr/bin/env bash
# Low-budget Elevar pipeline glue (optional steps — enable what you have keys for).
# shellcheck disable=SC1091
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

# Prefer ~/.zeus-env then legacy ~/.elevare-env
if [[ -f "$HOME/.zeus-env" ]]; then source "$HOME/.zeus-env"
elif [[ -f "$HOME/.elevare-env" ]]; then source "$HOME/.elevare-env"
fi

MAPS_OUT="${MAPS_OUT:-data/maps-leads.csv}"
APOLLO_OUT="${APOLLO_OUT:-data/elevar-pilot-100.csv}"
ENRICHED_OUT="${ENRICHED_OUT:-data/leads-enriched-for-airtable.csv}"

echo "=== Zeus low-budget pipeline (repo: $ROOT) ==="

if [[ "${RUN_RAPIDAPI_MAPS:-0}" == "1" ]]; then
  echo "[1/4] RapidAPI Maps → $MAPS_OUT"
  python3 scripts/rapidapi_maps_leads.py --query "${MAPS_QUERY:?set MAPS_QUERY}" --country "${MAPS_COUNTRY:-US}" \
    --limit "${MAPS_LIMIT:-50}" --segment "${MAPS_SEGMENT:-Clinic}" --out "$MAPS_OUT"
else
  echo "[1/4] SKIP RapidAPI Maps (set RUN_RAPIDAPI_MAPS=1 + MAPS_QUERY + RAPIDAPI_KEY)"
fi

if [[ "${RUN_APOLLO_PILOT:-0}" == "1" ]]; then
  echo "[2/4] Apollo pilot → $APOLLO_OUT"
  python3 scripts/elevar_apollo_pilot.py --limit "${APOLLO_LIMIT:-100}" --out "$APOLLO_OUT"
else
  echo "[2/4] SKIP Apollo pilot (set RUN_APOLLO_PILOT=1 + APOLLO_API_KEY)"
fi

# Pick primary CSV for enrichment / Airtable
PRIMARY="${PRIMARY_CSV:-}"
if [[ -z "$PRIMARY" ]]; then
  if [[ -f "$APOLLO_OUT" ]] && [[ "${RUN_APOLLO_PILOT:-0}" == "1" ]]; then PRIMARY="$APOLLO_OUT"
  elif [[ -f "$MAPS_OUT" ]]; then PRIMARY="$MAPS_OUT"
  else
    echo "No PRIMARY_CSV and no generated file — set PRIMARY_CSV=path/to/leads.csv"
    exit 1
  fi
fi

if [[ "${RUN_HUNTER_GAP:-0}" == "1" ]]; then
  echo "[3/4] Hunter gap-fill → $ENRICHED_OUT"
  python3 scripts/enrich_hunter_gap.py "$PRIMARY" --out "$ENRICHED_OUT"
  PRIMARY="$ENRICHED_OUT"
else
  echo "[3/4] SKIP Hunter (set RUN_HUNTER_GAP=1 + HUNTER_API_KEY)"
fi

if [[ "${RUN_AIRTABLE_PUSH:-0}" == "1" ]]; then
  echo "[4/4] Airtable upsert"
  python3 scripts/airtable-push-leads.py "$PRIMARY"
else
  echo "[4/4] SKIP Airtable (set RUN_AIRTABLE_PUSH=1 + AIRTABLE_* env)"
fi

echo "Done. Primary artifact: $PRIMARY"
