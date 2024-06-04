namespace ElectricityMeters.Models
{
    public class Reading
    {
        public int Id { get; set; }
        public Subscriber Subscriber { get; set; }
        public DateTime Date { get; set; }
        public double Value { get; set; }
        public double AmountDue { get; set; }
        public double Difference { get; set; }
        public double CurrentPrice { get; set; }
        public int UsedPrice { get; set; }


        public Reading() { }

        public Reading(int id, DateTime date, double value, double amountDue, double difference, double currentPrice, Subscriber subscriber)
        {
            Id = id;
            Date = date;
            Value = value;
            AmountDue = amountDue;
            Difference = difference;
            CurrentPrice = currentPrice;
            Subscriber = subscriber;
        }
    }
}
