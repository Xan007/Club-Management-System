import { c as createComponent, r as renderTemplate, d as renderComponent, m as maybeRenderHead } from '../../chunks/astro/server_-MRgVDm6.mjs';
import 'kleur/colors';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_7SysszMx.mjs';
/* empty css                                       */
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const prerender = false;
const $$Espacios = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate(_a || (_a = __template(["", ' <script type="module" src="/src/pages/admin/espacios.client.ts"><\/script> '])), renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Espacios - Club del Meta", "active": "espacios", "data-astro-cid-n2trqdq5": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="panel" data-astro-cid-n2trqdq5> <header class="panel__header" data-astro-cid-n2trqdq5> <div data-astro-cid-n2trqdq5> <p class="eyebrow" data-astro-cid-n2trqdq5>Administración</p> <h1 data-astro-cid-n2trqdq5>Espacios</h1> <p class="muted" data-astro-cid-n2trqdq5>Selecciona un salón para editarlo y ajusta sus disposiciones con una interfaz más limpia y guiada.</p> </div> <div class="actions" data-astro-cid-n2trqdq5> <button id="btnRefrescarEspacios" class="btn secondary" data-astro-cid-n2trqdq5>Refrescar</button> <a class="btn ghost" href="/admin/login" data-astro-cid-n2trqdq5>Cerrar sesión</a> </div> </header> <div class="grid" data-astro-cid-n2trqdq5> <section class="card" data-astro-cid-n2trqdq5> <div class="card__header" data-astro-cid-n2trqdq5> <div data-astro-cid-n2trqdq5> <p class="eyebrow" data-astro-cid-n2trqdq5>Salones</p> <h2 data-astro-cid-n2trqdq5>Selecciona un espacio</h2> </div> <div class="selector" data-astro-cid-n2trqdq5> <label data-astro-cid-n2trqdq5>
Salón
<select id="espacioSelect" data-astro-cid-n2trqdq5> <option value="" data-astro-cid-n2trqdq5>Elegir salón...</option> </select> </label> <span id="estadoBadge" class="pill pill-muted" data-astro-cid-n2trqdq5>Sin selección</span> </div> </div> </section> <section class="card" id="postsSection" hidden data-astro-cid-n2trqdq5> <div class="card__header" data-astro-cid-n2trqdq5> <div data-astro-cid-n2trqdq5> <p class="eyebrow" data-astro-cid-n2trqdq5>Blog del salón</p> <h2 id="postsSectionTitle" data-astro-cid-n2trqdq5>Posts de información</h2> </div> <button id="btnNuevoPost" class="btn primary" data-astro-cid-n2trqdq5>+ Nuevo post</button> </div> <div id="postsList" class="posts-list" data-astro-cid-n2trqdq5> <div class="placeholder" data-astro-cid-n2trqdq5>Selecciona un salón para ver sus posts.</div> </div> </section> <section class="card" id="postEditorCard" hidden data-astro-cid-n2trqdq5> <div class="card__header" data-astro-cid-n2trqdq5> <div data-astro-cid-n2trqdq5> <p class="eyebrow" data-astro-cid-n2trqdq5>Editor de post</p> <h2 id="postEditorTitle" data-astro-cid-n2trqdq5>Nuevo post</h2> </div> <div class="inline-actions" data-astro-cid-n2trqdq5> <button id="btnCancelarPost" class="btn ghost" data-astro-cid-n2trqdq5>Cancelar</button> <button id="btnGuardarPost" class="btn primary" data-astro-cid-n2trqdq5>Guardar post</button> </div> </div> <div class="form" data-astro-cid-n2trqdq5> <div class="form-grid" data-astro-cid-n2trqdq5> <label data-astro-cid-n2trqdq5>
Título
<input id="postTitulo" type="text" placeholder="Título del post" data-astro-cid-n2trqdq5> </label> <label data-astro-cid-n2trqdq5>
Slug (URL)
<input id="postSlug" type="text" placeholder="url-del-post" data-astro-cid-n2trqdq5> </label> <label class="wide" data-astro-cid-n2trqdq5>
Imagen principal (URL)
<input id="postImageUrl" type="text" placeholder="https://..." data-astro-cid-n2trqdq5> </label> <label class="wide" data-astro-cid-n2trqdq5>
Extracto (resumen corto)
<textarea id="postExcerpt" rows="2" placeholder="Resumen corto para listados..." data-astro-cid-n2trqdq5></textarea> </label> <label class="wide" data-astro-cid-n2trqdq5>
Contenido (Markdown)
<textarea id="postContent" rows="12" placeholder="# Título

Contenido en **Markdown**..." data-astro-cid-n2trqdq5></textarea> </label> <label class="switch" data-astro-cid-n2trqdq5> <input type="checkbox" id="postPublicado" data-astro-cid-n2trqdq5> <span data-astro-cid-n2trqdq5>Publicado (visible en el sitio web)</span> </label> </div> </div> </section> <section class="card" id="espacioFormCard" data-astro-cid-n2trqdq5> <div class="card__header" data-astro-cid-n2trqdq5> <div data-astro-cid-n2trqdq5> <p class="eyebrow" data-astro-cid-n2trqdq5>Detalle</p> <h2 id="espacioTitulo" data-astro-cid-n2trqdq5>Selecciona un salón</h2> </div> <div class="inline-actions" data-astro-cid-n2trqdq5> <label class="switch" data-astro-cid-n2trqdq5> <input type="checkbox" id="espacioActivo" data-astro-cid-n2trqdq5> <span data-astro-cid-n2trqdq5>Activo</span> </label> <button id="btnGuardarEspacio" class="btn primary" data-astro-cid-n2trqdq5>Guardar cambios</button> </div> </div> <div id="espacioEmpty" class="placeholder" data-astro-cid-n2trqdq5>Elige un salón para mostrar su información.</div> <div id="espacioForm" class="form" hidden data-astro-cid-n2trqdq5> <div class="form-grid" data-astro-cid-n2trqdq5> <label data-astro-cid-n2trqdq5>
Nombre
<input id="espacioNombre" type="text" placeholder="Nombre del salón" data-astro-cid-n2trqdq5> </label> <label class="wide" data-astro-cid-n2trqdq5>
Descripción
<textarea id="espacioDescripcion" rows="3" placeholder="Descripción breve" data-astro-cid-n2trqdq5></textarea> </label> </div> <div class="subcard" data-astro-cid-n2trqdq5> <div class="subcard__header" data-astro-cid-n2trqdq5> <div data-astro-cid-n2trqdq5> <p class="eyebrow" data-astro-cid-n2trqdq5>Disposiciones</p> <h3 data-astro-cid-n2trqdq5>Capacidades por disposición</h3> </div> <div class="add-config" data-astro-cid-n2trqdq5> <select id="nuevaDisposicion" data-astro-cid-n2trqdq5></select> <input id="nuevaCapacidad" type="number" min="1" placeholder="Capacidad" data-astro-cid-n2trqdq5> <button id="btnAgregarConfig" class="btn secondary" data-astro-cid-n2trqdq5>Agregar</button> </div> </div> <div id="configList" class="config-list" data-astro-cid-n2trqdq5> <div class="placeholder" data-astro-cid-n2trqdq5>Sin disposiciones.</div> </div> </div> </div> </section> <section class="card" data-astro-cid-n2trqdq5> <div class="card__header" data-astro-cid-n2trqdq5> <div data-astro-cid-n2trqdq5> <p class="eyebrow" data-astro-cid-n2trqdq5>Nuevo salón</p> <h2 data-astro-cid-n2trqdq5>Crear espacio</h2> </div> </div> <div class="form-grid" data-astro-cid-n2trqdq5> <label data-astro-cid-n2trqdq5>
Nombre
<input id="nuevoNombre" type="text" placeholder="Ej. Salón principal" data-astro-cid-n2trqdq5> </label> <label class="wide" data-astro-cid-n2trqdq5>
Descripción
<textarea id="nuevoDescripcion" rows="2" placeholder="Opcional" data-astro-cid-n2trqdq5></textarea> </label> <label class="switch" data-astro-cid-n2trqdq5> <input type="checkbox" id="nuevoActivo" checked data-astro-cid-n2trqdq5> <span data-astro-cid-n2trqdq5>Activo al crear</span> </label> </div> <div class="actions-end" data-astro-cid-n2trqdq5> <button id="btnCrearEspacio" class="btn primary" data-astro-cid-n2trqdq5>Crear salón</button> </div> </section> <section class="card" id="postEditorCard" hidden data-astro-cid-n2trqdq5> <div class="card__header" data-astro-cid-n2trqdq5> <div data-astro-cid-n2trqdq5> <p class="eyebrow" data-astro-cid-n2trqdq5>Editor de post</p> <h2 id="postEditorTitle" data-astro-cid-n2trqdq5>Nuevo post</h2> </div> <div class="inline-actions" data-astro-cid-n2trqdq5> <button id="btnCancelarPost" class="btn ghost" data-astro-cid-n2trqdq5>Cancelar</button> <button id="btnGuardarPost" class="btn primary" data-astro-cid-n2trqdq5>Guardar post</button> </div> </div> <div class="form" data-astro-cid-n2trqdq5> <div class="form-grid" data-astro-cid-n2trqdq5> <label data-astro-cid-n2trqdq5>
Título
<input id="postTitulo" type="text" placeholder="Título del post" data-astro-cid-n2trqdq5> </label> <label data-astro-cid-n2trqdq5>
Slug (URL)
<input id="postSlug" type="text" placeholder="url-del-post" data-astro-cid-n2trqdq5> </label> <label class="wide" data-astro-cid-n2trqdq5>
Imagen principal (URL)
<input id="postImageUrl" type="text" placeholder="https://..." data-astro-cid-n2trqdq5> </label> <label class="wide" data-astro-cid-n2trqdq5>
Extracto (resumen corto)
<textarea id="postExcerpt" rows="2" placeholder="Resumen corto para listados..." data-astro-cid-n2trqdq5></textarea> </label> <label class="wide" data-astro-cid-n2trqdq5>
Contenido (Markdown)
<textarea id="postContent" rows="12" placeholder="# Título

Contenido en **Markdown**..." data-astro-cid-n2trqdq5></textarea> </label> <label class="switch" data-astro-cid-n2trqdq5> <input type="checkbox" id="postPublicado" data-astro-cid-n2trqdq5> <span data-astro-cid-n2trqdq5>Publicado (visible en el sitio web)</span> </label> </div> </div> </section> </div> </section> ` }));
}, "C:/Users/SSierra/Documents/DesarrolloClubElMeta/frontend/src/pages/admin/espacios.astro", void 0);

const $$file = "C:/Users/SSierra/Documents/DesarrolloClubElMeta/frontend/src/pages/admin/espacios.astro";
const $$url = "/admin/espacios";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Espacios,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
