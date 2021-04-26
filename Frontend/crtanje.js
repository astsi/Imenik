import {kreirajEl, nadjiKontakt, pocinje, prazanJe, ukloniIzliste} from "./pomocna.js";
import {Kontakt} from "./kontakt.js";
import {Telefon} from "./telefon.js";
export class Crtanje{
    
    constructor(host){
        
        this.listaKontakata = [];
        this.listaPretrage = [];
        this.parBrTip = [];

        this.opcijeBr = [];
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

            this.meniUredi(kontakt,telefon,this.container);
        }
        let btnObrisi = kreirajEl("btnObrisi btn-secondary btn-sm","button","Obrisi",td);
        btnObrisi.onclick = ev => {
            //console.log(kontakt.id, telefon.id);
            this.meniObrisi(kontakt,telefon.id,host,tr);
            }
    }

    crtajTabelu(host){

        //let host = document.querySelector(".main");
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
    crtajGlavnu(){

        let btnSnimi = kreirajEl("btnSnimi  btn-secondary btn-sm","button","Snimi u .csv formatu",this.container);
        btnSnimi.onclick = ev => this.snimiUFajl();
        this.crtajTabelu(this.container);
        let side = document.querySelector(".side");
        this.crtajPretragu(side);

        let dodajK = kreirajEl("dodajK btn btn-link","button","Dodaj kontakt",side);
        dodajK.onclick = ev => {

            //dodeli vrednost listi tipova
            let meni = document.querySelector(".meniD");
            let select = document.querySelector(".iTip");

            while (select.firstChild) {
            select.removeChild(select.lastChild);
            }

            let opcije = this.nizZaTipK();

            opcije.forEach(opcija =>{
                console.log(opcija);
                kreirajEl("opcijaBr","option",opcija,select);
            })

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
                console.log(opcija);
                kreirajEl("opcijaBr","option",opcija,select);
            })

            if (meni.style.display == "none")
                meni.style.display = "";
            else
                meni.style.display = "none";
            
        }

        this.meniDodajBroj(side);


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
    
                    console.log("!!!!" + sKontakt.value);
    
                    console.log(id);
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

    nizZaBr(){
        let niz = [];
        this.listaKontakata.forEach(el => {
            let opcija = el.ime + " " + el.prezime + ", " + el.tip + ", " + el.opis;
            niz.push(opcija);
        })

        return niz;
    }

    nizZaTipK(){

        let niz = [];
        this.listaKontakata.forEach(el => {
            niz.push(el.tip);
        })

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
        let tip = kreirajEl("pTip", "input","Tip kontakta",forma);
        tip.type = "text";
        tip.placeholder = "Tip kontakta";
        tip.onkeyup = ev => this.pretraziIP("Tip");

        // let tip = kreirajEl("pTip","select","Tip kontakta",forma);
        // tip.onclick = ev => this.prikaziTip(tip);
        // let opt = kreirajEl("opt","option","",tip);
        // opt.selected = "disabled";
        // opt.innerHTML = "Tip kontakta";

        kreirajEl("labela","label","po broju telefona:", forma);
        let broj = this.kreirajStavku("pBroj","input","Broj kontakta","number",forma);
        broj.onkeyup = ev => this.pretraziIP("Broj");
        
        kreirajEl("labela","label","po tipu broja:", forma);
        let tipB = this.kreirajStavku("pTipB","input","Tip broja","text",forma);
        tipB.onkeyup = ev => this.pretraziIP("TipB");

        // let btnPretrazi = kreirajEl("btnPretrazi btn-secondary btn-sm","button","Pretraži", forma);
        // btnPretrazi.onclick = ev =>{

        //     //if (ime.value)
        // }


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

    //privremeno smesta brojeve i kontakte u recnik.
    dodajBrojeve(kId){

        let brojevi = [];
        this.listaKontakata.forEach(k => {
            k.listaTelefona.forEach(t => {
                brojevi.push(t.broj);
            });
        });

        this.parBrTip.forEach(el => {
            console.log(brojevi.findIndex(t => t === el.key))
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
                    console.log(this.listaKontakata[indK]);
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

    crtajMeni(host, dodaj){
        
        let meni = kreirajEl("meni","div","",host);

        kreirajEl("b","b","Ime",meni);
        let ime = this.kreirajStavku("iIme","input","npr. Pera", "text", meni);
        kreirajEl("b","b","Prezime",meni);
        let prezime = this.kreirajStavku("iPrezime","input","npr. Perić", "text", meni);
        kreirajEl("b","b","Tip",meni);

        let tip; 

        if (dodaj){
            console.log("T");
            tip = kreirajEl("iTip","select","",meni);
        }
        else{
            console.log("Netacno");
            tip = kreirajEl("iTip","input","",meni);
        }
        let opt = kreirajEl("opt","option","npr. posao",tip);
        opt.selected = "disabled";


        this.crtajTabeluBrojeva(meni);

        kreirajEl("b","b","Opis kontakta",meni);
        let opis = kreirajEl("iOpis","textArea","npr. Pera sa IT obuke", meni);
        opis.placeholder = "npr. Pera sa IT obuke";

        //return [ime.value,prezime.value,tip.value,opis.value];
    }

    crtajTabeluBrojeva(meni){

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
    }

    meniDodaj(host){

       // kreirajEl("hDodaj","h4","Dodaj kontakt",host);

        this.crtajMeni(host, 1);
        let meni = document.querySelector(".meni");
        meni.style.display = "none";
        meni.className = "meniD";

        let btnDodaj = kreirajEl("iBtnDodaj btn-secondary btn-sm","button","Dodaj kontakt", meni);
        btnDodaj.onclick = ev => {

            let ime = meni.querySelector(".iIme").value;
            let listaBr = meni.querySelectorAll(".iBroj");

            if (ime === "" || ime === " " || listaBr.length < 1)
            {
                alert("Obavezan je unos Imena i jednog broja!");
            }
            else {

                let prezime = meni.querySelector(".iPrezime").value;
                let opis = meni.querySelector(".iOpis").value;
                let tip = meni.querySelector(".iTip").value;
                
                let listaTB = meni.querySelectorAll(".iTipB");
                
                for (let i = 0; i< listaBr.length; i++)
                {
                    if (listaBr[i].value.length < 6 || listaTB[i].value.length > 15){
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
                    console.log("Ne postoji u listi, dodaje se");
                    this.dodajKontakt(ime,prezime,tip,opis);
                }
                else{
                    alert("Kontakt sa ovim podacima već postoji u bazi. Pokusajte ponovo ili dodajte broj postojecem kontaktu. ");
                }
    

            }

        }
    }

    reloadujTabelu(){
        let t = this.container.querySelector(".tabela");
        this.container.removeChild(t);
        this.crtajTabelu(this.container);
    }

    meniUredi(kontakt,telefon, host){
       
        this.crtajMeni(host, 0);
        let meni = document.querySelector(".meni");
        meni.className = "meniU";
        meni.removeChild(meni.querySelector(".btnPlus"));
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

            if (ime === kontakt.ime && prezime === kontakt.prezime && tip === kontakt.tip && opis === kontakt.opis){
                
                if (telefon.broj === broj && telefon.tip === tip)
                {
                    alert("Nema promena");
                }
                else{
                    this.izmeniBrojeve(telefon, broj, tipB);
                }
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
        el.type = "\"" + tip + "\"";
        console.log(el.type);
        el.value = "";
        return el;
    }


}