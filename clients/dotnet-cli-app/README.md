# .NET CLI App

A .NET console application that demonstrates the Multiplayer Time Travel platform integration with SessionRecorder.

## Prerequisites

- .NET 9.0 SDK or later
- SessionRecorder library (version 0.0.2)

## Setup

1. Install dependencies:
```bash
dotnet restore
```

2. Set required environment variables:
```bash
export MULTIPLAYER_OTLP_KEY="your-api-key-here"
export VAULT_OF_TIME_SERVICE_URL="https://api.demo.multiplayer.app"
export EPOCH_ENGINE_SERVICE_URL="https://api.demo.multiplayer.app"
export MINDS_OF_TIME_SERVICE_URL="https://api.demo.multiplayer.app"
```

## Running the Application

```bash
dotnet run
```

## Building

```bash
dotnet build
```

## Publishing

```bash
dotnet publish -c Release
```

## Features

- OpenTelemetry integration with SessionRecorder
- HTTP client for API calls
- JSON response formatting
- Environment variable configuration
- Session recording with resource and session attributes
