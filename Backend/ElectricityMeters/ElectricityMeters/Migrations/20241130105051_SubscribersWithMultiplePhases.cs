using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ElectricityMeters.Migrations
{
    /// <inheritdoc />
    public partial class SubscribersWithMultiplePhases : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PhaseCount",
                table: "Subscribers",
                type: "int",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<double>(
                name: "FirstPhaseValue",
                table: "Readings",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "SecondPhaseValue",
                table: "Readings",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "ThirdPhaseValue",
                table: "Readings",
                type: "float",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PhaseCount",
                table: "Subscribers");

            migrationBuilder.DropColumn(
                name: "FirstPhaseValue",
                table: "Readings");

            migrationBuilder.DropColumn(
                name: "SecondPhaseValue",
                table: "Readings");

            migrationBuilder.DropColumn(
                name: "ThirdPhaseValue",
                table: "Readings");
        }
    }
}
