using ElectricityMeters.Request.Account;
using ElectricityMeters.Response.Account;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace ElectricityMeters.Interfaces
{
    public interface IAccountService
    {
        Task<IdentityResult> RegisterAsync(RegisterModel model);
        Task<(string token, IList<string> roles, string userId)> LoginAsync(LoginModel model);
        Task<IdentityResult> AddRoleAsync(RoleModel model);
        Task<SearchResponse> SearchAsync(SearchModel model);
        Task<bool> EditUser(EditModel model);
        Task<bool> DeleteUser(string id);
        Task<List<Role>> GetAllRolesAsync();
    }
}
