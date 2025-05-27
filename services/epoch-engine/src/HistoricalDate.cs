namespace WebApiOpenApi;

public class HistoricalDate
{
    public bool IsBCE { get; }
    public DateOnly? Date { get; }
    public string? BCEString { get; }

    // Constructor for CE dates (normal DateOnly)
    public HistoricalDate(DateOnly date)
    {
        Date = date;
        IsBCE = false;
        BCEString = null;
    }

    // Constructor for BCE dates as string, e.g. "896-01-01"
    public HistoricalDate(string bceDateString)
    {
        if (string.IsNullOrWhiteSpace(bceDateString))
            throw new ArgumentException("BCE date string cannot be null or empty.");

        BCEString = bceDateString;
        IsBCE = true;
        Date = null;
    }

    // Returns a string representation
    public override string ToString()
    {
        if (IsBCE)
        {
            // Format BCE string with suffix
            return $"{BCEString} BCE";
        }
        else if (Date.HasValue)
        {
            return Date.Value.ToString("yyyy-MM-dd");
        }
        else
        {
            return "Invalid Date";
        }
    }
}
