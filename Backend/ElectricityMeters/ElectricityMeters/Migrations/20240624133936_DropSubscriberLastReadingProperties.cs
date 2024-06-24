using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ElectricityMeters.Migrations
{
    /// <inheritdoc />
    public partial class DropSubscriberLastReadingProperties : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastReading",
                table: "Subscribers");

            migrationBuilder.DropColumn(
                name: "LastRecordDate",
                table: "Subscribers");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "LastReading",
                table: "Subscribers",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastRecordDate",
                table: "Subscribers",
                type: "datetime2",
                nullable: true);
        }
    }
}
