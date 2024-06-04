using ElectricityMeters.Models;
using ElectricityMeters.Request.Prices;
using ElectricityMeters.Response.Prices;

namespace ElectricityMeters.Services
{
    public interface IPriceService
    {
        Task<IEnumerable<Price>> GetAllPricesAsync();
        Task<Price> InsertPriceAsync(InsertPrice insertPrice);
        Task<bool> UpdatePriceAsync(EditPrice editPrice);
        Task<bool> DeletePriceAsync(int id);
        Task<SearchPricesResponse> SearchPricesList(SearchPriceRequest request);
    }
}