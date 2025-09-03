package main

import (
	"context"
	"log"
	"os"
	"runtime"

	"github.com/multiplayer-app/multiplayer-otlp-go/exporters"
	multiplayer "github.com/multiplayer-app/multiplayer-otlp-go/trace"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/propagation"
	"go.opentelemetry.io/otel/sdk/resource"
	"go.opentelemetry.io/otel/sdk/trace"
	semconv "go.opentelemetry.io/otel/semconv/v1.26.0"
	otelTrace "go.opentelemetry.io/otel/trace"
)

var idGenerator *multiplayer.SessionRecorderIdGenerator
var tracerProvider *trace.TracerProvider

func init() {
	setupOpenTelemetry()
}

func setupOpenTelemetry() {
	// Create resource
	res := getResource()
	
	// Create trace exporter
	traceExporter, err := exporters.NewSessionRecorderHttpTraceExporter(MULTIPLAYER_OTLP_KEY, OTLP_TRACES_ENDPOINT)
	if err != nil {
		log.Fatalf("Failed to create trace exporter: %v", err)
	}
	
	// Create ID generator
	idGenerator = multiplayer.NewSessionRecorderIdGenerator()
	
	// Create sampler
	sampler := multiplayer.NewSampler(trace.TraceIDRatioBased(MULTIPLAYER_OTLP_SPAN_RATIO))
	
	// Create trace provider
	tracerProvider = trace.NewTracerProvider(
		trace.WithResource(res),
		trace.WithBatcher(traceExporter),
		trace.WithSampler(sampler),
		trace.WithIDGenerator(idGenerator),
	)
	
	// Create log exporter (commented out for now due to API differences)
	// logExporter := exporters.NewSessionRecorderHttpLogsExporter(MULTIPLAYER_OTLP_KEY, OTLP_LOGS_ENDPOINT)
	
	// Set global providers
	otel.SetTracerProvider(tracerProvider)
	otel.SetTextMapPropagator(propagation.TraceContext{})
}

func getResource() *resource.Resource {
	hostname, _ := os.Hostname()
	
	res, err := resource.New(
		context.Background(),
		resource.WithAttributes(
			semconv.ServiceName(COMPONENT_NAME),
			semconv.ServiceVersion(COMPONENT_VERSION),
			semconv.HostName(hostname),
			semconv.DeploymentEnvironment(ENVIRONMENT),
			attribute.String("process.runtime.version", runtime.Version()),
			attribute.Int("process.pid", os.Getpid()),
		),
		resource.WithFromEnv(),
		resource.WithProcess(),
		resource.WithOS(),
		resource.WithContainer(),
		resource.WithHost(),
	)
	
	if err != nil {
		log.Printf("Failed to create resource: %v", err)
		return resource.Default()
	}
	
	return res
}

// getIdGenerator returns the global ID generator for session recorder
func getIdGenerator() *multiplayer.SessionRecorderIdGenerator {
	return idGenerator
}

// getTracer returns a tracer for the application
func getTracer() otelTrace.Tracer {
	return otel.Tracer(COMPONENT_NAME)
}

// shutdown gracefully shuts down the OpenTelemetry providers
func shutdown(ctx context.Context) error {
	if tracerProvider != nil {
		return tracerProvider.Shutdown(ctx)
	}
	return nil
}
