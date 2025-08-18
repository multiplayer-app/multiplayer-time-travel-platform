#!/bin/bash

echo "🔍 Testing Envoy Configuration Compatibility"
echo "============================================"

# Test with v1.28 (known working)
echo "1. Testing with Envoy v1.28 (known working)..."
docker run --rm -v $(pwd)/envoy-test-extension.yaml:/etc/envoy/envoy.yaml \
  -v $(pwd)/extensions/payload-otlp/target/wasm32-wasip1/release/otlp_capture_payload.wasm:/etc/istio/extensions/otlp_capture_payload.wasm \
  envoyproxy/envoy:v1.28-latest /usr/local/bin/envoy -c /etc/envoy/envoy.yaml --mode validate 2>&1 | head -20

echo -e "\n2. Testing with Envoy v1.33 (problematic)..."
docker run --rm -v $(pwd)/envoy-test-extension.yaml:/etc/envoy/envoy.yaml \
  -v $(pwd)/extensions/payload-otlp/target/wasm32-wasip1/release/otlp_capture_payload.wasm:/etc/istio/extensions/otlp_capture_payload.wasm \
  envoyproxy/envoy:v1.33-latest /usr/local/bin/envoy -c /etc/envoy/envoy.yaml --mode validate 2>&1 | head -20

echo -e "\n3. Checking Envoy v1.33 startup with full logs..."
docker run --rm -v $(pwd)/envoy-test-extension.yaml:/etc/envoy/envoy.yaml \
  -v $(pwd)/extensions/payload-otlp/target/wasm32-wasip1/release/otlp_capture_payload.wasm:/etc/istio/extensions/otlp_capture_payload.wasm \
  envoyproxy/envoy:v1.33-latest /usr/local/bin/envoy -c /etc/envoy/envoy.yaml --log-level debug 2>&1 | head -30

echo -e "\n4. Common v1.33 compatibility issues:"
echo "   - WASM runtime changes"
echo "   - Filter configuration format changes"
echo "   - Protobuf message format changes"
echo "   - Deprecated field usage"
