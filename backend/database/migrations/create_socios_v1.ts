import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'socios'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('codigo', 50).unique().notNullable() // Código único del socio (ej: SOC-001)
      table.string('nombre', 150).notNullable()
      table.string('email', 100).nullable()
      table.string('telefono', 20).nullable()
      table.decimal('descuento_porcentaje', 5, 2).defaultTo(0) // % de descuento (ej: 15.50)
      table.text('observaciones').nullable()
      table.boolean('activo').defaultTo(true)
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
