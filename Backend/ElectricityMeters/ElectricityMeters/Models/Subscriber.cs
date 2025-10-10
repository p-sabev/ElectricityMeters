using ElectricityMeters.Base;

namespace ElectricityMeters.Models
{
    public class Subscriber : BaseEntity
    {
        public required int Id { get; set; }
        public int? NumberPage { get; set; }
        public required string Name { get; set; }
        public required Switchboard Switchboard { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public string? MeterNumber { get; set; }
        public string Note { get; set; }
        public double? DefaultReading { get; set; }
        public int PhaseCount { get; set; } = 1;
        public double? IndividualPrice { get; set; } = null;
        public double? IndividualPricePercent { get; set; } = null;
        public double? ReadingCoefficient { get; set; } = null;


        public Subscriber() { }

        public Subscriber(int id, int? numberPage, string name, Switchboard switchboard, string? address, string? phone, string? meterNumber, string note, double? defautReading, int phaseCount, double individualPrice, double individualPricePercent, double? readingCoefficient)
        {
            Id=id;
            NumberPage=numberPage;
            Name=name;
            Switchboard=switchboard;
            Address=address;
            Phone=phone;
            MeterNumber=meterNumber;
            Note=note;
            DefaultReading=defautReading;
            PhaseCount=phaseCount;
            IndividualPrice=individualPrice;
            IndividualPricePercent = individualPricePercent;
            ReadingCoefficient = readingCoefficient;
        }
    }
}
