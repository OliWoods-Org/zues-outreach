# Siren web — recent commits & reuse for Zeus Mission Control

**Repo:** local `~/Documents/GitHub/siren-web` · branch **`feature/saas-mission-script-marketplace`** (check `git status` before merging).

TNT (`TNT-PPC-agent-team`) is **API-only** (Swagger at `/docs`). **Siren web** is a **Vite + React + Tailwind** app with a full **shell, sidebar, and mission-control-style pages** — good **visual template** when you build Zeus Mission Control (copy layout/components, wire to Zeus + TNT APIs).

---

## Recent commits (newest first)

| Commit | Summary |
|--------|---------|
| `388be0e` | **feat(ui):** align Siren with **CoFounder + Railway** — grid, blue/gold |
| `cae2cb7` | **fix(ui):** Railway-style branding **distinct** |
| `178d451` | **style:** Railway-inspired — **violet UI**, Inter, **ambient grid** |
| `0d086c8` | **feat(ui):** **full app shell**, campaigns, analytics, **ops data**, settings |
| `9c647c7` | **chore:** marketplace split **30% Siren / 70% creator** |
| `e2b8598` | **feat:** **mission control**, **script library** tabs, marketplace fee model |
| `8fc767f` | **feat:** **MAMA-inspired UI** — sidebar, clean cards, spacing |
| `33581bb` | **feat:** sales **pipeline** + **spam guard** dual mode |

---

## Routes / surfaces worth copying

| Path | File | Use for Zeus |
|------|------|----------------|
| `/` | `pages/MissionControl.tsx` | **Home dashboard** — KPIs, charts (`MissionKpiCharts`) |
| `/campaigns` | `pages/Campaigns.tsx` | Campaign list → map to PPC / outreach campaigns |
| `/pipeline` | `pages/Pipeline.tsx` | Pipeline / deals pattern |
| `/analytics` | `pages/Analytics.tsx` | Metrics views → tie to TNT + Airtable snapshots |
| `/scripts` | `pages/Scripts.tsx` | **Script library** pattern → Zeus playbooks / templates |
| `/settings` | `pages/SettingsPage.tsx` | Brand/env/settings |

Shared chrome: `components/Layout.tsx`, `AppHeader.tsx`, `AmbientBackdrop.tsx`, `CrossGridOverlay.tsx`.

---

## Run Siren locally (visual dashboard reference)

```bash
cd ~/Documents/GitHub/siren-web
npm install
npm run dev
```

Default Vite URL is usually **http://127.0.0.1:5173** (see terminal output).

---

## Integration sketch (later)

- **Left:** Siren-style shell (React).  
- **Right:** Fetch **TNT** JSON from `http://127.0.0.1:8765` (your FastAPI host) for agent status; fetch **Airtable** or Zeus API for leads/listen/publish.

Do **not** merge repos blindly — **copy UI patterns** into `zeus-mission-control` front-end or a new `apps/web` package.
