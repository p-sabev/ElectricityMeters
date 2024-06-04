using ElectricityMeters.Models;
using ElectricityMeters.Request.Subscribers;

namespace ElectricityMeters.Interfaces
{
    public interface ISubscriberService
    {
        Task<IEnumerable<Subscriber>> GetAllSubscribersAsync();
        Task<Subscriber> InsertSubscriberAsync(InsertSubscriber insertSubscriber);
        Task<bool> EditSubscriberAsync(EditSubscriber editSubscriber);
        Task<bool> DeleteSubscriberAsync(int id);
    }
}
