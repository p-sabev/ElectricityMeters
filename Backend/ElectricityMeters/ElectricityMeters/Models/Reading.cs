using ElectricityMeters.Base;

namespace ElectricityMeters.Models
{
    public class Reading : BaseEntity
    {
        public int Id { get; set; }
        public Subscriber Subscriber { get; set; }
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
        public double Value { get; set; }
        public double FirstPhaseValue { get; set; }
        public double SecondPhaseValue { get; set; }
        public double ThirdPhaseValue { get; set; }
        public double AmountDue { get; set; }
        public double Difference { get; set; }
        public double CurrentPrice { get; set; }
        public int UsedPrice { get; set; }
        public int? Payment {  get; set; }


        public Reading() { }

        public Reading(int id, DateTime dateFrom, DateTime dateTo, double value, double firstPhaseValue, double secondPhaseValue, double thirdPhaseValue, double amountDue, double difference, double currentPrice, Subscriber subscriber)
        {
            Id = id;
            DateFrom = dateFrom;
            DateTo = dateTo;
            Value = value;
            FirstPhaseValue = firstPhaseValue; 
            SecondPhaseValue = secondPhaseValue; 
            ThirdPhaseValue = thirdPhaseValue;
            AmountDue = amountDue;
            Difference = difference;
            CurrentPrice = currentPrice;
            Subscriber = subscriber;
        }
    }
}
