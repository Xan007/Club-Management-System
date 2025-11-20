import type { HttpContext } from '@adonisjs/core/http'
import Socio from '#models/socio'
import vine from '@vinejs/vine'

export default class SociosController {
  /**
   * Listar todos los socios
   */
  async index({ response }: HttpContext) {
    try {
      const socios = await Socio.all()
      return response.json({
        success: true,
        data: socios,
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Error al listar socios',
        error: error.message,
      })
    }
  }

  /**
   * Obtener detalle de un socio
   */
  async mostrar({ params, response }: HttpContext) {
    try {
      const socio = await Socio.find(params.id)
      if (!socio) {
        return response.status(404).json({
          success: false,
          message: 'Socio no encontrado',
        })
      }
      return response.json({
        success: true,
        data: socio,
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Error al obtener socio',
        error: error.message,
      })
    }
  }

  /**
   * Crear un nuevo socio
   */
  async crear({ request, response }: HttpContext) {
    try {
      const schema = vine.object({
        codigo: vine.string().trim().minLength(3).maxLength(50),
        nombre: vine.string().trim().minLength(3).maxLength(150),
        tipoDocumento: vine.enum(['CC', 'CE', 'TI', 'NIT']).optional(),
        numeroDocumento: vine.string().trim().minLength(5).maxLength(50),
        email: vine.string().email().optional(),
        telefono: vine.string().maxLength(20).optional(),
        observaciones: vine.string().optional(),
        activo: vine.boolean().optional(),
      })

      const payload = await vine.validate({ schema, data: request.all() })

      // Establecer tipo documento por defecto
      if (!payload.tipoDocumento) {
        payload.tipoDocumento = 'CC'
      }

      // Verificar que no exista otro socio con el mismo código
      const socioCodigoDuplicado = await Socio.findBy('codigo', payload.codigo)
      if (socioCodigoDuplicado) {
        return response.status(400).json({
          success: false,
          message: `Ya existe un socio con el código ${payload.codigo}`,
        })
      }

      // Verificar que no exista otro socio con el mismo documento
      const socioDocDuplicado = await Socio.findBy('numero_documento', payload.numeroDocumento)
      if (socioDocDuplicado) {
        return response.status(400).json({
          success: false,
          message: `Ya existe un socio con el documento ${payload.tipoDocumento}-${payload.numeroDocumento}`,
        })
      }

      const socio = await Socio.create(payload)
      return response.status(201).json({
        success: true,
        message: 'Socio creado exitosamente',
        data: socio,
      })
    } catch (error) {
      if (error.messages) {
        return response.status(400).json({
          success: false,
          message: 'Validación fallida',
          errors: error.messages,
        })
      }
      return response.status(500).json({
        success: false,
        message: 'Error al crear socio',
        error: error.message,
      })
    }
  }

  /**
   * Actualizar un socio
   */
  async actualizar({ params, request, response }: HttpContext) {
    try {
      const socio = await Socio.find(params.id)
      if (!socio) {
        return response.status(404).json({
          success: false,
          message: 'Socio no encontrado',
        })
      }

      const schema = vine.object({
        codigo: vine.string().trim().minLength(3).maxLength(50).optional(),
        nombre: vine.string().trim().minLength(3).maxLength(150).optional(),
        tipoDocumento: vine.enum(['CC', 'CE', 'TI', 'NIT']).optional(),
        numeroDocumento: vine.string().trim().minLength(5).maxLength(50).optional(),
        email: vine.string().email().optional(),
        telefono: vine.string().maxLength(20).optional(),
        observaciones: vine.string().optional(),
        activo: vine.boolean().optional(),
      })

      const payload = await vine.validate({ schema, data: request.all() })

      // Si se intenta cambiar el código, verificar que sea único
      if (payload.codigo && payload.codigo !== socio.codigo) {
        const socioExistente = await Socio.findBy('codigo', payload.codigo)
        if (socioExistente) {
          return response.status(400).json({
            success: false,
            message: `Ya existe un socio con el código ${payload.codigo}`,
          })
        }
      }

      // Si se intenta cambiar el documento, verificar que sea único
      if (payload.numeroDocumento && payload.numeroDocumento !== socio.numeroDocumento) {
        const socioDocExistente = await Socio.findBy('numero_documento', payload.numeroDocumento)
        if (socioDocExistente) {
          return response.status(400).json({
            success: false,
            message: `Ya existe un socio con el documento ${payload.tipoDocumento || socio.tipoDocumento}-${payload.numeroDocumento}`,
          })
        }
      }

      socio.merge(payload)
      await socio.save()

      return response.json({
        success: true,
        message: 'Socio actualizado exitosamente',
        data: socio,
      })
    } catch (error) {
      if (error.messages) {
        return response.status(400).json({
          success: false,
          message: 'Validación fallida',
          errors: error.messages,
        })
      }
      return response.status(500).json({
        success: false,
        message: 'Error al actualizar socio',
        error: error.message,
      })
    }
  }

  /**
   * Eliminar un socio
   */
  async eliminar({ params, response }: HttpContext) {
    try {
      const socio = await Socio.find(params.id)
      if (!socio) {
        return response.status(404).json({
          success: false,
          message: 'Socio no encontrado',
        })
      }

      await socio.delete()
      return response.json({
        success: true,
        message: 'Socio eliminado exitosamente',
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Error al eliminar socio',
        error: error.message,
      })
    }
  }

  /**
   * Buscar socio por documento (público - para cotizaciones)
   */
  async buscarPublico({ request, response }: HttpContext) {
    try {
      const { numeroDocumento } = request.only(['numeroDocumento']) as {
        numeroDocumento?: string
      }

      if (!numeroDocumento) {
        return response.status(400).json({
          success: false,
          message: 'numeroDocumento es requerido',
        })
      }

      const socio = await Socio.porDocumento(numeroDocumento)

      if (!socio) {
        return response.status(404).json({
          success: false,
          message: `Socio con documento ${numeroDocumento} no encontrado`,
        })
      }

      return response.json({
        success: true,
        data: {
          id: socio.id,
          codigo: socio.codigo,
          nombre: socio.nombre,
          tipoDocumento: socio.tipoDocumento,
          numeroDocumento: socio.numeroDocumento,
        },
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Error al buscar socio',
        error: error.message,
      })
    }
  }
}
