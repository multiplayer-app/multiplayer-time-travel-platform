# Dialogue Hub Service

Node.js/TypeScript service that powers AI chat flows. Integrates with OpenRouter-like LLM APIs and maintains short-lived conversation context in Redis.

## Key Endpoints

- Base prefix: `/v1/dialogue-hub`
- Swagger UI: `/v1/dialogue-hub/docs`
- Health: `/v1/dialogue-hub/health`, `/v1/dialogue-hub/healthz`
- OpenRouter proxy: `/v1/dialogue-hub/openrouter/message` (POST)

## Environment

- `PORT` (default: 3000)
- `API_PREFIX` (default: `/v1/dialogue-hub`)
- OpenRouter config: `OPENROUTER_API_KEY`, `OPENROUTER_API_URL` (default `https://openrouter.ai/api/v1/chat/completions`), `OPENROUTER_MODEL`
- Redis: `REDIS_URI` (or `REDIS_HOST`, `REDIS_PORT`, `REDIS_DB`)
- Error injection: `RANDOM_ERROR_RATE` (default: 0.1)
- OpenTelemetry: `MULTIPLAYER_OTLP_KEY`, `OTLP_TRACES_ENDPOINT`, `OTLP_LOGS_ENDPOINT`, `MULTIPLAYER_OTLP_SPAN_RATIO`

## Run (Docker Compose)

Started by the repo’s root `docker-compose.yml`. Exposed via Envoy at `http://localhost:8080`.
