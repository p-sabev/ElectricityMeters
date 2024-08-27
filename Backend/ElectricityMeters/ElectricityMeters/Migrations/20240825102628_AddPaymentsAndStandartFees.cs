using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ElectricityMeters.Migrations
{
    /// <inheritdoc />
    public partial class AddPaymentsAndStandartFees : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Paid",
                table: "Readings");

            migrationBuilder.AddColumn<int>(
                name: "Payment",
                table: "Readings",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Payments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ReadingId = table.Column<int>(type: "int", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Payments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Payments_Readings_ReadingId",
                        column: x => x.ReadingId,
                        principalTable: "Readings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "StandartFees",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Value = table.Column<double>(type: "float", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StandartFees", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PaymentFees",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Payment = table.Column<int>(type: "int", nullable: false),
                    Value = table.Column<double>(type: "float", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PaymentId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PaymentFees", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PaymentFees_Payments_PaymentId",
                        column: x => x.PaymentId,
                        principalTable: "Payments",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_PaymentFees_PaymentId",
                table: "PaymentFees",
                column: "PaymentId");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_ReadingId",
                table: "Payments",
                column: "ReadingId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PaymentFees");

            migrationBuilder.DropTable(
                name: "StandartFees");

            migrationBuilder.DropTable(
                name: "Payments");

            migrationBuilder.DropColumn(
                name: "Payment",
                table: "Readings");

            migrationBuilder.AddColumn<bool>(
                name: "Paid",
                table: "Readings",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
