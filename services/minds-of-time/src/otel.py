from opentelemetry.instrumentation.flask import FlaskInstrumentor
from opentelemetry.sdk.resources import SERVICE_NAME as SERVICE_NAME_ATTR, SERVICE_VERSION as SERVICE_VERSION_ATTR, DEPLOYMENT_ENVIRONMENT, Resource

from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
from opentelemetry._logs import set_logger_provider
from opentelemetry.sdk._logs.export import BatchLogRecordProcessor

from multiplayer.opentelemetry.exporter.http.trace_exporter import MultiplayerOTLPSpanExporter
# from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
# from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
from multiplayer.opentelemetry.exporter.http.log_exporter import MultiplayerOTLPLogExporter
from multiplayer.opentelemetry.trace.sampler import MultiplayerTraceIdRatioBasedSampler
from multiplayer.opentelemetry.trace.id_generator import MultiplayerRandomIdGenerator

from config import OTLP_TRACES_ENDPOINT, OTLP_LOGS_ENDPOINT, MULTIPLAYER_OTLP_KEY, OTLP_MULTIPLAYER_DOC_SPAN_RATIO, OTLP_MULTIPLAYER_SPAN_RATIO, SERVICE_NAME, SERVICE_VERSION, PLATFORM_ENV


def init_tracing(app):
    id_generator = MultiplayerRandomIdGenerator(autoDocTracesRatio = OTLP_MULTIPLAYER_DOC_SPAN_RATIO)
    sampler = MultiplayerTraceIdRatioBasedSampler(rate = 1) # OTLP_MULTIPLAYER_SPAN_RATIO

    # Service name is required for most backends
    resource = Resource(attributes = {
        SERVICE_NAME_ATTR: SERVICE_NAME,
        SERVICE_VERSION_ATTR: SERVICE_VERSION,
        DEPLOYMENT_ENVIRONMENT: PLATFORM_ENV
    })

    traceProvider = TracerProvider(
        resource = resource,
        sampler = sampler,
        id_generator = id_generator
    )

    # traceExporter = OTLPSpanExporter(OTLP_TRACES_ENDPOINT)
    traceExporter = MultiplayerOTLPSpanExporter(
        endpoint = OTLP_TRACES_ENDPOINT,
        apiKey = MULTIPLAYER_OTLP_KEY
    )

    processor = BatchSpanProcessor(traceExporter)
    traceProvider.add_span_processor(processor)
    trace.set_tracer_provider(traceProvider)

    logger_provider = LoggerProvider(
        resource = Resource.create(
            {
                "service.name": SERVICE_NAME,
            }
        ),
    )
    set_logger_provider(logger_provider)
    
    logExporter = MultiplayerOTLPLogExporter(
        endpoint = OTLP_LOGS_ENDPOINT,
        apiKey = MULTIPLAYER_OTLP_KEY
    )
    # logExporter = OTLPLogExporter(
    #     endpoint = OTLP_LOGS_ENDPOINT
    # )


    logger_provider.add_log_record_processor(BatchLogRecordProcessor(logExporter))

    FlaskInstrumentor().instrument_app(app)
    # handler = LoggingHandler(level=logging.NOTSET, logger_provider=logger_provider)
