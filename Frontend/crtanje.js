import {kreirajEl, pocinje, ukloniIzliste} from "./pomocna.js";
import {Kontakt} from "./kontakt.js";
import {Telefon} from "./telefon.js";
export class Crtanje{
    
    constructor(host){
        
        this.listaKontakata = [];

        this.listaPretrage = [];
        this.parBrTip = [];
        this.count = 0;

        this.container = host;
        this.TbodyContainer = null;
    }

    preuzmiKontakte(){
        fetch("https://localhost:5001/Imenik/PribaviKontakte").then(p => {
            p.json().then(data => {
                data.forEach(kontakt => {
                    const kontaktObject = new Kontakt(kontakt.ime, kontakt.prezime, kontakt.tip, kontakt.opis);
                    kontaktObject.id = kontakt.id;

                    this.listaKontakata.push(kontaktObject);
                    //this.ucrtajKontakt(kontaktObject);
                    
                    kontakt.listaTelefona.forEach(telefon =>{
                        const telefonObject = new Telefon(telefon.broj, telefon.tip);
                        telefonObject.id = telefon.id;
                        kontaktObject.listaTelefona.push(telefonObject);
                        this.ucrtajTelefon(kontaktObject, telefonObject);
                    });
                });
            });
        }); 
    }

    ucrtajTelefon(kontakt,telefon){
        let host = this.Tbodycontainer;
        this.count ++;
        let tr = kreirajEl("tRow","tr","",host);
        let td = kreirajEl("tCount","td",this.count,tr);
        let ime = kreirajEl("tIme","td",kontakt.ime,tr);
        let prezime = kreirajEl("tPrezime","td",kontakt.prezime,tr);
        let tip = kreirajEl("tTip","td",kontakt.tip,tr);
        let broj = kreirajEl("tBroj","td",telefon.broj,tr);
        let tipb = kreirajEl("tTipB","td",telefon.tip,tr);
        let opis = kreirajEl("tOpis","td",kontakt.opis,tr);

        td = kreirajEl("t","td","",tr);
        let btnUredi = kreirajEl("btnUredi btn-secondary btn-sm","button","Uredi",td);
        btnUredi.onclick = ev => {
            alert("Uredi!");

           // console.log(tr, kontakt,telefon,this.container);
            this.meniUredi(kontakt,telefon,this.container);

        }
        let btnObrisi = kreirajEl("btnObrisi btn-secondary btn-sm","button","Obrisi",td);
        btnObrisi.onclick = ev => {
            //console.log(kontakt.id, telefon.id);
            this.meniObrisi(kontakt,telefon.id,host,tr);
            alert("Obrisi!");}
    }

    crtajTabelu(host){

        //let host = document.querySelector(".main");

        let table = kreirajEl("tabela table table-hoover", "table", "",host);
        let thead = kreirajEl("theader", "thead","",table);
        let th = kreirajEl("th","th","#",thead);
        th = kreirajEl("th","th","Ime",thead);
        th = kreirajEl("th","th","Prezime",thead);
        th = kreirajEl("th","th","Tip Kontakta",thead);
        th = kreirajEl("th","th","Broj telefona",thead);
        th = kreirajEl("th","th","Tip broja",thead);
        th = kreirajEl("th","th","Opis",thead);
        th = kreirajEl("th","th","Izmeni podatak",thead);
        this.Tbodycontainer = kreirajEl("tbody","tbody","",table);
        this.preuzmiKontakte();

    }
    crtajGlavnu(){
        this.crtajTabelu(this.container);

        let side = document.querySelector(".side");

        this.crtajPretragu(side);
        this.meniDodaj(side);
        let btnSnimi = kreirajEl("btnSnimi  btn-secondary btn-sm","button","Snimi u .csv formatu",this.container);
        btnSnimi.onclick = ev => this.snimiUFajl();
    }

    snimiUFajl(){

       let niz = this.nizZaCSV();
       var csv = 'Ime,Prezime,Tip Kontakta,Opis,Broj,Tip Broja\n';
       niz.forEach(function(row) {
               csv += row.join(',');
               csv += "\n";
       });
       var linkZaSkidanje = document.createElement('a');
       linkZaSkidanje.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
       linkZaSkidanje.target = '_blank';
       linkZaSkidanje.download = 'kontakti.csv';
       linkZaSkidanje.click();
    }

