.PHONY: help install dev backend-server frontend-server test test-frontend test-backend lint format format-check typecheck contract-check check docker-build docker-run

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
	@echo "  make docker-build    Build production image"

install:
	cd backend && uv sync
	npm install

dev:
	@$(MAKE) -j2 backend-server frontend-server

backend-server:
	cd backend && uv run uvicorn backend.main:app --reload --host 127.0.0.1 --port 8001

frontend-server:
	npm run dev -- --port 5173

test:
	@$(MAKE) test-frontend

test-frontend:
	@npm run test

lint:
	@npm run lint

format:
	@npm run format

format-check: format

typecheck:
	@npx tsc -b

contract-check:
	@python3 scripts/check_contract.py

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
