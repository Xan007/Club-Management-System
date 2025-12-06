import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Espacio from '#models/espacio'

export default class SalonPost extends BaseModel {
  public static table = 'salon_posts'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare espacioId: number | null

  @column()
  declare titulo: string

  @column()
  declare slug: string

  @column()
  declare content: string

  @column()
  declare mainImageUrl: string | null

  @column({
    columnName: 'imagenes',
    prepare: (value: any) => (value ? JSON.stringify(value) : null),
    consume: (value: any) => {
      if (!value) return null
      // PostgreSQL JSONB ya viene como objeto, no como string
      if (typeof value === 'object') return value
      // Si por alguna razón viene como string, parsearlo
      try {
        return JSON.parse(value)
      } catch {
        return null
      }
    },
  })
  declare imagenes: Array<{ url: string; alt?: string }> | null

  @column()
  declare publicado: boolean

  @column.dateTime()
  declare publishedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Espacio, {
    foreignKey: 'espacioId',
  })
  declare espacio: BelongsTo<typeof Espacio>
}
