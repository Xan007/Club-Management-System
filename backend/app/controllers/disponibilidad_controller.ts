import type { HttpContext } from '@adonisjs/core/http'
import HorarioOperacion from '#models/horario_operacion'
import BloqueoCalendario from '#models/bloqueo_calendario'
import { DateTime } from 'luxon'

export default class DisponibilidadController {
  /**
   * Obtener horas disponibles para un espacio en una fecha específica
   * GET /api/disponibilidad/horas?espacioId=1&fecha=2025-12-15
   */
  async obtenerHorasDisponibles({ request, response }: HttpContext) {
    try {
      const { espacioId, fecha, duracion } = request.qs()

      if (!espacioId || !fecha) {
        return response.status(400).json({
          success: false,
          message: 'Parámetros requeridos: espacioId, fecha',
        })
      }

      // Duración mínima por defecto es 4 horas
      const duracionHoras = duracion ? parseInt(duracion) : 4

      // Validar formato de fecha
      const fechaObj = DateTime.fromISO(fecha, { zone: 'America/Bogota' })
      if (!fechaObj.isValid) {
        return response.status(400).json({
          success: false,
          message: 'Formato de fecha inválido. Use YYYY-MM-DD',
        })
      }

      // Obtener día de la semana (0 = domingo, 6 = sábado)
      const diaSemana = fechaObj.weekday === 7 ? 0 : fechaObj.weekday

      // Obtener horario de operación para ese día
      const horario = await HorarioOperacion.query()
        .where('dia_semana', diaSemana)
        .where('esta_activo', true)
        .first()

      if (!horario) {
        return response.json({
          success: true,
          data: {
            fecha,
            horasDisponibles: [],
            mensaje: 'El club no opera este día de la semana',
          },
        })
      }

      // Generar slots de 1 hora desde hora_inicio hasta hora_fin
      const horaInicio = DateTime.fromFormat(horario.horaInicio, 'HH:mm:ss', {
        zone: 'America/Bogota',
      })
      const horaFin = DateTime.fromFormat(horario.horaFin, 'HH:mm:ss', {
        zone: 'America/Bogota',
      })

      // Calcular la última hora válida de inicio basada en la duración
      // Si cierra a 22:00 y necesitan 4h, última hora de inicio = 18:00
      const ultimaHoraInicio = horaFin.minus({ hours: duracionHoras })

      const slots: { hora: string; disponible: boolean }[] = []
      let horaActual = horaInicio

      // Solo generar slots hasta la última hora válida de inicio
      while (horaActual <= ultimaHoraInicio) {
        const horaStr = horaActual.toFormat('HH:mm')
        slots.push({
          hora: horaStr,
          disponible: true, // Por defecto disponible
        })
        horaActual = horaActual.plus({ hours: 1 })
      }

      // Obtener bloqueos para esta fecha y espacio
      const bloqueos = await BloqueoCalendario.query()
        .where('espacio_id', espacioId)
        .where('fecha', fecha)

      // Marcar slots como no disponibles si hay bloqueos
      for (const bloqueo of bloqueos) {
        const bloqueadoInicio = DateTime.fromFormat(bloqueo.horaInicio, 'HH:mm:ss', {
          zone: 'America/Bogota',
        })
        const bloqueadoFin = DateTime.fromFormat(bloqueo.horaFin, 'HH:mm:ss', {
          zone: 'America/Bogota',
        })

        for (const slot of slots) {
          const slotHora = DateTime.fromFormat(slot.hora, 'HH:mm', {
            zone: 'America/Bogota',
          })

          // Si el slot está dentro del rango bloqueado, marcarlo como no disponible
          if (slotHora >= bloqueadoInicio && slotHora < bloqueadoFin) {
            slot.disponible = false
          }
        }
      }

      // Filtrar solo slots disponibles
      const horasDisponibles = slots.filter((s) => s.disponible).map((s) => s.hora)

      return response.json({
        success: true,
        data: {
          fecha,
          espacioId: parseInt(espacioId),
          horarioOperacion: {
            horaInicio: horario.horaInicio.substring(0, 5), // HH:mm
            horaFin: horario.horaFin.substring(0, 5),
            diaSemana: horario.nombreDia,
          },
          horasDisponibles,
          totalSlots: slots.length,
          slotsDisponibles: horasDisponibles.length,
        },
      })
    } catch (error) {
      console.error('Error obteniendo horas disponibles:', error)
      return response.status(500).json({
        success: false,
        message: 'Error al obtener horas disponibles',
        error: error.message,
      })
    }
  }
}
