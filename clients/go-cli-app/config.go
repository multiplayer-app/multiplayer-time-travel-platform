package main

import (
	"os"
	"strconv"
)

var (
	NODE_ENV       = getEnv("NODE_ENV", "development")
	isProduction   = NODE_ENV == "production"
	LOG_LEVEL      = getLogLevel()
	
	COMPONENT_NAME    = getComponentName()
	COMPONENT_VERSION = getEnv("COMPONENT_VERSION", "0.0.1")
	ENVIRONMENT       = getEnv("ENVIRONMENT", "staging")
	
	MULTIPLAYER_OTLP_KEY = getRequiredEnv("MULTIPLAYER_OTLP_KEY")
	
	OTLP_TRACES_ENDPOINT = getEnv("OTLP_TRACES_ENDPOINT", "https://api.multiplayer.app/v1/traces")
	OTLP_LOGS_ENDPOINT   = getEnv("OTLP_LOGS_ENDPOINT", "https://api.multiplayer.app/v1/logs")
	
	MULTIPLAYER_OTLP_SPAN_RATIO = getSpanRatio()
	
	// Service URLs
	DIALOGUE_HUB_SERVICE_URL   = getServiceURL("DIALOGUE_HUB_SERVICE_URL", "dialogue-hub")
	EPOCH_ENGINE_SERVICE_URL   = getServiceURL("EPOCH_ENGINE_SERVICE_URL", "epoch-engine")
	MINDS_OF_TIME_SERVICE_URL  = getServiceURL("MINDS_OF_TIME_SERVICE_URL", "minds-of-time")
	VAULT_OF_TIME_SERVICE_URL  = getServiceURL("VAULT_OF_TIME_SERVICE_URL", "vault-of-time")
)

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getRequiredEnv(key string) string {
	value := os.Getenv(key)
	if value == "" {
		panic("Environment variable " + key + " is required but not set")
	}
	return value
}

func getLogLevel() string {
	if isProduction {
		return getEnv("LOG_LEVEL", "info")
	}
	return getEnv("LOG_LEVEL", "debug")
}

func getComponentName() string {
	// Try to get from npm_package_name first (for compatibility)
	if packageName := os.Getenv("npm_package_name"); packageName != "" {
		// Extract last part after '/'
		parts := []rune(packageName)
		lastSlash := -1
		for i := len(parts) - 1; i >= 0; i-- {
			if parts[i] == '/' {
				lastSlash = i
				break
			}
		}
		if lastSlash >= 0 && lastSlash < len(parts)-1 {
			return string(parts[lastSlash+1:])
		}
		return packageName
	}
	
	// Fallback to SERVICE_NAME or default
	return getEnv("SERVICE_NAME", "cli-example")
}

func getSpanRatio() float64 {
	ratioStr := os.Getenv("MULTIPLAYER_OTLP_SPAN_RATIO")
	if ratioStr == "" {
		return 0.01
	}
	
	ratio, err := strconv.ParseFloat(ratioStr, 64)
	if err != nil {
		return 0.01
	}
	
	return ratio
}

func getServiceURL(envKey, serviceName string) string {
	// Check if specific URL is set
	if url := os.Getenv(envKey); url != "" {
		return url
	}
	
	// Determine base URL based on backend source
	backendSource := getEnv("MULTIPLAYER_BACKEND_SOURCE", "production")
	
	var baseURL string
	switch backendSource {
	case "production":
		baseURL = "https://api.demo.multiplayer.app/v1"
	default:
		baseURL = "http://localhost:3000/v1"
	}
	
	return baseURL + "/" + serviceName
}
