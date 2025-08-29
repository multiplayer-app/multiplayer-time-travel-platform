![Description](./docs/img/header-dotnet.png)

<div align="center">
<a href="https://github.com/multiplayer-app/multiplayer-time-travel-platform">
  <img src="https://img.shields.io/github/stars/multiplayer-app/multiplayer-time-travel-platform.svg?style=social&label=Star&maxAge=2592000" alt="GitHub stars">
</a>
  <a href="https://github.com/multiplayer-app/multiplayer-time-travel-platform/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/multiplayer-app/multiplayer-time-travel-platform" alt="License">
  </a>
  <a href="https://multiplayer.app">
    <img src="https://img.shields.io/badge/Visit-multiplayer.app-blue" alt="Visit Multiplayer">
  </a>
  
</div>
<div>
  <p align="center">
    <a href="https://x.com/trymultiplayer">
      <img src="https://img.shields.io/badge/Follow%20on%20X-000000?style=for-the-badge&logo=x&logoColor=white" alt="Follow on X" />
    </a>
    <a href="https://www.linkedin.com/company/multiplayer-app/">
      <img src="https://img.shields.io/badge/Follow%20on%20LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="Follow on LinkedIn" />
    </a>
    <a href="https://discord.com/invite/q9K3mDzfrx">
      <img src="https://img.shields.io/badge/Join%20our%20Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white" alt="Join our Discord" />
    </a>
  </p>
</div>

## .Net cli example app

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

## License

MIT — see [LICENSE](./LICENSE).
