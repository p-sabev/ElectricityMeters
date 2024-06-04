using ElectricityMeters.Models;
using ElectricityMeters.Request.Subscribers;
using ElectricityMeters.Response.Subscribers;

namespace ElectricityMeters.Interfaces
{
    public interface ISubscriberService
    {
        Task<IEnumerable<Subscriber>> GetAllSubscribersAsync();
        Task<SearchSubscribersResponse> SearchSubscribersList(SearchSubscribersRequest request);
        Task<Subscriber> InsertSubscriberAsync(InsertSubscriber insertSubscriber);
        Task<bool> EditSubscriberAsync(EditSubscriber editSubscriber);
        Task<bool> DeleteSubscriberAsync(int id);
    }
}
