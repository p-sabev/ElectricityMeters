using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ElectricityMeters.Migrations
{
    /// <inheritdoc />
    public partial class AddDefaultSubscriberReading : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "DefaultReading",
                table: "Subscribers",
                type: "float",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DefaultReading",
                table: "Subscribers");
        }
    }
}
