using ElectricityMeters.Interfaces;
using ElectricityMeters.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ElectricityMeters.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UsersController : ControllerBase
    {
        private readonly IUsersService _usersService;

        public UsersController(IUsersService usersService)
        {
            _usersService = usersService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Switchboard>>> GetAllUsers()
        {
            var users = await _usersService.GetAllUsersAsync();
            if (users == null)
            {
                return NotFound();
            }

            return Ok(users);
        }

    }
}
