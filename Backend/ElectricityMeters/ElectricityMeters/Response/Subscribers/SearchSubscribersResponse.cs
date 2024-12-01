using ElectricityMeters.Models;

namespace ElectricityMeters.Response.Subscribers
{
    public class SearchSubscribersResponse
    {
        public required List<SubscribersResponse> Data { get; set; }
        public required int TotalRecords { get; set; }
    }

    public class SubscribersResponse
    {
        public required int Id { get; set; }
        public int? NumberPage { get; set; }
        public required string Name { get; set; }
        public required Switchboard Switchboard { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public string? MeterNumber { get; set; }
        public DateTime? LastRecordDate { get; set; }
        public double? LastReading { get; set; }
        public double? DefaultReading { get; set; }
        public string Note { get; set; }
        public required int PhaseCount { get; set; }
    }

    public class SubscribersStartResponse
    {
        public required int Id { get; set; }
        public int? NumberPage { get; set; }
        public required string Name { get; set; }
        public required Switchboard Switchboard { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public string? MeterNumber { get; set; }
        public DateTime? LastRecordDate { get; set; }
        public Reading? LastReadingData {  get; set; }
        public string Note { get; set; }
        public double? DefaultReading { get; set; }
        public required int PhaseCount { get; set; }
    }
}
