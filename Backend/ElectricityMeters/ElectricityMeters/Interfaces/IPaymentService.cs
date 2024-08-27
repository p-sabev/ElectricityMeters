using ElectricityMeters.Models;
using ElectricityMeters.Request.Payments;
using ElectricityMeters.Response.Payments;

namespace ElectricityMeters.Interfaces
{
    public interface IPaymentService
    {
        Task<IEnumerable<Payment>> GetAllPayments();
        Task<SearchPaymentResponse> SearchPaymentsList(SearchPaymentsRequest request);
        Task<Payment> InsertPaymentAsync(InsertPaymentRequest insertPayment);
        Task<bool> DeletePaymentAsync(int id);
    }
}
