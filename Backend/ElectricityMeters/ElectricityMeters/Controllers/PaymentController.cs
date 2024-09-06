using ElectricityMeters.Interfaces;
using ElectricityMeters.Request.Payments;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ElectricityMeters.Controllers
{
    [ApiController]
    [Route("api/payments")]
    public class PaymentController:ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public PaymentController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [HttpGet]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> GetAllPayments()
        {
            var payments = await _paymentService.GetAllPayments();
            return Ok(payments);
        }

        [HttpPost("search")]
        [Authorize]
        public async Task<IActionResult> SearchPaymentsList([FromBody] SearchPaymentsRequest request)
        {
            var response = await _paymentService.SearchPaymentsList(request);
            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> InsertPayment([FromBody] InsertPaymentRequest request)
        {
            try
            {
                var payment = await _paymentService.InsertPaymentAsync(request);
                return CreatedAtAction(nameof(GetAllPayments), new { id = payment.Id }, payment);
            } catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeletePayment(int id)
        {
            try
            {
                var success = await _paymentService.DeletePaymentAsync(id);
                return NoContent();
            } catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }            
        }

    }
}
