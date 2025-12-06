import { c as createComponent, a as createAstro, e as renderHead, b as addAttribute, f as renderSlot, r as renderTemplate } from './astro/server_-MRgVDm6.mjs';
import 'kleur/colors';
import 'clsx';
import { l as logoClub } from './logo_corpmeta_C3QdZtH-.mjs';
/* empty css                            */

const $$Astro = createAstro();
const $$AdminLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$AdminLayout;
  const { title = "Panel Admin - Club del Meta", active = "reservas" } = Astro2.props;
  return renderTemplate`<html lang="es" data-astro-cid-2kanml4j> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">${renderHead()}</head> <body data-astro-cid-2kanml4j> <div class="layout" data-astro-cid-2kanml4j> <aside class="sidebar" data-astro-cid-2kanml4j> <div class="brand" data-astro-cid-2kanml4j> <img${addAttribute(logoClub.src, "src")} alt="Club del Meta" class="brand-logo" data-astro-cid-2kanml4j> <div data-astro-cid-2kanml4j> <div data-astro-cid-2kanml4j>Club del Meta</div> <small style="color: var(--color-muted);" data-astro-cid-2kanml4j>Panel Admin</small> </div> </div> <nav data-astro-cid-2kanml4j> <a${addAttribute(`nav-item ${active === "reservas" ? "active" : ""}`, "class")} href="/admin/reservas" data-astro-cid-2kanml4j>Reservas</a> <a${addAttribute(`nav-item ${active === "espacios" ? "active" : ""}`, "class")} href="/admin/espacios" data-astro-cid-2kanml4j>Espacios</a> <a${addAttribute(`nav-item ${active === "eventos" ? "active" : ""}`, "class")} href="/admin/eventos" data-astro-cid-2kanml4j>Eventos</a> <a${addAttribute(`nav-item ${active === "reportes" ? "active" : ""}`, "class")} href="/admin/reportes" data-astro-cid-2kanml4j>Reportes</a> </nav> <div class="bottom-actions" data-astro-cid-2kanml4j> <a class="nav-item" href="/" target="_blank" rel="noopener noreferrer" data-astro-cid-2kanml4j>🌐 Ver sitio web</a> <button class="nav-item" id="logoutBtn" data-astro-cid-2kanml4j>🚪 Cerrar sesión</button> </div> </aside> <main class="content" data-astro-cid-2kanml4j> ${renderSlot($$result, $$slots["default"])} </main> </div>  </body> </html>`;
}, "C:/Users/SSierra/Documents/DesarrolloClubElMeta/frontend/src/layouts/AdminLayout.astro", void 0);

export { $$AdminLayout as $ };
