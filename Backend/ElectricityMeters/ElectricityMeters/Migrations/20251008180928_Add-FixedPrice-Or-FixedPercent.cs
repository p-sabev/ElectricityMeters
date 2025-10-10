using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ElectricityMeters.Migrations
{
    /// <inheritdoc />
    public partial class AddFixedPriceOrFixedPercent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "IndividualPrice",
                table: "Subscribers",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "IndividualPricePercent",
                table: "Subscribers",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "UsedFixedPrice",
                table: "Readings",
                type: "float",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IndividualPrice",
                table: "Subscribers");

            migrationBuilder.DropColumn(
                name: "IndividualPricePercent",
                table: "Subscribers");

            migrationBuilder.DropColumn(
                name: "UsedFixedPrice",
                table: "Readings");
        }
    }
}
