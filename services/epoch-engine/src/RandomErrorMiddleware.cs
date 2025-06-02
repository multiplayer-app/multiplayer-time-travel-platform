using System.Diagnostics;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Diagnostics;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace WebApiOpenApi;

public static class RandomErrorMiddlewareExtensions
{
    public static IApplicationBuilder UseRandomErrorMiddleware(this IApplicationBuilder builder, double defaultErrorRate = 0.1)
    {
        return builder.UseMiddleware<RandomErrorMiddleware>(defaultErrorRate);
    }
}

public class RandomErrorMiddleware
{
    private readonly RequestDelegate _next;
    private readonly double _defaultErrorRate;
    private readonly ILogger<RandomErrorMiddleware> _logger;
    private static readonly string[] ErrorMessages = new[]{
        "Epoch engine overheated while time-traveling to 1973.",
        "Quantum banana slipped in the causality loop!",
        "Flux capacitor forgot its password.",
        "Time thread got tangled in a knot of nostalgia.",
        "Chrono squirrels chewed through the time cables.",
        "Out of sync: please reset your multiverse clock.",
        "Someone sneezed during a butterfly effect simulation.",
        "Epoch engine requires coffee to continue.",
        "Oops! A paradox tripped over the timeline.",
        "404 Epoch not found — it’s probably on vacation."
    };

    public RandomErrorMiddleware(RequestDelegate next, double defaultErrorRate = 0.1)
    {
        _next = next;
        _defaultErrorRate = defaultErrorRate;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var path = context.Request.Path.Value?.ToLowerInvariant();

        if (path is not null && (path.Contains("/docs") || path.Contains("/healthz")))
        {
            await _next(context);
            return;
        }

        double errorRate = _defaultErrorRate;
        if (context.Request.Query.TryGetValue("errorRate", out var errorRateStr) &&
            double.TryParse(errorRateStr, out var parsedRate))
        {
            errorRate = Math.Clamp(parsedRate, 0.0, 1.0);
        }

        var traceId = Activity.Current?.TraceId.ToString() ?? Guid.NewGuid().ToString();
        int hash = traceId.GetHashCode();
        var normalized = Math.Abs(hash % 1000) / 1000.0;

        if (normalized < errorRate)
        {
            var message = GetRandomErrorMessage(traceId);

            var errorResponse = new
            {
                code = "WARP_ENGINE_ERROR",
                message
            };

            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            context.Response.ContentType = "application/json";

            var json = JsonSerializer.Serialize(errorResponse, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            // _logger.LogWarning("Injected error: {Message} (traceId: {TraceId})", message, traceId);

            await context.Response.WriteAsync(json);
            return;
        }

        await _next(context);
    }
    
    private static string GetRandomErrorMessage(string traceId)
    {
        var rnd = RandomNumberGenerator.GetInt32(ErrorMessages.Length);
        return string.Format(ErrorMessages[rnd], traceId ?? "unknown");
    }
}
