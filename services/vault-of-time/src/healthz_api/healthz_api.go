package health_api

import (
	"net/http"
)

// healthHandler godoc
// @Summary      Health check
// @Description  Returns OK if service is running
// @Tags         health
// @Produce      plain
// @Success      200 {string} string "OK"
// @Router       /healthz [get]
func HealthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/plain")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("OK"))
}
