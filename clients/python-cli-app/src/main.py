import otel
import asyncio
import requests
from multiplayer_session_recorder import (
    session_recorder,
    SessionType
)
from config import (
    VAULT_OF_TIME_SERVICE_URL,
    EPOCH_ENGINE_SERVICE_URL,
    MINDS_OF_TIME_SERVICE_URL,
    MULTIPLAYER_OTLP_KEY,
    SERVICE_NAME,
    SERVICE_VERSION,
    PLATFORM_ENV,
)
otel.init_tracing()

def get_data(name, base_url, endpoint):
    url = f"{base_url}{endpoint}"
    try:
        response = requests.get(
            url,
            params = { "errorRate": 0 },
            timeout = 10
        )
        response.raise_for_status()
        print(f"\n✅ {name} response:")
        print(response.json())
    except requests.RequestException as e:
        print(f"\n❌ Error fetching {name}: {e}")

async def main():
    session_recorder.init(
        apiKey = MULTIPLAYER_OTLP_KEY,
        traceIdGenerator = otel.id_generator,
        resourceAttributes = {
            "serviceName": SERVICE_NAME,
            "version": SERVICE_VERSION,
            "environment": PLATFORM_ENV,
        }
    )

    await session_recorder.start(
        SessionType.PLAIN,
        {}
    )

    get_data("Vault of Time", VAULT_OF_TIME_SERVICE_URL, "/v1/vault-of-time/historical-events")
    
    get_data("Epoch Engine", EPOCH_ENGINE_SERVICE_URL, "/v1/epoch-engine/epoch")
    get_data("Minds of Time", MINDS_OF_TIME_SERVICE_URL, "/v1/minds-of-time/prominent-persons")

    await session_recorder.stop()

if __name__ == "__main__":
    asyncio.run(main())
