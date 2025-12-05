import { cotizacionesAPI } from '../../services/api'
import { supabase } from '../../lib/supabase'

type Maybe<T> = T | null

type Modo = 'mensual' | 'anual'

type Cot = {
  estado?: string
  evento?: { fecha?: string; salon?: string | null }
}

function qs<T extends HTMLElement>(sel: string): Maybe<T> {
  return document.querySelector(sel) as Maybe<T>
}

function extractYMD(value?: string): { y: number; m: number; d: number } | null {
  if (!value) return null
  const m = value.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (m) return { y: Number(m[1]), m: Number(m[2]), d: Number(m[3]) }
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return null
  return { y: d.getFullYear(), m: d.getMonth() + 1, d: d.getDate() }
}

function statusKey(estado?: string): 'aceptada' | 'pendiente' | 'rechazada' | 'otra' {
  if (!estado) return 'otra'
  const e = estado.toLowerCase()
  if (e.includes('pendiente')) return 'pendiente'
  if (e.includes('aceptada')) return 'aceptada'
  if (e.includes('rechazada')) return 'rechazada'
  return 'otra'
}

async function ensureSession() {
  const { data } = await supabase.auth.getSession()
  if (!data.session) {
    window.location.href = '/admin/login'
  }
}

function numberFmt(n: number): string {
  return new Intl.NumberFormat('es-CO').format(n)
}

function setText(el: Maybe<HTMLElement>, value: string) {
  if (el) el.textContent = value
}

function renderKpis(filtered: Cot[]) {
  const total = filtered.length
  const counts = { aceptada: 0, pendiente: 0, rechazada: 0, otra: 0 }
  filtered.forEach((c) => {
    const key = statusKey(c.estado)
    counts[key] += 1
  })
  setText(qs('#kpiTotal'), numberFmt(total))
  setText(qs('#kpiAprobadas'), numberFmt(counts.aceptada))
  setText(qs('#kpiPendientes'), numberFmt(counts.pendiente))
  setText(qs('#kpiRechazadas'), numberFmt(counts.rechazada))
}

function renderBars(target: Maybe<HTMLDivElement>, series: Array<{ label: string; value: number }>) {
  if (!target) return
  target.innerHTML = ''
  target.className = 'bars'
  const max = Math.max(1, ...series.map((s) => s.value))
  series.forEach((s) => {
    const pct = (s.value / max) * 100
    const height = Math.max(s.value === 0 ? 8 : 12, pct)
    
    const barDiv = document.createElement('div')
    barDiv.className = 'bar'
    
    const valueDiv = document.createElement('div')
    valueDiv.className = 'bar__value'
    valueDiv.style.height = `${height}%`
    
    const countDiv = document.createElement('div')
    countDiv.className = 'bar__count'
    countDiv.textContent = String(s.value)
    
    const labelDiv = document.createElement('div')
    labelDiv.className = 'bar__label'
    labelDiv.textContent = s.label
    
    barDiv.appendChild(valueDiv)
    barDiv.appendChild(countDiv)
    barDiv.appendChild(labelDiv)
    target.appendChild(barDiv)
  })
}

function colorPalette(): string[] {
  return ['#0a4ba5', '#2563eb', '#f59e0b', '#10b981', '#ef4444', '#9333ea', '#14b8a6', '#f97316', '#64748b']
}

function renderDonut(target: Maybe<HTMLDivElement>, legendEl: Maybe<HTMLDivElement>, data: Record<string, number>) {
  if (!target || !legendEl) return
  const entries = Object.entries(data).filter(([, v]) => v > 0)
  const total = entries.reduce((acc, [, v]) => acc + v, 0)
  if (!entries.length || !total) {
    target.style.background = 'conic-gradient(#e5e7eb 0deg, #e5e7eb 360deg)'
    legendEl.innerHTML = '<div class="legend-item">Sin datos</div>'
    setText(qs('#donutTotal'), '0')
    return
  }

  const colors = colorPalette()
  let current = 0
  const segments: string[] = []
  const legendHTML: string[] = []

  entries.forEach(([salon, value], idx) => {
    const perc = (value / total) * 100
    const start = current
    const end = current + (perc / 100) * 360
    const color = colors[idx % colors.length]
    segments.push(`${color} ${start}deg ${end}deg`)
    current = end
    legendHTML.push(`
      <div class="legend-item">
        <div class="legend-left">
          <span class="dot" style="background:${color}"></span>
          <span>${salon}</span>
        </div>
        <span class="legend-perc">${perc.toFixed(1)}%</span>
      </div>
    `)
  })

  target.style.background = `conic-gradient(${segments.join(',')})`
  legendEl.innerHTML = legendHTML.join('')
  setText(qs('#donutTotal'), numberFmt(total))
}

