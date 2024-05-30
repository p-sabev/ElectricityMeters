using ElectricityMeters.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ElectricityMeters.Controllers
{
    [ApiController]
    [Route("api/readings")]
    public class ReadingsController : ControllerBase
    {
        private readonly Models.DbContext _dbContext;

        public ReadingsController(Models.DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Reading>>> GetAllReadings()
        {
            if (_dbContext == null || _dbContext.Readings == null)
            {
                return NotFound();
            }

            return await _dbContext.Readings.ToListAsync();
        }
    }
}
