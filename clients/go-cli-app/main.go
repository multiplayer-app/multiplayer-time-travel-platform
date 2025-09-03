package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/multiplayer-app/multiplayer-otlp-go/session_recorder"
	"github.com/multiplayer-app/multiplayer-otlp-go/types"
	"go.opentelemetry.io/otel/attribute"
)

func main() {
	// Initialize session recorder
	sr := session_recorder.NewSessionRecorder()
	
	// Get trace ID generator from OpenTelemetry setup
	idGenerator := getIdGenerator()
	
	config := session_recorder.SessionRecorderConfig{
		APIKey:           MULTIPLAYER_OTLP_KEY,
		TraceIDGenerator: idGenerator,
		ResourceAttributes: map[string]interface{}{
			"componentName":    COMPONENT_NAME,
			"componentVersion": COMPONENT_VERSION,
			"environment":      ENVIRONMENT,
		},
	}
	
	err := sr.Init(config)
	if err != nil {
		log.Fatalf("Failed to initialize session recorder: %v", err)
	}
	
	// Start a debug session
	session := &session_recorder.Session{
		Name: "Test Go CLI app debug session",
		ResourceAttributes: map[string]interface{}{
			"version": 1,
		},
	}
	
	err = sr.Start(types.SESSION_TYPE_PLAIN, session)
	if err != nil {
		log.Fatalf("Failed to start session: %v", err)
	}
	
	fmt.Println("Debug session started successfully")
	
	// Simulate some work
	ctx := context.Background()
	doSomeWork(ctx)
	
	// Stop the session
	err = sr.Stop(nil)
	if err != nil {
		log.Fatalf("Failed to stop session: %v", err)
	}
	
	fmt.Println("Debug session stopped successfully")
	
	// Wait for telemetry to be exported
	fmt.Println("Waiting for telemetry export...")
	time.Sleep(15 * time.Second)
	
	fmt.Println("Exiting...")
	os.Exit(0)
}

// doSomeWork simulates application work with tracing
func doSomeWork(ctx context.Context) {
	tracer := getTracer()
	
	ctx, span := tracer.Start(ctx, "main-work")
	defer span.End()
	
	fmt.Println("Doing some work...")
	
	// Simulate multiple operations
	for i := 0; i < 5; i++ {
		_, childSpan := tracer.Start(ctx, fmt.Sprintf("operation-%d", i+1))
		
		// Simulate work
		time.Sleep(100 * time.Millisecond)
		
		childSpan.SetAttributes(
			attribute.String("operation.id", fmt.Sprintf("op-%d", i+1)),
			attribute.Int("operation.index", i),
		)
		
		childSpan.End()
	}
	
	fmt.Println("Work completed")
}
