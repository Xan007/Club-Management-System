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

document.addEventListener('DOMContentLoaded', () => {
  let imagenesTemp: Imagen[] = []
  let espacios: any[] = []
  let editor: any = null

  // Elementos del DOM
  const eventoForm = document.getElementById('eventoForm') as HTMLFormElement
  const eventoTitulo = document.getElementById('eventoTitulo') as HTMLInputElement
  const eventoEspacio = document.getElementById('eventoEspacio') as HTMLSelectElement

  const imagenesContainer = document.getElementById('imagenesContainer')
  const fileInput = document.getElementById('fileInput') as HTMLInputElement
  const btnSubirArchivo = document.getElementById('btnSubirArchivo')
  const uploadProgress = document.getElementById('uploadProgress')
  const progressBar = document.getElementById('progressBar')
  const progressText = document.getElementById('progressText')

  // Funciones auxiliares
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

  function renderEspaciosSelect() {
    if (!eventoEspacio) return
    eventoEspacio.innerHTML = '<option value="">Ninguno</option>'
    espacios.forEach(espacio => {
      const option = document.createElement('option')
      option.value = espacio.id
      option.textContent = espacio.nombre
      eventoEspacio.appendChild(option)
    })
  }

  // Renderizar imágenes
  function renderImagenes() {
    if (!imagenesContainer) return
    
    if (imagenesTemp.length === 0) {
      imagenesContainer.innerHTML = '<div class="placeholder">No hay imágenes. Sube archivos para comenzar.</div>'
      return
    }
    
    imagenesContainer.innerHTML = imagenesTemp.map((img, index) => `
      <div class="imagen-item">
        <img src="${img.url}" alt="${img.alt || 'Imagen'}" onerror="this.src='https://via.placeholder.com/140x105?text=Error'" />
        <input 
          type="text" 
          value="${img.alt || ''}" 
          placeholder="Descripción..."
          data-index="${index}"
          class="imagen-alt-input"
        />
        <div class="imagen-overlay">
          <div class="imagen-actions">
            <button type="button" class="btn-icon danger" data-action="eliminar-imagen" data-index="${index}">Eliminar</button>
          </div>
        </div>
      </div>
    `).join('')
  }

  // Subir archivos a Supabase Storage
  async function subirArchivos(files: FileList) {
    if (!uploadProgress || !progressBar || !progressText) return
    
    (uploadProgress as HTMLElement).style.display = 'block'
    const totalFiles = files.length
    let uploadedCount = 0
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (progressText) progressText.textContent = `Subiendo ${i + 1} de ${totalFiles}...`
        
        // Generar nombre único
        const timestamp = Date.now()
        const randomStr = Math.random().toString(36).substring(2, 8)
        const extension = file.name.split('.').pop()
        const fileName = `evento_${timestamp}_${randomStr}.${extension}`
        
        // Subir a Supabase Storage
        const { data, error } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          })
        
        if (error) {
          console.error('Error subiendo archivo:', error)
          showNotification(`Error subiendo ${file.name}`, 'error')
          continue
        }
        
        // Obtener URL pública
        const { data: urlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(fileName)
        
        if (urlData?.publicUrl) {
          imagenesTemp.push({
            url: urlData.publicUrl,
            alt: file.name.replace(/\.[^/.]+$/, '')
          })
          uploadedCount++
        }
        
        // Actualizar barra de progreso
        const progress = ((i + 1) / totalFiles) * 100
        if (progressBar) progressBar.style.width = `${progress}%`
      }
      
      if (progressText) progressText.textContent = `${uploadedCount} de ${totalFiles} archivos subidos correctamente`
      setTimeout(() => {
        if (uploadProgress) (uploadProgress as HTMLElement).style.display = 'none'
        if (progressBar) progressBar.style.width = '0%'
      }, 2000)
      
      renderImagenes()
      showNotification(`${uploadedCount} imágenes subidas exitosamente`)
      
    } catch (error) {
      console.error('Error en subida de archivos:', error)
      showNotification('Error al subir archivos', 'error')
      if (uploadProgress) (uploadProgress as HTMLElement).style.display = 'none'
    }
  }

  // Guardar evento
  async function guardarEvento(e: Event) {
    e.preventDefault()
    
    const titulo = eventoTitulo.value.trim()
    const content = editor ? editor.value().trim() : ''
    
    if (!titulo || !content) {
      showNotification('Completa los campos obligatorios (título, contenido)', 'error')
      return
    }
    
    const payload = {
      titulo,
      espacioId: eventoEspacio.value ? parseInt(eventoEspacio.value) : null,
      content,
      imagenes: imagenesTemp.length > 0 ? imagenesTemp : null,
      publicado: true,
      publishedAt: new Date().toISOString(),
    }
    
    try {
      const token = getAuthToken()
      const response = await fetch(`${API_URL}/admin/salon-posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })
      
      const result = await response.json()
      
      if (result.success) {
        showNotification('Evento creado exitosamente')
        setTimeout(() => {
          window.location.href = '/admin/eventos'
        }, 1500)
      } else {
        showNotification(result.message || 'Error al guardar', 'error')
      }
    } catch (error) {
      console.error('Error guardando evento:', error)
      showNotification('Error de conexión', 'error')
    }
  }

  // Event listeners
  btnSubirArchivo?.addEventListener('click', (e) => {
    e.preventDefault()
    fileInput?.click()
  })

  fileInput?.addEventListener('change', (e) => {
    const files = (e.target as HTMLInputElement).files
    if (files && files.length > 0) {
      subirArchivos(files)
    }
  })

  imagenesContainer?.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    const action = target.dataset.action
    const index = target.dataset.index
    
    if (action === 'eliminar-imagen' && index !== undefined) {
      if (confirm('¿Eliminar esta imagen?')) {
        imagenesTemp.splice(parseInt(index), 1)
        renderImagenes()
      }
    }
  })

  imagenesContainer?.addEventListener('input', (e) => {
    const target = e.target as HTMLInputElement
    if (target.classList.contains('imagen-alt-input')) {
      const index = parseInt(target.dataset.index || '0')
      if (imagenesTemp[index]) {
        imagenesTemp[index].alt = target.value
      }
    }
  })

  eventoForm?.addEventListener('submit', guardarEvento)

  // Inicializar editor EasyMDE
  function initEditor() {
    // @ts-ignore
    if (typeof EasyMDE !== 'undefined') {
      const textarea = document.createElement('textarea')
      textarea.id = 'eventoContent'
      const container = document.getElementById('editorContainer')
      if (container) {
        container.appendChild(textarea)
        
        // @ts-ignore
        editor = new EasyMDE({
          element: textarea,
          placeholder: '# Contenido del evento\n\nEscribe aquí en **Markdown**...',
          spellChecker: false,
          status: ['lines', 'words', 'cursor'],
          toolbar: [
            'bold', 'italic', 'heading', '|',
            'quote', 'unordered-list', 'ordered-list', '|',
            'link', 'image', '|',
            'preview', 'side-by-side', 'fullscreen', '|',
            'guide'
          ],
          minHeight: '300px',
        })
      }
    } else {
      console.error('EasyMDE no está disponible')
    }
  }

  // Inicializar
  async function init() {
    await cargarEspacios()
    initEditor()
  }

  init()
})
