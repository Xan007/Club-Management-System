import { espaciosAdminAPI } from '../../services/api'
import { supabase } from '../../lib/supabase'

type Maybe<T> = T | null

function qs<T extends HTMLElement>(sel: string): Maybe<T> {
  return document.querySelector(sel) as Maybe<T>
}

async function ensureSession() {
  const { data } = await supabase.auth.getSession()
  if (!data.session) {
    window.location.href = '/admin/login'
  }
}

async function main() {
  const authData = localStorage.getItem('adminAuth')
  if (!authData) {
    window.location.href = '/admin/login'
    return
  }

  const espacioSelect = qs<HTMLSelectElement>('#espacioSelect')
  const estadoBadge = qs<HTMLSpanElement>('#estadoBadge')
  const titulo = qs<HTMLElement>('#espacioTitulo')
  const form = qs<HTMLElement>('#espacioForm')
  const emptyState = qs<HTMLElement>('#espacioEmpty')
  const nombreInput = qs<HTMLInputElement>('#espacioNombre')
  const descripcionInput = qs<HTMLTextAreaElement>('#espacioDescripcion')
  const activoInput = qs<HTMLInputElement>('#espacioActivo')
  const configList = qs<HTMLDivElement>('#configList')
  const nuevaDisposicion = qs<HTMLSelectElement>('#nuevaDisposicion')
  const nuevaCapacidad = qs<HTMLInputElement>('#nuevaCapacidad')
  const btnAgregarConfig = qs<HTMLButtonElement>('#btnAgregarConfig')
  const btnGuardarEspacio = qs<HTMLButtonElement>('#btnGuardarEspacio')
  const btnRefrescar = qs<HTMLButtonElement>('#btnRefrescarEspacios')
  const btnCrearEspacio = qs<HTMLButtonElement>('#btnCrearEspacio')
  const nuevoNombre = qs<HTMLInputElement>('#nuevoNombre')
  const nuevoDescripcion = qs<HTMLTextAreaElement>('#nuevoDescripcion')
  const nuevoActivo = qs<HTMLInputElement>('#nuevoActivo')

  let disposiciones: any[] = []
  let espacios: any[] = []
  let seleccionado: number | null = null

  function setBadge(text: string, state: 'active' | 'inactive' | 'muted') {
    if (!estadoBadge) return
    estadoBadge.textContent = text
    estadoBadge.className = 'pill ' + (state === 'active' ? 'pill-active' : state === 'inactive' ? 'pill-inactive' : 'pill-muted')
  }

  function renderSelect() {
    if (!espacioSelect) return
    const current = seleccionado
    espacioSelect.innerHTML = '<option value="">Elegir salón...</option>' +
      espacios.map((e) => `<option value="${e.id}">${e.nombre}${e.activo ? '' : ' (inactivo)'}</option>`).join('')
    if (current) {
      espacioSelect.value = String(current)
    }
  }

  function renderConfigList(espacio: any) {
    if (!configList) return
    if (!espacio.configuraciones?.length) {
      configList.innerHTML = '<div class="placeholder">Sin disposiciones.</div>'
      return
    }
    configList.innerHTML = espacio.configuraciones
      .map((c: any) => {
        const nombreDisp = c.disposicionNombre ?? 'Disposición'
        return `
          <div class="config-card" data-config-id="${c.id}" data-espacio-id="${espacio.id}">
            <div class="config-title">${nombreDisp}</div>
            <input type="number" min="1" class="capacidad" value="${c.capacidad}" />
            <div class="config-actions">
              <button class="link" data-action="guardar-config" data-id="${c.id}" data-espacio="${espacio.id}">Guardar</button>
              <button class="link danger" data-action="eliminar-config" data-id="${c.id}" data-espacio="${espacio.id}">Eliminar</button>
            </div>
          </div>
        `
      })
      .join('')
  }

  function showEspacio(id: number | null) {
    if (!form || !emptyState) return
    if (!id) {
      form.hidden = true
      emptyState.hidden = false
      titulo && (titulo.textContent = 'Selecciona un salón')
      setBadge('Sin selección', 'muted')
      return
    }
    const espacio = espacios.find((e) => e.id === id)
    if (!espacio) return
    form.hidden = false
    emptyState.hidden = true
    if (titulo) titulo.textContent = espacio.nombre
    if (nombreInput) nombreInput.value = espacio.nombre || ''
    if (descripcionInput) descripcionInput.value = espacio.descripcion || ''
    if (activoInput) activoInput.checked = !!espacio.activo
    setBadge(espacio.activo ? 'Activo' : 'Inactivo', espacio.activo ? 'active' : 'inactive')
    renderConfigList(espacio)
  }

  function populateDisposicionesSelect() {
    if (!nuevaDisposicion) return
    nuevaDisposicion.innerHTML = disposiciones.map((d) => `<option value="${d.id}">${d.nombre}</option>`).join('')
  }

  async function loadDisposiciones() {
    try {
      const resp = await espaciosAdminAPI.listarDisposiciones()
      disposiciones = resp.data || []
      populateDisposicionesSelect()
    } catch (err) {
      console.error('Error disposiciones', err)
      disposiciones = []
      populateDisposicionesSelect()
    }
  }

  async function loadEspacios() {
    try {
      const resp = await espaciosAdminAPI.listar()
      espacios = resp.data || []
      renderSelect()
      if (seleccionado && !espacios.some((e: any) => e.id === seleccionado)) {
        seleccionado = null
      }
      if (!seleccionado && espacios.length) {
        seleccionado = espacios[0].id
      }
      if (espacioSelect && seleccionado) {
        espacioSelect.value = String(seleccionado)
      }
      showEspacio(seleccionado)
    } catch (err) {
      console.error(err)
      setBadge('Error cargando', 'muted')
    }
  }

  async function guardarEspacio() {
    if (!seleccionado) return alert('Selecciona un salón')
    const payload = {
      nombre: nombreInput?.value || '',
      descripcion: descripcionInput?.value || '',
      activo: !!activoInput?.checked,
    }
    try {
      await espaciosAdminAPI.actualizar(seleccionado, payload)
      await loadEspacios()
      alert('Salón actualizado')
    } catch (err: any) {
      alert(err?.message || 'No se pudo guardar el salón')
    }
  }

  async function agregarConfig() {
    if (!seleccionado) return alert('Selecciona un salón')
    const disposicionId = Number(nuevaDisposicion?.value)
    const capacidad = Number(nuevaCapacidad?.value)
    if (!disposicionId || !capacidad) {
      alert('Selecciona disposición y capacidad')
      return
    }
    try {
      await espaciosAdminAPI.agregarConfiguracion(seleccionado, { disposicionId, capacidad })
      nuevaCapacidad && (nuevaCapacidad.value = '')
      await loadEspacios()
      alert('Configuración agregada')
    } catch (err: any) {
      alert(err?.message || 'No se pudo agregar la configuración')
    }
  }

  async function guardarConfig(configId: number, espacioId: number, row: Element) {
    const capacidad = Number((row.querySelector('.capacidad') as HTMLInputElement | null)?.value)
    if (!capacidad) {
      alert('Capacidad requerida')
      return
    }
    try {
      await espaciosAdminAPI.actualizarConfiguracion(espacioId, configId, { capacidad })
      await loadEspacios()
      alert('Configuración actualizada')
    } catch (err: any) {
      alert(err?.message || 'No se pudo actualizar')
    }
  }

  async function eliminarConfig(configId: number, espacioId: number) {
    if (!confirm('¿Eliminar configuración?')) return
    try {
      await espaciosAdminAPI.eliminarConfiguracion(espacioId, configId)
      await loadEspacios()
      alert('Configuración eliminada')
    } catch (err: any) {
      alert(err?.message || 'No se pudo eliminar')
    }
  }

  async function crearEspacio() {
    const nombre = nuevoNombre?.value?.trim()
    if (!nombre) return alert('Ingresa un nombre para el salón')
    const descripcion = nuevoDescripcion?.value?.trim() || undefined
    const activo = !!nuevoActivo?.checked
    try {
      const resp = await espaciosAdminAPI.crear({ nombre, descripcion, activo })
      nuevoNombre && (nuevoNombre.value = '')
      nuevoDescripcion && (nuevoDescripcion.value = '')
      if (nuevoActivo) nuevoActivo.checked = true
      await loadEspacios()
      const createdId = resp?.data?.id
      if (createdId) {
        seleccionado = createdId
        if (espacioSelect) espacioSelect.value = String(createdId)
      }
      showEspacio(seleccionado)
      alert('Salón creado')
    } catch (err: any) {
      alert(err?.message || 'No se pudo crear el salón')
    }
  }

  espacioSelect?.addEventListener('change', (e) => {
    const val = Number((e.target as HTMLSelectElement).value)
    seleccionado = val || null
    showEspacio(seleccionado)
  })

  btnGuardarEspacio?.addEventListener('click', guardarEspacio)
  btnAgregarConfig?.addEventListener('click', agregarConfig)
  btnRefrescar?.addEventListener('click', () => {
    loadDisposiciones()
    loadEspacios()
  })
  btnCrearEspacio?.addEventListener('click', crearEspacio)

  configList?.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target?.dataset) return
    const action = target.dataset.action
    const configId = Number(target.dataset.id)
    const espacioId = Number(target.dataset.espacio)
    if (!action || !configId || !espacioId) return
    const row = target.closest('.config-card')
    if (!row) return
    if (action === 'guardar-config') guardarConfig(configId, espacioId, row)
    if (action === 'eliminar-config') eliminarConfig(configId, espacioId)
  })

  await ensureSession()
  await loadDisposiciones()
  await loadEspacios()
}

window.addEventListener('DOMContentLoaded', () => {
  main().catch((err) => console.error('Error inicializando espacios admin', err))
})
