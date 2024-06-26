﻿using ElectricityMeters.Models;

namespace ElectricityMeters.Response.Readings
{
    public class SearchReadingsResponse
    {
        public required List<ReadingsResponse> Data { get; set; }
        public required int TotalRecords { get; set; }
    }

    public class ReadingsResponse
    {
        public int Id { get; set; }
        public ReadingSubscriber? Subscriber { get; set; }
        public DateTime Date { get; set; }
        public double Value { get; set; }
        public double AmountDue { get; set; }
        public double Difference { get; set; }
        public double CurrentPrice { get; set; }
        public Price? UsedPrice { get; set; }
    }

    public class ReadingSubscriber
    {
        public required int Id { get; set; }
        public required int NumberPage { get; set; }
        public required string Name { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public string? SwitchboardNumber { get; set; }
        public string? MeterNumber { get; set; }
        public DateTime? LastRecordDate { get; set; }
        public double? LastReading { get; set; }
        public string? Note { get; set; }
    }
}
