using Microsoft.EntityFrameworkCore;

namespace Backend.Models{
    public class ImenikContext : DbContext{

        public DbSet<Kontakt> Kontakti { get; set; }
        public DbSet<Telefon> Telefoni { get; set; }
        public ImenikContext(DbContextOptions options) : base(options)
        {

        }

    }
}