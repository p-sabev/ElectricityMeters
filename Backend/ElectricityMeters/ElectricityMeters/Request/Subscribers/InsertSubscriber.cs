using ElectricityMeters.Models;
using System.ComponentModel.DataAnnotations;

namespace ElectricityMeters.Request.Subscribers
{
    public class InsertSubscriber
    {
        public int? NumberPage { get; set; }
        public required string Name { get; set; }
        public required int SwitchboardId { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public string? MeterNumber { get; set; }
        public string Note { get; set; }
        public double? DefaultReading { get; set; }
        public required int PhaseCount { get; set; }
        public double? IndividualPrice { get; set; }
        public double? IndividualPricePercent { get; set; }
        public double? ReadingCoefficient { get; set; }
    }
}
