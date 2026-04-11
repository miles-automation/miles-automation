#!/usr/bin/env bash
set -euo pipefail
echo "Starting server..."
exec uv run --project backend uvicorn backend.main:app --host 0.0.0.0 --port 8000
