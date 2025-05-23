package main

import (
	"net/http"

	"go.opentelemetry.io/otel/trace"
)

// attachTraceIDMiddleware adds the trace ID to response headers.
func AttachTraceIDMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		span := trace.SpanFromContext(ctx)
		if sc := span.SpanContext(); sc.HasTraceID() {
			w.Header().Set("X-Trace-ID", sc.TraceID().String())
		}

		next.ServeHTTP(w, r)
	})
}
