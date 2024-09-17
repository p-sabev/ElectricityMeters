using ElectricityMeters.Models;

namespace ElectricityMeters.Response.Payments
{
    public class PendingPaymentsResponse
    {
        public required double PendingTotalElectricity { get; set; }
        public required double PendingTotalFees { get; set; }
        public required double StandardFeesSum { get; set; }
        public required List<SubscibersPndingPayments> SubscribersPendindPayments { get; set; }
    }

    public class SubscibersPndingPayments
    {
        public required Subscriber Subscriber { get; set; }
        public required int PaymentsCount {  get; set; }
        public required double TotalAmountDue { get; set; }
    }
}
