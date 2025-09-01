namespace dotnet_cli_app;

public static class Config
{
    public static string ServiceName => Environment.GetEnvironmentVariable("SERVICE_NAME") ?? "dotnet-cli-app";
    public static string ServiceVersion => Environment.GetEnvironmentVariable("SERVICE_VERSION") ?? "0.0.1";
    public static string PlatformEnv => Environment.GetEnvironmentVariable("PLATFORM_ENV") ?? "staging";
    
    public static double MultiplayerOtlpSpanRatio => 
        double.TryParse(Environment.GetEnvironmentVariable("MULTIPLAYER_OTLP_SPAN_RATIO"), out var ratio) ? ratio : 0.01;
    
    public static string MultiplayerOtlpKey => Environment.GetEnvironmentVariable("MULTIPLAYER_OTLP_KEY") ?? "";
    public static string OtlpTracesEndpoint => Environment.GetEnvironmentVariable("OTLP_TRACES_ENDPOINT") ?? "https://api.multiplayer.app/v1/traces";
    public static string OtlpLogsEndpoint => Environment.GetEnvironmentVariable("OTLP_LOGS_ENDPOINT") ?? "https://api.multiplayer.app/v1/logs";
    
    public static string MultiplayerBackendSource => Environment.GetEnvironmentVariable("MULTIPLAYER_BACKEND_SOURCE") ?? "production";

    // Service URLs with backend source switching
    public static string DialogueHubServiceUrl
    {
        get
        {
            var envUrl = Environment.GetEnvironmentVariable("DIALOGUE_HUB_SERVICE_URL");
            if (!string.IsNullOrEmpty(envUrl)) return envUrl;
            
            return MultiplayerBackendSource == "production" 
                ? "https://api.demo.multiplayer.app/v1/dialogue-hub"
                : "http://localhost:3000/v1/dialogue-hub";
        }
    }

    public static string EpochEngineServiceUrl
    {
        get
        {
            var envUrl = Environment.GetEnvironmentVariable("EPOCH_ENGINE_SERVICE_URL");
            if (!string.IsNullOrEmpty(envUrl)) return envUrl;
            
            return MultiplayerBackendSource == "production" 
                ? "https://api.demo.multiplayer.app/v1/epoch-engine"
                : "http://localhost:3000/v1/epoch-engine";
        }
    }

    public static string MindsOfTimeServiceUrl
    {
        get
        {
            var envUrl = Environment.GetEnvironmentVariable("MINDS_OF_TIME_SERVICE_URL");
            if (!string.IsNullOrEmpty(envUrl)) return envUrl;
            
            return MultiplayerBackendSource == "production" 
                ? "https://api.demo.multiplayer.app/v1/minds-of-time"
                : "http://localhost:3000/v1/minds-of-time";
        }
    }

    public static string VaultOfTimeServiceUrl
    {
        get
        {
            var envUrl = Environment.GetEnvironmentVariable("VAULT_OF_TIME_SERVICE_URL");
            if (!string.IsNullOrEmpty(envUrl)) return envUrl;
            
            return MultiplayerBackendSource == "production" 
                ? "https://api.demo.multiplayer.app/v1/vault-of-time"
                : "http://localhost:3000/v1/vault-of-time";
        }
    }
}
