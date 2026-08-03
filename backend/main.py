from collections import OrderedDict, deque
from contextlib import asynccontextmanager
from pathlib import Path
from time import monotonic

import httpx
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse, JSONResponse, Response
from fastapi.staticfiles import StaticFiles

from backend.config import settings
from backend.lead_schemas import LeadRequest

_http_client: httpx.AsyncClient | None = None
MAX_REQUEST_BODY_BYTES = 64 * 1024
LEAD_RATE_LIMIT = 5
LEAD_RATE_WINDOW_SECONDS = 60 * 60
LEAD_RATE_LIMIT_MAX_KEYS = 10_000
LEAD_FAILURE_DETAIL = "Could not submit right now — email me instead: me@richmiles.xyz"


class _RequestBodyTooLarge(HTTPException):
    def __init__(self):
        super().__init__(status_code=413, detail="Request body is too large.")


async def _send_body_too_large(send) -> None:
    body = b'{"detail":"Request body is too large."}'
    await send(
        {
            "type": "http.response.start",
            "status": 413,
            "headers": [
                (b"content-type", b"application/json"),
                (b"content-length", str(len(body)).encode("ascii")),
                (b"strict-transport-security", b"max-age=31536000; includeSubDomains"),
            ],
        }
    )
    await send({"type": "http.response.body", "body": body})


class BodySizeLimitMiddleware:
    """Reject oversized requests before application parsing or allocation."""

    def __init__(self, app, max_bytes: int = MAX_REQUEST_BODY_BYTES):
        self.app = app
        self.max_bytes = max_bytes

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        content_length = next(
            (
                value
                for name, value in scope.get("headers", [])
                if name.lower() == b"content-length"
            ),
            None,
        )
        if content_length is not None:
            try:
                if int(content_length) > self.max_bytes:
                    await _send_body_too_large(send)
                    return
            except ValueError:
                pass

        bytes_seen = 0
        response_started = False

        async def limited_receive():
            nonlocal bytes_seen
            message = await receive()
            if message["type"] == "http.request":
                bytes_seen += len(message.get("body", b""))
                if bytes_seen > self.max_bytes:
                    raise _RequestBodyTooLarge
            return message

        async def tracked_send(message):
            nonlocal response_started
            if message["type"] == "http.response.start":
                response_started = True
            await send(message)

        try:
            await self.app(scope, limited_receive, tracked_send)
        except _RequestBodyTooLarge:
            if not response_started:
                await _send_body_too_large(send)


class _LeadRateLimiter:
    """Small bounded LRU of per-IP submission timestamps."""

    def __init__(self, max_keys: int = LEAD_RATE_LIMIT_MAX_KEYS):
        self.max_keys = max_keys
        self._entries: OrderedDict[str, deque[float]] = OrderedDict()

    def allow(self, key: str, now: float | None = None) -> bool:
        current = monotonic() if now is None else now
        timestamps = self._entries.pop(key, deque())
        cutoff = current - LEAD_RATE_WINDOW_SECONDS
        while timestamps and timestamps[0] <= cutoff:
            timestamps.popleft()

        allowed = len(timestamps) < LEAD_RATE_LIMIT
        if allowed:
            timestamps.append(current)
        if timestamps:
            self._entries[key] = timestamps
        while len(self._entries) > self.max_keys:
            self._entries.popitem(last=False)
        return allowed

    def clear(self) -> None:
        self._entries.clear()


@asynccontextmanager
async def lifespan(app: FastAPI):
    global _http_client
    _http_client = httpx.AsyncClient(timeout=10)
    yield
    await _http_client.aclose()


_lead_rate_limiter = _LeadRateLimiter()
_is_dev = settings.environment == "dev"
app = FastAPI(
    lifespan=lifespan,
    docs_url="/docs" if _is_dev else None,
    redoc_url="/redoc" if _is_dev else None,
    openapi_url="/openapi.json" if _is_dev else None,
)
app.add_middleware(BodySizeLimitMiddleware)


@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Strict-Transport-Security"] = (
        "max-age=31536000; includeSubDomains"
    )
    return response


def _request_client_ip(request: Request) -> str:
    """Use the right-most XFF entry Caddy appended for this request."""
    forwarded = request.headers.get("x-forwarded-for", "")
    entries = [entry.strip() for entry in forwarded.split(",") if entry.strip()]
    if entries:
        return entries[-1]
    if request.client and request.client.host:
        return request.client.host
    return "unknown"


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


@app.post("/api/v1/lead")
async def submit_lead(request: Request, lead: LeadRequest):
    if _http_client is None:
        return JSONResponse(status_code=503, content={"detail": LEAD_FAILURE_DETAIL})

    client_ip = _request_client_ip(request)
    if not _lead_rate_limiter.allow(client_ip):
        return JSONResponse(
            status_code=429,
            content={"detail": "Too many submissions, please try again later."},
        )

    payload = {
        "email": lead.email,
        "name": lead.name,
        "company": lead.company,
        "message": lead.message,
        "source_url": "https://milesautomation.com/#contact",
        "website": lead.website,
    }

    try:
        response = await _http_client.post(
            f"{settings.spark_swarm_api_url.rstrip('/')}/public/sparks/miles-automation/leads",
            json=payload,
            headers={"X-Forwarded-For": client_ip},
        )
    except httpx.HTTPError:
        return JSONResponse(status_code=503, content={"detail": LEAD_FAILURE_DETAIL})

    if response.status_code in {202, 429}:
        content_type = response.headers.get("content-type")
        headers = {"content-type": content_type} if content_type else None
        return Response(
            content=response.content,
            status_code=response.status_code,
            headers=headers,
        )

    return JSONResponse(status_code=503, content={"detail": LEAD_FAILURE_DETAIL})


# SPA catch-all (when static dir exists from Docker build)
STATIC_DIR = Path(__file__).parent / "static"
if STATIC_DIR.exists():
    app.mount(
        "/assets", StaticFiles(directory=str(STATIC_DIR / "assets")), name="assets"
    )

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404)
        static_root = STATIC_DIR.resolve()
        file_path = (STATIC_DIR / full_path).resolve()
        if file_path.is_relative_to(static_root) and file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(STATIC_DIR / "index.html")
