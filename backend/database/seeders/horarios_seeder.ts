import { BaseSeeder } from '@adonisjs/lucid/seeders'
import HorarioOperacion from '#models/horario_operacion'

export default class HorariosSeeder extends BaseSeeder {
  async run() {
    // Verificar si ya existen horarios
    const count = await HorarioOperacion.query().count('* as total')
    if ((count[0] as any).total > 0) {
      console.log('Horarios ya existen, omitiendo seed')
      return
    }

    const horarios = [
      {
        dia_semana: 0,
        esta_activo: false,
        hora_inicio: '00:00:00',
        hora_fin: '00:00:00',
        nombre: 'Domingo (Cerrado)',
      },
      {
        dia_semana: 1,
        esta_activo: false,
        hora_inicio: '00:00:00',
        hora_fin: '00:00:00',
        nombre: 'Lunes (Mantenimiento)',
      },
      {
        dia_semana: 2,
        esta_activo: true,
        hora_inicio: '08:00:00',
        hora_fin: '22:00:00',
        nombre: 'Martes',
      },
      {
        dia_semana: 3,
        esta_activo: true,
        hora_inicio: '08:00:00',
        hora_fin: '22:00:00',
        nombre: 'Miércoles',
      },
      {
        dia_semana: 4,
        esta_activo: true,
        hora_inicio: '08:00:00',
        hora_fin: '22:00:00',
        nombre: 'Jueves',
      },
      {
        dia_semana: 5,
        esta_activo: true,
        hora_inicio: '08:00:00',
        hora_fin: '02:00:00', // hasta las 2 AM siguiente
        nombre: 'Viernes',
      },
      {
        dia_semana: 6,
        esta_activo: true,
        hora_inicio: '08:00:00',
        hora_fin: '02:00:00', // hasta las 2 AM siguiente
        nombre: 'Sábado',
      },
    ]

    for (const horario of horarios) {
      await HorarioOperacion.create({
        diaSemana: horario.dia_semana,
        estaActivo: horario.esta_activo,
        horaInicio: horario.hora_inicio,
        horaFin: horario.hora_fin,
      })
    }

    console.log('Horarios de operación creados exitosamente')
  }
}
