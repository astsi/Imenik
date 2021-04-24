export class Kontakt{
    
    constructor(ime, prezime, tip, opis){
        this.id = -1;
        this.ime = ime;
        this.prezime = prezime;
        this.tip = tip;
        this.opis = opis;

        this.listaTelefona = [];
    }

    dodajTelefon(telefon){
        
        let ind = this.listaTelefona.findIndex(l => l.broj ===  telefon.broj);
        if (ind > -1){
            alert("Ovaj broj se već nalazi u listi.");
        }
        else{
            this.listaTelefona.push(telefon);
        };
    }

    izmeniKontakt(ime, prezime, tip, opis){
        this.ime = ime;
        this.prezime = prezime;
        this.tip = tip;
        this.opis = opis;
    }
}