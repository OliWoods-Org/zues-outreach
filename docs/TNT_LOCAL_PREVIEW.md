# TNT PPC agents — local preview (FastAPI)

There is **no Vite/React bundle** in [`TNT-PPC-agent-team`](https://github.com/OliWoods-Org/TNT-PPC-agent-team). The preview UI is **Swagger / OpenAPI**:

- **`GET /health`** — liveness  
- **`GET /docs`** — interactive API (Swagger UI)  
- Agent routes under `/agents/...` per [`src/api/server.py`](https://github.com/OliWoods-Org/TNT-PPC-agent-team/blob/main/src/api/server.py)

## Why `dev` failed before

1. **`requires-python >= 3.11`** — macOS default `python3` is often **3.9**. Use **Homebrew Python 3.12** (or 3.11+).
2. **`pip install -e .`** needs **modern pip** — run `python -m pip install -U pip setuptools wheel` first.
3. **Minimal `pyproject.toml`** — after editable install you still need **`fastapi`** and **`uvicorn`** (not always pulled by the stub package alone).

## Quick start (verified pattern)

```bash
cd ~/Documents/GitHub/zeus-mission-control   # or clone TNT-PPC-agent-team

# Must be 3.11+ (example: Homebrew)
/opt/homebrew/bin/python3.12 -m venv .venv
source .venv/bin/activate
python -m pip install -U pip setuptools wheel
pip install -e .
pip install fastapi "uvicorn[standard]" httpx

python -c "from src.api.server import app; print(app.title)"   # Adam PPC Agents

# Default port 8000 from Settings
uvicorn src.api.server:app --host 127.0.0.1 --port 8765 --reload
```

Open in the browser:

- **Swagger UI:** [http://127.0.0.1:8765/docs](http://127.0.0.1:8765/docs)  
- **Health:** [http://127.0.0.1:8765/health](http://127.0.0.1:8765/health)

Use another port if 8000/8765 is busy.

CLI alternative (same app):

```bash
python main.py serve --reload
```

## Docker (alternative)

```bash
docker compose up --build
```

Exposes **8000** per upstream `docker-compose.yaml`. Full agent runs may need Google Ads env.

## Zeus mapping

Treat **`/docs`** as the interim “TNT dashboard” until **Zeus Mission Control** ships; use **Siren web** as the visual shell reference — [`SIREN_WEB_UI_FOR_ZEUS.md`](SIREN_WEB_UI_FOR_ZEUS.md). Mirror metrics into Airtable per [`TNT_MISSION_CONTROL_AIRTABLE_BASE.md`](TNT_MISSION_CONTROL_AIRTABLE_BASE.md).
