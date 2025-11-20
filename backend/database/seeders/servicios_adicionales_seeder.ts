import { BaseSeeder } from '@adonisjs/lucid/seeders'
import ServicioAdicional from '#models/servicio_adicional'

export default class ServiciosAdicionalesSeeder extends BaseSeeder {
  async run() {
    const servicios = [
      { nombre: 'Sillas', descripcion: 'Sillas adicionales', tipo_cliente: 'particular', precio: 50000, activo: true },
      { nombre: 'Mesas', descripcion: 'Mesas adicionales', tipo_cliente: 'particular', precio: 80000, activo: true },
      { nombre: 'Sonido', descripcion: 'Sistema de sonido profesional', tipo_cliente: 'particular', precio: 100000, activo: true },
      { nombre: 'Iluminación', descripcion: 'Sistema de iluminación decorativa', tipo_cliente: 'particular', precio: 60000, activo: true },
      { nombre: 'Proyector / Pantalla', descripcion: 'Proyector y pantalla de presentación', tipo_cliente: 'particular', precio: 100000, activo: true },
      { nombre: 'WiFi', descripcion: 'Acceso a internet WiFi', tipo_cliente: 'particular', precio: 30000, activo: true },
      { nombre: 'Catering', descripcion: 'Servicio de catering', tipo_cliente: 'particular', precio: 150000, activo: true },
      { nombre: 'Personal de apoyo', descripcion: 'Personal adicional para la organización', tipo_cliente: 'particular', precio: 100000, activo: true },
      { nombre: 'Estacionamiento', descripcion: 'Estacionamiento adicional', tipo_cliente: 'particular', precio: 20000, activo: true },
    ]

    for (const servicio of servicios) {
      await ServicioAdicional.create(servicio)
    }
  }
}
