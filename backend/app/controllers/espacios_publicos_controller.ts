import Espacio from '#models/espacio'
import { HttpContext } from '@adonisjs/core/http'

// Cache simple en memoria (en producción usa Redis)
interface CacheEntry<T> {
  data: T
  timestamp: number
}

const cache = new Map<string, CacheEntry<any>>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutos en milisegundos

function getCached<T>(key: string): T | null {
  const entry = cache.get(key)
  if (!entry) return null

  const now = Date.now()
  if (now - entry.timestamp > CACHE_TTL) {
    cache.delete(key)
    return null
  }

  return entry.data as T
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() })
}

export default class EspaciosPublicosController {
  /**
   * GET /api/espacios-publicos
   * Retorna todos los espacios activos con su información completa
   * Cache: 5 minutos
   */
  async index({ response }: HttpContext) {
    try {
      const cacheKey = 'espacios-publicos:all'
      const cached = getCached<any[]>(cacheKey)

      if (cached) {
        return response.ok({
          success: true,
          data: cached,
          cached: true,
        })
      }

      const espacios = await Espacio.query()
        .where('activo', true)
        .orderBy('destacado', 'desc')
        .orderBy('nombre', 'asc')

      const data = espacios.map((espacio) => ({
        id: espacio.id,
        nombre: espacio.nombre,
        slug: espacio.slug,
        descripcion: espacio.descripcion,
        subtitulo: espacio.subtitulo,
        descripcionCompleta: espacio.descripcionCompleta,
        capacidadMinima: espacio.capacidadMinima,
        capacidadMaxima: espacio.capacidadMaxima,
        areaM2: espacio.areaM2,
        horarioDisponible: espacio.horarioDisponible,
        precioDesde: espacio.precioDesde,
        caracteristicas: espacio.caracteristicas || [],
        serviciosIncluidos: espacio.serviciosIncluidos || [],
        imagenes: espacio.imagenes || [],
        destacado: espacio.destacado,
        contenidoActualizadoAt: espacio.contenidoActualizadoAt?.toISO(),
      }))

      setCache(cacheKey, data)

      return response.ok({
        success: true,
        data,
        cached: false,
      })
    } catch (error) {
      console.error('Error obteniendo espacios públicos:', error)
      return response.internalServerError({
        success: false,
        message: 'Error al obtener los espacios',
      })
    }
  }

  /**
   * GET /api/espacios-publicos/:slug
   * Retorna un espacio específico por su slug
   * Cache: 5 minutos
   */
  async show({ params, response }: HttpContext) {
    try {
      const { slug } = params
      const cacheKey = `espacios-publicos:${slug}`
      const cached = getCached<any>(cacheKey)

      if (cached) {
        return response.ok({
          success: true,
          data: cached,
          cached: true,
        })
      }

      const espacio = await Espacio.query()
        .where('slug', slug)
        .where('activo', true)
        .firstOrFail()

      const data = {
        id: espacio.id,
        nombre: espacio.nombre,
        slug: espacio.slug,
        descripcion: espacio.descripcion,
        subtitulo: espacio.subtitulo,
        descripcionCompleta: espacio.descripcionCompleta,
        capacidadMinima: espacio.capacidadMinima,
        capacidadMaxima: espacio.capacidadMaxima,
        areaM2: espacio.areaM2,
        horarioDisponible: espacio.horarioDisponible,
        precioDesde: espacio.precioDesde,
        caracteristicas: espacio.caracteristicas || [],
        serviciosIncluidos: espacio.serviciosIncluidos || [],
        imagenes: espacio.imagenes || [],
        destacado: espacio.destacado,
        contenidoActualizadoAt: espacio.contenidoActualizadoAt?.toISO(),
      }

      setCache(cacheKey, data)

      return response.ok({
        success: true,
        data,
        cached: false,
      })
    } catch (error) {
      console.error('Error obteniendo espacio:', error)
      return response.notFound({
        success: false,
        message: 'Espacio no encontrado',
      })
    }
  }

  /**
   * DELETE /api/espacios-publicos/cache
   * Limpia el caché de espacios públicos (solo para admin)
   */
  async clearCache({ response }: HttpContext) {
    try {
      cache.clear()
      return response.ok({
        success: true,
        message: 'Caché limpiado exitosamente',
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Error al limpiar el caché',
      })
    }
  }
}
