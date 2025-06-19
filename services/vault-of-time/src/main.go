package main

import (
	"context"
	"errors"
	"log"
	"net"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/multiplayer-app/multiplayer-time-travel-platform/services/vault-of-time/src/config"
	_ "github.com/multiplayer-app/multiplayer-time-travel-platform/services/vault-of-time/src/docs"
	health_api "github.com/multiplayer-app/multiplayer-time-travel-platform/services/vault-of-time/src/healthz_api"
	"github.com/multiplayer-app/multiplayer-time-travel-platform/services/vault-of-time/src/vault_of_time_api"

	httpSwagger "github.com/swaggo/http-swagger"
	"go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp"
)

func main() {
	config.LoadConfig()

	if err := run(); err != nil {
		log.Fatalln(err)
	}
}

// @title           Vault of time API
// @version         0.0.1
// @description     This is a sample server.
// @BasePath        /v1/vault-of-time

func run() (err error) {
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt)
	defer stop()

	otelShutdown, err := setupOTelSDK(ctx)
	if err != nil {
		return
	}

	defer func() {
		err = errors.Join(err, otelShutdown(context.Background()))
	}()

	addr := ":" + config.PORT

	srv := &http.Server{
		Addr:         addr,
		BaseContext:  func(_ net.Listener) context.Context { return ctx },
		ReadTimeout:  time.Second,
		WriteTimeout: 10 * time.Second,
		Handler:      newHTTPHandler(),
	}

	log.Printf("Server running at http://localhost%s%s", addr, config.API_PREFIX)
	log.Printf("Swagger docs available at http://localhost%s%s/docs", addr, config.API_PREFIX)

	srvErr := make(chan error, 1)
	go func() {
		srvErr <- srv.ListenAndServe()
	}()

	// Wait for interruption.
	select {
	case err = <-srvErr:
		// Error when starting HTTP server.
		return
	case <-ctx.Done():
		// Wait for first CTRL+C.
		// Stop receiving signal notifications as soon as possible.
		stop()
	}

	// When Shutdown is called, ListenAndServe immediately returns ErrServerClosed.
	err = srv.Shutdown(context.Background())
	return
}

func newHTTPHandler() http.Handler {
	mux := http.NewServeMux()

	handleFunc := func(pattern string, handlerFunc func(http.ResponseWriter, *http.Request)) {
		handler := otelhttp.WithRouteTag(pattern, http.HandlerFunc(handlerFunc))
		mux.Handle(pattern, handler)
	}

	handleFunc(config.API_PREFIX+"/docs/", httpSwagger.WrapHandler)
	handleFunc(config.API_PREFIX+"/docs/*", httpSwagger.WrapHandler)

	handleFunc(config.API_PREFIX+"/healthz", health_api.HealthHandler)
	handleFunc(config.API_PREFIX+"/historical-events", vault_of_time_api.HistoricalEventsHandler)

	handler := otelhttp.NewHandler(
		AttachTraceIDMiddleware(errorMiddleware(mux)),
		"/",
	)

	return corsMiddleware(handler)
}
