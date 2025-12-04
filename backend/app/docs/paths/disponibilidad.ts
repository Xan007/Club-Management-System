/**
 * @openapi
 * /api/disponibilidad/horas:
 *   get:
 *     tags: [Disponibilidad]
 *     summary: Obtener horas disponibles para un espacio en una fecha
 *     description: |
 *       Retorna los slots de 1 hora disponibles para reservar en un espacio específico y fecha.
 *       Este endpoint:
 *       - Consulta el horario de operación del día de la semana
 *       - Genera slots de 1 hora dentro del horario
 *       - Filtra horas bloqueadas en el calendario (reservas confirmadas, mantenimiento)
 *       - Retorna solo horas realmente disponibles
 *     parameters:
 *       - name: espacioId
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del espacio (salón) a consultar
 *         example: 1
 *       - name: fecha
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha en formato YYYY-MM-DD
 *         example: "2025-12-15"
 *     responses:
 *       '200':
 *         description: Horas disponibles obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     fecha:
 *                       type: string
 *                       format: date
 *                       example: "2025-12-15"
 *                     espacioId:
 *                       type: integer
 *                       example: 1
 *                     horarioOperacion:
 *                       type: object
 *                       properties:
 *                         horaInicio:
 *                           type: string
 *                           example: "08:00"
 *                         horaFin:
 *                           type: string
 *                           example: "22:00"
 *                         diaSemana:
 *                           type: string
 *                           example: "Viernes"
 *                     horasDisponibles:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Array de horas disponibles en formato HH:mm
 *                       example: ["08:00", "09:00", "10:00", "14:00", "15:00"]
 *                     totalSlots:
 *                       type: integer
 *                       description: Total de slots de 1 hora en el horario de operación
 *                       example: 14
 *                     slotsDisponibles:
 *                       type: integer
 *                       description: Cantidad de slots disponibles (no bloqueados)
 *                       example: 5
 *             examples:
 *               diaConDisponibilidad:
 *                 summary: Día con horas disponibles
 *                 value:
 *                   success: true
 *                   data:
 *                     fecha: "2025-12-15"
 *                     espacioId: 1
 *                     horarioOperacion:
 *                       horaInicio: "08:00"
 *                       horaFin: "22:00"
 *                       diaSemana: "Viernes"
 *                     horasDisponibles: ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"]
 *                     totalSlots: 14
 *                     slotsDisponibles: 14
 *               diaConReservas:
 *                 summary: Día con algunas horas bloqueadas
 *                 value:
 *                   success: true
 *                   data:
 *                     fecha: "2025-12-20"
 *                     espacioId: 1
 *                     horarioOperacion:
 *                       horaInicio: "08:00"
 *                       horaFin: "22:00"
 *                       diaSemana: "Miércoles"
 *                     horasDisponibles: ["08:00", "09:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"]
 *                     totalSlots: 14
 *                     slotsDisponibles: 8
 *               clubCerrado:
 *                 summary: Día que el club está cerrado
 *                 value:
 *                   success: true
 *                   data:
 *                     fecha: "2025-12-21"
 *                     horasDisponibles: []
 *                     mensaje: "El club no opera este día de la semana"
 *       '400':
 *         description: Parámetros faltantes o inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Parámetros requeridos: espacioId, fecha"
 *       '500':
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error al obtener horas disponibles"
 *                 error:
 *                   type: string
 */
export const openapiDisponibilidadPaths = {}
