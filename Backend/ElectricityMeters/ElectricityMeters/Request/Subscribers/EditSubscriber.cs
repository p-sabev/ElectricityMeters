namespace ElectricityMeters.Request.Subscribers
{
    public class EditSubscriber
    {
        public required int Id { get; set; }
        public required int NumberPage { get; set; }
        public required string Name { get; set; }
        public required int ElectricMeterId { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public string? MeterNumber { get; set; }
        public string Note { get; set; }
    }
}
