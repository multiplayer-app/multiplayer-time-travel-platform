import otel
import os
import requests
from multiplayer_session_recorder import session_recorder

otel.init_tracing()

def get_data(name, base_url, endpoint):
    url = f"{base_url}{endpoint}"
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        print(f"\n✅ {name} response:")
        print(response.json())
    except requests.RequestException as e:
        print(f"\n❌ Error fetching {name}: {e}")

def main():
    session_recorder.init({
        apiKey: os.getenv("MULTIPLAYER_OTLP_KEY"),
        traceIdGenerator: otel,
        resourceAttributes: {
            serviceName: "{YOUR_APPLICATION_NAME}",
            version: "{YOUR_APPLICATION_VERSION}",
            environment: "{YOUR_APPLICATION_ENVIRONMENT}",
        }
    })

    vault_of_time_url = os.getenv("VAULT_OF_TIME_SERVICE_URL")
    epoch_engine_url = os.getenv("EPOCH_ENGINE_SERVICE_URL")
    minds_of_time_url = os.getenv("MINDS_OF_TIME_SERVICE_URL")

    if not all([vault_of_time_url, epoch_engine_url, minds_of_time_url]):
        print("❗ Please set all required environment variables:")
        print("  VAULT_OF_TIME_SERVICE_URL, EPOCH_ENGINE_SERVICE_URL, MINDS_OF_TIME_SERVICE_URL")
        return

    get_data("Vault of Time", vault_of_time_url, "/v1/vault-of-time/historical-events")
    get_data("Epoch Engine", epoch_engine_url, "/v1/epoch-engine/epoch")
    get_data("Minds of Time", minds_of_time_url, "/v1/minds-of-time/prominent-persons")

if __name__ == "__main__":
    main()
