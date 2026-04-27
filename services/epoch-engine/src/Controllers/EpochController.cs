using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApiOpenApi.Controllers;

[ApiController]
[Route("epoch")]
public class EpochController(ILogger<EpochController> _logger) : ControllerBase
{
    private static readonly Epoch[] Epochs =
    [
        new Epoch
        {
            Name = "Freddie Mercury epoch",
            StartDate = new HistoricalDate(new DateOnly(1946, 9, 5)),
            EndDate = new HistoricalDate(new DateOnly(1991, 10, 24))
        },
        new Epoch
        {
            Name = "Pikachu epoch",
            StartDate = new HistoricalDate(new DateOnly(1996, 2, 27)),
            EndDate = new HistoricalDate(new DateOnly(2020, 12, 31))
        },

        new Epoch
        {
            Name = "Yoda epoch",
            StartDate = new HistoricalDate("0896-01-01"),
            EndDate = new HistoricalDate(new DateOnly(4, 1, 1))
        },

        new Epoch
        {
            Name = "Ada Lovelace epoch",
            StartDate = new HistoricalDate(new DateOnly(1815, 12, 10)),
            EndDate = new HistoricalDate(new DateOnly(1852, 11, 27))
        },

        new Epoch
        {
            Name = "Julia Child epoch",
            StartDate = new HistoricalDate(new DateOnly(1912, 8, 15)),
            EndDate = new HistoricalDate(new DateOnly(2004, 8, 13)),
        },

        new Epoch
        {
            Name = "Ellen Ripley (Alien series) epoch",
            StartDate = new HistoricalDate(new DateOnly(2092, 1, 7)),
            EndDate = new HistoricalDate(new DateOnly(2179, 5, 24)),
        },

        new Epoch
        {
            Name = "Doc Brown (Back to the Future) epoch",
            StartDate = new HistoricalDate(new DateOnly(1920, 4, 5)),
            EndDate = new HistoricalDate(new DateOnly(2045, 10, 21)),
        },

        new Epoch
        {
            Name = "Alan Turing epoch",
            StartDate = new HistoricalDate(new DateOnly(1912, 6, 23)),
            EndDate = new HistoricalDate(new DateOnly(1954, 6, 7)),
        },

        new Epoch
        {
            Name = "Margaret Hamilton epoch",
            StartDate = new HistoricalDate(new DateOnly(1936, 8, 17)),
            EndDate = null
        },

        new Epoch
        {
            Name = "Hypatia of Alexandria epoch",
            StartDate = new HistoricalDate(new DateOnly(350, 1, 1)),
            EndDate = new HistoricalDate(new DateOnly(415, 1, 1))
        },

        new Epoch
        {
            Name = "R2 -D2 (Star Wars) epoch",
            StartDate = new HistoricalDate("033 BBY"),
            EndDate = null
        },

        new Epoch
        {
            Name = "Groot (Guardians of the Galaxy) epoch",
            StartDate = new HistoricalDate(new DateOnly(2000, 1, 1)),
            EndDate = new HistoricalDate(new DateOnly(2014, 5, 1))
        },

        new Epoch
        {
            Name = "The Cheshire Cat (Alice in Wonderland) epoch",
            StartDate = null,
            EndDate = null
        },

        new Epoch
        {
            Name = "Miss Piggy (The Muppets) epoch",
            StartDate = new HistoricalDate(new DateOnly(1974, 6, 1)),
            EndDate = null
        },

        new Epoch
        {
            Name = "Han Solo (Star Wars) epoch",
            StartDate = new HistoricalDate("0032-01-01"),
            EndDate = new HistoricalDate(new DateOnly(34, 1, 1))
        },

        new Epoch
        {
            Name = "Spock (Star Trek) epoch",
            StartDate = new HistoricalDate(new DateOnly(2230, 1, 6)),
            EndDate = new HistoricalDate(new DateOnly(2387, 1, 1))
        },

        new Epoch
        {
            Name = "Trinity (The Matrix) epoch",
            StartDate = new HistoricalDate(new DateOnly(1995, 1, 1)),
            EndDate = new HistoricalDate(new DateOnly(2199, 1, 1))
        },

        new Epoch
        {
            Name = "Agatha Christie epoch",
            StartDate = new HistoricalDate(new DateOnly(1890, 9, 15)),
            EndDate = new HistoricalDate(new DateOnly(1976, 1, 12))
        },
    ];

    [AllowAnonymous]
    [EndpointSummary("List epoch.")]
    [EndpointDescription("Endpoint will return epochs for different characters.")]
    [Produces(typeof(Epoch[]))]
    [HttpGet()]
    public IActionResult Get()
    {
        _logger.LogDebug("GetEpochs with OpenAPI definitions");

        return Ok(Epochs.ToArray());
    }
}
