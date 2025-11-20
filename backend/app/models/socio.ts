import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Socio extends BaseModel {
  public static tableName = 'socios'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare codigo: string

  @column()
  declare nombre: string

  @column()
  declare tipoDocumento: string // CC, CE, TI, NIT, etc. (CC por defecto)

  @column()
  declare numeroDocumento: string // Número de identificación única

  @column()
  declare email: string | null

  @column()
  declare telefono: string | null

  @column()
  declare observaciones: string | null

  @column()
  declare activo: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /**
   * Buscar socio por código
   */
  static async porCodigo(codigo: string) {
    return this.query().where('codigo', codigo).where('activo', true).first()
  }

  /**
   * Buscar socio por número de documento
   */
  static async porDocumento(numeroDocumento: string) {
    return this.query().where('numero_documento', numeroDocumento).where('activo', true).first()
  }

  /**
   * Obtener identificación completa (Ej: CC-123456789)
   */
  get identificacionCompleta() {
    return `${this.tipoDocumento}-${this.numeroDocumento}`
  }
}
