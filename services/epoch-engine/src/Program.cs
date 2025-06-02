using System.Diagnostics;
using OpenTelemetry.Logs;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using OpenTelemetry;
using NetEscapades.AspNetCore.SecurityHeaders.Infrastructure;
using WebApiOpenApi;
using Multiplayer.OpenTelemetry.Exporter;
using Multiplayer.OpenTelemetry.Trace;

MultiplayerTraceIdConfiguration.ConfigureMultiplayerTraceIdGenerator(Config.OTLP_MULTIPLAYER_DOC_SPAN_RATIO);

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls($"http://0.0.0.0:{Config.PORT}");

var logExporter = new MultiplayerOtlpHttpLogsExporter(
    Config.MULTIPLAYER_OTLP_KEY,
    new Uri(Config.OTLP_TRACES_ENDPOINT)
);
// var logExporter = new OtlpHttpLogExporter(new OtlpExporterOptions
// {
//     Endpoint = new Uri(Config.OTLP_LOGS_ENDPOINT),
//     Protocol = OpenTelemetry.Exporter.OtlpExportProtocol.HttpProtobuf,
// });

var traceExporter = new MultiplayerOtlpHttpTracesExporter(
    Config.MULTIPLAYER_OTLP_KEY,
    new Uri(Config.OTLP_TRACES_ENDPOINT)
);
// var traceExporter = new OtlpHttpTraceExporter(new OtlpExporterOptions
// {
//     Endpoint = new Uri(Config.OTLP_TRACES_ENDPOINT),
//     Protocol = OtlpExportProtocol.HttpProtobuf,
// })

builder.Services.AddOpenTelemetry()
    .ConfigureResource(resource =>
    {
        resource.AddService(
            serviceName: Config.SERVICE_NAME,
            serviceNamespace: Config.PLATFORM_ENV,
            serviceVersion: Config.SERVICE_VERSION,
            serviceInstanceId: Environment.MachineName
        )
        .AddAttributes(new Dictionary<string, object>
        {
            { "deployment.environment", Config.PLATFORM_ENV },
            { "service.name", Config.SERVICE_NAME },
        });
    })
    .WithTracing(tracing =>
    {
        tracing.AddHttpClientInstrumentation()
            .AddAspNetCoreInstrumentation()
            .SetSampler(new MultiplayerTraceIdRatioBasedSampler(Config.OTLP_MULTIPLAYER_SPAN_RATIO))
            .AddProcessor(new SimpleActivityExportProcessor(traceExporter));
    })
    .WithLogging(logs => logs.AddProcessor(new BatchLogRecordExportProcessor(logExporter)));

builder.Services.AddControllers(options =>
{
    options.Conventions.Insert(0, new RoutePrefixConvention(Config.API_PREFIX));
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "Epoch Engine API", Version = "v1" });
});

builder.Services.AddSecurityHeaderPolicies()
    .SetPolicySelector((PolicySelectorContext ctx) =>
    {
        return SecurityHeadersDefinitionsAPI.GetHeaderPolicyCollection(true);
    });

var app = builder.Build();

app.Use(async (context, next) =>
{
    var traceId = Activity.Current?.TraceId.ToString();
    if (!string.IsNullOrEmpty(traceId))
    {
        context.Response.Headers.Append("X-Trace-Id", traceId);
    }

    await next();
});

app.UseSecurityHeaders();
app.UseSwagger(options =>
{
    options.RouteTemplate = $"{Config.API_PREFIX.Substring(1)}/docs/{{documentName}}/swagger.json";
});
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint($"{Config.API_PREFIX}/docs/v1/swagger.json", "v1");
    options.RoutePrefix = $"{Config.API_PREFIX.Substring(1)}/docs";
});

app.UseRandomErrorMiddleware(Config.RANDOM_ERROR_RATE);

app.UseRouting();
app.MapControllers();

app.Run();
