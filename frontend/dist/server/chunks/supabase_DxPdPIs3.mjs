import { createClient } from '@supabase/supabase-js';

const API_BASE_URL = "http://localhost:3333";
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders = {
    "Content-Type": "application/json"
  };
  const auth = localStorage.getItem("adminAuth");
  if (auth) {
    try {
      const authData = JSON.parse(auth);
      if (authData.token && authData.token !== "demo-token") {
        defaultHeaders["Authorization"] = `Bearer ${authData.token}`;
      }
    } catch (e) {
      console.warn("Error parsing auth data:", e);
    }
  }
  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  };
  try {
    const response = await fetch(url, config);
    if (response.status === 401) {
      localStorage.removeItem("adminAuth");
      window.location.href = "/admin/login";
      throw new Error("No autorizado");
    }
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Error en la petición");
    }
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
const cotizacionesAPI = {
  // Crear cotización (para formulario público)
  async crear(data) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cotizaciones`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error creando cotización:", error);
      return {
        success: false,
        message: "Error al crear la cotización",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  },
  // Listar cotizaciones con filtros
  async listar(filtros = {}) {
    const params = new URLSearchParams();
    Object.entries(filtros).forEach(([key, value]) => {
      if (value !== void 0 && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });
    const queryString = params.toString();
    const endpoint = queryString ? `/api/cotizaciones?${queryString}` : "/api/cotizaciones";
    return fetchAPI(endpoint);
  },
  // Obtener detalle de cotización
  async obtener(id) {
    return fetchAPI(`/api/cotizaciones/${id}`);
  },
  // Editar cotización
  async actualizar(id, datos) {
    return fetchAPI(`/api/cotizaciones/${id}`, {
      method: "PUT",
      body: JSON.stringify(datos)
    });
  },
  // Cerrar cotización (convertir en reserva)
  async cerrar(id, datos) {
    return fetchAPI(`/api/cotizaciones/${id}/cerrar`, {
      method: "POST",
      body: JSON.stringify(datos)
    });
  },
  // Rechazar cotización
  async rechazar(id, motivo) {
    return fetchAPI(`/api/cotizaciones/${id}/rechazar`, {
      method: "POST",
      body: JSON.stringify({ motivo })
    });
  },
  // Registrar pago adicional
  async registrarPago(id, datos) {
    return fetchAPI(`/api/cotizaciones/${id}/registrar-pago`, {
      method: "POST",
      body: JSON.stringify(datos)
    });
  },
  // Descargar PDF
  getPdfUrl(cotizacionId) {
    return `${API_BASE_URL}/api/cotizaciones/${cotizacionId}/pdf`;
  },
  async descargarPdf(cotizacionId) {
    try {
      const url = this.getPdfUrl(cotizacionId);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error descargando PDF:", error);
      throw error;
    }
  },
  // Reenviar correo
  async reenviarCorreo(id) {
    return fetchAPI(`/api/cotizaciones/${id}/enviar-correo`, {
      method: "POST"
    });
  }
};
const espaciosAdminAPI = {
  // Listar espacios
  async listar() {
    return fetchAPI("/admin/espacios");
  },
  // Obtener espacio
  async obtener(id) {
    return fetchAPI(`/admin/espacios/${id}`);
  },
  // Crear espacio
  async crear(datos) {
    return fetchAPI("/admin/espacios", {
      method: "POST",
      body: JSON.stringify(datos)
    });
  },
  // Actualizar espacio
  async actualizar(id, datos) {
    return fetchAPI(`/admin/espacios/${id}`, {
      method: "PUT",
      body: JSON.stringify(datos)
    });
  },
  // Agregar configuración (disposición)
  async agregarConfiguracion(espacioId, datos) {
    return fetchAPI(`/admin/espacios/${espacioId}/configuraciones`, {
      method: "POST",
      body: JSON.stringify(datos)
    });
  },
  // Actualizar configuración
  async actualizarConfiguracion(espacioId, configId, datos) {
    return fetchAPI(`/admin/espacios/${espacioId}/configuraciones/${configId}`, {
      method: "PUT",
      body: JSON.stringify(datos)
    });
  },
  // Eliminar configuración
  async eliminarConfiguracion(espacioId, configId) {
    return fetchAPI(`/admin/espacios/${espacioId}/configuraciones/${configId}`, {
      method: "DELETE"
    });
  },
  // Listar disposiciones
  async listarDisposiciones() {
    return fetchAPI("/admin/disposiciones");
  },
  // Crear disposición
  async crearDisposicion(datos) {
    return fetchAPI("/admin/disposiciones", {
      method: "POST",
      body: JSON.stringify(datos)
    });
  },
  // Actualizar disposición
  async actualizarDisposicion(id, datos) {
    return fetchAPI(`/admin/disposiciones/${id}`, {
      method: "PUT",
      body: JSON.stringify(datos)
    });
  }
};
const salonPostsAPI = {
  // Listar todos los posts (admin - incluye borradores)
  listarAdmin: async () => {
    return fetchAPI("/admin/salon-posts");
  },
  // Listar posts por espacio
  listarPorEspacio: async (espacioId) => {
    return fetchAPI(`/admin/salon-posts?espacio_id=${espacioId}`);
  },
  // Obtener un post por ID (admin)
  obtener: async (id) => {
    return fetchAPI(`/admin/salon-posts/${id}`);
  },
  // Crear un nuevo post
  crear: async (data) => {
    return fetchAPI("/admin/salon-posts", {
      method: "POST",
      body: JSON.stringify(data)
    });
  },
  // Actualizar un post
  actualizar: async (id, data) => {
    return fetchAPI(`/admin/salon-posts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data)
    });
  },
  // Eliminar un post
  eliminar: async (id) => {
    return fetchAPI(`/admin/salon-posts/${id}`, {
      method: "DELETE"
    });
  },
  // Publicar/Despublicar un post
  togglePublicar: async (id, publicado) => {
    return fetchAPI(`/admin/salon-posts/${id}/publish`, {
      method: "POST",
      body: JSON.stringify({ publicado })
    });
  }
};

const supabaseUrl = "https://bnoftsxwpxzmwjrmxoxc.supabase.co";
const supabaseKey = "sb_publishable_YLeoJK1Kxf_Xm0nAHlmO8Q_2cHXCub1";
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== "undefined" ? window.localStorage : void 0
  }
});

export { supabase as a, cotizacionesAPI as c, espaciosAdminAPI as e, salonPostsAPI as s };
