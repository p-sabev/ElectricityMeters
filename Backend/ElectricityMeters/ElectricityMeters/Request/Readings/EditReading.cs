using ElectricityMeters.Models;

namespace ElectricityMeters.Request.Readings
{
    public class EditReading
    {
        public required int Id { get; set; }
        public required int SubscriberId { get; set; }
        public required DateTime DateFrom { get; set; }
        public required DateTime DateTo { get; set; }
        public required double Value { get; set; }
        public required double FirstPhaseValue { get; set; }
        public required double SecondPhaseValue { get; set; }
        public required double ThirdPhaseValue { get; set; }
        public double CurrentPrice { get; set; }
    }
}
