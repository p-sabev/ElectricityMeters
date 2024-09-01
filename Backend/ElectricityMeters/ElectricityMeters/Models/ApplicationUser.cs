using Microsoft.AspNetCore.Identity;

namespace ElectricityMeters.Models
{
    public class ApplicationUser : IdentityUser
    {
        public required string Name { get; set; }
        public string? MiddleName { get; set; }
        public required string LastName { get; set; }
        public bool IsAdmin { get; set; }
        public bool IsSuperAdmin { get; set; }
        public int DataGroup {  get; set; }
    }
}
