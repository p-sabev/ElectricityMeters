using System.Globalization;

namespace ElectricityMeters.Request.Prices
{
    public class SearchPriceRequest
    {
        public required Paging Paging { get; set; }
        public required Sorting Sorting { get; set; }
    }
}
