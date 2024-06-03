namespace ElectricityMeters.Models
{
    public class Subscriber
    {
        public required int Id { get; set; }
        public required int NumberPage { get; set; }
        public required string Name { get; set; }
        public required Switchboard Switchboard { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public string? MeterNumber { get; set; }
        public DateTime? LastRecordDate { get; set; }
        public double? LastReading { get; set; }
        public string Note { get; set; }


        public Subscriber() { }

        public Subscriber(int id, int numberPage, string name, Switchboard switchboard, string? address, string? phone, string? meterNumber, DateTime? lastRecordDate, double? lastReading, string note)
        {
            Id=id;
            NumberPage=numberPage;
            Name=name;
            Switchboard=switchboard;
            Address=address;
            Phone=phone;
            MeterNumber=meterNumber;
            LastRecordDate=lastRecordDate;
            LastReading=lastReading;
            Note=note;

        }
    }
}
