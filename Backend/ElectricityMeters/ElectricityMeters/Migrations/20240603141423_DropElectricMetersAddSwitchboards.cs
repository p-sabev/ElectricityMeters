using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ElectricityMeters.Migrations
{
    /// <inheritdoc />
    public partial class DropElectricMetersAddSwitchboards : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Subscribers_ElectricMeters_ElectricMeterId",
                table: "Subscribers");

            migrationBuilder.DropTable(
                name: "ElectricMeters");

            migrationBuilder.RenameColumn(
                name: "ElectricMeterId",
                table: "Subscribers",
                newName: "SwitchboardId");

            migrationBuilder.RenameIndex(
                name: "IX_Subscribers_ElectricMeterId",
                table: "Subscribers",
                newName: "IX_Subscribers_SwitchboardId");

            migrationBuilder.CreateTable(
                name: "Switchboards",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Switchboards", x => x.Id);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_Subscribers_Switchboards_SwitchboardId",
                table: "Subscribers",
                column: "SwitchboardId",
                principalTable: "Switchboards",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Subscribers_Switchboards_SwitchboardId",
                table: "Subscribers");

            migrationBuilder.DropTable(
                name: "Switchboards");

            migrationBuilder.RenameColumn(
                name: "SwitchboardId",
                table: "Subscribers",
                newName: "ElectricMeterId");

            migrationBuilder.RenameIndex(
                name: "IX_Subscribers_SwitchboardId",
                table: "Subscribers",
                newName: "IX_Subscribers_ElectricMeterId");

            migrationBuilder.CreateTable(
                name: "ElectricMeters",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ElectricMeters", x => x.Id);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_Subscribers_ElectricMeters_ElectricMeterId",
                table: "Subscribers",
                column: "ElectricMeterId",
                principalTable: "ElectricMeters",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
