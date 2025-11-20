import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class HorarioOperacion extends BaseModel {
  public static table = 'horarios_operacion'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'dia_semana' })
  declare diaSemana: number // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  @column({ columnName: 'esta_activo' })
  declare estaActivo: boolean

  @column({ columnName: 'hora_inicio' })
  declare horaInicio: string // HH:mm:ss

  @column({ columnName: 'hora_fin' })
  declare horaFin: string // HH:mm:ss

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /**
   * Obtener nombre del día de la semana
   */
  get nombreDia(): string {
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    return dias[this.diaSemana]
  }
}
