# Zeus Growth OS — Claude plugin (execution layer)

**Zeus** is the bundled growth stack: lead discovery, enrichment, email + PPC insight, CRM sync, **social listening**, and **Airtable** as your pipeline brain. This repo is the **Claude Code plugin** that operators use day to day. **Mission Control** (the web dashboard with PPC agents) is a **separate app** — forked from the TNT dashboard; see the master plan below.

**Elevar Health** is the first vertical example (men’s telehealth / partnerships); the same plugin powers other product-line bases in the [Zeus Outreach](https://github.com/OliWoods-Org/zues-outreach) workspace.

## Master build plan (read this)

| Document | Purpose |
|----------|---------|
| [`docs/CLAUDE_TASKS.md`](docs/CLAUDE_TASKS.md) | **Claude Code checklist** — tasks by track to finish Zeus |
| [`docs/TNT_MISSION_CONTROL_AIRTABLE_BASE.md`](docs/TNT_MISSION_CONTROL_AIRTABLE_BASE.md) | **TNT / Mission Control** Airtable telemetry + link to FastAPI preview |
| [`docs/TNT_LOCAL_PREVIEW.md`](docs/TNT_LOCAL_PREVIEW.md) | Run **TNT** locally — **Python 3.12+**, FastAPI `/docs` |
| [`apps/zeus-web/README.md`](apps/zeus-web/README.md) | **Zeus Web** — Vite app (Siren-style shell, Zeus branding); run `npm run dev` |
| [`snapshots/siren-ui-reference/README.md`](snapshots/siren-ui-reference/README.md) | **Frozen Siren UI snapshot** — restore the visual system if the fork diverges |
| [`docs/SIREN_WEB_UI_FOR_ZEUS.md`](docs/SIREN_WEB_UI_FOR_ZEUS.md) | **Siren** recent UI commits + routes to reuse as Zeus dashboard shell |
| [`docs/BUILD_PARALLEL_AGENTS.md`](docs/BUILD_PARALLEL_AGENTS.md) | What the 5 parallel build streams shipped in-repo |
| [`docs/ZEUS_FINAL_BUILD_PLAN.md`](docs/ZEUS_FINAL_BUILD_PLAN.md) | **Phased execution** — Mission Control, Airtable, workers, gates, acceptance criteria |
| [`docs/ZEUS_OUTREACH_PLAN.md`](docs/ZEUS_OUTREACH_PLAN.md) | Portfolio bases, Listen vs responder, affiliate, Growth Brain, v2 ideas |
| [`docs/AIRTABLE_ZEUS_SCHEMA.md`](docs/AIRTABLE_ZEUS_SCHEMA.md) | Zeus table/field reference (Brand, Publish, Listen, Brain, Affiliate) |
| [`docs/ZEUS_MISSION_CONTROL_IA.md`](docs/ZEUS_MISSION_CONTROL_IA.md) | Mission Control IA — lanes + Zeus modules (TNT fork) |
| [`docs/PRICING_SKUS.md`](docs/PRICING_SKUS.md) | Zeus narrative + tier SKUs (Core, Listen, Responder, …) |
| [`docs/AFFILIATE_MODULE.md`](docs/AFFILIATE_MODULE.md) | Affiliate / Viral Loops–class + payouts tiers |
| [`docs/SOCIAL_LISTEN_TIERS.md`](docs/SOCIAL_LISTEN_TIERS.md) | Listen metering vs AI responder |
| [`docs/GROWTH_BRAIN_OPTIMIZER.md`](docs/GROWTH_BRAIN_OPTIMIZER.md) | Growth Brain cross-channel optimizer |
| [`docs/BACKLOG_DECISIONS.md`](docs/BACKLOG_DECISIONS.md) | Open decisions (MAMA MCP, GoodBot vs 411, DOM CRE) |
| [`docs/V2_BACKLOG_PICKS.md`](docs/V2_BACKLOG_PICKS.md) | v2 roadmap picks from outreach plan §18 |
| [`docs/ELEVAR_OUTREACH_AIRTABLE.md`](docs/ELEVAR_OUTREACH_AIRTABLE.md) | Elevar `Leads` table + env; **Apollo pilot** (`scripts/elevar_apollo_pilot.py`, §7) |
| [`docs/LOW_BUDGET_LEAD_STACK.md`](docs/LOW_BUDGET_LEAD_STACK.md) | RapidAPI vs Apify keys, free vs paid scraping, cost-conscious stack |

## Features (slash commands)

| Command | Description |
|---------|-------------|
| `/zeus` | Index to Zeus docs and build tracks |
| `/find-leads` | Search Apollo.io for prospects by criteria |
| `/enrich-leads` | Add phone, email, LinkedIn to contact lists |
| `/send-campaign` | Send personalized email campaigns via Instantly |
| `/ads-report` | Get Google Ads performance metrics |
| `/social-listen` | Monitor Reddit/X for keywords (intelligence lane — feeds TrendPosts via workers per build plan) |
| `/crm-sync` | Push leads to HubSpot CRM |
| `/airtable-sync` | Push or upsert leads to Airtable (scoped outreach base; dedupe by Email) |

## Installation

### Prerequisites

- Claude Code installed (`npm install -g @anthropic-ai/claude-code`)
- API keys for the services you want to use

### Quick install

```bash
# One-liner (see scripts/install.sh for full behavior)
curl -fsSL https://raw.githubusercontent.com/OliWoods-Org/zues-outreach/main/scripts/install.sh | bash
```

Or clone manually:

```bash
mkdir -p ~/.claude/plugins
git clone https://github.com/OliWoods-Org/zues-outreach.git ~/.claude/plugins/zues-outreach

cp ~/.claude/plugins/zues-outreach/.env.example ~/.zeus-env
# Edit ~/.zeus-env — or keep using ~/.elevare-env if you already have it
echo "source ~/.zeus-env" >> ~/.zshrc
source ~/.zshrc
```

> **Legacy:** installs under `~/.claude/plugins/elevare-plugin` still work if you pull `main` from this repo; new installs use `zues-outreach` per `scripts/install.sh`.

## Required API keys

Copy [`.env.example`](.env.example) to `~/.zeus-env` (or `~/.elevare-env`) and set:

- **Apollo** — lead database  
- **Instantly** — email campaigns  
- **Google Ads** — PPC reports  
- **HubSpot** — CRM  
- **Airtable** — PAT scoped to **one outreach base** (`AIRTABLE_BASE_ID`) — see [`commands/airtable-sync.md`](commands/airtable-sync.md)  
- **Reddit / X** — social listening (optional)

## Usage examples

### Zeus index

```
/zeus plan
```

### Find leads

```
/find-leads wellness clinics in Texas
/find-leads pharmacies in California with 10+ employees
```

### Airtable sync (after find/enrich)

```
/airtable-sync leads.csv
```

Dry run:

```bash
python3 scripts/airtable-push-leads.py leads.csv --dry-run
```

## Agents

- **lead-prospector** — Lead research and scoring  
- **campaign-builder** — Email sequences from briefs  
- **social-monitor** — Social opportunities  

## Support

Matt Woods — Good Companies / OliWoods org. Notion: Elevare / Zeus workspace as applicable.
