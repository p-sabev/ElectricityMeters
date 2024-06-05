namespace ElectricityMeters.Request.Switchboards
{
    public class SearchSwitchboardRequest
    {
        public required Paging Paging { get; set; }
        public required Sorting Sorting { get; set; }
        public string? Name { get; set; }
    }
}
