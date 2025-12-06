import { c as createComponent, a as createAstro, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../chunks/astro/server_-MRgVDm6.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_BIRoUIkO.mjs';
import { m as millanuraImg, b as barImg, e as empresarialImg, t as terrazaImg, k as kioskoImg, p as presidencialImg } from '../chunks/presidencial_C5RCjFQ1.mjs';
/* empty css                                    */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Reservas = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Reservas;
  const descriptions = {
    "MI LLANURA": "Sal\xF3n insignia con vista a las \xE1reas verdes, ambientaci\xF3n adaptable. Ideal para recepciones y eventos sociales.",
    "BAR": "Ambiente contempor\xE1neo con barra integrada, iluminaci\xF3n esc\xE9nica y sistema de sonido premium. Perfecto para cocteles y lanzamientos.",
    "EMPRESARIAL": "Equipado con pantallas, streaming y mobiliario modular para workshops, conferencias y directorios. Conectividad y soporte t\xE9cnico continuo.",
    "TERRAZA": "Espacio al aire libre con p\xE9rgolas, iluminaci\xF3n ambiental y vista privilegiada. Eventos sunset, matrimonios y brunchs.",
    "KIOSKO": "\xC1rea semiabierta rodeada de jardines, piso en deck y estaciones el\xE9ctricas para m\xFAsica en vivo. Reuniones familiares y celebraciones.",
    "PRESIDENTE": "Espacio exclusivo con mobiliario ejecutivo, insonorizaci\xF3n y servicio gourmet personalizado. Juntas corporativas y sesiones privadas."
  };
  const espacios = [
    {
      nombre: "MI LLANURA",
      descripcion: descriptions["MI LLANURA"],
      aforo: "Hasta 100 personas",
      imagen: millanuraImg
    },
    {
      nombre: "BAR",
      descripcion: descriptions["BAR"],
      aforo: "Hasta 60 personas",
      imagen: barImg
    },
    {
      nombre: "EMPRESARIAL",
      descripcion: descriptions["EMPRESARIAL"],
      aforo: "Hasta 35 personas",
      imagen: empresarialImg
    },
    {
      nombre: "TERRAZA",
      descripcion: descriptions["TERRAZA"],
      aforo: "Hasta 30 personas",
      imagen: terrazaImg
    },
    {
      nombre: "KIOSKO",
      descripcion: descriptions["KIOSKO"],
      aforo: "Hasta 60 personas",
      imagen: kioskoImg
    },
    {
      nombre: "PRESIDENTE",
      descripcion: descriptions["PRESIDENTE"],
      aforo: "Hasta 15 personas",
      imagen: presidencialImg
    }
  ];
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Reservas - Club del Meta", "data-astro-cid-akakgcjg": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="reservas" data-astro-cid-akakgcjg> <header class="reservas__header" data-astro-cid-akakgcjg> <h1 data-astro-cid-akakgcjg>Agenda tu espacio en el Club</h1> <p data-astro-cid-akakgcjg>
Selecciona uno de los ambientes disponibles y comienza el proceso de reserva. Nuestro equipo confirmará la
        disponibilidad y te acompañará en cada detalle del evento.
</p> </header> <div class="reservas-grid" id="espacios-grid" role="list" data-astro-cid-akakgcjg> ${espacios.map((espacio) => renderTemplate`<article class="reserva-card" role="listitem"${addAttribute(`background-image: url(${espacio.imagen.src})`, "style")} data-astro-cid-akakgcjg> <div class="reserva-card__overlay" data-astro-cid-akakgcjg> <header class="reserva-card__header" data-astro-cid-akakgcjg> <span class="reserva-card__badge" data-astro-cid-akakgcjg>${espacio.aforo}</span> <h2 data-astro-cid-akakgcjg>${espacio.nombre}</h2> </header> <p data-astro-cid-akakgcjg>${espacio.descripcion}</p> <a class="cotizar-btn"${addAttribute(`/obtener-cotizacion?salon=${encodeURIComponent(espacio.nombre)}`, "href")}${addAttribute(`Obtener cotizaci\xF3n - ${espacio.nombre}`, "aria-label")} data-astro-cid-akakgcjg>
Obten cotizacion
</a> </div> </article>`)} </div> </section>   ` })}`;
}, "C:/Users/SSierra/Documents/DesarrolloClubElMeta/frontend/src/pages/reservas.astro", void 0);

const $$file = "C:/Users/SSierra/Documents/DesarrolloClubElMeta/frontend/src/pages/reservas.astro";
const $$url = "/reservas";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Reservas,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
