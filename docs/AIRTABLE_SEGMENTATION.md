# Airtable segmentation — per-product bases + PATs

## Principle

**Do not** merge all commercial lines into one mega-base. Permissions blur; reporting degrades.

## Practice

- **One outreach / Zeus base per commercial product line** (Elevar, Siren, MAMA product SKUs, etc.) — see [`ZEUS_OUTREACH_PLAN.md`](ZEUS_OUTREACH_PLAN.md) §1, §4.
- **Sell Zeus as one package**; **operate** with **segmented bases** + optional **shared lead pool** only where contractually agreed (e.g. Castello ↔ P/ART).

## PATs

- **One PAT per base** (or stricter workspace policy) — never “all bases” for production automation.
- Document base ID in env (`AIRTABLE_BASE_ID`) per deployment — [`commands/airtable-sync.md`](../commands/airtable-sync.md).

## Optional

Small **agency roster** base (partners, media, affiliates) — **not** a replacement for product-specific **`Leads`**.

## Dashboard

Mission Control is the **unified lens**; Airtable remains **system of record** per brand via scoped credentials.
