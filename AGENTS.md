# AGENTS.md - Miles Automation

## Service overview

| Service | Port | Image                                           | Health                        |
| ------- | ---- | ----------------------------------------------- | ----------------------------- |
| app     | 8000 | `ghcr.io/miles-automation/miles-automation-app` | `/healthz`, `/api/v1/healthz` |

## Deployment

- Image tag pinned via `MILES_AUTOMATION_IMAGE_TAG` in `/root/platform-infra/.env`
- Deploy: `./bin/platform prod rollout miles-automation --tag sha-<short> --yes`
- Ephemeral staging: `deploy/pack.toml`

## Architecture

- **Frontend**: React 19 + Vite 7 SPA — consultancy landing page
- **Backend**: FastAPI serving health endpoints + SPA catch-all
- **Database**: None
- **Domain**: `milesautomation.com`

## Dev workflow

```bash
make install   # Install frontend + backend deps
make dev       # Frontend (5173) + backend (8001)
make check     # lint + format + typecheck + contract-check + test
```
