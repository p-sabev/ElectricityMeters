using ElectricityMeters.Interfaces;
using ElectricityMeters.Request.Settings;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ElectricityMeters.Controllers
{
    [ApiController]
    [Route("api/settings")]
    public class SettingsController:ControllerBase
    {
        private readonly ISettingsService _settingsService;

        public SettingsController(ISettingsService settingsService)
        {
            _settingsService = settingsService;
        }

        [HttpGet("default-fees")]
        [Authorize]
        public async Task<IActionResult> GetAllDefaultFees()
        {
            var fees = await _settingsService.GetAllDefaultFees();
            return Ok(fees);
        }

        [HttpPost("default-fees")]
        [Authorize]
        public async Task<IActionResult> UpdateDefaultFees([FromBody] UpdateDefaultFeesRequest request)
        {
            var result = await _settingsService.UpdateDefaultFees(request);
            if (!result)
            {
                return BadRequest("Failed to update default fees.");
            }
            return NoContent();
        }
    }
}
