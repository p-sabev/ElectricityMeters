using ElectricityMeters.Models;
using ElectricityMeters.Request.Subscribers;
using ElectricityMeters.Request.Switchboards;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ElectricityMeters.Controllers
{
    [ApiController]
    [Route("api/switchboards")]
    public class SwitchboardsController : ControllerBase
    {
        private readonly Models.DbContext _dbContext;

        public SwitchboardsController(Models.DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Switchboard>>> GetAllSwitchboards()
        {
            if (_dbContext == null || _dbContext.Switchboards == null)
            {
                return NotFound();
            }

            return await _dbContext.Switchboards.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Switchboard>> InsertSwitchboard(InsertSwitchboard insertSwitchboard)
        {
            if (_dbContext == null || _dbContext.Switchboards == null)
            {
                return NotFound();
            }

            var switchboard = new Switchboard
            {
                Id = 0,
                Name = insertSwitchboard.Name
            };

            _dbContext.Switchboards.Add(switchboard);
            await _dbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAllSwitchboards), new { id = switchboard.Id }, switchboard);
        }

        [HttpPut]
        public async Task<IActionResult> EditSwitchboard(EditSwitchboard editSwitchboard)
        {
            if (_dbContext == null || _dbContext.Switchboards == null)
            {
                return NotFound();
            }

            var switchboard = await _dbContext.Switchboards.FindAsync(editSwitchboard.Id);
            if (switchboard == null)
            {
                return BadRequest("Invalid Switchboard Id.");
            }

            switchboard.Name = editSwitchboard.Name;

            try
            {
                await _dbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SwitchboardExists(editSwitchboard.Id))
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
        public async Task<IActionResult> DeleteSwitchboard(int id)
        {
            if (_dbContext == null || _dbContext.Switchboards == null)
            {
                return NotFound();
            }

            var switchboard = await _dbContext.Switchboards.FindAsync(id);
            if (switchboard == null)
            {
                return NotFound();
            }

            // Check if any subscriber is connected to the electric meter
            var hasConnectedSubscribers = await _dbContext.Subscribers.AnyAsync(s => s.Switchboard.Id == id);
            if (hasConnectedSubscribers)
            {
                return BadRequest("Cannot delete the electric meter as there are subscribers connected to it.");
            }

            _dbContext.Switchboards.Remove(switchboard);
            await _dbContext.SaveChangesAsync();

            return NoContent();
        }

        private bool SwitchboardExists(int id)
        {
            return (_dbContext?.Switchboards?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
