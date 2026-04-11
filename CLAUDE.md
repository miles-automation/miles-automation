# CLAUDE.md - Miles Automation

Vite + React + TypeScript consultancy landing page with a FastAPI backend. Single uvicorn process serves the API and the built SPA via StaticFiles.

## Architecture

- **Frontend**: React 19 + Vite 7 SPA (built to `dist/`, copied into `backend/static/` in Docker)
- **Backend**: FastAPI (`backend/main.py`) running on uvicorn `:8000`
- **Serving**: uvicorn on `:8000` — FastAPI serves `/healthz`, `/api/v1/healthz`, `/api/v1/sparks`, and the SPA catch-all directly
- **Data**: No database. Backend fetches portfolio data from Spark Swarm API at runtime.

## Fleet contract (Spark Swarm standard)

- Health: `GET /healthz` and `GET /api/v1/healthz` (served by FastAPI directly)
- Ephemeral staging: `deploy/pack.toml` + GitHub Action `Ephemeral Staging`
- Production: `./bin/platform prod rollout miles-automation --tag sha-<short> --yes` (pins `MILES_AUTOMATION_IMAGE_TAG`, pulls, restarts, health-checks)
- Image: `ghcr.io/miles-automation/miles-automation-app:sha-<short>`
- Health URL: `https://milesautomation.com/healthz`

## Environment variables

- `SPARK_SWARM_API_KEY` — required for fetching portfolio data from Spark Swarm
- `SPARK_SWARM_API_URL` — defaults to `https://swarm.sparkswarm.com/api/v1`

## Local dev

```bash
make install
make dev
```

Frontend on `http://127.0.0.1:5173`, backend on `http://127.0.0.1:8001`.
