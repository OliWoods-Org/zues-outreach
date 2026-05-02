# TNT PPC agents — local preview (FastAPI)

There is **no Vite/React bundle** in [`TNT-PPC-agent-team`](https://github.com/OliWoods-Org/TNT-PPC-agent-team). The preview UI is **Swagger / OpenAPI**:

- **`GET /health`** — liveness  
- **`GET /docs`** — interactive API (Swagger UI)  
- Agent routes under `/agents/...` per [`src/api/server.py`](https://github.com/OliWoods-Org/TNT-PPC-agent-team/blob/main/src/api/server.py)

## Quick start (from your clone)

```bash
cd ~/Documents/GitHub/zeus-mission-control   # or TNT-PPC-agent-team
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip setuptools wheel
pip install fastapi uvicorn pydantic pydantic-settings pyyaml httpx
pip install -e .
python main.py serve --reload
```

Then open **http://127.0.0.1:8000/docs** (port may differ — check `src/core/config` / `.env`).

If `pip install -e .` pulls incomplete deps, install missing packages from import errors until `python -c "from src.api.server import app"` succeeds.

## Docker (alternative)

```bash
docker compose up --build
```

Exposes **8000** per [`docker-compose.yaml`](https://github.com/OliWoods-Org/TNT-PPC-agent-team/blob/main/docker-compose.yaml). Requires `.env` with Google Ads vars for full agent behavior; `/health` may still respond without them.

## Zeus mapping

Treat **`/docs`** as the interim “TNT dashboard” until the forked **Zeus Mission Control** web app ships; mirror key metrics into Airtable per [`TNT_MISSION_CONTROL_AIRTABLE_BASE.md`](TNT_MISSION_CONTROL_AIRTABLE_BASE.md).
