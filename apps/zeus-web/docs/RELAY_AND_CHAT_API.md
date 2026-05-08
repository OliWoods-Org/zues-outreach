# Relay module & chat completion APIs

The Zeus web app can run entirely on **demo data**. Optional env vars point at a **single-origin** backend (or the included mock server).

## Environment (`apps/zeus-web/.env`)

| Variable | Purpose |
|----------|---------|
| `VITE_ZEUS_RELAY_API_URL` | Base URL for Relay. Client requests **`GET {base}/module`** → JSON matching `RelayModuleSnapshot` (`src/api/relay.ts`). |
| `VITE_ZEUS_CHAT_API_URL` | Base URL for assistants. Client requests **`POST {base}/completion`** with body `{ mode: 'sales' \| 'guard', messages: { role, content }[] }` → `{ content: string }`. |
| `VITE_POSTHOG_KEY` | PostHog project key (optional). |
| `VITE_MAMA_API_URL` | MAMA / social endpoints (optional). |

If `VITE_ZEUS_RELAY_API_URL` is unset, Relay uses in-memory demo data. If `VITE_ZEUS_CHAT_API_URL` is unset, replies use the **in-browser stub** (Growth coach template + Guard telemetry from `src/lib/guardTelemetry.ts`).

## Local mock server (no deploy)

From `apps/zeus-web`:

```bash
npm run mock:api
```

Defaults to **http://localhost:8788** (`GET /module`, `POST /completion`). Set:

```bash
VITE_ZEUS_RELAY_API_URL=http://localhost:8788
VITE_ZEUS_CHAT_API_URL=http://localhost:8788
```

Then `npm run dev` and open Relay / Chat — Relay loads snapshot JSON from the mock; Chat completion returns an echo string so you can verify wiring.

### Regenerate snapshot JSON

After changing demo conversations in `src/api/relay.ts`:

```bash
npx tsx -e "import { RELAY_SNAPSHOT_DEMO } from './src/api/relay.ts'; import { writeFileSync } from 'fs'; writeFileSync('scripts/relay-module.snapshot.json', JSON.stringify(RELAY_SNAPSHOT_DEMO, null, 2));"
```

## Production backend

Implement the same two routes behind auth (workspace JWT or session cookie). **Never** expose Airtable PATs or secrets to the client — inject workspace context on the server when building the LLM prompt.
