using ElectricityMeters.Base;

namespace ElectricityMeters.Models
{
    public class Price : BaseEntity
    {

        public int Id { get; set; }
        public double PriceInLv { get; set; }
        public DateTime DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
        public string Note { get; set; }

        public Price() { }

        public Price(int id, double price, DateTime dateFrom, DateTime dateTo, string note)
        {
            Id = id;
            PriceInLv = price;
            DateFrom = dateFrom;
            DateTo = dateTo;
            Note = note;
        }
    }
}
