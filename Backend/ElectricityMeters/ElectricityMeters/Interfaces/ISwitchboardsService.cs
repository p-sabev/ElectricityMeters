using ElectricityMeters.Models;
using ElectricityMeters.Request.Switchboards;
using ElectricityMeters.Response.Switchboards;
using Microsoft.AspNetCore.Mvc;

namespace ElectricityMeters.Interfaces
{
    public interface ISwitchboardService
    {
        Task<IEnumerable<Switchboard>> GetAllSwitchboardsAsync();
        Task<SearchSwitchboardsResponse> SearchSwitchboardsList(SearchSwitchboardRequest request);
        Task<Switchboard> InsertSwitchboardAsync(InsertSwitchboard insertSwitchboard);
        Task<bool> EditSwitchboardAsync(EditSwitchboard editSwitchboard);
        Task<bool> DeleteSwitchboardAsync(int id);
    }
}
