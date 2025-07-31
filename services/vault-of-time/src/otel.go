package main

import (
	"context"
	"errors"
	"log"
	"time"

	multiplayer "github.com/multiplayer-app/multiplayer-otlp-go"
	"github.com/multiplayer-app/multiplayer-time-travel-platform/services/vault-of-time/src/config"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracehttp"
	"go.opentelemetry.io/otel/propagation"
	"go.opentelemetry.io/otel/sdk/resource"
	"go.opentelemetry.io/otel/sdk/trace"
	semconv "go.opentelemetry.io/otel/semconv/v1.24.0"
)

// setupOTelSDK bootstraps the OpenTelemetry pipeline.
// If it does not return an error, make sure to call shutdown for proper cleanup.
func setupOTelSDK(ctx context.Context) (shutdown func(context.Context) error, err error) {
	var shutdownFuncs []func(context.Context) error

	// shutdown calls cleanup functions registered via shutdownFuncs.
	// The errors from the calls are joined.
	// Each registered cleanup will be invoked once.
	shutdown = func(ctx context.Context) error {
		var err error
		for _, fn := range shutdownFuncs {
			err = errors.Join(err, fn(ctx))
		}
		shutdownFuncs = nil
		return err
	}

	// handleErr calls shutdown for cleanup and makes sure that all errors are returned.
	handleErr := func(inErr error) {
		err = errors.Join(inErr, shutdown(ctx))
	}

	// Set up propagator.
	prop := newPropagator()
	otel.SetTextMapPropagator(prop)

	// Set up trace provider.
	tracerProvider, err := newTraceProvider()
	if err != nil {
		handleErr(err)
		return
	}
	shutdownFuncs = append(shutdownFuncs, tracerProvider.Shutdown)
	otel.SetTracerProvider(tracerProvider)

	return
}

func newPropagator() propagation.TextMapPropagator {
	return propagation.NewCompositeTextMapPropagator(
		propagation.TraceContext{},
		propagation.Baggage{},
	)
}

func newTraceProvider() (*trace.TracerProvider, error) {
	ctx := context.Background()

	res, err := resource.New(context.Background(),
		resource.WithAttributes(
			semconv.ServiceNameKey.String(config.SERVICE_NAME),
			semconv.ServiceVersion(config.SERVICE_VERSION),
			semconv.DeploymentEnvironmentKey.String(config.PLATFORM_ENV),
		),
	)
	if err != nil {
		log.Fatalf("failed to create resource: %v", err)
	}

	// traceExporter := multiplayer.NewExporter(config.MULTIPLAYER_OTLP_KEY)
	traceExporter, err := otlptracehttp.New(ctx,
		otlptracehttp.WithEndpointURL(config.OTLP_TRACES_ENDPOINT),
		otlptracehttp.WithInsecure(), // If not using HTTPS
	)

	if err != nil {
		return nil, err
	}

	idGenerator = multiplayer.NewRatioDependentIdGenerator()

	traceProvider := trace.NewTracerProvider(
		trace.WithResource(res),
		trace.WithIDGenerator(idGenerator),
		trace.WithSampler(multiplayer.NewSampler(trace.TraceIDRatioBased(config.MULTIPLAYER_OTLP_SPAN_RATIO))),
		trace.WithBatcher(traceExporter,
			trace.WithBatchTimeout(time.Second)),
	)
	return traceProvider, nil
}
