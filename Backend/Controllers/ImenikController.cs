using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ImenikController : ControllerBase
    {
        public ImenikContext Context { get; set; }
        public ImenikController(ImenikContext context)
        {
            Context = context;
        }

        [Route("PribaviKontakte")]
        [HttpGet]
        public async Task<List<Kontakt>> PribaviKontakte()
        {
            return await Context.Kontakti.Include( k => k.listaTelefona).ToListAsync();
        }

        [Route("DodajKontakt")]
        [HttpPost]
        public async Task<IActionResult> DodajKontakt([FromBody] Kontakt kontakt)
        {
            if (kontakt.ime == "" || kontakt.ime == " ")
            {
                return StatusCode(406);
            }

            else
            {
                Context.Kontakti.Add(kontakt);
                await Context.SaveChangesAsync();
                return Ok(kontakt.id);
            }
        }

        [Route("IzmeniKontakt")]
        [HttpPut]
        public async Task<IActionResult> IzmeniKontakt([FromBody] Kontakt kontakt)
        {
            if (kontakt.ime == "" || kontakt.ime == " ")
            {
                return StatusCode(406);
            }   
            else
            {
                Context.Update<Kontakt>(kontakt);
                await Context.SaveChangesAsync();
                return Ok();
            }
        }

        [Route("ObrisiKontakt/{id}")]
        [HttpDelete]
        public async Task ObrisiKontakt(int id)
        {
            var kontakt = Context.Kontakti.Include(c => c.listaTelefona).Where(c => c.id == id).FirstOrDefault();

            var i = kontakt.listaTelefona.Select(t => t.id).ToList();
            foreach(int el in i)
            {
                await ObrisiTelefon(el);
            }

            Context.Remove(kontakt);
            await Context.SaveChangesAsync();
        }


            
        [Route("PribaviTelefone/{idKontakta}")]
        [HttpGet]
        public async Task<List<Telefon>> PribaviTelefone(int idKontakta){
            return await Context.Telefoni.Where<Telefon>(t => t.kontakt.id == idKontakta).ToListAsync();
        }

        [Route("DodajTelefon/{idKontakta}")]
        [HttpPost]
        public async Task<IActionResult> DodajTelefon(int idKontakta, [FromBody] Telefon telefon)
        {
            if (telefon.broj == "" || telefon.broj == " ")
            {
                return StatusCode(406);
            }
            else
            {
                var kontakt = await Context.Kontakti.FindAsync(idKontakta);
                telefon.kontakt = kontakt;

                Context.Telefoni.Add(telefon);
                await Context.SaveChangesAsync();
                return Ok(telefon.id);
            }
        }

        [Route("IzmeniTelefon")]
        [HttpPut]
        public async Task<IActionResult> IzmeniTelefon([FromBody] Telefon telefon)
        {
            if (telefon.broj == "" || telefon.broj == " ")
            {
                return StatusCode(406);
            }
            else
            {
                Context.Update<Telefon>(telefon);
                await Context.SaveChangesAsync();
                return Ok();
            }

        }

        [Route("ObrisiTelefon/{id}")]
        [HttpDelete]
        public async Task ObrisiTelefon(int id)
        {
            Telefon telefon = await Context.Telefoni.FindAsync(id);
            Context.Telefoni.Remove(telefon);
            await Context.SaveChangesAsync(); 
        }


        // [Route("IzmeniTelefon")]
        // [HttpGet]
        // public async Task<IActionResult> IzmeniTelefon()
    }
}
