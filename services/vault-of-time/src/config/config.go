package config

import (
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

var (
	PORT                            string
	API_PREFIX                      string
	MULTIPLAYER_OTLP_KEY            string
	OTLP_TRACES_ENDPOINT            string
	OTLP_LOGS_ENDPOINT              string
	OTLP_MULTIPLAYER_DOC_SPAN_RATIO float64
	OTLP_MULTIPLAYER_SPAN_RATIO     float64
	SERVICE_NAME                    string
	SERVICE_VERSION                 string
	PLATFORM_ENV                    string
	RANDOM_ERROR_RATE               float64
)

func LoadConfig() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found — using defaults or environment variables.")
	}

	PORT = getEnv("PORT", "3000")
	API_PREFIX = getEnv("API_PREFIX", "/v1/vault-of-time")

	MULTIPLAYER_OTLP_KEY = getEnv("MULTIPLAYER_OTLP_KEY", "")
	OTLP_TRACES_ENDPOINT = getEnv("OTLP_TRACES_ENDPOINT", "https://api.multiplayer.app/v1/traces")
	OTLP_LOGS_ENDPOINT = getEnv("OTLP_LOGS_ENDPOINT", "https://api.multiplayer.app/v1/logs")

	var parseDocSpanRatioErr error
	OTLP_MULTIPLAYER_DOC_SPAN_RATIO, parseDocSpanRatioErr = strconv.ParseFloat(getEnv("OTLP_MULTIPLAYER_DOC_SPAN_RATIO", "0.02"), 64)
	if parseDocSpanRatioErr != nil {
		OTLP_MULTIPLAYER_DOC_SPAN_RATIO = 0.02
	}

	var parseSpanRatioErr error
	OTLP_MULTIPLAYER_SPAN_RATIO, parseSpanRatioErr = strconv.ParseFloat(getEnv("OTLP_MULTIPLAYER_SPAN_RATIO", "0.01"), 64)
	if parseSpanRatioErr != nil {
		OTLP_MULTIPLAYER_DOC_SPAN_RATIO = 0.02
	}

	var parseRandomErrRateErr error
	RANDOM_ERROR_RATE, parseRandomErrRateErr = strconv.ParseFloat(getEnv("RANDOM_ERROR_RATE", "0.4"), 64)
	if parseRandomErrRateErr != nil {
		RANDOM_ERROR_RATE = 0.4
	}

	SERVICE_NAME = getEnv("SERVICE_NAME", "<example-service-name>")
	SERVICE_VERSION = getEnv("SERVICE_VERSION", "<service-version>")
	PLATFORM_ENV = getEnv("PLATFORM_ENV", "<environment-name>")
}

func getEnv(key, defaultVal string) string {
	if value, exists := os.LookupEnv(key); exists && value != "" {
		return value
	}
	return defaultVal
}
