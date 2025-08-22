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
    
    public static string VaultOfTimeServiceUrl => Environment.GetEnvironmentVariable("VAULT_OF_TIME_SERVICE_URL") ?? "";
    public static string EpochEngineServiceUrl => Environment.GetEnvironmentVariable("EPOCH_ENGINE_SERVICE_URL") ?? "";
    public static string MindsOfTimeServiceUrl => Environment.GetEnvironmentVariable("MINDS_OF_TIME_SERVICE_URL") ?? "";
}
