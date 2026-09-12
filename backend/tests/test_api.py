from __future__ import annotations

import asyncio
import unittest
from unittest.mock import AsyncMock, patch

import httpx
from fastapi.testclient import TestClient
from starlette.requests import Request

from backend import main as backend_main


class LeadApiTests(unittest.TestCase):
    def setUp(self) -> None:
        backend_main._lead_rate_limiter.clear()
        self.client_context = TestClient(backend_main.app)
        self.client = self.client_context.__enter__()

    def tearDown(self) -> None:
        self.client_context.__exit__(None, None, None)
        backend_main._lead_rate_limiter.clear()

    def _payload(self) -> dict[str, str]:
        return {
            "name": "Rich Miles",
            "email": "rich@example.com",
            "company": "Acme",
            "message": "Our deploys are manual and hard to trust.",
            "website": "",
        }

    def test_lead_endpoint_forwards_success_and_honeypot_unchanged(self) -> None:
        upstream_response = httpx.Response(
            202,
            json={"status": "accepted", "message": "Thanks"},
        )
        mock_client = AsyncMock()
        mock_client.post.return_value = upstream_response
        payload = self._payload()
        payload["website"] = "https://spam.example/"

        with (
            patch.object(backend_main, "_http_client", mock_client),
            patch.object(
                backend_main.settings,
                "spark_swarm_api_url",
                "https://sparkswarm.com/api/v1",
            ),
        ):
            response = self.client.post(
                "/api/v1/lead",
                json=payload,
                headers={"X-Forwarded-For": "spoofed, 203.0.113.7"},
            )

        self.assertEqual(response.status_code, 202)
        self.assertEqual(response.json(), {"status": "accepted", "message": "Thanks"})
        mock_client.post.assert_awaited_once_with(
            "https://sparkswarm.com/api/v1/public/sparks/miles-automation/leads",
            json={
                "email": "rich@example.com",
                "name": "Rich Miles",
                "company": "Acme",
                "message": "Our deploys are manual and hard to trust.",
                "source_url": "https://milesautomation.com/#contact",
                "website": "https://spam.example/",
            },
            headers={"X-Forwarded-For": "203.0.113.7"},
        )

    def test_lead_endpoint_rejects_invalid_payload(self) -> None:
        response = self.client.post(
            "/api/v1/lead",
            json={"name": "", "email": "not-an-email", "website": "x" * 201},
        )

        self.assertEqual(response.status_code, 422)

    def test_lead_endpoint_maps_upstream_rate_limit(self) -> None:
        mock_client = AsyncMock()
        mock_client.post.return_value = httpx.Response(429, json={"error": "slow down"})

        with patch.object(backend_main, "_http_client", mock_client):
            response = self.client.post("/api/v1/lead", json=self._payload())

        self.assertEqual(response.status_code, 429)
        self.assertEqual(response.json(), {"error": "slow down"})

    def test_lead_endpoint_maps_upstream_failure_to_503(self) -> None:
        mock_client = AsyncMock()
        mock_client.post.return_value = httpx.Response(500, json={"internal": "secret"})

        with patch.object(backend_main, "_http_client", mock_client):
            response = self.client.post("/api/v1/lead", json=self._payload())

        self.assertEqual(response.status_code, 503)
        self.assertEqual(response.json(), {"detail": backend_main.LEAD_FAILURE_DETAIL})
        self.assertNotIn("secret", response.text)

    def test_lead_endpoint_rate_limits_after_five_submissions(self) -> None:
        mock_client = AsyncMock()
        mock_client.post.return_value = httpx.Response(202, json={"status": "accepted"})

        with patch.object(backend_main, "_http_client", mock_client):
            responses = [
                self.client.post(
                    "/api/v1/lead",
                    json=self._payload(),
                    headers={"X-Forwarded-For": "198.51.100.11"},
                )
                for _ in range(6)
            ]

        self.assertEqual(
            [response.status_code for response in responses], [202] * 5 + [429]
        )
        self.assertEqual(mock_client.post.await_count, 5)

    def test_oversized_content_length_is_rejected(self) -> None:
        response = self.client.post(
            "/api/v1/lead",
            content=b"x" * (backend_main.MAX_REQUEST_BODY_BYTES + 1),
            headers={"content-type": "application/json"},
        )

        self.assertEqual(response.status_code, 413)

    def test_oversized_stream_without_content_length_is_rejected(self) -> None:
        async def send_stream() -> httpx.Response:
            async def body():
                yield b"x" * (backend_main.MAX_REQUEST_BODY_BYTES // 2)
                yield b"x" * (backend_main.MAX_REQUEST_BODY_BYTES // 2 + 1)

            async with httpx.AsyncClient(
                transport=httpx.ASGITransport(app=backend_main.app),
                base_url="http://testserver",
            ) as client:
                return await client.post(
                    "/api/v1/lead",
                    content=body(),
                    headers={"content-type": "application/json"},
                )

        response = asyncio.run(send_stream())

        self.assertEqual(response.status_code, 413)

    def test_request_client_ip_uses_rightmost_xff_entry(self) -> None:
        request = Request(
            {
                "type": "http",
                "headers": [(b"x-forwarded-for", b"caller-supplied, 203.0.113.42")],
                "client": ("192.0.2.10", 12345),
            }
        )

        self.assertEqual(backend_main._request_client_ip(request), "203.0.113.42")

    def test_interactive_docs_are_closed_by_default(self) -> None:
        # Neither container sets ENVIRONMENT, so the default decides production
        # behaviour. It defaulted to "dev" and shipped /docs open to the internet.
        from backend.config import Settings

        self.assertEqual(Settings().environment, "prod")
        for path in ("/docs", "/redoc", "/openapi.json"):
            with self.subTest(path=path):
                self.assertEqual(self.client.get(path).status_code, 404)

    def test_sparks_endpoint_hides_ideas_and_archived_projects(self) -> None:
        # The endpoint is public. Serving every spark published the whole idea
        # list to anyone who called it directly, even though the page hid them.
        upstream = {
            "sparks": [
                {
                    "name": "Shipped",
                    "slug": "shipped",
                    "stage": "live",
                    "description": "real",
                },
                {
                    "name": "WIP",
                    "slug": "wip",
                    "stage": "building",
                    "description": "real",
                },
                {
                    "name": "Someday",
                    "slug": "someday",
                    "stage": "idea",
                    "description": "secret plan",
                },
                {
                    "name": "Dead",
                    "slug": "dead",
                    "stage": "archived",
                    "description": "abandoned",
                },
            ]
        }
        mock_client = AsyncMock()
        mock_client.get.return_value = httpx.Response(
            200,
            json=upstream,
            request=httpx.Request("GET", "https://sparkswarm.com/api/v1/sparks"),
        )

        with patch.object(backend_main, "_http_client", mock_client):
            with patch.object(backend_main.settings, "spark_swarm_api_key", "test-key"):
                response = self.client.get("/api/v1/sparks")

        slugs = [s["slug"] for s in response.json()["sparks"]]
        self.assertEqual(slugs, ["shipped", "wip"])
        self.assertNotIn("secret plan", response.text)
        self.assertNotIn("abandoned", response.text)


if __name__ == "__main__":
    unittest.main()
