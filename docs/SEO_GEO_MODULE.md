# SEO / GEO module (Zeus) — plan

**GEO** (generative engine optimization): content and structured data aimed at **AI overview / LLM citation** surfaces, not only classic blue-link SEO.

## Pillars

| Pillar | Function |
|--------|----------|
| **Keyword & topic planning** | Research agents → `KeywordPlans` / calendar rows in Airtable; tie to **Listen** trends. |
| **Organic content** | Brief → draft → approve → publish; **BrandProfiles** constrains voice. |
| **Entity & citation** | FAQs, About, Methodology pages; schema.org; clear attributable facts (GEO). |
| **Backlinks (compliant)** | Prospect list + **personalized** outreach (same ethics as email — no spam); track in **`OutreachLog`** / dedicated **`BacklinkTargets`** table. |

## Suggested Airtable tables (add to pilot base)

| Table | Purpose |
|-------|---------|
| **KeywordPlans** | Keyword, intent, priority, Product link, status |
| **ContentBriefs** | Title, outline, target URL, owner, approval |
| **PublishedURLs** | URL, indexed?, citations noted |
| **BacklinkTargets** | Domain, DR estimate, contact, status, **no automated comment spam** |

## Automation boundaries

- **Do:** rank briefs, generate drafts for review, schedule posts to `PublishQueue`, log placements.
- **Don’t:** bulk automated comments, link farms, or misrepresented outreach — compliance risk.

## Integration

- **Growth Brain** consumes **PhrasePerformance** + **TrendPosts** to rank SEO angles.
- **Notebook LLM** research outputs link as rows in **ContentBriefs**.

See also [`ZEUS_OUTREACH_PLAN.md`](ZEUS_OUTREACH_PLAN.md) §17–§18.
