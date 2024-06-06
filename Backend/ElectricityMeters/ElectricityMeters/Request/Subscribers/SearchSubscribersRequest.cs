namespace ElectricityMeters.Request.Subscribers
{
    public class SearchSubscribersRequest
    {
        public required Paging Paging { get; set; }
        public required Sorting Sorting { get; set; }
        public int? NumberPage { get; set; }
        public string? Name { get; set; }
        public int? SwitchboardId { get; set; }
        public string? ElectricMeterName { get; set; }
    }
}
