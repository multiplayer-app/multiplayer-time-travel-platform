namespace WebApiOpenApi;

public static class Config
{

    // public static string API_PREFIX = Environment.GetEnvironmentVariable("API_PREFIX") ?? "/v1/epoch-engine";
    public static readonly string API_PREFIX = Environment.GetEnvironmentVariable("API_PREFIX") ?? "/v1/epoch-engine";

    public static string SERVICE_NAME = Environment.GetEnvironmentVariable("SERVICE_NAME") ?? "<example-service-name>";
    public static string SERVICE_VERSION = Environment.GetEnvironmentVariable("SERVICE_VERSION") ?? "<service-version>";
    public static string PLATFORM_ENV = Environment.GetEnvironmentVariable("PLATFORM_ENV") ?? "<environment-name>";
    public static string MULTIPLAYER_OTLP_KEY = Environment.GetEnvironmentVariable("MULTIPLAYER_OTLP_KEY") ?? "<multiplayer-key>";
    public static string OTLP_TRACES_ENDPOINT = Environment.GetEnvironmentVariable("OTLP_TRACES_ENDPOINT") ?? $"http://localhost/v1/traces";
    public static string OTLP_LOGS_ENDPOINT = Environment.GetEnvironmentVariable("OTLP_LOGS_ENDPOINT") ?? $"http://localhost/v1/logs";
}
