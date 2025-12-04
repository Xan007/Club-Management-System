import type { HttpContext } from '@adonisjs/core/http'
import HorarioOperacion from '#models/horario_operacion'
import vine from '@vinejs/vine'

export default class HorariosController {
  /**
   * Listar horarios de operación
   */
  async index({ response }: HttpContext) {
    try {
      const horarios = await HorarioOperacion.query().orderBy('dia_semana')

      return response.json({
        success: true,
        data: horarios.map((h) => ({
          id: h.id,
          dia: h.nombreDia,
          dia_numero: h.diaSemana,
          activo: h.estaActivo,
          hora_inicio: h.horaInicio,
          hora_fin: h.horaFin,
        })),
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Error al obtener horarios',
        error: error.message,
      })
    }
  }

  /**
   * Obtener horario de un día específico
   */
  async mostrar({ params, response }: HttpContext) {
    try {
      const horario = await HorarioOperacion.findOrFail(params.id)

      return response.json({
        success: true,
        data: {
          id: horario.id,
          dia: horario.nombreDia,
          dia_numero: horario.diaSemana,
          activo: horario.estaActivo,
          hora_inicio: horario.horaInicio,
          hora_fin: horario.horaFin,
        },
      })
    } catch (error) {
      return response.status(404).json({
        success: false,
        message: 'Horario no encontrado',
      })
    }
  }

  /**
   * Crear horario
   */
  async crear({ request, response }: HttpContext) {
    try {
      const schema = vine.object({
        dia_semana: vine.number().min(0).max(6),
        esta_activo: vine.boolean(),
        hora_inicio: vine.string().regex(/^\d{2}:\d{2}:\d{2}$/),
        hora_fin: vine.string().regex(/^\d{2}:\d{2}:\d{2}$/),
      })

      const data = await vine.validate({ schema, data: request.all() })

      // Verificar que no exista horario para ese día
      const existe = await HorarioOperacion.findBy('dia_semana', data.dia_semana)
      if (existe) {
        return response.status(400).json({
          success: false,
          message: 'Ya existe un horario configurado para este día',
        })
      }

      const horario = await HorarioOperacion.create({
        diaSemana: data.dia_semana,
        estaActivo: data.esta_activo,
        horaInicio: data.hora_inicio,
        horaFin: data.hora_fin,
      })

      return response.status(201).json({
        success: true,
        message: 'Horario creado exitosamente',
        data: horario,
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: 'Error al crear el horario',
        error: error.message,
      })
    }
  }

  /**
   * Actualizar horario
   */
  async actualizar({ params, request, response }: HttpContext) {
    try {
      const schema = vine.object({
        esta_activo: vine.boolean().optional(),
        hora_inicio: vine.string().regex(/^\d{2}:\d{2}:\d{2}$/).optional(),
        hora_fin: vine.string().regex(/^\d{2}:\d{2}:\d{2}$/).optional(),
      })

      const data = await vine.validate({ schema, data: request.all() })

      const horario = await HorarioOperacion.findOrFail(params.id)

      if (data.esta_activo !== undefined) horario.estaActivo = data.esta_activo
      if (data.hora_inicio) horario.horaInicio = data.hora_inicio
      if (data.hora_fin) horario.horaFin = data.hora_fin

      await horario.save()

      return response.json({
        success: true,
        message: 'Horario actualizado exitosamente',
        data: horario,
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: 'Error al actualizar el horario',
        error: error.message,
      })
    }
  }

  /**
   * Activar un día
   */
  async activar({ params, response }: HttpContext) {
    try {
      const horario = await HorarioOperacion.findOrFail(params.id)
      horario.estaActivo = true
      await horario.save()

      return response.json({
        success: true,
        message: `${horario.nombreDia} activado exitosamente`,
        data: {
          id: horario.id,
          dia: horario.nombreDia,
          dia_numero: horario.diaSemana,
          activo: horario.estaActivo,
          hora_inicio: horario.horaInicio,
          hora_fin: horario.horaFin,
        },
      })
    } catch (error) {
      return response.status(404).json({
        success: false,
        message: 'Horario no encontrado',
      })
    }
  }

  /**
   * Desactivar un día
   */
  async desactivar({ params, response }: HttpContext) {
    try {
      const horario = await HorarioOperacion.findOrFail(params.id)
      horario.estaActivo = false
      await horario.save()

      return response.json({
        success: true,
        message: `${horario.nombreDia} desactivado exitosamente`,
        data: {
          id: horario.id,
          dia: horario.nombreDia,
          dia_numero: horario.diaSemana,
          activo: horario.estaActivo,
          hora_inicio: horario.horaInicio,
          hora_fin: horario.horaFin,
        },
      })
    } catch (error) {
      return response.status(404).json({
        success: false,
        message: 'Horario no encontrado',
      })
    }
  }

  /**
   * Actualizar horarios de un día específico
   */
  async actualizarHorarios({ params, request, response }: HttpContext) {
    try {
      const schema = vine.object({
        hora_inicio: vine.string().regex(/^\d{2}:\d{2}(:\d{2})?$/),
        hora_fin: vine.string().regex(/^\d{2}:\d{2}(:\d{2})?$/),
      })

      const data = await vine.validate({ schema, data: request.all() })

      const horario = await HorarioOperacion.findOrFail(params.id)

      // Asegurar formato HH:mm:ss
      horario.horaInicio = data.hora_inicio.length === 5 ? `${data.hora_inicio}:00` : data.hora_inicio
      horario.horaFin = data.hora_fin.length === 5 ? `${data.hora_fin}:00` : data.hora_fin

      await horario.save()

      return response.json({
        success: true,
        message: 'Horarios actualizados exitosamente',
        data: {
          id: horario.id,
          dia: horario.nombreDia,
          dia_numero: horario.diaSemana,
          activo: horario.estaActivo,
          hora_inicio: horario.horaInicio,
          hora_fin: horario.horaFin,
        },
      })
    } catch (error: any) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.status(404).json({
          success: false,
          message: 'Horario no encontrado',
        })
      }

      if (error.messages) {
        return response.status(422).json({
          success: false,
          message: 'Errores de validación',
          errors: error.messages,
        })
      }

      return response.status(400).json({
        success: false,
        message: 'Error al actualizar los horarios',
      })
    }
  }

  /**
   * Eliminar horario
   */
  async eliminar({ params, response }: HttpContext) {
    try {
      const horario = await HorarioOperacion.findOrFail(params.id)
      await horario.delete()

      return response.json({
        success: true,
        message: 'Horario eliminado exitosamente',
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: 'Error al eliminar el horario',
        error: error.message,
      })
    }
  }
}
