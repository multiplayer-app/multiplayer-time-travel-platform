package app.multiplayer.cli;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.time.Duration;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

import app.multiplayer.session_recorder.SessionRecorder;
import app.multiplayer.session_recorder.type.SessionRecorderConfig;
import app.multiplayer.session_recorder.type.Session;
import app.multiplayer.session_recorder.type.SessionType;
import app.multiplayer.cli.OpenTelemetry;
import java.util.concurrent.CompletableFuture;
import app.multiplayer.session_recorder.type.Session;
import java.util.Arrays;
import java.util.List;

public class Main {

    private static final OkHttpClient httpClient = new OkHttpClient.Builder()
        .callTimeout(Duration.ofSeconds(10))
        .build();

    private static void getData(String name, String baseUrl, String endpoint) {
        String url = baseUrl + endpoint;
        Request request = new Request.Builder()
            .url(url)
            .build();

        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                System.out.printf("❌ Error fetching %s: HTTP %d%n", name, response.code());
                return;
            }

            ObjectMapper mapper = new ObjectMapper();
            JsonNode json = mapper.readTree(response.body().string());
            System.out.printf("%n✅ %s response:%n%s%n", name, json.toPrettyString());
        } catch (IOException e) {
            System.out.printf("❌ Error fetching %s: %s%n", name, e.getMessage());
        }
    }

    public static void main(String[] args) {
        // Run the async main method
        CompletableFuture.runAsync(() -> {
            try {
                runAsync();
            } catch (Exception e) {
                System.err.println("❌ Error: " + e.getMessage());
                e.printStackTrace();
            }
        }).join(); // Wait for completion
    }
    
    private static void runAsync() throws Exception {
        // Initialize OpenTelemetry configuration
        OpenTelemetry.initialize();
        
        // Initialize SessionRecorder with API key from environment
        SessionRecorderConfig config = new SessionRecorderConfig();
        config.setApiKey(Config.MULTIPLAYER_OTLP_KEY);
        config.setTraceIdGenerator(OpenTelemetry.getIdGenerator());
        
        SessionRecorder.init(config);

        Session session = new Session();

        session.addResourceAttribute("service.name", "my-service");
        session.addResourceAttribute("service.version", "1.0.0");
        session.addResourceAttribute("deployment.environment", "production");
        session.addResourceAttribute("host.name", "server-01");

        session.addSessionAttribute("userId", "12345");
        session.addSessionAttribute("environment", "production");
        session.addSessionAttribute("version", "1.0.0");
        session.addSessionAttribute("feature", "session-recording");
        
        // session.addTag("environment", "production");
        // session.addTag("version", "v1.0.0");
        // session.addTag("feature", "session-recording");
        session.setName("Multiplayer Time Travel CLI Session");
        
        System.out.println("🚀 Starting Multiplayer Time Travel CLI App...");
        
        System.out.println("📡 Starting session recording...");
        
        // Start session recording and await the result
        try {
            // If SessionRecorder.start returns a CompletableFuture, await it
            Object result = SessionRecorder.start(SessionType.PLAIN, session);
            if (result instanceof CompletableFuture) {
                ((CompletableFuture<?>) result).join();
            }
            System.out.println("✅ Session recording started successfully");
        } catch (Exception e) {
            System.err.println("❌ Failed to start session recording: " + e.getMessage());
            return;
        }

        getData("Vault of Time", Config.VAULT_OF_TIME_SERVICE_URL, "/v1/vault-of-time/historical-events");
        getData("Epoch Engine", Config.EPOCH_ENGINE_SERVICE_URL, "/v1/epoch-engine/epoch");
        getData("Minds of Time", Config.MINDS_OF_TIME_SERVICE_URL, "/v1/minds-of-time/prominent-persons");
        
        System.out.println("✅ All requests completed!");
        
        // Stop session recording and await the result
        try {
            // If SessionRecorder.stop returns a CompletableFuture, await it
            Object result = SessionRecorder.stop(session);
            if (result instanceof CompletableFuture) {
                ((CompletableFuture<?>) result).join();
            }
            System.out.println("✅ Session recording stopped successfully");
        } catch (Exception e) {
            System.err.println("❌ Failed to stop session recording: " + e.getMessage());
        }
    }
}
