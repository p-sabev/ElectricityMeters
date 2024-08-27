namespace ElectricityMeters.Request.Payments
{
    public class InsertPaymentRequest
    {
        public required int ReadingId { get; set; }
        public required DateTime Date { get; set; }
        public List<PaymentFeeEl>? FeeList { get; set; }
    }

    public class PaymentFeeEl
    {
        public double Value { get; set; }
        public string? Description { get; set; }
    }
}
