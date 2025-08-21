# Node.js CLI App

Small CLI that calls platform services and records a Multiplayer full-stack session.

## Prerequisites

- Node.js >= 18

## Configuration

Set environment variables (examples assume the demo stack is running locally behind Envoy on port 8080):

```bash
export MULTIPLAYER_OTLP_KEY="<your-multiplayer-api-key>"
export DIALOGUE_HUB_SERVICE_URL="http://localhost:8080/v1/dialogue-hub"
export EPOCH_ENGINE_SERVICE_URL="http://localhost:8080/v1/epoch-engine"
export MINDS_OF_TIME_SERVICE_URL="http://localhost:8080/v1/minds-of-time"
export VAULT_OF_TIME_SERVICE_URL="http://localhost:8080/v1/vault-of-time"
```

Optional:

```bash
export ENVIRONMENT="local"
export SERVICE_NAME="nodejs-cli-app"
export OTLP_TRACES_ENDPOINT="https://api.multiplayer.app/v1/traces"
export OTLP_LOGS_ENDPOINT="https://api.multiplayer.app/v1/logs"
```

## Install & Run

```bash
cd clients/nodejs-cli-app
npm install
npm run build
npm start
```

To run in dev (ts-node):

```bash
npm run dev
```

The CLI will:

- Start a Multiplayer session recording
- Call Vault of Time, Epoch Engine, and Minds of Time endpoints
- Stop the session and exit


