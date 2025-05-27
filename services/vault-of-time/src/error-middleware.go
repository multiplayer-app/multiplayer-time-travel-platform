package main

import (
	"encoding/json"
	"math"
	"math/rand"
	"net/http"
	"strconv"
	"strings"

	"github.com/multiplayer-app/multiplayer-time-travel-platform/services/vault-of-time/src/config"
	"go.opentelemetry.io/otel/trace"
)

type errorResponse struct {
	Message string `json:"message"`
	Code    string `json:"code"`
}

var funnyMessages = []string{
	"Time slipped on a banana peel.",
	"A squirrel chewed through the time wires.",
	"Temporal vortex needs a coffee break.",
	"Chrono-hamsters are on strike.",
	"Oops! We spilled tea on the timeline.",
	"404: Quantum cheese not found.",
	"Vault door jammed by a dad joke.",
	"Gremlins altered the causal loop again.",
}

// errorMiddleware wraps an http.Handler and injects errors based on trace ID
func errorMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if strings.Contains(r.URL.Path, "/docs") || strings.Contains(r.URL.Path, "/health") {
			// next.ServeHTTP(w, r)
			next.ServeHTTP(w, r)
			return
		}

		ctx := r.Context()
		span := trace.SpanFromContext(ctx)
		sc := span.SpanContext()

		errorRate := config.RANDOM_ERROR_RATE

		// Override with query param if provided
		if q := r.URL.Query().Get("errorRate"); q != "" {
			if f, err := strconv.ParseFloat(q, 64); err == nil && f >= 0 && f <= 1 {
				errorRate = f
			}
		}

		if sc.HasTraceID() {
			traceID := sc.TraceID().String()
			seed := hashString(traceID)
			rng := rand.New(rand.NewSource(seed))

			if rng.Float64() < errorRate {
				msg := funnyMessages[rng.Intn(len(funnyMessages))]
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusInternalServerError)
				json.NewEncoder(w).Encode(errorResponse{
					Message: msg,
					Code:    "WARP_ENGINE_FAILURE",
				})
				return
			}
		}

		next.ServeHTTP(w, r)
	})
}

// Deterministic string hash to int64
func hashString(s string) int64 {
	var h uint64 = 14695981039346656037
	for _, c := range s {
		h ^= uint64(c)
		h *= 1099511628211
	}
	return int64(h % math.MaxInt64)
}
