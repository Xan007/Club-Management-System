/**
 * @openapi
 * /api/socios/buscar:
 *   get:
 *     tags: [Socios]
 *     summary: Buscar socio por documento (sin autenticación)
 *     description: Permite buscar un socio utilizando su número de documento. Disponible para cotizaciones públicas.
 *     parameters:
 *       - name: numeroDocumento
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Número de documento a buscar
 *     responses:
 *       '200':
 *         description: Socio encontrado exitosamente
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
 *                     id:
 *                       type: integer
 *                     codigo:
 *                       type: string
 *                       example: "SOC-001"
 *                     nombre:
 *                       type: string
 *                     tipoDocumento:
 *                       type: string
 *                       enum: [CC, CE, TI, NIT]
 *                     numeroDocumento:
 *                       type: string
 *       '404':
 *         description: Socio no encontrado
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
 *       '400':
 *         description: numeroDocumento es requerido
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
 *       '500':
 *         description: Error interno del servidor
 */
export const openapISociosPublicPaths = {}