    nizZaCSV(){

        let niz = [];

        let tabela = document.querySelector(".tabela");
        let tr = tabela.getElementsByClassName("tRow");

        let j = 0;

        for(let i=0; i<tr.length; i++){

            let maliNiz = [];

            if (tr[i].style.display != "none"){

                maliNiz[0] = tr[i].querySelector(".tIme").innerHTML;
                maliNiz[1] = tr[i].querySelector(".tPrezime").innerHTML;
                maliNiz[2] = tr[i].querySelector(".tTip").innerHTML;
                maliNiz[3] = tr[i].querySelector(".tOpis").innerHTML;
                maliNiz[4] = tr[i].querySelector(".tBroj").innerHTML;
                maliNiz[5] = tr[i].querySelector(".tTipB").innerHTML;

                niz[j] = maliNiz;
                j++;

            }

            
        }
        console.log(niz);

        return niz;
    }

    crtajPretragu(host){

        kreirajEl("hPretraga","h4","Pretraga kontakata:",host);
        let forma = kreirajEl("forma","div","",host);
        kreirajEl("labela","label","po imenu:", forma);
        let ime = this.kreirajStavku("pIme","input","Ime kontakta","text",forma);
        ime.onkeyup = ev => this.pretraziIP("Ime");
        kreirajEl("labela","label","po prezimenu:", forma);
        let prezime = this.kreirajStavku("pPrezime","input","Prezime kontakta","text",forma);
        prezime.onkeyup = ev => this.pretraziIP("Prezime");
        kreirajEl("labela","label","po tipu kontakta:", forma);
        let tip = this.kreirajStavku("pTip","select","Tip kontakta","text",forma);
        tip.onclick = ev => this.prikaziTip(tip);
        let opt = kreirajEl("opt","option","",tip);
        opt.selected = "disabled";
        opt.innerHTML = "Tip kontakta";

         //doraditi!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

        kreirajEl("labela","label","po broju telefona:", forma);
        let broj = this.kreirajStavku("pBroj","input","Broj kontakta","text",forma);
        kreirajEl("labela","label","po tipu broja:", forma);
        let tipB = this.kreirajStavku("pTipB","input","Tip broja","text",forma);

        let btnPretrazi = kreirajEl("btnPretrazi btn-secondary btn-sm","button","Pretraži", forma);
        btnPretrazi.onclick = ev =>{

            //if (ime.value)
        }


    }

    pretraziIP(ip){

        let input = document.querySelector(".p"+ ip);
        let deo = input.value.toUpperCase();
        let tabela = document.querySelector(".tabela");
        let tr = tabela.getElementsByClassName("tRow");
        
        for(let i=0; i<tr.length; i++){
            let td = tr[i].querySelector(".t"+ ip);
            if(td){
                console.log(td.innerHTML);
                console.log(deo);
                let temp = td.innerHTML;
                
                if (deo === "")
                    tr[i].style.display = "";

                else if(pocinje(temp.toUpperCase(), deo))
                    tr[i].style.display = "";
                else
                    tr[i].style.display = "none";
            }
        }
    }

    
    prikaziTip(tip){

        let tabela = document.querySelector(".tabela");
        let tr = tabela.getElementsByClassName("tRow");
        for(let i=0; i<tr.length; i++){
            if(tr[i].style.display != null)
            {
                console.log("." + tip.className);
                let data = tr[i].querySelector(".tTip").innerHTML;
                console.log(data);
                let opt = kreirajEl("opt","option",data,tip);
                opt.value = data;
            }
        }
    }

