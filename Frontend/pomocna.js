export function kreirajEl(className, type, text, host){
    let el = document.createElement(type);
    el.className = className;
    el.innerHTML = text;
    host.appendChild(el);

    return el;
}

export function uListi(telefon, lista){
    let ind = lista.findIndex(i => i.broj === telefon.broj);
    if (ind > -1)
        return true;
    else
        return false;
}

export function nadjiKontakt(lista, ime, prezime, tip, opis){
    return lista.findIndex(i => i.ime === ime && i.prezime === prezime && i.tip === tip && i.opis === opis);
}

export function ukloniIzliste(id, lista){

    let ind = lista.findIndex(i => i.id ===  telefon.id);
    if (ind > -1)
    {
        elList.splice(ind,1);
    }
    else
        alert("Ovaj broj se ne nalazi u listi.");

}

export function pocinje(rec, deo){
    for (let i = 0; i < deo.length; i++)
    {
        if (deo[i] != rec[i])
            return false;
    }

    return true;
}

