using ElectricityMeters.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ElectricityMeters.Controllers
{
    [ApiController]
    [Route("api/electric-meters")]
    public class ElectricMetersController : ControllerBase
    {
        private readonly Models.DbContext _dbContext;

        public ElectricMetersController(Models.DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ElectricMeter>>> GetAllElectricMeters()
        {
            if (_dbContext == null || _dbContext.ElectricMeters == null)
            {
                return NotFound();
            }

            return await _dbContext.ElectricMeters.ToListAsync();
        }
    }
}
