using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ElectricityMeters.Migrations
{
    /// <inheritdoc />
    public partial class AddReadingCoefficient : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "ReadingCoefficient",
                table: "Subscribers",
                type: "float",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReadingCoefficient",
                table: "Subscribers");
        }
    }
}
