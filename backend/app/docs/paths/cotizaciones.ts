/**
 * @openapi
 * /api/cotizaciones:
 *   post:
 *     tags: [Cotizaciones]
 *     summary: Crear nueva cotización
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - espacioId
 *               - configuracionEspacioId
 *               - fecha
 *               - horaInicio
 *               - duracion
 *               - tipoEvento
 *               - asistentes
 *               - tipoCliente
 *               - nombre
 *               - email
 *             properties:
 *               espacioId:
 *                 type: integer
 *               configuracionEspacioId:
 *                 type: integer
 *               fecha:
 *                 type: string
 *                 format: date
 *                 example: "2025-12-05"
 *               horaInicio:
 *                 type: string
 *                 example: "10:00"
 *               duracion:
 *                 type: integer
 *                 minimum: 4
 *                 maximum: 8
 *               tipoEvento:
 *                 type: string
 *                 enum: [social, empresarial, capacitacion]
 *               asistentes:
 *                 type: integer
 *                 minimum: 1
 *               tipoCliente:
 *                 type: string
 *                 enum: [socio, particular]
 *               codigoSocio:
 *                 type: string
 *                 description: Código del socio (requerido si tipoCliente es 'socio')
 *               servicios:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: IDs de servicios adicionales
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               telefono:
 *                 type: string
 *               observaciones:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Cotización creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     cotizacion:
 *                       type: object
 *                     detalles:
 *                       type: array
 *                     total:
 *                       type: number
 *                     montoAbono:
 *                       type: number
 *       '400':
 *         description: Validación fallida
 *       '500':
 *         description: Error al crear cotización
 *   get:
 *     tags: [Cotizaciones]
 *     summary: Listar cotizaciones con filtros
 *     parameters:
 *       - name: estado
 *         in: query
 *         schema:
 *           type: string
 *           enum: [pendiente, aceptada, rechazada, vencida]
 *       - name: email
 *         in: query
 *         schema:
 *           type: string
 *       - name: fecha_desde
 *         in: query
 *         schema:
 *           type: string
 *           format: date
 *       - name: fecha_hasta
 *         in: query
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       '200':
 *         description: Lista de cotizaciones
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *
 * /api/cotizaciones/{id}:
 *   get:
 *     tags: [Cotizaciones]
 *     summary: Obtener detalle de cotización
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Detalle de la cotización
 *       '404':
 *         description: Cotización no encontrada
 *   put:
 *     tags: [Cotizaciones]
 *     summary: Editar/Actualizar cotización pendiente
 *     description: |
 *       Permite editar una cotización que aún está en estado "pendiente".
 *       El gerente puede ajustar detalles después de hablar con el cliente.
 *       Si se cambian datos del evento (fecha, hora, espacio, etc), se recalcula automáticamente el precio.
 *       No se pueden editar cotizaciones ya cerradas/aceptadas.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               espacioId:
 *                 type: integer
 *               configuracionEspacioId:
 *                 type: integer
 *               fecha:
 *                 type: string
 *                 format: date
 *               horaInicio:
 *                 type: string
 *                 example: "14:00"
 *               duracion:
 *                 type: integer
 *               tipoEvento:
 *                 type: string
 *                 enum: [social, empresarial, capacitacion]
 *               asistentes:
 *                 type: integer
 *               servicios:
 *                 type: array
 *                 items:
 *                   type: integer
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               telefono:
 *                 type: string
 *               observaciones:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Cotización actualizada exitosamente
 *       '400':
 *         description: No se puede editar una cotización cerrada
 *       '404':
 *         description: Cotización no encontrada
 *
 * /api/cotizaciones/{id}/cerrar:
 *   post:
 *     tags: [Cotizaciones]
 *     summary: Cerrar cotización y convertir en reserva (PRINCIPAL)
 *     description: |
 *       **ESTE ES EL ENDPOINT PRINCIPAL PARA CERRAR COTIZACIONES**
 *       
 *       Cierra la cotización cuando el gerente confirma el pago del abono o pago completo.
 *       Este endpoint:
 *       - Cambia el estado de la cotización a "aceptada" (cerrada)
 *       - Registra el monto pagado (abono 50% o pago completo 100%)
 *       - Actualiza el estado de pago ("abonado" o "pagado")
 *       - Crea un bloqueo en el calendario (tipo "reserva_confirmada")
 *       - **CANCELA AUTOMÁTICAMENTE** todas las cotizaciones pendientes que se crucen con esta reserva
 *       
 *       **Flujo:**
 *       1. Cliente dice "Ok, me parece bien"
 *       2. Gerente le indica que debe hacer el pago de abono (50%)
 *       3. Cliente realiza transferencia/pago
 *       4. Gerente confirma recepción del pago
 *       5. Gerente llama a este endpoint con el monto y estado de pago
 *       6. Sistema cierra la cotización y cancela conflictos automáticamente
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la cotización a cerrar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - estadoPago
 *             properties:
 *               estadoPago:
 *                 type: string
 *                 enum: [abonado, pagado]
 *                 description: |
 *                   - "abonado": Cliente pagó el 50% (abono)
 *                   - "pagado": Cliente pagó el 100% (pago completo). Automáticamente implica que también está abonado.
 *               montoPago:
 *                 type: number
 *                 description: |
 *                   Monto pagado en COP (OPCIONAL).
 *                   Si no se proporciona:
 *                   - estadoPago "abonado" → asume 50% del total
 *                   - estadoPago "pagado" → asume 100% del total
 *                 example: 425000
 *           examples:
 *             abonoDelCincuentaPorCiento:
 *               summary: Cerrar con abono del 50% (monto explícito)
 *               value:
 *                 estadoPago: "abonado"
 *                 montoPago: 425000
 *             abonoAutomatico:
 *               summary: Cerrar como abonado (asume 50% automáticamente)
 *               value:
 *                 estadoPago: "abonado"
 *             pagoCompleto:
 *               summary: Cerrar con pago completo (monto explícito)
 *               value:
 *                 estadoPago: "pagado"
 *                 montoPago: 850000
 *             pagoAutomatico:
 *               summary: Cerrar como pagado (asume 100% automáticamente)
 *               value:
 *                 estadoPago: "pagado"
 *     responses:
 *       '200':
 *         description: Cotización cerrada exitosamente y conflictos cancelados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Cotización cerrada exitosamente como reserva. 2 cotización(es) conflictivas canceladas."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     numero:
 *                       type: string
 *                     estado:
 *                       type: string
 *                       example: "Aceptada"
 *                     estadoPago:
 *                       type: string
 *                       example: "Abonado"
 *                     montoPagado:
 *                       type: number
 *                     fechaConfirmacion:
 *                       type: string
 *                       format: date-time
 *                     cotizacionesCanceladas:
 *                       type: integer
 *                       description: Cantidad de cotizaciones conflictivas canceladas automáticamente
 *       '400':
 *         description: Error de validación o monto insuficiente
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
 *                   example: "Para cerrar como 'abonado' debe pagar mínimo el 50% ($425,000)"
 *       '404':
 *         description: Cotización no encontrada
 *
 * /api/cotizaciones/{id}/rechazar:
 *   post:
 *     tags: [Cotizaciones]
 *     summary: Rechazar cotización manualmente (gerente)
 *     description: |
 *       Permite al gerente rechazar una cotización pendiente.
 *       El sistema:
 *       - Cambia el estado a "rechazada"
 *       - Envía email de notificación al cliente informando el rechazo
 *       - Registra el motivo en las observaciones
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la cotización a rechazar
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               motivo:
 *                 type: string
 *                 description: Razón del rechazo (opcional)
 *                 example: "Fecha no disponible por mantenimiento del salón"
 *     responses:
 *       '200':
 *         description: Cotización rechazada y cliente notificado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Cotización rechazada. Se ha notificado al cliente por correo."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     numero:
 *                       type: string
 *                     estado:
 *                       type: string
 *                       example: "Rechazada"
 *       '400':
 *         description: Solo se pueden rechazar cotizaciones pendientes
 *       '404':
 *         description: Cotización no encontrada
 *
 * /api/cotizaciones/{id}/registrar-pago:
 *   post:
 *     tags: [Cotizaciones]
 *     summary: Registrar pago adicional (después de cerrar)
 *     description: |
 *       Registra pagos adicionales después de cerrar la cotización.
 *       Útil cuando se cerró con abono del 50% y el cliente paga el saldo restante.
 *       Solo funciona en cotizaciones ya cerradas (estado "aceptada").
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - monto
 *             properties:
 *               monto:
 *                 type: number
 *                 description: Monto adicional a registrar
 *                 example: 425000
 *               metodoPago:
 *                 type: string
 *                 description: Método de pago utilizado
 *                 example: "efectivo"
 *               observaciones:
 *                 type: string
 *                 description: Notas adicionales sobre el pago
 *                 example: "Saldo final pagado antes del evento"
 *     responses:
 *       '200':
 *         description: Pago registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     estadoPago:
 *                       type: string
 *                     montoPagado:
 *                       type: number
 *                     valorTotal:
 *                       type: number
 *       '400':
 *         description: Error de validación o cotización no cerrada
 *       '404':
 *         description: Cotización no encontrada
 *
 * /api/cotizaciones/{id}/pdf:
 *   get:
 *     tags: [Cotizaciones]
 *     summary: Descargar cotización en PDF
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: PDF generado
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       '404':
 *         description: Cotización no encontrada
 *       '500':
 *         description: Error al generar PDF
 *
 * /api/cotizaciones/{id}/enviar-correo:
 *   post:
 *     tags: [Cotizaciones]
 *     summary: Enviar correos de notificación de una cotización (prueba)
 *     description: Envía los correos de notificación al cliente y al gerente para una cotización existente. Útil para reenviar o probar el sistema de emails.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la cotización
 *     responses:
 *       '200':
 *         description: Correos enviados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     clienteEnviado:
 *                       type: boolean
 *                       description: Si el correo al cliente fue enviado
 *                     gerenteEnviado:
 *                       type: boolean
 *                       description: Si el correo al gerente fue enviado
 *                     errores:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Lista de errores si los hubo
 *       '404':
 *         description: Cotización no encontrada
 *       '500':
 *         description: Error al enviar correos
 */
export const openapicotizacionesPaths = {}
