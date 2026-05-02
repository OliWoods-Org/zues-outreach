# MAMA X autoposter — inventory status

**Status:** Not implemented inside **`zues-outreach`**. No autoposter code exists in this repo (only Reddit/X **listening** via `/social-listen`).

## Next actions (for Claude / owner)

1. Search local clones and org repos for `autopost`, `social publish`, `twitter` poster under **MAMA** or **siren-web**.
2. Document: repo path, OAuth pattern, rate limits, env vars.
3. Generalize to **`PublishQueue`** + multi-channel workers per [`ZEUS_FINAL_BUILD_PLAN.md`](ZEUS_FINAL_BUILD_PLAN.md).

If search finds nothing: treat as **greenfield** — implement queue consumer writing to `PublishLog` per [`AIRTABLE_ZEUS_SCHEMA.md`](AIRTABLE_ZEUS_SCHEMA.md).

---

*Placeholder created so Phase 0.3 has a file anchor.*
