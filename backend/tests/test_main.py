from pathlib import Path

import pytest
from fastapi.testclient import TestClient

import backend.main as main_module


def test_spa_catch_all_cannot_escape_static_root(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    static_dir = tmp_path / "static"
    static_dir.mkdir()
    (static_dir / "index.html").write_text("safe app shell")
    (tmp_path / "secret.txt").write_text("must not leak")
    monkeypatch.setattr(main_module, "STATIC_DIR", static_dir)

    response = TestClient(main_module.app).get("/..%2fsecret.txt")

    assert response.status_code == 200
    assert response.text == "safe app shell"
    assert "must not leak" not in response.text


def test_safe_static_file_serves_only_descendants(tmp_path: Path) -> None:
    static_dir = tmp_path / "static"
    static_dir.mkdir()
    asset = static_dir / "asset.txt"
    asset.write_text("asset")
    outside = tmp_path / "outside.txt"
    outside.write_text("outside")

    assert main_module._safe_static_file(static_dir, "asset.txt") == asset
    assert main_module._safe_static_file(static_dir, "../outside.txt") is None
