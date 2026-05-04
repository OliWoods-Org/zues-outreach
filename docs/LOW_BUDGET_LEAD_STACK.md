# Low-budget, high-output lead stack (Zeus / Elevar)

## Clarifying “repi scraper99”

That name does not map to a single well-known product. In practice it is usually one of these:

| What you might mean | Where API keys live |
|---------------------|---------------------|
| **[RapidAPI](https://rapidapi.com)** (“repi” typo) | [rapidapi.com/developer/apps](https://rapidapi.com/developer/apps) → **Authorization** → `X-RapidAPI-Key`. Each API you subscribe to uses the **same** RapidAPI key unless the provider issues a separate key in their docs. |
| **Apify** (actors like Google Maps scrapers) | [console.apify.com](https://console.apify.com) → **Integrations** → **API token** (`https://api.apollo.io` pattern: `token=` query param). |
| **ScraperAPI / ScrapingBee / Bright Data** | Provider dashboard → project API key. |
| **99** | Often **$9.99/mo** tiers (e.g. some RapidAPI plans) or **99 requests** — check the exact API listing you subscribed to. |

**Action:** In RapidAPI, open **My Apps** → copy **Application Key**, then open the API you use (e.g. Google Maps extractor) and confirm **pricing** and **endpoint host** (`*.rapidapi.com`).

---

## Should we rely on “free” Python scrape/enrich?

| Approach | Reality |
|----------|---------|
| **DIY Python + requests + BeautifulSoup** | Low cash cost; **high** maintenance (blocks, CAPTCHAs, legal/TOS). Fine for **your own** sites or explicit permission — risky for LinkedIn/Google at scale. |
| **“Free” enrichment** | Rarely truly free at volume. Budget for **verification** (bounce risk otherwise). |
| **Official APIs** | Google Places / Maps is **paid** and licensed; not a substitute for gray scraping. |

**Recommendation:** Use **paid primitives** for discovery/enrichment (Apollo, Apify actors, RapidAPI wrappers, Hunter/LeadMagic for email) and keep Python as **glue** (CSV, Airtable, scoring) — already how `scripts/elevar_apollo_pilot.py` and `scripts/airtable-push-leads.py` work.

---

## Best low-budget, high-output stack (practical)

Ordered for **Elevar-style** US clinics / pharmacies / local businesses.

### Tier A — Highest ROI per dollar (start here)

1. **Apollo** (already in this repo)  
   - **Search** (`mixed_people/api_search`) is **free**; **bulk_match** costs credits — only enrich rows you will actually use.  
   - Good for **titles + org** (owners, medical directors, pharmacists).

2. **Google Maps lead extraction** (local clinics / pharmacies / med spas)  
   - **Apify** actors (e.g. maps business scrapers) or **RapidAPI** listings like FlyBy’s Maps extractor — **pay per run or per request**, predictable.  
   - Gets **phone, website, address**; emails often need **website crawl** (extra actor option or separate step).

3. **Airtable as system of record**  
   - `scripts/airtable-push-leads.py` — avoid duplicate tooling cost.

### Tier B — Cheap enrichment add-ons (when Apollo doesn’t give email)

- **Hunter.io** / **LeadMagic** / **Dropcontact** — free/low tiers for email finding from domain + name; **always** validate before bulk send.  
- **Neverbounce / ZeroBounce** (small batches) before Instantly — avoids burning domain reputation.

### Tier C — “Creator” / social-heavy targets

- Apollo is **weak** here; use **manual lists**, **SparkToro-style** audience tools, or **platform-native** exports where allowed.  
- **LinkedIn-profile scraping** via unofficial scrapers is **high risk** (ToS); prefer **Scrapin / Proxycurl-style** paid APIs if you need profile JSON.

### Tier D — Free-ish but narrow

- **State boards** (pharmacy, medicine) — public directories; **custom parsers**, no unified API.  
- Good for **verification**, not fast nationwide scraping.

---

## Scripts in this repo (review summary)

| Script | Cost model | Role |
|--------|------------|------|
| `scripts/elevar_apollo_pilot.py` | Apollo credits on **bulk_match** | Multi-segment B2B pull + enrich |
| `scripts/rapidapi_maps_leads.py` | RapidAPI subscription | Maps-style **local** businesses → CSV |
| `scripts/apify_maps_run.py` | Apify actor run | Same lane — **you** pick actor + input JSON |
| `scripts/enrich_hunter_gap.py` | Hunter.io credits | Domain-search email when CSV has **website** |
| `scripts/airtable-push-leads.py` | Airtable API | Upsert to **Elevar Outreach** |
| `scripts/pipeline_low_budget.sh` | Orchestrates above | Env flags: `RUN_RAPIDAPI_MAPS`, `RUN_APOLLO_PILOT`, etc. |
| Slash commands (`find-leads`, `enrich-leads`) | Operator + Apollo | Same ecosystem |

External / human tasks: [`docs/TASKS_REMAINING_EXTERNAL.md`](TASKS_REMAINING_EXTERNAL.md).

---

## Minimal monthly budget posture

1. **One** Maps/source for local density (Apify **or** RapidAPI — not five).  
2. **Apollo** — optimize **bulk_match** batch size and filters to reduce wasted credits.  
3. **One** email finder with a small free tier for gaps.  
4. **Validate** before cold email at volume.

This keeps Python as **orchestration**, not a fragile scraper farm — best balance of **low spend** and **high output** for Zeus.
