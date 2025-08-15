#!/bin/bash

# Build script for Envoy OTLP Extension

set -e

echo "Building Envoy OTLP Extension..."
echo "================================="

# Check if Rust is installed
if ! command -v cargo &> /dev/null; then
    echo "Error: Rust is not installed. Please install Rust first."
    echo "Visit: https://rustup.rs/"
    exit 1
fi

# Detect OS and set appropriate WASM target
if [[ "$OSTYPE" == "darwin"* ]]; then
    WASM_TARGET="wasm32-wasip1"
    echo "Detected macOS, using target: $WASM_TARGET"
else
    WASM_TARGET="wasm32-wasi"
    echo "Detected non-macOS system, using target: $WASM_TARGET"
fi

# Check if the appropriate WASM target is installed
if ! rustup target list | grep -q "$WASM_TARGET (installed)"; then
    echo "Installing $WASM_TARGET target..."
    rustup target add $WASM_TARGET
fi

# Clean previous builds
echo "Cleaning previous builds..."
cargo clean

# Build the extension
echo "Building extension..."
cargo build --target $WASM_TARGET --release

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "WASM file location:"
    echo "  target/$WASM_TARGET/release/otlp_capture_payload.wasm"
    echo ""
    echo "File size:"
    ls -lh target/$WASM_TARGET/release/otlp_capture_payload.wasm
    echo ""
    echo "Next steps:"
    echo "1. Copy the WASM file to your Envoy container"
    echo "2. Update your Envoy configuration"
    echo "3. Restart Envoy"
    echo ""
    echo "To test with Docker Compose:"
    echo "  docker-compose up --build"
    echo ""
    echo "To run tests:"
    echo "  ./test.sh"
else
    echo "❌ Build failed!"
    exit 1
fi
