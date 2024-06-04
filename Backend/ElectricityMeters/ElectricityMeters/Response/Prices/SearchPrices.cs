namespace ElectricityMeters.Response.Prices
{
    public class SearchPricesResponse
    {
        public required List<PriceResponse> Data { get; set; }
        public required int TotalRecords { get; set; }
    }

    public class PriceResponse
    {
        public int Id { get; set; }
        public double PriceInLv { get; set; }
        public DateTime DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
        public string? Note { get; set; }
        public bool IsUsed { get; set; }
    }
}
