import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'salon_posts'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('excerpt')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('excerpt').nullable()
    })
  }
}
