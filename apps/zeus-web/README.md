# Zeus Web (Growth OS UI)

Vite + React app: **Siren-style glass / cross-hatch visual system**, **Zeus** product identity. The frozen style reference lives in `snapshots/siren-ui-reference/` (see that folder’s README for the source commit).

Strategy IA: [`docs/ZEUS_MISSION_CONTROL_IA.md`](../../docs/ZEUS_MISSION_CONTROL_IA.md).

**Visual / mood art (Midjourney):** [`docs/ZEUS_UI_MIDJOURNEY_REFERENCE.md`](../../docs/ZEUS_UI_MIDJOURNEY_REFERENCE.md) — backgrounds and glass references aligned to `tailwind.config.js` / `src/index.css`; implement in code, not as screenshots.

**Mobile:** [`docs/ZEUS_MOBILE_UX_PLAN.md`](docs/ZEUS_MOBILE_UX_PLAN.md) · [`docs/ZEUS_MOBILE_VISUAL_AUDIT.md`](docs/ZEUS_MOBILE_VISUAL_AUDIT.md) — safe-area utilities in `src/index.css`, `xs:475px` in `tailwind.config.js`.

**Assistants:** Growth coach vs Defense assistant · [`docs/CHAT_AND_ASSISTANT_BACKLOG.md`](docs/CHAT_AND_ASSISTANT_BACKLOG.md) (chat page has “Wrong assistant?” mode switch). E2E: `npm run test:e2e` (starts Vite on port 5187; avoids colliding with another app on 5173).

**Relay + Chat APIs:** [`docs/RELAY_AND_CHAT_API.md`](docs/RELAY_AND_CHAT_API.md) · local mock: `npm run mock:api` (port 8788) + `VITE_ZEUS_RELAY_API_URL` / `VITE_ZEUS_CHAT_API_URL` in `.env.local`.

**CI:** `.github/workflows/zeus-web-ci.yml` — build, lint, Playwright on pushes/PRs touching `apps/zeus-web`.

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

## Routes

| Area | Routes | Notes |
|------|--------|--------|
| **Lanes** | `/listen`, `/target`, `/engage`, `/convert`, `/report` | Listen + tiers UI; Engage/Convert/Report stubs |
| **Growth** | `/publish`, `/influencers`, `/brand`, `/brand/wizard`, `/affiliates`, `/marketplace`, `/briefings` | Affiliates + Briefings have richer mocks |
| **PPC — TNT** | `/ppc`, `/ppc/:agentId` | Adam PPC agents · [`tntPpcAgents.ts`](src/data/tntPpcAgents.ts) |
| **Social** | `/social/activity`, `/social/autopost`, `/social/replies` | Activity tracker mock |
| **Voice** | `/campaigns`, `/pipeline`, `/analytics`, `/scripts`, `/settings` | Outbound + dial; **Growth coach** is under **Mission** (`/chat`) |
| **Guard** | `/guard` | Guard mode |

## Ten parallel workstreams (one owner each)

1. **Airtable + env** — wire read/write to tables from `docs/AIRTABLE_ZEUS_SCHEMA.md`.
2. **Listen** — TrendPosts / social listen → Airtable + `scripts/trendposts_append.py` patterns.
3. **Target** — ICP, lists, lead score, sync with `zues-outreach` lead scripts.
4. **Publish** — queue UI for approved posts (Meta / X / Threads as you add them).
5. **Brand kit** — assets, voice, GEO snippets; wizard at `/brand/wizard`.
6. **Affiliates** — programs + RewardsQueue UI stub + `docs/AFFILIATE_MODULE.md`.
7. **Briefings** — Growth Brain suggestions stub + `docs/GROWTH_BRAIN_OPTIMIZER.md`.
8. **TNT / Mission Control** — FastAPI `/docs` link on PPC dashboard (`docs/TNT_LOCAL_PREVIEW.md`).
9. **Auth & workspace** — replace `data/operations` mocks with real workspace.
10. **Polish** — empty states, loading, optional rename CSS tokens `siren-*` → `zeus-*`.
