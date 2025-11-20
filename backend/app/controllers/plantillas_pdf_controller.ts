import type { HttpContext } from '@adonisjs/core/http'
import PlantillaPdf from '#models/plantilla_pdf'
import vine from '@vinejs/vine'

export default class PlantillasPdfController {
  /**
   * Listar plantillas PDF
   */
  async index({ response }: HttpContext) {
    try {
      const plantillas = await PlantillaPdf.query().orderBy('created_at', 'desc')

      return response.json({
        success: true,
        data: plantillas.map((p) => ({
          id: p.id,
          nombre: p.nombre,
          activa: p.activa,
          descripcion: p.descripcion,
          variables_disponibles: p.variablesDisponibles,
          creada: p.createdAt,
        })),
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Error al obtener plantillas',
        error: error.message,
      })
    }
  }

  /**
   * Obtener detalle de una plantilla
   */
  async mostrar({ params, response }: HttpContext) {
    try {
      const plantilla = await PlantillaPdf.findOrFail(params.id)

      return response.json({
        success: true,
        data: {
          id: plantilla.id,
          nombre: plantilla.nombre,
          activa: plantilla.activa,
          descripcion: plantilla.descripcion,
          contenido_html: plantilla.contenidoHtml,
          variables_disponibles: plantilla.variablesDisponibles,
          creada: plantilla.createdAt,
        },
      })
    } catch (error) {
      return response.status(404).json({
        success: false,
        message: 'Plantilla no encontrada',
      })
    }
  }

  /**
   * Crear plantilla PDF
   */
  async crear({ request, response }: HttpContext) {
    try {
      const schema = vine.object({
        nombre: vine.string().trim().minLength(3).maxLength(100),
        contenido_html: vine.string().minLength(10),
        activa: vine.boolean().optional(),
        descripcion: vine.string().trim().optional(),
      })

      const data = await vine.validate({ schema, data: request.all() })

      // Verificar nombre único
      const existe = await PlantillaPdf.findBy('nombre', data.nombre)
      if (existe) {
        return response.status(400).json({
          success: false,
          message: 'Ya existe una plantilla con este nombre',
        })
      }

      // Desactivar otras plantillas si esta se marca como activa
      if (data.activa) {
        await PlantillaPdf.query().update({ activa: false })
      }

      const plantilla = await PlantillaPdf.create({
        nombre: data.nombre,
        contenidoHtml: data.contenido_html,
        activa: data.activa !== undefined ? data.activa : true,
        descripcion: data.descripcion,
        variablesDisponibles: [
          { nombre: 'cotizacion', tipo: 'object', descripcion: 'Datos de la cotización' },
          { nombre: 'cliente', tipo: 'object', descripcion: 'Información del cliente' },
          { nombre: 'evento', tipo: 'object', descripcion: 'Detalles del evento' },
          { nombre: 'detalles', tipo: 'array', descripcion: 'Líneas de servicios' },
          { nombre: 'totales', tipo: 'object', descripcion: 'Totales y subtotales' },
          { nombre: 'pago', tipo: 'object', descripcion: 'Información de pago' },
          { nombre: 'empresa', tipo: 'object', descripcion: 'Datos de la empresa' },
          { nombre: 'notas', tipo: 'object', descripcion: 'Notas y avisos' },
        ],
      })

      return response.status(201).json({
        success: true,
        message: 'Plantilla creada exitosamente',
        data: plantilla,
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: 'Error al crear la plantilla',
        error: error.message,
      })
    }
  }

  /**
   * Actualizar plantilla
   */
  async actualizar({ params, request, response }: HttpContext) {
    try {
      const schema = vine.object({
        nombre: vine.string().trim().minLength(3).maxLength(100).optional(),
        contenido_html: vine.string().minLength(10).optional(),
        activa: vine.boolean().optional(),
        descripcion: vine.string().trim().optional(),
      })

      const data = await vine.validate({ schema, data: request.all() })

      const plantilla = await PlantillaPdf.findOrFail(params.id)

      if (data.nombre) {
        // Verificar nombre único (excepto la propia plantilla)
        const existe = await PlantillaPdf.query()
          .where('nombre', data.nombre)
          .where('id', '!=', plantilla.id)
          .first()

        if (existe) {
          return response.status(400).json({
            success: false,
            message: 'Ya existe otra plantilla con este nombre',
          })
        }

        plantilla.nombre = data.nombre
      }

      if (data.contenido_html) plantilla.contenidoHtml = data.contenido_html
      if (data.descripcion !== undefined) plantilla.descripcion = data.descripcion

      // Desactivar otras si esta se marca como activa
      if (data.activa) {
        await PlantillaPdf.query().where('id', '!=', plantilla.id).update({ activa: false })
        plantilla.activa = true
      } else if (data.activa === false) {
        plantilla.activa = false
      }

      await plantilla.save()

      return response.json({
        success: true,
        message: 'Plantilla actualizada exitosamente',
        data: plantilla,
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: 'Error al actualizar la plantilla',
        error: error.message,
      })
    }
  }

  /**
   * Eliminar plantilla
   */
  async eliminar({ params, response }: HttpContext) {
    try {
      const plantilla = await PlantillaPdf.findOrFail(params.id)

      if (plantilla.activa) {
        return response.status(400).json({
          success: false,
          message: 'No se puede eliminar la plantilla activa. Activa otra primero.',
        })
      }

      await plantilla.delete()

      return response.json({
        success: true,
        message: 'Plantilla eliminada exitosamente',
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: 'Error al eliminar la plantilla',
        error: error.message,
      })
    }
  }

  /**
   * Activar una plantilla
   */
  async activar({ params, response }: HttpContext) {
    try {
      const plantilla = await PlantillaPdf.findOrFail(params.id)

      // Desactivar todas las demás
      await PlantillaPdf.query().update({ activa: false })

      plantilla.activa = true
      await plantilla.save()

      return response.json({
        success: true,
        message: 'Plantilla activada exitosamente',
        data: plantilla,
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: 'Error al activar la plantilla',
        error: error.message,
      })
    }
  }
}
