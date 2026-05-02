# Zeus Web (Growth OS UI)

Vite + React app: **Siren-style glass / cross-hatch visual system**, **Zeus** product identity. The frozen style reference lives in `snapshots/siren-ui-reference/` (see that folder’s README for the source commit).

## Run locally

```bash
cd apps/zeus-web
npm install
npm run dev
```

Default Vite port is **5173** (same as a local Siren dev server — only run one at a time, or set `port` in `vite.config.ts`).

## Build

```bash
npm run build
```

## Routes (stubs + existing Siren-origin pages)

- **Listen, Target, Publish, Brand kit, Affiliates, Briefings** — `ModuleStub` placeholders wired for a single future implementation pass.
- **Mission Control, campaigns, pipeline, analytics, scripts, chat, settings, guard** — full pages from the forked UI.

## Ten parallel workstreams (one owner each)

Use these as separate PRs or agent threads so the “all Zeus in one UI” path stays one codebase without blocking:

1. **Airtable + env** — wire read/write to tables from `docs/AIRTABLE_ZEUS_SCHEMA.md`.
2. **Listen** — TrendPosts / social listen → Airtable + `scripts/trendposts_append.py` patterns.
3. **Target** — ICP, lists, lead score, sync with `zues-outreach` lead scripts.
4. **Publish** — queue UI for approved posts (Meta / X / Threads as you add them).
5. **Brand kit** — assets, voice, GEO snippets.
6. **Affiliates** — tracking links, payouts view (even if mock first).
7. **Briefings** — weekly / Growth Brain summary surface.
8. **TNT / Mission Control** — optional FastAPI sidecar or deep links to TNT `GET /docs` (see `docs/TNT_LOCAL_PREVIEW.md`).
9. **Auth & workspace** — replace `data/operations` mocks with real workspace.
10. **Polish** — empty states, loading, and Zeus copy pass (keep CSS tokens `siren-*` as design names until a token rename pass if desired).
