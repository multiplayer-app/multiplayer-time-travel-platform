import os

PORT = os.getenv('PORT', '3000')
SERVICE_NAME = os.getenv("SERVICE_NAME", "<example-service-name>") 
SERVICE_VERSION = os.getenv("SERVICE_VERSION", "<service-version>") 
PLATFORM_ENV = os.getenv("PLATFORM_ENV", "<environment-name>")
MULTIPLAYER_OTLP_KEY = os.getenv("MULTIPLAYER_OTLP_KEY")
OTLP_TRACES_ENDPOINT = os.getenv("OTLP_TRACES_ENDPOINT", "https://api.multiplayer.app/v1/traces")
OTLP_LOGS_ENDPOINT = os.getenv("OTLP_LOGS_ENDPOINT", "https://api.multiplayer.app/v1/logs")
API_PREFIX = os.getenv("API_PREFIX", "/v1/minds-of-time")
OTLP_MULTIPLAYER_DOC_SPAN_RATIO = float(os.getenv("OTLP_MULTIPLAYER_DOC_SPAN_RATIO", "0.04"))
OTLP_MULTIPLAYER_SPAN_RATIO = float(os.getenv("OTLP_MULTIPLAYER_SPAN_RATIO", "0.05"))
