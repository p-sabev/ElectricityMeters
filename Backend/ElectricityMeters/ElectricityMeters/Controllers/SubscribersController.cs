using ElectricityMeters.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ElectricityMeters.Controllers
{
    [ApiController]
    [Route("api/subscribers")]
    public class SubscribersController : ControllerBase
    {
        private readonly Models.DbContext _dbContext;

        public SubscribersController(Models.DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Subscriber>>> GetAllSubscribers()
        {
            if (_dbContext == null || _dbContext.Subscribers == null)
            {
                return NotFound();
            }

            return await _dbContext.Subscribers.ToListAsync();
        }
    }
}
