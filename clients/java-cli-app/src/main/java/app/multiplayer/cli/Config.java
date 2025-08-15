package app.multiplayer.cli;

public class Config {
    public static String SERVICE_NAME = System.getenv("SERVICE_NAME") != null && !System.getenv("SERVICE_NAME").isEmpty() 
        ? System.getenv("SERVICE_NAME")
        : "dialogue-hub"; 
    public static String SERVICE_VERSION = System.getenv("SERVICE_VERSION") != null && !System.getenv("SERVICE_VERSION").isEmpty() 
        ? System.getenv("SERVICE_VERSION")
        : "0.0.1";
    public static String PLATFORM_ENV = System.getenv("PLATFORM_ENV") != null && !System.getenv("PLATFORM_ENV").isEmpty()
        ? System.getenv("PLATFORM_ENV")
        : "staging";

    public static double MULTIPLAYER_OTLP_SPAN_RATIO = System.getenv("MULTIPLAYER_OTLP_SPAN_RATIO") != null && !System.getenv("MULTIPLAYER_OTLP_SPAN_RATIO").isEmpty()
        ? Double.parseDouble(System.getenv("MULTIPLAYER_OTLP_SPAN_RATIO"))
        : 0.01;


    public static String MULTIPLAYER_OTLP_KEY = System.getenv("MULTIPLAYER_OTLP_KEY") != null && !System.getenv("MULTIPLAYER_OTLP_KEY").isEmpty()
        ? System.getenv("MULTIPLAYER_OTLP_KEY")
        : "";
    public static String OTLP_TRACES_ENDPOINT = System.getenv("OTLP_TRACES_ENDPOINT") != null && !System.getenv("OTLP_TRACES_ENDPOINT").isEmpty()
        ? System.getenv("OTLP_TRACES_ENDPOINT")
        : "https://api.multiplayer.app/v1/traces";
    public static String OTLP_LOGS_ENDPOINT = System.getenv("OTLP_LOGS_ENDPOINT") != null && !System.getenv("OTLP_LOGS_ENDPOINT").isEmpty()
        ? System.getenv("OTLP_LOGS_ENDPOINT")
        : "https://api.multiplayer.app/v1/logs";

    public static String VAULT_OF_TIME_SERVICE_URL = System.getenv("VAULT_OF_TIME_SERVICE_URL");
    public static String EPOCH_ENGINE_SERVICE_URL = System.getenv("EPOCH_ENGINE_SERVICE_URL");
    public static String MINDS_OF_TIME_SERVICE_URL = System.getenv("MINDS_OF_TIME_SERVICE_URL");
}
