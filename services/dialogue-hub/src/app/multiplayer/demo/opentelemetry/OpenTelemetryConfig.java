package app.multiplayer.demo.opentelemetry;

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

// otlp default exporters
import io.opentelemetry.exporter.otlp.http.trace.OtlpHttpSpanExporter;
import io.opentelemetry.exporter.otlp.http.logs.OtlpHttpLogRecordExporter;

// mp exporters
// import app.multiplayer.opentelemetry.trace.MultiplayerRandomIdGenerator;
// import app.multiplayer.opentelemetry.exporter.MultiplayerOtlpHttpLogExporter;
// import app.multiplayer.opentelemetry.exporter.MultiplayerOtlpHttpSpanExporter;
// import app.multiplayer.opentelemetry.trace.samplers.MultiplayerTraceIdRatioBasedSampler;

public class OpenTelemetryConfig {
    public static void initialize() {
        // SpanExporter multiplayerSpanExporter = new MultiplayerOtlpHttpSpanExporter(MULTIPLAYER_OTLP_KEY, "http://localhost/v1/traces");
        // LogRecordExporter multiplayerLogsExporter = new MultiplayerOtlpHttpLogExporter(MULTIPLAYER_OTLP_KEY, "http://localhost/v1/logs");
        // Sampler sampler = MultiplayerTraceIdRatioBasedSampler.create(Config.OTLP_MULTIPLAYER_SPAN_RATIO);
        // MultiplayerRandomIdGenerator idGenerator = new MultiplayerRandomIdGenerator(Config.OTLP_MULTIPLAYER_DOC_SPAN_RATIO)

        SpanExporter spanExporter = OtlpHttpSpanExporter.builder()
            .setEndpoint(Config.OTLP_TRACES_ENDPOINT)
            .addHeader("Authorization", Config.MULTIPLAYER_OTLP_KEY)
            .build();
        LogRecordExporter logsExporter = OtlpHttpLogRecordExporter.builder()
            .setEndpoint(Config.OTLP_LOGS_ENDPOINT)
            .addHeader("Authorization", Config.MULTIPLAYER_OTLP_KEY)
            .build();
        Sampler sampler = Sampler.traceIdRatioBased(Config.OTLP_MULTIPLAYER_SPAN_RATIO);

        SdkTracerProvider tracerProvider = SdkTracerProvider.builder()
                // .setIdGenerator(idGenerator)
                .setSampler(sampler)
                .addSpanProcessor(BatchSpanProcessor.builder(spanExporter).build())
                .build();

        SdkLoggerProvider loggerProvider = SdkLoggerProvider.builder()
                .addLogRecordProcessor(BatchLogRecordProcessor.builder(logsExporter).build())
                .build();

        OpenTelemetrySdk openTelemetrySdk = OpenTelemetrySdk.builder()
                .setTracerProvider(tracerProvider)
                .setLoggerProvider(loggerProvider)
                .buildAndRegisterGlobal();
    }
}
