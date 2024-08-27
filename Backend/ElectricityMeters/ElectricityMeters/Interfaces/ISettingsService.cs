using ElectricityMeters.Response.Settings;
using ElectricityMeters.Request.Settings;

namespace ElectricityMeters.Interfaces
{
    public interface ISettingsService
    {
        Task<IEnumerable<SearchStandartFeeListResponse>> GetAllDefaultFees();
        Task<bool> UpdateDefaultFees(UpdateDefaultFeesRequest request);
    }
}
