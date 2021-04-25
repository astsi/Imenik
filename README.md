# Imenik - Web aplikacija služi za prikaz i uređivanje kontakata i njihovih brojeva telefona iz baze podataka.

Baza podataka koja sadrži informacije o kontaktima (ime, prezime, tip, opis) i brojevima telefona (broj, tip). 

Jedan kontakt može imati više brojeva telefona.
Glavna forma sadrži sekciju za pretragu kontakata/br.telefona po imenu (početak imena), prezimenu (početak prezimena), po tipu kontakta (dropdown sa već unetim tipovima), po broju telefona, po tipu broja telefona (dropdown sa već unetim tipovima).

Rezultati pretrage su prikazani u tabeli sa kolonama: Ime, Prezime, Tip Kontakta, Broj telefona, Tip Broja, Opis.

Meni za dodavanje/menjanje kontakata/telefona sadrži sledeće informacije: Ime, Prezime, Tip (ponuditi već unete tipove ali i omogućiti slobodan unos), tabela brojeva telefona (Broj i Tip Broja), Opis (Memo).

Na glavnoj formi moguće su sledeće akcije:

-Uredi: otvara formu detalja za menjanje podataka selektovanog zapisa (kontakta) iz tabele za pretragu,

-Dodaj: otvara formu detalja za novog kontakta,

-Izbriši: briše selektovani zapis kontakta,

-Snimi: snima tabelu sa pronađenim kontaktima/telefonima u csv fajl (comma separated)

 # Frontend: HTTP, CSS, JS, Bootsrap Framework
 # Backend: DOTNET.Core, Entity Framework
 
