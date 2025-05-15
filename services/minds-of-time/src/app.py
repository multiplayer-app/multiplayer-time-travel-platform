import os
from random import randint
from flask import Flask, request
from opentelemetry.instrumentation.flask import FlaskInstrumentor
from opentelemetry.sdk.resources import SERVICE_NAME, SERVICE_VERSION, DEPLOYMENT_ENVIRONMENT, Resource

from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
from opentelemetry._logs import set_logger_provider
from opentelemetry.sdk._logs.export import BatchLogRecordProcessor

from multiplayer.opentelemetry.exporter.http.trace_exporter import MultiplayerOTLPSpanExporter
from multiplayer.opentelemetry.exporter.http.log_exporter import MultiplayerOTLPLogExporter
from multiplayer.opentelemetry.trace.sampler import MultiplayerTraceIdRatioBasedSampler
from multiplayer.opentelemetry.trace.id_generator import MultiplayerRandomIdGenerator

import logging

logging.basicConfig(level=logging.INFO)

PORT = os.getenv('PORT', '8080')
MULTIPLAYER_OTLP_KEY = os.getenv('MULTIPLAYER_OTLP_KEY')
tracesEndpoint = "https://api.multiplayer.app/v1/traces"
logsEndpoint = "https://api.multiplayer.app/v1/logs"
SERVICE_NAME = os.getenv('SERVICE_NAME', "python-mp-demo-service")
DEPLOYMENT_ENVIRONMENT = os.getenv('DEPLOYMENT_ENVIRONMENT', "localhost")
SERVICE_VERSION = os.getenv('VERSION', "0.0.1")

id_generator = MultiplayerRandomIdGenerator(autoDocTracesRatio = 1/2)
sampler = MultiplayerTraceIdRatioBasedSampler(rate = 1/2)

# Service name is required for most backends
resource = Resource(attributes={
    SERVICE_NAME: SERVICE_NAME,
    SERVICE_VERSION: SERVICE_VERSION,
    DEPLOYMENT_ENVIRONMENT: DEPLOYMENT_ENVIRONMENT
})

traceProvider = TracerProvider(
    resource = resource,
    sampler = sampler,
    id_generator = id_generator
)
processor = BatchSpanProcessor(MultiplayerOTLPSpanExporter(
    apiKey = MULTIPLAYER_OTLP_KEY,
    endpoint = tracesEndpoint
))
traceProvider.add_span_processor(processor)
trace.set_tracer_provider(traceProvider)

logger_provider = LoggerProvider(
    resource=Resource.create(
        {
            "service.name": "shoppingcart",
            "service.instance.id": "instance-12",
        }
    ),
)
set_logger_provider(logger_provider)
exporter = MultiplayerOTLPLogExporter(
    apiKey = MULTIPLAYER_OTLP_KEY,
    endpoint = logsEndpoint
)
logger_provider.add_log_record_processor(BatchLogRecordProcessor(exporter))
handler = LoggingHandler(level=logging.NOTSET, logger_provider=logger_provider)


instrumentor = FlaskInstrumentor()
app = Flask(__name__)
instrumentor.instrument_app(app)


logger = logging.getLogger(__name__)

@app.route("/rolldice")
def roll_dice():
    player = request.args.get('player', default=None, type=str)
    result = str(roll())
    if player:
        logger.warning("%s is rolling the dice: %s", player, result)
    else:
        logger.warning("Anonymous player is rolling the dice: %s", result)
    return result


def roll():
    return randint(1, 6)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=PORT)
