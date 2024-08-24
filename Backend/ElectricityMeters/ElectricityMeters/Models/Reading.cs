namespace ElectricityMeters.Models
{
    public class Reading
    {
        public int Id { get; set; }
        public Subscriber Subscriber { get; set; }
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
        public double Value { get; set; }
        public double AmountDue { get; set; }
        public double Difference { get; set; }
        public double CurrentPrice { get; set; }
        public int UsedPrice { get; set; }
        public bool Paid {  get; set; }


        public Reading() { }

        public Reading(int id, DateTime dateFrom, DateTime dateTo, double value, double amountDue, double difference, double currentPrice, Subscriber subscriber, bool paid)
        {
            Id = id;
            DateFrom = dateFrom;
            DateTo = dateTo;
            Value = value;
            AmountDue = amountDue;
            Difference = difference;
            CurrentPrice = currentPrice;
            Subscriber = subscriber;
            Paid=paid;
        }
    }
}
