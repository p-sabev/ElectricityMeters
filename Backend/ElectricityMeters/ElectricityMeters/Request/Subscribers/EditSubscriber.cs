namespace ElectricityMeters.Request.Subscribers
{
    public class EditSubscriber
    {
        public required int Id { get; set; }
        public int? NumberPage { get; set; }
        public required string Name { get; set; }
        public required int SwitchboardId { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public string? MeterNumber { get; set; }
        public string Note { get; set; }
        public double? DefaultReading { get; set; }
        public required int PhaseCount { get; set; }
    }
}
