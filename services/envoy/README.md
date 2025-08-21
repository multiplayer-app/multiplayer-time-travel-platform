# Envoy Proxy

Front proxy for the demo stack. Listens on port 8080 and routes external traffic to internal services.

## Routes (prefix → cluster)

- `/v1/timegate` → `timegate_service`
- `/v1/epoch-engine` → `epoch_engine_service`
- `/v1/minds-of-time` → `minds_of_time_service`
- `/v1/vault-of-time` → `vault_of_time_service`
- `/v1/dialogue-hub` → `dialogue_hub_service`
- `/` → `frontend_service` (web app)

See `envoy.yaml` for full configuration.

## Run (Docker Compose)

Started by the repo’s root `docker-compose.yml` and mapped to `http://localhost:8080`.
