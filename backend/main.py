from contextlib import asynccontextmanager
from pathlib import Path

import httpx
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

from backend.config import settings

_http_client: httpx.AsyncClient | None = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global _http_client
    _http_client = httpx.AsyncClient(timeout=10)
    yield
    await _http_client.aclose()


app = FastAPI(lifespan=lifespan)


@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response


@app.get("/healthz")
async def healthz():
    return JSONResponse({"status": "ok"})


@app.get("/api/v1/healthz")
async def api_healthz():
    return JSONResponse({"status": "ok"})


@app.get("/api/v1/sparks")
async def get_sparks():
    """Fetch live sparks from Spark Swarm and return for the portfolio."""
    api_key = settings.spark_swarm_api_key
    if not api_key or _http_client is None:
        return JSONResponse({"sparks": [], "source": "fallback"})

    try:
        resp = await _http_client.get(
            f"{settings.spark_swarm_api_url}/sparks",
            headers={"X-API-Key": api_key},
        )
        resp.raise_for_status()
    except httpx.HTTPError:
        return JSONResponse({"sparks": [], "source": "fallback"})

    sparks = resp.json().get("sparks", [])
    # Return only the fields the frontend needs
    filtered = [
        {
            "name": s.get("name"),
            "slug": s.get("slug"),
            "description": s.get("description"),
            "domain": s.get("domain"),
            "stage": s.get("stage"),
            "health": s.get("health"),
        }
        for s in sparks
    ]
    return JSONResponse({"sparks": filtered, "source": "live"})


# SPA catch-all (when static dir exists from Docker build)
STATIC_DIR = Path(__file__).parent / "static"
if STATIC_DIR.exists():
    app.mount("/assets", StaticFiles(directory=str(STATIC_DIR / "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404)
        file_path = STATIC_DIR / full_path
        if file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(STATIC_DIR / "index.html")
