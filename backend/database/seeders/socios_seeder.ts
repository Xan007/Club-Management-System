import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Socio from '#models/socio'

export default class extends BaseSeeder {
  async run() {
    // Verificar si ya existen socios
    const count = await Socio.query().count('* as total').first()
    if (count && count.$extras.total > 0) {
      console.log('Socios ya seeded, saltando...')
      return
    }

    await Socio.createMany([
      {
        codigo: 'SOC-001',
        nombre: 'Juan Pérez García',
        tipoDocumento: 'CC',
        numeroDocumento: '1234567890',
        email: 'juan@example.com',
        telefono: '+573001234567',
        observaciones: 'Socio fundador',
        activo: true,
      },
      {
        codigo: 'SOC-002',
        nombre: 'María López Rodríguez',
        tipoDocumento: 'CC',
        numeroDocumento: '9876543210',
        email: 'maria@example.com',
        telefono: '+573009876543',
        observaciones: 'Socio corporativo premium',
        activo: true,
      },
      {
        codigo: 'SOC-003',
        nombre: 'Carlos Gómez Martínez',
        tipoDocumento: 'CE',
        numeroDocumento: '5555555555',
        email: 'carlos@example.com',
        telefono: '+573005554444',
        observaciones: 'Socio extranjero',
        activo: true,
      },
      {
        codigo: 'SOC-004',
        nombre: 'Ana Fernández López',
        tipoDocumento: 'NIT',
        numeroDocumento: '800123456789',
        email: 'ana@example.com',
        telefono: '+573003332222',
        observaciones: 'Socio corporativo',
        activo: true,
      },
      {
        codigo: 'SOC-005',
        nombre: 'Roberto Sánchez Silva',
        tipoDocumento: 'TI',
        numeroDocumento: '4444444444',
        email: 'roberto@example.com',
        telefono: '+573007778888',
        observaciones: 'Socio joven',
        activo: true,
      },
    ])

    console.log('✅ Socios seeded exitosamente con documentos')
  }
}
