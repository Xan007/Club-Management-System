import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export interface VariablePDF {
  nombre: string
  descripcion: string
  tipo: string // 'string', 'number', 'date', 'array', 'object'
}

export default class PlantillaPdf extends BaseModel {
  public static table = 'plantillas_pdf'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nombre: string

  @column({ columnName: 'contenido_html' })
  declare contenidoHtml: string

  @column()
  declare activa: boolean

  @column({ columnName: 'variables_disponibles', consume: (value) => (value ? JSON.parse(value) : []) })
  declare variablesDisponibles: VariablePDF[]

  @column()
  declare descripcion: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /**
   * Interpolar variables en la plantilla HTML
   */
  interpolarVariables(variables: Record<string, any>): string {
    let html = this.contenidoHtml

    // Reemplazar variables de la forma {{variable}} o {{variable.subpropiedad}}
    const regex = /\{\{(\w+(?:\.\w+)*)\}\}/g
    html = html.replace(regex, (match, path) => {
      const value = this.getValueByPath(variables, path)
      return value !== undefined ? String(value) : match
    })

    return html
  }

  /**
   * Obtener valor de un objeto por ruta (ej: cliente.nombre)
   */
  private getValueByPath(obj: Record<string, any>, path: string): any {
    return path.split('.').reduce((current, prop) => current?.[prop], obj)
  }
}
