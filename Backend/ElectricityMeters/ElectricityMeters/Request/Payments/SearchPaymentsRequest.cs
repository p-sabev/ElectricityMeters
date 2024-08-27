namespace ElectricityMeters.Request.Payments
{
    public class SearchPaymentsRequest
    {
        public required Paging Paging { get; set; }
        public required Sorting Sorting { get; set; }
        public string? Name { get; set; }
    }
}
