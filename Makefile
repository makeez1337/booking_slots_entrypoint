.PHONY: dev up down logs build

# Development: hot reload (base + dev override)
dev:
	docker compose -f compose.yaml -f compose.dev.yaml up --build -d

# Production-like: base file only
up:
	docker compose -f compose.yaml up --build -d

down:
	docker compose down

logs:
	docker compose logs -f backend
