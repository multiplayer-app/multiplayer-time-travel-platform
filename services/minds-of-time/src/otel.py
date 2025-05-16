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

from config import MULTIPLAYER_OTLP_KEY, OTLP_TRACES_ENDPOINT, OTLP_LOGS_ENDPOINT


def init_tracing(app):
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
        endpoint = OTLP_TRACES_ENDPOINT
    ))
    traceProvider.add_span_processor(processor)
    trace.set_tracer_provider(traceProvider)

    logger_provider = LoggerProvider(
        resource=Resource.create(
            {
                "service.name": SERVICE_NAME,
            }
        ),
    )
    set_logger_provider(logger_provider)
    exporter = MultiplayerOTLPLogExporter(
        apiKey = MULTIPLAYER_OTLP_KEY,
        endpoint = OTLP_LOGS_ENDPOINT
    )
    logger_provider.add_log_record_processor(BatchLogRecordProcessor(exporter))

    FlaskInstrumentor().instrument_app(app)
    # handler = LoggingHandler(level=logging.NOTSET, logger_provider=logger_provider)
