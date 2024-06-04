using ElectricityMeters.Interfaces;
using ElectricityMeters.Models;
using Microsoft.EntityFrameworkCore;

namespace ElectricityMeters.Services
{
    public class UsersService : IUsersService
    {
        private readonly Models.DbContext _dbContext;

        public UsersService(Models.DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _dbContext.Users.ToListAsync();
        }
    }
}
