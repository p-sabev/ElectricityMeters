using ElectricityMeters.Interfaces;
using ElectricityMeters.Models;
using ElectricityMeters.Request.Account;
using ElectricityMeters.Response.Account;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ElectricityMeters.Services
{
    public class AccountService : IAccountService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;

        public AccountService(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            RoleManager<IdentityRole> roleManager,
            IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
            _configuration = configuration;
        }

        public async Task<IdentityResult> RegisterAsync(RegisterModel model)
        {
            var user = new ApplicationUser
            {
                UserName = model.UserName,
                Email = model.Email,
                Name = model.Name,
                MiddleName = model.MiddleName,
                LastName = model.LastName
            };
            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "Basic");
            }

            return result;
        }

        public async Task<(string token, IList<string> roles, string userId)> LoginAsync(LoginModel model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
            {
                var claims = new List<Claim>
                {
                    new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim(ClaimTypes.NameIdentifier, user.Id),
                    new Claim("DataGroup", user.DataGroup.ToString())
                };

                var roles = await _userManager.GetRolesAsync(user);
                claims.AddRange(roles.Select(role =>
                    new Claim(ClaimsIdentity.DefaultRoleClaimType, role)
                ));

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(
                    issuer: _configuration["Jwt:Issuer"],
                    audience: _configuration["Jwt:Issuer"],
                    claims: claims,
                    expires: DateTime.Now.AddHours(24),
                    signingCredentials: creds);

                // Използваме JwtSecurityTokenHandler за генериране на токена
                var tokenHandler = new JwtSecurityTokenHandler();
                var jwtToken = tokenHandler.WriteToken(token);

                return (jwtToken, roles, user.Id);
            }

            return (null, null, null);
        }

        public async Task<IdentityResult> AddRoleAsync(RoleModel model)
        {
            var roleExist = await _roleManager.RoleExistsAsync(model.Name);
            if (!roleExist)
            {
                return await _roleManager.CreateAsync(new IdentityRole(model.Name));
            }

            return IdentityResult.Failed(new IdentityError { Description = "Role already exists" });
        }

        public async Task<SearchResponse> SearchAsync(SearchModel model)
        {
            var query = _userManager.Users.AsQueryable();

            // Filtering
            if (!string.IsNullOrEmpty(model.Name))
            {
                query = query.Where(u => u.Name.Contains(model.Name));
            }

            if (!string.IsNullOrEmpty(model.Email))
            {
                query = query.Where(u => u.Email.Contains(model.Email));
            }

            // Sorting
            if (!string.IsNullOrEmpty(model.Sorting.SortProp))
            {
                query = model.Sorting.SortDirection == 1
                    ? query.OrderByDynamic(model.Sorting.SortProp)
                    : query.OrderByDescendingDynamic(model.Sorting.SortProp);
            }

            // Total records before paging
            var totalRecords = await query.CountAsync();

            // Paging
            query = query
                .Skip(model.Paging.Page * model.Paging.PageSize)
                .Take(model.Paging.PageSize);

            try
            {
                // Fetch user data without roles first
                var users = await query
                                .Select(u => new SearchData
                                {
                                    Id = u.Id,
                                    Name = u.Name,
                                    MiddleName = u.MiddleName,
                                    LastName = u.LastName,
                                    Email = u.Email,
                                    UserName = u.UserName,
                                    RoleIds = new List<string>() // Temporarily set an empty list
                                })
                                .ToListAsync();

                // Fetch roles separately for each user
                foreach (var user in users)
                {
                    var appUser = await _userManager.FindByIdAsync(user.Id);
                    user.RoleIds = (await _userManager.GetRolesAsync(appUser)).ToList();
                }

                return new SearchResponse
                {
                    Data = users,
                    TotalRecords = totalRecords
                };
            }
            catch (Exception ex)
            {
                var exc = ex;
                throw new Exception(exc.Message);
            }
        }

        public async Task<bool> EditUser(EditModel model)
        {
            var user = await _userManager.FindByIdAsync(model.Id);

            if (user == null)
            {
                throw new Exception("UserNotFound");
            }

            // Update user properties
            user.Name = model.Name;
            user.MiddleName = model.MiddleName;
            user.LastName = model.LastName;
            user.UserName = model.UserName;
            user.Email = model.Email;

            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
            {
                throw new Exception("FailedToUpdateUser");
            }

            // Update user roles
            var currentRoles = await _userManager.GetRolesAsync(user);
            var rolesToRemove = currentRoles.Except(model.RoleIds).ToList();
            var rolesToAdd = model.RoleIds.Except(currentRoles).ToList();

            if (rolesToRemove.Any())
            {
                await _userManager.RemoveFromRolesAsync(user, rolesToRemove);
            }

            if (rolesToAdd.Any())
            {
                await _userManager.AddToRolesAsync(user, rolesToAdd);
            }

            return true;
        }

        public async Task<bool> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);

            if (user == null)
            {
                throw new Exception("UserNotFound");
            }

            var rolesToDelete = await _userManager.GetRolesAsync(user);
            await _userManager.RemoveFromRolesAsync(user, rolesToDelete);

            var result = await _userManager.DeleteAsync(user);
            return result.Succeeded;
        }

        public async Task<List<Role>> GetAllRolesAsync()
        {
            var roles = await _roleManager.Roles.ToListAsync();
            var roleList = roles.Select(role => new Role
            {
                Id = role.Id,
                Name = role.Name
            }).ToList();

            return roleList;
        }

    }
}
