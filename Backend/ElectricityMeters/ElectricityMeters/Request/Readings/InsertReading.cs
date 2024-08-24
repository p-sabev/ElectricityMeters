using ElectricityMeters.Models;

namespace ElectricityMeters.Request.Readings
{
    public class InsertReading
    {
        public required int SubscriberId { get; set; }
        public required DateTime DateFrom { get; set; }
        public required DateTime DateTo { get; set; }
        public required double Value { get; set; }
    }

    public class InsertMultipleReadings
    {
        public required List<InsertReading> SubscribersReading { get; set; }
    }
}
