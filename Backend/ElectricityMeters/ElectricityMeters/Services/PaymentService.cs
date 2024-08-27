using ElectricityMeters.Interfaces;
using ElectricityMeters.Models;
using ElectricityMeters.Request.Payments;
using ElectricityMeters.Response.Payments;
using Microsoft.EntityFrameworkCore;

namespace ElectricityMeters.Services
{
    public class PaymentService:IPaymentService
    {
        private readonly ApplicationDbContext _dbContext;

        public PaymentService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<Payment>> GetAllPayments()
        {
            return await _dbContext.Payments
                .Include(p => p.Reading)
                .Include(p => p.FeeList)
                .ToListAsync();
        }

        public async Task<SearchPaymentResponse> SearchPaymentsList(SearchPaymentsRequest request)
        {
            var query = _dbContext.Payments
                .Include(p => p.Reading)
                .Include(p => p.FeeList)
                .AsQueryable();

            // Сортиране
            if (!string.IsNullOrEmpty(request.Sorting.SortProp))
            {
                query = request.Sorting.SortDirection == 1
                    ? query.OrderByDynamic(request.Sorting.SortProp)
                    : query.OrderByDescendingDynamic(request.Sorting.SortProp);
            }

            // Общо записи преди пейджинг
            var totalRecords = await query.CountAsync();

            // Пейджинг
            query = query
                .Skip(request.Paging.Page * request.Paging.PageSize)
                .Take(request.Paging.PageSize);

            var data = await query
                .Select(p => new PaymentResponse
                {
                    Id = p.Id,
                    Reading = p.Reading,
                    Date = p.Date,
                    FeeList = p.FeeList
                })
                .ToListAsync();

            return new SearchPaymentResponse
            {
                Data = data,
                TotalRecords = totalRecords
            };
        }

        public async Task<Payment> InsertPaymentAsync(InsertPaymentRequest insertPayment)
        {
            var payment = new Payment
            {
                Reading = await _dbContext.Readings.FindAsync(insertPayment.ReadingId)
                          ?? throw new Exception("Reading not found"),
                Date = insertPayment.Date,
                FeeList = insertPayment.FeeList?.Select(f => new PaymentFee
                {
                    Value = f.Value,
                    Description = f.Description
                }).ToList()
            };

            _dbContext.Payments.Add(payment);
            await _dbContext.SaveChangesAsync();

            return payment;
        }

        public async Task<bool> DeletePaymentAsync(int id)
        {
            var payment = await _dbContext.Payments.FindAsync(id);
            if (payment == null)
            {
                return false;
            }

            _dbContext.Payments.Remove(payment);
            await _dbContext.SaveChangesAsync();
            return true;
        }
    }
}
