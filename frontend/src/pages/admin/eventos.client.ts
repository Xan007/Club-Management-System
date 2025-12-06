import { createClient } from '@supabase/supabase-js'

// Configuración
const API_URL = 'http://localhost:3333'
const SUPABASE_URL = 'https://bnoftsxwpxzmwjrmxoxc.supabase.co'
const SUPABASE_KEY = 'sb_publishable_YLeoJK1Kxf_Xm0nAHlmO8Q_2cHXCub1'
const BUCKET_NAME = 'eventos_imagenes'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

interface Imagen {
  url: string
  alt: string
}

interface Evento {
  id: number
  espacioId: number | null
  titulo: string
  slug: string
  excerpt: string | null
  content: string
  imagenes: Imagen[] | null
  publicado: boolean
  publishedAt: string | null
  espacio?: {
    id: number
    nombre: string
  }
}

// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {

let eventos: Evento[] = []
let espacios: any[] = []
let editingEventoId: number | null = null
let imagenesTemp: Imagen[] = []

// Elementos del DOM
const eventosList = document.getElementById('eventosList')
const btnNuevoEvento = document.getElementById('btnNuevoEvento')
const btnRefrescar = document.getElementById('btnRefrescar')





// Funciones auxiliares
function generateSlug(titulo: string): string {
  return titulo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function showNotification(message: string, type: 'success' | 'error' | 'warning' = 'success') {
  const container = document.getElementById('toastContainer')
  if (!container) return
  
  const toast = document.createElement('div')
  toast.className = `toast ${type}`
  
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : '⚠'
  
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-message">${message}</span>
    <button class="toast-close">&times;</button>
  `
  
  container.appendChild(toast)
  
  const closeBtn = toast.querySelector('.toast-close')
  closeBtn?.addEventListener('click', () => removeToast(toast))
  
  setTimeout(() => removeToast(toast), 5000)
}

function removeToast(toast: HTMLElement) {
  toast.classList.add('removing')
  setTimeout(() => toast.remove(), 300)
}



function getAuthToken(): string | null {
  const authData = localStorage.getItem('adminAuth')
  return authData ? JSON.parse(authData).token : null
}

// Cargar espacios
async function cargarEspacios() {
  try {
    const response = await fetch(`${API_URL}/api/espacios`)
    const result = await response.json()
    if (result.success) {
      espacios = result.data
      renderEspaciosSelect()
    }
  } catch (error) {
    console.error('Error cargando espacios:', error)
  }
}



// Cargar eventos
async function cargarEventos() {
  if (!eventosList) return
  
  eventosList.innerHTML = '<div class="placeholder">Cargando eventos...</div>'
  
  try {
    const token = getAuthToken()
    const response = await fetch(`${API_URL}/admin/salon-posts`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const result = await response.json()
    
    if (result.success) {
      eventos = result.data
      renderEventos()
    } else {
      eventosList.innerHTML = '<div class="placeholder">Error al cargar eventos</div>'
    }
  } catch (error) {
    console.error('Error cargando eventos:', error)
    eventosList.innerHTML = '<div class="placeholder">Error de conexión</div>'
  }
}

function renderEventos() {
  if (!eventosList) return
  
  if (eventos.length === 0) {
    eventosList.innerHTML = '<div class="placeholder">No hay eventos. Crea tu primer evento para comenzar.</div>'
    return
  }
  
  eventosList.innerHTML = eventos.map(evento => {
    const primeraImagen = evento.imagenes && evento.imagenes.length > 0 
      ? evento.imagenes[0].url 
      : 'https://via.placeholder.com/100x75?text=Sin+imagen'
    
    const fecha = evento.publishedAt 
      ? new Date(evento.publishedAt).toLocaleDateString('es-CO', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        })
      : 'Sin fecha'
    
    const numImagenes = evento.imagenes?.length || 0
    const excerpt = evento.excerpt || 'Sin descripción'
    
    return `
      <div class="post-card" data-evento-id="${evento.id}">
        <img src="${primeraImagen}" alt="${evento.titulo}" onerror="this.src='https://via.placeholder.com/100x75?text=Error'" />
        <div class="post-info">
          <h3 class="post-title">${evento.titulo}</h3>
          <p class="post-excerpt">${excerpt}</p>
          <div class="post-meta">
            <span>${evento.espacio?.nombre || 'Sin salón'}</span>
            <span>•</span>
            <span>${fecha}</span>
            <span>•</span>
            <span>${numImagenes} ${numImagenes === 1 ? 'img' : 'imgs'}</span>
            <span class="post-status ${evento.publicado ? 'published' : 'draft'}">
              ${evento.publicado ? 'Publicado' : 'Borrador'}
            </span>
          </div>
        </div>
        <div class="post-actions">
          <button type="button" class="btn secondary" data-action="editar" data-id="${evento.id}">Editar</button>
          <button type="button" class="btn ghost" data-action="eliminar" data-id="${evento.id}">Eliminar</button>
        </div>
      </div>
    `
  }).join('')
}











// Eliminar evento
async function eliminarEvento(id: number) {
  if (!confirm('¿Estás seguro de eliminar este evento? Esta acción no se puede deshacer.')) return
  
  try {
    const token = getAuthToken()
    const response = await fetch(`${API_URL}/admin/salon-posts/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    const result = await response.json()
    
    if (result.success) {
      showNotification('Evento eliminado exitosamente')
      await cargarEventos()
    } else {
      showNotification('Error al eliminar', 'error')
    }
  } catch (error) {
    console.error('Error eliminando evento:', error)
    showNotification('Error de conexión', 'error')
  }
}

// Event listeners
btnNuevoEvento?.addEventListener('click', (e) => {
  e.preventDefault()
  window.location.href = '/admin/eventos/nuevo'
})

btnRefrescar?.addEventListener('click', (e) => {
  e.preventDefault()
  cargarEventos()
})

// Delegación de eventos para la lista
if (eventosList) {
  eventosList.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    
    // Verificar si es un botón o está dentro de un botón
    const button = target.matches('button[data-action]') 
      ? target as HTMLButtonElement
      : target.closest('button[data-action]') as HTMLButtonElement
    
    if (!button) return
    
    e.preventDefault()
    e.stopPropagation()
    
    const action = button.getAttribute('data-action')
    const id = button.getAttribute('data-id')
    
    if (action === 'editar' && id) {
      showNotification('Función de editar no disponible', 'warning')
    } else if (action === 'eliminar' && id) {
      eliminarEvento(parseInt(id))
    }
  }, false)
}



// Inicializar
async function init() {
  await cargarEventos()
}

init()

}) // Fin DOMContentLoaded
