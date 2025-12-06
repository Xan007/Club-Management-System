import { createClient } from '@supabase/supabase-js';
export { renderers } from '../../renderers.mjs';

const API_URL = "http://localhost:3333";
const SUPABASE_URL = "https://bnoftsxwpxzmwjrmxoxc.supabase.co";
const SUPABASE_KEY = "sb_publishable_YLeoJK1Kxf_Xm0nAHlmO8Q_2cHXCub1";
const BUCKET_NAME = "eventos_imagenes";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM Cargado - Inicializando eventos...");
  let eventos = [];
  let espacios = [];
  let editingEventoId = null;
  let imagenesTemp = [];
  const eventosList = document.getElementById("eventosList");
  const btnNuevoEvento = document.getElementById("btnNuevoEvento");
  const btnRefrescar = document.getElementById("btnRefrescar");
  console.log("Elementos encontrados:", { eventosList, btnNuevoEvento, btnRefrescar });
  const eventoModal = document.getElementById("eventoModal");
  const modalTitle = document.getElementById("modalTitle");
  const btnCerrarModal = document.getElementById("btnCerrarModal");
  const btnCancelar = document.getElementById("btnCancelar");
  const btnGuardar = document.getElementById("btnGuardar");
  console.log("Modal encontrado:", { eventoModal, modalTitle });
  const eventoTitulo = document.getElementById("eventoTitulo");
  const eventoSlug = document.getElementById("eventoSlug");
  const eventoEspacio = document.getElementById("eventoEspacio");
  const eventoExcerpt = document.getElementById("eventoExcerpt");
  const eventoContent = document.getElementById("eventoContent");
  const eventoPublicado = document.getElementById("eventoPublicado");
  const eventoFecha = document.getElementById("eventoFecha");
  const imagenesContainer = document.getElementById("imagenesContainer");
  const fileInput = document.getElementById("fileInput");
  const btnSubirArchivo = document.getElementById("btnSubirArchivo");
  const btnVerGaleria = document.getElementById("btnVerGaleria");
  const uploadProgress = document.getElementById("uploadProgress");
  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");
  const galeriaModal = document.getElementById("galeriaModal");
  const galeriaGrid = document.getElementById("galeriaGrid");
  const btnCerrarGaleria = document.getElementById("btnCerrarGaleria");
  const btnCerrarGaleriaFooter = document.getElementById("btnCerrarGaleriaFooter");
  function generateSlug(titulo) {
    return titulo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }
  function showNotification(message, type = "success") {
    const container = document.getElementById("toastContainer");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    const icon = type === "success" ? "✓" : type === "error" ? "✕" : "⚠";
    toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-message">${message}</span>
    <button class="toast-close">&times;</button>
  `;
    container.appendChild(toast);
    const closeBtn = toast.querySelector(".toast-close");
    closeBtn?.addEventListener("click", () => removeToast(toast));
    setTimeout(() => removeToast(toast), 5e3);
  }
  function removeToast(toast) {
    toast.classList.add("removing");
    setTimeout(() => toast.remove(), 300);
  }
  function showConfirm(message, onConfirm) {
    const modal = document.createElement("div");
    modal.className = "modal confirm-modal";
    modal.innerHTML = `
    <div class="modal-overlay"></div>
    <div class="modal-content">
      <div class="modal-header">
        <h2>Confirmar</h2>
        <button class="btn-close">&times;</button>
      </div>
      <div class="modal-body">
        <p>${message}</p>
      </div>
      <div class="modal-footer">
        <button class="btn ghost" data-action="cancel">Cancelar</button>
        <button class="btn primary" data-action="confirm">Confirmar</button>
      </div>
    </div>
  `;
    document.body.appendChild(modal);
    const close = () => {
      modal.classList.add("hidden");
      setTimeout(() => modal.remove(), 300);
    };
    modal.querySelector('[data-action="cancel"]')?.addEventListener("click", close);
    modal.querySelector(".btn-close")?.addEventListener("click", close);
    modal.querySelector(".modal-overlay")?.addEventListener("click", close);
    modal.querySelector('[data-action="confirm"]')?.addEventListener("click", () => {
      onConfirm();
      close();
    });
  }
  function getAuthToken() {
    const authData = localStorage.getItem("adminAuth");
    return authData ? JSON.parse(authData).token : null;
  }
  async function cargarEspacios() {
    try {
      const response = await fetch(`${API_URL}/api/espacios`);
      const result = await response.json();
      if (result.success) {
        espacios = result.data;
        renderEspaciosSelect();
      }
    } catch (error) {
      console.error("Error cargando espacios:", error);
    }
  }
  function renderEspaciosSelect() {
    if (!eventoEspacio) return;
    eventoEspacio.innerHTML = '<option value="">Ninguno</option>';
    espacios.forEach((espacio) => {
      const option = document.createElement("option");
      option.value = espacio.id;
      option.textContent = espacio.nombre;
      eventoEspacio.appendChild(option);
    });
  }
  async function cargarEventos() {
    if (!eventosList) return;
    eventosList.innerHTML = '<div class="placeholder">Cargando eventos...</div>';
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/admin/salon-posts`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (result.success) {
        eventos = result.data;
        renderEventos();
      } else {
        eventosList.innerHTML = '<div class="placeholder">Error al cargar eventos</div>';
      }
    } catch (error) {
      console.error("Error cargando eventos:", error);
      eventosList.innerHTML = '<div class="placeholder">Error de conexión</div>';
    }
  }
  function renderEventos() {
    if (!eventosList) return;
    if (eventos.length === 0) {
      eventosList.innerHTML = '<div class="placeholder">No hay eventos. Crea tu primer evento para comenzar.</div>';
      return;
    }
    eventosList.innerHTML = eventos.map((evento) => {
      const primeraImagen = evento.imagenes && evento.imagenes.length > 0 ? evento.imagenes[0].url : "https://via.placeholder.com/100x75?text=Sin+imagen";
      const fecha = evento.publishedAt ? new Date(evento.publishedAt).toLocaleDateString("es-CO", {
        year: "numeric",
        month: "short",
        day: "numeric"
      }) : "Sin fecha";
      const numImagenes = evento.imagenes?.length || 0;
      const excerpt = evento.excerpt || "Sin descripción";
      return `
      <div class="post-card" data-evento-id="${evento.id}">
        <img src="${primeraImagen}" alt="${evento.titulo}" onerror="this.src='https://via.placeholder.com/100x75?text=Error'" />
        <div class="post-info">
          <h3 class="post-title">${evento.titulo}</h3>
          <p class="post-excerpt">${excerpt}</p>
          <div class="post-meta">
            <span>${evento.espacio?.nombre || "Sin salón"}</span>
            <span>•</span>
            <span>${fecha}</span>
            <span>•</span>
            <span>${numImagenes} ${numImagenes === 1 ? "img" : "imgs"}</span>
            <span class="post-status ${evento.publicado ? "published" : "draft"}">
              ${evento.publicado ? "Publicado" : "Borrador"}
            </span>
          </div>
        </div>
        <div class="post-actions">
          <button type="button" class="btn secondary" data-action="editar" data-id="${evento.id}">Editar</button>
          <button type="button" class="btn ghost" data-action="eliminar" data-id="${evento.id}">Eliminar</button>
        </div>
      </div>
    `;
    }).join("");
  }
  function abrirModal(evento) {
    editingEventoId = evento?.id || null;
    imagenesTemp = evento?.imagenes ? [...evento.imagenes] : [];
    if (modalTitle) {
      modalTitle.textContent = evento ? "Editar Evento" : "Nuevo Evento";
    }
    if (eventoTitulo) eventoTitulo.value = evento?.titulo || "";
    if (eventoSlug) eventoSlug.value = evento?.slug || "";
    if (eventoEspacio) eventoEspacio.value = evento?.espacioId?.toString() || "";
    if (eventoExcerpt) eventoExcerpt.value = evento?.excerpt || "";
    if (eventoContent) eventoContent.value = evento?.content || "";
    if (eventoPublicado) eventoPublicado.checked = evento?.publicado ?? true;
    if (eventoFecha && evento?.publishedAt) {
      const date = new Date(evento.publishedAt);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      eventoFecha.value = `${year}-${month}-${day}T${hours}:${minutes}`;
    } else if (eventoFecha) {
      const now = /* @__PURE__ */ new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      eventoFecha.value = `${year}-${month}-${day}T${hours}:${minutes}`;
    }
    renderImagenes();
    if (eventoModal) eventoModal.classList.remove("hidden");
  }
  function cerrarModal() {
    if (eventoModal) eventoModal.classList.add("hidden");
    editingEventoId = null;
    imagenesTemp = [];
  }
  function renderImagenes() {
    if (!imagenesContainer) return;
    if (imagenesTemp.length === 0) {
      imagenesContainer.innerHTML = '<div class="placeholder">No hay imágenes. Sube archivos o selecciona de la galería.</div>';
      return;
    }
    imagenesContainer.innerHTML = imagenesTemp.map((img, index) => `
    <div class="imagen-item">
      <img src="${img.url}" alt="${img.alt || "Imagen"}" onerror="this.src='https://via.placeholder.com/140x105?text=Error'" />
      <input 
        type="text" 
        value="${img.alt || ""}" 
        placeholder="Descripción..."
        data-index="${index}"
        class="imagen-alt-input"
      />
      <div class="imagen-overlay">
        <div class="imagen-actions">
          <button class="btn-icon danger" data-action="eliminar-imagen" data-index="${index}" title="Eliminar">Eliminar</button>
        </div>
      </div>
    </div>
  `).join("");
  }
  async function subirArchivos(files) {
    if (!uploadProgress || !progressBar || !progressText) return;
    uploadProgress.style.display = "block";
    const totalFiles = files.length;
    let uploadedCount = 0;
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (progressText) progressText.textContent = `Subiendo ${i + 1} de ${totalFiles}...`;
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 8);
        const extension = file.name.split(".").pop();
        const fileName = `evento_${timestamp}_${randomStr}.${extension}`;
        const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(fileName, file, {
          cacheControl: "3600",
          upsert: false
        });
        if (error) {
          console.error("Error subiendo archivo:", error);
          showNotification(`Error subiendo ${file.name}`, "error");
          continue;
        }
        const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);
        if (urlData?.publicUrl) {
          imagenesTemp.push({
            url: urlData.publicUrl,
            alt: file.name.replace(/\.[^/.]+$/, "")
          });
          uploadedCount++;
        }
        const progress = (i + 1) / totalFiles * 100;
        if (progressBar) progressBar.style.width = `${progress}%`;
      }
      if (progressText) progressText.textContent = `${uploadedCount} de ${totalFiles} archivos subidos correctamente`;
      setTimeout(() => {
        if (uploadProgress) uploadProgress.style.display = "none";
      }, 2e3);
      renderImagenes();
      showNotification(`${uploadedCount} imágenes subidas exitosamente`);
    } catch (error) {
      console.error("Error en subida de archivos:", error);
      showNotification("Error al subir archivos", "error");
      if (uploadProgress) uploadProgress.style.display = "none";
    }
  }
  async function cargarGaleria() {
    if (!galeriaGrid) return;
    galeriaGrid.innerHTML = '<div class="placeholder">Cargando galería...</div>';
    try {
      const { data, error } = await supabase.storage.from(BUCKET_NAME).list("", {
        limit: 50,
        offset: 0,
        sortBy: { column: "created_at", order: "desc" }
      });
      if (error) {
        console.error("Error cargando galería:", error);
        galeriaGrid.innerHTML = '<div class="placeholder">Error al cargar galería</div>';
        return;
      }
      if (!data || data.length === 0) {
        galeriaGrid.innerHTML = '<div class="placeholder">No hay imágenes en la galería</div>';
        return;
      }
      galeriaGrid.innerHTML = data.map((file) => {
        const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(file.name);
        const isSelected = imagenesTemp.some((img) => img.url === urlData.publicUrl);
        return `
        <div class="galeria-item ${isSelected ? "selected" : ""}" data-url="${urlData.publicUrl}" data-name="${file.name}">
          <img src="${urlData.publicUrl}" alt="${file.name}" />
          <div class="check-icon">&check;</div>
        </div>
      `;
      }).join("");
    } catch (error) {
      console.error("Error cargando galería:", error);
      galeriaGrid.innerHTML = '<div class="placeholder">Error de conexión</div>';
    }
  }
  function abrirGaleria() {
    if (galeriaModal) galeriaModal.classList.remove("hidden");
    cargarGaleria();
  }
  function cerrarGaleria() {
    if (galeriaModal) galeriaModal.classList.add("hidden");
  }
  async function guardarEvento() {
    if (!eventoTitulo || !eventoSlug || !eventoContent) return;
    const titulo = eventoTitulo.value.trim();
    const slug = eventoSlug.value.trim();
    const content = eventoContent.value.trim();
    if (!titulo || !slug || !content) {
      showNotification("Completa los campos obligatorios (título, slug, contenido)", "error");
      return;
    }
    const payload = {
      titulo,
      slug,
      espacioId: eventoEspacio.value ? parseInt(eventoEspacio.value) : null,
      excerpt: eventoExcerpt.value.trim() || null,
      content,
      imagenes: imagenesTemp.length > 0 ? imagenesTemp : null,
      publicado: eventoPublicado.checked,
      publishedAt: eventoFecha.value || null
    };
    try {
      const token = getAuthToken();
      const url = editingEventoId ? `${API_URL}/admin/salon-posts/${editingEventoId}` : `${API_URL}/admin/salon-posts`;
      const method = editingEventoId ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (result.success) {
        showNotification(editingEventoId ? "Evento actualizado" : "Evento creado");
        cerrarModal();
        await cargarEventos();
      } else {
        showNotification(result.message || "Error al guardar", "error");
      }
    } catch (error) {
      console.error("Error guardando evento:", error);
      showNotification("Error de conexión", "error");
    }
  }
  async function eliminarEvento(id) {
    showConfirm("¿Estás seguro de eliminar este evento? Esta acción no se puede deshacer.", async () => {
      try {
        const token = getAuthToken();
        const response = await fetch(`${API_URL}/admin/salon-posts/${id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const result = await response.json();
        if (result.success) {
          showNotification("Evento eliminado exitosamente");
          await cargarEventos();
        } else {
          showNotification("Error al eliminar", "error");
        }
      } catch (error) {
        console.error("Error eliminando evento:", error);
        showNotification("Error de conexión", "error");
      }
    });
  }
  btnNuevoEvento?.addEventListener("click", (e) => {
    e.preventDefault();
    abrirModal();
  });
  btnRefrescar?.addEventListener("click", (e) => {
    e.preventDefault();
    cargarEventos();
  });
  btnCerrarModal?.addEventListener("click", (e) => {
    e.preventDefault();
    cerrarModal();
  });
  btnCancelar?.addEventListener("click", (e) => {
    e.preventDefault();
    cerrarModal();
  });
  btnGuardar?.addEventListener("click", (e) => {
    e.preventDefault();
    guardarEvento();
  });
  btnSubirArchivo?.addEventListener("click", (e) => {
    e.preventDefault();
    fileInput?.click();
  });
  btnVerGaleria?.addEventListener("click", (e) => {
    e.preventDefault();
    abrirGaleria();
  });
  btnCerrarGaleria?.addEventListener("click", (e) => {
    e.preventDefault();
    cerrarGaleria();
  });
  btnCerrarGaleriaFooter?.addEventListener("click", (e) => {
    e.preventDefault();
    cerrarGaleria();
  });
  fileInput?.addEventListener("change", (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      subirArchivos(files);
    }
  });
  eventoTitulo?.addEventListener("input", (e) => {
    const titulo = e.target.value;
    if (!editingEventoId && titulo && eventoSlug) {
      eventoSlug.value = generateSlug(titulo);
    }
  });
  if (eventosList) {
    eventosList.addEventListener("click", (e) => {
      const target = e.target;
      const button = target.matches("button[data-action]") ? target : target.closest("button[data-action]");
      if (!button) return;
      e.preventDefault();
      e.stopPropagation();
      const action = button.getAttribute("data-action");
      const id = button.getAttribute("data-id");
      console.log("Click detectado:", { action, id, button });
      if (action === "editar" && id) {
        const eventoId = parseInt(id);
        const evento = eventos.find((ev) => ev.id === eventoId);
        console.log("Evento encontrado:", evento);
        if (evento) {
          abrirModal(evento);
        }
      } else if (action === "eliminar" && id) {
        eliminarEvento(parseInt(id));
      }
    }, false);
  }
  imagenesContainer?.addEventListener("click", (e) => {
    const target = e.target;
    const action = target.dataset.action;
    const index = target.dataset.index;
    if (action === "eliminar-imagen" && index !== void 0) {
      showConfirm("¿Eliminar esta imagen?", () => {
        imagenesTemp.splice(parseInt(index), 1);
        renderImagenes();
      });
    }
  });
  imagenesContainer?.addEventListener("input", (e) => {
    const target = e.target;
    if (target.classList.contains("imagen-alt-input")) {
      const index = parseInt(target.dataset.index || "0");
      if (imagenesTemp[index]) {
        imagenesTemp[index].alt = target.value;
      }
    }
  });
  galeriaGrid?.addEventListener("click", (e) => {
    const target = e.target;
    const item = target.closest(".galeria-item");
    if (item) {
      const url = item.dataset.url;
      const name = item.dataset.name;
      if (!url) return;
      const existingIndex = imagenesTemp.findIndex((img) => img.url === url);
      if (existingIndex >= 0) {
        imagenesTemp.splice(existingIndex, 1);
        item.classList.remove("selected");
      } else {
        imagenesTemp.push({
          url,
          alt: name?.replace(/\.[^/.]+$/, "") || "Imagen del evento"
        });
        item.classList.add("selected");
      }
      renderImagenes();
    }
  });
  eventoModal?.querySelector(".modal-overlay")?.addEventListener("click", cerrarModal);
  galeriaModal?.querySelector(".modal-overlay")?.addEventListener("click", cerrarGaleria);
  async function init() {
    await cargarEspacios();
    await cargarEventos();
  }
  init();
});

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
