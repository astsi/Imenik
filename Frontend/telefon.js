export class Telefon{
    
    constructor(broj, tip){
        this.id = -1;
        this.broj = broj;
        this.tip = tip;
    }

        izmeniTelefon(broj, tip){
            this.broj = broj;
            this.tip = tip;
        }

        istiBrojTip(broj,tip){
        if(this.broj === broj && this.tip === tip)
            return true;
        else
            return false;
    }
}