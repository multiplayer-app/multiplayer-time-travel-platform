package app.multiplayer.demo.opentelemetry;

// import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class Config {

    public static String OPENAI_API_KEY = System.getenv("OPENAI_API_KEY");
    public static String OPENAI_API_URL = System.getenv("OPENAI_API_URL") != null && !System.getenv("OPENAI_API_URL").isEmpty()
        ? System.getenv("OPENAI_API_URL")
        : "https://openrouter.ai/api/v1/chat/completions";
    public static String OPENAI_MODEL = System.getenv("OPENAI_MODEL") != null && !System.getenv("OPENAI_MODEL").isEmpty()
        ? System.getenv("OPENAI_MODEL")
        : "morph/morph-v2";
    
    public static String PORT = System.getenv("PORT") != null && !System.getenv("PORT").isEmpty()
        ? System.getenv("PORT")
        : "8080";
    public static String SERVICE_NAME = System.getenv("SERVICE_NAME") != null && !System.getenv("SERVICE_NAME").isEmpty() 
        ? System.getenv("SERVICE_NAME")
        : "dialogue-hub"; 
    public static String SERVICE_VERSION = System.getenv("SERVICE_VERSION") != null && !System.getenv("SERVICE_VERSION").isEmpty() 
        ? System.getenv("SERVICE_VERSION")
        : "0.0.1";
    public static String PLATFORM_ENV = System.getenv("PLATFORM_ENV") != null && !System.getenv("PLATFORM_ENV").isEmpty()
        ? System.getenv("PLATFORM_ENV")
        : "staging";
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
        ? Double.parseDouble(System.getenv("OTLP_MULTIPLAYER_DOC_SPAN_RATIO"))
        : 0.02;
    public static double OTLP_MULTIPLAYER_SPAN_RATIO = System.getenv("OTLP_MULTIPLAYER_SPAN_RATIO") != null && !System.getenv("OTLP_MULTIPLAYER_SPAN_RATIO").isEmpty()
        ? Double.parseDouble(System.getenv("OTLP_MULTIPLAYER_SPAN_RATIO"))
        : 0.01;

    public static String REDIS_HOST = System.getenv("REDIS_HOST") != null && !System.getenv("REDIS_HOST").isEmpty() 
        ? System.getenv("REDIS_HOST")
        : "localhost";
    public static Integer REDIS_PORT = System.getenv("REDIS_PORT") != null && !System.getenv("REDIS_PORT").isEmpty() 
        ? Integer.parseInt(System.getenv("REDIS_PORT"))
        : 6379;

    public static double RANDOM_ERROR_RATE = System.getenv("RANDOM_ERROR_RATE") != null && !System.getenv("RANDOM_ERROR_RATE").isEmpty()
        ? Double.parseDouble(System.getenv("RANDOM_ERROR_RATE"))
        : 0.1;
}
