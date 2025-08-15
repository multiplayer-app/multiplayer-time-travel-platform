using System.Text.Json;
using Multiplayer.SessionRecorder;
using Multiplayer.SessionRecorder.Types;
using Multiplayer.SessionRecorder.Trace;

namespace dotnet_cli_app;

class Program
{
    private static readonly HttpClient httpClient = new HttpClient
    {
        Timeout = TimeSpan.FromSeconds(10)
    };

    static async Task GetDataAsync(string name, string baseUrl, string endpoint)
    {
        var url = $"{baseUrl}{endpoint}";
        try
        {
            var response = await httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();
            
            var content = await response.Content.ReadAsStringAsync();
            var jsonDocument = JsonDocument.Parse(content);
            var formattedJson = JsonSerializer.Serialize(jsonDocument, new JsonSerializerOptions { WriteIndented = true });
            
            Console.WriteLine($"\n✅ {name} response:");
            Console.WriteLine(formattedJson);
        }
        catch (HttpRequestException e)
        {
            Console.WriteLine($"\n❌ Error fetching {name}: {e.Message}");
        }
    }

    static async Task Main(string[] args)
    {
        // Validate required environment variables
        if (string.IsNullOrEmpty(Config.VaultOfTimeServiceUrl) || 
            string.IsNullOrEmpty(Config.EpochEngineServiceUrl) || 
            string.IsNullOrEmpty(Config.MindsOfTimeServiceUrl))
        {
            Console.WriteLine("❗ Please set all required environment variables:");
            Console.WriteLine("  VAULT_OF_TIME_SERVICE_URL, EPOCH_ENGINE_SERVICE_URL, MINDS_OF_TIME_SERVICE_URL");
            return;
        }

Console.WriteLine(Config.MultiplayerOtlpKey);

        var config = new SessionRecorderConfig
        {
            ApiKey = Config.MultiplayerOtlpKey,
            TraceIdGenerator = new SessionRecorderIdGenerator(),
            resourceAttributes = new Dictionary<string, object>
            {
                { "service.name", "test-service" },
                { "service.version", "1.0.0" }
            },
        };

        Multiplayer.SessionRecorder.SessionRecorder.Init(config);

        var session = new Session
        {
            name = "Test Session",
            sessionAttributes = new Dictionary<string, object>
            {
                { "user.id", "12345" },
                { "environment", "test" }
            },
            resourceAttributes = new Dictionary<string, object>
            {
                { "host.name", "test-host" }
            }
        };
        
        Console.WriteLine("📡 Starting session recording...");
        await Multiplayer.SessionRecorder.SessionRecorder.Start(SessionType.PLAIN, session);
        Console.WriteLine("✅ Session recording started successfully");


        Console.WriteLine("🚀 Starting Multiplayer Time Travel CLI App...");
        
        Console.WriteLine("📡 Session recording integration pending...");

        // Make API calls
        await GetDataAsync("Vault of Time", Config.VaultOfTimeServiceUrl, "/v1/vault-of-time/historical-events");
        await GetDataAsync("Epoch Engine", Config.EpochEngineServiceUrl, "/v1/epoch-engine/epoch");
        await GetDataAsync("Minds of Time", Config.MindsOfTimeServiceUrl, "/v1/minds-of-time/prominent-persons");

        Console.WriteLine("📡 Stopping session recording...");
        await Multiplayer.SessionRecorder.SessionRecorder.Stop(session);
        Console.WriteLine("✅ Session recording stopped successfully");
        
        Console.WriteLine("✅ All requests completed!");
    }
}
