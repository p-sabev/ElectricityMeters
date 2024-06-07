using ElectricityMeters.Interfaces;
using ElectricityMeters.Request.Account;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ElectricityMeters.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IAccountService _accountService;

        public AccountController(IAccountService accountService)
        {
            _accountService = accountService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            var result = await _accountService.RegisterAsync(model);
            if (result.Succeeded)
            {
                return Ok(new { UserId = model.UserName });
            }

            return BadRequest(result.Errors);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var (token, roles) = await _accountService.LoginAsync(model);
            if (token != null)
            {
                return Ok(new { token, roles });
            }

            return Unauthorized();
        }

        [HttpPost("add-role")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> AddRole([FromBody] RoleModel model)
        {
            var result = await _accountService.AddRoleAsync(model);
            if (result.Succeeded)
            {
                return Ok();
            }

            return BadRequest(result.Errors);
        }
    }

}
