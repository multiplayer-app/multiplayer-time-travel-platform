# Python CLI App

Small CLI that calls platform services and records a Multiplayer full-stack session.

This guide uses `uv` for fast, isolated Python installs and execution. See `https://docs.astral.sh/uv/` for details.

## Prerequisites

- `uv` installed

## Configuration

Set environment variables (examples assume the demo stack is running locally behind Envoy on port 8080):

```bash
export MULTIPLAYER_OTLP_KEY="<your-multiplayer-api-key>"
export VAULT_OF_TIME_SERVICE_URL="http://localhost:8080"
export EPOCH_ENGINE_SERVICE_URL="http://localhost:8080"
export MINDS_OF_TIME_SERVICE_URL="http://localhost:8080"
```

The script appends service paths internally:

- `/v1/vault-of-time/historical-events`
- `/v1/epoch-engine/epoch`
- `/v1/minds-of-time/prominent-persons`

## Install & Run with uv

From the repo root or this directory:

```bash
cd clients/python-cli-app

# Create and run in an ephemeral environment
uv run --python 3.11 --with requirements.txt python main.py

# Or create a managed virtualenv, then run
uv venv --python 3.11 .venv
. .venv/bin/activate
uv pip install -r requirements.txt
python main.py
```

What it does:

- Initializes a Multiplayer session recorder
- Calls Vault of Time, Epoch Engine, and Minds of Time endpoints
- Prints JSON responses or errors to stdout


