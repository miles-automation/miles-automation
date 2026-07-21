from pathlib import Path

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI()


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


# SPA catch-all (when static dir exists from Docker build)
STATIC_DIR = Path(__file__).parent / "static"


def _safe_static_file(root: Path, requested_path: str) -> Path | None:
    """Return a regular file only when its resolved path remains under root."""
    resolved_root = root.resolve()
    candidate = (resolved_root / requested_path).resolve()
    if not candidate.is_relative_to(resolved_root) or not candidate.is_file():
        return None
    return candidate


if STATIC_DIR.exists():
    app.mount(
        "/assets", StaticFiles(directory=str(STATIC_DIR / "assets")), name="assets"
    )


@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    if full_path.startswith("api/"):
        raise HTTPException(status_code=404)
    file_path = _safe_static_file(STATIC_DIR, full_path)
    if file_path is not None:
        return FileResponse(file_path)
    index_path = _safe_static_file(STATIC_DIR, "index.html")
    if index_path is None:
        raise HTTPException(status_code=404)
    return FileResponse(index_path)
