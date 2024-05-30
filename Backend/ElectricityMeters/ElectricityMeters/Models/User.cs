namespace ElectricityMeters.Models
{
    public class User
    {

        public int Id { get; set; }
        public required string UserName { get; set; }
        public required string FirstName { get; set; }
        public string? MiddleName { get; set; }
        public required string LastName { get; set; }
        public required string Email { get; set; }
        public bool IsAdmin { get; set; }
        public bool IsSuperAdmin { get; set; }

        
        public User() { }

        public User(int id, string userName, string firstName, string middleName, string lastName, string email, bool isAdmin, bool isSuperAdmin)
        {
            Id = id;
            UserName = userName;
            FirstName = firstName;
            MiddleName = middleName;
            LastName = lastName;
            Email = email;
            IsAdmin = isAdmin;
            IsSuperAdmin = isSuperAdmin;
        }
    }
}
