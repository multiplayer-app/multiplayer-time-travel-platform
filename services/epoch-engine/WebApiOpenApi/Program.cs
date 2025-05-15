using System.Diagnostics;
using OpenTelemetry.Logs;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using OpenTelemetry;
using Microsoft.AspNetCore.Authentication;
using System.Globalization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using NetEscapades.AspNetCore.SecurityHeaders.Infrastructure;
using WebApiOpenApi;
using Multiplayer.OpenTelemetry.Exporter;
using Multiplayer.OpenTelemetry.Trace;


// prod
// var MultiplayerApiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbnRlZ3JhdGlvbiI6IjY3ZWIyZDhiYjhiZTE0YjU2YTM5N2U5NiIsIndvcmtzcGFjZSI6IjY1ODQxY2ZkZjkxNmJiYTBkMGJhYmFmZCIsInByb2plY3QiOiI2N2ViMmQ3NGJhODJhYmU5NDIxNGIzOTgiLCJ0eXBlIjoiT1RFTCIsImlhdCI6MTc0MzQ2NTg2N30.AtpKlc2n08ViAvCaUMB81ijjr7ITlBNlN1KT-0w1rUA";

// local
// var MultiplayerApiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbnRlZ3JhdGlvbiI6IjY3ZWMyMTUxNTljYzA1NzUzYmQ5MmQ0OCIsIndvcmtzcGFjZSI6IjY3ZWMyMTNiZDg2Nzg5YmE2ZGEwYjkzNSIsInByb2plY3QiOiI2N2VjMjE0NWQ4Njc4OWJhNmRhMGI5OTQiLCJ0eXBlIjoiT1RFTCIsImlhdCI6MTc0MzUyODI3M30.8d88ddk2naUtRAsPL4YO69jhRyrY6FPQpcozZDgwI2k";

var builder = WebApplication.CreateBuilder(args);

const string SERVICE_NAME = "<example-service-name>";
const string SERVICE_VERSION = "<service-version>";
const string environment = "<environment-name>";
const string MULTIPLAYER_OTLP_KEY = "<multiplayer-key>";

MultiplayerTraceIdConfiguration.ConfigureMultiplayerTraceIdGenerator(0.5);

builder.Services.AddOpenTelemetry()
    .ConfigureResource(resource =>
    {
        resource.AddService(
            serviceName: builder.Configuration.GetValue<string>("ServiceName", SERVICE_NAME)!,
            serviceNamespace: environment,
            serviceVersion: typeof(Program).Assembly.GetName().Version?.ToString() ?? SERVICE_VERSION,
            serviceInstanceId: Environment.MachineName
        )
        // Adding more resource attributes (optional)
        .AddAttributes(new Dictionary<string, object>
        {
            { "deployment.environment", environment },
            { "service.name", builder.Configuration.GetValue<string>("ServiceName", SERVICE_NAME) },
            // Add any additional custom attributes here
        });
    })
    .WithTracing(tracing =>
    {
        tracing.AddHttpClientInstrumentation()
            .AddAspNetCoreInstrumentation()
            .SetSampler(new MultiplayerTraceIdRatioBasedSampler(0.5))
            .AddProcessor(new SimpleActivityExportProcessor(new MultiplayerOtlpHttpTracesExporter(
              MULTIPLAYER_OTLP_KEY,
              new Uri($"http://localhost/v1/traces")
            )));
    })
    .WithLogging(logs => logs
        .AddProcessor(new BatchLogRecordExportProcessor(new MultiplayerOtlpHttpLogsExporter(MULTIPLAYER_OTLP_KEY))));

// Open up security restrictions to allow this to work
// Not recommended in production
var deploySwaggerUI = true; //builder.Configuration.GetValue<bool>("DeploySwaggerUI");
var isDev = builder.Environment.IsDevelopment();

