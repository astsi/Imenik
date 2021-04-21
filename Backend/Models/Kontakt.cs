using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models{

    public class Kontakt{

        [Key]
        [Column("ID")]
        public int id { get; set; }

        [Column("Ime")]
        [MaxLength(30)]
        public string ime { get; set; }

        [Column("Prezime")]
        [MaxLength(30)]
        public string prezime { get; set; }

        [Column("Tip")]
        [MaxLength(30)]
        public string tip { get; set; }

        [Column("Opis")]
        [MaxLength(255)]
        public string opis { get; set; }

        public virtual List<Telefon> listaTelefona { get; set; }

    }
}