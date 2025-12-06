import { c as createComponent, m as maybeRenderHead, b as addAttribute, r as renderTemplate, a as createAstro, e as renderHead, f as renderSlot, d as renderComponent } from './astro/server_-MRgVDm6.mjs';
import 'kleur/colors';
import 'clsx';
import { l as logoClub } from './logo_corpmeta_C3QdZtH-.mjs';
/* empty css                         */

const $$Navbar = createComponent(($$result, $$props, $$slots) => {
  const links = [
    { href: "/", label: "Inicio" },
    { href: "/salones", label: "Salones" },
    { href: "/eventos", label: "Eventos" },
    { href: "/reservas", label: "Reservas" },
    { href: "/contacto", label: "Contacto" }
  ];
  return renderTemplate`${maybeRenderHead()}<nav class="navbar" data-astro-cid-5blmo7yk> <a href="/" class="navbar__brand" data-astro-cid-5blmo7yk> <img${addAttribute(logoClub.src, "src")} alt="Club El Meta" class="navbar__logo" data-astro-cid-5blmo7yk> </a> <button class="navbar__toggle" aria-label="Abrir menú" id="navbarToggle" data-astro-cid-5blmo7yk> <span data-astro-cid-5blmo7yk></span> <span data-astro-cid-5blmo7yk></span> <span data-astro-cid-5blmo7yk></span> </button> <ul class="navbar__links" id="navbarLinks" data-astro-cid-5blmo7yk> ${links.map((link) => renderTemplate`<li data-astro-cid-5blmo7yk> <a${addAttribute(link.href, "href")} class="navbar__link" data-astro-cid-5blmo7yk> ${link.label} </a> </li>`)} </ul> </nav>  `;
}, "C:/Users/SSierra/Documents/DesarrolloClubElMeta/frontend/src/components/Navbar.astro", void 0);

const $$Astro = createAstro();
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const {
    title = "Corporaci\xF3n Club del Meta",
    hideNavbar = false,
    fullWidth = false
  } = Astro2.props;
  return renderTemplate`<html lang="es" data-astro-cid-37fxchfa> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title><meta name="description" content="Portal del Club El Meta para reservar salones y espacios exclusivos."><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">${renderHead()}</head> <body${addAttribute(fullWidth ? "layout layout--full" : "layout", "class")} data-astro-cid-37fxchfa> ${!hideNavbar && renderTemplate`${renderComponent($$result, "Navbar", $$Navbar, { "data-astro-cid-37fxchfa": true })}`} <main${addAttribute(fullWidth ? "main main--full" : "main", "class")} data-astro-cid-37fxchfa> ${renderSlot($$result, $$slots["default"])} </main> <footer data-astro-cid-37fxchfa> <div class="footer-container" data-astro-cid-37fxchfa> <div class="footer-section" data-astro-cid-37fxchfa> <h3 data-astro-cid-37fxchfa>Teléfonos</h3> <p data-astro-cid-37fxchfa>(8) 6 64 11 15 - 312 4347893</p> <p data-astro-cid-37fxchfa>EVENTOS: 310 8874473 - 312 4350412</p> <p data-astro-cid-37fxchfa>COMPRAS: 310 8771304</p> <p data-astro-cid-37fxchfa>CARTERA: 313 2349780</p> <p data-astro-cid-37fxchfa>OPERACIONES: 313 4660698</p> </div> <div class="footer-section" data-astro-cid-37fxchfa> <h3 data-astro-cid-37fxchfa>Dirección</h3> <p data-astro-cid-37fxchfa>CALLE 48A CARRERA 30</p> <p data-astro-cid-37fxchfa>BARRIO CIUDAD ORIENTAL</p> <p data-astro-cid-37fxchfa>VILLAVICENCIO - META</p> <div class="social-icons" data-astro-cid-37fxchfa> <a href="#" class="facebook" aria-label="Facebook" data-astro-cid-37fxchfa> <svg width="20" height="20" fill="white" viewBox="0 0 24 24" data-astro-cid-37fxchfa> <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" data-astro-cid-37fxchfa></path> </svg> </a> <a href="#" class="google" aria-label="Google" data-astro-cid-37fxchfa> <svg width="20" height="20" fill="white" viewBox="0 0 24 24" data-astro-cid-37fxchfa> <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" data-astro-cid-37fxchfa></path> <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" data-astro-cid-37fxchfa></path> <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" data-astro-cid-37fxchfa></path> <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" data-astro-cid-37fxchfa></path> </svg> </a> <a href="#" class="flickr" aria-label="Flickr" data-astro-cid-37fxchfa> <svg width="20" height="20" fill="white" viewBox="0 0 24 24" data-astro-cid-37fxchfa> <circle cx="6.5" cy="12" r="3.5" data-astro-cid-37fxchfa></circle> <circle cx="17.5" cy="12" r="3.5" data-astro-cid-37fxchfa></circle> </svg> </a> </div> </div> <div class="footer-section" data-astro-cid-37fxchfa> <h3 data-astro-cid-37fxchfa>Email</h3> <p data-astro-cid-37fxchfa> <a href="mailto:comunicaciones@clubelmeta.com" data-astro-cid-37fxchfa>comunicaciones@clubelmeta.com</a> </p> <p data-astro-cid-37fxchfa> <a href="mailto:secretaria@clubelmeta.com" data-astro-cid-37fxchfa>secretaria@clubelmeta.com</a> </p> </div> </div> <div class="footer-copyright" data-astro-cid-37fxchfa>
© Corporación Club del Meta - Todos los derechos reservados.
</div> </footer> </body></html>`;
}, "C:/Users/SSierra/Documents/DesarrolloClubElMeta/frontend/src/layouts/BaseLayout.astro", void 0);

export { $$BaseLayout as $, $$Navbar as a };