builder.Services.AddSecurityHeaderPolicies()
    .SetPolicySelector((PolicySelectorContext ctx) =>
    {
        // sum is weak security headers due to Swagger UI deployment
        // should only use in development
        if (deploySwaggerUI)
        {
            // Weakened security headers for Swagger UI
            if (ctx.HttpContext.Request.Path.StartsWithSegments("/swagger"))
            {
                return SecurityHeadersDefinitionsSwagger.GetHeaderPolicyCollection(isDev);
            }

            // Strict security headers
            return SecurityHeadersDefinitionsAPI.GetHeaderPolicyCollection(isDev);
        }
        // Strict security headers for production
        else
        {
            return SecurityHeadersDefinitionsAPI.GetHeaderPolicyCollection(isDev);
        }
    });

builder.Services.AddControllers();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
   .AddJwtBearer("Bearer", options =>
   {
       options.Audience = "api_scope";
       options.Authority = "https://localhost:44367";
       options.TokenValidationParameters = new TokenValidationParameters
       {
           ValidateIssuer = true,
           ValidateAudience = true,
           ValidateIssuerSigningKey = true,
           ValidAudiences = ["api_scope"],
           ValidIssuers = ["https://localhost:44367"],
       };
   });

builder.Services.AddOpenApi(options =>
{
    //options.UseTransformer((document, context, cancellationToken) =>
    //{
    //    document.Info = new()
    //    {
    //        Title = "My API",
    //        Version = "v1",
    //        Description = "API for Damien"
    //    };
    //    return Task.CompletedTask;
    //});
    options.AddDocumentTransformer<BearerSecuritySchemeTransformer>();
});

var app = builder.Build();

app.Use(async (context, next) =>
{


    var traceId = Activity.Current?.TraceId.ToString();
    if (!string.IsNullOrEmpty(traceId))
    {
        context.Response.Headers.Add("X-Trace-Id", traceId);
    }

    await next(); // Call the next middleware
});


app.UseSecurityHeaders();

app.UseHttpsRedirection();
app.UseAuthorization();



string HandleRollDice([FromServices] ILogger<Program> logger, string? player)
{
    var traceId = Activity.Current?.TraceId.ToString();

    var result = RollDice();

    if (string.IsNullOrEmpty(player))
    {
        // logger.LogInformation($"Generated Custom Trace ID: {activity.TraceId}");
        logger.LogInformation("Anonymous player is rolling the dice: {result} {traceId}", result, traceId);
    }
    else
    {
        logger.LogInformation("{player} is rolling the dice: {result} {traceId}", player, result, traceId);
    }

    return result.ToString(CultureInfo.InvariantCulture);
}

int RollDice()
{
    return Random.Shared.Next(1, 7);
}


app.MapControllers();

//app.MapOpenApi(); // /openapi/v1.json
app.MapOpenApi("/v0/api/docs/openapi.json");
//app.MapOpenApi("/openapi/{documentName}/openapi.json");

app.MapGet("/v0/api/rolldice/{player?}", HandleRollDice);

if (deploySwaggerUI)
{
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/v0/api/docs/openapi.json", "v1");
    });
}

app.Run();

internal sealed class BearerSecuritySchemeTransformer(IAuthenticationSchemeProvider authenticationSchemeProvider) : IOpenApiDocumentTransformer
{
    public async Task TransformAsync(OpenApiDocument document, OpenApiDocumentTransformerContext context, CancellationToken cancellationToken)
    {
        var authenticationSchemes = await authenticationSchemeProvider.GetAllSchemesAsync();
        if (authenticationSchemes.Any(authScheme => authScheme.Name == "Bearer"))
        {
            var requirements = new Dictionary<string, OpenApiSecurityScheme>
            {
                ["Bearer"] = new OpenApiSecurityScheme
                {
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer", // "bearer" refers to the header name here
                    In = ParameterLocation.Header,
                    BearerFormat = "Json Web Token"
                }
            };
            document.Components ??= new OpenApiComponents();
            document.Components.SecuritySchemes = requirements;
        }
        document.Info = new()
        {
            Title = "My API Bearer scheme",
            Version = "v1",
            Description = "API for Damien"
        };
    }
}
