using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ElectricityMeters.Migrations
{
    /// <inheritdoc />
    public partial class ReadingAmountDueCopy : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "AmountDueCopy",
                table: "Readings",
                type: "float",
                nullable: true,
                defaultValue: 0.0);

            migrationBuilder.Sql("UPDATE Readings SET AmountDueCopy = AmountDue");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AmountDueCopy",
                table: "Readings");
        }
    }
}
