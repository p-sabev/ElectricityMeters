namespace ElectricityMeters.Request.Readings
{
    public class SearchReadingsRequest
    {
        public required Paging Paging { get; set; }
        public required Sorting Sorting { get; set; }
        public string? Name { get; set; }
    }
}
