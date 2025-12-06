import { c as createComponent, r as renderTemplate, d as renderComponent, m as maybeRenderHead } from '../../chunks/astro/server_-MRgVDm6.mjs';
import 'kleur/colors';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_7SysszMx.mjs';
/* empty css                                      */
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const prerender = false;
const $$Eventos = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate(_a || (_a = __template(["", ' <script type="module" src="/src/pages/admin/eventos.client.ts"><\/script> '])), renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Eventos - Club del Meta", "active": "eventos", "data-astro-cid-sdgivehk": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="panel" data-astro-cid-sdgivehk> <header class="panel__header" data-astro-cid-sdgivehk> <div data-astro-cid-sdgivehk> <p class="eyebrow" data-astro-cid-sdgivehk>Administración</p> <h1 data-astro-cid-sdgivehk>Eventos</h1> <p class="muted" data-astro-cid-sdgivehk>Gestiona los eventos que aparecen en la página pública. Puedes crear, editar y eliminar eventos con imágenes.</p> </div> <div class="actions" data-astro-cid-sdgivehk> <button id="btnNuevoEvento" class="btn primary" data-astro-cid-sdgivehk>+ Nuevo Evento</button> <button id="btnRefrescar" class="btn secondary" data-astro-cid-sdgivehk>Refrescar</button> </div> </header> <div class="grid" data-astro-cid-sdgivehk> <!-- Lista de eventos --> <section class="card" data-astro-cid-sdgivehk> <div class="card__header" data-astro-cid-sdgivehk> <div data-astro-cid-sdgivehk> <p class="eyebrow" data-astro-cid-sdgivehk>Eventos publicados</p> <h2 data-astro-cid-sdgivehk>Todos los eventos</h2> </div> </div> <div id="eventosList" class="posts-list" data-astro-cid-sdgivehk> <div class="placeholder" data-astro-cid-sdgivehk>Cargando eventos...</div> </div> </section> </div> </section>  <div id="eventoModal" class="modal hidden" data-astro-cid-sdgivehk> <div class="modal-overlay" data-astro-cid-sdgivehk></div> <div class="modal-content" data-astro-cid-sdgivehk> <div class="modal-header" data-astro-cid-sdgivehk> <h2 id="modalTitle" data-astro-cid-sdgivehk>Nuevo Evento</h2> <button id="btnCerrarModal" class="btn-close" data-astro-cid-sdgivehk>&times;</button> </div> <div class="modal-body" data-astro-cid-sdgivehk> <div class="form-grid" data-astro-cid-sdgivehk> <label data-astro-cid-sdgivehk>
Título *
<input id="eventoTitulo" type="text" placeholder="Título del evento" required data-astro-cid-sdgivehk> </label> <label data-astro-cid-sdgivehk>
Slug (URL) *
<input id="eventoSlug" type="text" placeholder="titulo-del-evento" required data-astro-cid-sdgivehk> </label> <label class="wide" data-astro-cid-sdgivehk>
Salón asociado
<select id="eventoEspacio" data-astro-cid-sdgivehk> <option value="" data-astro-cid-sdgivehk>Ninguno</option> </select> </label> <label class="wide" data-astro-cid-sdgivehk>
Extracto (resumen corto)
<textarea id="eventoExcerpt" rows="3" placeholder="Breve descripción del evento..." data-astro-cid-sdgivehk></textarea> </label> <label class="wide" data-astro-cid-sdgivehk>
Contenido (Markdown) *
<textarea id="eventoContent" rows="8" placeholder="# Contenido del evento

Escribe aquí en **Markdown**..." data-astro-cid-sdgivehk></textarea> </label> <!-- Gestión de imágenes --> <div class="wide images-section" data-astro-cid-sdgivehk> <div class="images-header" data-astro-cid-sdgivehk> <div data-astro-cid-sdgivehk> <p class="eyebrow" data-astro-cid-sdgivehk>Galería</p> <h3 data-astro-cid-sdgivehk>Imágenes del evento</h3> </div> <div class="upload-actions" data-astro-cid-sdgivehk> <input type="file" id="fileInput" accept="image/*" multiple hidden data-astro-cid-sdgivehk> <button id="btnSubirArchivo" type="button" class="btn secondary" data-astro-cid-sdgivehk>Subir Archivo</button> <button id="btnVerGaleria" type="button" class="btn secondary" data-astro-cid-sdgivehk>Ver Galería</button> </div> </div> <div id="imagenesContainer" class="imagenes-grid" data-astro-cid-sdgivehk> <!-- Las imágenes se agregan dinámicamente aquí --> </div> <div id="uploadProgress" class="upload-progress" style="display: none;" data-astro-cid-sdgivehk> <div class="progress-bar" data-astro-cid-sdgivehk> <div id="progressBar" class="progress-fill" data-astro-cid-sdgivehk></div> </div> <p id="progressText" data-astro-cid-sdgivehk>Subiendo...</p> </div> </div> <label class="switch" data-astro-cid-sdgivehk> <input type="checkbox" id="eventoPublicado" checked data-astro-cid-sdgivehk> <span data-astro-cid-sdgivehk>Publicado (visible en el sitio web)</span> </label> <label data-astro-cid-sdgivehk>
Fecha de publicación
<input id="eventoFecha" type="datetime-local" data-astro-cid-sdgivehk> </label> </div> </div> <div class="modal-footer" data-astro-cid-sdgivehk> <button id="btnCancelar" class="btn ghost" data-astro-cid-sdgivehk>Cancelar</button> <button id="btnGuardar" class="btn primary" data-astro-cid-sdgivehk>Guardar Evento</button> </div> </div> </div>  <div id="galeriaModal" class="modal hidden" data-astro-cid-sdgivehk> <div class="modal-overlay" data-astro-cid-sdgivehk></div> <div class="modal-content modal-large" data-astro-cid-sdgivehk> <div class="modal-header" data-astro-cid-sdgivehk> <h2 data-astro-cid-sdgivehk>Galería de Imágenes Recientes</h2> <button id="btnCerrarGaleria" class="btn-close" data-astro-cid-sdgivehk>&times;</button> </div> <div class="modal-body" data-astro-cid-sdgivehk> <div id="galeriaGrid" class="galeria-grid" data-astro-cid-sdgivehk> <div class="placeholder" data-astro-cid-sdgivehk>Cargando galería...</div> </div> </div> <div class="modal-footer" data-astro-cid-sdgivehk> <button id="btnCerrarGaleriaFooter" class="btn ghost" data-astro-cid-sdgivehk>Cerrar</button> </div> </div> </div>  <div id="toastContainer" class="toast-container" data-astro-cid-sdgivehk></div> ` }));
}, "C:/Users/SSierra/Documents/DesarrolloClubElMeta/frontend/src/pages/admin/eventos.astro", void 0);

const $$file = "C:/Users/SSierra/Documents/DesarrolloClubElMeta/frontend/src/pages/admin/eventos.astro";
const $$url = "/admin/eventos";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Eventos,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
