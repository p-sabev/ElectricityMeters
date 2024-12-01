using ElectricityMeters.Models;

namespace ElectricityMeters.Response.Switchboards
{
    public class SearchSwitchboardsResponse
    {
        public required List<SwitchboardsResponse> Data { get; set; }
        public required int TotalRecords { get; set; }
    }

    public class SwitchboardsResponse
    {
        public required int Id { get; set; }
        public required string Name { get; set; }
        public List<SwitchboardSubscribers> Subscribers { get; set; } = new List<SwitchboardSubscribers>();
    }

    public class SwitchboardSubscribers
    {
        public required int Id { get; set; }
        public int? NumberPage { get; set; }
        public required string Name { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public string? MeterNumber { get; set; }
        public DateTime? LastRecordDate { get; set; }
        public double? LastReading { get; set; }
        public double? LastFirstPhaseValue { get; set; }
        public double? LastSecondPhaseValue { get; set; }
        public double? LastThirdPhaseValue { get; set; }
        public string Note { get; set; }
        public double? DefaultReading { get; set; }
        public required int PhaseCount { get; set; }
    }
}
