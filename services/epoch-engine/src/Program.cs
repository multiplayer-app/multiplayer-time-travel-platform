using System.Diagnostics;
using OpenTelemetry.Logs;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using OpenTelemetry.Exporter;
using OpenTelemetry;
using NetEscapades.AspNetCore.SecurityHeaders.Infrastructure;
using WebApiOpenApi;
using Multiplayer.SessionRecorder;
using Multiplayer.SessionRecorder.Types;
using Multiplayer.SessionRecorder.Trace;
using Multiplayer.SessionRecorder.Sdk;

SessionRecorderTraceIdConfiguration.ConfigureSessionRecorderTraceIdGenerator();

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls($"http://0.0.0.0:{Config.PORT}");

var otlpExporterHeaders = string.IsNullOrEmpty(Environment.GetEnvironmentVariable("MULTIPLAYER_OTLP_KEY"))
    ? null
    : $"Authorization={Config.MULTIPLAYER_OTLP_KEY}";

var logExporter = new OtlpLogExporter(new OtlpExporterOptions
{
    Endpoint = new Uri(Config.OTLP_LOGS_ENDPOINT),
    Headers = otlpExporterHeaders,
    Protocol = OpenTelemetry.Exporter.OtlpExportProtocol.HttpProtobuf,
});

var traceExporter = new OtlpTraceExporter(new OtlpExporterOptions
{
    Endpoint = new Uri(Config.OTLP_TRACES_ENDPOINT),
    Headers = otlpExporterHeaders,
    Protocol = OtlpExportProtocol.HttpProtobuf,
});

var resourceBuilder =
    ResourceBuilder
        .CreateDefault()
        .AddService(serviceName: Config.SERVICE_NAME, serviceVersion: Config.SERVICE_VERSION)
        .AddAttributes(new Dictionary<string, object>
        {
            ["deployment.environment"] = Config.PLATFORM_ENV,
            ["service.instance.id"] = Environment.MachineName
        });
builder.Services.AddCors(options =>
   {
    options.AddPolicy(name: "AllowAllOrigins",
        configurePolicy: policy =>
        {
            policy.AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
   });
builder.Services.AddOpenTelemetry()
    .WithTracing(tracing =>
    {
        tracing
            .SetResourceBuilder(resourceBuilder)
            .AddHttpClientInstrumentation()
            .AddAspNetCoreInstrumentation()
            .SetSampler(new SessionRecorderTraceIdRatioBasedSampler(Config.MULTIPLAYER_OTLP_SPAN_RATIO))
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

app.UseCors("AllowAllOrigins");

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
