using ElectricityMeters.Interfaces;
using ElectricityMeters.Models;
using ElectricityMeters.Request.Readings;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ElectricityMeters.Controllers
{
    [ApiController]
    [Route("api/readings")]
    public class ReadingsController : ControllerBase
    {
        private readonly IReadingsService _readingService;

        public ReadingsController(IReadingsService readingService)
        {
            _readingService = readingService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Reading>>> GetAllReadings()
        {
            var readings = await _readingService.GetAllReadingsAsync();
            if (readings == null)
            {
                return NotFound();
            }

            return Ok(readings);
        }

        [HttpPost]
        public async Task<ActionResult<Reading>> InsertReading(InsertReading insertReading)
        {
            var reading = await _readingService.InsertReadingAsync(insertReading);
            if (reading == null)
            {
                return BadRequest();
            }

            return CreatedAtAction(nameof(GetAllReadings), new { id = reading.Id }, reading);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditReading(int id, EditReading editReading)
        {
            var result = await _readingService.EditReadingAsync(id, editReading);
            if (!result)
            {
                return BadRequest();
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReading(int id)
        {
            var result = await _readingService.DeleteReadingAsync(id);
            if (!result)
            {
                return BadRequest();
            }

            return NoContent();
        }
    }
}
