/**
 * @openapi
 * /admin/socios:
 *   get:
 *     tags: [Admin - Socios]
 *     summary: Listar todos los socios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Lista de socios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       codigo:
 *                         type: string
 *                         description: Código único del socio (ej SOC-001)
 *                       nombre:
 *                         type: string
 *                       tipoDocumento:
 *                         type: string
 *                         enum: [CC, CE, TI, NIT]
 *                         description: Tipo de documento (Cédula Ciudadanía, Cédula Extranjería, Tarjeta Identidad, NIT)
 *                       numeroDocumento:
 *                         type: string
 *                         description: Número de documento (única combinación tipo+número)
 *                       email:
 *                         type: string
 *                       telefono:
 *                         type: string
 *                       activo:
 *                         type: boolean
 *       '401':
 *         description: No autenticado
 *       '403':
 *         description: No tienes permisos
 *   post:
 *     tags: [Admin - Socios]
 *     summary: Crear nuevo socio
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - codigo
 *               - nombre
 *               - numeroDocumento
 *             properties:
 *               codigo:
 *                 type: string
 *                 example: "SOC-006"
 *               nombre:
 *                 type: string
 *               tipoDocumento:
 *                 type: string
 *                 enum: [CC, CE, TI, NIT]
 *                 default: CC
 *                 description: Tipo de documento (default CC)
 *               numeroDocumento:
 *                 type: string
 *                 description: Número de documento único
 *               email:
 *                 type: string
 *                 format: email
 *               telefono:
 *                 type: string
 *               observaciones:
 *                 type: string
 *               activo:
 *                 type: boolean
 *     responses:
 *       '201':
 *         description: Socio creado
 *       '400':
 *         description: Validación fallida
 *       '401':
 *         description: No autenticado
 *       '403':
 *         description: No tienes permisos
 *
 * /admin/socios/buscar-por-documento:
 *   get:
 *     tags: [Admin - Socios]
 *     summary: Buscar socio por número de documento
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: numeroDocumento
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Número de documento a buscar
 *       - name: tipoDocumento
 *         in: query
 *         schema:
 *           type: string
 *           enum: [CC, CE, TI, NIT]
 *           default: CC
 *         description: Tipo de documento (default CC)
 *     responses:
 *       '200':
 *         description: Socio encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       '404':
 *         description: Socio no encontrado
 *       '400':
 *         description: numeroDocumento es requerido
 *       '401':
 *         description: No autenticado
 *       '403':
 *         description: No tienes permisos
 *
 * /admin/socios/{id}:
 *   get:
 *     tags: [Admin - Socios]
 *     summary: Obtener detalle de socio
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Detalle del socio
 *       '404':
 *         description: Socio no encontrado
 *   put:
 *     tags: [Admin - Socios]
 *     summary: Actualizar socio
 *     security:
 *       - bearerAuth: []
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
 *             properties:
 *               codigo:
 *                 type: string
 *               nombre:
 *                 type: string
 *               tipoDocumento:
 *                 type: string
 *                 enum: [CC, CE, TI, NIT]
 *               numeroDocumento:
 *                 type: string
 *               email:
 *                 type: string
 *               telefono:
 *                 type: string
 *               observaciones:
 *                 type: string
 *               activo:
 *                 type: boolean
 *     responses:
 *       '200':
 *         description: Socio actualizado
 *       '404':
 *         description: Socio no encontrado
 *   delete:
 *     tags: [Admin - Socios]
 *     summary: Eliminar socio
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Socio eliminado
 *       '404':
 *         description: Socio no encontrado
 */
export const openapISociosPaths = {}
