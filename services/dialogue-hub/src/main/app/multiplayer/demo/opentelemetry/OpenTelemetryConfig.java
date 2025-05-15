package app.multiplayer.demo.opentelemetry;

import io.opentelemetry.api.GlobalOpenTelemetry;
import io.opentelemetry.sdk.OpenTelemetrySdk;
import io.opentelemetry.sdk.trace.SdkTracerProvider;
import io.opentelemetry.sdk.trace.export.SimpleSpanProcessor;
import io.opentelemetry.sdk.trace.export.SpanExporter;
import io.opentelemetry.sdk.logs.export.LogRecordExporter;
import io.opentelemetry.sdk.logs.SdkLoggerProviderBuilder;
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
        String SERVICE_NAME = "java-mp-demo-service";
        String SERVICE_VERSION = "0.0.1";
        String PLATFORM_ENV = "local";
        String MULTIPLAYER_OTLP_KEY = System.getenv("MULTIPLAYER_OTLP_KEY");

        // SpanExporter multiplayerSpanExporter = new MultiplayerOtlpHttpSpanExporter(MULTIPLAYER_OTLP_KEY, "http://localhost/v1/traces");
        // LogRecordExporter multiplayerLogsExporter = new MultiplayerOtlpHttpLogExporter(MULTIPLAYER_OTLP_KEY, "http://localhost/v1/logs");
        // Sampler sampler = MultiplayerTraceIdRatioBasedSampler.create(0.5);
        // MultiplayerRandomIdGenerator idGenerator = new MultiplayerRandomIdGenerator(0.5)

        SpanExporter multiplayerSpanExporter = OtlpHttpSpanExporter.builder()
            .setEndpoint("https://api.multiplayer.app/v1/traces")
            .addHeader("Authorization", MULTIPLAYER_OTLP_KEY)
            .build();
        LogRecordExporter multiplayerLogsExporter = OtlpHttpLogRecordExporter.builder()
            .setEndpoint("https://api.multiplayer.app/v1/logs")
            .addHeader("Authorization", MULTIPLAYER_OTLP_KEY)
            .build();
        Sampler sampler = Sampler.traceIdRatioBased(0.5);

        SdkTracerProvider tracerProvider = SdkTracerProvider.builder()
                // .setIdGenerator(idGenerator)
                .setSampler(sampler)
                .addSpanProcessor(BatchSpanProcessor.builder(multiplayerSpanExporter).build())
                .build();

        SdkLoggerProvider loggerProvider = SdkLoggerProvider.builder()
                .addLogRecordProcessor(BatchLogRecordProcessor.builder(multiplayerLogsExporter).build())
                .build();

        OpenTelemetrySdk openTelemetrySdk = OpenTelemetrySdk.builder()
                .setTracerProvider(tracerProvider)
                .setLoggerProvider(loggerProvider)
                .buildAndRegisterGlobal();
    }
}
