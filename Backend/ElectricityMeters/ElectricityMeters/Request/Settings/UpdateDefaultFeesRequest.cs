namespace ElectricityMeters.Request.Settings
{
    public class UpdateDefaultFeesRequest
    {
        public List<StandartFee>? StandartFees { get; set; }
    }

    public class StandartFee
    {
        public double Value { get; set; }
        public string? Description { get; set; }
    }
}
