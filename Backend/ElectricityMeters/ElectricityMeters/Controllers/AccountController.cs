using Azure;
using ElectricityMeters.Interfaces;
using ElectricityMeters.Models;
using ElectricityMeters.Request.Account;
using ElectricityMeters.Request.Prices;
using ElectricityMeters.Response.Account;
using ElectricityMeters.Services;
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
            var (token, roles, userId) = await _accountService.LoginAsync(model);
            if (token != null)
            {
                return Ok(new { token, roles, userId });
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

        [HttpPost("search")]
        [Authorize]
        public async Task<IActionResult> Search([FromBody] SearchModel model)
        {
            try
            {
                var response = await _accountService.SearchAsync(model);
                return Ok(response);
            } catch (Exception ex) { 
                return BadRequest(ex.Message);
            }
            
        }

        [HttpPut]
        [Authorize]
        public async Task<IActionResult> EditUser([FromBody] EditModel model)
        {
            try
            {
                var success = await _accountService.EditUser(model);
                if (!success)
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }


            return NoContent();

        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeletePayment(string id)
        {
            try
            {
                var success = await _accountService.DeleteUser(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetAllRoles")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<List<Role>>>> GetAllRoles()
        {
            try
            {
                var roles = await _accountService.GetAllRolesAsync();
                if (roles == null)
                {
                    return NotFound();
                }

                return Ok(roles);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

    }

}
