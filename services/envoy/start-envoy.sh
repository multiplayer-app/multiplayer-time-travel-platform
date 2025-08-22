#!/bin/sh

# Check if MULTIPLAYER_OTLP_KEY is set and provide a default if not
if [ -z "$MULTIPLAYER_OTLP_KEY" ]; then
    echo "Warning: MULTIPLAYER_OTLP_KEY environment variable is not set"
    echo "Setting it to empty string to avoid JSON parsing errors"
    export MULTIPLAYER_OTLP_KEY=""
fi

# Process the Envoy configuration template with sed
echo "Processing Envoy configuration template..."
sed "s/\${MULTIPLAYER_OTLP_KEY:-}/$MULTIPLAYER_OTLP_KEY/g" /etc/envoy/envoy.yaml > /tmp/envoy.yaml

# Show the processed configuration for debugging
echo "Processed configuration (showing relevant section):"
grep -A 5 -B 5 "otlp_collector_api_key" /tmp/envoy.yaml || echo "API key section not found"

echo "Starting Envoy..."

# Start Envoy with the processed configuration
exec /usr/local/bin/envoy -c /tmp/envoy.yaml --log-level debug
