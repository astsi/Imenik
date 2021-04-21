using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Backend.Models{
    public class Telefon{

        [Key]
        [Column("ID")]
        public int id { get; set; }
        
        [Column("Broj")]
        [MaxLength(15)]
        public string broj { get; set; }

        [Column("Tip")]
        [MaxLength(30)]
        public string tip { get; set; }

        [JsonIgnore]
        [Column("Kontakt")]
        public Kontakt kontakt {get; set; }
        
        
        
    }
}

