package app.multiplayer.demo.opentelemetry;

// import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class Config {

    public static String OPENROUTER_API_KEY = System.getenv("OPENROUTER_API_KEY");
    public static String OPENROUTER_API_URL = System.getenv("OPENROUTER_API_URL") != null && !System.getenv("OPENROUTER_API_URL").isEmpty()
        ? System.getenv("OPENROUTER_API_URL")
        : "https://openrouter.ai/api/v1/chat/completions";
    
    public static String PORT = System.getenv("PORT") != null && !System.getenv("PORT").isEmpty()
        ? System.getenv("PORT")
        : "8080";
    public static String SERVICE_NAME = System.getenv("SERVICE_NAME") != null && !System.getenv("SERVICE_NAME").isEmpty() 
        ? System.getenv("SERVICE_NAME")
        : "<example-service-name>"; 
    public static String SERVICE_VERSION = System.getenv("SERVICE_VERSION") != null && !System.getenv("SERVICE_VERSION").isEmpty() 
        ? System.getenv("SERVICE_VERSION")
        : "<service-version>";
    public static String PLATFORM_ENV = System.getenv("PLATFORM_ENV") != null && !System.getenv("PLATFORM_ENV").isEmpty()
        ? System.getenv("PLATFORM_ENV")
        : "<environment-name>";
    public static String MULTIPLAYER_OTLP_KEY = System.getenv("MULTIPLAYER_OTLP_KEY") != null && !System.getenv("MULTIPLAYER_OTLP_KEY").isEmpty()
        ? System.getenv("MULTIPLAYER_OTLP_KEY")
        : "";
    public static String OTLP_TRACES_ENDPOINT = System.getenv("OTLP_TRACES_ENDPOINT") != null && !System.getenv("OTLP_TRACES_ENDPOINT").isEmpty()
        ? System.getenv("OTLP_TRACES_ENDPOINT")
        : "https://api.multiplayer.app/v1/traces";


    public static String OTLP_LOGS_ENDPOINT = System.getenv("OTLP_LOGS_ENDPOINT") != null && !System.getenv("OTLP_LOGS_ENDPOINT").isEmpty()
        ? System.getenv("OTLP_LOGS_ENDPOINT")
        : "https://api.multiplayer.app/v1/logs";
    public static String API_PREFIX = System.getenv("API_PREFIX") != null && !System.getenv("API_PREFIX").isEmpty()
        ? System.getenv("API_PREFIX")
        : "/v1/dialogue-hub";
    public static double OTLP_MULTIPLAYER_DOC_SPAN_RATIO = System.getenv("OTLP_MULTIPLAYER_DOC_SPAN_RATIO") != null && !System.getenv("OTLP_MULTIPLAYER_DOC_SPAN_RATIO").isEmpty()
        ? Integer.parseInt(System.getenv("OTLP_MULTIPLAYER_DOC_SPAN_RATIO"))
        : 0.02;
    public static double OTLP_MULTIPLAYER_SPAN_RATIO = System.getenv("OTLP_MULTIPLAYER_SPAN_RATIO") != null && !System.getenv("OTLP_MULTIPLAYER_SPAN_RATIO").isEmpty()
        ? Integer.parseInt(System.getenv("OTLP_MULTIPLAYER_SPAN_RATIO"))
        : 0.01;
}
