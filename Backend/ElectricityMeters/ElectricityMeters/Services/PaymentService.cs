using ElectricityMeters.Interfaces;
using ElectricityMeters.Migrations;
using ElectricityMeters.Models;
using ElectricityMeters.Request.Payments;
using ElectricityMeters.Response.Payments;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations;
using System;

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
                .Include(p => p.Reading.Subscriber)
                .Include(p => p.Reading.Subscriber.Switchboard)
                .AsQueryable();

            // Филтриране
            if (request.Name?.Length > 0)
            {
                query = query.Where(s => s.Reading.Subscriber.Name.Contains(request.Name));
            }

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
                    Subscriber = p.Reading.Subscriber,
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
            var reading = await _dbContext.Readings.FindAsync(insertPayment.ReadingId);
            if (reading == null)
            {
                throw new Exception("ReadingNotFound");
            }

            var readingHasOtherPayment = await _dbContext.Payments.AnyAsync(p => p.Reading.Id == insertPayment.ReadingId);
            if (readingHasOtherPayment)
            {
                throw new Exception("ReadingAlreadyHasPayment");
            }

            var payment = new Payment
            {
                Reading = reading,
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
            var payment = await _dbContext.Payments.FindAsync(id) ?? throw new Exception("PaymentNotFound");
            
            try
            {
                _dbContext.Payments.Remove(payment);
                await _dbContext.SaveChangesAsync();
                return true;
            } catch (Exception ex)
            {
                var exx = ex;
                return false;
            }
            
            
        }

        public async Task<PaymentReportResponse> GetPaymentReportAsync(PaymentReportRequest request)
        {
            // Step 1: Filter payments within the specified date range
            var paymentsInRange = await _dbContext.Payments
                .Include(p => p.FeeList)
                .Include(p => p.Reading)
                .Where(p => p.Reading != null && p.Date >= request.DateFrom && p.Date <= request.DateTo)
                .ToListAsync();

            // Step 2: Calculate the total amounts for electricity and fees
            double totalElectricity = paymentsInRange
                .Where(p => p.Reading != null)
                .Sum(p => p.Reading.AmountDue);
            double totalFees = paymentsInRange
                .SelectMany(p => p.FeeList ?? new List<PaymentFee>())
                .Sum(f => f.Value);

            // Step 3: Group the fees by description to calculate the total value for each fee type
            var feeDetails = paymentsInRange
                .SelectMany(p => p.FeeList ?? new List<PaymentFee>())
                .GroupBy(f => f.Description)
                .Select(g => new PaidFees
                {
                    Description = g.Key ?? "No Description",
                    TotalValue = g.Sum(f => f.Value).ToString("F2")
                })
                .ToList();

            // Step 4: Create and return the response
            var response = new PaymentReportResponse
            {
                DateFrom = request.DateFrom,
                DateTo = request.DateTo,
                PaidTotalElectricity = totalElectricity,
                PaidTotalFees = totalFees,
                Fees = feeDetails
            };

            return response;
        }

    }
}
