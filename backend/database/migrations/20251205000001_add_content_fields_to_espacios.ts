import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'espacios'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Slug único para URLs
      table.string('slug', 100).nullable().unique()
      
      // Información de presentación
      table.string('subtitulo', 255).nullable()
      table.text('descripcion_completa').nullable()
      
      // Capacidad
      table.integer('capacidad_minima').nullable()
      table.integer('capacidad_maxima').nullable()
      
      // Dimensiones
      table.decimal('area_m2', 8, 2).nullable() // Área en metros cuadrados
      
      // Horario y precio
      table.string('horario_disponible', 255).nullable()
      table.string('precio_desde', 100).nullable() // String para flexibilidad (ej: "Desde $1,000,000")
      
      // Características y servicios (JSON)
      table.jsonb('caracteristicas').nullable() // Array de strings
      table.jsonb('servicios_incluidos').nullable() // Array de strings
      table.jsonb('imagenes').nullable() // Array de objetos: [{url, alt, esPortada}]
      
      // Destacado
      table.boolean('destacado').defaultTo(false)
      
      // Fecha de última actualización de contenido
      table.timestamp('contenido_actualizado_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('slug')
      table.dropColumn('subtitulo')
      table.dropColumn('descripcion_completa')
      table.dropColumn('capacidad_minima')
      table.dropColumn('capacidad_maxima')
      table.dropColumn('area_m2')
      table.dropColumn('horario_disponible')
      table.dropColumn('precio_desde')
      table.dropColumn('caracteristicas')
      table.dropColumn('servicios_incluidos')
      table.dropColumn('imagenes')
      table.dropColumn('destacado')
      table.dropColumn('contenido_actualizado_at')
    })
  }
}
