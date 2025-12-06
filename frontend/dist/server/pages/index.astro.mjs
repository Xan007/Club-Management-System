import { c as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../chunks/astro/server_-MRgVDm6.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_BIRoUIkO.mjs';
import { l as logoClub } from '../chunks/logo_corpmeta_C3QdZtH-.mjs';
import { h as heroBackground } from '../chunks/fondoclub_BcBvP4tp.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Corporacion Club el Meta", "hideNavbar": true, "fullWidth": true, "data-astro-cid-j7pv25f6": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="hero" aria-labelledby="hero-heading" data-astro-cid-j7pv25f6> <div class="hero__background" aria-hidden="true"${addAttribute(`background-image: linear-gradient(rgba(4, 14, 32, 0.15), rgba(4, 14, 32, 0.4)), url(${heroBackground.src});`, "style")} data-astro-cid-j7pv25f6></div> <div class="hero__layer" aria-hidden="true" data-astro-cid-j7pv25f6></div> <div class="hero__wrap" data-astro-cid-j7pv25f6> <header class="hero__header" data-astro-cid-j7pv25f6> <div class="hero__identity" data-astro-cid-j7pv25f6> <img${addAttribute(logoClub.src, "src")} alt="Logo Corporacion Club el Meta" class="hero__logo" data-astro-cid-j7pv25f6> <span class="hero__name" data-astro-cid-j7pv25f6>Corporacion Club el Meta</span> </div> </header> <div class="hero__content" data-astro-cid-j7pv25f6> <div class="hero__eyebrow" data-astro-cid-j7pv25f6>Tu espacio, tu horario, tu comunidad</div> <h1 id="hero-heading" class="hero__headline" data-astro-cid-j7pv25f6> <span class="hero__headline-top" data-astro-cid-j7pv25f6>EL LUGAR</span> <span class="hero__headline-bottom" data-astro-cid-j7pv25f6>perfecto para tu evento</span> </h1> <div class="hero__actions" data-astro-cid-j7pv25f6> <a class="hero__cta" href="/reservas" data-astro-cid-j7pv25f6>Reserva tu espacio aqui</a> </div> <p class="hero__subtitle" data-astro-cid-j7pv25f6>
Gestiona y reserva canchas, salones y eventos del Club del Meta en segundos. Conecta a socios, controla
          calendarios y garantiza la mejor experiencia deportiva.
</p> </div> </div> </section>  ` })}`;
}, "C:/Users/SSierra/Documents/DesarrolloClubElMeta/frontend/src/pages/index.astro", void 0);

const $$file = "C:/Users/SSierra/Documents/DesarrolloClubElMeta/frontend/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
