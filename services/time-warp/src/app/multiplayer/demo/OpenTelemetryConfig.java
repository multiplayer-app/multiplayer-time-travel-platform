package app.multiplayer.demo;

import io.opentelemetry.sdk.OpenTelemetrySdk;
import io.opentelemetry.sdk.trace.SdkTracerProvider;
// import io.opentelemetry.api.GlobalOpenTelemetry;
// import io.opentelemetry.sdk.trace.export.SimpleSpanProcessor;
// import io.opentelemetry.sdk.logs.SdkLoggerProviderBuilder;
import io.opentelemetry.sdk.trace.export.SpanExporter;
import io.opentelemetry.sdk.logs.export.LogRecordExporter;
import io.opentelemetry.sdk.logs.SdkLoggerProvider;
import io.opentelemetry.sdk.logs.export.BatchLogRecordProcessor;
import io.opentelemetry.sdk.trace.export.BatchSpanProcessor;
import io.opentelemetry.sdk.trace.samplers.Sampler;
import io.opentelemetry.api.common.AttributeKey;
import io.opentelemetry.api.common.Attributes;
import io.opentelemetry.api.trace.propagation.W3CTraceContextPropagator;
import io.opentelemetry.context.propagation.ContextPropagators;
import io.opentelemetry.sdk.resources.Resource;
// import io.opentelemetry.semconv.ResourceAttributes;
// import io.opentelemetry.semconv.resource.attributes.ResourceAttributes;

// otlp default exporters
// import io.opentelemetry.exporter.otlp.http.trace.OtlpHttpSpanExporter;
// import io.opentelemetry.exporter.otlp.http.logs.OtlpHttpLogRecordExporter;

// mp exporters
import app.multiplayer.opentelemetry.trace.MultiplayerRandomIdGenerator;
import app.multiplayer.opentelemetry.exporter.MultiplayerOtlpHttpLogExporter;
import app.multiplayer.opentelemetry.exporter.MultiplayerOtlpHttpSpanExporter;
import app.multiplayer.opentelemetry.trace.samplers.MultiplayerTraceIdRatioBasedSampler;

public class OpenTelemetryConfig {
    public static void initialize() {
        SpanExporter spanExporter = new MultiplayerOtlpHttpSpanExporter(Config.MULTIPLAYER_OTLP_KEY, Config.OTLP_TRACES_ENDPOINT);
        LogRecordExporter logsExporter = new MultiplayerOtlpHttpLogExporter(Config.MULTIPLAYER_OTLP_KEY, Config.OTLP_LOGS_ENDPOINT);
        Sampler sampler = MultiplayerTraceIdRatioBasedSampler.create(Config.MULTIPLAYER_OTLP_SPAN_RATIO);
        MultiplayerRandomIdGenerator idGenerator = new MultiplayerRandomIdGenerator(Config.MULTIPLAYER_OTLP_DOC_SPAN_RATIO);

        // SpanExporter spanExporter = OtlpHttpSpanExporter.builder()
        //     .setEndpoint(Config.OTLP_TRACES_ENDPOINT)
        //     .addHeader("Authorization", Config.MULTIPLAYER_OTLP_KEY)
        //     .build();
        // LogRecordExporter logsExporter = OtlpHttpLogRecordExporter.builder()
        //     .setEndpoint(Config.OTLP_LOGS_ENDPOINT)
        //     .addHeader("Authorization", Config.MULTIPLAYER_OTLP_KEY)
        //     .build();
        // Sampler sampler = Sampler.traceIdRatioBased(Config.MULTIPLAYER_OTLP_SPAN_RATIO);

        Resource resource = Resource.getDefault().merge(
                Resource.create(Attributes.of(
                        AttributeKey.stringKey("service.name"), Config.SERVICE_NAME,
                        AttributeKey.stringKey("service.version"), Config.SERVICE_VERSION,
                        AttributeKey.stringKey("deployment.environment"), Config.PLATFORM_ENV
                ))
        );

        SdkTracerProvider tracerProvider = SdkTracerProvider.builder()
                .setResource(resource)
                .setIdGenerator(idGenerator)
                .setSampler(sampler)
                .addSpanProcessor(BatchSpanProcessor.builder(spanExporter).build())
                .build();

        SdkLoggerProvider loggerProvider = SdkLoggerProvider.builder()
                .setResource(resource)
                .addLogRecordProcessor(BatchLogRecordProcessor.builder(logsExporter).build())
                .build();

        OpenTelemetrySdk.builder()
                .setTracerProvider(tracerProvider)
                .setLoggerProvider(loggerProvider)
                .setPropagators(ContextPropagators.create(W3CTraceContextPropagator.getInstance()))
                .buildAndRegisterGlobal();
    }
}
