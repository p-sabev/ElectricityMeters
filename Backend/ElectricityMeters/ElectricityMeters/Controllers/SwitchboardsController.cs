using ElectricityMeters.Interfaces;
using ElectricityMeters.Models;
using ElectricityMeters.Request.Subscribers;
using ElectricityMeters.Request.Switchboards;
using ElectricityMeters.Response.Subscribers;
using ElectricityMeters.Response.Switchboards;
using ElectricityMeters.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ElectricityMeters.Controllers
{
    [ApiController]
    [Route("api/switchboards")]
    public class SwitchboardsController : ControllerBase
    {
        private readonly ISwitchboardService _switchboardService;

        public SwitchboardsController(ISwitchboardService switchboardService)
        {
            _switchboardService = switchboardService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Switchboard>>> GetAllSwitchboards()
        {
            var switchboards = await _switchboardService.GetAllSwitchboardsAsync();
            if (switchboards == null)
            {
                return NotFound();
            }

            return Ok(switchboards);
        }

        [HttpPost("search")]
        public async Task<ActionResult<SearchSwitchboardsResponse>> SearchSwitchboards([FromBody] SearchSwitchboardRequest request)
        {
            var result = await _switchboardService.SearchSwitchboardsList(request);
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<Switchboard>> InsertSwitchboard(InsertSwitchboard insertSwitchboard)
        {
            var switchboard = await _switchboardService.InsertSwitchboardAsync(insertSwitchboard);
            if (switchboard == null)
            {
                return BadRequest();
            }

            return CreatedAtAction(nameof(GetAllSwitchboards), new { id = switchboard.Id }, switchboard);
        }

        [HttpPut]
        public async Task<IActionResult> EditSwitchboard(EditSwitchboard editSwitchboard)
        {
            var result = await _switchboardService.EditSwitchboardAsync(editSwitchboard);
            if (!result)
            {
                return BadRequest("Invalid Switchboard Id or Switchboard does not exist.");
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSwitchboard(int id)
        {
            var result = await _switchboardService.DeleteSwitchboardAsync(id);
            if (!result)
            {
                return BadRequest("Cannot delete the switchboard as there are subscribers connected to it.");
            }

            return NoContent();
        }
    }
}
