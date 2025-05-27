package main

import (
	"context"
	"errors"
	"time"

	multiplayer "github.com/multiplayer-app/multiplayer-otlp-go"
	"github.com/multiplayer-app/multiplayer-time-travel-platform/services/vault-of-time/src/config"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracehttp"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/propagation"
	"go.opentelemetry.io/otel/sdk/trace"
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

	// traceExporter := multiplayer.NewExporter(config.MULTIPLAYER_OTLP_KEY)

	traceExporter, err := otlptracehttp.New(ctx,
		otlptracehttp.WithEndpoint(config.OTLP_TRACES_ENDPOINT),
		otlptracehttp.WithInsecure(), // If not using HTTPS
	)

	if err != nil {
		return nil, err
	}

	traceProvider := trace.NewTracerProvider(
		trace.WithIDGenerator(multiplayer.NewRatioDependentIdGenerator(1)),
		trace.WithSampler(multiplayer.NewSampler(trace.TraceIDRatioBased(config.OTLP_MULTIPLAYER_SPAN_RATIO))),
		trace.WithBatcher(traceExporter,
			trace.WithBatchTimeout(time.Second)),
	)
	return traceProvider, nil
}
