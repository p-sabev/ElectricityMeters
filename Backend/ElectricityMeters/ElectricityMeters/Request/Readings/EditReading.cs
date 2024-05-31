using ElectricityMeters.Models;

namespace ElectricityMeters.Request.Readings
{
    public class EditReading
    {
        public required int Id { get; set; }
        public required int SubscriberId { get; set; }
        public required DateTime Date { get; set; }
        public required double Value { get; set; }
        public double CurrentPrice { get; set; }
    }
}
