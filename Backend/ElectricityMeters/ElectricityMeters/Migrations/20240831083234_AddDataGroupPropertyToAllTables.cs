using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ElectricityMeters.Migrations
{
    /// <inheritdoc />
    public partial class AddDataGroupPropertyToAllTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DataGroup",
                table: "Switchboards",
                type: "int",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<int>(
                name: "DataGroup",
                table: "Subscribers",
                type: "int",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<int>(
                name: "DataGroup",
                table: "StandartFees",
                type: "int",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<int>(
                name: "DataGroup",
                table: "Readings",
                type: "int",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<int>(
                name: "DataGroup",
                table: "Prices",
                type: "int",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<int>(
                name: "DataGroup",
                table: "Payments",
                type: "int",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<int>(
                name: "DataGroup",
                table: "PaymentFees",
                type: "int",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<int>(
                name: "DataGroup",
                table: "AspNetUsers",
                type: "int",
                nullable: false,
                defaultValue: 1);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DataGroup",
                table: "Switchboards");

            migrationBuilder.DropColumn(
                name: "DataGroup",
                table: "Subscribers");

            migrationBuilder.DropColumn(
                name: "DataGroup",
                table: "StandartFees");

            migrationBuilder.DropColumn(
                name: "DataGroup",
                table: "Readings");

            migrationBuilder.DropColumn(
                name: "DataGroup",
                table: "Prices");

            migrationBuilder.DropColumn(
                name: "DataGroup",
                table: "Payments");

            migrationBuilder.DropColumn(
                name: "DataGroup",
                table: "PaymentFees");

            migrationBuilder.DropColumn(
                name: "DataGroup",
                table: "AspNetUsers");
        }
    }
}
