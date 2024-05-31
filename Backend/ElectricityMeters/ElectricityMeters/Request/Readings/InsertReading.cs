using ElectricityMeters.Models;

namespace ElectricityMeters.Request.Readings
{
    public class InsertReading
    {
        public required int SubscriberId { get; set; }
        public required DateTime Date { get; set; }
        public required double Value { get; set; }
    }
}
