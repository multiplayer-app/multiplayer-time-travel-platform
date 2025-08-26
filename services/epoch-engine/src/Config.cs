namespace WebApiOpenApi;

public static class Config
{
    public static string PORT = Environment.GetEnvironmentVariable("PORT") ?? "3000";

    public static readonly string API_PREFIX = Environment.GetEnvironmentVariable("API_PREFIX") ?? "/v1/epoch-engine";

    public static string SERVICE_NAME = Environment.GetEnvironmentVariable("SERVICE_NAME") ?? "epoch-engine";
    public static string SERVICE_VERSION = Environment.GetEnvironmentVariable("SERVICE_VERSION") ?? "0.0.1";
    public static string PLATFORM_ENV = Environment.GetEnvironmentVariable("PLATFORM_ENV") ?? "staging";
    public static string MULTIPLAYER_OTLP_KEY = Environment.GetEnvironmentVariable("MULTIPLAYER_OTLP_KEY") ?? "<multiplayer-key>";
    public static string OTLP_TRACES_ENDPOINT = Environment.GetEnvironmentVariable("OTLP_TRACES_ENDPOINT") ?? $"http://localhost/v1/traces";
    public static string OTLP_LOGS_ENDPOINT = Environment.GetEnvironmentVariable("OTLP_LOGS_ENDPOINT") ?? $"http://localhost/v1/logs";

    public static double MULTIPLAYER_OTLP_SPAN_RATIO = double.TryParse(Environment.GetEnvironmentVariable("MULTIPLAYER_OTLP_SPAN_RATIO"), out var value)
        ? value
        : 0.1;
        
    public static double RANDOM_ERROR_RATE = double.TryParse(Environment.GetEnvironmentVariable("RANDOM_ERROR_RATE"), out var value)
        ? value
        : 0.1;
}