async function main() {
  const modoSelect = qs<HTMLSelectElement>('#modoSelect')
  const yearSelect = qs<HTMLSelectElement>('#yearSelect')
  const chartTitle = qs<HTMLHeadingElement>('#chartTitle')
  const chartBars = qs<HTMLDivElement>('#chartBars')
  const donutChart = qs<HTMLDivElement>('#donutChart')
  const donutLegend = qs<HTMLDivElement>('#donutLegend')
  const btnRefrescar = qs<HTMLButtonElement>('#btnRefrescar')

  let cotizaciones: Cot[] = []
  let modo: Modo = 'mensual'
  let year = new Date().getFullYear()
  let yearsDisponibles: number[] = []

  function updateYearOptions() {
    if (!yearSelect) return
    if (!yearsDisponibles.length) yearsDisponibles = [year]
    const opts = yearsDisponibles
      .slice()
      .sort((a, b) => b - a)
      .map((y) => `<option value="${y}">${y}</option>`)
    yearSelect.innerHTML = opts.join('')
    if (!yearsDisponibles.includes(year)) {
      year = yearsDisponibles[0]
    }
    yearSelect.value = String(year)
    yearSelect.disabled = modo === 'anual'
  }

  function filteredData(): Cot[] {
    if (modo === 'mensual') {
      return cotizaciones.filter((c) => {
        const parts = extractYMD(c.evento?.fecha)
        if (!parts) return false
        return parts.y === year
      })
    }
    return cotizaciones
  }

  function buildSeries(): Array<{ label: string; value: number }> {
    if (modo === 'mensual') {
      const base = Array.from({ length: 12 }, (_, i) => ({ label: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'][i], value: 0, m: i + 1 }))
      filteredData().forEach((c) => {
        const parts = extractYMD(c.evento?.fecha)
        if (!parts) return
        const idx = parts.m - 1
        base[idx].value += 1
      })
      return base.map(({ label, value }) => ({ label, value }))
    }
    const counts: Record<number, number> = {}
    cotizaciones.forEach((c) => {
      const parts = extractYMD(c.evento?.fecha)
      if (!parts) return
      counts[parts.y] = (counts[parts.y] || 0) + 1
    })
    return Object.entries(counts)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([y, v]) => ({ label: y, value: Number(v) }))
  }

  function buildSalonShare(): Record<string, number> {
    const acc: Record<string, number> = {}
    filteredData().forEach((c) => {
      const name = c.evento?.salon || 'Sin salón'
      acc[name] = (acc[name] || 0) + 1
    })
    return acc
  }

  function render() {
    const data = filteredData()
    renderKpis(data)
    const series = buildSeries()
    renderBars(chartBars, series)
    const titleText = modo === 'mensual' ? `Cotizaciones por mes · ${year}` : 'Cotizaciones por año'
    if (chartTitle) chartTitle.textContent = titleText
    renderDonut(donutChart, donutLegend, buildSalonShare())
  }

  async function loadData() {
    if (chartBars) chartBars.innerHTML = '<div class="placeholder">Cargando...</div>'
    try {
      const resp = await cotizacionesAPI.listar({})
      cotizaciones = (resp as any)?.data || []
      yearsDisponibles = Array.from(
        new Set(
          cotizaciones
            .map((c) => extractYMD(c.evento?.fecha)?.y)
            .filter((v): v is number => typeof v === 'number')
        )
      )
      if (yearsDisponibles.length) {
        if (!yearsDisponibles.includes(year)) {
          year = Math.max(...yearsDisponibles)
        }
      }
      updateYearOptions()
      render()
    } catch (err) {
      console.error('Error cargando reportes', err)
      if (chartBars) chartBars.innerHTML = '<div class="placeholder">No se pudieron cargar los datos.</div>'
    }
  }

  modoSelect?.addEventListener('change', (e) => {
    modo = ((e.target as HTMLSelectElement).value as Modo) || 'mensual'
    updateYearOptions()
    render()
  })

  yearSelect?.addEventListener('change', (e) => {
    year = Number((e.target as HTMLSelectElement).value) || year
    render()
  })

  btnRefrescar?.addEventListener('click', () => {
    loadData()
  })

  await ensureSession()
  await loadData()
}

window.addEventListener('DOMContentLoaded', () => {
  main().catch((err) => console.error('Error inicializando reportes admin', err))
})
