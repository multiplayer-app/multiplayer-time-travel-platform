# TimeGate Service

Node.js/TypeScript API gateway and orchestrator for the demo. Proxies requests to downstream services and exposes consolidated API docs.

## Key Endpoints

- Base prefix: `/v1/timegate`
- Swagger UI: `/v1/timegate/docs`
- Health: `/v1/timegate/health`, `/v1/timegate/healthz`
- Dialogue Hub proxy: `/v1/timegate/dialogue-hub/openrouter/message` (POST)
- Epoch Engine proxy: `/v1/timegate/epoch-engine/epoch` (GET)
- Minds of Time proxy: `/v1/timegate/minds-of-time/prominent-persons` (GET)
- Vault of Time proxy: `/v1/timegate/vault-of-time/historical-events` (GET)

## Environment

- `PORT` (default: 3000)
- `API_PREFIX` (default: `/v1/timegate`)
- `DIALOGUE_HUB_SERVICE_URL`, `EPOCH_ENGINE_SERVICE_URL`, `MINDS_OF_TIME_SERVICE_URL`, `VAULT_OF_TIME_SERVICE_URL`
- OpenTelemetry: `MULTIPLAYER_OTLP_KEY`, `OTLP_TRACES_ENDPOINT`, `OTLP_LOGS_ENDPOINT`, `MULTIPLAYER_OTLP_SPAN_RATIO`
- Mongo (for user endpoints): `MONGODB_URI`, `MONGODB_DB_NAME`

## Run (Docker Compose)

Started by the repo’s root `docker-compose.yml`. Exposed via Envoy at `http://localhost:8080`.
