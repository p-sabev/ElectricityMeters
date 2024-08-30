using ElectricityMeters.Models;

namespace ElectricityMeters.Response.Payments
{
    public class SearchPaymentResponse
    {
        public required List<PaymentResponse> Data { get; set; }
        public required int TotalRecords { get; set; }
    }

    public class PaymentResponse
    {
        public int Id { get; set; }
        public required Reading Reading { get; set; }
        public required Subscriber Subscriber { get; set; }
        public required DateTime Date { get; set; }
        public List<PaymentFee>? FeeList { get; set; }
    }
}
