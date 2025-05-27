namespace WebApiOpenApi;

public class Epoch
{   
    public required string Name { get; set; }

    public HistoricalDate? StartDate { get; set; }

    public HistoricalDate? EndDate { get; set; }
}