    dodajKontakt(ime, prezime, tip, opis){

        //let b = this.listaKontakata.Contains(k);
        let b = false;
        if (b)
        {
            alert("Kontakt sa ovim podacima već postoji u listi.");
        }
        else
        {
            fetch("https://localhost:5001/Imenik/DodajKontakt", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "ime": ime,
                    "prezime": prezime,
                    "tip": tip,
                    "opis": opis
                })
            }).then(p => {
                    if (p.ok){
                        //("post");
                        p.text().then(q => {
                            let kontakt = new Kontakt(ime,prezime,tip,opis);
                            kontakt.id = q;
                            this.listaKontakata.push(kontakt);
                            this.dodajBrojeve(q);
                        });
                    }
                    else if(p.status == 406){
                        alert("Greška: Unesite sve potrebne informacije.");
                    }
                    else {
                        alert("Greška na Backend - u.");
                    }
            }).catch (p => {
                alert("Greška");
        });    
        }
    }

    dodajBrojeve(kId){

        this.parBrTip.forEach(el => {
            this.dodajBroj(kId,el.key,el.value);
        });
    }

    dodajBroj(kId, broj, tip){
        
        //uslov: br !=0, kId != -1;

    fetch("https://localhost:5001/Imenik/DodajTelefon/" + kId, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "broj": broj,
            "tip": tip
        })
        }).then(p => {
            if (p.ok){
               // console.log("post Telefon");
                p.text().then(q => {
                    let telefon = new Telefon(broj,tip);
                    telefon.id = q;
                    
                    let indK = this.listaKontakata.findIndex(i => i.id ===  kId);
                    this.listaKontakata[indK].listaTelefona.push(telefon);

                    this.ucrtajTelefon(this.listaKontakata[indK],telefon);
                });
            }
            else if(p.status == 406){
                alert("Greška: Unesite sve potrebne informacije.");
            }
            else {
                alert("Greška na Backend - u.");
            }
        }).catch (p => {
            alert("Greška");
    });
    
        
    }

    izmeniKontakt(kId, ime, prezime, tip, opis){

        //console.log(kId, ime, prezime, tip, opis);

        //provera da li je ime prazno

        fetch("https://localhost:5001/Imenik/IzmeniKontakt", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify ({
                        "id": kId,
                        "ime": ime,
                        "prezime": prezime,
                        "tip": tip,
                        "opis": opis
                    })
                }).then(p => {
                    if (p.ok){
                        let ind = this.listaKontakata.findIndex(i => i.id === kId);
                        //console.log(ind);
                        this.listaKontakata[ind].izmeniKontakt(ime, prezime, tip, opis);

                        this.reloadujTabelu();
                    }
                    else{
                        alert("Greška na Backend - u.");
                    }
                });
    }

    izmeniBrojeve(telefon, broj, tip){

        fetch("https://localhost:5001/Imenik/IzmeniTelefon",{
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify ({
                "id": telefon.id,
                "broj": broj,
                "tip": tip
            })
        }).then(p => {
            if (p.ok){

                telefon.izmeniTelefon(broj, tip);
                this.reloadujTabelu();
            }
            else{
                alert("Greška na Backend - u.");
            }
        });
    }

    crtajMeni(host){
    
        //let listaAtributa = ["mIme","mPrezime","mTip"];
        
        let meni = kreirajEl("meni","div","",host);

        kreirajEl("b","b","Ime",meni);
        let ime = this.kreirajStavku("iIme","input","npr. Pera", "text", meni);
        kreirajEl("b","b","Prezime",meni);
        let prezime = this.kreirajStavku("iPrezime","input","npr. Perić", "text", meni);
        kreirajEl("b","b","Tip",meni);
        let tip = this.kreirajStavku("iTip","input","npr. posao", "text", meni);

        let tabela = kreirajEl("iTabela table table-hoover","table","", meni);
        let thead = kreirajEl("theader", "thead","",tabela);
        let th = kreirajEl("th","th","Broj telefona",thead);
        th = kreirajEl("th","th","Tip broja",thead);
        let tbody = kreirajEl("","tbody","", tabela);
        let tr = kreirajEl("tr","tr","", tbody);
        let td = kreirajEl("","td","", tr);
        let broj = this.kreirajStavku("iBroj","input","npr. 018111222", "number", td);
        td = kreirajEl("","td","", tr);
        let tipB = this.kreirajStavku("iTipB","input","npr. fiksni", "text", td);
        let btnDodajRed = kreirajEl("btnPlus btn-secondary btn-sm","button","+", meni);
        btnDodajRed.onclick = ev => {
            //console.log(broj);
            if(broj.value != ""){

                let tr = kreirajEl("tr","tr","", tbody);
                let td = kreirajEl("","td","", tr);
                broj = this.kreirajStavku("iBroj","input","npr. 060111222", "number", td);
                td = kreirajEl("","td","", tr);
                tipB = this.kreirajStavku("iTipB","input","npr. mobilni", "text", td);
            }
            else
                alert("Niste uneli broj telefona.");

        }

        kreirajEl("b","b","Opis kontakta",meni);
        let opis = this.kreirajStavku("iOpis","textArea","npr. Pera sa IT obuke", "text", meni);

        //return [ime.value,prezime.value,tip.value,opis.value];
    }

    meniDodaj(host){

        kreirajEl("hDodaj","h4","Dodaj kontakt",host);

        this.crtajMeni(host);
        let meni = document.querySelector(".meni");
        meni.className = "meniD";

        let btnDodaj = kreirajEl("iBtnDodaj btn-secondary btn-sm","button","Dodaj kontakt", meni);
        btnDodaj.onclick = ev => {

            let ime = meni.querySelector(".iIme").value;
            let prezime = meni.querySelector(".iPrezime").value;
            let opis = meni.querySelector(".iOpis").value;
            let tip = meni.querySelector(".iTip").value;

            let listaBr = meni.querySelectorAll(".iBroj");
            let listaTB = meni.querySelectorAll(".iTipB");

            for (let i = 0; i< listaBr.length; i++)
            {
                this.parBrTip.push({
                    key: listaBr[i].value,
                    value: listaTB[i].value
                });
            }

            this.dodajKontakt(ime,prezime,tip,opis);
        }
    }

    reloadujTabelu(){
        let t = this.container.querySelector(".tabela");
        this.container.removeChild(t);
        this.crtajTabelu(this.container);
    }

    meniUredi(kontakt,telefon, host){
       
        this.crtajMeni(host);
        let meni = document.querySelector(".meni");
        meni.className = "meniU";
        meni.querySelector(".iIme").value = kontakt.ime;
        meni.querySelector(".iPrezime").value = kontakt.prezime;
        meni.querySelector(".iTip").value = kontakt.tip;
        meni.querySelector(".iOpis").value = kontakt.opis;
        meni.querySelector(".iBroj").value = telefon.broj;
        meni.querySelector(".iTipB").value = telefon.tip;

        let btnIzmeni = kreirajEl("iBtnIzmeni btn-secondary btn-sm","button","Izmeni kontakt", meni);
        btnIzmeni.onclick = ev => {

        
            let broj = meni.querySelector(".iBroj").value;
            let tipB = meni.querySelector(".iTipB").value;

            let ime = meni.querySelector(".iIme").value;
            let prezime = meni.querySelector(".iPrezime").value;
            let tip = meni.querySelector(".iTip").value;
            let opis = meni.querySelector(".iOpis").value;

            // for (let i = 0; i< listaBr.length; i++)
            // {
            //     this.parBrTip.push({
            //         key: listaBr[i].value,
            //         value: listaTB[i].value
            //     });
            // }

            if (ime === kontakt.ime && prezime === kontakt.prezime && tip === kontakt.tip && opis === kontakt.opis){
                this.izmeniBrojeve(telefon, broj, tipB);
            }
            else
                this.izmeniKontakt(kontakt.id, ime, prezime, tip, opis);
            
            this.container.removeChild(meni);
        }

    }

    meniObrisi(kontakt, brId,tbody,tr){

        //console.log(kontakt.listaTelefona.length);

        if (kontakt.listaTelefona.length > 1){
            this.obrisiBroj(kontakt.id,brId,tbody,tr);
        }
        else{
            this.obrisiKontakt(kontakt.id,tbody,tr);
        }

    }

    obrisiBroj(kId,brId,tbody,tr){

        fetch("https://localhost:5001/Imenik/ObrisiTelefon/" + brId, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
            })
        }).then(p => {
                if (p.ok){
                    console.log("obrisi broj");
                    tbody.removeChild(tr);
                    let ind = this.listaKontakata.findIndex(i=> i.id === kId);
                    ukloniIzliste(brId, this.listaKontakata[ind]);
                }
                else {
                    alert("Error - another type of error.");
                }
        });
    }

    obrisiKontakt(kId, tbody,tr){

        fetch("https://localhost:5001/Imenik/ObrisiKontakt/" + kId, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
            })
        }).then(p => {
                if (p.ok){
                    console.log("obrisi kontakt");
                    tbody.removeChild(tr);
                }
                else {
                    alert("Error - another type of error.");
                }
        });
    }

    kreirajStavku(klasa, tipElementa, placeholder, tip, host){
        
        let el = kreirajEl(klasa, tipElementa,"",host);
        el.placeholder = placeholder;
        //el.type = tip;
        el.value = "";
        return el;
    }


}