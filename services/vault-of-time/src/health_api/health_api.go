package health_api

import (
	"fmt"
	"net/http"
)

// healthHandler godoc
// @Summary      Health check
// @Description  Returns OK if service is running
// @Tags         health
// @Produce      plain
// @Success      200  {string}  string  "OK"
// @Router       /health [get]
func HealthHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "OK")
}
