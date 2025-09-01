import os

PORT = os.getenv('PORT', '3000')
SERVICE_NAME = os.getenv("SERVICE_NAME", "minds-of-time") 
SERVICE_VERSION = os.getenv("SERVICE_VERSION", "0.0.1") 
PLATFORM_ENV = os.getenv("PLATFORM_ENV", "staging")
MULTIPLAYER_OTLP_KEY = os.getenv("MULTIPLAYER_OTLP_KEY")
OTLP_TRACES_ENDPOINT = os.getenv("OTLP_TRACES_ENDPOINT", "https://api.multiplayer.app/v1/traces")
OTLP_LOGS_ENDPOINT = os.getenv("OTLP_LOGS_ENDPOINT", "https://api.multiplayer.app/v1/logs")

MULTIPLAYER_OTLP_SPAN_RATIO = float(os.getenv("MULTIPLAYER_OTLP_SPAN_RATIO", "0.05"))

MULTIPLAYER_BACKEND_SOURCE = os.getenv("MULTIPLAYER_BACKEND_SOURCE", "production")

if MULTIPLAYER_BACKEND_SOURCE == "production":
    DIALOGUE_HUB_SERVICE_URL = "https://api.demo.multiplayer.app/v1/dialogue-hub"
    EPOCH_ENGINE_SERVICE_URL = "https://api.demo.multiplayer.app/v1/epoch-engine"
    MINDS_OF_TIME_SERVICE_URL = "https://api.demo.multiplayer.app/v1/minds-of-time"
    VAULT_OF_TIME_SERVICE_URL = "https://api.demo.multiplayer.app/v1/vault-of-time"
else:
    DIALOGUE_HUB_SERVICE_URL = "http://localhost:3000/v1/dialogue-hub"
    EPOCH_ENGINE_SERVICE_URL = "http://localhost:3000/v1/epoch-engine"
    MINDS_OF_TIME_SERVICE_URL = "http://localhost:3000/v1/minds-of-time"
    VAULT_OF_TIME_SERVICE_URL = "http://localhost:3000/v1/vault-of-time"


DIALOGUE_HUB_SERVICE_URL = os.getenv("DIALOGUE_HUB_SERVICE_URL", DIALOGUE_HUB_SERVICE_URL)
EPOCH_ENGINE_SERVICE_URL = os.getenv("EPOCH_ENGINE_SERVICE_URL", EPOCH_ENGINE_SERVICE_URL)
MINDS_OF_TIME_SERVICE_URL = os.getenv("MINDS_OF_TIME_SERVICE_URL", MINDS_OF_TIME_SERVICE_URL)
VAULT_OF_TIME_SERVICE_URL = os.getenv("VAULT_OF_TIME_SERVICE_URL", VAULT_OF_TIME_SERVICE_URL)
