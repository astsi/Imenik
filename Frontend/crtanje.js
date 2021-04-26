import {kreirajEl, kreirajInput, nadjiKontakt, pocinje, prazanJe, ukloniIzliste} from "./pomocna.js";
import {Kontakt} from "./kontakt.js";
import {Telefon} from "./telefon.js";
export class Crtanje{
    
//#region Konstruktor
    constructor(host){
        
        this.listaKontakata = []; //nakon probavljanja podataka iz baze sadrzi listu svih kontakata
        this.parBrTip = []; //placeholder za brojeve i tipove brojeva, koristi se pri upisu brojeva u bazu
        this.count = 0; //lokalni indeksi kontakata (dodati radi preglednosti koda) 

        this.container = host; //blok u kome se iscrtavaju elementi, prosledjen kroz main
        this.TbodyContainer = null; //blok u kome se isctava telo tabele (redovi sa kontaktima)
    } 
//#endregion

//#region Snimanje tabele u .csv formatu

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
        return niz;
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
//#endregion    

// #region Komunikacija sa bazom

    preuzmiKontakte(){
        fetch("https://localhost:5001/Imenik/PribaviKontakte").then(p => {
            p.json().then(data => {
                data.forEach(kontakt => {
                    const kontaktObject = new Kontakt(kontakt.ime, kontakt.prezime, kontakt.tip, kontakt.opis);
                    kontaktObject.id = kontakt.id;

                    this.listaKontakata.push(kontaktObject);
                    
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

    dodajKontakt(ime, prezime, tip, opis){

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

    dodajBroj(kId, broj, tip){

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
                tbody.removeChild(tr);
                let ind = this.listaKontakata.findIndex(i=> i.id === kId);
                let indTel = this.listaKontakata[ind].listaTelefona.findIndex(i => i.id ===brId);
                let Tel = this.listaKontakata[ind].listaTelefona[indTel];
                ukloniIzliste(Tel, this.listaKontakata[ind]);
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
                tbody.removeChild(tr);
            }
            else {
                alert("Error - another type of error.");
            }
        });
    }
    
// #endregion

//#region Pomocne Funkcije

    updateujTipove(){

        //podaci za tip kontakta
        let dl = document.querySelector(".dlT");
        console.log("Dl: " + dl);
        let lista = this.nizZaTipK();
        console.log(lista);
        let option = "";
        for (let i = 0; i<lista.length; i++){
            option += "<option value='" + lista[i] + "' />";
        }
        console.log(option);
        console.log(dl);
        dl.innerHTML = option;

        //podaci za tip broja
        dl = document.querySelector(".dlTB");
        console.log(dl);
        lista = this.nizZaTipB();
        option = "";
        for (let i = 0; i<lista.length; i++){
            option += "<option value='" + lista[i] + "' />";
        }
        dl.innerHTML = option;
    }

    kreirajStavku(klasa, tipElementa, placeholder, tip, host){
            
        let el = kreirajEl(klasa, tipElementa,"",host);
        el.placeholder = placeholder;
        el.type = "\"" + tip + "\"";
        el.value = "";
        return el;
    }

    reloadujTabelu(){
        let t = this.container.querySelector(".tabela");
        this.container.removeChild(t);
        this.crtajTabelu(this.container);
    }

    nizZaBr(){
        let niz = [];
        this.listaKontakata.forEach(el => {
            let opcija = el.ime + " " + el.prezime + ", " + el.tip + ", " + el.opis;
            niz.push(opcija);
        })
        return niz;
    }

    nizZaTipB(){
        let niz = [];
        this.listaKontakata.forEach(k => {
            k.listaTelefona.forEach(t => {
                if (niz.findIndex(i => i === t.tip) === -1)
                niz.push(t.tip);
            });
        });
        console.log(niz);
        return niz;
    }

    nizZaTipK(){

        let niz = [];
        this.listaKontakata.forEach(el => {
            if (niz.findIndex(i => i === el.tip) === -1)
            niz.push(el.tip);
        })
        return niz;
    }

    pretraziIP(ip){

        let input = document.querySelector(".p"+ ip);
        let deo = input.value.toUpperCase();
        let tabela = document.querySelector(".tabela");
        let tr = tabela.getElementsByClassName("tRow");
        
        for(let i=0; i<tr.length; i++){
            let td = tr[i].querySelector(".t"+ ip);
            if(td){
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
                let data = tr[i].querySelector(".tTip").innerHTML;
                let opt = kreirajEl("opt","option",data,tip);
                opt.value = data;
            }
        }
    }

    dodajBrojeve(kId){

        let brojevi = [];
        this.listaKontakata.forEach(k => {
            k.listaTelefona.forEach(t => {
                brojevi.push(t.broj);
            });
        });
        this.parBrTip.forEach(el => {
            if (brojevi.findIndex(t => t === el.key) === -1)
            {
                el.value = prazanJe(el.value);
                this.dodajBroj(kId,el.key,el.value);
            }
            else{
                alert("Broj telefona: " + el.key + " već postoji u bazi i neće biti dodat.");
            }
        });
    }


//#endregion
    
//#region Funkcije za iscrtavanje

    crtajGlavnu(){
        let btnSnimi = kreirajEl("btnSnimi  btn-secondary btn-sm","button","Snimi u .csv formatu",this.container);
        btnSnimi.onclick = ev => this.snimiUFajl();
        this.crtajTabelu(this.container);
        let side = document.querySelector(".side");
        this.crtajPretragu(side);

        let dodajK = kreirajEl("dodajK btn btn-link","button","Dodaj kontakt",side);
        dodajK.onclick = ev => {

            this.updateujTipove();

            let meni = document.querySelector(".meniD");
            if (meni.style.display == "none")
                meni.style.display = "";
            else
                meni.style.display = "none";
        }
        this.meniDodaj(side);

        let dodajB = kreirajEl("dodajB btn btn-link","button","Dodaj broj postojećem kontaktu",side);
        dodajB.onclick = ev => {

            let meni = document.querySelector(".meniBroj");
            let select = meni.querySelector(".sKontakt");
            let opcije = this.nizZaBr();

            while (select.firstChild) {
                select.removeChild(select.lastChild);
                }

            opcije.forEach(opcija =>{
                kreirajEl("opcijaBr","option",opcija,select);
            })

            if (meni.style.display == "none")
                meni.style.display = "";
            else{
                meni.style.display = "none";
            }
        }
        this.meniDodajBroj(side);
    }

    crtajTabelu(host){

        this.preuzmiKontakte();
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

            this.updateujTipove();

            let strana = document.querySelector(".main");
            let meni = strana.querySelector(".meni");
            if (meni != null)
            {
                strana.removeChild(meni);
            }

            this.meniUredi(kontakt,telefon,this.container);
        }
        let btnObrisi = kreirajEl("btnObrisi btn-secondary btn-sm","button","Obrisi",td);
        btnObrisi.onclick = ev => {
            this.meniObrisi(kontakt,telefon.id,host,tr);
            }
    }

    crtajTabeluBrojeva(meni){

        let tabela = kreirajEl("iTabela table table-hoover","table","", meni);
        let thead = kreirajEl("theader", "thead","",tabela);
        let th = kreirajEl("th","th","Broj telefona",thead);
        th = kreirajEl("th","th","Tip broja",thead);
        let tbody = kreirajEl("","tbody","", tabela);
        let tr = kreirajEl("tr","tr","", tbody);
        let td = kreirajEl("","td","", tr);
        let broj = kreirajInput("iBroj","npr. 018111222", td);
        broj.type = "number";
        td = kreirajEl("","td","", tr);
        
        let formaTB = kreirajEl("formaTB","form","",td);
        let tipB = kreirajInput("iTipB","npr. fiksni", formaTB);
        let dl = kreirajEl("dlTB","datalist","",formaTB);
        dl.id ="dl1";
        tipB.setAttribute('list','dl1');


        let btnDodajRed = kreirajEl("btnPlus btn-secondary btn-sm","button","+", meni);
        btnDodajRed.onclick = ev => {
            if(broj.value != ""){

                let tr = kreirajEl("tr","tr","", tbody);
                let td = kreirajEl("","td","", tr);
                broj = kreirajInput("iBroj","npr. 060111222", td);
                broj.type = "number";
                td = kreirajEl("","td","", tr);
                formaTB = kreirajEl("formaTB","form","",td);
                tipB = kreirajInput("iTipB","npr. mobilni", formaTB);
                dl = kreirajEl("dlTB","datalist","",formaTB);
                dl.id ="dl1";
                tipB.setAttribute('list','dl1');

                //dodaj listu 
            }
            else{
                alert("Niste uneli broj telefona.");
            }
        }
    }

    crtajPretragu(host){

        kreirajEl("hPretraga","h4","Pretraga kontakata:",host);
        let forma = kreirajEl("forma","div","",host);
        
        kreirajEl("labela","label","po imenu:", forma);
        let ime = kreirajInput("pIme","Ime kontakta",forma);
        ime.onkeyup = ev => this.pretraziIP("Ime");
        
        kreirajEl("labela","label","po prezimenu:", forma);
        let prezime = kreirajInput("pPrezime","Prezime kontakta",forma);
        prezime.onkeyup = ev => this.pretraziIP("Prezime");
        
        kreirajEl("labela","label","po tipu kontakta:", forma);
        let tip = kreirajEl("pTip", "input","Tip kontakta",forma);
        let dl = kreirajEl("dlT","datalist","",forma);
        dl.id ="dl2";
        tip.setAttribute('list','dl2');
        tip.placeholder = "Tip kontakta";
        tip.onkeyup = ev => this.pretraziIP("Tip");
        tip.onclick = ev => this.updateujTipove();

        kreirajEl("labela","label","po broju telefona:", forma);
        let broj = kreirajInput("pBroj","Broj kontakta",forma);
        broj.type = "number";
        broj.onkeyup = ev => this.pretraziIP("Broj");
        
        kreirajEl("labela","label","po tipu broja:", forma);
        let tipB = kreirajInput("pTipB","Tip broja",forma);
        dl = kreirajEl("dlTB","datalist","",forma);
        dl.id ="dl1";
        tipB.setAttribute('list','dl1');
        tipB.onkeyup = ev => this.pretraziIP("TipB");
        tipB.onclick = ev => this.updateujTipove();
    }

    crtajMeni(host){
        
        let meni = kreirajEl("meni","div","",host);

        kreirajEl("p","p","Ime",meni);
        kreirajInput("iIme","npr. Pera", meni);
        kreirajEl("p","p","Prezime",meni);
        kreirajInput("iPrezime","npr. Perić", meni);
        kreirajEl("p","p","Tip",meni);
        let formaT = kreirajEl("formaT","form","",meni); 

        let tipU = kreirajInput("iTipU","npr. porodica",formaT);
        let dl = kreirajEl("dlT","datalist","",formaT);
        dl.id ="dl2";
        tipU.setAttribute('list','dl2');
        

        this.crtajTabeluBrojeva(meni);
        kreirajEl("p","p","Opis kontakta",meni);
        let opis = kreirajEl("iOpis","textArea","npr. Pera sa IT obuke", meni);
        opis.placeholder = "npr. Pera sa IT obuke";

    }

//#endregion

//#region Meni za Dodavanje, Brisanje i Izmenu podataka

    meniDodaj(host){

        this.crtajMeni(host);
        let meni = document.querySelector(".meni");
        meni.style.display = "none";
        meni.className = "meniD";

        let btnDodaj = kreirajEl("iBtnDodaj btn-secondary btn-sm","button","Dodaj kontakt", meni);
        btnDodaj.onclick = ev => {
            console.log("kliknuto");
            this.updateujTipove();

        let ime = meni.querySelector(".iIme").value;
        let listaBr = meni.querySelectorAll(".iBroj");
        let listaTB = meni.querySelectorAll(".iTipB");

        if (ime === "" || ime === " " || listaBr.length < 1){
            alert("Obavezan je unos imena i jednog broja!");
        }
        else {
            let prezime = meni.querySelector(".iPrezime").value;
            let opis = meni.querySelector(".iOpis").value;
            let tip = meni.querySelector(".iTipU").value;
            
            for (let i = 0; i< listaBr.length; i++){
                if (listaBr[i].value.length < 6 || listaBr[i].value.length > 15){
                    alert("Nevalidno unet broj " + listaBr[i].value + " neće biti sačuvan.");
                }
                else {
                    this.parBrTip.push({
                    key: listaBr[i].value,
                    value: prazanJe(listaTB[i].value)
                    });
                }
            }
            prezime = prazanJe(prezime);
            tip = prazanJe(tip);
            opis = prazanJe(opis);

            if (this.listaKontakata.findIndex(k => k.ime === ime && k.prezime === prezime && k.tip === tip && k.opis === opis) === -1){
                this.dodajKontakt(ime,prezime,tip,opis);
            }
            else{
                alert("Kontakt sa ovim podacima već postoji u bazi. Pokusajte ponovo ili dodajte broj postojecem kontaktu. ");
            }
            }
        }
    }

    meniDodajBroj(host){

        let id = -1;
        let meni = kreirajEl("meniBroj","div","",host);
        meni.style.display = "none";

        kreirajEl("label","p","Izaberi kontakt:",meni);

        let sKontakt = kreirajEl("sKontakt","select","",meni);
        let opt = kreirajEl("opt","option","Lista kontakata iz baze",sKontakt);
        opt.selected = "disabled";
        sKontakt.onclick = ev =>{

            if (sKontakt.value != "Lista kontakata iz baze")
            {
                let reci = sKontakt.value.replaceAll(",","").split(" ");
                let kOpis = sKontakt.value.replace(/^([^ ]+ ){3}/, '');
                let ind = nadjiKontakt(this.listaKontakata,reci[0],reci[1],reci[2],kOpis);
                id = this.listaKontakata[ind].id;
            }
        }
        kreirajEl("label","p","Unesi broj:",meni);
        this.crtajTabeluBrojeva(meni);

        let btnDodaj = kreirajEl("iBtnDodaj btn-secondary btn-sm","button","Dodaj kontakt", meni);
        btnDodaj.onclick = ev => {

            if (sKontakt.value != "Lista kontakata iz baze"){

                let listaBr = meni.querySelectorAll(".iBroj");
                let listaTB = meni.querySelectorAll(".iTipB");
                if(listaBr.length > 0){
                    for (let i = 0; i< listaBr.length; i++)
                    {
                        this.parBrTip.push({
                            key: listaBr[i].value,
                            value: listaTB[i].value
                        });
                    }
                    this.dodajBrojeve(id);
                }
                else{
                    alert("Nema unesenih brojeva telefona");
                }
            }
            else{
                alert("Nije odabran kontakt iz liste.");
            }
        }
    }

    meniUredi(kontakt,telefon, host){
        
        this.crtajMeni(host);
        
        let strana = document.querySelector(".main");
        let meni = strana.querySelector(".meni");   

        //meni.removeChild(meni.querySelector(".btnPlus"));
        meni.querySelector(".iIme").value = kontakt.ime;
        meni.querySelector(".iPrezime").value = kontakt.prezime;
        //meni.querySelector(".iTipU").value = kontakt.tip;
        meni.querySelector(".iOpis").value = kontakt.opis;
        meni.querySelector(".iBroj").value = telefon.broj;
        //meni.querySelector(".iTipB").value = telefon.tip;

        let btnIzmeni = kreirajEl("iBtnIzmeni btn-secondary btn-sm","button","Izmeni kontakt", meni);
        btnIzmeni.onclick = ev => {

            let broj = meni.querySelectorAll(".iBroj");
            let tipB = meni.querySelectorAll(".iTipB");

            let ime = meni.querySelector(".iIme").value;
            let prezime = meni.querySelector(".iPrezime").value;
            let tip = meni.querySelector(".iTipU").value;
            let opis = meni.querySelector(".iOpis").value;

            if (opis.length > 0)
            {
                opis.trim();
            }

            if (ime === kontakt.ime && prezime === kontakt.prezime && tip === kontakt.tip && opis === kontakt.opis){
                if (telefon.broj === broj && telefon.tip === tipB){
                    alert("Nema promena");
                }
                else{
                    this.izmeniBrojeve(telefon, broj, tipB);
                }
            }
            else{
                this.izmeniKontakt(kontakt.id, ime, prezime, tip, opis);
            }
            this.container.removeChild(meni);
        }
    }

    meniObrisi(kontakt, brId,tbody,tr){

        if (kontakt.listaTelefona.length > 1){
            this.obrisiBroj(kontakt.id,brId,tbody,tr);
        }
        else{
            this.obrisiKontakt(kontakt.id,tbody,tr);
        }

    }
//#endregion

}