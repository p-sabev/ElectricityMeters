using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ElectricityMeters.Migrations
{
    /// <inheritdoc />
    public partial class FixPaymentFeeRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PaymentFees_Payments_PaymentId",
                table: "PaymentFees");

            migrationBuilder.DropColumn(
                name: "Payment",
                table: "PaymentFees");

            migrationBuilder.AlterColumn<int>(
                name: "PaymentId",
                table: "PaymentFees",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_PaymentFees_Payments_PaymentId",
                table: "PaymentFees",
                column: "PaymentId",
                principalTable: "Payments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PaymentFees_Payments_PaymentId",
                table: "PaymentFees");

            migrationBuilder.AlterColumn<int>(
                name: "PaymentId",
                table: "PaymentFees",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "Payment",
                table: "PaymentFees",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddForeignKey(
                name: "FK_PaymentFees_Payments_PaymentId",
                table: "PaymentFees",
                column: "PaymentId",
                principalTable: "Payments",
                principalColumn: "Id");
        }
    }
}
