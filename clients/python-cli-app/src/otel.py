from opentelemetry.sdk.resources import SERVICE_NAME as SERVICE_NAME_ATTR, SERVICE_VERSION as SERVICE_VERSION_ATTR, DEPLOYMENT_ENVIRONMENT, Resource

from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
from opentelemetry._logs import set_logger_provider
from opentelemetry.sdk._logs.export import BatchLogRecordProcessor
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
from multiplayer_session_recorder import (
    SessionRecorderRandomIdGenerator,
    SessionRecorderTraceIdRatioBasedSampler,
)

from config import (
    OTLP_TRACES_ENDPOINT,
    OTLP_LOGS_ENDPOINT,
    MULTIPLAYER_OTLP_KEY,
    SERVICE_NAME,
    SERVICE_VERSION,
    PLATFORM_ENV
)

id_generator = SessionRecorderRandomIdGenerator()

def init_tracing():
    sampler = SessionRecorderTraceIdRatioBasedSampler(rate = 1) # MULTIPLAYER_OTLP_SPAN_RATIO

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

    traceExporter = OTLPSpanExporter(
        endpoint = OTLP_TRACES_ENDPOINT,
        headers = {
            "Authorization": MULTIPLAYER_OTLP_KEY
        }
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
    
    logExporter = OTLPLogExporter(
        endpoint = OTLP_LOGS_ENDPOINT,
        headers = {
            "Authorization": f"Bearer {MULTIPLAYER_OTLP_KEY}"
        }
    )


    logger_provider.add_log_record_processor(BatchLogRecordProcessor(logExporter))
