using ElectricityMeters.Interfaces;
using ElectricityMeters.Models;
using ElectricityMeters.Request.Readings;
using ElectricityMeters.Response.Readings;
using Microsoft.AspNetCore.Mvc;

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

        [HttpPost("search")]
        public async Task<ActionResult<SearchReadingsResponse>> SearchReadingsList([FromBody] SearchReadingsRequest request)
        {
            var result = await _readingService.SearchReadingsList(request);
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<Reading>> InsertReading(InsertReading insertReading)
        {
            try
            {
                var reading = await _readingService.InsertReadingAsync(insertReading);
                if (reading == null)
                {
                    return BadRequest("SomethingWentWrong");
                }

                return CreatedAtAction(nameof(GetAllReadings), new { id = reading.Id }, reading);
            } catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("add-multiple-readings")]
        public async Task<ActionResult<IEnumerable<Reading>>> InsertMultipleReadings(InsertMultipleReadings insertMultipleReadings)
        {
            var readings = await _readingService.InsertMultipleReadingsAsync(insertMultipleReadings);
            if (readings == null || !readings.Any())
            {
                return BadRequest("No valid readings were added.");
            }

            return Ok(readings);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditReading(int id, EditReading editReading)
        {
            try
            {
                var result = await _readingService.EditReadingAsync(id, editReading);
                if (!result)
                {
                    return BadRequest("SomethingWentWrong");
                }
            } catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReading(int id)
        {
            try
            {
                var result = await _readingService.DeleteReadingAsync(id);
                if (!result)
                {
                    return BadRequest();
                }
            } catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

            return NoContent();
        }

        [HttpGet("by-subscriber/{subscriberId}")]
        public async Task<ActionResult<IEnumerable<Reading>>> GetAllReadingsBySubscriberId(int subscriberId)
        {
            var readings = await _readingService.GetAllReadingsBySubscriberIdAsync(subscriberId);
            if (readings == null || !readings.Any())
            {
                return NotFound("No readings found for the specified subscriber.");
            }
            return Ok(readings);
        }
    }
}
