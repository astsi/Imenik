using Microsoft.EntityFrameworkCore.Migrations;

namespace Backend.Migrations
{
    public partial class V1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Kontakti",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ime = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    Prezime = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    Tip = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    Opis = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Kontakti", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Telefoni",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Broj = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: true),
                    Tip = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    kontaktid = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Telefoni", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Telefoni_Kontakti_kontaktid",
                        column: x => x.kontaktid,
                        principalTable: "Kontakti",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Telefoni_kontaktid",
                table: "Telefoni",
                column: "kontaktid");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Telefoni");

            migrationBuilder.DropTable(
                name: "Kontakti");
        }
    }
}
