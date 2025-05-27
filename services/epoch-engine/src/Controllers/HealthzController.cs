using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApiOpenApi.Controllers;

[ApiController]
[Route("healthz")]

public class HealthController(ILogger<HealthController> _logger) : ControllerBase
{
    [AllowAnonymous]
    [EndpointSummary("Get service heealth.")]
    [Produces("text/plain")]
    [HttpGet()]
    public IActionResult Get()
    {
        _logger.LogDebug("GetHealthz");

        return Ok("OK");
    }
}
