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

        [HttpPost]
        public async Task<ActionResult<ElectricMeter>> InsertElectricMeter(ElectricMeter electricMeter)
        {
            if (_dbContext == null || _dbContext.ElectricMeters == null)
            {
                return Problem("Entity set 'DbContext.ElectricMeters' is null.");
            }

            _dbContext.ElectricMeters.Add(electricMeter);
            await _dbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAllElectricMeters), new { id = electricMeter.Id }, electricMeter);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditElectricMeter(int id, ElectricMeter electricMeter)
        {
            if (id != electricMeter.Id)
            {
                return BadRequest();
            }

            _dbContext.Entry(electricMeter).State = EntityState.Modified;

            try
            {
                await _dbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ElectricMeterExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteElectricMeter(int id)
        {
            if (_dbContext == null || _dbContext.ElectricMeters == null)
            {
                return NotFound();
            }

            var electricMeter = await _dbContext.ElectricMeters.FindAsync(id);
            if (electricMeter == null)
            {
                return NotFound();
            }

            _dbContext.ElectricMeters.Remove(electricMeter);
            await _dbContext.SaveChangesAsync();

            return NoContent();
        }

        private bool ElectricMeterExists(int id)
        {
            return (_dbContext?.ElectricMeters?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
