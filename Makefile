.PHONY: help install dev backend-server frontend-server test test-frontend test-backend lint format format-check typecheck contract-check check gig-pdf-run docker-build docker-run

help:
	@echo "miles-automation"
	@echo ""
	@echo "Commands:"
	@echo "  make install         Install dependencies"
	@echo "  make dev             Run frontend + backend dev servers"
	@echo "  make test            Run all tests"
	@echo "  make lint            Run ESLint"
	@echo "  make format          Check Prettier formatting"
	@echo "  make typecheck       Run TypeScript typecheck"
	@echo "  make contract-check  Verify fleet contract"
	@echo "  make check           Run lint + format-check + typecheck + contract-check"
	@echo "  make gig-pdf-run     Run a bounded PDF fulfillment batch"
	@echo "  make docker-build    Build production image"

install:
	cd backend && uv sync
	npm install

dev:
	@$(MAKE) -j2 backend-server frontend-server

backend-server:
	cd backend && PYTHONPATH=.. uv run uvicorn backend.main:app --reload --host 127.0.0.1 --port 8001

frontend-server:
	npm run dev -- --port 5173

test:
	@$(MAKE) test-backend
	@$(MAKE) test-frontend

test-backend:
	@cd backend && PYTHONPATH=.. uv run pytest -q

test-frontend:
	@npm run test

lint:
	@npm run lint
	@cd backend && uv run ruff check .

format:
	@npm run format
	@cd backend && uv run ruff format --check .

format-check: format

typecheck:
	@npx tsc -b
	@cd backend && PYTHONPATH=.. uv run mypy --config-file mypy.ini .

contract-check:
	@python3 scripts/check_contract.py

gig-pdf-run:
	@cd backend && PYTHONPATH=.. uv run python -m backend.automations.cli pdf-run \
		--spec $(or $(SPEC),gig_specs/pdf/property-records.json) \
		--input $(or $(INPUT),incoming) \
		--output $(or $(OUTPUT),deliveries)

check:
	@$(MAKE) lint
	@$(MAKE) format-check
	@$(MAKE) typecheck
	@$(MAKE) contract-check
	@$(MAKE) test

docker-build:
	@docker build -t ghcr.io/miles-automation/miles-automation-app:latest .

docker-run:
	@docker run --rm -p 8000:8000 ghcr.io/miles-automation/miles-automation-app:latest
