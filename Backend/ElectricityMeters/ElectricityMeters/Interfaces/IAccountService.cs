using ElectricityMeters.Request.Account;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace ElectricityMeters.Interfaces
{
    public interface IAccountService
    {
        Task<IdentityResult> RegisterAsync(RegisterModel model);
        Task<(string token, IList<string> roles)> LoginAsync(LoginModel model);
        Task<IdentityResult> AddRoleAsync(RoleModel model);
    }
}
